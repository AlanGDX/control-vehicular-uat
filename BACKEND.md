# Backend — Control de Acceso Vehicular UAT CUTM Sur

## Instalación (10 min)
1. Crear un Google Sheets nuevo → **Extensiones › Apps Script**.
2. Crear un archivo por cada `.gs` de `src/` (mismo nombre) y pegar el contenido. Crear `Index.html`.
3. En *Configuración del proyecto* activar "Mostrar appsscript.json" y pegar `src/appsscript.json`.
4. En `Config.gs` cambiar `ADMIN_INICIAL` por tu correo institucional y revisar `DOMINIOS_PERMITIDOS`.
5. Ejecutar `setupInicial` (autorizar permisos). Opcional: `cargarDatosPrueba`.
6. **Implementar › Nueva implementación › Aplicación web**: Ejecutar como *Yo*, Acceso *Usuarios del dominio* (si no hay Workspace UAT, usar "Cualquier usuario con cuenta de Google"; el login sigue filtrando por dominio y por hoja `Usuarios`).
7. Sincronizar con GitHub: `npm i -g @google/clasp`, `clasp login`, `clasp clone <scriptId>` dentro de `src/`, luego `clasp push` / `clasp pull`.

## Hojas
Usuarios · Empleados · Estudiantes · Visitantes · Vehiculos · Casetas · Movimientos · Bitacora (protegida).

## Roles
| Permiso | Admin | Operador | Consulta |
|---|---|---|---|
| Catálogos (ver) | ✔ | ✔ | ✔ |
| Catálogos (editar) | ✔ | vehículos/visitantes | – |
| Entradas/salidas | ✔ | ✔ | – |
| Consultas | ✔ | ✔ | ✔ |
| Reportes/exportar | ✔ | – | ✔ |
| Usuarios y bitácora | ✔ | – | – |

## API para el frontend (Integrante 2)
Todas responden `{ok:true,data}` o `{ok:false,error}`. Llamar con `google.script.run.withSuccessHandler(fn).nombre(args)`.

| Función | Argumentos | Devuelve |
|---|---|---|
| `login()` | – | `{correo,nombre,rol,caseta,permisos[]}` |
| `listarCasetasActivas()` | – | casetas |
| `listarCatalogo(cat, texto?)` | `empleados\|estudiantes\|visitantes\|vehiculos\|casetas` | filas |
| `guardarCatalogo(cat, obj)` | obj con columnas de la hoja; con `ID` edita, sin `ID` crea | fila |
| `eliminarCatalogo(cat, id)` | – | true (bloquea si hay relaciones) |
| `buscarVehiculoPorPlaca(txt)` | prefijo | ≤10 vehículos (autocompletado) |
| `registrarEntrada({placa,casetaId,tipoUsuario?,nombreVisitante?,observaciones?})` | | movimiento + `registrado` |
| `registrarSalida({movimientoId? \| placa, casetaId})` | | movimiento |
| `vehiculosDentro(casetaId?)` | opcional, filtra por caseta de entrada | movimientos `DENTRO` + `horasDentro` y `alerta` (true si ≥ 12 h; las alertas van primero) |
| `cierreTurno({casetaId, observaciones?})` | | `{caseta, pendientes[], totalPendientes, totalAlertas}`; queda en bitácora |
| `consultarMovimientos({placa,desde,hasta,casetaId,tipoUsuario,estado})` | fechas `yyyy-MM-dd` | movimientos |
| `obtenerReporte(filtros)` | igual | `{kpis,porHora,porDia,porCaseta,porTipo,masFrecuentes,sinSalidaPorCaseta,sinSalidaPorDia}`; `kpis` incluye `alertasEstancia`, `salidasNoRegistradas`, `porcentajeSinSalida` |
| `exportarMovimientos(filtros, 'xlsx'\|'pdf'\|'csv')` | | `{nombre,mime,base64}` |
| `listarUsuarios()` / `guardarUsuario(obj)` / `cambiarEstadoUsuario(id,bool)` | | Admin |
| `consultarBitacora({usuario,accion,desde,hasta,limite})` | | Admin |

## Reglas de negocio
- Placas normalizadas (`abc-12 3` → `ABC123`), 5–8 alfanuméricos, únicas.
- Un vehículo no entra si ya está DENTRO **desde hoy**, ni sale sin entrada abierta; vehículos dados de baja son rechazados.
- Estados de movimiento: `DENTRO`, `SALIO`, `SIN SALIDA` (salida no registrada; no tiene FechaHoraSalida).
- Si un vehículo llega con una entrada abierta **de otro día**, esa entrada se cierra como `SIN SALIDA` y se registra la nueva.
- Cierre nocturno: activador diario (23:00–23:59, `CONFIG.HORA_CIERRE_NOCTURNO`) que marca todo lo que sigue `DENTRO` como `SIN SALIDA`. Se activa una vez desde el menú **Control Vehicular › Activar cierre nocturno automático**.
- Alerta de estancia larga: `CONFIG.HORAS_ALERTA_ESTANCIA` (12 h por defecto).
- Placa no registrada → se acepta como Visitante con observación.
- Vehículo ↔ titular validado contra su catálogo; Docente/Administrativo coincide con el tipo del empleado.
- No se borran registros con relaciones (se desactivan).
- `LockService` evita duplicados cuando las 3 casetas registran a la vez.
- Todo login, alta, edición, borrado, entrada, salida, exportación y acceso denegado queda en `Bitacora`.
