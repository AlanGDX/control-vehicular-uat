/**
 * Catalogos.gs — CRUD genérico de empleados, estudiantes, visitantes, vehículos y casetas.
 */

const REGEX_PLACA = /^[A-Z0-9]{5,8}$/;
const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Normaliza placa: mayúsculas, sin espacios ni guiones. "abc-12 3" -> "ABC123" */
function normalizarPlaca(placa) {
  return String(placa || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function validarRequeridos_(clave, d) {
  (REQUERIDOS[clave] || []).forEach(c => {
    if (d[c] === undefined || d[c] === null || String(d[c]).trim() === '') {
      throw new Error('El campo "' + c + '" es obligatorio.');
    }
  });
}

function claveCatalogo_(catalogo) {
  const clave = CATALOGOS[String(catalogo).toLowerCase()];
  if (!clave) throw new Error('Catálogo inválido: ' + catalogo);
  return clave;
}

/** Validaciones específicas por catálogo */
function validarCatalogo_(clave, d) {
  validarRequeridos_(clave, d);
  Object.keys(d).forEach(k => { if (typeof d[k] === 'string') d[k] = d[k].trim(); });
  if (d.Correo && !REGEX_CORREO.test(d.Correo)) throw new Error('Correo con formato inválido.');
  if (d.Telefono && !/^\d{10}$/.test(String(d.Telefono).replace(/\D/g, ''))) throw new Error('El teléfono debe tener 10 dígitos.');

  const existentes = leerTodos_(clave).filter(x => x.ID !== d.ID);
  const unico = (campo, etiqueta) => {
    if (d[campo] && existentes.some(x => String(x[campo]).toUpperCase() === String(d[campo]).toUpperCase()))
      throw new Error('Ya existe un registro con ' + etiqueta + ' ' + d[campo] + '.');
  };

  switch (clave) {
    case 'EMPLEADOS':
      if (['Docente', 'Administrativo'].indexOf(d.Tipo) === -1) throw new Error('Tipo de empleado debe ser Docente o Administrativo.');
      unico('NumEmpleado', 'número de empleado');
      break;
    case 'ESTUDIANTES':
      unico('Matricula', 'matrícula');
      break;
    case 'VEHICULOS':
      d.Placa = normalizarPlaca(d.Placa);
      if (!REGEX_PLACA.test(d.Placa)) throw new Error('Placa inválida (5 a 8 caracteres alfanuméricos).');
      if (TIPOS_USUARIO.indexOf(d.TipoTitular) === -1) throw new Error('Tipo de titular inválido.');
      unico('Placa', 'placa');
      d.TitularNombre = resolverTitular_(d.TipoTitular, d.TitularID);
      break;
    case 'CASETAS':
      unico('Nombre', 'nombre');
      break;
  }
}

/** Valida que el titular exista en su catálogo y devuelve su nombre (relación vehículo-titular) */
function resolverTitular_(tipo, titularId) {
  if (!titularId) {
    if (tipo === 'Visitante') return '';
    throw new Error('Debe indicar el titular del vehículo.');
  }
  const mapa = { Estudiante: 'ESTUDIANTES', Docente: 'EMPLEADOS', Administrativo: 'EMPLEADOS', Visitante: 'VISITANTES' };
  const t = buscarPorId_(mapa[tipo], titularId);
  if (!t) throw new Error('El titular indicado no existe en el catálogo de ' + tipo + '.');
  if ((tipo === 'Docente' || tipo === 'Administrativo') && t.Tipo !== tipo)
    throw new Error('El empleado está registrado como ' + t.Tipo + ', no como ' + tipo + '.');
  return t.Nombre;
}

/* ============================ API pública ============================ */

function listarCatalogo(catalogo, texto) {
  return api_('catalogo.leer', () => {
    let rows = leerTodos_(claveCatalogo_(catalogo));
    if (texto) {
      const t = String(texto).toLowerCase();
      rows = rows.filter(r => Object.values(r).some(v => String(v).toLowerCase().indexOf(t) !== -1));
    }
    return limpiar_(rows);
  });
}

function guardarCatalogo(catalogo, datos) {
  const clave = claveCatalogo_(catalogo);
  const permiso = clave === 'VEHICULOS' || clave === 'VISITANTES' ? 'vehiculo.escribir' : 'catalogo.escribir';
  return api_(permiso, (u) => conBloqueo_(() => {
    validarCatalogo_(clave, datos);
    let r;
    if (datos.ID) {
      r = actualizar_(clave, datos.ID, datos);
      registrarBitacora_(u.Correo, u.Rol, 'EDITAR', catalogo, r.ID);
    } else {
      if (HOJAS[clave].cols.indexOf('Activo') !== -1 && datos.Activo === undefined) datos.Activo = true;
      if (HOJAS[clave].cols.indexOf('Activa') !== -1 && datos.Activa === undefined) datos.Activa = true;
      if (HOJAS[clave].cols.indexOf('FechaAlta') !== -1) datos.FechaAlta = ahora_();
      if (HOJAS[clave].cols.indexOf('FechaRegistro') !== -1) datos.FechaRegistro = ahora_();
      r = insertar_(clave, datos);
      registrarBitacora_(u.Correo, u.Rol, 'ALTA', catalogo, r.ID);
    }
    return limpiar_(r);
  }));
}

function eliminarCatalogo(catalogo, id) {
  const clave = claveCatalogo_(catalogo);
  return api_('catalogo.escribir', (u) => conBloqueo_(() => {
    // Integridad referencial: no borrar titulares con vehículos, ni vehículos/casetas con movimientos
    if (['EMPLEADOS', 'ESTUDIANTES', 'VISITANTES'].indexOf(clave) !== -1 &&
        leerTodos_('VEHICULOS').some(v => v.TitularID === id))
      throw new Error('No se puede eliminar: tiene vehículos asociados. Desactívelo en su lugar.');
    if (clave === 'VEHICULOS' && leerTodos_('MOVIMIENTOS').some(m => m.VehiculoID === id))
      throw new Error('No se puede eliminar: el vehículo tiene movimientos. Desactívelo en su lugar.');
    if (clave === 'CASETAS' && leerTodos_('MOVIMIENTOS').some(m => m.CasetaEntradaID === id || m.CasetaSalidaID === id))
      throw new Error('No se puede eliminar: la caseta tiene movimientos. Desactívela en su lugar.');
    eliminar_(clave, id);
    registrarBitacora_(u.Correo, u.Rol, 'ELIMINAR', catalogo, id);
    return true;
  }));
}

/** Autocompletado de placas para el formulario de caseta */
function buscarVehiculoPorPlaca(placa) {
  return api_('catalogo.leer', () => {
    const p = normalizarPlaca(placa);
    if (p.length < 2) return [];
    return limpiar_(leerTodos_('VEHICULOS').filter(v => String(v.Placa).indexOf(p) === 0).slice(0, 10));
  });
}
