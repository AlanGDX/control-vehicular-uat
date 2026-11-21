/**
 * Db.gs — Capa de acceso a datos sobre Google Sheets.
 */

function ss_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function hoja_(clave) {
  const def = HOJAS[clave];
  if (!def) throw new Error('Hoja no definida: ' + clave);
  const sh = ss_().getSheetByName(def.nombre);
  if (!sh) throw new Error('No existe la hoja "' + def.nombre + '". Ejecute setupInicial().');
  return sh;
}

/** Lee todas las filas como objetos {col: valor, _row: n} */
function leerTodos_(clave) {
  const sh = hoja_(clave);
  const cols = HOJAS[clave].cols;
  const last = sh.getLastRow();
  if (last < 2) return [];
  const data = sh.getRange(2, 1, last - 1, cols.length).getValues();
  return data
    .map((fila, i) => {
      const o = { _row: i + 2 };
      cols.forEach((c, j) => { o[c] = serializar_(fila[j]); });
      return o;
    })
    .filter(o => o.ID !== '' && o.ID !== null);
}

function buscarPorId_(clave, id) {
  return leerTodos_(clave).find(o => String(o.ID) === String(id)) || null;
}

function insertar_(clave, obj) {
  const sh = hoja_(clave);
  const cols = HOJAS[clave].cols;
  obj.ID = obj.ID || generarId_(clave);
  sh.appendRow(cols.map(c => (obj[c] === undefined ? '' : obj[c])));
  return obj;
}

function actualizar_(clave, id, cambios) {
  const actual = buscarPorId_(clave, id);
  if (!actual) throw new Error('Registro no encontrado: ' + id);
  const cols = HOJAS[clave].cols;
  const nuevo = Object.assign({}, actual, cambios, { ID: actual.ID });
  hoja_(clave).getRange(actual._row, 1, 1, cols.length)
    .setValues([cols.map(c => (nuevo[c] === undefined ? '' : nuevo[c]))]);
  delete nuevo._row;
  return nuevo;
}

function eliminar_(clave, id) {
  const actual = buscarPorId_(clave, id);
  if (!actual) throw new Error('Registro no encontrado: ' + id);
  hoja_(clave).deleteRow(actual._row);
  return true;
}

/** ID legible con prefijo: VEH-20261119-AB12 */
function generarId_(clave) {
  const pref = clave.substring(0, 3).toUpperCase();
  const fecha = Utilities.formatDate(new Date(), CONFIG.ZONA_HORARIA, 'yyyyMMdd');
  const rnd = Utilities.getUuid().replace(/-/g, '').substring(0, 6).toUpperCase();
  return pref + '-' + fecha + '-' + rnd;
}

/** Fechas -> ISO string para que google.script.run las pueda transferir */
function serializar_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, CONFIG.ZONA_HORARIA, "yyyy-MM-dd'T'HH:mm:ss");
  return v;
}

function ahora_() {
  return Utilities.formatDate(new Date(), CONFIG.ZONA_HORARIA, "yyyy-MM-dd'T'HH:mm:ss");
}

function limpiar_(o) {
  if (Array.isArray(o)) return o.map(limpiar_);
  const c = Object.assign({}, o);
  delete c._row;
  return c;
}

/** Ejecuta fn con bloqueo para evitar escrituras concurrentes entre casetas */
function conBloqueo_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    return fn();
  } finally {
    // Escribe los cambios pendientes ANTES de soltar el bloqueo; si no, otra
    // petición simultánea puede leer datos viejos (p. ej. ver DENTRO un auto que ya salió).
    SpreadsheetApp.flush();
    lock.releaseLock();
  }
}
