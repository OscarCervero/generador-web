console.log("carrusel.js cargado correctamente");

document.addEventListener("DOMContentLoaded", () => {
  const secciones = document.querySelectorAll("main > section");
  console.log(`Se han encontrado ${secciones.length} secciones en total.`);

  secciones.forEach((seccion, index) => {
    const botones = seccion.querySelectorAll("header nav button");

    if (botones.length < 2) return;

    const btnPrev = botones[0]; // Flecha izquierda
    const btnNext = botones[1]; // Flecha derecha

    // Flecha Siguiente (>)
    btnNext.addEventListener("click", (e) => {
      e.preventDefault();
      const articulos = seccion.querySelectorAll("article");
      if (articulos.length < 2) return;

      const primerArticulo = articulos[0];
      const ultimoArticulo = articulos[articulos.length - 1];

      ultimoArticulo.after(primerArticulo);
    });

    // Flecha Anterior (<)
    btnPrev.addEventListener("click", (e) => {
      e.preventDefault();
      const articulos = seccion.querySelectorAll("article");
      if (articulos.length < 2) return;

      const primerArticulo = articulos[0];
      const ultimoArticulo = articulos[articulos.length - 1];

      primerArticulo.before(ultimoArticulo);
    });
  });
});