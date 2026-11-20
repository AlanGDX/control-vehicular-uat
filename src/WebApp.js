/**
 * WebApp.gs — Punto de entrada del Web App.
 * El frontend (Integrante 2) vive en Index.html y puede dividirse con include().
 */

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle(CONFIG.NOMBRE_SISTEMA)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Permite en Index.html: <?!= include('Estilos') ?> */
function include(nombre) {
  return HtmlService.createHtmlOutputFromFile(nombre).getContent();
}
