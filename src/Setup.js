/**
 * Setup.gs — Crea las pestañas, encabezados, validaciones y datos semilla.
 * Ejecutar UNA vez desde el editor: setupInicial()
 */

function setupInicial() {
  const ss = ss_();
  Object.keys(HOJAS).forEach(clave => {
    const def = HOJAS[clave];
    let sh = ss.getSheetByName(def.nombre);
    if (!sh) sh = ss.insertSheet(def.nombre);
    sh.getRange(1, 1, 1, def.cols.length).setValues([def.cols])
      .setFontWeight('bold').setBackground('#0b3d91').setFontColor('#ffffff');
    sh.setFrozenRows(1);
    sh.autoResizeColumns(1, def.cols.length);
  });

  // Placas y matrículas como texto para no perder ceros
  hoja_('VEHICULOS').getRange('B:B').setNumberFormat('@');
  hoja_('MOVIMIENTOS').getRange('B:B').setNumberFormat('@');
  hoja_('ESTUDIANTES').getRange('B:B').setNumberFormat('@');

  // Validaciones de datos (listas desplegables)
  const lista = (vals) => SpreadsheetApp.newDataValidation().requireValueInList(vals, true).build();
  hoja_('USUARIOS').getRange('D2:D').setDataValidation(lista(Object.values(ROLES)));
  hoja_('EMPLEADOS').getRange('D2:D').setDataValidation(lista(['Docente', 'Administrativo']));
  hoja_('VEHICULOS').getRange('F2:F').setDataValidation(lista(TIPOS_USUARIO));
  hoja_('MOVIMIENTOS').getRange('D2:D').setDataValidation(lista(TIPOS_USUARIO));
  hoja_('MOVIMIENTOS').getRange('N2:N').setDataValidation(lista(['DENTRO', 'SALIO']));

  // Protege la bitácora con advertencia (el script corre como el usuario y necesita escribir en ella)
  hoja_('BITACORA').protect().setDescription('Bitácora protegida').setWarningOnly(true);

  // Datos semilla
  if (leerTodos_('CASETAS').length === 0) {
    ['Caseta 1 - Acceso Principal', 'Caseta 2 - Acceso Norte', 'Caseta 3 - Acceso Sur'].forEach(n =>
      insertar_('CASETAS', { Nombre: n, Ubicacion: '', Tipo: 'Entrada/Salida', Activa: true }));
  }
  if (leerTodos_('USUARIOS').length === 0) {
    insertar_('USUARIOS', {
      Correo: CONFIG.ADMIN_INICIAL, Nombre: 'Administrador del Sistema', Rol: ROLES.ADMIN,
      CasetaAsignada: '', Activo: true, FechaAlta: ahora_(), UltimoAcceso: '',
    });
  }
  // Elimina "Hoja 1" por defecto si está vacía
  const def = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
  if (def && def.getLastRow() === 0) {
    ss.setActiveSheet(hoja_('MOVIMIENTOS')); // evita "No se encontró la hoja 0"
    ss.deleteSheet(def);
  }

  registrarBitacora_('SISTEMA', 'SETUP', 'Sistema', 'Estructura de hojas creada');
  return 'Setup completado';
}

/** Menú en la hoja de cálculo */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('Control Vehicular')
    .addItem('Inicializar estructura', 'setupInicial')
    .addItem('Cargar datos de prueba', 'cargarDatosPrueba')
    .addSeparator()
    .addItem('Dar de alta usuario', 'altaUsuarioMenu')
    .addToUi();
}

/** Alta rápida desde el menú de la hoja: solo pide correo y rol. */
function altaUsuarioMenu() {
  const ui = SpreadsheetApp.getUi();
  const r1 = ui.prompt('Alta de usuario', 'Correo institucional:', ui.ButtonSet.OK_CANCEL);
  if (r1.getSelectedButton() !== ui.Button.OK) return;
  const correo = r1.getResponseText().toLowerCase().trim();
  if (!dominioValido_(correo)) return ui.alert('El correo debe ser de un dominio institucional: ' + CONFIG.DOMINIOS_PERMITIDOS.join(', '));
  if (leerTodos_('USUARIOS').some(x => String(x.Correo).toLowerCase() === correo)) return ui.alert('Ese correo ya está registrado.');

  const r2 = ui.prompt('Rol', 'Escriba el número:\n1 = Administrador\n2 = Operador de Caseta\n3 = Consulta', ui.ButtonSet.OK_CANCEL);
  if (r2.getSelectedButton() !== ui.Button.OK) return;
  const rol = { '1': ROLES.ADMIN, '2': ROLES.OPERADOR, '3': ROLES.CONSULTA }[r2.getResponseText().trim()];
  if (!rol) return ui.alert('Opción de rol inválida.');

  insertar_('USUARIOS', {
    Correo: correo, Nombre: correo.split('@')[0], Rol: rol, CasetaAsignada: '',
    Activo: true, FechaAlta: ahora_(), UltimoAcceso: '',
  });
  darAccesoHoja_(correo);
  registrarBitacora_(Session.getEffectiveUser().getEmail(), 'Propietario', 'ALTA_USUARIO', 'Usuarios', correo + ' (' + rol + ')');
  ui.alert('Usuario ' + correo + ' dado de alta como ' + rol + '.\nYa puede entrar al sistema con su cuenta Google institucional.');
}

/** Datos ficticios para la demo y QA */
function cargarDatosPrueba() {
  const e = insertar_('EMPLEADOS', { NumEmpleado: '1001', Nombre: 'María López', Tipo: 'Docente', Departamento: 'Sistemas', Correo: 'mlopez@docentes.uat.edu.mx', Activo: true });
  const a = insertar_('ESTUDIANTES', { Matricula: 'a2213330001', Nombre: 'Juan Pérez', Carrera: 'ISC', Correo: 'a2213330001@alumnos.uat.edu.mx', Activo: true });
  insertar_('VEHICULOS', { Placa: 'XYZ1234', Marca: 'Nissan', Modelo: 'Versa', Color: 'Gris', TipoTitular: 'Docente', TitularID: e.ID, TitularNombre: e.Nombre, Activo: true, FechaAlta: ahora_() });
  insertar_('VEHICULOS', { Placa: 'ABC987A', Marca: 'Chevrolet', Modelo: 'Aveo', Color: 'Rojo', TipoTitular: 'Estudiante', TitularID: a.ID, TitularNombre: a.Nombre, Activo: true, FechaAlta: ahora_() });
  return 'Datos de prueba cargados';
}
