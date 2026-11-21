# MANUAL DE USUARIO

## Sistema de Control de Acceso Vehicular — UAT CUTM Sur


█████████████ ▒▒▒  ▒   █▀▀▀ ▄▀▀▄ ▄▀▀▀ █  █ █   ▀█▀ ▄▀▀▄ █▀▀▄   █▀▀▄ █▀▀▀
█████████████ ▒▒  ▒▒   █▀▀  █▄▄█ █    █  █ █    █  █▄▄█ █  █   █  █ █▀▀ 
██████▀▀▀▀▀▀▀ ▒  ▒▒▒   █    █  █ ▀▄▄▄ ▀▄▄▀ █▄▄  █  █  █ █▄▄▀   █▄▄▀ █▄▄▄
██████                                                   /
████████████   █████   █ █▄ █ ▄▀▀▀ █▀▀▀ █▄ █ █ █▀▀▀ █▀▀▄ █ ▄▀▀▄
███████████    █████   █ █▀▄█ █ ▀█ █▀▀  █▀▄█ █ █▀▀  █▄▄▀ █ █▄▄█
█████          █████   █ █  █ ▀▄▄█ █▄▄▄ █  █ █ █▄▄▄ █ ▀▄ █ █  █
████ ▒         █████
███ ▒▒         █████   ▀█▀ ▄▀▀▄ █▄ ▄█ █▀▀▄ █ ▄▀▀▀ ▄▀▀▄
██ ▒▒▒         █████    █  █▄▄█ █ ▀ █ █▄▄▀ █ █    █  █
█ ▒▒▒▒         █████    █  █  █ █   █ █    █ ▀▄▄▄ ▀▄▄▀


========================================================================================================
                                    UNIVERSIDAD AUTÓNOMA DE TAMAULIPAS 
                              CENTRO UNIVERSITARIO TAMPICO MADERO (CUTM) SUR 
                                      FACULTAD DE INGENIERÍA TAMPICO 
                           SISTEMA DE CONTROL DE ACCESO VEHICULAR INSTITUCIONAL 
========================================================================================================
Documento: Manual de Operación y Administración de Usuario 
Versión: 1.0.0 | Fecha: 20 de Noviembre de 2026 
Plataforma: Google Apps Script / Google Sheets Engine 
========================================================================================================
Elaborado por: 
Alan Eduardo García Silva
José Manuel García Vega
Casanova Torres Juan Antonio
Ana Laura Del Angel Hernández
Montoya Luna Victor Jonathan
========================================================================================================



## Tabla de contenido

1. [Introducción y Requisitos del Sistema](#1-introducción-y-requisitos-del-sistema)
2. [Inicio de Sesión y Navegación Principal](#2-inicio-de-sesión-y-navegación-principal)
3. [Gestión de Catálogos y Usuarios](#3-gestión-de-catálogos-y-usuarios)
4. [Registro de Entradas Vehiculares](#4-registro-de-entradas-vehiculares)
5. [Registro de Salidas Vehiculares](#5-registro-de-salidas-vehiculares)
6. [Módulo de Consultas](#6-módulo-de-consultas)
7. [Generación de Reportes y Exportación](#7-generación-de-reportes-y-exportación)
8. [Bitácora de Actividades y Seguridad](#8-bitácora-de-actividades-y-seguridad)
9. [Solución de Problemas Frecuentes (FAQ)](#9-solución-de-problemas-frecuentes-faq)
10. [Glosario de Términos](#10-glosario-de-términos)

---

## 1. Introducción y Requisitos del Sistema

### 1.1 Propósito del manual

Este manual es la guía operativa oficial para utilizar el **Sistema de Control de Acceso Vehicular - UAT CUTM Sur**. Su propósito es proporcionar instrucciones claras, directas y paso a paso para que tanto los guardias en turno de las casetas como el personal administrativo y de seguridad puedan:

- Registrar con rapidez entradas y salidas vehiculares mediante placa o código QR.
- Supervisar en tiempo real los vehículos que permanecen dentro del campus.
- Administrar usuarios, permisos, catálogos institucionales y pases vehiculares QR imprimibles.
- Consultar el historial de movimientos, generar reportes estadísticos y exportar datos a Excel, PDF o CSV.
- Auditar las acciones realizadas en el sistema mediante la bitácora de actividades.

### 1.2 Alcance del sistema

El sistema es una aplicación web desarrollada sobre **Google Apps Script** y **Google Sheets** que centraliza el control vehicular de las **3 casetas de acceso** del campus:

1. **Caseta 1 - Acceso Principal**
2. **Caseta 2 - Acceso Norte**
3. **Caseta 3 - Acceso Sur**

Todas las casetas operan de forma sincronizada sobre la misma base de datos en la nube, con control de concurrencia para evitar registros duplicados cuando dos o más casetas trabajan al mismo tiempo. La interfaz cuenta con diseño de alto contraste adaptado para lectura bajo luz solar en exteriores, tanto en teléfono celular como en computadora.

### 1.3 Requisitos mínimos de acceso

Para utilizar el sistema sin contratiempos necesitas:

| Requisito | Especificación mínima |
| :--- | :--- |
| **Dispositivo** | Teléfono celular o tableta (pantalla desde 360 px) o computadora de escritorio / laptop. |
| **Navegador web** | Google Chrome (recomendado), Microsoft Edge, Mozilla Firefox o Safari en versión actualizada. |
| **Conexión a internet** | Red Wi-Fi institucional o datos móviles estables. |
| **Cuenta de acceso** | Cuenta de Google institucional activa perteneciente a uno de los dominios autorizados: `@uat.edu.mx`, `@docentes.uat.edu.mx` o `@alumnos.uat.edu.mx`. |
| **Alta previa** | Tu correo institucional debe estar registrado y **Activo** en la tabla de usuarios del sistema por un Administrador. |
| **Hardware opcional (casetas)** | Cámara trasera del teléfono móvil para escanear calcomanías QR o lector QR físico USB/Bluetooth configurado como teclado. |

### 1.4 Perfiles y roles de usuario

El sistema controla automáticamente qué pantallas y botones ve cada persona según el **Rol** asignado a su cuenta institucional:

- **Administrador:** Tiene control total del sistema. Gestiona usuarios y permisos, administra los 5 catálogos (alta, edición y baja), imprime pases QR, puede operar en caseta, consulta historial, genera/exporta reportes y revisa la bitácora de auditoría.
- **Operador de Caseta:** Perfil diseñado para el guardia u operador en turno. Registra entradas y salidas vehiculares, escanea QR, supervisa el panel *En Campus*, ejecuta cierres de turno, consulta movimientos históricos y puede consultar catálogos, imprimir pases QR y dar de alta o editar únicamente **Vehículos** y **Visitantes**.
- **Consulta:** Perfil de supervisión y análisis en modo lectura. Consulta movimientos históricos, visualiza el tablero de reportes, exporta archivos (Excel, PDF y CSV) y revisa los catálogos e imprime pases QR sin poder modificar registros ni operar casetas.

#### Matriz de permisos por rol

| Módulo / Funcionalidad | Administrador | Operador de Caseta | Consulta |
| :--- | :---: | :---: | :---: |
| **Operación** (Entradas, salidas, En Campus, Cierre de turno) | Sí | Sí | No |
| **Consultas — Consultas de Movimientos** | Sí | Sí | Sí |
| **Consultas — Bitácora de Actividades** | Sí | No | No |
| **Reportes** (Indicadores, gráficas y exportación Excel/PDF/CSV) | Sí | No | Sí |
| **Catálogos — Ver registros e imprimir Pase QR** | Sí | Sí | Sí |
| **Catálogos — Alta y edición en Vehículos y Visitantes** | Sí | Sí | No |
| **Catálogos — Alta y edición en Empleados, Estudiantes y Casetas** | Sí | No | No |
| **Catálogos — Eliminar registros** | Sí | No | No |
| **Gestión de Usuarios** (Alta, edición, roles y activación) | Sí | No | No |

---

## 2. Inicio de Sesión y Navegación Principal

### 2.1 Cómo ingresar al sistema

El sistema utiliza autenticación directa mediante tu **cuenta institucional de Google** (no requiere contraseñas adicionales).

1. Abre tu navegador web (preferentemente **Google Chrome**) en tu celular o computadora, y haz clic en tu foto de perfil o avatar en la esquina superior derecha del navegador, Selecciona Añadir (o Agregar nuevo perfil), Haz clic en Iniciar sesión con una cuenta de correo electronico existente, Haz clic en Iniciar sesión e ingresa tu correo institucional (por ejemplo, con dominio @alumnos.uat.edu.mx o el asignado por la facultad) junto con tu contraseña institucional.
2. Verifica que tengas iniciada sesión en Google únicamente con tu **cuenta institucional UAT** (`@uat.edu.mx`, `@docentes.uat.edu.mx` o `@alumnos.uat.edu.mx`).
3. Ingresa al **enlace oficial de la Web App** proporcionado por el Administrador del sistema (`https://script.google.com/macros/s/[ID-OFICIAL]/exec`).
4. Si es tu primer acceso y Google muestra un aviso de permisos o selección de cuenta, selecciona tu correo institucional y acepta los permisos solicitados.
5. Espera unos segundos mientras aparece la pantalla **Control Vehicular UAT — Verificando sesión institucional…**.
6. Al validar tus credenciales y tu rol, el sistema abrirá automáticamente tu vista inicial:
   - **Operación de Caseta** para *Administrador* y *Operador de Caseta*.
   - **Consultas** para el rol *Consulta*.

> ⚠️ **Importante:** Si tienes varias cuentas de Google abiertas en el mismo navegador (por ejemplo, una cuenta personal `@gmail.com` y tu cuenta `@uat.edu.mx`), Google puede intentar abrir el sistema con la cuenta personal y mostrar la pantalla roja **Acceso Denegado**. Si ocurre esto, cierra tus cuentas personales o abre el enlace en una ventana de **Incógnito** e inicia sesión solo con tu correo institucional.

> 📸 **[INSERTAR CAPTURA DE PANTALLA #1: Pantalla de verificación de sesión ("Verificando sesión institucional…") y, al lado o debajo, la pantalla de "Acceso Denegado" resaltando el botón "Reintentar verificación"]**

### 2.2 Navegación principal (PC y celular)

La interfaz se adapta automáticamente al tamaño de tu pantalla mostrando solo los módulos autorizados para tu rol:

- **En computadora (pantallas grandes):**
  - **Menú lateral izquierdo (azul marino):** Muestra los módulos disponibles (**Operación**, **Consultas**, **Reportes**, **Catálogos**). El módulo activo se resalta con una barra vertical naranja a la izquierda. En la parte inferior verás tu tarjeta de sesión con tus iniciales, nombre completo, rol y correo institucional.
  - **Barra superior:** Muestra el nombre del módulo actual a la izquierda y tu nombre, rol e iniciales en la esquina superior derecha.
- **En teléfono celular o tableta:**
  - **Barra superior compacta:** Muestra el título del módulo actual.
  - **Barra de navegación inferior fija:** Muestra los iconos de tus módulos permitidos para cambiar de pantalla con un toque del pulgar. El módulo activo se resalta en naranja.

#### Notificaciones del sistema

Al ejecutar cualquier acción, el sistema muestra avisos temporales flotantes en pantalla (esquina inferior derecha en PC o sobre la barra inferior en móvil):

- **Borde verde:** Operación completada con éxito (por ejemplo, entrada o salida registrada).
- **Borde ámbar:** Advertencia o dato faltante que debes revisar antes de continuar.
- **Borde rojo:** Error o bloqueo por regla de seguridad (permanece visible 7 segundos o hasta cerrarlo con la `X`).
- **Borde azul marino:** Mensaje informativo (por ejemplo, cambio de caseta activa).

> 📸 **[INSERTAR CAPTURA DE PANTALLA #2: Vista principal del sistema en computadora (resaltando el menú lateral izquierdo y la tarjeta de usuario) y vista en teléfono celular (resaltando la barra de navegación inferior)]**

### 2.3 Cierre de sesión seguro

Debido a que la autenticación depende de tu sesión activa de Google, sigue estos pasos al finalizar tu jornada —especialmente en computadoras o tabletas compartidas en caseta—:

1. Si eres Operador de Caseta, realiza primero el **Cierre de Turno** desde el módulo **Operación** (consulta la Sección 5.4).
2. Cierra la pestaña del navegador donde está abierto el sistema.
3. Abre `accounts.google.com` (o Gmail), haz clic en tu foto o inicial de perfil en la esquina superior derecha y selecciona **Salir** (o **Salir de todas las cuentas**).

> 💡 **Consejo:** En equipos compartidos entre turnos, configura un perfil de navegador separado por operador o utiliza siempre una **ventana de incógnito**, de modo que al cerrar la ventana la sesión se elimine automáticamente.

---

## 3. Gestión de Catálogos y Usuarios

El módulo **Catálogos** concentra la administración del padrón vehicular, las personas autorizadas, las 3 casetas de acceso y —exclusivamente para Administradores— las cuentas de acceso al sistema.

### 3.1 Gestión de usuarios y permisos por rol (solo Administrador)

Esta sección permite dar de alta cuentas institucionales, asignar roles y casetas predeterminadas, así como desactivar accesos de personal que ya no labora en el área.

#### Acceder al panel de usuarios

1. Selecciona **Catálogos** en el menú principal.
2. Haz clic en el botón **Gestión de Usuarios** (esquina superior derecha) para desplazarte directamente a la tabla **Gestión de Usuarios**.

En esta tabla verás las columnas **Correo**, **Nombre**, **Rol**, **Caseta asignada**, **Estado**, **Alta / Último acceso** y **Acciones**, además del buscador **Filtrar usuarios…** y el botón **Actualizar** (`↻`).

#### Dar de alta un nuevo usuario

1. Haz clic en el botón azul **+ Nuevo Usuario**.
2. Completa el formulario del modal **Nuevo usuario**:
   - **Correo institucional \*:** Captura el correo completo con dominio autorizado (`@uat.edu.mx`, `@docentes.uat.edu.mx` o `@alumnos.uat.edu.mx`).
   - **Nombre completo \*:** Nombre y apellidos del usuario.
   - **Rol \*:** Selecciona `Administrador`, `Operador de Caseta` o `Consulta`.
   - **Caseta asignada:** *(Opcional)* Selecciona la caseta habitual del guardia (al iniciar sesión, el sistema la preseleccionará automáticamente). Deja `Sin caseta asignada` si el usuario rota entre casetas o es de oficina.
   - **Cuenta activa:** Mantén marcada la casilla para habilitar su acceso inmediato.
3. Haz clic en **Guardar usuario**.
4. Verifica el aviso verde *"Usuario registrado"*. El sistema le otorgará automáticamente el permiso de acceso a la hoja de cálculo subyacente para que pueda ingresar de inmediato.

#### Editar usuario y modificar permisos o rol

1. Localiza al usuario en la tabla (puedes usar **Filtrar usuarios…**).
2. Haz clic en el botón con icono de **lápiz** (`Editar`) en la columna **Acciones**.
3. Modifica el **Nombre**, el **Rol** o la **Caseta asignada**.
4. Haz clic en **Guardar usuario** para aplicar los cambios.

#### Dar de baja (desactivar) o reactivar un usuario

Los usuarios no se eliminan físicamente para conservar la trazabilidad de quién registró cada movimiento o cambio en el pasado.

1. Localiza la fila del usuario en **Gestión de Usuarios**.
2. Haz clic en el botón rojo **Desactivar** (para suspender acceso) o en **Activar** (para restaurar una cuenta inactiva).
3. Al desactivar una cuenta, el sistema revoca automáticamente su acceso tanto a la aplicación web como al libro de Google Sheets y registra el evento en la bitácora.

> ⚠️ **Importante:** Por seguridad, el sistema no permite que un Administrador **desactive su propia cuenta** (aparece marcada con la etiqueta `Tú`) ni que **se quite a sí mismo el rol de Administrador**.

> 📸 **[INSERTAR CAPTURA DE PANTALLA #3: Sección "Gestión de Usuarios" mostrando la tabla con roles/estados y el modal "Nuevo usuario" resaltando los botones "+ Nuevo Usuario", el selector de "Rol" y el botón "Desactivar"]**

---

### 3.2 Administración de catálogos maestros

Al ingresar al módulo **Catálogos**, verás 5 pestañas en la parte superior con el contador de registros de cada padrón:

- **Vehículos**
- **Empleados**
- **Estudiantes**
- **Visitantes**
- **Casetas**

#### Herramientas comunes en todos los catálogos

- **Buscador:** Escribe placa, nombre, matrícula, número de empleado, identificación o ubicación; la tabla filtra automáticamente.
- **Filtro de estado:** Selecciona `Todos los estados`, `Solo activos` o `Inactivos` *(disponible en Vehículos, Empleados, Estudiantes y Casetas)*.
- **Actualizar (`↻`):** Recarga los registros directamente desde Google Sheets.
- **Botón naranja `+ Nuevo ...`:** Abre el formulario para crear un registro nuevo (visible solo si tu rol tiene permiso de escritura en esa pestaña). Al pie de la tabla verás un aviso indicando si cuentas con permisos de edición o modo *Solo lectura*.

> 💡 **Consejo:** Antes de registrar un **Vehículo** de un estudiante, docente o administrativo, asegúrate de que su titular ya esté dado de alta en la pestaña **Estudiantes** o **Empleados**, ya que el sistema vincula obligatoriamente cada vehículo con su titular.

#### Campos por catálogo

1. **Catálogo de Empleados** *(alta/edición/eliminación solo Administrador)*:
   - Haz clic en la pestaña **Empleados** → **+ Nuevo Empleado**.
   - Captura: **Número de empleado \*** (único), **Tipo \*** (`Docente` o `Administrativo`), **Nombre completo \***, **Departamento**, **Teléfono (10 dígitos)**, **Correo electrónico** y marca **Empleado activo**.
   - Haz clic en **Guardar**.

2. **Catálogo de Estudiantes** *(alta/edición/eliminación solo Administrador)*:
   - Haz clic en la pestaña **Estudiantes** → **+ Nuevo Estudiante**.
   - Captura: **Matrícula \*** (única), **Teléfono (10 dígitos)**, **Nombre completo \***, **Carrera**, **Correo institucional** y marca **Estudiante activo**.
   - Haz clic en **Guardar**.

3. **Catálogo de Visitantes** *(Administrador y Operador de Caseta pueden crear y editar)*:
   - Haz clic en la pestaña **Visitantes** → **+ Nuevo Visitante**.
   - Captura: **Nombre completo \***, **Identificación \*** (INE, licencia, gafete…), **Teléfono (10 dígitos)** y **Motivo**.
   - Haz clic en **Guardar**.

4. **Catálogo de Vehículos** *(Administrador y Operador de Caseta pueden crear y editar)*:
   - Haz clic en la pestaña **Vehículos** → **+ Nuevo Vehículo**.
   - Captura:
     - **Placa \*:** 5 a 8 caracteres alfanuméricos sin espacios ni guiones (el sistema convierte a mayúsculas y limpia símbolos automáticamente; no se permiten placas repetidas).
     - **Tipo de titular \*:** Elige `Estudiante`, `Docente`, `Administrativo` o `Visitante`.
     - **Titular \*:** Selecciona a la persona en la lista desplegable (se filtra automáticamente según el tipo elegido; para `Visitante` la vinculación es opcional).
     - **Marca**, **Modelo** y **Color**.
     - **Vehículo activo (autorizado para ingresar):** Mantén marcada la casilla para autorizar su acceso en caseta. Si la desmarcas, el vehículo quedará dado de baja y las casetas bloquearán su entrada.
   - Haz clic en **Guardar**.

5. **Catálogo de Casetas** *(alta/edición/eliminación solo Administrador)*:
   - Haz clic en la pestaña **Casetas**. Por defecto incluye las 3 casetas del campus (*Caseta 1 - Acceso Principal*, *Caseta 2 - Acceso Norte* y *Caseta 3 - Acceso Sur*).
   - Para agregar o ajustar una caseta, pulsa **+ Nueva Caseta** o el icono de **lápiz** (`Editar`), define **Nombre de la caseta \***, **Ubicación**, **Tipo** (`Entrada/Salida`, `Solo Entrada` o `Solo Salida`) y la casilla **Caseta activa**, y pulsa **Guardar**.
   - Si desactivas una caseta temporalmente (por cierre o mantenimiento), desaparecerá de inmediato del selector operativo de los guardias sin perder su historial.

> 📸 **[INSERTAR CAPTURA DE PANTALLA #4: Módulo "Catálogos Maestros" en la pestaña "Vehículos", resaltando las 5 pestañas superiores, el buscador, el botón "+ Nuevo Vehículo" y los botones de acción por fila ("Pase QR", Editar y Eliminar)]**

#### Emitir e imprimir el Pase Vehicular QR (calcomanía de parabrisas)

Cualquier perfil con acceso a **Catálogos** puede visualizar e imprimir la calcomanía QR oficial de un vehículo registrado:

1. Entra a **Catálogos** → pestaña **Vehículos**.
2. Busca la placa deseada y haz clic en el botón **Pase QR** en la columna **Acciones**.
3. En la ventana **Pase Vehicular QR — UAT CUTM Sur**, verifica los datos de la calcomanía (código QR, placa, titular, tipo de usuario, marca/modelo, color y estado `Activo` o `Baja`).
4. Haz clic en **Imprimir calcomanía**. El navegador preparará automáticamente la impresión de la tarjeta limpia en formato de 80 mm, lista para imprimir en papel adhesivo o guardar como PDF.

> 📸 **[INSERTAR CAPTURA DE PANTALLA #5: Modal "Pase Vehicular QR — UAT CUTM Sur" mostrando la vista previa de la calcomanía con el código QR, la placa y resaltando el botón "Imprimir calcomanía"]**

#### Editar y dar de baja registros en catálogos

- **Editar:** Haz clic en el icono de **lápiz** (`Editar`) en la fila correspondiente, actualiza los campos y pulsa **Guardar**.
- **Eliminar (solo Administrador):** Haz clic en el icono rojo de **papelera** (`Eliminar`), revisa el detalle en el modal **Eliminar registro** y confirma en **Eliminar**.

> ⚠️ **Importante:** El sistema protege la **integridad referencial** del historial. Si intentas eliminar una persona que tiene vehículos registrados, o un vehículo o caseta que ya tiene movimientos históricos, el sistema bloqueará la eliminación. En esos casos, utiliza la **baja lógica**: haz clic en **Editar**, desmarca la casilla **Activo / Activa** y pulsa **Guardar**.

---

## 4. Registro de Entradas Vehiculares

Este procedimiento aplica para el **Operador de Caseta** y el **Administrador** desde el módulo **Operación**.

### 4.1 Paso 1: Verificar la caseta activa

1. Ingresa al módulo **Operación** en el menú principal.
2. En la tarjeta superior **Caseta activa**, verifica que esté seleccionada la caseta en la que te encuentras físicamente y que aparezca el indicador verde: `Operando en [Nombre de tu caseta]`.
3. Si aparece una advertencia ámbar (*"Seleccione la caseta desde la que opera…"*) o cambiaste de puesto, abre la lista desplegable y elige tu caseta. El sistema recordará tu elección en ese dispositivo.

> ⚠️ **Importante:** Revisa siempre la **Caseta activa** al iniciar tu turno. Todas las entradas y salidas que registres quedarán asociadas a la caseta seleccionada en ese desplegable.

### 4.2 Paso 2: Capturar la placa del vehículo

En el panel izquierdo **Ingreso Vehicular**, puedes capturar la placa de tres formas:

- **Opción A — Captura manual:**
  1. Toca el campo grande **Placa del vehículo** (`MX`).
  2. Escribe las letras y números de la placa (5 a 8 caracteres). No necesitas escribir mayúsculas ni guiones: el sistema los normaliza automáticamente.
  3. A partir de 2 caracteres, el sistema despliega una lista de coincidencias del catálogo. Si ves el vehículo, tócalo (o usa flechas `↑`/`↓` y presiona `Enter`).
  4. Para limpiar una captura errónea, pulsa el icono de borrado (`⌫`) dentro del campo de placa.

- **Opción B — Escanear código QR desde celular o imagen:**
  1. Pulsa el botón azul **Escanear QR** (en celular muestra **QR**) junto al campo de placa.
  2. En la ventana **Escanear QR del vehículo**, pulsa el botón naranja **Abrir cámara y escanear QR** y toma una foto enfocada de la calcomanía del parabrisas (o pulsa **Seleccionar imagen QR desde archivo** si la tienes guardada).
  3. Al leer el código, la ventana se cerrará sola y colocará la placa automáticamente en el formulario.

- **Opción C — Lector QR físico USB o Bluetooth:**
  1. Coloca el cursor dentro del campo **Placa del vehículo**.
  2. Escanea la calcomanía con el lector físico; al enviar `Enter`, el sistema detectará y seleccionará automáticamente el vehículo.

> 💡 **Consejo:** Durante las horas pico, utilizar el escaneo de calcomanía QR o seleccionar el vehículo desde la lista desplegable de autocompletado reduce errores de dedo y agiliza el flujo vehicular.

### 4.3 Paso 3: Validar la información del vehículo y tipo de usuario

En cuanto terminas de escribir o escanear una placa válida (5 a 8 caracteres), el sistema consulta automáticamente el padrón y muestra uno de estos cuatro escenarios:

1. **Vehículo registrado y autorizado (tarjeta con insignia verde `Registrado`):**
   - Verifica visualmente que la **Marca**, **Modelo**, **Color**, **Tipo de titular** (`Estudiante`, `Docente`, `Administrativo` o `Visitante`) y **Titular** coincidan con el automóvil en caseta.
   - No necesitas elegir el tipo de usuario manualmente: el sistema lo toma del catálogo.

2. **Vehículo no registrado en el catálogo (panel ámbar `Placa no registrada en el catálogo`):**
   - Captura el **Nombre del conductor** (recomendado para control de seguridad).
   - En **Tipo de usuario**, selecciona `Visitante` (opción predeterminada), `Estudiante`, `Docente` o `Administrativo`.
   - *(Opcional, solo cuando Tipo de usuario es `Visitante`)*: Si deseas guardar los datos para visitas frecuentes, marca la casilla **Registrar también en el catálogo de visitantes** y completa **Identificación \*** (obligatoria si marcas esta opción), **Teléfono (10 dígitos)** y **Motivo de la visita**. Si también deseas guardar el auto en el catálogo, marca **Vincular esta placa al visitante en el catálogo de vehículos** y captura **Marca**, **Modelo** y **Color**.

3. **Vehículo dado de baja (tarjeta con bloque rojo `Vehículo dado de baja`):**
   - El sistema indica *"Acceso no autorizado. Comuníquese con el administrador"* y **bloquea** el botón de registro. No autorices el paso hasta recibir indicación de seguridad o administración.

4. **Vehículo que ya figura dentro del campus (recuadro ámbar `Este vehículo ya está dentro del campus`):**
   - Muestra por qué caseta entró, fecha/hora y tiempo transcurrido.
   - Si el vehículo entró **el mismo día** y olvidó registrar su salida anterior, pulsa el botón **Registrar Salida** dentro del recuadro ámbar antes de registrar la nueva entrada (el sistema no permite duplicar entradas abiertas del mismo día).
   - Si la entrada abierta corresponde a un **día anterior**, al registrar la nueva entrada el sistema cerrará automáticamente el movimiento anterior como `SIN SALIDA` y registrará el ingreso actual.

> 📸 **[INSERTAR CAPTURA DE PANTALLA #6: Vista "Operación" mostrando el selector "Caseta activa", el campo "Placa del vehículo" con una placa capturada, la tarjeta de vehículo con insignia verde "Registrado" y resaltando el botón naranja "REGISTRAR ENTRADA"]**

> 📸 **[INSERTAR CAPTURA DE PANTALLA #7: Panel de "Placa no registrada en el catálogo" mostrando el selector de "Tipo de usuario" (Visitante/Estudiante/Docente/Administrativo) y la casilla opcional para alta en catálogo de visitantes, junto con el modal "Escanear QR del vehículo"]**

### 4.4 Paso 4: Agregar observaciones y confirmar la entrada

1. *(Opcional)* Escribe cualquier novedad en **Observaciones (opcional)** (por ejemplo: *"acompañante sin credencial"*, *"proveedor entrega equipo"*). Si la placa no está en el catálogo y dejas el campo vacío, el sistema guardará automáticamente `"Vehículo no registrado"`.
2. Haz clic en el botón naranja **REGISTRAR ENTRADA** (o presiona `Enter` desde el teclado en computadora).
3. Espera un instante mientras el botón indica *"Registrando…"* (esto evita registros duplicados por doble clic).

### 4.5 Paso 5: Verificar el registro automático de fecha y hora

Confirma que la entrada quedó correctamente guardada comprobando estos tres indicadores:

1. Aparece la notificación flotante verde: **`Entrada registrada: [PLACA] · [Nombre de caseta] · [HH:MM]`**. La fecha y hora exacta son asignadas automáticamente por el servidor (zona horaria oficial de Tampico/Monterrey) y no pueden alterarse manualmente.
2. El formulario de **Ingreso Vehicular** se limpia automáticamente, listo para el siguiente automóvil.
3. El vehículo aparece de inmediato en el panel derecho **En Campus** con etiqueta verde `DENTRO` y su hora de ingreso.

> ⚠️ **Importante:** Antes de dar paso al vehículo, verifica siempre que aparezca la notificación verde de confirmación. Si el botón **REGISTRAR ENTRADA** está deshabilitado, lee el texto de ayuda que aparece justo debajo del botón: te indicará exactamente qué dato falta (por ejemplo, seleccionar caseta o completar 5 caracteres de placa).

---

## 5. Registro de Salidas Vehiculares

El panel derecho **En Campus** dentro del módulo **Operación** muestra en tiempo real todos los vehículos que se encuentran actualmente dentro de las instalaciones, sin importar por cuál de las 3 casetas hayan ingresado. La lista se actualiza automáticamente cada 60 segundos y también puedes refrescarla en cualquier momento con el botón **Actualizar** (`↻`).

### 5.1 Paso 1: Confirmar tu caseta activa

1. Verifica en el selector superior **Caseta activa** que esté seleccionada la caseta desde la que estás dando salida (esa caseta quedará registrada como la **Caseta de Salida**, incluso si el automóvil entró por una caseta distinta).

### 5.2 Paso 2: Localizar el vehículo activo

Puedes encontrar el vehículo de cualquiera de estas tres maneras:

- **Opción A — Buscador en el panel *En Campus*:** Escribe la placa (completa o parcial) o el nombre del titular en el campo **Buscar placa…** del panel derecho. La lista se filtra al instante.
- **Opción B — Filtro por caseta de entrada:** Si necesitas revisar solo los autos que entraron por una caseta específica, selecciona esa caseta en el desplegable **Todas las casetas**.
- **Opción C — Escaneo de QR o captura en el campo principal:** Si escaneas la calcomanía QR (o escribes la placa) en el campo **Placa del vehículo** del panel izquierdo, el sistema detecta que el auto sigue adentro y despliega el recuadro ámbar **Este vehículo ya está dentro del campus** con un botón directo **Registrar Salida**.

### 5.3 Paso 3: Registrar la salida y confirmar el cierre

1. En la tarjeta del vehículo localizado (o en el aviso ámbar), haz clic en el botón **Registrar Salida** (en pantallas pequeñas de celular aparece como **Salida**).
2. El botón cambiará brevemente a *"Registrando…"* para impedir clics repetidos.
3. Confirma el cierre del movimiento verificando que:
   - Aparece la notificación flotante verde: **`Salida registrada: [PLACA] · [Caseta de salida] · [HH:MM]`**.
   - El vehículo desaparece inmediatamente del panel **En Campus** y el contador azul disminuye en 1.
   - En el historial de Google Sheets el movimiento pasa del estado `DENTRO` a `SALIO`, guardando automáticamente fecha/hora de salida, caseta de salida y tu correo como operador.

> 📸 **[INSERTAR CAPTURA DE PANTALLA #8: Panel "En Campus" en la vista "Operación", resaltando el contador de vehículos, el campo "Buscar placa…", una tarjeta normal con etiqueta "DENTRO", una tarjeta en borde rojo con "Alerta ≥12 h" y el botón "Registrar Salida"]**

### 5.4 Alertas de estancia prolongada, Cierre de Turno y Cierre Nocturno

- **Alertas de estancia (≥ 12 horas):** Si un vehículo permanece 12 horas o más dentro del campus sin registrar salida, su tarjeta sube automáticamente al inicio de la lista **En Campus** con borde izquierdo rojo, etiqueta **`Alerta ≥12 h`** y botón rojo de salida. Verifica con tu supervisor si el vehículo sigue estacionado o salió sin registrarse.
- **Cierre de Turno (al entregar la caseta):**
  1. Antes de retirarte, haz clic en el botón **Cierre de Turno** (esquina superior derecha de la tarjeta de caseta activa).
  2. Confirma el nombre de tu caseta y escribe cualquier incidencia en **Observaciones de entrega (opcional)**.
  3. Haz clic en **Generar cierre**.
  4. El sistema muestra un resumen con el total de vehículos que **Siguen dentro**, las **Alertas ≥12 h** y el listado de placas pendientes que ingresaron por esa caseta, dejando constancia oficial en la bitácora.
  5. Pulsa **Cerrar**.
- **Cierre Nocturno Automático:** Cuando el Administrador activa esta tarea programada, el sistema ejecuta un cierre automático cada noche entre las **23:00 y 23:59 h**, marcando los movimientos que quedaron abiertos como **`SIN SALIDA`** (sin registrar una hora de salida ficticia) para mantener limpio el conteo del día siguiente.

> 📸 **[INSERTAR CAPTURA DE PANTALLA #9: Modal "Cierre de Turno" mostrando el resumen generado ("Siguen dentro", "Alertas ≥12 h" y lista de vehículos pendientes)]**

---

## 6. Módulo de Consultas

El módulo **Consultas** (pestaña **Consultas de Movimientos**) está disponible para **Administrador**, **Operador de Caseta** y **Consulta**, y permite buscar registros históricos aplicando uno o varios filtros combinados.

### 6.1 Cómo buscar y filtrar movimientos paso a paso

1. Selecciona **Consultas** en el menú principal. Asegúrate de estar en la pestaña **Consultas de Movimientos**.
2. Configura uno o más criterios en la barra de filtros según lo que necesites localizar:
   - **Por placa vehicular:** Escribe la placa completa o parcial en el campo **Placa** (ejemplo: `XYZ1234` o `XYZ`). El sistema ignora guiones y espacios y convierte a mayúsculas automáticamente.
   - **Por rango de fechas:** Selecciona la fecha inicial en **Fecha desde** y/o la fecha final en **Fecha hasta** (filtra con base en la fecha de entrada).
   - **Por caseta/acceso:** Selecciona `Todas las casetas` o una de las 3 casetas en el menú **Caseta** (incluye movimientos donde esa caseta haya sido el punto de entrada **o** el punto de salida).
   - **Por tipo de usuario:** Elige `Todos`, `Estudiante`, `Docente`, `Administrativo` o `Visitante` en **Tipo de usuario**.
   - **Por estado *(filtro adicional)*:** Elige `Todos`, `DENTRO`, `SALIO` o `SIN SALIDA` en **Estado**.
3. Haz clic en el botón azul **Consultar**.
4. Para borrar todos los filtros y volver a consultar el listado general, haz clic en el botón **Limpiar** (icono de flecha circular `↺`).

> 💡 **Consejo:** Puedes combinar todos los filtros a la vez. Por ejemplo, para revisar los visitantes que ingresaron por la Caseta 1 durante la semana pasada, selecciona **Fecha desde**, **Fecha hasta**, **Caseta 1 - Acceso Principal** y **Tipo de usuario: Visitante**, y presiona **Consultar**.

### 6.2 Interpretación de resultados

- En el encabezado de la tabla verás el total de **Movimientos encontrados** y tres etiquetas de conteo rápido: **`Dentro`**, **`Salio`** y **`Sin salida`**.
- Los resultados aparecen ordenados del más reciente al más antiguo con las columnas:
  - **Placa:** Matrícula vehicular normalizada.
  - **Estado:** Etiqueta verde `DENTRO`, gris `SALIO` o ámbar `SIN SALIDA`.
  - **Titular / Tipo:** Nombre registrado (o *"Sin titular registrado"*) y perfil de usuario.
  - **Entrada:** Fecha y hora exacta (`DD/MM/AAAA HH:MM:SS`), caseta de ingreso y correo del operador.
  - **Salida:** Fecha y hora de salida (o *"No registrada"* si terminó como `SIN SALIDA`), caseta y operador de salida.
  - **Observaciones:** Comentarios capturados en caseta o notas de cierre automático.

> ⚠️ **Importante:** Verifica que la **Fecha desde** no sea posterior a la **Fecha hasta**; de lo contrario, el sistema mostrará una advertencia y no ejecutará la búsqueda hasta que corrijas el rango.

> 📸 **[INSERTAR CAPTURA DE PANTALLA #10: Módulo "Consultas" en la pestaña "Consultas de Movimientos", resaltando los 6 campos de filtro, los botones "Consultar" y "Limpiar", el resumen por estado y la tabla de resultados]**

---

## 7. Generación de Reportes y Exportación

El módulo **Reportes** (`Reportes y Análisis Vehicular`) está reservado para los perfiles **Administrador** y **Consulta**. Permite analizar el comportamiento del acceso vehicular mediante indicadores, gráficas interactivas y archivos descargables.

### 7.1 Filtrar el periodo y los datos del reporte

1. Ingresa al módulo **Reportes** en el menú principal. Al abrirse, carga automáticamente el resumen general acumulado.
2. En el bloque **Filtros del reporte**, selecciona el rango de fechas (**Fecha desde** y **Fecha hasta**) y, si lo requieres, filtra por **Placa**, **Caseta**, **Tipo de usuario** o **Estado**.
3. Haz clic en **Aplicar filtros** (o en el icono **Limpiar** `↺` para quitar filtros).

> 💡 **Consejo:** Los filtros que apliques actualizan simultáneamente los indicadores KPI, las 4 gráficas, la tabla de vehículos más frecuentes y el archivo que descargues al exportar.

### 7.2 Interpretación de indicadores y reportes obligatorios

#### A. Tarjetas de indicadores clave (KPIs) — Entradas y salidas por periodo

1. **Total Entradas:** Número total de ingresos en el periodo filtrado y cantidad de **vehículos únicos** que accedieron.
2. **Salidas:** Total de movimientos cerrados con salida registrada (`SALIO`) y porcentaje de cumplimiento (`% con salida registrada`).
3. **Dentro ahora:** Cantidad de vehículos actualmente dentro del campus **en tiempo real** (este dato refleja el estado actual independientemente del filtro histórico de fechas).
4. **Hora pico:** Franja horaria de mayor afluencia del periodo (por ejemplo, `08:00`) y el total de ingresos registrados en esa hora.
5. **Estancia promedio:** Tiempo promedio de permanencia en el campus (en minutos y su equivalente en horas y minutos), calculado con los movimientos que cuentan con hora de entrada y salida.

#### B. Bloque de Control de Salidas y Alertas de Estancia

Debajo de los KPIs principales se muestra un recuadro de seguimiento operativo con tres métricas críticas:

- **Salidas no registradas:** Cantidad de movimientos marcados como `SIN SALIDA`.
- **% Sin salida:** Porcentaje que representan respecto al total filtrado (útil para evaluar la disciplina de registro de salidas en casetas).
- **Alertas de estancia:** Número de vehículos que actualmente superan **12 horas** dentro del campus. Si es mayor a cero, el recuadro cambia a rojo con la etiqueta **`Atención`**; si es cero, muestra verde **`Sin alertas`**.

> 📸 **[INSERTAR CAPTURA DE PANTALLA #11: Parte superior del módulo "Reportes" mostrando los botones de exportación ("Exportar Excel", "Exportar PDF", "CSV"), la barra de filtros, las 5 tarjetas KPI y el bloque "Control de Salidas y Alertas de Estancia"]**

#### C. Gráficas de análisis

1. **Afluencia por horario *(Horarios de mayor afluencia)*:** Gráfica de barras de `00:00` a `23:00` con el volumen de entradas por hora. La barra de la **hora pico** se destaca automáticamente en **naranja** para identificar los momentos de mayor congestión y planear refuerzos en caseta.
2. **Entradas por caseta:** Gráfica de barras horizontales que compara el volumen de ingresos de cada una de las 3 casetas (azul marino) contra sus incidencias `SIN SALIDA` (naranja).
3. **Distribución por tipo de usuario:** Gráfica de dona acompañada de una lista con cantidades exactas y porcentajes por perfil (`Estudiante`, `Docente`, `Administrativo` y `Visitante`).
4. **Tendencia diaria *(Entradas por periodo)*:** Gráfica combinada con barras azules que muestran las entradas por cada día del rango seleccionado y una línea naranja que refleja la evolución diaria de registros `SIN SALIDA`.

#### D. Tabla de vehículos más frecuentes (Top 10)

Al final de la pantalla se presenta la tabla **Vehículos más frecuentes**, con los **10 vehículos con mayor número de ingresos** en el periodo seleccionado (posición `#`, `Placa`, `Titular`, `Tipo` y total de `Visitas` con barra proporcional).

> 💡 **Consejo:** Haz clic directamente sobre cualquier **placa** dentro de la tabla **Vehículos más frecuentes** para saltar de inmediato al módulo **Consultas** con el historial completo de ese vehículo ya filtrado.

> 📸 **[INSERTAR CAPTURA DE PANTALLA #12: Sección de gráficas ("Afluencia por horario", "Entradas por caseta", "Distribución por tipo de usuario", "Tendencia diaria") y tabla "Vehículos más frecuentes" resaltando la barra naranja de hora pico y una placa clicable]**

### 7.3 Cómo exportar los datos a Excel, PDF o CSV

El sistema permite descargar el detalle exacto de los movimientos del periodo filtrado en tres formatos desde los botones ubicados en la esquina superior derecha del módulo **Reportes**:

1. Define los filtros deseados (por ejemplo, **Fecha desde** y **Fecha hasta** del mes a reportar) y pulsa **Aplicar filtros** para confirmar en pantalla los datos.
2. Haz clic en el botón del formato requerido:
   - **Exportar Excel** *(recomendado)*: Genera y descarga un libro `.xlsx` (`Movimientos_CUTM_Sur_AAAAMMDD_HHMM.xlsx`) con título institucional, fecha de generación, filtros aplicados, encabezados formateados en azul marino y columnas autoajustadas (`Placa`, `TipoUsuario`, `TitularNombre`, `CasetaEntrada`, `FechaHoraEntrada`, `CasetaSalida`, `FechaHoraSalida`, `Estado`, `Observaciones`).
   - **Exportar PDF:** Genera un documento `.pdf` listo para imprimir o anexar a informes en tamaño carta horizontal.
   - **CSV:** Descarga un archivo `.csv` con codificación UTF-8 (conserva acentos y la letra `ñ` al abrirlo en Excel o herramientas externas).
3. Espera unos segundos mientras el botón muestra *"Exportando…"*.
4. Cuando aparezca la notificación verde **`Archivo generado: Movimientos_CUTM_Sur_…`**, abre el archivo desde la carpeta de **Descargas** de tu dispositivo.

> ⚠️ **Importante:** Cada exportación queda registrada en la **Bitácora de Actividades** indicando usuario, fecha/hora, formato elegido y número de filas exportadas.

---

## 8. Bitácora de Actividades y Seguridad

### 8.1 Cómo consultar la Bitácora de Actividades (solo Administrador)

La **Bitácora de Actividades** es un registro cronológico de **solo lectura** donde el sistema almacena automáticamente cada acción relevante de operación, administración y seguridad.

1. Selecciona **Consultas** en el menú principal.
2. Haz clic en la pestaña superior **Bitácora de Actividades** *(esta pestaña solo es visible para el rol Administrador)*.
3. Si deseas acotar la revisión, utiliza cualquiera de los filtros disponibles:
   - **Usuario:** Escribe parte del correo institucional del usuario (o `SISTEMA` para eventos automáticos).
   - **Acción:** Filtra por un evento específico (`ENTRADA`, `SALIDA`, `SIN_SALIDA`, `CIERRE_TURNO`, `CIERRE_NOCTURNO`, `CONSULTA`, `EXPORTAR`, `ALTA`, `EDITAR`, `ELIMINAR`, `LOGIN`, `LOGIN_FALLIDO`, `ACCESO_DENEGADO`, `ALTA_USUARIO`, `EDITAR_USUARIO`, `ACTIVAR_USUARIO`, `DESACTIVAR_USUARIO`, `Sistema`).
   - **Fecha desde / Fecha hasta:** Acota el periodo a auditar.
   - **Límite:** Elige ver los `100 últimos`, `250 últimos` o `500 últimos` registros.
4. Haz clic en **Consultar** (o en el icono `↺` para limpiar filtros).

#### Código de color de los eventos

La tabla muestra **Fecha y Hora**, **Usuario** (con su rol), **Acción**, **Módulo** y **Detalle**, en orden cronológico inverso (más reciente primero):

- **Etiqueta verde:** Actividades normales exitosas (`ENTRADA`, `SALIDA`, `ALTA`, `LOGIN`, `ALTA_USUARIO`, `ACTIVAR_USUARIO`).
- **Etiqueta ámbar:** Incidencias operativas o acciones sensibles (`SIN_SALIDA`, `CIERRE_TURNO`, `CIERRE_NOCTURNO`, `ELIMINAR`, `DESACTIVAR_USUARIO`).
- **Etiqueta roja:** Eventos de alerta de seguridad (`LOGIN_FALLIDO`, `ACCESO_DENEGADO`).
- **Etiqueta azul:** Consultas, ediciones y exportaciones (`CONSULTA`, `EDITAR`, `EXPORTAR`, `EDITAR_USUARIO`).

> 📸 **[INSERTAR CAPTURA DE PANTALLA #13: Vista "Consultas" en la pestaña "Bitácora de Actividades", resaltando el selector de pestaña, los filtros ("Usuario", "Acción", fechas, "Límite") y filas con etiquetas de colores verde, ámbar y rojo]**

### 8.2 Buenas prácticas operativas y de seguridad

1. **Cuentas personales e intransferibles:** Cada operador debe iniciar sesión con su propia cuenta institucional UAT. Nunca prestes tu sesión a otro guardia ni dejes el equipo desbloqueado al terminar tu turno.
2. **Verificación física obligatoria:** Al capturar o escanear una placa, confirma visualmente que el vehículo físico coincida con la **Marca**, **Modelo** y **Color** desplegados en pantalla.
3. **Disciplina en salidas y cierre de turno:** Registra todas las salidas en tiempo real y realiza el **Cierre de Turno** al entregar la caseta para reducir los registros `SIN SALIDA`.
4. **No manipular Google Sheets directamente:** Evita borrar o editar filas manualmente en las pestañas `Movimientos` y `Bitacora` de Google Sheets; toda operación debe hacerse desde la aplicación web para preservar validaciones e integridad.
5. **Revisión periódica de seguridad (Administradores):** Audita semanalmente la bitácora filtrando por `LOGIN_FALLIDO` y `ACCESO_DENEGADO` para detectar intentos no autorizados, y desactiva de inmediato las cuentas del personal que cause baja o cambio de área.
6. **Mantener activo el cierre nocturno:** El propietario del libro debe verificar una sola vez en Google Sheets (menú **Control Vehicular › Activar cierre nocturno automático**) que el proceso diario de las 23:00–23:59 h se encuentre habilitado.

---

## 9. Solución de Problemas Frecuentes (FAQ)

| Problema / Mensaje en pantalla | Causa probable | Solución rápida |
| :--- | :--- | :--- |
| **1. "Error de comunicación con el servidor" o la pantalla no responde** | Pérdida momentánea de conexión Wi-Fi o datos móviles en caseta. | Verifica la señal de internet del dispositivo, espera unos segundos y pulsa **Reintentar** o **Actualizar** (`↻`). No cierres la pestaña ni presiones el botón repetidamente hasta validar si el movimiento ya aparece en *En Campus*. |
| **2. "Acceso Denegado: [correo] no es una cuenta institucional"** | El navegador tiene abierta una cuenta personal (`@gmail.com`) como cuenta principal de Google. | Cierra sesión en tus cuentas personales o abre el enlace de la Web App en una **ventana de incógnito**, inicia sesión únicamente con tu correo `@uat.edu.mx` / `@docentes.uat.edu.mx` / `@alumnos.uat.edu.mx` y pulsa **Reintentar verificación**. |
| **3. "La cuenta no está registrada en el sistema" o "Cuenta desactivada"** | El usuario aún no ha sido dado de alta o su cuenta fue suspendida por un Administrador. | Solicita al Administrador del sistema que verifique tu correo en **Catálogos › Gestión de Usuarios**, dé de alta la cuenta o cambie su estado a **Activa**. |
| **4. "Su rol no tiene permiso para esta acción" o no aparecen módulos (ej. Reportes / Bitácora)** | Intentaste realizar una función reservada a otro perfil (por ejemplo, un Operador intentando entrar a Reportes o eliminar un registro). | Verifica tu rol en la parte superior/lateral de la pantalla. Si tus funciones cambiaron, solicita al Administrador actualizar tu rol en **Gestión de Usuarios** y recarga la página (`F5`). |
| **5. "No se pudo identificar la cuenta" o sesión expirada tras inactividad** | La sesión de Google caducó o se cerró en otra pestaña del navegador. | Recarga la página completa del navegador, inicia sesión nuevamente con tu cuenta institucional UAT y pulsa **Reintentar verificación**. |
| **6. "El vehículo [PLACA] ya está dentro del campus… Registre primero su salida"** | Se intentó registrar una segunda entrada el mismo día para un automóvil que aún figura en estado `DENTRO`. | Confirma si el vehículo realmente salió antes sin registro. Si es así, haz clic en **Registrar Salida** dentro del recuadro ámbar (o en el panel **En Campus**) y luego registra la nueva entrada. |
| **7. "Vehículo dado de baja: acceso no autorizado"** | La placa está marcada como `Inactivo` en el catálogo de Vehículos. | No permitas el ingreso de forma ordinaria. Notifica al responsable de seguridad o al Administrador para validar si corresponde reactivar el vehículo en **Catálogos › Vehículos**. |
| **8. El botón naranja "REGISTRAR ENTRADA" permanece deshabilitado** | Falta seleccionar la **Caseta activa**, la placa tiene menos de 5 caracteres, o marcaste guardar visitante en catálogo sin capturar Nombre/Identificación o con teléfono distinto a 10 dígitos. | Lee el mensaje de aviso ubicado justo debajo del botón **REGISTRAR ENTRADA** y completa el campo faltante. |
| **9. La cámara en vivo no abre al escanear QR o no detecta la calcomanía** | Google Apps Script restringe la cámara en vivo por política de seguridad del navegador, o la imagen está borrosa / con reflejo solar. | Pulsa **Abrir cámara y escanear QR** para tomar una foto nítida y bien enfocada de la calcomanía. Si el reflejo impide la lectura, cierra el lector y captura la placa manualmente en **Placa del vehículo**. |
| **10. "No se puede eliminar: tiene vehículos/movimientos asociados"** | Intentaste borrar un titular, vehículo o caseta que ya tiene historial registrado (protección de integridad referencial). | Cierra el aviso, haz clic en **Editar** (icono de lápiz), desmarca la casilla **Activo / Activa** y pulsa **Guardar** para darlo de baja sin perder el historial. |
| **11. Al pulsar "Exportar Excel" o "Exportar PDF" no se descarga el archivo** | El rango de fechas está invertido (`Desde` mayor que `Hasta`) o el navegador bloqueó la descarga automática. | Verifica que **Fecha desde** sea menor o igual a **Fecha hasta**, autoriza las descargas en la barra de direcciones del navegador y vuelve a hacer clic en **Exportar Excel**. |

---

## 10. Glosario de Términos

- **Alerta de estancia (`Alerta ≥12 h`):** Aviso visual en color rojo que destaca a los vehículos que llevan 12 horas o más dentro del campus sin registrar salida.
- **Baja lógica (Desactivar):** Acción de marcar un usuario, vehículo, persona o caseta como `Inactivo` para impedir su uso futuro sin borrar su historial de movimientos.
- **Bitácora de Actividades:** Historial automático e inalterable donde quedan registrados los inicios de sesión, entradas, salidas, consultas, exportaciones y cambios en catálogos.
- **Caseta activa:** Punto de acceso (Caseta 1, 2 o 3) seleccionado en el módulo *Operación* desde el cual el guardia registra las entradas y salidas de su turno.
- **Catálogo maestro:** Listado oficial y centralizado de registros del sistema (*Vehículos*, *Empleados*, *Estudiantes*, *Visitantes* y *Casetas*).
- **Cierre de turno:** Reporte rápido que genera el operador al entregar su guardia para dejar constancia en bitácora de los vehículos que continúan dentro del campus.
- **Cierre nocturno automático:** Proceso programado del sistema (entre 23:00 y 23:59 h) que cierra automáticamente como `SIN SALIDA` los movimientos que no registraron salida durante el día.
- **Cuenta institucional:** Correo electrónico oficial asignado por la universidad (`@uat.edu.mx`, `@docentes.uat.edu.mx` o `@alumnos.uat.edu.mx`) requerido para autenticarse.
- **Estado del movimiento:** Situación de un acceso vehicular: **`DENTRO`** (ingresó y permanece en el campus), **`SALIO`** (ciclo completo con entrada y salida registradas) o **`SIN SALIDA`** (ingreso cerrado automáticamente sin registro de salida).
- **Hora pico:** Hora del día en la que se concentra la mayor cantidad de entradas vehiculares durante el periodo consultado.
- **Integridad referencial:** Regla de seguridad del sistema que impide borrar registros que tienen datos vinculados (por ejemplo, un vehículo con historial de entradas) para evitar pérdida de información.
- **KPI (Indicador Clave de Desempeño):** Tarjeta numérica en el módulo *Reportes* que resume una métrica principal (total de entradas, salidas, vehículos dentro, hora pico o estancia promedio).
- **Normalización de placa:** Proceso automático mediante el cual el sistema convierte cualquier placa a letras mayúsculas y elimina espacios o guiones (por ejemplo, `abc-12 3` se guarda como `ABC123`).
- **Pase Vehicular QR:** Calcomanía oficial imprimible con código QR que contiene la placa del vehículo registrado para acelerar su lectura en caseta.
- **Rol (Perfil de usuario):** Conjunto de permisos asignados a una cuenta (`Administrador`, `Operador de Caseta` o `Consulta`) que determina qué módulos y acciones puede ejecutar.
- **Web App:** Aplicación web alojada en la nube (Google Apps Script) a la que se accede desde un enlace en el navegador sin necesidad de instalar programas en el celular o la computadora.

---

*Fin del Manual de Usuario — Sistema de Control de Acceso Vehicular UAT CUTM Sur.*


