/**
 * Auth.gs — Autenticación con cuentas institucionales, roles, gestión de usuarios y bitácora.
 *
 * El Web App se despliega como:
 *   Ejecutar como: "Yo (propietario)"
 *   Acceso: "Cualquier usuario del dominio uat.edu.mx" (o "Cualquier usuario con cuenta de Google")
 * Session.getActiveUser() devuelve el correo de quien accede.
 */

function correoActual_() {
  return (Session.getActiveUser().getEmail() || '').toLowerCase().trim();
}

function dominioValido_(correo) {
  const dom = correo.split('@')[1] || '';
  return CONFIG.DOMINIOS_PERMITIDOS.indexOf(dom) !== -1;
}

/** Devuelve el usuario autenticado o lanza error. */
function usuarioActual_() {
  const correo = correoActual_();
  if (!correo) throw new Error('No se pudo identificar la cuenta. Inicie sesión con su cuenta institucional.');
  if (!dominioValido_(correo)) throw new Error('Acceso denegado: ' + correo + ' no es una cuenta institucional.');
  const u = leerTodos_('USUARIOS').find(x => String(x.Correo).toLowerCase() === correo);
  if (!u) throw new Error('La cuenta ' + correo + ' no está registrada en el sistema. Contacte al administrador.');
  if (u.Activo !== true && String(u.Activo).toUpperCase() !== 'TRUE') throw new Error('Cuenta desactivada.');
  return u;
}

/** Verifica permiso y devuelve el usuario. Uso: const u = requiere_('operacion'); */
function requiere_(permiso) {
  const u = usuarioActual_();
  if ((PERMISOS[permiso] || []).indexOf(u.Rol) === -1) {
    registrarBitacora_(u.Correo, u.Rol, 'ACCESO_DENEGADO', permiso);
    throw new Error('Su rol (' + u.Rol + ') no tiene permiso para esta acción.');
  }
  return u;
}

/** API: login. Lo llama el frontend al cargar. */
function login() {
  try {
    const u = usuarioActual_();
    actualizar_('USUARIOS', u.ID, { UltimoAcceso: ahora_() });
    registrarBitacora_(u.Correo, u.Rol, 'LOGIN', 'Seguridad', 'Inicio de sesión');
    const permisos = Object.keys(PERMISOS).filter(p => PERMISOS[p].indexOf(u.Rol) !== -1);
    return ok_({ correo: u.Correo, nombre: u.Nombre, rol: u.Rol, caseta: u.CasetaAsignada, permisos: permisos });
  } catch (e) {
    registrarBitacora_(correoActual_() || 'desconocido', '-', 'LOGIN_FALLIDO', 'Seguridad', e.message);
    return err_(e);
  }
}

/* ===================== Gestión de usuarios (solo Admin) ===================== */

function listarUsuarios() {
  return api_('usuarios', () => limpiar_(leerTodos_('USUARIOS')));
}

function guardarUsuario(datos) {
  return api_('usuarios', (u) => conBloqueo_(() => {
    validarRequeridos_('USUARIOS', datos);
    datos.Correo = String(datos.Correo).toLowerCase().trim();
    if (!dominioValido_(datos.Correo)) throw new Error('El correo debe ser institucional.');
    if (Object.values(ROLES).indexOf(datos.Rol) === -1) throw new Error('Rol inválido.');
    const dup = leerTodos_('USUARIOS').find(x => String(x.Correo).toLowerCase() === datos.Correo && x.ID !== datos.ID);
    if (dup) throw new Error('Ya existe un usuario con ese correo.');
    let r;
    if (datos.ID) {
      if (datos.ID === u.ID && datos.Rol !== ROLES.ADMIN) throw new Error('No puede quitarse a sí mismo el rol de Administrador.');
      r = actualizar_('USUARIOS', datos.ID, datos);
      registrarBitacora_(u.Correo, u.Rol, 'EDITAR_USUARIO', 'Usuarios', datos.Correo + ' -> ' + datos.Rol);
    } else {
      datos.Activo = datos.Activo === undefined ? true : datos.Activo;
      datos.FechaAlta = ahora_();
      r = insertar_('USUARIOS', datos);
      darAccesoHoja_(datos.Correo);
      registrarBitacora_(u.Correo, u.Rol, 'ALTA_USUARIO', 'Usuarios', datos.Correo + ' (' + datos.Rol + ')');
    }
    return limpiar_(r);
  }));
}

/** Comparte el libro como editor (necesario porque el Web App se ejecuta como el usuario que accede). */
function darAccesoHoja_(correo) {
  try { ss_().addEditor(correo); } catch (e) { console.warn('No se pudo compartir con ' + correo + ': ' + e.message); }
}

function quitarAccesoHoja_(correo) {
  try { ss_().removeEditor(correo); } catch (e) { console.warn('No se pudo quitar acceso a ' + correo + ': ' + e.message); }
}

function cambiarEstadoUsuario(id, activo) {
  return api_('usuarios', (u) => {
    if (id === u.ID) throw new Error('No puede desactivar su propia cuenta.');
    const r = actualizar_('USUARIOS', id, { Activo: !!activo });
    if (activo) darAccesoHoja_(r.Correo); else quitarAccesoHoja_(r.Correo);
    registrarBitacora_(u.Correo, u.Rol, activo ? 'ACTIVAR_USUARIO' : 'DESACTIVAR_USUARIO', 'Usuarios', r.Correo);
    return limpiar_(r);
  });
}

/* ============================== Bitácora ============================== */

function registrarBitacora_(usuario, rol, accion, modulo, detalle) {
  try {
    insertar_('BITACORA', {
      FechaHora: ahora_(), Usuario: usuario, Rol: rol, Accion: accion,
      Modulo: modulo || '', Detalle: typeof detalle === 'object' ? JSON.stringify(detalle) : (detalle || ''),
    });
  } catch (e) { console.error('Bitácora: ' + e.message); }
}

function consultarBitacora(filtros) {
  return api_('bitacora', () => {
    filtros = filtros || {};
    let rows = leerTodos_('BITACORA');
    if (filtros.usuario) rows = rows.filter(r => String(r.Usuario).toLowerCase().indexOf(filtros.usuario.toLowerCase()) !== -1);
    if (filtros.accion) rows = rows.filter(r => r.Accion === filtros.accion);
    if (filtros.desde) rows = rows.filter(r => String(r.FechaHora).substring(0, 10) >= filtros.desde);
    if (filtros.hasta) rows = rows.filter(r => String(r.FechaHora).substring(0, 10) <= filtros.hasta);
    return limpiar_(rows.reverse().slice(0, filtros.limite || 500));
  });
}

/* ========================= Envoltura de respuestas ========================= */

function ok_(data) { return { ok: true, data: data }; }
function err_(e) { return { ok: false, error: e && e.message ? e.message : String(e) }; }

/** Envuelve una función pública: verifica permiso, captura errores, respuesta uniforme. */
function api_(permiso, fn) {
  try {
    const u = requiere_(permiso);
    return ok_(fn(u));
  } catch (e) {
    return err_(e);
  }
}
