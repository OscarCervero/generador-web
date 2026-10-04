/**
 * assembler.js
 * Ensamblador final: enlaza TS (validación), WebAssembly (generador) y coordina
 * los scripts auxiliares (layout.js, carrusel.js) y las rutas relativas.
 */

export class WebSiteAssembler {
  constructor(wasmModule) {
    this.wasm = wasmModule;
  }

  /**
   * Realiza el ensamblado final inyectando navegación o ajustando rutas según la estructura de salida.
   */
  ensamblarSitio(paginasGeneradasJson, metadatos, rutaBase = "") {
    const paginas = JSON.parse(paginasGeneradasJson);
    const resultado = {};

    for (const [nombreArchivo, contenidoHtml] of Object.entries(paginas)) {
      // Ajustar rutas relativas si se publica en un subdirectorio
      let htmlAjustado = contenidoHtml;
      if (rutaBase) {
        htmlAjustado = htmlAjustado
          .replace(/href="css\//g, `href="${rutaBase}/css/`)
          .replace(/src="js\//g, `src="${rutaBase}/js/`)
          .replace(/src="img\//g, `src="${rutaBase}/img/`)
          .replace(/src="media\//g, `src="${rutaBase}/media/`);
      }

      // El ensamblador JavaScript verifica la vinculación de scripts requeridos
      if (nombreArchivo === "aficiones_html" && !htmlAjustado.includes("carrusel.js")) {
        htmlAjustado = htmlAjustado.replace("</body>", '  <script src="js/carrusel.js" defer></script>\n</body>');
      }

      resultado[nombreArchivo] = htmlAjustado;
    }

    return resultado;
  }
}