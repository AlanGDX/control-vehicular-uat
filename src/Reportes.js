/**
 * Reportes.gs — Consultas filtradas, indicadores, estadísticas y exportación Excel/CSV/PDF.
 */

/**
 * Consulta de movimientos con filtros combinables.
 * @param {Object} f { placa?, desde?: 'yyyy-MM-dd', hasta?: 'yyyy-MM-dd', casetaId?, tipoUsuario?, estado? }
 */
function filtrarMovimientos_(f) {
  f = f || {};
  const placa = f.placa ? normalizarPlaca(f.placa) : '';
  return leerTodos_('MOVIMIENTOS').filter(m => {
    const fecha = String(m.FechaHoraEntrada).substring(0, 10);
    if (placa && String(m.Placa).indexOf(placa) === -1) return false;
    if (f.desde && fecha < f.desde) return false;
    if (f.hasta && fecha > f.hasta) return false;
    if (f.casetaId && m.CasetaEntradaID !== f.casetaId && m.CasetaSalidaID !== f.casetaId) return false;
    if (f.tipoUsuario && m.TipoUsuario !== f.tipoUsuario) return false;
    if (f.estado && m.Estado !== f.estado) return false;
    return true;
  }).sort((a, b) => String(b.FechaHoraEntrada).localeCompare(String(a.FechaHoraEntrada)));
}

function consultarMovimientos(filtros) {
  return api_('consulta', (u) => {
    const rows = filtrarMovimientos_(filtros);
    registrarBitacora_(u.Correo, u.Rol, 'CONSULTA', 'Consultas', filtros || {});
    return limpiar_(rows);
  });
}

/** Indicadores y datos para gráficas del dashboard */
function obtenerReporte(filtros) {
  return api_('reportes', () => {
    const rows = filtrarMovimientos_(filtros);
    const porHora = Array(24).fill(0);
    const porDia = {}, porCaseta = {}, porTipo = {}, porPlaca = {};
    const sinSalidaCaseta = {}, sinSalidaDia = {};
    let salidas = 0, minutosTotal = 0, sinSalida = 0;

    rows.forEach(m => {
      const fh = String(m.FechaHoraEntrada);
      porHora[parseInt(fh.substring(11, 13), 10) || 0]++;
      const dia = fh.substring(0, 10);
      porDia[dia] = (porDia[dia] || 0) + 1;
      porCaseta[m.CasetaEntrada] = (porCaseta[m.CasetaEntrada] || 0) + 1;
      porTipo[m.TipoUsuario] = (porTipo[m.TipoUsuario] || 0) + 1;
      if (!porPlaca[m.Placa]) porPlaca[m.Placa] = { placa: m.Placa, titular: m.TitularNombre, tipo: m.TipoUsuario, visitas: 0 };
      porPlaca[m.Placa].visitas++;
      if (m.Estado === 'SALIO' && m.FechaHoraSalida) {
        salidas++;
        minutosTotal += (new Date(m.FechaHoraSalida) - new Date(m.FechaHoraEntrada)) / 60000;
      }
      if (m.Estado === ESTADOS.SIN_SALIDA) {
        sinSalida++;
        // Se atribuye a la caseta de entrada: la salida pudo ocurrir por cualquiera
        sinSalidaCaseta[m.CasetaEntrada] = (sinSalidaCaseta[m.CasetaEntrada] || 0) + 1;
        sinSalidaDia[dia] = (sinSalidaDia[dia] || 0) + 1;
      }
    });
    const dentro = dentroConAlertas_();

    const horaPico = porHora.indexOf(Math.max.apply(null, porHora));
    return {
      kpis: {
        totalEntradas: rows.length,
        totalSalidas: salidas,
        dentroAhora: dentro.length,
        alertasEstancia: dentro.filter(m => m.alerta).length,
        vehiculosUnicos: Object.keys(porPlaca).length,
        horaPico: rows.length ? (('0' + horaPico).slice(-2) + ':00') : '-',
        estanciaPromedioMin: salidas ? Math.round(minutosTotal / salidas) : 0,
        salidasNoRegistradas: sinSalida,
        porcentajeSinSalida: rows.length ? Math.round(sinSalida * 1000 / rows.length) / 10 : 0,
      },
      sinSalidaPorCaseta: Object.keys(sinSalidaCaseta).map(k => ({ caseta: k, total: sinSalidaCaseta[k] })),
      sinSalidaPorDia: Object.keys(sinSalidaDia).sort().map(d => ({ dia: d, total: sinSalidaDia[d] })),
      porHora: porHora.map((v, h) => ({ hora: ('0' + h).slice(-2) + ':00', total: v })),
      porDia: Object.keys(porDia).sort().map(d => ({ dia: d, total: porDia[d] })),
      porCaseta: Object.keys(porCaseta).map(k => ({ caseta: k, total: porCaseta[k] })),
      porTipo: Object.keys(porTipo).map(k => ({ tipo: k, total: porTipo[k] })),
      masFrecuentes: Object.values(porPlaca).sort((a, b) => b.visitas - a.visitas).slice(0, 10),
    };
  });
}

/* ============================== Exportación ============================== */

const COLS_EXPORT = ['Placa', 'TipoUsuario', 'TitularNombre', 'CasetaEntrada', 'FechaHoraEntrada', 'CasetaSalida', 'FechaHoraSalida', 'Estado', 'Observaciones'];

/**
 * Exporta movimientos filtrados.
 * @param {Object} filtros  mismos filtros que consultarMovimientos
 * @param {string} formato  'xlsx' | 'pdf' | 'csv'
 * @return {ok, data:{nombre, mime, base64}}  El frontend lo descarga con un <a download>.
 */
function exportarMovimientos(filtros, formato) {
  return api_('reportes', (u) => {
    const rows = filtrarMovimientos_(filtros);
    const sello = Utilities.formatDate(new Date(), CONFIG.ZONA_HORARIA, 'yyyyMMdd_HHmm');
    const nombre = 'Movimientos_CUTM_Sur_' + sello;
    const tabla = [COLS_EXPORT].concat(rows.map(m => COLS_EXPORT.map(c => m[c])));
    let res;

    if (formato === 'csv') {
      const csv = tabla.map(f => f.map(v => '"' + String(v === undefined ? '' : v).replace(/"/g, '""') + '"').join(',')).join('\r\n');
      res = { nombre: nombre + '.csv', mime: 'text/csv', base64: Utilities.base64Encode('﻿' + csv, Utilities.Charset.UTF_8) };
    } else {
      res = exportarConHojaTemporal_(nombre, tabla, formato === 'pdf' ? 'pdf' : 'xlsx', filtros);
    }
    registrarBitacora_(u.Correo, u.Rol, 'EXPORTAR', 'Reportes', formato + ' (' + rows.length + ' filas)');
    return res;
  });
}

/** Crea un Spreadsheet temporal, lo exporta vía Drive y lo envía a la papelera. */
function exportarConHojaTemporal_(nombre, tabla, formato, filtros) {
  const tmp = SpreadsheetApp.create(nombre);
  try {
    const sh = tmp.getSheets()[0].setName('Movimientos');
    const titulo = [[CONFIG.NOMBRE_SISTEMA + ' — Reporte de movimientos'], ['Generado: ' + ahora_().replace('T', ' ') + '   Filtros: ' + JSON.stringify(filtros || {})], ['']];
    sh.getRange(1, 1, 3, 1).setValues(titulo);
    sh.getRange(1, 1).setFontSize(14).setFontWeight('bold');
    sh.getRange(4, 1, tabla.length, tabla[0].length).setValues(tabla);
    sh.getRange(4, 1, 1, tabla[0].length).setFontWeight('bold').setBackground('#0b3d91').setFontColor('#ffffff');
    sh.autoResizeColumns(1, tabla[0].length);
    SpreadsheetApp.flush();

    let url = 'https://docs.google.com/spreadsheets/d/' + tmp.getId() + '/export?format=' + formato;
    if (formato === 'pdf') url += '&portrait=false&size=letter&fitw=true&gridlines=false&sheetnames=false&printtitle=false';
    const resp = UrlFetchApp.fetch(url, { headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } });
    const mime = formato === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    return { nombre: nombre + '.' + formato, mime: mime, base64: Utilities.base64Encode(resp.getContent()) };
  } finally {
    DriveApp.getFileById(tmp.getId()).setTrashed(true);
  }
}
