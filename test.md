# Plan de Testing — Portfolio Angular 20

> Documento exhaustivo de testing manual, funcional y unitario para el portfolio en Angular.
> Adapté este plan al estado actual del proyecto en `/portfolio/frontend`.
> Cada sección contiene checks organizados por componente y funcionalidad.
> Clasificación: **P0** = Crítico | **P1** = Alto | **P2** = Medio | **P3** = Bajo

---

## Bugs conocidos y resueltos

| ID   | Prioridad | Estado     | Descripción                                                                 |
|------|-----------|------------|-----------------------------------------------------------------------------|
| B001 | P0        | ✅ Resuelto | CTAs Hero ("Ver mis proyectos" / "Contactame") no scrollean en primera carga |

### B001 — CTAs del Hero no navegan correctamente en primera carga

**Síntoma:** Al cargar la página por primera vez y hacer clic en "Ver mis proyectos" o "Contactame",
el scroll no llega a la sección o llega a una posición incorrecta.

**Causa raíz:** `SeccionHeroComponent.scrollTo()` llama directamente a
`document.getElementById(sectionId)?.scrollIntoView(...)` sin forzar la carga de las secciones
lazy. Las secciones Portfolio y Contacto están envueltas en `@defer` en `AppComponent`. En la
primera carga, `forcePortfolio` y `forceContacto` son `false`, por lo que en el DOM solo existe
el placeholder (`LazySectionComponent` con el ID por host binding). El scroll suave se inicia
sobre el placeholder, pero casi simultáneamente el `@defer on viewport` se activa y reemplaza
el placeholder con el componente real, causando un layout shift que desposiciona el resultado.

**Solución aplicada:** Los botones CTA del Hero ahora emiten un `@Output() navTo` hacia
`AppComponent`, que ejecuta `handleNavClick()`. Este método ya maneja correctamente:
1. Forzar las signals de carga lazy para las secciones necesarias.
2. Esperar doble `requestAnimationFrame` para que Angular termine de renderizar.
3. Ejecutar `scrollIntoView` sobre el elemento ya presente en el DOM.
4. Un segundo scroll de corrección a 500ms para compensar cualquier layout shift residual.

**Archivos modificados:**
- `seccion-hero.component.ts` — agregado `@Output() navTo = new EventEmitter<string>()`
- `seccion-hero.component.html` — CTAs usan `navTo.emit(...)` en vez de `scrollTo(...)`
- `app.component.html` — `<app-seccion-hero>` ahora escucha `(navTo)="handleNavClick($event)"`

---

## Estado actual de cobertura

| Elemento                           | Tiene spec | Tests | Estado       |
|------------------------------------|------------|-------|--------------|
| `api.service.ts`                   | ✅ Sí      | 6     | Funcionando  |
| `tema.service.ts`                  | ❌ No      | 0     | Pendiente    |
| `seo.service.ts`                   | ❌ No      | 0     | Pendiente    |
| `animate-on-scroll.directive.ts`   | ❌ No      | 0     | Pendiente    |
| `parallax.directive.ts`            | ❌ No      | 0     | Pendiente    |
| 21 componentes                     | ❌ No      | 0     | Pendiente    |
| **TOTAL**                          |            | **6** | **< 1%**     |

### Prioridad de creación de specs

| Prioridad | Elemento                           | Motivo                                              |
|-----------|------------------------------------|-----------------------------------------------------|
| P0        | `tema.service.ts`                  | Base de todo el theming, afecta toda la app          |
| P0        | `seo.service.ts`                   | Meta tags y JSON-LD, afecta indexación               |
| P0        | `animate-on-scroll.directive.ts`   | Usada en todas las secciones                         |
| P0        | `parallax.directive.ts`            | Manejo complejo de scroll + rAF + NgZone             |
| P0        | `app.component.ts`                 | Componente raíz, scroll spy, layout                  |
| P0        | `seccion-contacto.component.ts`    | Formulario, validación, integración API + Turnstile  |
| P0        | `seccion-portfolio.component.ts`   | Filtros, modal, carrusel, lightbox                   |
| P1        | `seccion-hero.component.ts`        | Typewriter, contadores, CTAs                         |
| P1        | `barra-lateral.component.ts`       | Navegación, pill indicator, progreso                 |
| P1        | `encabezado-movil.component.ts`    | Drawer, toggle, responsive                           |
| P1        | `paleta-comandos.component.ts`     | Búsqueda, teclado, acciones                          |
| P1        | `project-modal.component.ts`       | Modal con carrusel y lightbox                        |
| P1        | `image-carousel.component.ts`      | Navegación de imágenes                               |
| P1        | `image-lightbox.component.ts`      | Fullscreen de imágenes                               |
| P2        | Secciones estáticas (6)            | Sobre mí, Skills, Idiomas, Experiencia, Educación    |
| P2        | `scroll-indicator.component.ts`    | Componente simple de navegación                      |
| P2        | `boton-scroll-arriba.component.ts` | Botón con visibilidad condicional                    |
| P2        | `splash-screen.component.ts`       | Timer + animación de entrada                         |
| P2        | `lazy-section.component.ts`        | Skeletons con variantes                              |
| P2        | `imagen-fallback.component.ts`     | Fallback de imágenes rotas                           |

---

## Tabla de contenidos

1. [Splash Screen](#1-splash-screen)
2. [Tema claro / oscuro](#2-tema-claro--oscuro)
3. [Sidebar (Desktop)](#3-sidebar-desktop)
4. [Encabezado móvil y drawer](#4-encabezado-móvil-y-drawer)
5. [Sección Hero](#5-sección-hero)
6. [Sección "Sobre mí"](#6-sección-sobre-mí)
7. [Sección "Habilidades técnicas"](#7-sección-habilidades-técnicas)
8. [Sección "Habilidades blandas"](#8-sección-habilidades-blandas)
9. [Sección "Idiomas"](#9-sección-idiomas)
10. [Sección "Experiencia profesional"](#10-sección-experiencia-profesional)
11. [Sección "Educación"](#11-sección-educación)
12. [Sección "Portfolio"](#12-sección-portfolio)
13. [Sección "Contacto"](#13-sección-contacto)
14. [Footer](#14-footer)
15. [Botón scroll arriba](#15-botón-scroll-arriba)
16. [Paleta de comandos (Ctrl+K)](#16-paleta-de-comandos-ctrlk)
17. [Scroll indicators](#17-scroll-indicators)
18. [Lazy loading (@defer)](#18-lazy-loading-defer)
19. [Accesibilidad (a11y)](#19-accesibilidad-a11y)
20. [SEO](#20-seo)
21. [Responsive design](#21-responsive-design)
22. [Performance](#22-performance)
23. [Cross-browser](#23-cross-browser)
24. [Errores y edge cases](#24-errores-y-edge-cases)
25. [Datos y contenido](#25-datos-y-contenido)
26. [Tests unitarios (Jasmine + Karma)](#26-tests-unitarios-jasmine--karma)
27. [API serverless (contacto)](#27-api-serverless-contacto)
28. [Internacionalización (i18n)](#28-internacionalización-i18n)

---

## 1. Splash Screen

### 1.1 Carga inicial (P0)
- [ ] Al abrir la página se muestra el splash con las iniciales animadas.
- [ ] El splash desaparece automáticamente después de ~1200ms.
- [ ] La transición de salida (fade out + scale) es suave, sin parpadeo ni corte.
- [ ] Después del splash, el layout principal (sidebar + contenido) se renderiza completo.
- [ ] El `@Output() finished` se emite correctamente y el padre oculta el splash.

### 1.2 Reduced motion (P1)
- [ ] Con `prefers-reduced-motion: reduce` activado, el splash se emite inmediatamente (0ms).
- [ ] No hay animación de clip-path ni fade-out.

### 1.3 Edge cases (P2)
- [ ] Recargar la página (F5) repite el splash correctamente.
- [ ] En conexiones lentas (throttle a Slow 3G en DevTools) el splash no queda pegado indefinidamente.

---

## 2. Tema claro / oscuro

### 2.1 Estado por defecto (P0)
- [ ] La página arranca en modo **oscuro** por defecto (sin preferencia guardada en localStorage).
- [ ] El fondo (`--background: #0c1222`), textos, bordes y cards respetan las variables CSS del tema oscuro.
- [ ] La clase `.dark` está aplicada en el elemento `<html>`.

### 2.2 Toggle de tema (P0)
- [ ] Al hacer clic en el toggle de Sol/Luna en la sidebar, el tema cambia instantáneamente.
- [ ] Todos los elementos cambian de color correctamente: fondo, textos, cards, bordes, badges, pills, botones.
- [ ] El ícono de la sidebar alterna entre Sol y Luna.
- [ ] El `TemaService` actualiza su signal interno.

### 2.3 Persistencia (P1)
- [ ] Cambiar a tema claro, cerrar la pestaña y reabrir: se mantiene el tema claro.
- [ ] Verificar en DevTools > Application > localStorage que existe la clave `portfolio-theme`.
- [ ] Borrar localStorage y recargar: vuelve al tema oscuro por defecto.

### 2.4 Consistencia visual por sección (P1)
- [ ] **Hero**: fondo gradiente (`--portfolio-hero-from/to`), textos y decoraciones se adaptan.
- [ ] **Sobre mí**: bento cards, pills de stack, textos.
- [ ] **Habilidades técnicas**: cards flip, badges de nivel, tags.
- [ ] **Habilidades blandas**: cards con íconos y acentos de color.
- [ ] **Idiomas**: banderas, badges, detalles.
- [ ] **Experiencia**: cards, métricas, chips de tecnologías.
- [ ] **Educación**: cards, badges de estado, promedios.
- [ ] **Portfolio**: cards de proyecto, filtros, modal, lightbox.
- [ ] **Contacto**: formulario, botones, estados de error, links de contacto.
- [ ] **Paleta de comandos**: fondo overlay, lista de items, texto de búsqueda.

---

## 3. Sidebar (Desktop)

### 3.1 Renderizado (P0)
- [ ] Se muestra en pantallas >= 1024px (`$bp-lg`).
- [ ] Tiene ancho fijo de 280px (`$sidebar-width`), es fija (no scrollea con el contenido).
- [ ] Muestra el avatar, nombre, título profesional.
- [ ] Los 9 items de navegación (`NAV_ITEMS`) se listan correctamente con íconos Lucide.

### 3.2 Navegación (P0)
- [ ] Al hacer clic en cada item, el contenido scrollea suavemente a la sección correspondiente.
- [ ] El item activo se resalta visualmente (pill animada con color accent y fondo).
- [ ] Al scrollear manualmente el contenido, el item activo se actualiza en tiempo real (scroll spy).
- [ ] Al llegar al final de la página, se activa el último item ("Contacto").
- [ ] Al hacer clic en "Inicio", scrollea al tope (hero).

### 3.3 Pill indicator (P1)
- [ ] La pill se posiciona sobre el item activo mediante signal (`pillPos`).
- [ ] La primera posición se define sin transición (evita salto visual inicial).
- [ ] Las transiciones posteriores son suaves (CSS transition).

### 3.4 Barra de progreso (P1)
- [ ] La barra de progreso de scroll se muestra en la sidebar.
- [ ] Se llena proporcionalmente conforme se scrollea (manipulación directa del DOM, sin re-render).
- [ ] Al 100% del scroll, la barra está completa.
- [ ] Al volver al tope, la barra está vacía.

### 3.5 Tooltip (P2)
- [ ] Al hacer hover sobre un item no activo, aparece un tooltip después de 400ms.
- [ ] Si el mouse se mueve antes de 400ms, el tooltip no aparece.
- [ ] El item activo no muestra tooltip.

### 3.6 Toggle de tema en sidebar (P1)
- [ ] El botón de Sol/Luna está visible y accesible.
- [ ] Cambiar tema desde la sidebar refleja el cambio inmediatamente en toda la página.

---

## 4. Encabezado móvil y drawer

### 4.1 Renderizado (P0)
- [ ] En pantallas < 1024px, la sidebar desaparece y aparece un header fijo con ícono hamburguesa.
- [ ] El header se mantiene visible al scrollear (`position: fixed`, `z-index: $z-header`).

### 4.2 Drawer / menú lateral (P0)
- [ ] Al tocar el ícono hamburguesa, se abre el drawer con la lista de navegación (reutiliza `BarraLateralComponent`).
- [ ] El fondo detrás del drawer se bloquea (no scrollea).
- [ ] Al tocar un item de navegación, el drawer se cierra y scrollea a la sección.
- [ ] Al tocar la X o fuera del drawer (overlay), se cierra.

### 4.3 Scroll-to-top en header (P1)
- [ ] El header incluye un botón que lleva al inicio (`scrollTo(0)`).

### 4.4 Transiciones (P2)
- [ ] El drawer tiene animación de entrada (slide-in).
- [ ] El overlay de fondo (backdrop) aparece con fade.

---

## 5. Sección Hero

### 5.1 Contenido (P0)
- [ ] Se muestra el nombre "Marcos Ezequiel Toledo".
- [ ] Aparece el subtítulo con efecto typewriter (4 frases rotativas).
- [ ] Los botones de CTA están presentes: "Ver mis proyectos" y "Contactame".
- [ ] Los links sociales están visibles: GitHub, LinkedIn, Email, Descargar CV.

### 5.2 Typewriter (P1)
- [ ] El texto se escribe carácter por carácter (~60ms/char) y se borra cíclicamente.
- [ ] Pausa de ~4 segundos entre frases.
- [ ] Los botones de flecha izquierda/derecha cambian la frase manualmente.
- [ ] Al cambiar frase manualmente, el auto-typing se pausa y luego retoma.
- [ ] El cursor parpadea (`|`) al final del texto.

### 5.3 Contadores animados (P1)
- [ ] Los stats (ej: "8+ Proyectos", "18 Tecnologías") se animan con stagger.
- [ ] La animación se ejecuta una sola vez (no se repite al volver a la sección).
- [ ] Se completan en ~800ms.

### 5.4 Figuras decorativas (P2)
- [ ] Las figuras con parallax (`appParallax`) se desplazan al scrollear.
- [ ] El patrón de puntos (dot pattern) es visible como textura sutil.
- [ ] Las decoraciones tienen `aria-hidden="true"`.

### 5.5 Links y acciones (P0)
- [ ] GitHub abre `https://github.com/marcostoledo96` en nueva pestaña.
- [ ] LinkedIn abre `https://linkedin.com/in/marcostoledo96` en nueva pestaña.
- [ ] Email no expone la dirección directamente en el HTML (se construye dinámicamente).
- [ ] "Descargar CV" dispara descarga o abre el PDF.
- [ ] "Ver mis proyectos" scrollea a la sección Portfolio.
- [ ] "Contactame" scrollea a la sección Contacto.

### 5.6 Responsive (P1)
- [ ] En mobile, los botones se apilan correctamente sin desbordarse.
- [ ] El texto no se trunca ni desborda en pantallas de 320px.

---

## 6. Sección "Sobre mí"

### 6.1 Contenido (P0)
- [ ] El título "Sobre mí" se muestra con el ícono y la línea decorativa.
- [ ] Se muestra un párrafo descriptivo (bio personal).
- [ ] Las 3 cards de bento grid aparecen: Bio, Stack actual, Aprendiendo.

### 6.2 Pills / Tags (P1)
- [ ] Las pills de "Stack actual" muestran las tecnologías correctas (~12 chips, color acento).
- [ ] Las pills de "Aprendiendo" muestran las tecnologías en formación (~7 chips, color violeta).
- [ ] Los colores de pills son coherentes con el tema activo.

### 6.3 Animaciones (P2)
- [ ] Las cards aparecen con animación `appAnimateOnScroll` al entrar en viewport.
- [ ] Las animaciones solo ocurren una vez (se desuscribe tras primera detección).

### 6.4 Responsive (P1)
- [ ] En mobile, las cards se apilan en una columna.
- [ ] En desktop, se disponen en grid.

---

## 7. Sección "Habilidades técnicas"

### 7.1 Grid de cards (P0)
- [ ] Se muestran 18 cards de tecnologías con: imagen, nombre, contexto, rating (estrellas 1-5).
- [ ] Las imágenes cargan correctamente (`.webp` / `.svg` con `ImagenFallbackComponent`).
- [ ] El grid es responsive: 1 columna en mobile, 2 en sm, 3 en md, 4 en lg/xl.

### 7.2 Card flip 3D (P1)
- [ ] Al hacer hover (desktop), la card rota en 3D mostrando el reverso con más contexto.
- [ ] Al hacer clic (mobile), la card rota igualmente.
- [ ] La rotación es suave.
- [ ] Las descripciones no desbordan la card.

### 7.3 Auto-flip (P2)
- [ ] Las cards rotan automáticamente en ciclo entre skills.
- [ ] Al hacer clic manualmente, el auto-flip se pausa temporalmente.

### 7.4 Tarjeta especial (P2)
- [ ] La tarjeta "Proactividad" tiene lógica separada y se muestra correctamente.

### 7.5 Reduced motion (P1)
- [ ] Con `prefers-reduced-motion: reduce` activado, las cards **no** hacen flip 3D.
- [ ] Se muestra toda la información en una vista plana.

### 7.6 Imágenes fallback (P2)
- [ ] Si una imagen de skill falla al cargar, se muestra el placeholder SVG genérico (vía `ImagenFallbackComponent`).

---

## 8. Sección "Habilidades blandas"

### 8.1 Cards (P0)
- [ ] Se muestran 6 soft skills con nombre, ícono Lucide y descripción.
- [ ] Cada card tiene un color de acento propio (azul, naranja, verde, rojo, violeta, índigo).
- [ ] Los íconos Lucide se renderizan correctamente.

### 8.2 Animaciones (P2)
- [ ] Las cards aparecen con animación `appAnimateOnScroll` al entrar en viewport.

### 8.3 Responsive (P1)
- [ ] Grid de 1 columna en mobile, 2 en tablet, 3 en desktop.

---

## 9. Sección "Idiomas"

### 9.1 Contenido (P0)
- [ ] Se muestran 2 idiomas: Español (Nativo) e Inglés (Básico/Intermedio).
- [ ] Cada idioma tiene bandera SVG, nivel y detalles descriptivos.

### 9.2 Banderas SVG (P1)
- [ ] La bandera de Argentina se renderiza correctamente (sanitizada con `DomSanitizer.bypassSecurityTrustHtml`).
- [ ] La bandera de Estados Unidos se renderiza correctamente.
- [ ] Las banderas tienen bordes redondeados.

### 9.3 Badges de nivel (P1)
- [ ] El badge "Nativo" tiene un color diferenciado del badge no nativo.

### 9.4 Responsive (P1)
- [ ] Las cards de idioma se apilan correctamente en mobile.

---

## 10. Sección "Experiencia profesional"

### 10.1 Entrada (P0)
- [ ] Se muestra la experiencia de AEROTEST (Enero 2022 – Actualidad).
- [ ] Muestra: empresa, ubicación (Belgrano, CABA), período.
- [ ] Se listan 5 pills de roles: Tester, Soporte, Chatbot Dev, Web Dev, Técnico.

### 10.2 Responsabilidades y métricas (P0)
- [ ] Se listan 7 bullets de responsabilidades.
- [ ] Se muestran 4 KPIs: 30+ bugs detectados, 80% reducción tiempos, 40+ flujos automatizados, 10+ capacitados.

### 10.3 Tecnologías (P1)
- [ ] Se muestran 6 tags de tecnologías usadas.

### 10.4 Animaciones (P2)
- [ ] Los elementos aparecen con `appAnimateOnScroll` al entrar en viewport.

### 10.5 Responsive (P1)
- [ ] En mobile, las métricas se wrappean sin romper el layout.
- [ ] El padding interno se ajusta correctamente entre breakpoints.

---

## 11. Sección "Educación"

### 11.1 Contenido (P0)
- [ ] Se muestran 2 formaciones: Tecnicatura en Desarrollo de Software (en curso) y Tecnicatura en Radiología (completada).
- [ ] Cada una tiene: carrera, institución, descripción, estado (badge), período, promedio.

### 11.2 Promedios (P1)
- [ ] Desarrollo de Software: promedio 9.19.
- [ ] Radiología: promedio 8.28.
- [ ] El formato numérico es correcto (con punto decimal).

### 11.3 Badges de estado (P1)
- [ ] "En curso" se muestra con un estilo diferenciado (color, borde).
- [ ] "Completado" se muestra con otro estilo.
- [ ] Los íconos Lucide asociados renderizan correctamente.

---

## 12. Sección "Portfolio"

### 12.1 Proyectos (P0)
- [ ] Se muestran 9 proyectos con: título, descripción corta, imagen thumbnail, estado, tecnologías.
- [ ] Los 4 proyectos featured tienen indicador visual (badge "Destacado" o similar).
- [ ] Las imágenes cargan vía `ImagenFallbackComponent` (fallback si fallan).

### 12.2 Filtros (P0)
- [ ] Los filtros de estado funcionan: "Todos", "En desarrollo", "Finalizado".
- [ ] Al filtrar, las cards se actualizan visualmente.
- [ ] El filtro activo se resalta con estilo diferenciado.
- [ ] El conteo por filtro es correcto.

### 12.3 Efecto tilt 3D (P2)
- [ ] Al mover el mouse sobre una card, se aplica un efecto tilt 3D sutil (mouse tracking).
- [ ] El efecto se desactiva con `prefers-reduced-motion: reduce`.

### 12.4 Modal de detalle (P0)
- [ ] Al hacer clic en una card, se abre un modal (`ProjectModalComponent`) con animación de entrada.
- [ ] El modal tiene: título, descripción completa, carrusel de imágenes, badges, tech tags, links.
- [ ] El modal se puede cerrar con la X, tecla Escape, o clic en el overlay (backdrop).

### 12.5 Carrusel de imágenes (P1)
- [ ] Las flechas izquierda/derecha navegan entre imágenes del proyecto.
- [ ] Los indicadores de posición (dots) se actualizan correctamente.
- [ ] Las imágenes cargan correctamente (no broken images).

### 12.6 Lightbox (P1)
- [ ] Al hacer clic en una imagen del carrusel, se abre un lightbox a pantalla completa.
- [ ] El lightbox se cierra con Escape o clic en X.
- [ ] Escape desde el lightbox vuelve al carrusel (no cierra el modal completo).

### 12.7 Links de proyecto (P0)
- [ ] Los links de "Sitio web" y "GitHub" abren las URLs correctas en nueva pestaña.
- [ ] Para proyectos sin repositorio, el botón no se muestra o está deshabilitado.
- [ ] Todos los links externos tienen `target="_blank"` y `rel="noopener noreferrer"`.

### 12.8 Responsive (P1)
- [ ] Grid de 1 columna en mobile, 2 en tablet, hasta 4 en desktop grande.
- [ ] Las imágenes mantienen aspect ratio.
- [ ] El modal es scrollable en mobile si el contenido excede la pantalla.

---

## 13. Sección "Contacto"

### 13.1 Formulario (P0)
- [ ] Campos visibles: Nombre, Email, Mensaje.
- [ ] Todos los campos son obligatorios.
- [ ] El botón "Enviar" está presente.

### 13.2 Validación (P0)
- [ ] **Nombre**: error si vacío o < 2 caracteres.
- [ ] **Email**: error si vacío o formato inválido.
- [ ] **Mensaje**: error si vacío o < 10 caracteres.
- [ ] **Mensaje**: límite de 1000 caracteres (no permite escribir más).
- [ ] Los errores se muestran después de perder foco en el campo (on-blur, no antes).
- [ ] Contador de caracteres visible en el campo de mensaje (cambia color al acercarse al límite).

### 13.3 Honeypot (P1)
- [ ] Existe un campo invisible (honeypot) para prevenir spam.
- [ ] Si el honeypot tiene contenido al enviar, el formulario se bloquea silenciosamente.

### 13.4 CAPTCHA — Cloudflare Turnstile (P1)
- [ ] Se muestra el widget de Turnstile (modo interaction-only).
- [ ] El botón de enviar está deshabilitado hasta que se verifique el CAPTCHA.
- [ ] Al verificar exitosamente, el botón se habilita.

### 13.5 Envío (P0)
- [ ] Al enviar con datos válidos, se muestra un estado de "enviando" (spinner, botón deshabilitado).
- [ ] Tras envío exitoso, se muestra un mensaje de éxito durante ~5 segundos.
- [ ] El formulario se resetea después del envío exitoso.
- [ ] Si hay error del servidor, se muestra mensaje de error apropiado.

### 13.6 Links de contacto alternativos (P1)
- [ ] Se muestran links a GitHub, LinkedIn, Email, Descargar CV.
- [ ] El botón de Email copia la dirección al clipboard y muestra "¡Copiado!" durante ~2 segundos.
- [ ] Todos los links funcionan correctamente.

### 13.7 Cleanup (P2)
- [ ] En `ngOnDestroy`, se limpian los timers y se destruye el widget de Turnstile.
- [ ] No hay memory leaks al navegar fuera y volver a la sección.

### 13.8 Responsive (P1)
- [ ] El formulario ocupa el ancho completo en mobile, dos columnas en desktop.
- [ ] Los campos no se desbordan en pantallas de 320px.

---

## 14. Footer

### 14.1 Contenido (P0)
- [ ] Se muestra el mapa del sitio con links funcionales a las secciones.
- [ ] Se muestran íconos sociales: GitHub, LinkedIn, Email.
- [ ] Se muestra el texto de copyright con año correcto.
- [ ] Se muestra "Hecho con ❤️ en Buenos Aires" (o equivalente).

### 14.2 Navegación (P0)
- [ ] Cada link del mapa del sitio scrollea a la sección correspondiente.
- [ ] Los íconos sociales abren las URLs correctas en nueva pestaña.
- [ ] El email está ofuscado (no expuesto directamente en el HTML).

### 14.3 Animaciones (P2)
- [ ] Los elementos aparecen con fade al entrar en viewport.

---

## 15. Botón scroll arriba

### 15.1 Visibilidad (P0)
- [ ] El botón **no** se muestra cuando `scrollTop < 400px`.
- [ ] El botón **aparece** después de scrollear más de 400px.
- [ ] El botón **desaparece** al volver arriba del umbral.

### 15.2 Funcionalidad (P0)
- [ ] Al hacer clic, emite el evento `clicked` y el padre ejecuta `scrollTo(0, smooth)`.
- [ ] La animación de entrada/salida es suave (spring-like via `@fadeScale`).

### 15.3 Posición (P1)
- [ ] Está fijo en la esquina inferior derecha.
- [ ] No se superpone con contenido crítico.
- [ ] Tiene `z-index: $z-scroll-top` (40).

---

## 16. Paleta de comandos (Ctrl+K)

### 16.1 Apertura (P0)
- [ ] `Ctrl+K` (Windows/Linux) o `Cmd+K` (Mac) abre la paleta de comandos.
- [ ] Se muestra un overlay oscuro con un campo de búsqueda con autofocus.

### 16.2 Búsqueda (P0)
- [ ] Al escribir, se filtran los items (secciones, proyectos, acciones).
- [ ] La búsqueda normaliza acentos (ej: "sobre" encuentra "Sobre mí").
- [ ] Si no hay resultados, se muestra un mensaje apropiado.
- [ ] Los resultados se agrupan por categoría (Secciones, Proyectos, Acciones).

### 16.3 Categorías (P0)
- [ ] **Secciones**: 9 items (Inicio, Sobre mí, Habilidades técnicas, ..., Contacto).
- [ ] **Proyectos**: 9 proyectos del portfolio.
- [ ] **Acciones**: Cambiar tema, Descargar CV, link a GitHub.

### 16.4 Navegación por teclado (P1)
- [ ] Flechas arriba/abajo navegan entre los items.
- [ ] Enter selecciona el item resaltado.
- [ ] Escape cierra la paleta.

### 16.5 Acciones (P0)
- [ ] Seleccionar una sección scrollea a esa sección y cierra la paleta.
- [ ] La acción "Cambiar tema" alterna entre claro y oscuro (delega a `TemaService`).
- [ ] La acción "Descargar CV" funciona correctamente.
- [ ] Seleccionar un proyecto navega a la sección Portfolio.

### 16.6 Cierre (P1)
- [ ] Clic fuera de la paleta (overlay) la cierra.
- [ ] Escape la cierra.
- [ ] Seleccionar un item la cierra.

---

## 17. Scroll indicators

### 17.1 Funcionalidad (P1)
- [ ] Al final de cada sección (excepto la última) hay un indicador "SCROLL" con chevron animado (bounce).
- [ ] Al hacer clic, ejecuta `scrollIntoView` con `behavior: 'smooth'` a la sección siguiente.

### 17.2 Comportamiento responsive (P2)
- [ ] En mobile (< 1024px): usa `block: 'start'`.
- [ ] En desktop: usa `block: 'start'` o `'center'` según la sección destino.
- [ ] Se aplica un segundo scroll de corrección a ~350ms para compensar lazy loading.

### 17.3 Orden correcto (P1)
- [ ] Hero → Sobre mí → Habilidades técnicas → Habilidades blandas → Idiomas → Experiencia → Educación → Portfolio → Contacto.
- [ ] Cada indicador apunta a la sección correcta según el orden.

---

## 18. Lazy loading (@defer)

### 18.1 Secciones lazy (P1)
- [ ] Las secciones pesadas (habilidades técnicas, portfolio, contacto) están envueltas en `@defer` del `AppComponent`.
- [ ] Antes de entrar en viewport, muestran un `LazySectionComponent` con skeleton shimmer.
- [ ] Al entrar en viewport, cargan el contenido real sin layout shift significativo.

### 18.2 Variantes de skeleton (P2)
- [ ] `tech-skills`: muestra ~12 skeletons rectangulares.
- [ ] `portfolio`: muestra ~6 skeletons de cards.
- [ ] `contacto`: muestra ~3 skeletons de campos.

### 18.3 Navegación directa (P0)
- [ ] Al hacer clic en "Portfolio" en la sidebar, la sección se carga correctamente incluso si no se scrolleó hasta ahí.
- [ ] No hay error en consola al forzar la carga vía navegación.

---

## 19. Accesibilidad (a11y)

### 19.1 Skip-to-content (P0)
- [ ] Al presionar Tab al cargar la página, aparece un link "Ir al contenido principal".
- [ ] Al hacer clic/Enter en el link, el foco se mueve al área de contenido principal (`#contenido-principal`).

### 19.2 Roles y landmarks (P1)
- [ ] Cada sección tiene `role="region"` y `aria-labelledby` apuntando al título (`h2` con id único).
- [ ] Las imágenes decorativas y figuras de fondo tienen `aria-hidden="true"`.
- [ ] Los botones tienen `aria-label` descriptivos.

### 19.3 Contraste de colores (P1)
- [ ] En modo oscuro, el texto principal tiene suficiente contraste contra el fondo (ratio ≥ 4.5:1).
- [ ] En modo claro, el texto principal tiene suficiente contraste.
- [ ] Los badges y pills son legibles en ambos temas.

### 19.4 Navegación por teclado (P0)
- [ ] Todos los botones e items interactivos son accesibles vía Tab.
- [ ] El modal de Portfolio se puede cerrar con Escape.
- [ ] La paleta de comandos soporta navegación completa por teclado (flechas, Enter, Escape).
- [ ] El focus trap funciona en el modal y la paleta de comandos.
- [ ] Los estilos de `:focus-visible` son visibles (outline accent con offset).

### 19.5 Reduced motion (P1)
- [ ] Con `prefers-reduced-motion: reduce` activado:
  - [ ] Las cards de tech **no** hacen flip 3D (vista plana).
  - [ ] El parallax se desactiva (`ParallaxDirective` respeta la media query).
  - [ ] El typewriter se desactiva (muestra texto estático).
  - [ ] El splash se emite inmediatamente.

### 19.6 Screen readers (P2)
- [ ] Los elementos con `aria-hidden="true"` no se leen.
- [ ] Los enlaces tienen texto descriptivo (no "clic aquí").
- [ ] El toggle de tema anuncia el estado correctamente.

---

## 20. SEO

### 20.1 Meta tags (P1)
- [ ] El `<title>` contiene "Marcos Ezequiel Toledo".
- [ ] La meta `description` está presente y es descriptiva.
- [ ] Las `keywords` incluyen tecnologías y rol profesional.
- [ ] El `author` es "Marcos Ezequiel Toledo".
- [ ] `robots` es `index, follow`.

### 20.2 Open Graph (P1)
- [ ] `og:title`, `og:description`, `og:image`, `og:url` están presentes.
- [ ] `og:locale` es `es_AR`.

### 20.3 JSON-LD (P2)
- [ ] El script JSON-LD tipo `Person` está inyectado en el `<head>` vía `SeoService`.
- [ ] Contiene `name`, `jobTitle`, `url` y `sameAs` con links a GitHub y LinkedIn.

### 20.4 Canonical (P2)
- [ ] El link canonical apunta a la URL configurada.

---

## 21. Responsive design

### 21.1 Breakpoints críticos (P0)
- [ ] **320px** (iPhone SE): todo el contenido es legible, sin overflow horizontal.
- [ ] **375px** (iPhone standard): layout correcto.
- [ ] **640px** (`$bp-sm`): primeras adaptaciones de grid.
- [ ] **768px** (`$bp-md`): transición de mobile a tablet funciona.
- [ ] **1024px** (`$bp-lg`): sidebar aparece, header mobile desaparece.
- [ ] **1280px** (`$bp-xl`): contenido centrado, no se estira excesivamente.

### 21.2 Layout de dos columnas (P0)
- [ ] En desktop (≥ 1024px): sidebar fija a la izquierda (280px) + contenido scrollable a la derecha.
- [ ] El contenido principal tiene `overflow-y: auto` y `scroll-behavior: smooth`.
- [ ] La sidebar **no** scrollea con el contenido.

### 21.3 Imágenes (P1)
- [ ] Las imágenes de portfolio no se distorsionan en ningún breakpoint.
- [ ] `ImagenFallbackComponent` muestra el placeholder SVG si la imagen falla.

---

## 22. Performance

### 22.1 Carga inicial (P1)
- [ ] Lighthouse Performance score ≥ 80.
- [ ] First Contentful Paint < 2s.
- [ ] Largest Contentful Paint < 3s.
- [ ] No hay errores en consola al cargar.

### 22.2 Animaciones (P1)
- [ ] Las animaciones corren a 60fps (verificar en Performance tab de DevTools).
- [ ] El scroll es suave sin jank (scroll handler fuera de NgZone con `rAF` throttling).

### 22.3 Change detection (P2)
- [ ] Todos los componentes usan `ChangeDetectionStrategy.OnPush`.
- [ ] El scroll handler corre fuera de `NgZone` y solo entra para actualizar secciones.
- [ ] No hay ciclos excesivos de change detection visibles en Angular DevTools.

### 22.4 Bundle size (P2)
- [ ] El bundle initial no excede 500kB (budget en `angular.json`).
- [ ] `npm run analyze` muestra distribución razonable.

### 22.5 Memoria (P2)
- [ ] No hay memory leaks detectables al navegar entre secciones repetidamente.
- [ ] Los `IntersectionObserver` se desconectan tras activarse (`AnimateOnScrollDirective`).
- [ ] Los `setTimeout`/`setInterval` se limpian en `ngOnDestroy` (hero, contacto, splash).
- [ ] Los listeners de scroll se remueven correctamente al destruir componentes.

---

## 23. Cross-browser

### 23.1 Navegadores a probar (P1)
- [ ] **Chrome** (último): renderizado, animaciones, scroll.
- [ ] **Firefox** (último): CSS custom properties, animations, scroll behavior.
- [ ] **Safari** (último): `-webkit` transforms, `backface-visibility`, scroll behavior.
- [ ] **Edge** (último): compatibilidad general.

### 23.2 Funcionalidades críticas por browser (P2)
- [ ] El flip 3D funciona en todos (`backface-visibility`, `perspective`).
- [ ] `scrollIntoView` con `behavior: 'smooth'` funciona.
- [ ] `CSS Custom Properties` se aplican correctamente.
- [ ] Angular Animations (`@angular/animations`) se ejecutan sin errores.

---

## 24. Errores y edge cases

### 24.1 Consola (P0)
- [ ] Sin errores en consola al cargar la página.
- [ ] Sin errores al cambiar tema repetidamente.
- [ ] Sin errores al abrir/cerrar el modal repetidamente.
- [ ] Sin errores al usar la paleta de comandos.
- [ ] Sin errores al redimensionar la ventana.

### 24.2 Estado (P1)
- [ ] Cambiar tema mientras el modal de portfolio está abierto: el contenido se adapta correctamente.
- [ ] Navegar vía paleta de comandos mientras el drawer mobile está abierto: el drawer se cierra.
- [ ] Redimensionar de desktop a mobile y viceversa: sidebar y header se alternan sin errores.
- [ ] Abrir y cerrar el drawer rápidamente: sin estados inconsistentes.

### 24.3 URLs y links (P0)
- [ ] Ningún link tiene `href="#"` sin handler funcional.
- [ ] Todos los links externos tienen `target="_blank"` y `rel="noopener noreferrer"`.
- [ ] No hay URLs rotas (imágenes 404, links muertos).

---

## 25. Datos y contenido

### 25.1 Información personal (P0)
- [ ] Nombre: "Marcos Ezequiel Toledo" (sin typos).
- [ ] GitHub: `marcostoledo96`.
- [ ] LinkedIn: `marcostoledo96`.
- [ ] Ubicación: Buenos Aires.

### 25.2 Experiencia (P0)
- [ ] AEROTEST: Enero 2022 – Actualidad.
- [ ] Rol incluye: Tester, Soporte, Chatbot Dev, Web Dev, Técnico.
- [ ] Métricas: 30+ bugs, 80% reducción, 40+ flujos, 10+ capacitados.
- [ ] Tecnologías listadas correctamente.

### 25.3 Habilidades técnicas (P0)
- [ ] 18 skills con imágenes, nombres y ratings correctos.
- [ ] Las categorías de cada skill son coherentes.

### 25.4 Educación (P1)
- [ ] Desarrollo de Software: IFTS N°16, promedio 9.19, en curso.
- [ ] Radiología: completado, promedio 8.28.

### 25.5 Portfolio (P1)
- [ ] 9 proyectos con datos actualizados.
- [ ] 4 proyectos marcados como featured.
- [ ] URLs de GitHub y sitios web correctas para cada proyecto.

---

## 26. Tests unitarios (Jasmine + Karma)

### 26.1 Ejecutar la suite actual (P0)

```bash
cd portfolio/frontend

# Suite completa en modo headless
npm test -- --watch=false --browsers=ChromeHeadless

# Con reporte de cobertura
npm test -- --watch=false --browsers=ChromeHeadless --code-coverage

# Un solo spec (ejemplo)
npm test -- --watch=false --browsers=ChromeHeadless --include='**/api.service.spec.ts'
```

- [ ] La suite completa pasa sin errores.
- [ ] Registrar cuántos tests pasan y cuántos fallan.
- [ ] Si algún test falla, diagnosticar: ¿código roto o test desactualizado?

### 26.2 Spec existente: `api.service.spec.ts` (P0)

Ubicación: `src/app/core/services/api.service.spec.ts`

| Test                                                  | Qué verifica                                         |
|-------------------------------------------------------|------------------------------------------------------|
| debería crearse correctamente                         | El servicio se inyecta sin error                     |
| debería enviar el mensaje de contacto correctamente   | POST a `/api/contact` con datos válidos → success    |
| debería manejar errores del servidor (500)            | Respuesta 500 → error propagado                      |
| debería manejar errores de red                        | Sin conexión → error de red capturado                |
| debería enviar los datos con el formato correcto      | El payload tiene name, email, message, turnstileToken |
| debería manejar respuestas con success false           | Respuesta 200 con `success: false` → tratado como error |

- [ ] Los 6 tests pasan.
- [ ] No hay warnings de deprecación en la salida.

### 26.3 Specs pendientes: Servicios (P0)

#### `tema.service.spec.ts`

| Caso de test                              | Qué verificar                                                               |
|-------------------------------------------|-----------------------------------------------------------------------------|
| Se crea correctamente                     | `inject(TemaService)` no lanza error                                        |
| Tema por defecto es oscuro                | Sin localStorage → signal retorna `'dark'`                                  |
| Toggle alterna entre dark y light         | Llamar `toggleTheme()` → signal cambia de `'dark'` a `'light'`             |
| Persiste en localStorage                  | Después de toggle → `localStorage.getItem('portfolio-theme')` === `'light'` |
| Recupera tema guardado al iniciar         | Setear localStorage a `'light'` antes de crear → signal es `'light'`        |
| Aplica clase .dark al html                | En modo `'dark'` → `document.documentElement.classList.contains('dark')`     |
| Remueve clase .dark en modo claro         | En modo `'light'` → `!document.documentElement.classList.contains('dark')`   |

**Mocks necesarios:** `localStorage` (spy on `getItem`/`setItem`), `document.documentElement`.

#### `seo.service.spec.ts`

| Caso de test                              | Qué verificar                                                          |
|-------------------------------------------|------------------------------------------------------------------------|
| Se crea correctamente                     | `inject(SeoService)` no lanza error                                    |
| `init()` setea el título                  | `Title.setTitle()` llamado con string que contenga "Marcos"            |
| `init()` crea meta description            | `Meta.addTag()` llamado con `{name: 'description', ...}`              |
| `init()` crea Open Graph tags             | Tags `og:title`, `og:description`, `og:image`, `og:url` presentes     |
| `init()` inyecta JSON-LD                  | Un `<script type="application/ld+json">` existe en el `<head>`        |
| `init()` no duplica tags si ya existen    | Llamar `init()` dos veces → solo un set de meta tags                   |
| Canonical apunta a URL correcta           | `<link rel="canonical">` tiene href esperado                           |

**Mocks necesarios:** `Meta`, `Title`, `DOCUMENT`.

### 26.4 Specs pendientes: Directivas (P0–P1)

#### `animate-on-scroll.directive.spec.ts`

| Caso de test                                          | Qué verificar                                                    |
|-------------------------------------------------------|------------------------------------------------------------------|
| Agrega clase `animate-on-scroll` al init              | `nativeElement.classList.contains('animate-on-scroll')` es true  |
| Aplica `transitionDelay` si `animateDelay > 0`        | `nativeElement.style.transitionDelay` === `'200ms'`              |
| Agrega clase `visible` al entrar en viewport          | Simular intersección → clase `visible` presente                  |
| Desconecta observer después de primera intersección   | `observer.disconnect()` fue llamado                              |
| Limpia observer en `ngOnDestroy`                      | Destruir directiva → `disconnect()` fue llamado                  |

**Mocks necesarios:** `IntersectionObserver` (mock global), `NgZone`.

#### `parallax.directive.spec.ts`

| Caso de test                                           | Qué verificar                                                  |
|--------------------------------------------------------|----------------------------------------------------------------|
| No aplica efecto con `prefers-reduced-motion: reduce`  | `matchMedia` retorna `{matches: true}` → no agrega listener   |
| Aplica `willChange: 'transform'` al init               | `nativeElement.style.willChange` === `'transform'`             |
| Registra listener de scroll fuera de NgZone            | `ngZone.runOutsideAngular()` fue llamado                       |
| Remueve listener en `ngOnDestroy`                      | Destruir → `removeEventListener` fue llamado                   |
| Calcula translateY proporcional al scroll              | Simular scroll → `transform` contiene `translateY`             |

**Mocks necesarios:** `window.matchMedia`, scroll container, `NgZone`, `requestAnimationFrame`.

### 26.5 Specs pendientes: Componentes críticos (P0)

#### `app.component.spec.ts`

| Caso de test                                      | Qué verificar                                               |
|---------------------------------------------------|--------------------------------------------------------------|
| Se crea correctamente                             | `fixture.componentInstance` existe                           |
| Define 9 secciones                                | `component.secciones.length` === 9                           |
| Scroll handler actualiza sección activa           | Simular scroll → `seccionActiva` signal cambia               |
| Scroll handler corre fuera de NgZone              | `NgZone.runOutsideAngular` fue llamado                       |
| Splash oculto emite `finished` → muestra layout   | `isSplashVisible` cambia a `false` tras evento               |

#### `seccion-contacto.component.spec.ts`

| Caso de test                                      | Qué verificar                                               |
|---------------------------------------------------|--------------------------------------------------------------|
| Se crea correctamente                             | Componente se renderiza sin error                            |
| Formulario tiene 3 campos requeridos              | `nombre`, `email`, `mensaje` existen y son `required`        |
| Validación: nombre < 2 chars muestra error        | Escribir "A" + blur → error visible                          |
| Validación: email inválido muestra error          | Escribir "abc" + blur → error visible                        |
| Validación: mensaje < 10 chars muestra error      | Escribir "hola" + blur → error visible                       |
| Honeypot lleno bloquea envío                      | Llenar campo oculto → submit no llama a `ApiService`         |
| Envío exitoso muestra mensaje de éxito            | Mock `ApiService` → success → mensaje visible                |
| Envío fallido muestra mensaje de error            | Mock `ApiService` → error → mensaje de error visible         |
| Limpia timers en `ngOnDestroy`                    | Destruir → no hay timers pendientes                          |

#### `seccion-portfolio.component.spec.ts`

| Caso de test                                       | Qué verificar                                               |
|----------------------------------------------------|--------------------------------------------------------------|
| Se crea correctamente                              | Componente se renderiza sin error                            |
| Muestra 9 proyectos por defecto                    | Cards renderizadas === 9                                     |
| Filtro "En desarrollo" filtra correctamente        | Solo proyectos con estado "En desarrollo" visibles           |
| Filtro "Finalizado" filtra correctamente           | Solo proyectos con estado "Finalizado" visibles              |
| Filtro "Todos" muestra todos                       | 9 cards visibles                                             |
| Clic en card abre modal                            | `isModalOpen` cambia a `true`                                |
| Modal se cierra con Escape                         | Simular keydown Escape → `isModalOpen` es `false`            |
| Proyectos featured tienen badge                    | 4 elementos con clase/atributo de featured                   |

### 26.6 Specs pendientes: Componentes de layout (P1)

#### `barra-lateral.component.spec.ts`

| Caso de test                                       | Qué verificar                                              |
|----------------------------------------------------|-------------------------------------------------------------|
| Renderiza 9 items de navegación                    | 9 elementos `<li>` o similar en el DOM                      |
| Clic en item emite sección correcta               | Clic en "Sobre mí" → `@Output` emitido con id correcto     |
| Pill indicator se posiciona en item activo         | Signal `pillPos` actualiza al cambiar sección               |
| Toggle de tema visible                             | Botón Sol/Luna existe en el DOM                              |

#### `encabezado-movil.component.spec.ts`

| Caso de test                                       | Qué verificar                                              |
|----------------------------------------------------|-------------------------------------------------------------|
| Se renderiza solo en mobile (< 1024px)             | Componente visible con viewport < 1024                      |
| Clic en hamburguesa abre drawer                    | `isDrawerOpen` cambia a `true`                              |
| Clic en overlay cierra drawer                      | Clic fuera → `isDrawerOpen` cambia a `false`                |
| Clic en item de nav cierra drawer                  | Seleccionar sección → drawer se cierra                      |

#### `paleta-comandos.component.spec.ts`

| Caso de test                                       | Qué verificar                                              |
|----------------------------------------------------|-------------------------------------------------------------|
| Se abre con Ctrl+K                                 | Simular keydown → componente visible                        |
| Búsqueda filtra items                              | Escribir "port" → solo items que matchean                   |
| Búsqueda normaliza acentos                         | "sobre" encuentra "Sobre mí"                                |
| Flechas navegan entre items                        | ArrowDown → item siguiente resaltado                        |
| Enter selecciona item                              | Enter → acción ejecutada + paleta cerrada                   |
| Escape cierra la paleta                            | Escape → componente oculto                                  |
| Sin resultados muestra mensaje                     | Escribir "xyz123" → "Sin resultados" visible                |

#### `splash-screen.component.spec.ts`

| Caso de test                                        | Qué verificar                                             |
|-----------------------------------------------------|-----------------------------------------------------------|
| Emite `finished` después de ~1200ms                 | `fakeAsync` + `tick(1200)` → output emitido               |
| Con reduced motion emite inmediatamente             | Mock `matchMedia` → `finished` emitido sin delay           |

#### `boton-scroll-arriba.component.spec.ts`

| Caso de test                                        | Qué verificar                                             |
|-----------------------------------------------------|-----------------------------------------------------------|
| No visible cuando scroll < 400px                    | Input `visible` = false → no renderiza                    |
| Visible cuando scroll > 400px                       | Input `visible` = true → renderiza el botón               |
| Clic emite evento `clicked`                         | Clic → `@Output clicked` fue emitido                      |

### 26.7 Specs pendientes: Secciones estáticas (P2)

Estas secciones tienen menos lógica interactiva. Tests mínimos recomendados:

| Componente                                 | Tests mínimos                                                     |
|--------------------------------------------|-------------------------------------------------------------------|
| `seccion-hero.component.ts`               | Se crea, muestra nombre, 4 frases typewriter, links funcionan     |
| `seccion-sobre-mi.component.ts`           | Se crea, bento grid renderiza 3 cards, pills visibles             |
| `seccion-habilidades-tecnicas.component.ts`| Se crea, 18 cards renderizan, flip funciona en hover              |
| `seccion-habilidades-blandas.component.ts` | Se crea, 6 cards con íconos y colores correctos                  |
| `seccion-idiomas.component.ts`            | Se crea, 2 idiomas, banderas SVG renderizan                       |
| `seccion-experiencia.component.ts`        | Se crea, datos de AEROTEST, 4 métricas, 6 tech tags              |
| `seccion-educacion.component.ts`          | Se crea, 2 carreras, promedios, badges de estado                  |
| `imagen-fallback.component.ts`            | Imagen OK renderiza, imagen rota muestra fallback SVG             |

### 26.8 Comando para ejecutar (P0)

```bash
cd portfolio/frontend

# Suite completa
npm test -- --watch=false --browsers=ChromeHeadless

# Con cobertura
npm test -- --watch=false --browsers=ChromeHeadless --code-coverage

# Un archivo específico
npm test -- --watch=false --browsers=ChromeHeadless --include='**/tema.service.spec.ts'
```

---

## 27. API serverless (contacto)

### 27.1 Endpoint `POST /api/contact` (P0)
- [ ] Con datos válidos (`name`, `email`, `message`, `turnstileToken`), responde 200 + envía email.
- [ ] Con datos inválidos, responde 400 + lista de errores.

### 27.2 Validación (P0)
- [ ] `name`: 2-100 caracteres (trim).
- [ ] `email`: formato válido (normalize).
- [ ] `message`: 10-1000 caracteres (trim).

### 27.3 CAPTCHA (P1)
- [ ] Token de Turnstile válido → se verifica contra `siteverify` de Cloudflare.
- [ ] Token expirado o inválido → rechaza con error descriptivo.

### 27.4 Email (P0)
- [ ] Se envía vía Nodemailer + Gmail SMTP usando credenciales de variables de entorno.
- [ ] El template del email incluye nombre, email y mensaje del remitente.

### 27.5 Errores (P1)
- [ ] Error de SMTP → responde 500.
- [ ] Error de red → responde apropiadamente.
- [ ] Preflight `OPTIONS` → solo devuelve headers CORS.

### 27.6 Probar en local (P2)

```bash
cd portfolio
vercel dev
# → http://localhost:3000/api/contact
```

---

## 28. Internacionalización (i18n)

### 28.1 Build en español (P0)
- [ ] `npm run build` genera la versión en español (idioma base).
- [ ] Todos los textos visibles están en español.

### 28.2 Build en inglés (P1)
- [ ] `npm run build:en` genera la versión en inglés.
- [ ] Todos los textos marcados con `i18n` están traducidos en `messages.en.xlf`.
- [ ] No hay textos sin traducir (warnings en el build).

### 28.3 Build para ambos idiomas (P1)
- [ ] `npm run build:all` genera ambas versiones sin errores.

### 28.4 Extracción de textos (P2)
- [ ] `npm run extract-i18n` genera/actualiza `messages.xlf` en `/src/locale/`.
- [ ] Los nuevos textos marcados con `i18n` aparecen en el archivo generado.

---

## Resumen de cobertura

| Área                         | Tests aprox. | Prioridad |
|------------------------------|--------------|-----------|
| Splash Screen                | 6            | P0–P2     |
| Tema claro/oscuro            | 15           | P0–P1     |
| Sidebar (desktop)            | 14           | P0–P2     |
| Encabezado móvil / drawer    | 8            | P0–P2     |
| Sección Hero                 | 16           | P0–P2     |
| Sección Sobre mí             | 8            | P0–P2     |
| Habilidades técnicas         | 12           | P0–P2     |
| Habilidades blandas          | 5            | P0–P2     |
| Idiomas                      | 6            | P0–P1     |
| Experiencia profesional      | 8            | P0–P2     |
| Educación                    | 6            | P0–P1     |
| Portfolio                    | 18           | P0–P2     |
| Contacto                     | 16           | P0–P2     |
| Footer                       | 6            | P0–P2     |
| Botón scroll arriba          | 6            | P0–P1     |
| Paleta de comandos           | 14           | P0–P1     |
| Scroll indicators            | 5            | P1–P2     |
| Lazy loading                 | 5            | P0–P2     |
| Accesibilidad                | 14           | P0–P2     |
| SEO                          | 8            | P1–P2     |
| Responsive design            | 7            | P0–P1     |
| Performance                  | 8            | P1–P2     |
| Cross-browser                | 6            | P1–P2     |
| Errores y edge cases         | 10           | P0–P1     |
| Datos y contenido            | 10           | P0–P1     |
| Tests unitarios (Jasmine)    | 80+          | P0–P1     |
| API serverless               | 8            | P0–P2     |
| Internacionalización         | 6            | P0–P2     |
| **TOTAL**                    | **~310+**    |           |
