document.addEventListener('DOMContentLoaded', () => {
  // 1. Inyectar el Header
  const headerContainer = document.querySelector('header');
  if (headerContainer) {
    headerContainer.innerHTML = `
      <nav aria-label="Navegación principal">
        <a href="index.html">Cervero</a>
        <ul>
          <li><a href="index.html">Inicio</a></li>
          <li><a href="sobre-mi.html">Sobre mí</a></li>
          <li><a href="proyectos.html">Proyectos</a></li>
          <li><a href="aficiones.html">Aficiones</a></li>
          <li><a href="contacto.html">Contacto</a></li>
        </ul>
      </nav>
    `;

    // Detectar página actual y asignar aria-current="page"
    let paginaActual = window.location.pathname.split('/').pop();
    if (!paginaActual || paginaActual === '') {
      paginaActual = 'index.html';
    }

    const enlaces = headerContainer.querySelectorAll('ul a');
    enlaces.forEach(enlace => {
      if (enlace.getAttribute('href') === paginaActual) {
        enlace.setAttribute('aria-current', 'page');
      } else {
        enlace.removeAttribute('aria-current');
      }
    });
  }

  // 2. Inyectar el Footer
  const footerContainer = document.querySelector('footer');
  if (footerContainer) {
    footerContainer.innerHTML = `
      <p>&copy; 2026 Óscar Cervero Luiña. Sitio desarrollado conforme a estándares HTML5 y CSS3.</p>
    `;
  }
});