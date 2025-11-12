// Utilidades (atajos que me simplifican seleccionar elementos sin repetir document.querySelector)
const qs = (sel, ctx = document) => ctx.querySelector(sel); // Selecciona el primer elemento que coincida
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel)); // Selecciona TODOS y los pasa a array real

// Estado de tema (prefiero manejarlo con una clase en <body>)
// En algunos entornos (SSR / tests) puede no existir window. Verifico antes de ejecutar.
typeof window !== "undefined" &&
  (function () {
    const cuerpo = document.body;
    // Recupero el tema guardado para respetar preferencia del usuario.
    const temaGuardado = localStorage.getItem("tema");
    if (temaGuardado === "claro") cuerpo.classList.add("claro"); // Si estaba en claro la última vez, aplico la clase.

    const botonBarra = qs("#alternarTemaBarra"); // Botón dentro de la barra lateral (desktop)
    const botonMovil = qs("#alternarTemaMovil"); // Botón en el encabezado móvil
    const togglesTema = [botonBarra, botonMovil].filter(Boolean);

    const sincronizarToggleTema = () => {
      const esClaro = cuerpo.classList.contains("claro");
      const valor = esClaro ? "true" : "false";
      togglesTema.forEach((btn) => btn.setAttribute("aria-checked", valor));
    };

    const alternarTema = () => {
      // Alterno la clase "claro" en <body>. toggle devuelve true si la agregó.
      const esClaro = cuerpo.classList.toggle("claro");
      // Persisto la preferencia para futuras visitas.
      localStorage.setItem("tema", esClaro ? "claro" : "oscuro");
      // Mantengo el estado visual del interruptor sincronizado.
      sincronizarToggleTema();
    };

    // Eventos de tema
    sincronizarToggleTema();
    togglesTema.forEach((btn) => btn.addEventListener("click", alternarTema));

    // Navegación y scroll
  const DESPLAZAMIENTO = 80; // Compenso la altura del header móvil para que no tape la sección al hacer scroll.
  const offsetActual = () => (window.innerWidth >= 1024 ? 0 : DESPLAZAMIENTO);
    const secciones = [
      "sobre-mi",
      "habilidades-tecnicas",
      "habilidades-blandas",
      "experiencia",
      "educacion",
      "portafolio",
      "contacto",
    ];
    const botonesNav = qsa(".enlace-nav"); // Botones en la barra lateral (desktop)
    const botonesCajon = qsa(".enlace-cajon"); // Botones dentro del cajón móvil

    const establecerActivo = (id) => {
      // Recorro los botones de la barra y marco activo solo el que apunta a la sección actual.
      botonesNav.forEach((b) =>
        b.classList.toggle("activo", b.getAttribute("data-target") === id)
      );
    };

    const desplazarASeccion = (id) => {
      // Scroll suave a la sección (si existe) usando scrollIntoView + ajuste por header móvil.
      const el = qs(`#${id}`);
      if (!el) return; // Si no encuentro la sección, salgo silenciosamente.
      // Primero llevo la sección al inicio de la ventana
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Luego ajusto el offset para que no quede tapado por el header móvil (en desktop es 0)
      setTimeout(() => {
        const ajuste = offsetActual();
        if (ajuste) window.scrollBy({ top: -ajuste, left: 0, behavior: "auto" });
      }, 80);
    };

    botonesNav.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = btn.getAttribute("data-target");
        desplazarASeccion(id);
      })
    );

    botonesCajon.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const id = btn.getAttribute("data-target");
        desplazarASeccion(id);
        cerrarCajon(); // Cierro el cajón móvil después de elegir una sección.
      })
    );

    // Observador para resaltar la sección activa de forma más confiable que con cálculos manuales
    const observarSecciones = () => {
      const elementos = secciones
        .map((id) => ({ id, el: qs(`#${id}`) }))
        .filter((x) => !!x.el);

      if (!elementos.length) return;

      let ultimoActivo = null;
      const io = new IntersectionObserver(
        (entries) => {
          // Busco la entrada visible con mayor ratio
          const visibles = entries.filter((e) => e.isIntersecting);
          if (!visibles.length) return;
          visibles.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          const candidata = visibles[0];
          const id = candidata.target.getAttribute("id");
          if (id && id !== ultimoActivo) {
            ultimoActivo = id;
            establecerActivo(id);
          }
        },
        {
          // Un umbral medio: cuando ~60% está a la vista la consideramos activa
          threshold: [0.6],
        }
      );

      // Observo todas las secciones relevantes
      elementos.forEach(({ el }) => io.observe(el));
    };
    observarSecciones();

    // Drawer móvil y barra lateral
    const cajon = qs("#cajon-movil"); // Panel lateral deslizante en mobile
    const barraLateral = qs("#barra-lateral"); // Barra fija en desktop (por si a futuro la alterno)
    const alternarCajonBtn = qs("#alternarMenuMovil"); // Botón hamburguesa / cerrar

    const abrirCajon = () => {
      cajon.hidden = false; // Aseguro que el panel sea visible en el DOM.
      cajon.getBoundingClientRect(); // Fuerzo reflow para que la transición se active correctamente.
      cajon.classList.add("abierto"); // Clase que mueve el cajón a la vista.
      alternarCajonBtn.setAttribute("aria-expanded", "true"); // Accesibilidad: refleja estado expandido.
      alternarCajonBtn.innerHTML = '<i data-lucide="x"></i>'; // Cambio ícono a "X".
      cuerpo.classList.add("drawer-open"); // Agrego overlay y bloqueo de scroll.
      if (window.lucide) window.lucide.createIcons(); // Re-render ícono cambiado.
    };

    const cerrarCajon = () => {
      cajon.classList.remove("abierto"); // Quita la clase que lo muestra.
      alternarCajonBtn.setAttribute("aria-expanded", "false"); // Accesibilidad: ya no expandido.
      alternarCajonBtn.innerHTML = '<i data-lucide="menu"></i>'; // Vuelvo a hamburguesa.
      cuerpo.classList.remove("drawer-open"); // Quito overlay y permito scroll.
      if (window.lucide) window.lucide.createIcons();
      // Espero la duración de la transición antes de volver a ocultar el nodo.
      setTimeout(() => {
        if (!cajon.classList.contains("abierto")) cajon.hidden = true;
      }, 300);
    };

    // Función para manejar el menú según el tamaño de pantalla
    const manejarMenu = () => {
      const esEscritorio = window.innerWidth >= 1024; // Punto de quiebre donde uso barra fija.
      if (esEscritorio) {
        // Si paso a escritorio y el cajón sigue abierto lo cierro para evitar estados raros.
        if (cajon && cajon.classList.contains("abierto")) cerrarCajon();
      }
    };

    // Evento para el botón del drawer/barra lateral
    alternarCajonBtn &&
      alternarCajonBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Evito que el click burbujee y dispare el cierre global.
        const esEscritorio = window.innerWidth >= 1024;
        if (esEscritorio) {
          // En desktop actualmente no oculto la barra. (Lugar reservado para futuro toggle)
        } else {
          // En móvil alterno apertura/cierre
          cajon.classList.contains("abierto") ? cerrarCajon() : abrirCajon();
        }
      });

    // Cerrar drawer al hacer clic fuera de él
    document.addEventListener("click", (e) => {
      if (
        cajon &&
        cajon.classList.contains("abierto") &&
        !cajon.contains(e.target) &&
        !alternarCajonBtn.contains(e.target)
      ) {
        cerrarCajon(); // Clic fuera = cierro (patrón común de drawers / modales)
      }
    });

    // Manejar cambios de tamaño de ventana
    window.addEventListener("resize", manejarMenu);

    // Inicializar iconos al cargar
    window.addEventListener("DOMContentLoaded", () => {
      if (window.lucide) window.lucide.createIcons(); // Creo todos los íconos Lucide iniciales.
      sincronizarToggleTema(); // Ajusto el estado visual del toggle según preferencia guardada.
    });

    // Animación tipo 'typed' para el subtítulo del hero (múltiples frases)
    // (me gusta este efecto sutil para mostrar distintas facetas)
    const frasesAnimadas = [
      "Estudiante de Desarrollo de Software.",
      "QA y Tester Web en formación.",
      "Apasionado por el aprendizaje continuo.",
      "Enfocado en soporte técnico y automatización.",
      "Futuro desarrollador full stack.",
    ];
    const subtituloAnimado = document.getElementById("escrito"); // Span donde "tipeo"
    const cursorAnimado = document.querySelector(".cursor-tecleado"); // El cursor visual
    let indiceFrase = 0; // Posición actual en array de frases
    let indiceCaracter = 0; // Índice del caracter que estoy escribiendo/borrando
    let estaBorrando = false; // Estado: escribiendo o borrando

    function animarSubtitulo() {
      if (!subtituloAnimado) return; // Si el span no existe (por algún cambio), salgo.
      const fraseActual = frasesAnimadas[indiceFrase];
      if (!estaBorrando) {
        // ESCRIBIENDO: agrego un caracter.
        subtituloAnimado.textContent = fraseActual.substring(0, indiceCaracter + 1);
        indiceCaracter++;
        if (indiceCaracter === fraseActual.length) {
          // Llegué al final, espero un momento y cambio a modo borrar.
          estaBorrando = true;
          setTimeout(animarSubtitulo, 1200);
        } else {
          setTimeout(animarSubtitulo, 40); // Velocidad de tipeo
        }
      } else {
        // BORRANDO: elimino un caracter.
        subtituloAnimado.textContent = fraseActual.substring(0, indiceCaracter - 1);
        indiceCaracter--;
        if (indiceCaracter === 0) {
          // Terminé de borrar; avanzo a la siguiente frase y vuelvo a escribir.
          estaBorrando = false;
          indiceFrase = (indiceFrase + 1) % frasesAnimadas.length; // Ciclo circular
          setTimeout(animarSubtitulo, 400);
        } else {
          setTimeout(animarSubtitulo, 30); // Borrado un poquito más rápido
        }
      }
      // Parpadeo manual del cursor para acompañar el efecto.
      if (cursorAnimado) {
        cursorAnimado.style.opacity = cursorAnimado.style.opacity === "0" ? "1" : "0";
      }
    }
    // Inicio la animación inmediatamente (el script usa defer, así que el DOM ya está parseado)
    animarSubtitulo();

    // ========== Manejo del formulario de contacto ==========
    const formularioContacto = document.getElementById('formContacto');
    
    if (formularioContacto) {
      formularioContacto.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evito que recargue la página
        
        const botonEnviar = formularioContacto.querySelector('button[type="submit"]');
        const textoOriginal = botonEnviar.innerHTML;
        
        // Obtengo los valores del formulario
        const datos = {
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          message: document.getElementById('message').value.trim()
        };
        
        // Validación básica del lado del cliente
        if (!datos.name || !datos.email || !datos.message) {
          mostrarMensaje('Por favor completa todos los campos', 'error');
          return;
        }
        
        // Deshabilito el botón y muestro estado de carga
        botonEnviar.disabled = true;
        botonEnviar.innerHTML = '<i data-lucide="loader"></i> Enviando...';
        if (window.lucide) window.lucide.createIcons();
        
        try {
          // API URL: usa la ruta relativa cuando está en producción, localhost en desarrollo
          const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000'
            : '';
          
          // Envío los datos al backend
          const respuesta = await fetch(`${API_URL}/api/contact`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
          });
          
          const resultado = await respuesta.json();
          
          if (resultado.success) {
            // Éxito: limpio el formulario y muestro mensaje
            formularioContacto.reset();
            mostrarMensaje('¡Mensaje enviado con éxito! Te responderé pronto.', 'success');
          } else {
            // Error del servidor
            mostrarMensaje(resultado.message || 'Error al enviar el mensaje', 'error');
          }
        } catch (error) {
          console.error('Error al enviar el formulario:', error);
          mostrarMensaje('Error de conexión. Por favor, intenta de nuevo.', 'error');
        } finally {
          // Restauro el botón
          botonEnviar.disabled = false;
          botonEnviar.innerHTML = textoOriginal;
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }
    
    // Función auxiliar para mostrar mensajes al usuario
    function mostrarMensaje(texto, tipo) {
      // Creo un elemento de notificación
      const notificacion = document.createElement('div');
      notificacion.className = `notificacion notificacion-${tipo}`;
      notificacion.textContent = texto;
      
      // Estilos inline para la notificación (puedes moverlos a CSS si prefieres)
      Object.assign(notificacion.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        zIndex: '10000',
        fontWeight: '500',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out',
        backgroundColor: tipo === 'success' ? '#10b981' : '#ef4444',
        color: '#fff'
      });
      
      document.body.appendChild(notificacion);
      
      // Elimino la notificación después de 5 segundos
      setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notificacion.remove(), 300);
      }, 5000);
    }
  })();
