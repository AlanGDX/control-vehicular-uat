/**
 * Sistema de Control de Acceso Vehicular - UAT CUTM Sur
 * Config.gs — Constantes globales y definición de hojas.
 * Integrante 1: Líder Técnico y Backend
 */

const CONFIG = {
  // Dominios institucionales permitidos para iniciar sesión
  DOMINIOS_PERMITIDOS: ['uat.edu.mx', 'docentes.uat.edu.mx', 'alumnos.uat.edu.mx'],
  ZONA_HORARIA: 'America/Monterrey',
  NOMBRE_SISTEMA: 'Control de Acceso Vehicular UAT CUTM Sur',
  // Correo del primer administrador (se crea con setupInicial)
  ADMIN_INICIAL: 'a2221330007@alumnos.uat.edu.mx',
};

const ROLES = {
  ADMIN: 'Administrador',
  OPERADOR: 'Operador de Caseta',
  CONSULTA: 'Consulta',
};

const TIPOS_USUARIO = ['Estudiante', 'Docente', 'Administrativo', 'Visitante'];

/** Permisos por rol: acción -> roles autorizados */
const PERMISOS = {
  'catalogo.leer':     [ROLES.ADMIN, ROLES.OPERADOR, ROLES.CONSULTA],
  'catalogo.escribir': [ROLES.ADMIN],
  'vehiculo.escribir': [ROLES.ADMIN, ROLES.OPERADOR], // el operador puede dar de alta visitantes
  'operacion':         [ROLES.ADMIN, ROLES.OPERADOR],
  'consulta':          [ROLES.ADMIN, ROLES.OPERADOR, ROLES.CONSULTA],
  'reportes':          [ROLES.ADMIN, ROLES.CONSULTA],
  'usuarios':          [ROLES.ADMIN],
  'bitacora':          [ROLES.ADMIN],
};

/**
 * Esquema de hojas (modelo normalizado).
 * La primera columna de cada hoja es siempre el ID.
 */
const HOJAS = {
  USUARIOS:    { nombre: 'Usuarios',    cols: ['ID', 'Correo', 'Nombre', 'Rol', 'CasetaAsignada', 'Activo', 'FechaAlta', 'UltimoAcceso'] },
  EMPLEADOS:   { nombre: 'Empleados',   cols: ['ID', 'NumEmpleado', 'Nombre', 'Tipo', 'Departamento', 'Correo', 'Telefono', 'Activo'] },
  ESTUDIANTES: { nombre: 'Estudiantes', cols: ['ID', 'Matricula', 'Nombre', 'Carrera', 'Correo', 'Telefono', 'Activo'] },
  VISITANTES:  { nombre: 'Visitantes',  cols: ['ID', 'Nombre', 'Identificacion', 'Motivo', 'Telefono', 'FechaRegistro'] },
  VEHICULOS:   { nombre: 'Vehiculos',   cols: ['ID', 'Placa', 'Marca', 'Modelo', 'Color', 'TipoTitular', 'TitularID', 'TitularNombre', 'Activo', 'FechaAlta'] },
  CASETAS:     { nombre: 'Casetas',     cols: ['ID', 'Nombre', 'Ubicacion', 'Tipo', 'Activa'] },
  MOVIMIENTOS: { nombre: 'Movimientos', cols: ['ID', 'Placa', 'VehiculoID', 'TipoUsuario', 'TitularNombre', 'CasetaEntradaID', 'CasetaEntrada', 'FechaHoraEntrada', 'OperadorEntrada', 'CasetaSalidaID', 'CasetaSalida', 'FechaHoraSalida', 'OperadorSalida', 'Estado', 'Observaciones'] },
  BITACORA:    { nombre: 'Bitacora',    cols: ['ID', 'FechaHora', 'Usuario', 'Rol', 'Accion', 'Modulo', 'Detalle'] },
};

/** Catálogos expuestos por el CRUD genérico -> clave de HOJAS */
const CATALOGOS = {
  empleados: 'EMPLEADOS',
  estudiantes: 'ESTUDIANTES',
  visitantes: 'VISITANTES',
  vehiculos: 'VEHICULOS',
  casetas: 'CASETAS',
};

/** Campos obligatorios por catálogo */
const REQUERIDOS = {
  EMPLEADOS:   ['NumEmpleado', 'Nombre', 'Tipo'],
  ESTUDIANTES: ['Matricula', 'Nombre'],
  VISITANTES:  ['Nombre', 'Identificacion'],
  VEHICULOS:   ['Placa', 'TipoTitular'],
  CASETAS:     ['Nombre'],
  USUARIOS:    ['Correo', 'Nombre', 'Rol'],
};
