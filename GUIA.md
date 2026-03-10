# Guía Completa de Mi Portfolio — Angular 20

> Escribí esta guía para poder explicar cada decisión técnica que tomé al construir mi portfolio. Está pensada para que cualquier desarrollador junior (o yo mismo en el futuro) pueda entender el proyecto de punta a punta: por qué elegí cada tecnología, cómo está estructurado, y qué hace cada parte del código.

---

## Tabla de Contenidos

1. [Descripción general del proyecto](#1-descripción-general-del-proyecto)
2. [Tecnologías y librerías — qué son y por qué las elegí](#2-tecnologías-y-librerías--qué-son-y-por-qué-las-elegí)
3. [Cómo arrancar el proyecto en local](#3-cómo-arrancar-el-proyecto-en-local)
4. [Estructura de carpetas](#4-estructura-de-carpetas)
5. [El flujo de inicio — cómo arranca Angular](#5-el-flujo-de-inicio--cómo-arranca-angular)
6. [AppComponent — el componente raíz que controla todo](#6-appcomponent--el-componente-raíz-que-controla-todo)
7. [Sistema de estilos — SCSS, temas y convenciones](#7-sistema-de-estilos--scss-temas-y-convenciones)
8. [Servicios — la lógica compartida de la aplicación](#8-servicios--la-lógica-compartida-de-la-aplicación)
9. [Directivas — comportamientos reutilizables](#9-directivas--comportamientos-reutilizables)
10. [Componentes de layout — sidebar, header y drawer](#10-componentes-de-layout--sidebar-header-y-drawer)
11. [Las 9 secciones del portfolio](#11-las-9-secciones-del-portfolio)
12. [Lazy loading con @defer — carga diferida de secciones](#12-lazy-loading-con-defer--carga-diferida-de-secciones)
13. [Splash screen y paleta de comandos](#13-splash-screen-y-paleta-de-comandos)
14. [SEO — posicionamiento en buscadores](#14-seo--posicionamiento-en-buscadores)
15. [Backend serverless — la API de contacto](#15-backend-serverless--la-api-de-contacto)
16. [Seguridad — CAPTCHA con Cloudflare Turnstile](#16-seguridad--captcha-con-cloudflare-turnstile)
17. [Internacionalización (i18n) — español e inglés](#17-internacionalización-i18n--español-e-inglés)
18. [Testing — pruebas unitarias](#18-testing--pruebas-unitarias)
19. [Performance — las optimizaciones que implementé](#19-performance--las-optimizaciones-que-implementé)
20. [Deploy en Vercel y CI/CD](#20-deploy-en-vercel-y-cicd)
21. [Glosario de conceptos clave](#21-glosario-de-conceptos-clave)

---

## 1) Descripción general del proyecto

### ¿Qué es?

Es mi portfolio personal, una página web que muestra quién soy, qué sé hacer, mis proyectos y cómo contactarme. Lo armé como una **SPA (Single Page Application)** con **Angular 20**: se carga una sola página HTML y JavaScript se encarga de mostrar y ocultar contenido dinámicamente, sin recargar el navegador.

### ¿Qué incluye?

- **9 secciones de contenido**: Hero, Sobre mí, Habilidades técnicas, Habilidades blandas, Idiomas, Experiencia, Educación, Portfolio y Contacto.
- **Tema claro/oscuro** que se guarda en el navegador del usuario (persiste si recarga la página).
- **Animaciones de scroll**: los elementos aparecen con un efecto suave cuando el usuario baja.
- **Formulario de contacto funcional** que realmente envía un email a mi cuenta de Gmail.
- **Diseño responsive**: se adapta a celulares, tablets y escritorio.
- **Internacionalización**: el portfolio está disponible en español y en inglés.
- **Splash screen**: pantalla de carga animada al abrir el sitio.
- **Paleta de comandos**: búsqueda rápida tipo VS Code (se abre con Ctrl+K).
- **SEO optimizado**: meta tags, Open Graph, Twitter Card y JSON-LD.

### Diagrama de alto nivel

```
┌──────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                              │
│                                                               │
│  ┌───────────────┐  ┌────────────────────────────────────┐   │
│  │   Sidebar      │  │           Contenido principal      │   │
│  │   (desktop)    │  │                                    │   │
│  │  ────────────  │  │  Hero → Sobre mí → Tech Skills     │   │
│  │  Navegación    │  │  → Soft Skills → Idiomas            │   │
│  │  Toggle tema   │  │  → Experiencia → Educación          │   │
│  │  Progreso      │  │  → Portfolio → Contacto → Footer    │   │
│  └───────────────┘  └────────────────────────────────────┘   │
│                                                               │
│  En mobile: el sidebar se oculta y aparece un header fijo     │
│  con un botón hamburguesa que abre un drawer lateral.         │
└──────────────────────────────────────────────────────────────┘
          │ (formulario de contacto → POST /api/contact)
          ▼
┌────────────────────────────┐
│   Vercel (Serverless)       │
│   api/index.js              │
│   Valida datos + CAPTCHA    │
│   Envía email con Nodemailer│
└────────────────────────────┘
```

---

## 2) Tecnologías y librerías — qué son y por qué las elegí

### Frontend

| Tecnología | Qué es | Qué hace en mi proyecto |
|---|---|---|
| **Angular 20** | Un framework de Google para construir aplicaciones web. Incluye de fábrica todo lo que necesitás: componentes, formularios, HTTP client, animaciones, i18n y testing. | Es la base de todo el portfolio. Organiza cada parte visual en "componentes" independientes con su propia lógica, HTML y estilos. |
| **TypeScript 5.8** | Un lenguaje que agrega "tipos" a JavaScript. Es como JavaScript pero te avisa de errores mientras escribís, antes de ejecutar el código. Por ejemplo, si una variable es un `string`, no te deja tratarla como `number`. | Todos los archivos `.ts` del proyecto usan TypeScript. Cada componente, servicio y directiva tiene tipos definidos. Esto me evitó bugs y me dio autocompletado en el editor. |
| **SCSS** | Un preprocesador de CSS. Agrega funcionalidades que CSS puro no tiene: variables, anidamiento de selectores, mixins (bloques de CSS reutilizables) e importación de archivos. El navegador no entiende SCSS, así que Angular lo compila a CSS normal durante el build. | Todos los estilos del proyecto están en archivos `.scss`. Usé variables para tipografía y breakpoints, mixins para cards y responsive, y anidamiento para mantener todo organizado. |
| **CSS Custom Properties** | Variables nativas de CSS. A diferencia de las variables SCSS (que se resuelven al compilar), las custom properties viven en el navegador y se pueden cambiar en tiempo real con JavaScript. Se definen como `--nombre: valor;` y se usan con `var(--nombre)`. | Son la base del sistema de temas. Tengo definidas ~40 variables de color que cambian automáticamente cuando el usuario activa el modo oscuro. No necesito tocar ningún componente: todos ya usan `var(--background)`, `var(--portfolio-accent)`, etc. |
| **Angular Animations** | Módulo oficial de Angular para animaciones declarativas. Permite definir transiciones con triggers y states en el decorador del componente, sin escribir CSS o JavaScript imperativo para animar. | Lo usé para la animación del botón "scroll to top" (fadeScale), la entrada/salida de tarjetas del portfolio al cambiar filtro (stagger), y transiciones del drawer mobile. |
| **RxJS** | Librería de "programación reactiva" que viene con Angular. Permite trabajar con flujos de datos asíncronos (como respuestas HTTP, eventos del usuario, timers) usando "Observables". Es como una versión más potente de las Promesas. | Lo uso en `ApiService` para hacer peticiones HTTP. El método `sendContactMessage()` devuelve un Observable: el componente se "suscribe" y recibe la respuesta (éxito o error) cuando el servidor contesta. |
| **Angular Signals** | Una feature de Angular 16+ para manejar estado reactivo de forma simple. Un signal es una variable que Angular "observa": cuando cambia su valor, automáticamente actualiza los componentes que la usan. Se lee con `signal()` (con paréntesis) y se escribe con `signal.set(valor)`. | Los uso para el tema (en `TemaService`), el estado del splash screen (`splashDone`), la posición del pill del sidebar, y las señales de lazy loading forzado. |
| **Lucide Icons** | Una librería de íconos SVG open source, liviana y configurable. Carga los íconos como SVGs inline desde un script en el CDN. Cada ícono se usa con `<i data-lucide="nombre-del-icono"></i>`. | Todos los íconos del portfolio (navegación, redes sociales, secciones, botones) vienen de Lucide. Los inicializo con `lucide.createIcons()` en cada componente que los necesita. |
| **Zone.js** | Librería que Angular usa internamente para detectar cuándo algo cambió en la aplicación (un click, una respuesta HTTP, un setTimeout) y actualizar la vista. Se llama "change detection". | Aunque funciona automáticamente, en el handler de scroll lo saqué de Zone.js (`runOutsideAngular`) para que Angular no intente re-renderizar en cada pixel de scroll. Solo le aviso a Angular cuando realmente cambió algo. Esto es clave para performance. |

### Backend

| Tecnología | Qué es | Qué hace en mi proyecto |
|---|---|---|
| **Node.js 22** | Un entorno que permite ejecutar JavaScript fuera del navegador (en un servidor). Es lo que hace posible tener un backend en JavaScript. | Ejecuta la función serverless que procesa el formulario de contacto. |
| **Nodemailer** | Librería de Node.js para enviar emails programáticamente. Soporta múltiples servicios de email (Gmail, Outlook, SMTP genérico). | Cuando alguien llena el formulario de contacto, Nodemailer se encarga de armar el email HTML y enviarlo a mi cuenta de Gmail usando SMTP. |
| **express-validator** | Librería para validar datos del lado del servidor. Permite definir reglas de validación (campo requerido, largo mínimo/máximo, formato de email) y ejecutarlas sobre los datos que llegan en el body del request. | Valido los tres campos del formulario (nombre, email, mensaje) antes de intentar enviar el email. Si algún campo es inválido, devuelvo un error 400 con los mensajes específicos. |

### Seguridad

| Tecnología | Qué es | Qué hace en mi proyecto |
|---|---|---|
| **Cloudflare Turnstile** | Un servicio de CAPTCHA de Cloudflare (alternativa a reCAPTCHA de Google). Verifica que el usuario es humano sin mostrar puzzles molestos. Funciona en dos partes: el widget en el frontend genera un token, y el backend lo valida contra la API de Cloudflare. | Protege el formulario de contacto contra bots y spam. El frontend renderiza el widget Turnstile, obtiene un token, y lo envía junto con los datos del formulario. El backend verifica ese token antes de enviar el email. |

### Infraestructura y deploy

| Tecnología | Qué es | Qué hace en mi proyecto |
|---|---|---|
| **Vercel** | Plataforma de hosting optimizada para frontends y funciones serverless. Detecta cambios en GitHub y hace deploy automático. Las funciones serverless se ejecutan solo cuando alguien las llama (no hay un servidor corriendo 24/7). | Hospeda tanto los archivos estáticos del frontend como la función serverless `/api/contact`. Cada push a `main` dispara un redeploy automático. |
| **GitHub Actions** | Servicio de automatización de GitHub para CI/CD. Ejecuta tareas automáticas (build, tests, lint) en cada push o pull request. | Tengo un pipeline que corre en cada push/PR a `main`: instala dependencias, compila el proyecto, y ejecuta los tests unitarios con Chrome Headless. |
| **@angular/localize** | Paquete oficial de Angular para internacionalización (i18n). Usa archivos XLIFF para las traducciones y genera builds separados para cada idioma. | Permite tener el portfolio en español (idioma por defecto) y en inglés. Las traducciones viven en archivos `.xlf` dentro de `src/locale/`. |

### Herramientas de desarrollo

| Herramienta | Qué es | Para qué la usé |
|---|---|---|
| **Angular CLI** | Herramienta de línea de comandos de Angular. Sirve para crear componentes, compilar el proyecto, correr tests y servir la app en desarrollo. | Usé `ng serve` para desarrollo local, `ng build` para producción, `ng test` para tests y `ng extract-i18n` para extraer strings de traducción. |
| **Karma + Jasmine** | Karma es un "test runner" (ejecuta los tests) y Jasmine es un framework de testing (permite escribir tests con `describe`, `it`, `expect`). Juntos permiten correr tests unitarios en un navegador real (Chrome Headless). | Testing unitario de los servicios (`ApiService`) y componentes. |
| **source-map-explorer** | Herramienta que analiza el bundle (el archivo JavaScript final) y muestra un mapa visual de qué dependencia ocupa cuánto espacio. | Me sirvió para verificar que no estaba incluyendo librerías pesadas innecesariamente. Lo corro con `npm run analyze`. |
| **webpack-bundle-analyzer** | Similar a source-map-explorer pero con una visualización interactiva tipo treemap. | Alternativa para analizar el tamaño del bundle. |

---

## 3) Cómo arrancar el proyecto en local

### Requisitos previos

| Herramienta | Versión mínima | Para qué se usa |
|---|---|---|
| **Node.js** | 22.x | Motor JavaScript que ejecuta Angular CLI y el build |
| **npm** | 9.x (viene con Node) | Administrador de paquetes (instala dependencias) |
| **Git** | cualquiera | Clonar el repositorio |

> Se verifica si están instalados con `node -v` y `npm -v` en la terminal.

### Pasos para arrancar

```bash
# 1. Clonar el repositorio
git clone <URL-del-repositorio>
cd portfolio

# 2. Entrar a la carpeta del frontend e instalar dependencias
cd frontend
npm install --legacy-peer-deps

# 3. Arrancar el servidor de desarrollo
npm start
```

Después de unos segundos se ve:

```
** Angular Live Development Server is listening on localhost:4200 **
```

Abrir **http://localhost:4200** en el navegador y ya se ve el portfolio.

### ¿Qué hace cada comando?

| Comando | Qué hace |
|---|---|
| `npm install` | Lee `package.json`, descarga todas las dependencias a la carpeta `node_modules/` |
| `--legacy-peer-deps` | Ignora conflictos de versión entre paquetes. Necesario porque algunos paquetes todavía no declararon compatibilidad con Angular 20. |
| `npm start` | Ejecuta `ng serve`, que compila el código TypeScript/SCSS a JavaScript/CSS, y levanta un servidor local en el puerto 4200 con recarga automática. |

### Scripts disponibles

```bash
npm run build          # Genera la versión de producción optimizada en dist/
npm run build:en       # Build en inglés (usando @angular/localize)
npm run build:all      # Build de ambos idiomas
npm run build:stats    # Build + genera estadísticas del bundle (stats.json)
npm run analyze        # Build + abre source-map-explorer para ver tamaño de dependencias
npm run extract-i18n   # Extrae strings marcados con i18n a src/locale/
npm run test           # Ejecuta tests unitarios con Karma + Chrome Headless
```

### ¿Y el formulario de contacto?

El formulario envía datos a `/api/contact`. En local, esa ruta no existe porque el backend corre como función serverless en Vercel. Para probarlo localmente:

- Instalar Vercel CLI: `npm i -g vercel`
- Crear un archivo `.env` en la raíz con `EMAIL_USER` y `EMAIL_PASS`
- Ejecutar `vercel dev` desde la raíz del proyecto

---

## 4) Estructura de carpetas

```
portfolio/
├── api/
│   └── index.js                           ← Función serverless (POST /api/contact)
├── vercel.json                            ← Configuración de deploy en Vercel
├── package.json                           ← Dependencias del backend (nodemailer, express-validator)
├── GUIA.md                                ← Esta guía
├── DEPLOY.md                              ← Guía de deploy en Vercel
├── README.md                              ← Presentación del proyecto
│
└── frontend/                              ← Todo el código Angular
    ├── angular.json                       ← Configuración del proyecto Angular
    ├── package.json                       ← Dependencias del frontend
    ├── tsconfig.json                      ← Configuración de TypeScript
    ├── karma.conf.js                      ← Configuración de tests
    │
    └── src/
        ├── index.html                     ← Página HTML base donde arranca todo
        ├── main.ts                        ← Punto de entrada de Angular
        ├── styles.scss                    ← Punto de entrada de estilos globales
        │
        ├── environments/
        │   ├── environment.ts             ← Configuración para desarrollo
        │   └── environment.prod.ts        ← Configuración para producción
        │
        ├── locale/
        │   ├── messages.xlf               ← Strings en español (referencia)
        │   └── messages.en.xlf            ← Traducciones al inglés
        │
        ├── styles/
        │   ├── _variables.scss            ← Variables SCSS (fuentes, radios, breakpoints, z-index)
        │   ├── _mixins.scss               ← Mixins reutilizables (responsive, card-base, glow)
        │   ├── _theme.scss                ← CSS Custom Properties para modo claro/oscuro
        │   └── _base.scss                 ← Reset, scrollbar, animaciones globales
        │
        ├── assets/
        │   ├── img/                       ← Imágenes .webp (tecnologías, proyectos, perfil)
        │   ├── doc/                       ← CV en PDF
        │   └── data/                      ← proyectos.json (datos parametrizables)
        │
        └── app/
            ├── app.component.ts|html|scss ← Componente raíz — layout + scroll
            │
            ├── servicios/
            │   ├── tema.service.ts        ← Servicio de tema (signal + localStorage)
            │   └── seo.service.ts         ← Servicio de SEO (meta tags + JSON-LD)
            │
            ├── core/
            │   ├── directivas/
            │   │   ├── animate-on-scroll.directive.ts   ← Animación fade-up con IntersectionObserver
            │   │   └── parallax.directive.ts            ← Efecto parallax decorativo
            │   └── services/
            │       └── api.service.ts     ← HttpClient para POST /api/contact
            │
            └── componentes/
                ├── barra-lateral/         ← Sidebar desktop (navegación, avatar, tema, progreso)
                ├── encabezado-movil/      ← Header mobile + drawer
                ├── boton-scroll-arriba/   ← Botón flotante "volver arriba"
                ├── splash-screen/         ← Pantalla de carga inicial
                ├── paleta-comandos/       ← Búsqueda rápida tipo VS Code (Ctrl+K)
                ├── imagen-fallback/       ← Componente que muestra placeholder si la imagen falla
                ├── lazy-section/          ← Placeholder para secciones con @defer
                ├── scroll-indicator/      ← Indicador "SCROLL" debajo del hero
                ├── seccion-hero/          ← Hero: typewriter, contadores, badges
                └── secciones/
                    ├── seccion-sobre-mi/
                    ├── seccion-habilidades-tecnicas/  ← 18 tarjetas con flip 3D
                    ├── seccion-habilidades-blandas/
                    ├── seccion-idiomas/
                    ├── seccion-experiencia/
                    ├── seccion-educacion/
                    ├── seccion-portfolio/  ← Proyectos con filtros y tilt 3D
                    └── seccion-contacto/  ← Formulario + links de contacto
```

### Convención de nombres

Todos los archivos de componentes usan nombres **en español** y siguen la convención de Angular:

```
nombre-del-componente/
├── nombre-del-componente.component.ts      ← Lógica (clase TypeScript)
├── nombre-del-componente.component.html    ← Template (qué se ve en pantalla)
└── nombre-del-componente.component.scss    ← Estilos (cómo se ve)
```

Cada componente tiene **3 archivos** que trabajan juntos. Esta separación facilita el mantenimiento: si quiero cambiar cómo se ve algo, toco el `.scss`; si quiero cambiar la estructura, toco el `.html`; si quiero cambiar la lógica, toco el `.ts`.

---

## 5) El flujo de inicio — cómo arranca Angular

Cuando alguien abre el portfolio en el navegador, pasan estas cosas en orden:

### Paso 1: El navegador carga `index.html`

```html
<!doctype html>
<html lang="es" class="dark">
<head>
    <!-- Fuentes de Google Fonts: Inter para texto, Fira Code para tecnologías -->
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600
          &family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Lucide Icons: librería de íconos SVG. defer = no bloquea el render de la página -->
    <script defer src="https://unpkg.com/lucide@0.460.0/dist/umd/lucide.min.js"></script>

    <!-- Cloudflare Turnstile: CAPTCHA para el formulario. async = carga en paralelo -->
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            async defer></script>
</head>
<body>
    <!-- Angular va a insertar TODO el contenido de la app dentro de este tag -->
    <app-root></app-root>
</body>
</html>
```

**¿Por qué `class="dark"` en el `<html>`?** Para que al cargar la página se muestre directamente el tema oscuro (que es el default). Si no estuviera, se vería un flash blanco antes de que Angular arranque y aplique el tema - una mala experiencia visual.

### Paso 2: Angular ejecuta `main.ts`

```typescript
// bootstrapApplication: arranca Angular con un componente standalone como raíz.
// No usa NgModule (la forma vieja). Es más simple y moderno.
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),   // Activa @angular/animations en toda la app
    provideHttpClient(),   // Activa HttpClient para hacer peticiones HTTP (necesario para ApiService)
  ],
}).then(() => {
  // DESPUÉS de que Angular arranque, creo un IntersectionObserver global.
  // Este observer agrega/quita la clase "section-in-view" en cada <section>.
  // ¿Para qué? Para que _base.scss pueda pausar animaciones CSS en secciones
  // que no están visibles, ahorrando trabajo a la GPU del usuario.
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        e.target.classList.toggle('section-in-view', e.isIntersecting);
      }
    },
    { rootMargin: '20% 0px' }  // Activa la clase un 20% antes de que la sección entre al viewport
  );
  document.querySelectorAll('section[id]').forEach(s => io.observe(s));
});
```

**¿Qué es `bootstrapApplication`?** Es la función que "arranca" Angular. Le digo cuál es el componente raíz (`AppComponent`) y qué servicios globales necesito (`provideAnimations`, `provideHttpClient`). Angular crea el componente y lo inserta dentro de `<app-root>`.

**¿Qué es un `IntersectionObserver`?** Es una API nativa del navegador que detecta cuándo un elemento HTML entra o sale de la zona visible (viewport). Es mucho más eficiente que escuchar el evento `scroll` y calcular posiciones manualmente.

### Paso 3: Angular crea `AppComponent`

Angular renderiza el template de `AppComponent`, que contiene:
1. El splash screen (pantalla de carga)
2. El sidebar de navegación
3. El header mobile
4. Todas las secciones del portfolio
5. El footer
6. El botón de "volver arriba"

---

## 6) AppComponent — el componente raíz que controla todo

`AppComponent` es como el "director de orquesta". No muestra contenido propio, sino que organiza a todos los demás componentes y maneja la lógica global: scroll, sección activa, barra de progreso, drawer mobile.

### ¿Qué es standalone?

Hay dos formas de organizar componentes en Angular:
- **NgModule (forma clásica):** agrupás componentes en módulos. Más burocrático, más boilerplate.
- **Standalone (forma moderna, Angular 14+):** cada componente declara sus propias dependencias. No hay módulos intermedios.

Yo usé **standalone** para todo el proyecto. Cada componente dice qué necesita en su array `imports`:

```typescript
@Component({
  standalone: true,                     // Este componente es independiente
  imports: [CommonModule, FormsModule], // Declara lo que necesita usar
  templateUrl: './mi.component.html',
})
export class MiComponent { }
```

### Propiedades del componente

```typescript
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Portfolio - Marcos Ezequiel Toledo';

  // Construyo el mailto dinámicamente para que los bots de spam no lo encuentren
  // en el HTML estático. En vez de poner "mailto:marcostoledo96@gmail.com" directo,
  // lo armo concatenando partes.
  readonly mailtoHref = ["ma","il","to:"].join("") +
                        ["marcostoledo96","gmail.com"].join("@");

  // SIGNAL: variable reactiva. Cuando el splash screen termina, pone esto en true
  // y Angular sabe que tiene que re-renderizar (quitar el splash del DOM).
  splashDone = signal(false);

  activeSection = 'hero';     // ID de la sección visible en pantalla
  scrollProgress = 0;         // Número entre 0 y 1 para la barra de progreso
  showScrollTop = false;      // true cuando el usuario scrolleó más de 400px
  isDrawerOpen = false;       // true cuando el menú mobile está abierto

  // Señales para forzar que las secciones lazy se carguen ANTES de scrollear hacia ellas.
  // Sin esto, al hacer clic en "Portfolio" en el sidebar, la sección no existiría
  // en el DOM y no se podría scrollear hasta ella.
  readonly forceHabilidades = signal(false);
  readonly forcePortfolio   = signal(false);
  readonly forceContacto    = signal(false);

  // @ViewChild: referencia directa a un elemento del template.
  // Le puse #mainContent al <main> en el HTML, y acá lo capturo para
  // poder leer su scrollTop, scrollHeight, etc. desde TypeScript.
  @ViewChild('mainContent', { static: true }) mainRef!: ElementRef<HTMLElement>;
}
```

### El template HTML — cómo se estructura el layout

```html
<!-- Splash screen: se muestra al cargar y desaparece con una animación -->
@if (!splashDone()) {
  <app-splash-screen (finished)="splashDone.set(true)"></app-splash-screen>
}

<div class="layout">
  <!-- Enlace de accesibilidad: solo visible con Tab, lleva al contenido principal -->
  <a href="#contenido-principal" class="skip-to-content">Ir al contenido principal</a>

  <!-- Sidebar: solo visible en pantallas >= 1024px -->
  <div class="layout__sidebar">
    <app-barra-lateral
      [activeSection]="activeSection"
      [scrollProgress]="scrollProgress"
      (navClick)="handleNavClick($event)"
    ></app-barra-lateral>
  </div>

  <!-- Header mobile: solo visible en pantallas < 1024px -->
  <div class="layout__mobile-header">
    <app-encabezado-movil
      [isDrawerOpen]="isDrawerOpen"
      [activeSection]="activeSection"
      (toggleDrawer)="toggleDrawer()"
      (navClick)="handleNavClick($event)"
    ></app-encabezado-movil>
  </div>

  <!-- Contenido principal scrollable -->
  <main class="layout__main" id="contenido-principal" #mainContent>
    <app-seccion-hero></app-seccion-hero>
    <app-seccion-sobre-mi></app-seccion-sobre-mi>
    <!-- Las secciones pesadas usan @defer para carga diferida (ver sección 12) -->
    @defer (when forceHabilidades(); on viewport; prefetch on idle) {
      <app-seccion-habilidades-tecnicas></app-seccion-habilidades-tecnicas>
    } @placeholder {
      <app-lazy-section variant="tech-skills" sectionId="habilidades-tecnicas"></app-lazy-section>
    }
    <!-- ... más secciones ... -->
    <footer><!-- Sitemap, redes sociales, copyright --></footer>
  </main>
</div>

<!-- Botón flotante "volver arriba" -->
<app-boton-scroll-arriba
  [visible]="showScrollTop"
  (clicked)="scrollToTop()"
></app-boton-scroll-arriba>
```

**Conceptos clave del template:**

| Sintaxis | Nombre | Qué hace |
|---|---|---|
| `[propiedad]="valor"` | Property binding | Pasa un dato del padre al hijo. El hijo lo recibe con `@Input()`. |
| `(evento)="handler($event)"` | Event binding | El hijo emite un evento con `@Output()` y el padre lo captura. |
| `#mainContent` | Template reference | Le da un nombre al elemento DOM para accederlo con `@ViewChild`. |
| `@if (condición) { }` | Control flow | Muestra u oculta un bloque de HTML según una condición. |
| `@defer { } @placeholder { }` | Lazy loading | Carga el componente solo cuando entra al viewport (ver sección 12). |

### La lógica de scroll — la parte más importante del componente

El scroll hace 3 cosas simultáneamente: calcula el progreso, detecta qué sección está activa, y decide si mostrar el botón "volver arriba".

```typescript
ngOnInit(): void {
  // CLAVE: registro el listener de scroll FUERA de NgZone.
  // ¿Qué es NgZone? Es el sistema que Angular usa para detectar cambios.
  // Si el scroll corriera DENTRO de NgZone, Angular haría "change detection"
  // (recalcular toda la vista) en cada pixel que el usuario scrollea.
  // Eso sería MUY lento. Sacándolo de NgZone, Angular no se entera del scroll.
  this.ngZone.runOutsideAngular(() => {
    this.mainRef.nativeElement.addEventListener('scroll', this.onScroll, { passive: true });
    //                                                                     ^^^^^^^^^^^^^^^^
    // passive: true le dice al navegador que este listener nunca va a llamar a
    // preventDefault(). Esto permite que el navegador optimice el scroll (60fps).
  });
}
```

```typescript
// El handler de scroll usa requestAnimationFrame para no calcular más de 60 veces por segundo.
// Sin esto, el navegador podría disparar cientos de eventos scroll por segundo.
private onScroll = (): void => {
  if (this.ticking) return; // Ya hay un cálculo pendiente, descarto este evento
  this.ticking = true;

  requestAnimationFrame(() => {
    const el = this.mainRef.nativeElement;
    const { scrollTop, scrollHeight, clientHeight } = el;
    //       ↑ cuánto scrolleé  ↑ alto total      ↑ alto visible

    // 1. PROGRESO: número entre 0 (arriba) y 1 (abajo)
    const maxScroll = scrollHeight - clientHeight || 1;
    const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);

    // 2. BOTÓN SCROLL-TOP: aparece después de scrollear 400px
    const showTop = scrollTop > 400;

    // 3. ACTUALIZO LA BARRA DE PROGRESO DIRECTO EN EL DOM
    //    Sin pasar por Angular, para que sea instantáneo (60fps).
    const progressBarEl = document.querySelector('.sidebar__progress-bar') as HTMLElement;
    if (progressBarEl) {
      progressBarEl.style.transform = `scaleY(${progress})`;
    }

    // 4. DETECCIÓN DE SECCIÓN ACTIVA
    //    Recorro todas las secciones y busco cuál está en el 30% superior del viewport.
    let currentSection = this.activeSection;
    if (!this.isScrolling) { // Bloqueado durante scroll programático
      if (scrollTop < 10) {
        currentSection = 'hero'; // Estoy arriba de todo
      } else if (scrollTop + clientHeight >= scrollHeight - 60) {
        currentSection = this.sectionIds[this.sectionIds.length - 1]; // Estoy abajo de todo
      } else {
        const mainRect = el.getBoundingClientRect();
        const offset = clientHeight * 0.3;
        for (const id of this.sectionIds) {
          const section = document.getElementById(id);
          if (section) {
            const relativeTop = section.getBoundingClientRect().top - mainRect.top;
            if (relativeTop <= offset) {
              currentSection = id; // Esta sección superó el 30% del viewport
            }
          }
        }
      }
    }

    // 5. SOLO SI CAMBIÓ ALGO, le aviso a Angular para que actualice la vista.
    //    Esto es la optimización clave: entro a NgZone solo cuando hay novedades.
    if (
      this.scrollProgress !== progress ||
      this.showScrollTop !== showTop ||
      this.activeSection !== currentSection
    ) {
      this.ngZone.run(() => {
        this.scrollProgress = progress;
        this.showScrollTop = showTop;
        this.activeSection = currentSection;
      });
    }

    this.ticking = false;
  });
};
```

### Navegación programática — `handleNavClick`

Cuando el usuario hace clic en un ítem del sidebar o el drawer:

```typescript
handleNavClick(sectionId: string): void {
  // 1. Cierro el drawer mobile
  this.isDrawerOpen = false;
  document.body.classList.remove('drawer-open');

  // 2. Si es "hero", scrolleo al inicio
  if (sectionId === 'hero') {
    this.isScrolling = true;       // Bloqueo la detección de sección
    this.activeSection = 'hero';    // Marco la sección activa inmediatamente
    this.mainRef.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { this.isScrolling = false; }, 800); // Desbloqueo después de 800ms
    return;
  }

  // 3. FUERZO la carga de secciones lazy que estén ANTES de la sección destino.
  //    Si el usuario hace clic en "Contacto", necesito que "Habilidades técnicas",
  //    "Portfolio" y "Contacto" se carguen ANTES de hacer el scroll.
  const lazySections = [
    { id: 'habilidades-tecnicas', signal: this.forceHabilidades },
    { id: 'portfolio',            signal: this.forcePortfolio },
    { id: 'contacto',             signal: this.forceContacto },
  ];
  const allSectionOrder = [
    'hero','sobre-mi','habilidades-tecnicas','habilidades-blandas',
    'idiomas','experiencia','educacion','portfolio','contacto',
  ];
  const targetIdx = allSectionOrder.indexOf(sectionId);
  for (const ls of lazySections) {
    if (allSectionOrder.indexOf(ls.id) <= targetIdx) {
      ls.signal.set(true); // Fuerzo la carga
    }
  }

  // 4. Espero 2 frames de animación para que Angular renderice las secciones forzadas
  requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    this.isScrolling = true;
    this.activeSection = sectionId;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Re-scroll de corrección después de 500ms por si las secciones lazy
    // cambiaron el layout durante el primer scroll
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);

    setTimeout(() => { this.isScrolling = false; }, 1400);
  });
  });
}
```

---

## 7) Sistema de estilos — SCSS, temas y convenciones

### Arquitectura de estilos

El sistema de estilos tiene 4 capas que se importan en un orden específico:

```
styles.scss              ← Punto de entrada (solo imports)
  @use 'styles/theme'    ← Define las CSS Custom Properties (colores claros/oscuros)
  @use 'styles/base'     ← Reset, scrollbar, animaciones globales

Cada componente importa:
  @use 'variables' as *  ← Variables SCSS ($font-ui, $radius-xl, breakpoints, z-index)
  @use 'mixins' as *     ← Mixins (@include lg, @include card-base, etc.)
```

**El orden importa**: `theme` va antes que `base` porque `_base.scss` usa las CSS custom properties que `_theme.scss` define.

### _theme.scss — El sistema de colores

Definí ~40 CSS Custom Properties para dos paletas de colores. El `TemaService` agrega o quita la clase `.dark` en el `<html>` y todas las variables cambian instantáneamente:

```scss
:root {
  // Modo claro (por defecto)
  --background: #eef3f9;                         // Fondo general
  --foreground: #0f172a;                         // Color de texto
  --portfolio-accent: #4f46e5;                   // Color de acento (azul índigo)
  --portfolio-accent-glow: rgba(79, 70, 229, 0.14); // Fondo translúcido para chips
  --portfolio-card-bg: #ffffff;                  // Fondo de tarjetas
  --portfolio-card-border: rgba(15, 23, 42, 0.09); // Borde de tarjetas
  --portfolio-section-alt: #e8eff8;              // Fondo alterno para secciones pares
  // ... y más variables
}

.dark {
  // Modo oscuro — se activa cuando <html> tiene class="dark"
  --background: #0c1222;
  --foreground: #e2e8f0;
  --portfolio-accent: #22d3ee;                   // Acento cambia a cyan
  --portfolio-accent-glow: rgba(34, 211, 238, 0.12);
  --portfolio-card-bg: #151f35;
  --portfolio-card-border: rgba(255, 255, 255, 0.06);
  --portfolio-section-alt: #111a2e;
}
```

**¿Cómo funciona?** Todos los componentes usan `var(--background)`, `var(--portfolio-accent)`, etc. Cuando `TemaService` agrega `class="dark"` al `<html>`, los valores de las variables cambian automáticamente. No toco ningún componente individual.

### _variables.scss — Variables estáticas

Son valores que no cambian en runtime (se resuelven al compilar el SCSS):

```scss
// Tipografía
$font-ui: 'Inter', sans-serif;       // Fuente para texto de interfaz
$font-code: 'Fira Code', monospace;  // Fuente para nombres de tecnologías

// Layout
$sidebar-width: 280px;               // Ancho fijo del sidebar en desktop
$mobile-header-height: 56px;         // Alto del header en mobile

// Bordes redondeados (de menor a mayor)
$radius-sm: 0.375rem;    // 6px — bordes sutiles
$radius-xl: 0.75rem;     // 12px — tarjetas
$radius-full: 9999px;    // Completamente redondo (chips, badges)

// Breakpoints responsivos (mobile-first: se activan ARRIBA de este ancho)
$bp-sm: 640px;    // Pantallas chicas
$bp-md: 768px;    // Tablets
$bp-lg: 1024px;   // Desktop (acá aparece el sidebar)
$bp-xl: 1280px;   // Pantallas grandes

// Capas de profundidad (z-index): quién tapa a quién
$z-sidebar: 30;   // Sidebar arriba del contenido
$z-overlay: 40;   // Overlay del drawer arriba del sidebar
$z-drawer: 50;    // Drawer arriba del overlay
$z-header: 50;    // Header mobile al mismo nivel que el drawer
$z-tooltip: 60;   // Tooltips arriba de todo

// Duraciones estándar de transiciones
$transition-fast: 150ms ease;   // Hovers de íconos
$transition-base: 200ms ease;   // La mayoría de interacciones
$transition-slow: 300ms ease;   // Animaciones visibles
```

### _mixins.scss — Bloques de CSS reutilizables

Los mixins son como "funciones" de SCSS: defino un bloque de estilos una vez y lo uso en muchos componentes con `@include`:

```scss
// RESPONSIVE: en vez de escribir el @media query entero, uso @include lg { ... }
@mixin sm { @media (min-width: $bp-sm) { @content; } }
@mixin md { @media (min-width: $bp-md) { @content; } }
@mixin lg { @media (min-width: $bp-lg) { @content; } }

// CARD BASE: estilo visual compartido por todas las tarjetas del portfolio
@mixin card-base {
  background-color: var(--portfolio-card-bg);
  border: 1px solid var(--portfolio-card-border);
  border-radius: $radius-2xl;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

// SECTION PADDING: padding uniforme que crece con el tamaño de pantalla
@mixin section-padding {
  padding: 5rem 1.5rem;                      // Mobile: poco padding lateral
  @include md { padding: 5rem 3rem; }         // Tablet: más espacio
  @include lg { padding: 5rem 4rem; }         // Desktop: más todavía
}

// DOT GRID: grilla de puntos decorativos de fondo (via ::before)
@mixin dot-grid($opacity: 0.018) {
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: $opacity;
    background-image: radial-gradient(circle, var(--foreground) 1px, transparent 1px);
    background-size: 32px 32px;
  }
}
```

### BEM — Convención de nombres para clases CSS

Todos los componentes usan **BEM (Block Element Modifier)** para nombrar las clases. Es una convención que evita conflictos entre componentes:

```scss
.contact {                     // Block: el componente completo
  &__header { }                // Element: una parte del componente
  &__input { }                 // Element: otra parte
  &__input--error { }          // Modifier: variante del element (input con error)
  &__input--focused { }        // Modifier: otra variante
}
```

Esto genera clases como `.contact__header` y `.contact__input--error`. La ventaja es que son únicas y descriptivas: nunca va a haber un conflicto con otra clase llamada `.header` de otro componente.

---

## 8) Servicios — la lógica compartida de la aplicación

En Angular, un **servicio** es una clase que contiene lógica que no pertenece a ningún componente en particular y que potencialmente es usada por varios componentes. Se marca con `@Injectable({ providedIn: 'root' })` para que Angular cree **una sola instancia** (patrón *singleton*) compartida por toda la app.

### TemaService — Modo claro/oscuro

```typescript
@Injectable({ providedIn: 'root' }) // Singleton: una sola instancia para toda la app
export class TemaService {
  private readonly STORAGE_KEY = 'portfolio-theme';

  // SIGNAL: variable reactiva. Los componentes que lean theme() se actualizan
  // automáticamente cuando el valor cambia.
  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.theme()); // Aplico el tema guardado al iniciar
  }

  // Alterna entre claro y oscuro
  toggleTheme(): void {
    const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);     // Actualizo el signal (notifica a los componentes)
    this.applyTheme(next);    // Aplico el cambio al DOM
  }

  // Lee el tema de localStorage. Si no hay nada guardado, uso 'dark' por defecto
  private getInitialTheme(): Theme {
    const stored = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    return stored ?? 'dark';
  }

  // Agrego o quito la clase 'dark' en <html> y persisto en localStorage
  private applyTheme(theme: Theme): void {
    const root = document.documentElement; // = <html>
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(this.STORAGE_KEY, theme);
  }
}
```

**¿Cómo se usa?** Cualquier componente que necesite cambiar el tema inyecta `TemaService` y llama a `toggleTheme()`. El sidebar y el header mobile lo hacen a través de un botón sol/luna.

### ApiService — Comunicación con el backend

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private urlApi = environment.apiUrl; // '/api' (tanto en dev como en prod)

  constructor(private http: HttpClient) {}

  // Envía los datos del formulario al endpoint /api/contact
  sendContactMessage(datos: DatosContacto): Observable<RespuestaApi> {
    const url = `${this.urlApi}/contact`;
    const encabezados = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<RespuestaApi>(url, datos, { headers: encabezados })
      .pipe(catchError(this.manejarError));
      //    ^^^^^ pipe() encadena operadores de RxJS
      //    catchError intercepta errores HTTP y los transforma
  }

  // Manejo centralizado de errores: distingue errores de red de errores del servidor
  private manejarError(error: HttpErrorResponse): Observable<never> {
    let mensajeError = 'Ocurrió un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del CLIENTE (sin conexión, CORS, etc.)
      mensajeError = `Error: ${error.error.message}`;
    } else {
      // Error del SERVIDOR (400, 500, etc.)
      mensajeError = error.error?.message || `Error ${error.status}: ${error.statusText}`;
    }

    console.error('ApiService error:', mensajeError);
    return throwError(() => new Error(mensajeError));
  }
}
```

**¿Qué es un Observable?** Es un concepto de RxJS. Pensalo como una "promesa mejorada": representa un dato que va a llegar en el futuro. El componente se "suscribe" al Observable para recibir la respuesta:

```typescript
// En el componente de contacto:
this.apiService.sendContactMessage(datos).subscribe({
  next: (respuesta) => { /* Éxito: muestro mensaje verde */ },
  error: (err) => { /* Error: muestro mensaje rojo */ },
});
```

### SeoService — Posicionamiento en buscadores

```typescript
@Injectable({ providedIn: 'root' })
export class SeoService {
  init(): void {
    // 1. Título de la pestaña del navegador
    this.titleService.setTitle('Marcos Ezequiel Toledo — Desarrollador de Software & QA Tester');

    // 2. Meta tags básicos (descripción, keywords, autor)
    this.setMeta('description', 'Portfolio de Marcos Ezequiel Toledo...');
    this.setMeta('robots', 'index, follow'); // Le digo a Google que indexe esta página

    // 3. Open Graph (para cuando comparten el link en LinkedIn, Facebook, etc.)
    this.setProperty('og:title', 'Marcos Ezequiel Toledo...');
    this.setProperty('og:image', 'https://marcostoledo.dev/assets/img/og-preview.png');

    // 4. Twitter Card (para cuando comparten en Twitter/X)
    this.setMeta('twitter:card', 'summary_large_image');

    // 5. Canonical URL (le dice a Google cuál es la URL "oficial" del sitio)
    this.ensureCanonical('https://marcostoledo.dev');

    // 6. JSON-LD (datos estructurados que Google usa para rich snippets)
    this.ensureJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Marcos Ezequiel Toledo',
      jobTitle: 'Desarrollador de Software & QA Tester',
      // ...
    });
  }
}
```

El `SeoService` se inicializa una sola vez desde el constructor de `AppComponent` con `seoService.init()`.

---

## 9) Directivas — comportamientos reutilizables

En Angular, una **directiva** es un comportamiento que le podés agregar a cualquier elemento HTML. Es como un "atributo mágico" que le da superpoderes a un tag.

### AnimateOnScrollDirective — Animación al entrar al viewport

Esta es la directiva que produce las animaciones "fade-up" que se ven en todo el portfolio:

```typescript
@Directive({
  selector: '[appAnimateOnScroll]', // Se usa como atributo: <div appAnimateOnScroll>
  standalone: true,
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
  @Input() animateDelay = 0;         // Retardo en segundos antes de animar
  @Input() animateThreshold = 0.15;  // % del elemento visible para disparar

  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    const element = this.el.nativeElement;

    // 1. Agrego la clase CSS que pone el elemento invisible
    element.classList.add('animate-on-scroll');
    // (en _base.scss: opacity: 0, transform: translateY(25px))

    // 2. Si tiene delay, lo aplico como estilo inline
    if (this.animateDelay > 0) {
      element.style.transitionDelay = `${this.animateDelay}s`;
    }

    // 3. Creo un IntersectionObserver FUERA de NgZone (optimización)
    this.ngZone.runOutsideAngular(() => {
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // El elemento entró al viewport → agrego clase 'visible'
            // (en _base.scss: opacity: 1, transform: translateY(0))
            element.classList.add('visible');
            this.observer?.unobserve(element); // Solo animo UNA vez
          }
        },
        { threshold: this.animateThreshold },
      );
      this.observer.observe(element);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect(); // Limpio para evitar memory leaks
  }
}
```

**¿Cómo se usa?**

```html
<!-- Animación básica -->
<div appAnimateOnScroll>Este contenido aparece al scrollear</div>

<!-- Con delay (para efecto cascada: card 1 aparece, luego card 2, luego card 3) -->
<div appAnimateOnScroll [animateDelay]="0.1">Card 1</div>
<div appAnimateOnScroll [animateDelay]="0.2">Card 2</div>
<div appAnimateOnScroll [animateDelay]="0.3">Card 3</div>
```

**El CSS que lo hace funcionar** (en `_base.scss`):

```scss
.animate-on-scroll {
  opacity: 0;                          // Invisible al inicio
  transform: translateY(25px);         // 25px más abajo de su posición final
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;

  &.visible {
    opacity: 1;                        // Visible
    transform: translateY(0);          // En su posición correcta
  }
}
```

---

## 10) Componentes de layout — sidebar, header y drawer

### BarraLateralComponent (sidebar desktop)

Visible solo en pantallas **≥ 1024px**. Es el componente de navegación principal.

**Contenido:**
- **Avatar** con foto de perfil
- **Nombre y subtítulo**
- **9 ítems de navegación** (uno por sección). El ítem activo se resalta con color accent y un "pill" animado que se desliza.
- **Barra de progreso de scroll** vertical
- **Toggle de tema** (sol/luna)
- **Blobs decorativos** animados en el fondo

Los ítems de navegación están definidos como constante exportada para reutilizarlos:

```typescript
export const NAV_ITEMS: NavItem[] = [
  { id: 'hero',                 label: 'Inicio',               icon: 'home'           },
  { id: 'sobre-mi',             label: 'Sobre mí',             icon: 'user'           },
  { id: 'habilidades-tecnicas', label: 'Habilidades Técnicas', icon: 'code-2'         },
  { id: 'habilidades-blandas',  label: 'Habilidades Blandas',  icon: 'heart'          },
  { id: 'idiomas',              label: 'Idiomas',              icon: 'languages'      },
  { id: 'experiencia',          label: 'Experiencia',          icon: 'briefcase'      },
  { id: 'educacion',            label: 'Educación',            icon: 'graduation-cap' },
  { id: 'portfolio',            label: 'Portfolio',            icon: 'folder-open'    },
  { id: 'contacto',             label: 'Contacto',             icon: 'mail'           },
];
```

**¿Cómo funciona el pill animado?** Cuando cambia `activeSection`, el componente mide la posición del botón activo respecto al `<ul>` y actualiza un signal con la nueva posición. El pill (un `<div>` con `position: absolute`) se mueve suavemente con CSS `transition`:

```typescript
private updatePill(): void {
  // 1. Encuentro el índice del ítem activo
  const activeIndex = this.navItems.findIndex(n => n.id === this.activeSection);
  // 2. Obtengo el botón del DOM usando ViewChildren
  const activeBtn = this.navBtns.get(activeIndex);
  // 3. Calculo la posición relativa al <ul>
  const ulRect  = this.navListRef.nativeElement.getBoundingClientRect();
  const btnRect = activeBtn.nativeElement.getBoundingClientRect();
  const top    = btnRect.top - ulRect.top + this.navListRef.nativeElement.scrollTop;
  // 4. Actualizo el signal → Angular mueve el pill
  this.pillPos.set({ top, height: btnRect.height });
}
```

### EncabezadoMovilComponent (header + drawer)

Visible solo en pantallas **< 1024px**. Tiene dos partes:

1. **Header fijo** (56px): muestra "MT" a la izquierda y un botón hamburguesa/X a la derecha
2. **Drawer**: panel lateral que se desliza desde la derecha con un overlay oscuro detrás. Contiene las mismas opciones de navegación que el sidebar.

Al hacer clic en un ítem de navegación desde el drawer, automáticamente se cierra y se scrollea a la sección.

### BotonScrollArribaComponent

Botón circular flotante (esquina inferior derecha) que aparece cuando el usuario scrolleó más de 400px. Usa **Angular Animations** para la entrada y salida:

```typescript
animations: [
  trigger('fadeScale', [
    transition(':enter', [  // Cuando el botón APARECE
      style({ opacity: 0, transform: 'scale(0.5)' }),     // Empieza invisible y chiquito
      animate('200ms ease-out',
        style({ opacity: 1, transform: 'scale(1)' })),    // Termina visible y tamaño normal
    ]),
    transition(':leave', [  // Cuando el botón DESAPARECE
      animate('150ms ease-in',
        style({ opacity: 0, transform: 'scale(0.5)' })),  // Se achica y desaparece
    ]),
  ]),
]
```

---

## 11) Las 9 secciones del portfolio

Todas las secciones comparten un patrón visual:

```
┌────────────────────────────────────────┐
│  Dot grid decorativo de fondo          │
│  ┌──────────────────────────────────┐  │
│  │  Header: ícono + título + línea  │  │
│  │  Contenido específico de cada    │  │
│  │  sección                         │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

Todas usan `ChangeDetectionStrategy.OnPush` (Angular solo re-renderiza si cambia un `@Input`) y `AnimateOnScrollDirective` para las animaciones de entrada.

### 1. Hero Section

La primera sección visible, ocupa toda la pantalla (`min-height: 100vh`).

**Funcionalidades:**
- **Typewriter**: efecto máquina de escribir que rota entre 4 frases. Escribe a 60ms por carácter y borra a 30ms.
- **Contadores animados**: números que crecen desde 0 con una curva cubic-out durante 1600ms (ej: "8+ Proyectos", "18 Tecnologías").
- **Badge "Disponible para proyectos"** con un punto verde que pulsa.
- **Botones sociales**: GitHub, LinkedIn, Email, Descargar CV.
- **Fondo animado**: gradiente + 3 blobs con `@keyframes` + dot grid + formas geométricas flotantes.

```typescript
// El efecto typewriter funciona con un timer recursivo:
private tick(): void {
  const current = this.phrases[this.phraseIdx];

  if (!this.deleting) {
    // Modo ESCRIBIR: agrego un carácter cada 60ms
    if (this.charIdx < current.length) {
      this.charIdx++;
      this.displayText = current.slice(0, this.charIdx);
      this.timer = setTimeout(() => this.tick(), 60);
    } else {
      // Terminé de escribir → espero 2.2 segundos → empiezo a borrar
      this.timer = setTimeout(() => {
        this.deleting = true;
        this.tick();
      }, 2200);
    }
  } else {
    // Modo BORRAR: quito un carácter cada 30ms (más rápido que escribir)
    if (this.charIdx > 0) {
      this.charIdx--;
      this.displayText = current.slice(0, this.charIdx);
      this.timer = setTimeout(() => this.tick(), 30);
    } else {
      // Terminé de borrar → paso a la siguiente frase
      this.deleting = false;
      this.phraseIdx = (this.phraseIdx + 1) % this.phrases.length;
      this.tick();
    }
  }
}
```

```typescript
// Los contadores usan requestAnimationFrame + cubic-out easing:
private animateCounter(index: number, target: number, duration: number): void {
  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min((now - start) / duration, 1);   // Progreso 0-1
    const eased = 1 - Math.pow(1 - p, 3);               // Cubic-out: rápido al inicio, lento al final
    this.counters[index] = Math.floor(eased * target);   // Valor actual del contador
    this.cdr.markForCheck();                              // Notifico a Angular que cambió algo (OnPush)
    if (p < 1) requestAnimationFrame(step);               // Sigo animando si no terminé
  };
  requestAnimationFrame(step);
}
```

### 2. Sobre Mí

Layout tipo **bento grid** (grilla asimétrica) con 5 cards:
- **Bio**: texto de presentación con link a mi experiencia laboral
- **Ubicación**: Buenos Aires, Argentina
- **Objetivo**: "Full Stack orientado a calidad y automatización"
- **Aprendiendo**: chips con tecnologías que estoy estudiando
- **Stack Actual**: chips con las tecnologías que más uso

### 3. Habilidades Técnicas — Flip 3D

Grid de **18 tarjetas** con efecto **flip 3D** al hacer clic:

- **Frente**: ícono de la tecnología + nombre
- **Reverso**: badge de estado (experiencia práctica / en formación) + descripción + estrellas de nivel (1-5)
- **8 tarjetas "active"** y **10 "learning"**
- **Solo una tarjeta abierta a la vez** (hacer clic en una cierra la anterior)
- **En mobile** (< 640px): la tarjeta vuelve sola después de 3 segundos

**¿Cómo funciona el 3D?**

```scss
.flip-card {
  perspective: 800px;           // Crea el "espacio 3D" donde la tarjeta vive
}
.flip-card__inner {
  transform-style: preserve-3d; // Los hijos (front y back) existen en 3D
  transition: transform 0.5s;   // La rotación tarda 0.5 segundos
}
.flip-card--flipped .flip-card__inner {
  transform: rotateY(180deg);   // ¡Se voltea!
}
.flip-card__front, .flip-card__back {
  backface-visibility: hidden;  // Oculta la cara trasera cuando no mira al usuario
}
.flip-card__back {
  transform: rotateY(180deg);   // El dorso empieza "volteado" (mirando para atrás)
}
```

### 4. Habilidades Blandas

Cards con íconos que muestran cada soft skill con descripción. Grid responsive que va de 1 columna en mobile a 3 en desktop.

### 5. Idiomas

Cards para cada idioma con nivel (nativo/intermedio/básico), barra de progreso visual, porcentaje y badge de nivel.

### 6. Experiencia

Card de experiencia laboral con:
- Roles como chips de colores
- Métricas de impacto
- Responsabilidades con bullet points
- Tecnologías usadas en chips

### 7. Educación

Cards de formación académica con:
- Línea lateral degradada con color propio
- Badge de estado (En curso / Completado)
- Promedio en número grande con fuente Fira Code

### 8. Portfolio — Tilt 3D + filtros

Grid de **proyectos** con funcionalidades avanzadas:

- **Filtros animados**: Todos / En desarrollo / Finalizado, con contadores que muestran cuántos proyectos hay en cada categoría
- **Proyectos destacados** con badge ámbar
- **Efecto tilt 3D**: al mover el mouse sobre una card, se calcula el ángulo según la posición del cursor y la tarjeta se "inclina" sutilmente
- **Animación stagger**: cuando cambio de filtro, las tarjetas aparecen con un efecto cascada (cada una ligeramente después de la anterior)
- **Chips de tecnología** en fuente monospace
- **Botones de acción**: Demo (primario) y Código (secundario) con links a sitio y GitHub

La animación de entrada de las tarjetas usa Angular Animations con stagger:

```typescript
animations: [
  trigger('cardEnter', [
    transition(':enter', [
      query('.card', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        stagger('60ms', [
          animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
        ]),
      ], { optional: true }),
    ]),
  ]),
]
```

### 9. Contacto

Dos columnas en desktop (1 en mobile):

**Formulario (izquierda):**
- Nombre + Email en fila de 2 columnas (en sm+)
- Textarea de 8 filas para el mensaje
- Validación por campo con mensajes de error en rojo
- Widget de Cloudflare Turnstile (CAPTCHA)
- Botón submit con estado de carga (spinner)
- Estado de éxito con ícono CheckCircle verde

**Info de contacto (derecha):**
- Card "Conectemos" con badge "Disponible para trabajar"
- Links a GitHub, LinkedIn, Email y CV con hover con color dinámico

La lógica de envío usa template-driven forms con `[(ngModel)]` y validación manual:

```typescript
onSubmit(): void {
  if (!this.validateForm()) return;     // Valido todos los campos
  if (!this.turnstileToken) return;     // Verifico que el CAPTCHA se completó

  this.isSubmitting = true;
  const datos: DatosContacto = {
    name: this.formData.name.trim(),
    email: this.formData.email.trim(),
    message: this.formData.message.trim(),
    turnstileToken: this.turnstileToken,
  };

  this.apiService.sendContactMessage(datos).subscribe({
    next: () => {
      this.isSubmitting = false;
      this.isSuccess = true;            // Muestro el mensaje de éxito
      this.resetForm();                 // Limpio el formulario
    },
    error: (err) => {
      this.isSubmitting = false;
      this.errorMessage = err.message;  // Muestro el error
    },
  });
}
```

---

## 12) Lazy loading con @defer — carga diferida de secciones

### ¿Qué problema resuelve?

Si cargo todos los componentes de golpe al abrir el portfolio, el bundle de JavaScript es más grande y tarda más en cargar. Las secciones que están abajo de la página (como Portfolio y Contacto) no se ven hasta que el usuario scrollea. ¿Para qué cargarlas antes?

### ¿Cómo funciona @defer?

`@defer` es una feature de Angular 17+ que permite cargar un componente **solo cuando se necesita**:

```html
<!-- Angular NO carga SeccionPortfolioComponent hasta que el usuario scrollee hasta acá -->
@defer (when forcePortfolio(); on viewport; prefetch on idle) {
  <app-seccion-portfolio></app-seccion-portfolio>
} @placeholder {
  <!-- Mientras tanto, muestra un placeholder liviano -->
  <app-lazy-section variant="portfolio" sectionId="portfolio" minHeight="700px"></app-lazy-section>
}
```

**¿Qué significan los triggers?**

| Trigger | Qué hace |
|---|---|
| `when forcePortfolio()` | Carga la sección cuando el signal `forcePortfolio` se pone en `true` (por ejemplo, cuando el usuario hace clic en "Portfolio" en el sidebar) |
| `on viewport` | Carga la sección cuando el placeholder entra al viewport (el usuario scrolleó hasta ahí) |
| `prefetch on idle` | Pre-descarga el código JavaScript de la sección cuando el navegador está inactivo (no está procesando nada). Así cuando el usuario scrollee, la sección ya está lista para mostrarse. |

### ¿Qué secciones usan @defer?

Apliqué `@defer` a las 3 secciones más pesadas, que además están más lejos del inicio:
1. **Habilidades Técnicas** (18 tarjetas con flip 3D + imágenes)
2. **Portfolio** (proyectos con animaciones, tilt 3D, imágenes)
3. **Contacto** (formulario con validación + widget de Turnstile)

### El componente placeholder: `LazySectionComponent`

Mientras la sección real no se cargó, se muestra un placeholder liviano con la misma altura mínima para que no haya saltos de layout:

```html
<app-lazy-section
  variant="portfolio"           <!-- Tipo de placeholder visual -->
  sectionId="portfolio"         <!-- ID para el IntersectionObserver -->
  minHeight="700px"             <!-- Reservo el espacio en el layout -->
></app-lazy-section>
```

---

## 13) Splash screen y paleta de comandos

### SplashScreen — La pantalla de carga

Es un overlay fijo que se muestra al abrir el portfolio. Muestra las iniciales "MT" con una animación clip-path y una barra de progreso.

```typescript
export class SplashScreenComponent implements OnInit, OnDestroy {
  @Output() finished = new EventEmitter<void>(); // Avisa al padre cuando terminó
  readonly exiting = signal(false);              // Controla la animación de salida

  // Respeta accesibilidad: si el usuario tiene "reducir movimiento" activado, salteo todo
  readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  ngOnInit(): void {
    const minDuration  = this.reducedMotion ? 0 : 1200; // Duración mínima de la pantalla
    const exitDuration = this.reducedMotion ? 0 : 420;  // Duración de la animación de salida

    this.exitTimer = setTimeout(() => {
      this.exiting.set(true);  // Inicio la animación de salida (fade-out + scale)
      this.finishTimer = setTimeout(() => {
        this.finished.emit();  // Le digo al AppComponent que me quite del DOM
      }, exitDuration);
    }, minDuration);
  }
}
```

En el `AppComponent`:
```html
@if (!splashDone()) {
  <app-splash-screen (finished)="splashDone.set(true)"></app-splash-screen>
}
```

### PaletaComandosComponent — Búsqueda rápida tipo VS Code

Se abre con **Ctrl+K** (o **Cmd+K** en Mac). Permite buscar rápidamente secciones, proyectos y acciones (cambiar tema, contactar, etc.).

**Funcionalidades:**
- Búsqueda fuzzy en tiempo real mientras el usuario escribe
- Navegación completa por teclado (flechas, Enter, Escape)
- Acciones rápidas: cambiar tema, ir a sección, abrir links externos
- Agrupación por categoría (Navegación, Proyectos, Acciones)
- Se cierra al hacer clic afuera o presionar Escape

```typescript
// Se activa con Ctrl+K / Cmd+K
@HostListener('document:keydown', ['$event'])
onKeydown(e: KeyboardEvent): void {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    this.toggle(); // Abre o cierra la paleta
  }
  if (e.key === 'Escape' && this.isOpen()) {
    this.close();
  }
}
```

---

## 14) SEO — posicionamiento en buscadores

El SEO (Search Engine Optimization) se encarga de que Google y otros buscadores encuentren e indexen correctamente el portfolio.

**¿Qué implementé?**

| Técnica | Para qué sirve |
|---|---|
| `<title>` dinámico | Lo que se ve en la pestaña del navegador y en los resultados de Google |
| `<meta name="description">` | El texto que aparece debajo del título en Google |
| `<meta name="keywords">` | Palabras clave para ayudar a los buscadores |
| **Open Graph** (`og:title`, `og:image`, etc.) | Cuando alguien comparte mi portfolio en LinkedIn/Facebook, se ve una card linda con imagen |
| **Twitter Card** | Lo mismo pero para Twitter/X |
| `<link rel="canonical">` | Le dice a Google cuál es la URL "oficial" del sitio (evita contenido duplicado) |
| **JSON-LD** (schema.org Person) | Datos estructurados que Google usa para entender que soy una persona con cierto perfil profesional |

Todo esto lo maneja `SeoService`, que se ejecuta una sola vez al iniciar la app.

---

## 15) Backend serverless — la API de contacto

### ¿Qué es una función serverless?

Es código que se ejecuta **solo cuando alguien lo llama**. No hay un servidor corriendo 24/7. Vercel se encarga de:

1. Recibir la petición HTTP
2. Levantar un entorno Node.js
3. Ejecutar mi función
4. Devolver la respuesta
5. Apagar todo

**Ventaja**: no pago un servidor que esté prendido todo el día. Solo se ejecuta cuando alguien manda un mensaje desde el formulario.

### El flujo completo de `api/index.js`

```
POST /api/contact
  │
  ├── 1. Configuro headers CORS
  │      (permito que el frontend llame a esta API desde cualquier dominio)
  │
  ├── 2. Si es OPTIONS → respondo 200 (preflight del navegador)
  │      (El navegador manda OPTIONS antes de POST para verificar que está permitido)
  │
  ├── 3. Si no es POST → respondo 405 (método no permitido)
  │
  ├── 4. Valido los campos con express-validator:
  │      - name: requerido, entre 2 y 100 caracteres
  │      - email: requerido, formato de email válido, normalizado
  │      - message: requerido, entre 10 y 1000 caracteres
  │
  ├── 5. Si hay errores de validación → 400 + array de mensajes
  │
  ├── 6. Verifico el token de Cloudflare Turnstile (CAPTCHA)
  │      Si el token es inválido → 400 (el usuario es un bot)
  │
  ├── 7. Armo el email HTML con estilos inline
  │      (la mayoría de clientes de email ignoran hojas de estilo externas,
  │       por eso los estilos van directamente en cada tag)
  │
  ├── 8. Envío con Nodemailer (Gmail SMTP)
  │      from: "Portfolio Contacto" <mi-email>
  │      to: marcostoledo96@gmail.com
  │      subject: "📬 Nuevo mensaje de contacto de {nombre}"
  │      replyTo: email del remitente  ← así puedo responder directo
  │
  ├── Éxito → 200 + { success: true, message: '¡Mensaje enviado!' }
  └── Error → 500 + { success: false, message: 'Error al enviar' }
```

### El transporter de Nodemailer

```javascript
// Crea una conexión reutilizable con Gmail SMTP.
// Las credenciales vienen de variables de entorno (NUNCA hardcodeadas).
const transporter = nodemailer.createTransport({
  service: 'gmail',       // Nodemailer sabe que Gmail usa smtp.gmail.com:465
  auth: {
    user: process.env.EMAIL_USER, // Mi dirección de Gmail
    pass: process.env.EMAIL_PASS  // App Password de Google (no la contraseña de la cuenta)
  }
});
```

### Variables de entorno necesarias

Se configuran en Vercel Dashboard > Settings > Environment Variables:

| Variable | Qué es |
|---|---|
| `EMAIL_USER` | Mi dirección de Gmail |
| `EMAIL_PASS` | App Password de Google (Seguridad > Verificación en 2 pasos > Contraseñas de aplicación) |
| `TURNSTILE_SECRET` | Secret key de Cloudflare Turnstile para verificar tokens |

---

## 16) Seguridad — CAPTCHA con Cloudflare Turnstile

### ¿Qué problema resuelve?

Sin protección, un bot podría enviar miles de formularios por segundo, llenando mi casilla de spam y potencialmente haciendo que Google bloquee mi cuenta de Gmail.

### ¿Cómo funciona?

El proceso tiene 3 pasos:

```
1. El FRONTEND carga el widget de Turnstile (un recuadrito que dice "verificando...")
   → Turnstile verifica que es un humano (sin puzzles molestos)
   → Devuelve un TOKEN al frontend

2. El FRONTEND envía los datos del formulario + el token al backend:
   { name: "Juan", email: "juan@mail.com", message: "Hola", turnstileToken: "abc123..." }

3. El BACKEND verifica el token contra la API de Cloudflare:
   POST https://challenges.cloudflare.com/turnstile/v0/siteverify
   → Si es válido: envía el email
   → Si es inválido: rechaza con 400 (es un bot)
```

El backend hace la verificación porque un bot podría falsificar la respuesta del frontend. La verificación del lado del servidor es infalseada.

### En el frontend (`seccion-contacto.component.ts`):

```typescript
// Renderizo el widget de Turnstile en el formulario
private renderTurnstile(): void {
  (window as any).turnstile.render('#turnstile-widget', {
    sitekey: environment.turnstileSiteKey,
    callback: (token: string) => {
      this.turnstileToken = token; // Guardo el token para enviarlo con el formulario
    },
  });
}
```

### En el backend (`api/index.js`):

```javascript
async function verificarTurnstile(token, remoteIp) {
  const params = new URLSearchParams();
  params.append('secret', process.env.TURNSTILE_SECRET);
  params.append('response', token);
  if (remoteIp) params.append('remoteip', remoteIp);

  const resp = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body: params }
  );
  const data = await resp.json();
  return { ok: data.success };
}
```

---

## 17) Internacionalización (i18n) — español e inglés

Usé `@angular/localize` para tener el portfolio en dos idiomas.

### ¿Cómo funciona?

1. Marco los textos traducibles en los templates con el atributo `i18n`:
   ```html
   <h2 i18n="@@aboutTitle">Sobre mí</h2>
   ```

2. Extraigo los strings con: `npm run extract-i18n`
   Esto genera `messages.xlf` con todos los textos en español.

3. Creo `messages.en.xlf` con las traducciones al inglés.

4. Angular genera builds separados para cada idioma:
   ```bash
   npm run build          # Build en español (por defecto)
   npm run build:en       # Build en inglés
   npm run build:all      # Ambos idiomas
   ```

### Configuración en `angular.json`:

```json
"i18n": {
  "sourceLocale": "es",           // Idioma por defecto
  "locales": {
    "en": "src/locale/messages.en.xlf"  // Traducciones al inglés
  }
}
```

---

## 18) Testing — pruebas unitarias

### Herramientas

| Herramienta | Qué hace |
|---|---|
| **Jasmine** | Framework de testing. Permite escribir tests con `describe()` (agrupar), `it()` (un test individual) y `expect()` (verificar un resultado). |
| **Karma** | Test runner. Levanta un navegador real (Chrome Headless) y ejecuta los tests dentro de él. |

### ¿Cómo corro los tests?

```bash
cd frontend
npm run test
```

### Ejemplo de test (`api.service.spec.ts`):

```typescript
describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('debería enviar un mensaje de contacto', () => {
    const datos: DatosContacto = {
      name: 'Test',
      email: 'test@test.com',
      message: 'Mensaje de prueba',
    };

    // Llamo al método
    service.sendContactMessage(datos).subscribe((resp) => {
      expect(resp.success).toBeTrue();
    });

    // Verifico que se hizo la petición correcta
    const req = httpMock.expectOne('/api/contact');
    expect(req.request.method).toBe('POST');
    req.flush({ success: true }); // Simulo la respuesta del servidor
  });
});
```

**¿Qué es `HttpTestingController`?** Es un mock de Angular que intercepta las peticiones HTTP. En vez de que el test realmente llame al servidor, el mock intercepta la petición y yo le digo qué respuesta simular con `req.flush()`.

---

## 19) Performance — las optimizaciones que implementé

### 1. ChangeDetectionStrategy.OnPush

Por defecto, Angular verifica TODOS los componentes en cada evento (click, HTTP, timer). Con `OnPush`, solo verifica un componente si:

- Cambió un `@Input()`
- Se emitió un evento desde el template
- Se llamó a `markForCheck()` o `ChangeDetectorRef.detectChanges()`
- Cambió un `Signal` que el template lee

**Todos mis componentes usan OnPush**. Esto reduce drásticamente la cantidad de trabajo que Angular hace.

### 2. Scroll handler fuera de NgZone

El evento `scroll` se dispara cientos de veces por segundo. Si Angular hiciera change detection en cada one, la página se trabaría.

Solución: el handler corre fuera de NgZone (Angular no se entera) y solo entro a NgZone cuando realmente cambió un valor.

### 3. requestAnimationFrame throttle

Dentro del handler de scroll, uso `requestAnimationFrame` con un flag `ticking` para limitar los cálculos a 1 por frame (60fps máximo).

### 4. Lazy loading con @defer

Las 3 secciones más pesadas se cargan solo cuando el usuario las necesita. El código JavaScript se pre-descarga cuando el navegador está inactivo (`prefetch on idle`).

### 5. IntersectionObserver global

El observer del `main.ts` agrega/quita `section-in-view` en cada sección. En `_base.scss`, las secciones que NO están visibles tienen sus animaciones pausadas, ahorrando trabajo a la GPU.

### 6. Manipulación directa del DOM para la barra de progreso

En vez de pasar por Angular para actualizar la barra de progreso (lo que dispararía change detection), manipulo el `style.transform` directamente:

```typescript
const progressBarEl = document.querySelector('.sidebar__progress-bar') as HTMLElement;
if (progressBarEl) {
  progressBarEl.style.transform = `scaleY(${progress})`;
}
```

### 7. Imágenes en formato WebP

Todas las imágenes están en formato `.webp`, que es ~30% más liviano que JPEG con la misma calidad. El componente `ImagenFallbackComponent` muestra un placeholder si la imagen falla al cargar.

### 8. passive: true en scroll listeners

El flag `{ passive: true }` le dice al navegador que mi handler nunca va a llamar a `preventDefault()`, permitiendo que el navegador optimice el scroll.

### 9. prefers-reduced-motion

Respeté la preferencia de accesibilidad del sistema operativo. Si el usuario tiene activado "reducir movimiento":

```scss
@media (prefers-reduced-motion: reduce) {
  // Se desactivan TODAS las animaciones y transiciones
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

En el splash screen, si `prefers-reduced-motion` está activo, se salta directo al contenido sin animación.

---

## 20) Deploy en Vercel y CI/CD

### Configuración de Vercel (`vercel.json`)

```json
{
  "installCommand": "cd frontend && npm install --legacy-peer-deps",
  "buildCommand":   "cd frontend && npm run build",
  "outputDirectory": "frontend/dist/portfolio-frontend/browser",
  "framework": null,
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api" },
    { "source": "/(.*)",       "destination": "/index.html" }
  ]
}
```

**¿Qué hace cada cosa?**

| Campo | Qué hace |
|---|---|
| `installCommand` | Comando que Vercel ejecuta para instalar dependencias |
| `buildCommand` | Comando que Vercel ejecuta para compilar el proyecto |
| `outputDirectory` | Carpeta donde quedan los archivos estáticos compilados |
| `framework: null` | Desactiva la detección automática: Vercel usa mis comandos tal cual |
| Primer rewrite | `/api/*` → función serverless `api/index.js` |
| Segundo rewrite | Cualquier otra ruta → `index.html` (necesario para que la SPA funcione) |

### ¿Por qué el segundo rewrite?

En una SPA, todas las rutas las maneja JavaScript (Angular Router). Si alguien accede directamente a `mi-portfolio.vercel.app/contacto`, el servidor necesita servir `index.html` para que Angular se cargue y muestre la sección correcta. Sin el rewrite, Vercel devolvería un 404.

### Proceso de deploy

1. Conecto mi repositorio de GitHub a Vercel
2. Configuro las variables de entorno (`EMAIL_USER`, `EMAIL_PASS`, `TURNSTILE_SECRET`)
3. Cada push a `main` dispara un redeploy automático
4. Vercel ejecuta install → build → sirve los archivos

### CI/CD con GitHub Actions

Cada push y PR a `main` ejecuta automáticamente:

1. Checkout del código
2. Setup de Node.js
3. `npm ci` (instalación limpia de dependencias)
4. Build de producción
5. Tests unitarios con Chrome Headless
6. Sube reporte de cobertura como artefacto

Si algo falla (test roto, error de compilación), el pipeline se detiene y se ve el error en la pestaña "Actions" de GitHub.

---

## 21) Glosario de conceptos clave

### Angular

| Concepto | Qué es | Ejemplo en el proyecto |
|---|---|---|
| **Component** | Pieza de UI con su propia lógica, template y estilos. Es la unidad básica de Angular. | `SeccionContactoComponent` |
| **Template** | El HTML del componente con sintaxis especial de Angular (bindings, directivas, control flow). | `seccion-contacto.component.html` |
| **Directive** | Un comportamiento que se le agrega a un elemento HTML existente. | `appAnimateOnScroll`, `appParallax` |
| **Service** | Clase con lógica compartida entre componentes (inyectable). | `TemaService`, `ApiService`, `SeoService` |
| **Signal** | Variable reactiva de Angular 16+. Se lee con `()` y se escribe con `.set()`. | `theme = signal<Theme>('dark')` |
| **@Input()** | Dato que el componente padre le pasa al hijo. | `[activeSection]="activeSection"` |
| **@Output()** | Evento que el componente hijo emite al padre. | `(navClick)="handleNavClick($event)"` |
| **@ViewChild** | Referencia a un elemento del template para accederlo desde TypeScript. | `@ViewChild('mainContent')` |
| **@ViewChildren** | Referencia a TODOS los elementos que matchean un selector. | `@ViewChildren('navBtn')` |
| **Standalone** | Componente que declara sus propias dependencias sin necesitar un NgModule. | `standalone: true` en todos los componentes |
| **ChangeDetection OnPush** | Estrategia optimizada: solo re-renderiza si cambió un Input, Signal o se disparó un evento. | `ChangeDetectionStrategy.OnPush` |
| **NgZone** | Zone.js wrapper que Angular usa para detectar cambios. Sacando código de NgZone evito change detection innecesario. | `this.ngZone.runOutsideAngular(...)` |
| **@defer** | Carga diferida de componentes (Angular 17+). | `@defer (on viewport) { ... }` |
| **`bootstrapApplication`** | Función que arranca una app Angular con un componente standalone como raíz. | En `main.ts` |

### CSS / SCSS

| Concepto | Qué es |
|---|---|
| **CSS Custom Property** | Variable CSS nativa: se define con `--nombre: valor;` y se usa con `var(--nombre)`. Puede cambiar en runtime. |
| **SCSS Partial** | Archivo SCSS que empieza con `_` (ej: `_variables.scss`). Se importa con `@use` y no genera un CSS propio. |
| **Mixin** | Bloque de CSS reutilizable que se invoca con `@include nombre`. Similar a una función. |
| **BEM** | Convención de nombres: `.bloque__elemento--modificador`. Evita conflictos entre componentes. |
| **Breakpoint** | Punto de quiebre donde cambia el layout según el ancho de pantalla. |
| **perspective** | Propiedad CSS que crea un espacio 3D para transformaciones (flip cards). |
| **backface-visibility** | Oculta la cara trasera de un elemento rotado en 3D. |
| **color-mix()** | Función CSS que mezcla dos colores (ej: footer más oscuro que el fondo). |
| **will-change** | Hint para que el navegador prepare la GPU para animar una propiedad. |
| **::selection** | Pseudo-elemento que estiliza el texto seleccionado por el usuario. |

### JavaScript / TypeScript

| Concepto | Qué es |
|---|---|
| **Observable** | Flujo de datos de RxJS. Te suscribís con `.subscribe()` para recibir valores. |
| **pipe()** | Método de Observable que encadena operadores (ej: `catchError`, `map`). |
| **Interface** | Define la "forma" de un objeto: qué propiedades tiene y de qué tipo. |
| **Generic** | Tipo parametrizable: `RespuestaApi<T>` donde T puede ser `void`, `string`, etc. |
| **Singleton** | Patrón de diseño: una sola instancia compartida en toda la app. |
| **IntersectionObserver** | API nativa del navegador para detectar cuándo un elemento entra/sale del viewport. |
| **requestAnimationFrame** | Ejecuta código en el próximo frame del navegador (~60fps). Ideal para animaciones. |
| **Arrow function** | Sintaxis corta de función: `(x) => x * 2`. Además, hereda el `this` del contexto donde se definió. |
| **Template literal** | String con interpolación: `` `Hola ${nombre}` ``. Usa backticks. |
| **Optional chaining** | Acceso seguro: `obj?.prop` devuelve `undefined` en vez de un error si `obj` es null. |

### DevOps / Infraestructura

| Concepto | Qué es |
|---|---|
| **Serverless** | Código que se ejecuta bajo demanda, sin un servidor propio corriendo 24/7. |
| **CDN** | Red de servidores distribuidos globalmente que sirven archivos estáticos rápido. |
| **CORS** | Política del navegador que bloquea peticiones entre dominios diferentes. Los headers CORS las habilitan. |
| **SPA** | Single Page Application: una sola página HTML que JavaScript modifica dinámicamente. |
| **Environment variables** | Valores secretos (contraseñas, keys) que se configuran en el servidor, nunca en el código fuente. |
| **CI/CD** | Automatización de build, test y deploy que se ejecuta en cada cambio al código. |
| **CAPTCHA** | Sistema que verifica que un usuario es humano y no un bot automatizado. |
| **App Password** | Contraseña específica para aplicaciones de terceros (Gmail no acepta la contraseña normal si tenés 2FA). |
| **Preflight request** | Petición OPTIONS que el navegador envía antes de un POST cross-origin para verificar que está permitido. |
| **JSON-LD** | Formato de datos estructurados que los buscadores (Google) usan para entender el contenido de una página. |
| **Open Graph** | Protocolo de meta tags que controla cómo se ve un link cuando se comparte en redes sociales. |
