/**
 * validator.ts
 * Módulo TypeScript para validar el documento XML frente a las especificaciones DTD y XSD.
 */
export class XMLValidator {
    parser;
    constructor() {
        this.parser = new DOMParser();
    }
    // Validador Regex de tipoEmail (definido en sitio.xsd)
    esEmailValido(email) {
        const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return patron.test(email.trim());
    }
    // Validador de tipoAnio (definido en sitio.xsd como xs:gYear)
    esAnioValido(anio) {
        const patron = /^\d{4}$/;
        return patron.test(anio.trim());
    }
    obtenerTexto(elemento, selector, requerido = true) {
        const el = elemento.querySelector(selector);
        if (!el || !el.textContent) {
            if (requerido) {
                throw new Error(`[DTD/XSD Error]: Falta el elemento obligatorio o está vacío: <${selector}>`);
            }
            return "";
        }
        return el.textContent.trim();
    }
    obtenerAtributo(elemento, selector, atributo) {
        const el = elemento.querySelector(selector);
        if (!el)
            throw new Error(`[DTD/XSD Error]: Falta el elemento <${selector}>`);
        const val = el.getAttribute(atributo);
        if (!val) {
            throw new Error(`[DTD/XSD Error]: Falta el atributo obligatorio '${atributo}' en <${selector}>`);
        }
        return val.trim();
    }
    validarYParsear(xmlString) {
        const xmlDoc = this.parser.parseFromString(xmlString, "application/xml");
        // Comprobación de errores de sintaxis XML (bien formado)
        const parserError = xmlDoc.querySelector("parsererror");
        if (parserError) {
            throw new Error(`[XML Parse Error]: ${parserError.textContent}`);
        }
        const raiz = xmlDoc.documentElement;
        if (raiz.tagName !== "sitioWeb") {
            throw new Error("[DTD Error]: El elemento raíz debe ser <sitioWeb>");
        }
        const lang = raiz.getAttribute("lang");
        if (!lang) {
            throw new Error("[DTD/XSD Error]: El atributo 'lang' es obligatorio en <sitioWeb>");
        }
        // 1. Validar Metadatos
        const metaEl = raiz.querySelector(":scope > metadatos");
        if (!metaEl)
            throw new Error("[DTD Error]: Falta el bloque <metadatos>");
        const email = this.obtenerTexto(metaEl, "email");
        if (!this.esEmailValido(email)) {
            throw new Error(`[XSD Error]: El email '${email}' no cumple la restricción 'tipoEmail'`);
        }
        const anio = this.obtenerTexto(metaEl, "anio");
        if (!this.esAnioValido(anio)) {
            throw new Error(`[XSD Error]: El año '${anio}' no cumple la restricción 'tipoAnio'`);
        }
        const metadatos = {
            autor: this.obtenerTexto(metaEl, "autor"),
            marca: this.obtenerTexto(metaEl, "marca"),
            email,
            anio,
        };
        // 2. Validar Páginas
        const paginasEl = raiz.querySelector(":scope > paginas");
        if (!paginasEl)
            throw new Error("[DTD Error]: Falta el contenedor <paginas>");
        // 2.1 INICIO
        const inicioEl = paginasEl.querySelector(":scope > inicio");
        if (!inicioEl)
            throw new Error("[DTD Error]: Falta la página obligatoria <inicio>");
        const perfilEl = inicioEl.querySelector("perfil");
        if (!perfilEl)
            throw new Error("[DTD Error]: Falta <perfil> en <inicio>");
        const resumenEl = inicioEl.querySelector("resumen");
        if (!resumenEl)
            throw new Error("[DTD Error]: Falta <resumen> en <inicio>");
        const fotoEl = perfilEl.querySelector("foto");
        if (!fotoEl)
            throw new Error("[DTD Error]: Falta <foto> en <perfil>");
        const emailContacto = this.obtenerTexto(perfilEl, "emailContacto");
        if (!this.esEmailValido(emailContacto)) {
            throw new Error(`[XSD Error]: El email de contacto '${emailContacto}' es inválido`);
        }
        const inicio = {
            tituloPagina: this.obtenerTexto(inicioEl, "tituloPagina"),
            descripcionMeta: this.obtenerTexto(inicioEl, "descripcionMeta"),
            perfil: {
                nombre: this.obtenerTexto(perfilEl, "nombre"),
                foto: {
                    ruta: fotoEl.getAttribute("ruta") || "",
                    descripcion: fotoEl.getAttribute("descripcion") || "",
                },
                rol: this.obtenerTexto(perfilEl, "rol"),
                bienvenida: this.obtenerTexto(perfilEl, "bienvenida"),
                emailContacto,
            },
            resumen: {
                tituloSeccion: this.obtenerTexto(resumenEl, "tituloSeccion"),
                parrafo: this.obtenerTexto(resumenEl, "parrafo"),
            },
        };
        // 2.2 SOBRE MÍ
        const sobreMiEl = paginasEl.querySelector(":scope > sobreMi");
        if (!sobreMiEl)
            throw new Error("[DTD Error]: Falta la página obligatoria <sobreMi>");
        const bloquesEls = sobreMiEl.querySelectorAll("bloqueLista");
        if (bloquesEls.length === 0) {
            throw new Error("[DTD Error]: Debe haber al menos un <bloqueLista> en <sobreMi>");
        }
        const bloques = [];
        bloquesEls.forEach((b) => {
            const itemsEls = b.querySelectorAll("item");
            if (itemsEls.length === 0) {
                throw new Error("[DTD Error]: Cada <bloqueLista> debe tener al menos un <item>");
            }
            const items = [];
            itemsEls.forEach((it) => items.push(it.textContent?.trim() || ""));
            bloques.push({
                tituloSeccion: this.obtenerTexto(b, "tituloSeccion"),
                items,
            });
        });
        const sobreMi = {
            tituloPagina: this.obtenerTexto(sobreMiEl, "tituloPagina"),
            descripcionMeta: this.obtenerTexto(sobreMiEl, "descripcionMeta"),
            encabezadoTrayectoria: this.obtenerTexto(sobreMiEl, "encabezadoTrayectoria"),
            bio: this.obtenerTexto(sobreMiEl, "bio"),
            bloques,
        };
        // 2.3 PROYECTOS
        const proyectosEl = paginasEl.querySelector(":scope > proyectos");
        if (!proyectosEl)
            throw new Error("[DTD Error]: Falta la página obligatoria <proyectos>");
        const destacadoEl = proyectosEl.querySelector("proyectoDestacado");
        if (!destacadoEl)
            throw new Error("[DTD Error]: Falta <proyectoDestacado> en <proyectos>");
        const videoEl = destacadoEl.querySelector("video");
        if (!videoEl)
            throw new Error("[DTD Error]: Falta <video> en <proyectoDestacado>");
        const otrosEl = proyectosEl.querySelector("otrosProyectos");
        if (!otrosEl)
            throw new Error("[DTD Error]: Falta <otrosProyectos> en <proyectos>");
        const itemsProyEls = otrosEl.querySelectorAll("proyectoItem");
        const proyItems = [];
        itemsProyEls.forEach((pi) => {
            const enlaceEl = pi.querySelector("enlace");
            if (!enlaceEl || !enlaceEl.getAttribute("url")) {
                throw new Error("[DTD/XSD Error]: <enlace> con atributo 'url' requerido en <proyectoItem>");
            }
            proyItems.push({
                tituloArticulo: this.obtenerTexto(pi, "tituloArticulo"),
                descripcion: this.obtenerTexto(pi, "descripcion"),
                enlaceUrl: enlaceEl.getAttribute("url") || "",
                enlaceTexto: enlaceEl.textContent?.trim() || "",
            });
        });
        const proyectos = {
            tituloPagina: this.obtenerTexto(proyectosEl, "tituloPagina"),
            descripcionMeta: this.obtenerTexto(proyectosEl, "descripcionMeta"),
            tituloGeneral: this.obtenerTexto(proyectosEl, "tituloGeneral"),
            destacado: {
                tituloSeccion: this.obtenerTexto(destacadoEl, "tituloSeccion"),
                descripcion: this.obtenerTexto(destacadoEl, "descripcion"),
                video: {
                    ruta: videoEl.getAttribute("ruta") || "",
                    tipo: videoEl.getAttribute("tipo") || "",
                },
            },
            otros: {
                tituloSeccion: this.obtenerTexto(otrosEl, "tituloSeccion"),
                proyectos: proyItems,
            },
        };
        // 2.4 AFICIONES
        const aficionesEl = paginasEl.querySelector(":scope > aficiones");
        if (!aficionesEl)
            throw new Error("[DTD Error]: Falta la página obligatoria <aficiones>");
        const seccionAudioEl = aficionesEl.querySelector("seccionAudio");
        if (!seccionAudioEl)
            throw new Error("[DTD Error]: Falta <seccionAudio> en <aficiones>");
        const audioEl = seccionAudioEl.querySelector("audio");
        if (!audioEl)
            throw new Error("[DTD Error]: Falta <audio> en <seccionAudio>");
        const coleccionesEls = aficionesEl.querySelectorAll("seccionColeccion");
        const colecciones = [];
        coleccionesEls.forEach((col) => {
            const tipoColeccion = col.getAttribute("tipoColeccion");
            if (tipoColeccion !== "musica" && tipoColeccion !== "cine") {
                throw new Error(`[XSD Error]: tipoColeccion '${tipoColeccion}' no permitido (solo 'musica' o 'cine')`);
            }
            const tarjetasEls = col.querySelectorAll("tarjeta");
            const tarjetas = [];
            tarjetasEls.forEach((t) => {
                const img = t.querySelector("imagen");
                if (!img)
                    throw new Error("[DTD Error]: Falta <imagen> en <tarjeta>");
                tarjetas.push({
                    imagen: {
                        ruta: img.getAttribute("ruta") || "",
                        descripcion: img.getAttribute("descripcion") || "",
                    },
                    tituloArticulo: this.obtenerTexto(t, "tituloArticulo"),
                    subtitulo: this.obtenerTexto(t, "subtitulo"),
                });
            });
            colecciones.push({
                tipoColeccion: tipoColeccion,
                tituloSeccion: this.obtenerTexto(col, "tituloSeccion"),
                ariaNav: this.obtenerTexto(col, "ariaNav"),
                descripcion: this.obtenerTexto(col, "descripcion"),
                tarjetas,
            });
        });
        const aficiones = {
            tituloPagina: this.obtenerTexto(aficionesEl, "tituloPagina"),
            descripcionMeta: this.obtenerTexto(aficionesEl, "descripcionMeta"),
            tituloGeneral: this.obtenerTexto(aficionesEl, "tituloGeneral"),
            audioSeccion: {
                tituloSeccion: this.obtenerTexto(seccionAudioEl, "tituloSeccion"),
                descripcion: this.obtenerTexto(seccionAudioEl, "descripcion"),
                audio: {
                    ruta: audioEl.getAttribute("ruta") || "",
                    tipo: audioEl.getAttribute("tipo") || "",
                },
            },
            colecciones,
        };
        // 2.5 CONTACTO
        const contactoEl = paginasEl.querySelector(":scope > contacto");
        if (!contactoEl)
            throw new Error("[DTD Error]: Falta la página obligatoria <contacto>");
        const formEl = contactoEl.querySelector("formulario");
        if (!formEl)
            throw new Error("[DTD Error]: Falta <formulario> en <contacto>");
        const accionMail = this.obtenerTexto(formEl, "accionMail");
        if (!this.esEmailValido(accionMail)) {
            throw new Error(`[XSD Error]: 'accionMail' '${accionMail}' no es un correo válido`);
        }
        const contacto = {
            tituloPagina: this.obtenerTexto(contactoEl, "tituloPagina"),
            descripcionMeta: this.obtenerTexto(contactoEl, "descripcionMeta"),
            tituloSeccion: this.obtenerTexto(contactoEl, "tituloSeccion"),
            descripcion: this.obtenerTexto(contactoEl, "descripcion"),
            formulario: {
                accionMail,
                etiquetaMensaje: this.obtenerTexto(formEl, "etiquetaMensaje"),
                textoBoton: this.obtenerTexto(formEl, "textoBoton"),
            },
        };
        return {
            lang,
            metadatos,
            inicio,
            sobreMi,
            proyectos,
            aficiones,
            contacto,
        };
    }
}
