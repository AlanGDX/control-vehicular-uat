# Frontend — Control de Acceso Vehicular UAT CUTM Sur

Documentación técnica de la interfaz web implementada en la rama `frontend-ui` sobre Google Apps Script (`HtmlService`).

## 1. Descripción general y stack tecnológico

El frontend es una aplicación de una sola página (SPA) sin paso de compilación ni dependencias Node/npm en producción. El punto de entrada en servidor [src/WebApp.js](src/WebApp.js) expone la plantilla principal mediante `HtmlService.createTemplateFromFile('Index')` y compone los módulos HTML con el helper `include(nombre)` (`<?!= include('...') ?>`), permitiendo `XFrameOptionsMode.ALLOWALL` y etiqueta `viewport` para dispositivos móviles desde `360px` de ancho.

La interfaz sigue el sistema de diseño **Terminal Operativa Táctica** (alto contraste para operación en exteriores bajo luz solar):

- **Paleta base:** fondo blanco neblina `#F4F6F8`, superficies en `#FFFFFF` con borde estructural de `1px #DFE5EC` (sin sombras difusas ni degradados), primario institucional azul marino `#0F2B46`, acento operativo naranja `#D96B16` y texto principal `#1C2530`.
- **Estados semánticos:** verde `#15803D` (`DENTRO` / activo / autorizado), rojo `#B91C1C` (alerta ≥12 h / baja / error), ámbar `#B45309` (`SIN SALIDA` / revisión) y gris `#334155` (`SALIO`).
- **Tipografía:** `Plus Jakarta Sans` para encabezados, `Inter` para texto operativo y `JetBrains Mono` para placas vehiculares, identificadores y marcas de tiempo.

### Dependencias por CDN

| Librería | Versión | Archivo donde se carga | Propósito |
|---|---|---|---|
| Tailwind CSS (CDN Play) | Última (v3 Play) | `src/Styles.html` | Utilidades responsivas y configuración de tokens de color/tipografía (`tailwind.config`) |
| Google Fonts (`Plus Jakarta Sans`, `Inter`, `JetBrains Mono`) | — | `src/Styles.html` | Tipografía institucional y monoespaciada tabular |
| Lucide Icons | `0.460.0` | `src/Styles.html` | Iconografía vectorial con trazo uniforme de `2px` (`lucide.createIcons()`) |
| `html5-qrcode` | `2.3.8` | `src/Styles.html` | Decodificación de códigos QR desde cámara en vivo o archivo/foto (`scanFile`) |
| Chart.js | `4.4.7` | `src/Index.html` | Gráficas interactivas de reportes (barras, barras horizontales, dona y línea/barra) |
| `qrcodejs` | `1.0.0` | `src/Index.html` | Generación de códigos QR en el modal imprimible de calcomanía vehicular |

---

## 2. Estructura de archivos en `src/`

| Archivo | Tamaño aprox. | Responsabilidad principal |
|---|---|---|
| `src/Index.html` | 155 líneas (~7.9 KB) | Shell SPA, carga de CDNs de Chart.js y `qrcodejs`, inclusiones `<?!= include(...) ?>`, pantalla de verificación de sesión (`#screen-loading`), pantalla de acceso denegado (`#screen-denied`), sidebar fijo en escritorio, barra superior (`<header>`), navegación inferior móvil (`#nav-mobile`) y contenedor `#toast-container`. |
| `src/Styles.html` | 242 líneas (~15.2 KB) | Carga de Google Fonts, Tailwind CSS, Lucide y `html5-qrcode`; variables CSS (`:root`); estilos de placa (`.plate`, `.plate-input`), botones (`.btn-primary`, `.btn-secondary`), badges de estado (`.badge-dentro`, `.badge-salio`, `.badge-sin-salida`, `.badge-alerta`), filas de alerta (`.row-alerta`), skeletons, toasts, modales y reglas `@media print` para `.print-area` y `.qr-sticker` (`80mm`). |
| `src/ViewOperacion.html` | 275 líneas (~15.7 KB) | Vista `#view-operacion`: selector único de caseta activa (`#op-caseta`), botón de cierre de turno, captura de placa (`#placa-input`) con lista de autocompletado (`#ac-list`), tarjeta de vehículo detectado (`#veh-card`), aviso de vehículo ya dentro (`#ya-dentro`), formulario rápido de visitante (`#visitor-form`), panel "En Campus" (`#dentro-list`) con búsqueda y filtro por caseta, modal lector QR (`#modal-qr`) y modal de cierre de turno (`#modal-cierre`). |
| `src/ViewConsultas.html` | 192 líneas (~10.6 KB) | Vista `#view-consultas`: barra de pestañas entre **Consultas de Movimientos** (`#con-panel-movimientos`) y **Bitácora de Actividades** (`#con-panel-bitacora`, protegida por `data-perm="bitacora"`), barras de filtros combinables, resumen por estado y tablas responsivas de solo lectura. |
| `src/ViewReportes.html` | 298 líneas (~15.8 KB) | Vista `#view-reportes`: botones de exportación (`xlsx`, `pdf`, `csv`), filtros combinables, 5 tarjetas KPI principales, bloque destacado de control (`salidasNoRegistradas`, `porcentajeSinSalida`, `alertasEstancia`), 4 contenedores `<canvas>` de Chart.js y tabla de los 10 vehículos más frecuentes (`#rep-frecuentes-tbody`). |
| `src/ViewCatalogos.html` | 471 líneas (~26.8 KB) | Vista `#view-catalogos`: pestañas para los 5 catálogos (`vehiculos`, `empleados`, `estudiantes`, `visitantes`, `casetas`), buscador y filtro de estado, sección **Gestión de Usuarios** (`#sec-usuarios`, `data-perm="usuarios"`), modal reutilizable de alta/edición (`#modal-catalogo`), modal de confirmación de eliminación (`#modal-cat-eliminar`), modal **Pase Vehicular QR** (`#modal-pase-qr`) y modal de usuarios (`#modal-usuario`). |
| `src/ClientJS.html` | 2,685 líneas (~112.1 KB) | Estado global `STATE`, utilidades de formato/normalización, puente `runGas()`, control anti doble clic `withBusy()`, gestor de toasts y modales, flujo de sesión y permisos, enrutador SPA (`navigate`), descarga Blob Base64, y controladores `initOperacion()`, `initConsultas()`, `initReportes()` e `initCatalogos()`. |

---

## 3. Mapa de integración Frontend → Backend

Todas las llamadas al servidor pasan por `runGas(fnName, ...args)` en `src/ClientJS.html`. La interfaz aplica el control de visibilidad y acciones leyendo el arreglo `STATE.session.permisos` devuelto por `login()`.

### Matriz de llamadas `runGas()`

| Función Backend | Invocación en `ClientJS.html` | Vista / Modal | Evento disparador | Permiso backend |
|---|---|---|---|---|
| `login()` | `iniciarSesion()` | Shell global (`#screen-loading` / `#screen-denied`) | Carga inicial (`DOMContentLoaded`) o clic en `#btn-retry-login` | Usuario institucional activo |
| `listarCasetasActivas()` | `cargarCasetas()` | Global / `ViewOperacion` / filtros / `ViewCatalogos` | Login exitoso y al guardar o eliminar una caseta en `ViewCatalogos` | `catalogo.leer` |
| `buscarVehiculoPorPlaca(placa)` | `consultarPlaca(opts)` | `ViewOperacion` (`#placa-input`) | Escritura con `debounce(250 ms)`, tecla `Enter` o lectura de código QR (`aplicarPlaca`) | `catalogo.leer` |
| `registrarEntrada(payload)` | `registrarEntrada()` | `ViewOperacion` | Clic en `#btn-registrar-entrada` o `Enter` en `#placa-input` / `#entrada-obs` | `operacion` |
| `registrarSalida({ movimientoId, casetaId })` | `registrarSalida(movimientoId, btn)` | `ViewOperacion` (`#dentro-list` / `#ya-dentro`) | Clic en botón de salida por fila (`[data-action="salida"]`) o en `#btn-ya-dentro-salida` | `operacion` |
| `vehiculosDentro()` | `cargarDentro(silent)` | `ViewOperacion` (panel "En Campus") | Mostrar vista, botón `#btn-dentro-refresh`, intervalo cada `60 s`, evento `visibilitychange` y tras entrada/salida | `consulta` |
| `cierreTurno({ casetaId, observaciones })` | `confirmarCierreTurno()` | `ViewOperacion` (`#modal-cierre`) | Clic en `#btn-cierre-confirmar` dentro del modal de cierre | `operacion` |
| `consultarMovimientos(filtros)` | `cargarMovimientos(btn)` | `ViewConsultas` (`#con-panel-movimientos`) | Primera apertura, envío de `#con-filtros-form`, `#btn-con-limpiar` o clic en placa frecuente (`verPlacaEnConsultas`) | `consulta` |
| `consultarBitacora(filtros)` | `cargarBitacora(btn)` | `ViewConsultas` (`#con-panel-bitacora`) | Cambio a pestaña `#tab-btn-bitacora`, envío de `#bit-filtros-form` o `#btn-bit-limpiar` | `bitacora` |
| `obtenerReporte(filtros)` | `cargarReporte(btn)` | `ViewReportes` | Primera apertura, envío de `#rep-filtros-form`, `#btn-rep-limpiar` o `#btn-rep-reintentar` | `reportes` |
| `exportarMovimientos(filtros, formato)` | `exportarReporte(formato, btn)` | `ViewReportes` | Clic en `#btn-export-xlsx`, `#btn-export-pdf` o `#btn-export-csv` (`data-export`) | `reportes` |
| `listarCatalogo(catalogo, texto)` | `cargarCatalogoActual()` / `cargarOpcionesTitularVehiculo()` | `ViewCatalogos` y `#modal-catalogo` | Apertura, cambio de pestaña (`[data-cat-tab]`), búsqueda en `#cat-search` (`debounce 250 ms`) o cambio de `TipoTitular` | `catalogo.leer` |
| `guardarCatalogo(catalogo, datos)` | `registrarEntrada()` (visitante opcional) y `guardarRegistroCatalogo()` | `ViewOperacion` (`#visitor-form`) y `ViewCatalogos` (`#modal-catalogo`) | Envío de `#form-catalogo` o alta rápida de visitante/vehículo en caseta | `vehiculo.escribir` (`vehiculos`, `visitantes`) o `catalogo.escribir` (resto) |
| `eliminarCatalogo(catalogo, id)` | `confirmarEliminarCatalogo()` | `ViewCatalogos` (`#modal-cat-eliminar`) | Clic en `#btn-cat-confirmar-eliminar` | `catalogo.escribir` |
| `listarUsuarios()` | `cargarUsuarios()` | `ViewCatalogos` (`#sec-usuarios`) | Apertura de Catálogos, `#btn-usr-refresh` o tras guardar/cambiar estado | `usuarios` |
| `guardarUsuario(datos)` | `guardarRegistroUsuario()` | `ViewCatalogos` (`#modal-usuario`) | Envío de `#form-usuario` | `usuarios` |
| `cambiarEstadoUsuario(id, activo)` | `alternarEstadoUsuario(id, nuevoActivo, btn)` | `ViewCatalogos` (`#usr-tbody`) | Clic en botón `Activar` / `Desactivar` de la fila de usuario | `usuarios` |

### Manejo dinámico de permisos (`session.permisos`)

1. **Elementos declarativos (`[data-perm]`):** `aplicarPermisos()` oculta (`hidden = true`) toda pestaña de navegación, subvista o sección cuyo permiso no esté presente en `STATE.session.permisos` y recalcula las columnas de la barra móvil (`#nav-mobile-grid`).
2. **Protección de rutas SPA (`VIEW_PERMS`):** `navigate(view)` valida `{ operacion: 'operacion', consultas: 'consulta', reportes: 'reportes', catalogos: 'catalogo.leer' }` antes de activar cualquier vista; al iniciar sesión navega automáticamente al primer módulo permitido en `VIEW_ORDER`.
3. **Permisos granulares en Catálogos:** `puedeEscribirCatalogo(cat)` habilita `+ Nuevo` y `Editar` en `vehiculos` y `visitantes` si existe `'vehiculo.escribir'`, mientras que `empleados`, `estudiantes`, `casetas` y el botón `Eliminar` de cualquier catálogo exigen `'catalogo.escribir'`.

---

## 4. Decisiones técnicas clave

### Puente `runGas()`, bloqueos anti doble clic y toasts

- **`runGas(fnName, ...args)`:** envuelve `google.script.run` en una `Promise`, interpreta el contrato `{ ok, data, error }` y encapsula fallos de negocio o transporte en `GasError` (distinguiendo con `fromBackend` entre errores de autorización/reglas de negocio y fallos de red/entorno).
- **Prevención de duplicados:** `withBusy(btn, busyLabel, task)` deshabilita el botón e inyecta un spinner mientras la promesa está activa; adicionalmente `OP.submitting` evita dobles envíos en `registrarEntrada()`, `OP.salidasPendientes[movimientoId]` impide salidas concurrentes sobre una misma fila, y `OP.catalogoGuardadoPara` evita duplicar el visitante en catálogo si falla un reintento posterior de entrada.
- **Notificaciones (`showToast`):** cola flotante limitada a 4 alertas simultáneas (`TOAST_MAX = 4`) con tipos `success`, `error`, `warning` e `info`, cierre manual y autocierre diferenciado (4 s estándar, 7 s en errores).

### Lector QR en iframe de Apps Script, lectores físicos y Pase QR imprimible

- **Detección de política de cámara (`camaraEnVivoPermitida()`):** el entorno de ejecución de Google Apps Script sirve la aplicación dentro de un iframe (`googleusercontent.com` / `script.google.com`) con `Permissions-Policy` restrictiva para `camera`. Antes de invocar `Html5Qrcode.start()` o `getCameras()`, el cliente verifica `document.featurePolicy.allowsFeature('camera')`, `document.permissionsPolicy.allowsFeature('camera')` y el contexto iframe de Google. Si no está permitida, omite por completo la inicialización de cámara en vivo para evitar errores `[Violation] Permissions policy violation` en consola.
- **Captura alternativa y lectores físicos:** cuando la cámara en vivo está bloqueada, `#modal-qr` muestra como acción principal el botón naranja vinculado a `<input id="qr-file-input" type="file" accept="image/*" capture="environment">` (cámara nativa en móvil) y como acción secundaria `<input id="qr-file-gallery" type="file" accept="image/*">`; ambos decodifican la imagen localmente mediante `Html5Qrcode.scanFile(file, false)`. Adicionalmente, `onPlacaKeydown` en `#placa-input` intercepta `Enter` (emitido por lectores QR USB/Bluetooth) para cancelar el debounce, ejecutar `consultarPlaca({ seleccionarExacto: true })` y seleccionar automáticamente el vehículo si hay coincidencia exacta.
- **Extracción tolerante y calcomanía de baja densidad:** `extraerPlacaDeQR()` admite placa simple, JSON (`{ placa }`), URL con parámetro `?placa=`, formato `PLACA: ...` o texto delimitado por `|`, `;` o saltos de línea. Al emitir pases desde `ViewCatalogos`, `abrirModalPaseQR()` codifica únicamente la placa normalizada (`normalizarPlaca(v.Placa)`) con corrección `QRCode.CorrectLevel.M` para mantener baja densidad y acelerar la lectura bajo luz solar; `@media print` en `src/Styles.html` oculta el resto del DOM y neutraliza el posicionamiento/scroll del modal para imprimir únicamente `.print-area` (tarjeta `.qr-sticker` de `80mm`).

### Descarga de reportes Base64 → Blob y ciclo de vida de Chart.js

- **Exportación (`base64ToBlob` y `descargarArchivoBase64`):** las exportaciones `.xlsx`, `.pdf` y `.csv` devueltas por `exportarMovimientos` como `{ nombre, mime, base64 }` se decodifican en bloques de `8192` bytes hacia arreglos `Uint8Array` (preservando el BOM UTF-8 del CSV), se empaquetan en un `Blob` y se descargan con un enlace temporal `URL.createObjectURL(blob)` que se revoca tras 15 segundos.
- **Redibujado limpio de gráficas:** `REP.charts` mantiene las 4 instancias (`hora`, `caseta`, `tipo`, `dia`). Cada llamada a `renderChartsReporte()` invoca `destruirChart(clave)` (`.destroy()`) antes de instanciar un nuevo `Chart`, evitando superposición de lienzos o fugas de memoria al cambiar filtros.

### Panel "En Campus", alertas ≥12 h y estado `SIN SALIDA`

- **Sincronización automática:** en `ViewOperacion`, `cargarDentro()` consulta `vehiculosDentro()` sin filtro de caseta para mantener el inventario completo de vehículos dentro del campus; el filtro de caseta (`#dentro-filter`) y búsqueda (`#dentro-search`) se aplican en memoria. Un temporizador refresca la lista cada `60 s` mientras la pestaña y la vista estén activas, además de refrescar al volver a la pestaña (`visibilitychange`).
- **Cruce con captura de entrada:** al ingresar una placa en `#placa-input`, `renderVehiculo()` contrasta contra `STATE.dentro` y muestra `#ya-dentro` con botón directo de salida si el vehículo sigue en campus.
- **Alertas y `SIN SALIDA`:** las filas marcadas con `alerta === true` (estancia ≥12 h) reciben la clase `.row-alerta` (borde izquierdo rojo) y el badge `.badge-alerta`. En `ViewReportes` y `ViewConsultas`, el estado `SIN SALIDA` se distingue con `.badge-sin-salida` y se refleja tanto en KPIs (`salidasNoRegistradas`, `porcentajeSinSalida`, `alertasEstancia`) como en las comparativas de caseta y tendencia diaria.

---

## 5. Flujo de despliegue y mantenimiento en Google Apps Script

### Opción A: Mediante `@google/clasp`

1. Instalar e iniciar sesión una sola vez (si no está configurado en el equipo):
   ```bash
   npm i -g @google/clasp
   clasp login
   ```
2. Verificar que exista el archivo `.clasp.json` apuntando al proyecto de Apps Script y subir los cambios de `src/`:
   ```bash
   clasp push
   ```
3. Publicar una nueva versión en la implementación Web App (`/exec`):
   ```bash
   clasp deployments
   clasp deploy -i <DEPLOYMENT_ID> -d "Actualización frontend"
   ```

### Opción B: Desde el editor web de Apps Script

1. Abrir el Google Sheets del sistema → **Extensiones › Apps Script**.
2. Para cada uno de los 7 archivos HTML en `src/` (`Index`, `Styles`, `ViewOperacion`, `ViewConsultas`, `ViewReportes`, `ViewCatalogos`, `ClientJS`), actualizar el archivo HTML homónimo (sin la extensión `.html` en el nombre dentro del editor de Apps Script) pegando el contenido actualizado y guardando.
3. Hacer clic en **Implementar › Administrar implementaciones**, editar la implementación Web App activa, elegir **Nueva versión** en el selector de versión y confirmar **Implementar** para que los cambios impacten en la URL `/exec`.
