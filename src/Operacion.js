/**
 * Operacion.gs — Registro de entradas y salidas vehiculares.
 * Regla: un vehículo no puede entrar si ya está DENTRO; no puede salir si no tiene entrada abierta.
 */

/**
 * Registra una entrada.
 * @param {Object} d { placa, casetaId, tipoUsuario?, observaciones? }
 *  - Si la placa está en el catálogo, tipo y titular se toman de ahí.
 *  - Si no, se trata como Visitante (tipoUsuario obligatorio).
 */
function registrarEntrada(d) {
  return api_('operacion', (u) => conBloqueo_(() => {
    const placa = normalizarPlaca(d.placa);
    if (!REGEX_PLACA.test(placa)) throw new Error('Placa inválida.');
    const caseta = casetaActiva_(d.casetaId);

    const abierto = movimientoAbierto_(placa);
    if (abierto) {
      // Entrada abierta del mismo día: probable doble registro -> error.
      // De otro día: la salida no se registró -> se cierra como SIN SALIDA y se continúa.
      if (String(abierto.FechaHoraEntrada).substring(0, 10) === ahora_().substring(0, 10)) {
        throw new Error('El vehículo ' + placa + ' ya está dentro del campus (entró por ' + abierto.CasetaEntrada + ' el ' + abierto.FechaHoraEntrada.replace('T', ' ') + '). Registre primero su salida.');
      }
      marcarSinSalida_(abierto, 'Cerrado al registrar nueva entrada');
      registrarBitacora_(u.Correo, u.Rol, 'SIN_SALIDA', 'Operacion', placa + ' (entrada del ' + abierto.FechaHoraEntrada + ')');
    }

    const veh = leerTodos_('VEHICULOS').find(v => v.Placa === placa);
    if (veh && String(veh.Activo).toUpperCase() === 'FALSE') throw new Error('El vehículo ' + placa + ' está dado de baja. Acceso no autorizado.');

    const tipo = veh ? veh.TipoTitular : (d.tipoUsuario || 'Visitante');
    if (TIPOS_USUARIO.indexOf(tipo) === -1) throw new Error('Tipo de usuario inválido.');

    const mov = insertar_('MOVIMIENTOS', {
      Placa: placa,
      VehiculoID: veh ? veh.ID : '',
      TipoUsuario: tipo,
      TitularNombre: veh ? veh.TitularNombre : (d.nombreVisitante || ''),
      CasetaEntradaID: caseta.ID,
      CasetaEntrada: caseta.Nombre,
      FechaHoraEntrada: ahora_(),
      OperadorEntrada: u.Correo,
      Estado: 'DENTRO',
      Observaciones: d.observaciones || (veh ? '' : 'Vehículo no registrado'),
    });
    registrarBitacora_(u.Correo, u.Rol, 'ENTRADA', 'Operacion', placa + ' @ ' + caseta.Nombre);
    return Object.assign(limpiar_(mov), { registrado: !!veh });
  }));
}

/**
 * Registra la salida (un clic). Acepta movimientoId o placa.
 * @param {Object} d { movimientoId?, placa?, casetaId }
 */
function registrarSalida(d) {
  return api_('operacion', (u) => conBloqueo_(() => {
    const caseta = casetaActiva_(d.casetaId);
    let mov = d.movimientoId ? buscarPorId_('MOVIMIENTOS', d.movimientoId) : movimientoAbierto_(normalizarPlaca(d.placa));
    if (!mov || mov.Estado !== ESTADOS.DENTRO || mov.FechaHoraSalida) {
      throw new Error(mov && mov.Estado === ESTADOS.SALIO
        ? 'El vehículo ' + mov.Placa + ' ya registró su salida (' + String(mov.FechaHoraSalida).replace('T', ' ') + ' por ' + mov.CasetaSalida + ').'
        : 'No hay una entrada abierta para ese vehículo.');
    }
    const r = actualizar_('MOVIMIENTOS', mov.ID, {
      CasetaSalidaID: caseta.ID,
      CasetaSalida: caseta.Nombre,
      FechaHoraSalida: ahora_(),
      OperadorSalida: u.Correo,
      Estado: 'SALIO',
    });
    registrarBitacora_(u.Correo, u.Rol, 'SALIDA', 'Operacion', mov.Placa + ' @ ' + caseta.Nombre);
    return r;
  }));
}

/**
 * Panel de "vehículos dentro".
 * Cada fila incluye horasDentro y alerta=true si supera CONFIG.HORAS_ALERTA_ESTANCIA
 * (posible salida no registrada). Las alertas van primero.
 * @param {string} casetaId opcional: solo los que entraron por esa caseta
 */
function vehiculosDentro(casetaId) {
  return api_('consulta', () => dentroConAlertas_(casetaId));
}

function dentroConAlertas_(casetaId) {
  const ahora = new Date(ahora_()).getTime();
  return limpiar_(leerTodos_('MOVIMIENTOS').filter(m =>
      m.Estado === ESTADOS.DENTRO && (!casetaId || m.CasetaEntradaID === casetaId)))
    .map(m => {
      const horas = (ahora - new Date(m.FechaHoraEntrada).getTime()) / 3600000;
      return Object.assign(m, {
        horasDentro: Math.round(horas * 10) / 10,
        alerta: horas >= CONFIG.HORAS_ALERTA_ESTANCIA,
      });
    })
    .sort((a, b) => (b.alerta - a.alerta) || String(b.FechaHoraEntrada).localeCompare(String(a.FechaHoraEntrada)));
}

/**
 * Cierre de turno: el operador revisa los vehículos que siguen dentro (de su caseta)
 * antes de entregar el turno. Queda registrado en la bitácora.
 * @param {Object} d { casetaId, observaciones? }
 * @return { caseta, pendientes:[...], totalPendientes, totalAlertas }
 */
function cierreTurno(d) {
  return api_('operacion', (u) => {
    const caseta = casetaActiva_(d.casetaId);
    const pendientes = dentroConAlertas_(caseta.ID);
    const alertas = pendientes.filter(p => p.alerta).length;
    registrarBitacora_(u.Correo, u.Rol, 'CIERRE_TURNO', 'Operacion',
      caseta.Nombre + ': ' + pendientes.length + ' dentro, ' + alertas + ' con alerta' +
      (d.observaciones ? '. Obs: ' + d.observaciones : ''));
    return { caseta: caseta.Nombre, pendientes: pendientes, totalPendientes: pendientes.length, totalAlertas: alertas };
  });
}

/* ========================= Cierre nocturno automático ========================= */

/**
 * Marca como SIN SALIDA todos los movimientos que siguen DENTRO.
 * Lo ejecuta el activador diario (como propietario) o el menú de la hoja.
 */
function cierreNocturno() {
  return conBloqueo_(() => {
    const abiertos = leerTodos_('MOVIMIENTOS').filter(m => m.Estado === ESTADOS.DENTRO);
    abiertos.forEach(m => marcarSinSalida_(m, 'Cerrado automáticamente (cierre nocturno)'));
    registrarBitacora_('SISTEMA', 'Automático', 'CIERRE_NOCTURNO', 'Operacion',
      abiertos.length + ' movimientos marcados como SIN SALIDA' +
      (abiertos.length ? ': ' + abiertos.map(m => m.Placa).join(', ') : ''));
    return abiertos.length;
  });
}

/** Crea (una sola vez) el activador diario del cierre nocturno. Ejecutar desde el menú o el editor. */
function instalarCierreNocturno() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'cierreNocturno')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('cierreNocturno').timeBased()
    .atHour(CONFIG.HORA_CIERRE_NOCTURNO).everyDays(1)
    .inTimezone(CONFIG.ZONA_HORARIA).create();
  const msg = 'Cierre nocturno activado: todos los días entre las ' + CONFIG.HORA_CIERRE_NOCTURNO + ':00 y ' + CONFIG.HORA_CIERRE_NOCTURNO + ':59.';
  try { SpreadsheetApp.getUi().alert(msg); } catch (e) { /* ejecutado desde el editor */ }
  return msg;
}

/** Cierra un movimiento abierto sin salida registrada (no llena FechaHoraSalida: no hubo salida real). */
function marcarSinSalida_(mov, motivo) {
  const obs = mov.Observaciones ? mov.Observaciones + ' | ' + motivo : motivo;
  return actualizar_('MOVIMIENTOS', mov.ID, { Estado: ESTADOS.SIN_SALIDA, Observaciones: obs });
}

/** Casetas activas para el selector del operador */
function listarCasetasActivas() {
  return api_('catalogo.leer', () =>
    limpiar_(leerTodos_('CASETAS').filter(c => String(c.Activa).toUpperCase() !== 'FALSE')));
}

function movimientoAbierto_(placa) {
  return leerTodos_('MOVIMIENTOS').find(m => m.Placa === placa && m.Estado === ESTADOS.DENTRO) || null;
}

function casetaActiva_(id) {
  const c = buscarPorId_('CASETAS', id);
  if (!c) throw new Error('Seleccione una caseta válida.');
  if (String(c.Activa).toUpperCase() === 'FALSE') throw new Error('La caseta ' + c.Nombre + ' está inactiva.');
  return c;
}
