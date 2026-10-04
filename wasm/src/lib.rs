use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Foto {
    pub ruta: String,
    pub descripcion: String,
}

#[derive(Serialize, Deserialize)]
pub struct Metadatos {
    pub autor: String,
    pub marca: String,
    pub email: String,
    pub anio: String,
}

#[derive(Serialize, Deserialize)]
pub struct Perfil {
    pub nombre: String,
    pub foto: Foto,
    pub rol: String,
    pub bienvenida: String,
    pub emailContacto: String,
}

#[derive(Serialize, Deserialize)]
pub struct Resumen {
    pub tituloSeccion: String,
    pub parrafo: String,
}

#[derive(Serialize, Deserialize)]
pub struct InicioData {
    pub tituloPagina: String,
    pub descripcionMeta: String,
    pub perfil: Perfil,
    pub resumen: Resumen,
}

#[derive(Serialize, Deserialize)]
pub struct BloqueLista {
    pub tituloSeccion: String,
    pub items: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct SobreMiData {
    pub tituloPagina: String,
    pub descripcionMeta: String,
    pub encabezadoTrayectoria: String,
    pub bio: String,
    pub bloques: Vec<BloqueLista>,
}

#[derive(Serialize, Deserialize)]
pub struct MediaRecurso {
    pub ruta: String,
    pub tipo: String,
}

#[derive(Serialize, Deserialize)]
pub struct ProyectoItem {
    pub tituloArticulo: String,
    pub descripcion: String,
    pub enlaceUrl: String,
    pub enlaceTexto: String,
}

#[derive(Serialize, Deserialize)]
pub struct ProyectosData {
    pub tituloPagina: String,
    pub descripcionMeta: String,
    pub tituloGeneral: String,
    pub destacado: ProyectoDestacado,
    pub otros: OtrosProyectos,
}

#[derive(Serialize, Deserialize)]
pub struct ProyectoDestacado {
    pub tituloSeccion: String,
    pub descripcion: String,
    pub video: MediaRecurso,
}

#[derive(Serialize, Deserialize)]
pub struct OtrosProyectos {
    pub tituloSeccion: String,
    pub proyectos: Vec<ProyectoItem>,
}

#[derive(Serialize, Deserialize)]
pub struct TarjetaColeccion {
    pub imagen: Foto,
    pub tituloArticulo: String,
    pub subtitulo: String,
}

#[derive(Serialize, Deserialize)]
pub struct SeccionColeccion {
    pub tipoColeccion: String,
    pub tituloSeccion: String,
    pub ariaNav: String,
    pub descripcion: String,
    pub tarjetas: Vec<TarjetaColeccion>,
}

#[derive(Serialize, Deserialize)]
pub struct AficionesData {
    pub tituloPagina: String,
    pub descripcionMeta: String,
    pub tituloGeneral: String,
    pub audioSeccion: SeccionAudio,
    pub colecciones: Vec<SeccionColeccion>,
}

#[derive(Serialize, Deserialize)]
pub struct SeccionAudio {
    pub tituloSeccion: String,
    pub descripcion: String,
    pub audio: MediaRecurso,
}

#[derive(Serialize, Deserialize)]
pub struct FormularioData {
    pub accionMail: String,
    pub etiquetaMensaje: String,
    pub textoBoton: String,
}

#[derive(Serialize, Deserialize)]
pub struct ContactoData {
    pub tituloPagina: String,
    pub descripcionMeta: String,
    pub tituloSeccion: String,
    pub descripcion: String,
    pub formulario: FormularioData,
}

#[derive(Serialize, Deserialize)]
pub struct SitioWebData {
    pub lang: String,
    pub metadatos: Metadatos,
    pub inicio: InicioData,
    pub sobreMi: SobreMiData,
    pub proyectos: ProyectosData,
    pub aficiones: AficionesData,
    pub contacto: ContactoData,
}

#[derive(Serialize)]
pub struct PaginasGeneradas {
    pub index_html: String,
    pub sobre_mi_html: String,
    pub proyectos_html: String,
    pub aficiones_html: String,
    pub contacto_html: String,
}

// Función auxiliar para escapar caracteres HTML básicos
fn escape_html(input: &str) -> String {
    input
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}

#[wasm_bindgen]
pub fn generar_sitio_html(json_str: &str) -> Result<String, JsValue> {
    let data: SitioWebData = serde_json::from_str(json_str)
        .map_err(|e| JsValue::from_str(&format!("Error deserializando JSON en WASM: {}", e)))?;

    // 1. INDEX.HTML
    let index_html = format!(
r#"<!DOCTYPE html>
<html lang="{}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{}">
  <title>{}</title>
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/portafolio.css">
  <script src="js/layout.js" defer></script>
</head>
<body>
  <header></header>

  <main>
    <section>
      <h1>{}</h1>
      <img src="{}" alt="{}">
      <article>
        <h2>Actualidad</h2>
        <p>{}</p>
        <p>{}</p>
        <p>Email: <a href="mailto:{}" target="_self" aria-label="Enviar correo a {} (se abre en una aplicación externa)">{}</a></p>
      </article>
    </section>

    <section>
      <h2>{}</h2>
      <p>{}</p>
    </section>
  </main>

  <footer></footer>
</body>
</html>"#,
        escape_html(&data.lang),
        escape_html(&data.inicio.descripcionMeta),
        escape_html(&data.inicio.tituloPagina),
        escape_html(&data.inicio.perfil.nombre),
        escape_html(&data.inicio.perfil.foto.ruta),
        escape_html(&data.inicio.perfil.foto.descripcion),
        escape_html(&data.inicio.perfil.rol),
        escape_html(&data.inicio.perfil.bienvenida),
        escape_html(&data.inicio.perfil.emailContacto),
        escape_html(&data.inicio.perfil.emailContacto),
        escape_html(&data.inicio.perfil.emailContacto),
        escape_html(&data.inicio.resumen.tituloSeccion),
        escape_html(&data.inicio.resumen.parrafo)
    );

    // 2. SOBRE-MI.HTML
    let mut bloques_html = String::new();
    for bloque in &data.sobreMi.bloques {
        bloques_html.push_str(&format!("      <h2>{}</h2>\n      <ul>\n", escape_html(&bloque.tituloSeccion)));
        for item in &bloque.items {
            bloques_html.push_str(&format!("        <li>{}</li>\n", escape_html(item)));
        }
        bloques_html.push_str("      </ul>\n\n");
    }

    let sobre_mi_html = format!(
r#"<!DOCTYPE html>
<html lang="{}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{}">
  <title>{}</title>
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/portafolio.css">
  <script src="js/layout.js" defer></script>
</head>
<body>
  <header></header>

  <main>
    <article>
      <h1>{}</h1>
      <p>{}</p>
      
{}    </article>
  </main>

  <footer></footer>
</body>
</html>"#,
        escape_html(&data.lang),
        escape_html(&data.sobreMi.descripcionMeta),
        escape_html(&data.sobreMi.tituloPagina),
        escape_html(&data.sobreMi.encabezadoTrayectoria),
        escape_html(&data.sobreMi.bio),
        bloques_html
    );

    // 3. PROYECTOS.HTML
    let mut otros_proyectos_html = String::new();
    for proy in &data.proyectos.otros.proyectos {
        otros_proyectos_html.push_str(&format!(
r#"      <article>
        <h3>{}</h3>
        <p>{}</p>
        <a href="{}" target="_self">{}</a>
      </article>
"#,
            escape_html(&proy.tituloArticulo),
            escape_html(&proy.descripcion),
            escape_html(&proy.enlaceUrl),
            escape_html(&proy.enlaceTexto)
        ));
    }

    let proyectos_html = format!(
r#"<!DOCTYPE html>
<html lang="{}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{}">
  <title>{}</title>
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/portafolio.css">
  <script src="js/layout.js" defer></script>
</head>
<body>
  <header></header>

  <main>
    <h1>{}</h1>
    
    <section>
      <h2>{}</h2>
      <p>{}</p>
      <video controls>
        <source src="{}" type="{}">
        <p>Tu navegador no soporta el reproductor de vídeo HTML5.</p>
      </video>
    </section>

    <section>
      <h2>{}</h2>
{}    </section>
  </main>

  <footer></footer>
</body>
</html>"#,
        escape_html(&data.lang),
        escape_html(&data.proyectos.descripcionMeta),
        escape_html(&data.proyectos.tituloPagina),
        escape_html(&data.proyectos.tituloGeneral),
        escape_html(&data.proyectos.destacado.tituloSeccion),
        escape_html(&data.proyectos.destacado.descripcion),
        escape_html(&data.proyectos.destacado.video.ruta),
        escape_html(&data.proyectos.destacado.video.tipo),
        escape_html(&data.proyectos.otros.tituloSeccion),
        otros_proyectos_html
    );

    // 4. AFICIONES.HTML
    let mut colecciones_html = String::new();
    for col in &data.aficiones.colecciones {
        let mut articulos_html = String::new();
        for tarjeta in &col.tarjetas {
            articulos_html.push_str(&format!(
r#"      <article>
        <img src="{}" alt="{}">
        <h3>{}</h3>
        <p>{}</p>
      </article>

"#,
                escape_html(&tarjeta.imagen.ruta),
                escape_html(&tarjeta.imagen.descripcion),
                escape_html(&tarjeta.tituloArticulo),
                escape_html(&tarjeta.subtitulo)
            ));
        }

        let nav_aria_btn_prev = if col.tipoColeccion == "musica" { "Anteriores álbumes" } else { "Películas anteriores" };
        let nav_aria_btn_next = if col.tipoColeccion == "musica" { "Siguientes álbumes" } else { "Películas siguientes" };

        colecciones_html.push_str(&format!(
r#"    <section>
      <header>
        <h2>{}</h2>
        <nav aria-label="{}">
          <button type="button" aria-label="{}">&#10094;</button>
          <button type="button" aria-label="{}">&#10095;</button>
        </nav>
      </header>
      
      <p>{}</p>

{}    </section>

"#,
            escape_html(&col.tituloSeccion),
            escape_html(&col.ariaNav),
            nav_aria_btn_prev,
            nav_aria_btn_next,
            escape_html(&col.descripcion),
            articulos_html
        ));
    }

    let aficiones_html = format!(
r#"<!DOCTYPE html>
<html lang="{}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{}">
  <title>{}</title>
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/aficiones.css">
  <script src="js/layout.js" defer></script>
</head>
<body>
  <header></header>

  <main>
    <h1>{}</h1>

    <section>
      <h2>{}</h2>
      <p>{}</p>
      <audio controls>
        <source src="{}" type="{}">
        <p>Tu navegador no soporta el reproductor de audio HTML5.</p>
      </audio>
    </section>

{}  </main>

  <footer></footer>

  <script src="js/carrusel.js" defer></script>
</body>
</html>"#,
        escape_html(&data.lang),
        escape_html(&data.aficiones.descripcionMeta),
        escape_html(&data.aficiones.tituloPagina),
        escape_html(&data.aficiones.tituloGeneral),
        escape_html(&data.aficiones.audioSeccion.tituloSeccion),
        escape_html(&data.aficiones.audioSeccion.descripcion),
        escape_html(&data.aficiones.audioSeccion.audio.ruta),
        escape_html(&data.aficiones.audioSeccion.audio.tipo),
        colecciones_html
    );

    // 5. CONTACTO.HTML
    let contacto_html = format!(
r#"<!DOCTYPE html>
<html lang="{}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="{}">
  <title>{}</title>
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/contacto.css">
  <script src="js/layout.js" defer></script>
</head>
<body>
  <header></header>

  <main>
    <section>
      <h1>{}</h1>
      <p>{}</p>

      <form action="mailto:{}" method="post" enctype="text/plain">
        <p>
          <label>
            <span>{}</span>
            <textarea name="mensaje" rows="5" required title="Mensaje" aria-label="Mensaje"></textarea>
          </label>
        </p>

        <p>
          <button type="submit">{}</button>
        </p>
      </form>
    </section>
  </main>

  <footer></footer>
</body>
</html>"#,
        escape_html(&data.lang),
        escape_html(&data.contacto.descripcionMeta),
        escape_html(&data.contacto.tituloPagina),
        escape_html(&data.contacto.tituloSeccion),
        escape_html(&data.contacto.descripcion),
        escape_html(&data.contacto.formulario.accionMail),
        escape_html(&data.contacto.formulario.etiquetaMensaje),
        escape_html(&data.contacto.formulario.textoBoton)
    );

    let resultado = PaginasGeneradas {
        index_html,
        sobre_mi_html,
        proyectos_html,
        aficiones_html,
        contacto_html,
    };

    serde_json::to_string(&resultado)
        .map_err(|e| JsValue::from_str(&format!("Error serializando respuesta HTML: {}", e)))
}