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
    if (abierto) throw new Error('El vehículo ' + placa + ' ya está dentro del campus (entró por ' + abierto.CasetaEntrada + ' el ' + abierto.FechaHoraEntrada + ').');

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
    if (!mov || mov.Estado !== 'DENTRO') throw new Error('No hay una entrada abierta para ese vehículo.');
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

/** Panel de "vehículos dentro" */
function vehiculosDentro() {
  return api_('consulta', () =>
    limpiar_(leerTodos_('MOVIMIENTOS').filter(m => m.Estado === 'DENTRO'))
      .sort((a, b) => String(b.FechaHoraEntrada).localeCompare(String(a.FechaHoraEntrada))));
}

/** Casetas activas para el selector del operador */
function listarCasetasActivas() {
  return api_('catalogo.leer', () =>
    limpiar_(leerTodos_('CASETAS').filter(c => String(c.Activa).toUpperCase() !== 'FALSE')));
}

function movimientoAbierto_(placa) {
  return leerTodos_('MOVIMIENTOS').find(m => m.Placa === placa && m.Estado === 'DENTRO') || null;
}

function casetaActiva_(id) {
  const c = buscarPorId_('CASETAS', id);
  if (!c) throw new Error('Seleccione una caseta válida.');
  if (String(c.Activa).toUpperCase() === 'FALSE') throw new Error('La caseta ' + c.Nombre + ' está inactiva.');
  return c;
}
