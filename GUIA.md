# GUÍA Completa del Portfolio — Angular 20

Guía pensada para un desarrollador junior que quiere entender cómo funciona cada parte del proyecto, por qué se tomaron ciertas decisiones y cómo arrancar todo desde cero en su máquina.

---

## Tabla de Contenidos

1. [Cómo arrancar el proyecto en local](#1-cómo-arrancar-el-proyecto-en-local)
2. [Visión general de la arquitectura](#2-visión-general-de-la-arquitectura)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Cómo arranca Angular (el flujo de inicio)](#4-cómo-arranca-angular-el-flujo-de-inicio)
5. [AppComponent — el director de orquesta](#5-appcomponent--el-director-de-orquesta)
6. [Sistema de estilos (SCSS + CSS Custom Properties)](#6-sistema-de-estilos-scss--css-custom-properties)
7. [Servicios: lógica compartida](#7-servicios-lógica-compartida)
8. [Directiva de animación al scroll](#8-directiva-de-animación-al-scroll)
9. [Componentes de layout (sidebar, header, drawer)](#9-componentes-de-layout-sidebar-header-drawer)
10. [Las 9 secciones del portfolio](#10-las-9-secciones-del-portfolio)
11. [Backend serverless (API de contacto)](#11-backend-serverless-api-de-contacto)
12. [Deploy en Vercel](#12-deploy-en-vercel)
13. [Glosario de conceptos clave](#13-glosario-de-conceptos-clave)

---

## 1) Cómo arrancar el proyecto en local

### Requisitos previos

| Herramienta | Versión mínima | Para qué se usa |
|---|---|---|
| **Node.js** | 22.x | Motor JavaScript que ejecuta Angular CLI y el build |
| **npm** | 9.x (viene con Node) | Administrador de paquetes (instala dependencias) |
| **Git** | cualquiera | Clonar el repositorio |

> Podés verificar si los tenés instalados con `node -v` y `npm -v` en la terminal.

### Pasos para arrancar

```bash
# 1. Clonar el repositorio
git clone <URL-del-repositorio>
cd portfolio

# 2. Instalar dependencias del frontend
cd frontend
npm install --legacy-peer-deps

# 3. Arrancar el servidor de desarrollo
npm start
```

Después de unos segundos vas a ver algo así:

```
** Angular Live Development Server is listening on localhost:4200 **
```

Abrí tu navegador en **http://localhost:4200** y vas a ver el portfolio.

### ¿Qué hace cada comando?

| Comando | Qué hace |
|---|---|
| `npm install` | Lee `package.json`, descarga todas las dependencias a `node_modules/` |
| `--legacy-peer-deps` | Ignora conflictos de versión entre paquetes (necesario con Angular 20) |
| `npm start` | Ejecuta `ng serve` que compila el código y levanta un servidor local en el puerto 4200 |

### Otros comandos útiles

```bash
npm run build          # Genera la versión de producción en dist/
npm run build:en       # Build en inglés (generado por @angular/localize)
npm run build:all      # Build de ambos idiomas localizados
npm run build:stats    # Build + genera estadísticas del bundle
npm run analyze        # Build + abre source-map-explorer en el browser
npm run extract-i18n   # Extrae strings para i18n a src/locale/
npm run test           # Ejecuta tests unitarios con Karma
```

### ¿Y la API de contacto?

El formulario de contacto envía datos a `/api/contact`. En local, **esa ruta no existe** porque el backend corre en Vercel como función serverless. El formulario va a dar error de red al enviar, y eso es normal. Para probarlo con envío real se puede:

- Hacer deploy a Vercel (ver sección 12).
- O correr `vercel dev` desde la raíz del proyecto con un archivo `.env` con `EMAIL_USER` y `EMAIL_PASS`.

---

## 2) Visión general de la arquitectura

### ¿Qué es este proyecto?

Es un **portfolio personal** hecho con **Angular 20**. Es una **SPA (Single Page Application)**: se carga una sola página HTML y JavaScript se encarga de mostrar/ocultar contenido dinámicamente, sin recargar el navegador.

### Diagrama de alto nivel

```
┌──────────────────────────────────────────────────────────┐
│                     NAVEGADOR                            │
│                                                          │
│  ┌─────────────┐  ┌──────────────────────────────────┐  │
│  │   Sidebar    │  │         Main Content             │  │
│  │  (desktop)   │  │                                  │  │
│  │  ----------  │  │  Hero → Sobre mí → Tech Skills   │  │
│  │  Menú nav    │  │  → Soft Skills → Idiomas         │  │
│  │  Toggle tema │  │  → Experiencia → Educación       │  │
│  │  Scroll bar  │  │  → Portfolio → Contacto          │  │
│  │              │  │  → Footer                        │  │
│  └─────────────┘  └──────────────────────────────────┘  │
│                                                          │
│  Mobile: el sidebar se oculta y aparece un header fijo  │
│  con un botón hamburguesa que abre un drawer lateral.   │
└──────────────────────────────────────────────────────────┘
         │ (formulario de contacto)
         ▼
┌──────────────────────┐
│  Vercel Serverless    │
│  api/index.js         │
│  (envía email con     │
│   Nodemailer + Gmail) │
└──────────────────────┘
```

### Tecnologías principales

| Tecnología | Rol en el proyecto |
|---|---|
| **Angular 20** | Framework frontend (componentes, templates, data binding) |
| **TypeScript** | Lenguaje con tipado estático (detecta errores antes de ejecutar) |
| **SCSS** | Preprocesador CSS (variables, anidamiento, mixins) |
| **CSS Custom Properties** | Variables CSS nativas para el tema claro/oscuro |
| **Lucide Icons** | Librería de íconos SVG cargada desde CDN |
| **Angular Animations** | Animaciones declarativas para transiciones (portfolio cards, scroll button) |
| **Node.js + Nodemailer** | Backend serverless que envía emails desde el formulario |
| **Vercel** | Plataforma de hosting y ejecución de funciones serverless |
| **@angular/localize** | Internacionalización — traducciones es/en vía archivos XLIFF |
| **GitHub Actions** | CI pipeline — build y tests automáticos en cada push/PR a main |

### ¿Por qué Angular y no React o Vue?

Angular incluye todo lo necesario de fábrica: componentes, formularios, HTTP client, animaciones, i18n, testing. No hace falta buscar librerías externas para cada cosa. TypeScript es obligatorio, lo que fuerza un código más robusto. Y la estructura es predecible: cualquier proyecto Angular tiene la misma organización.

---

## 3) Estructura de carpetas

```
portfolio/
├── api/
│   └── index.js                           ← Backend serverless (envío de emails)
├── .github/workflows/ci.yml              ← Pipeline CI con GitHub Actions
├── vercel.json                            ← Configuración de deploy en Vercel
├── package.json                           ← Dependencias del backend (nodemailer, express-validator)
├── GUIA.md                                ← Esta guía técnica para juniors
├── DEPLOY.md                              ← Guía paso a paso de deploy en Vercel
├── README.md                              ← Presentación del proyecto para reclutadores/devs
│
└── frontend/                              ← Todo el código Angular
    ├── angular.json                       ← Configuración del proyecto Angular (build, test, i18n)
    ├── package.json                       ← Dependencias del frontend
    ├── tsconfig.json                      ← Configuración de TypeScript
    │
    └── src/
        ├── index.html                     ← Página HTML base (fuentes, íconos, GA)
        ├── main.ts                        ← Punto de entrada — bootstrap + IntersectionObserver global
        ├── styles.scss                    ← Punto de entrada de estilos (@use theme + base)
        │
        ├── environments/
        │   ├── environment.ts             ← Configuración para desarrollo (apiUrl: '/api')
        │   └── environment.prod.ts        ← Configuración para producción
        │
        ├── locale/
        │   ├── messages.xlf               ← Strings extraídos en español (referencia)
        │   └── messages.en.xlf            ← Traducciones al inglés
        │
        ├── styles/
        │   ├── _variables.scss            ← Variables SCSS (fuentes, radios, breakpoints, z-index)
        │   ├── _mixins.scss               ← Mixins reutilizables (responsive, card-base, glow)
        │   ├── _theme.scss                ← CSS Custom Properties para modo claro y oscuro
        │   └── _base.scss                 ← Reset, scrollbar, animaciones, .animate-on-scroll
        │
        ├── assets/
        │   ├── img/                       ← Imágenes (.webp) de tecnologías, proyectos y perfil
        │   ├── doc/                       ← CV en PDF (CV_ToledoMarcos_IT.pdf)
        │   └── data/                      ← proyectos.json (datos parametrizables del portfolio)
        │
        └── app/
            ├── app.component.ts|html|scss ← Componente raíz — layout + lógica de scroll
            │
            ├── servicios/
            │   └── tema.service.ts        ← Servicio de tema (signal + localStorage + .dark en <html>)
            │
            ├── core/
            │   ├── directivas/
            │   │   └── animate-on-scroll.directive.ts   ← Directiva fade-up con IntersectionObserver
            │   └── services/
            │       ├── api.service.ts     ← HttpClient para POST /api/contact
            │       └── api.service.spec.ts← Tests del ApiService
            │
            └── componentes/
                ├── barra-lateral/         ← Sidebar desktop (nav, avatar, toggle tema, progreso)
                ├── encabezado-movil/      ← Header mobile + drawer (hamburguesa/X + overlay)
                ├── boton-scroll-arriba/   ← Botón flotante "volver arriba" con fadeScale
                ├── seccion-hero/          ← Hero: typewriter, contadores, badges, socials
                └── secciones/
                    ├── seccion-sobre-mi/
                    ├── seccion-habilidades-tecnicas/  ← 18 tarjetas con flip 3D
                    ├── seccion-habilidades-blandas/
                    ├── seccion-idiomas/
                    ├── seccion-experiencia/
                    ├── seccion-educacion/
                    ├── seccion-portfolio/  ← 9 proyectos con filtros y tilt 3D
                    └── seccion-contacto/  ← Formulario + ApiService + links
```

### Convención de nombres

Todos los archivos de componentes usan nombres **en español** y siguen la convención de Angular:

```
nombre-del-componente/
├── nombre-del-componente.component.ts      ← Lógica (clase TypeScript)
├── nombre-del-componente.component.html    ← Template (HTML)
└── nombre-del-componente.component.scss    ← Estilos (SCSS)
```

Cada componente tiene **3 archivos** que trabajan juntos: el `.ts` maneja datos y lógica, el `.html` define qué se ve en pantalla, y el `.scss` le da estilo visual.

---

## 4) Cómo arranca Angular (el flujo de inicio)

### Paso a paso

```
1. Navegador carga index.html
   ├── Carga fuentes (Inter, Fira Code) desde Google Fonts
   ├── Carga Lucide Icons desde CDN (defer — no bloquea el render)
   └── Encuentra <app-root></app-root> en el <body>

2. Angular ejecuta main.ts
   ├── bootstrapApplication(AppComponent, { providers: [...] })
   │   ├── provideAnimations()  → habilita @angular/animations globalmente
   │   └── provideHttpClient()  → habilita HttpClient para ApiService
   └── .then() → IntersectionObserver global para .section-in-view
       (pausa animaciones CSS en secciones fuera del viewport → ahorro GPU)

3. Angular crea AppComponent y lo inserta en <app-root>
   ├── Importa los 15 componentes standalone directamente
   ├── Renderiza sidebar + header mobile + main con las 9 secciones + footer
   └── Registra el listener de scroll fuera de NgZone
```

### ¿Qué es "standalone"?

En Angular hay dos formas de organizar componentes:

- **NgModule (forma clásica):** agrupás componentes en módulos con `@NgModule`. Más burocrático.
- **Standalone (forma moderna):** cada componente declara sus propias dependencias en `imports: [...]`. Más simple y directo.

Este proyecto usa **standalone** para todo. Cada componente se importa directamente donde se necesita, sin módulos intermedios.

```typescript
@Component({
  standalone: true,                    // ← Este componente es independiente
  imports: [CommonModule, FormsModule], // ← Declara lo que necesita
  templateUrl: './mi.component.html',
})
export class MiComponent { }
```

### main.ts explicado

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

// bootstrapApplication: arranca la app con un componente standalone como raíz.
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),   // Habilita @angular/animations (trigger, transition, etc.)
    provideHttpClient(),   // Habilita HttpClient para hacer peticiones HTTP (GET, POST)
  ],
}).then(() => {
  // IntersectionObserver global: agrega/quita clase "section-in-view" en cada <section id="...">.
  // Esto permite que _base.scss pause animaciones CSS en secciones fuera del viewport.
  // rootMargin '20%' activa la clase un poco antes de que la sección entre al viewport.
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        e.target.classList.toggle('section-in-view', e.isIntersecting);
      }
    },
    { rootMargin: '20% 0px' }
  );
  document.querySelectorAll('section[id]').forEach(s => io.observe(s));
}).catch(err => console.error(err));
```

---

## 5) AppComponent — el director de orquesta

`AppComponent` es el componente raíz. Controla el **layout** (cómo se distribuyen sidebar, header y contenido) y toda la **lógica de scroll** (qué sección está activa, la barra de progreso, el botón "volver arriba").

### Imports del componente (15 en total)

AppComponent importa directamente todos los componentes standalone que necesita:
- `CommonModule`, `HttpClientModule`, `FormsModule` (módulos base de Angular)
- `BarraLateralComponent`, `EncabezadoMovilComponent`, `BotonScrollArribaComponent` (layout)
- `SeccionHeroComponent` + las 8 secciones de contenido (Sobre mí, Tech Skills, Soft Skills, Idiomas, Experiencia, Educación, Portfolio, Contacto)

### Layout (app.component.html)

```html
<div class="layout">
  <!-- Sidebar solo visible en desktop (lg = 1024px+) -->
  <div class="layout__sidebar">
    <app-barra-lateral
      [activeSection]="activeSection"
      [scrollProgress]="scrollProgress"
      (navClick)="handleNavClick($event)"
    ></app-barra-lateral>
  </div>

  <!-- Header solo visible en mobile (<1024px) -->
  <div class="layout__mobile-header">
    <app-encabezado-movil
      [activeSection]="activeSection"
      [isDrawerOpen]="isDrawerOpen"
      (navClick)="handleNavClick($event)"
      (toggleDrawer)="toggleDrawer()"
    ></app-encabezado-movil>
  </div>

  <!-- Contenido principal scrollable -->
  <main class="layout__main" #mainContent>
    <app-seccion-hero></app-seccion-hero>
    <app-seccion-sobre-mi></app-seccion-sobre-mi>
    <!-- ... las otras 6 secciones ... -->
    <app-seccion-contacto></app-seccion-contacto>
    <footer class="footer"><!-- socials + copyright --></footer>
  </main>
</div>

<!-- Botón flotante para volver arriba -->
<app-boton-scroll-arriba
  [visible]="showScrollTop"
  (clicked)="scrollToTop()"
></app-boton-scroll-arriba>
```

**Conceptos clave aquí:**

- `[propiedad]="valor"` → **Property binding**: pasa datos del padre al hijo (input).
- `(evento)="handler($event)"` → **Event binding**: el hijo emite un evento y el padre lo captura.
- `#mainContent` → **Template reference variable**: le da un nombre al elemento DOM para accederlo desde el TypeScript con `@ViewChild`.

### Lógica de scroll (app.component.ts)

El scroll hace 3 cosas a la vez:

#### 1. Barra de progreso

```typescript
const maxScroll = scrollHeight - clientHeight || 1;
const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
// progress = número entre 0 y 1
// 0 = arriba del todo, 1 = abajo del todo
// Se pasa al sidebar para pintar la barra de progreso vertical
```

#### 2. Detección de sección activa

```typescript
// Recorre todas las secciones y busca cuál está en el 30% superior del viewport
const offset = clientHeight * 0.3;
for (const id of this.sectionIds) {
  const section = document.getElementById(id);
  if (section) {
    const relativeTop = section.getBoundingClientRect().top - mainRect.top;
    if (relativeTop <= offset && relativeTop + section.offsetHeight > 0) {
      currentSection = id;
    }
  }
}
```

Si el usuario scrolleó hasta el final (a menos de 60px del fondo), se activa automáticamente la última sección (`contacto`).

#### 3. Botón "volver arriba"

```typescript
const showTop = scrollTop > 400; // Aparece cuando scrolleaste más de 400px
```

#### Bloqueo durante navegación

Cuando el usuario hace clic en la navegación del sidebar, el scroll es programático (automático). Durante esos 800ms, se bloquea la detección de sección para evitar que "salte" mientras se desliza:

```typescript
handleNavClick(sectionId: string): void {
  this.isScrolling = true;        // Bloquea la detección
  this.activeSection = sectionId;  // Marca la sección como activa inmediatamente
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });

  setTimeout(() => {
    this.isScrolling = false;     // Desbloquea después de 800ms
  }, 800);
}
```

#### Optimización con NgZone y requestAnimationFrame

El handler de scroll corre **fuera de NgZone** para no disparar change detection en cada pixel de scroll (sería lento). Solo se notifica a Angular cuando los valores realmente cambiaron:

```typescript
ngOnInit(): void {
  // runOutsideAngular: ejecuta código sin que Angular lo vigile
  this.ngZone.runOutsideAngular(() => {
    this.mainRef.nativeElement.addEventListener('scroll', this.onScroll, { passive: true });
  });
}

// Dentro del handler, solo cuando cambió algo:
this.ngZone.run(() => {
  // Esto SÍ dispara change detection (actualiza la vista)
  this.scrollProgress = progress;
  this.showScrollTop = showTop;
  this.activeSection = currentSection;
});
```

Además se usa **requestAnimationFrame** con un flag `ticking` para limitar las actualizaciones a 1 por frame (60fps máximo), evitando cálculos innecesarios si el navegador dispara muchos eventos scroll seguidos.

### Footer

El footer está dentro del `<main>` después de todas las secciones. Tiene:

- 3 botones sociales (GitHub, LinkedIn, Email) como cajas de 36×36px con íconos de 16px
- Texto de copyright: "© 2025 Marcos Toledo. Todos los derechos reservados."
- Texto secundario: "Hecho con ❤ en Buenos Aires" (opacity 0.5)
- Fondo con `color-mix()`: mezcla el background con 8% de negro

---

## 6) Sistema de estilos (SCSS + CSS Custom Properties)

### La arquitectura de estilos

```
styles.scss              ← Punto de entrada (solo @use imports)
  @use 'styles/theme'    ← CSS Custom Properties (:root y .dark)
  @use 'styles/base'     ← Reset, scrollbar, animaciones, utilidades

Cada componente tiene su propio .scss que importa:
  @use '../../../../styles/variables' as *;  ← Variables SCSS ($font-ui, $radius-xl, etc.)
  @use '../../../../styles/mixins' as *;     ← Mixins (@include lg, @include card-base, etc.)
```

El orden en `styles.scss` importa: **theme debe ir antes que base** porque `_base.scss` consume las CSS custom properties (`--portfolio-*`) que `_theme.scss` define.

### _theme.scss — El sistema de colores

Define **CSS Custom Properties** (variables nativas del navegador) para dos temas. `TemaService` gestiona la clase `.dark` en `<html>` — cuando la agrega, todas las variables cambian automáticamente:

```scss
:root {
  // Modo claro (por defecto)
  --background: #eef3f9;
  --foreground: #0f172a;
  --portfolio-accent: #4f46e5;       // Azul indigo
  --portfolio-accent-glow: rgba(79, 70, 229, 0.14);
  --portfolio-card-bg: #ffffff;
  --portfolio-card-border: rgba(15, 23, 42, 0.09);
  --portfolio-section-alt: #e8eff8;  // Fondo alterno para secciones pares
  // ... muchas más
}

.dark {
  // Modo oscuro (se activa con class="dark" en <html>)
  --background: #0c1222;
  --foreground: #e2e8f0;
  --portfolio-accent: #22d3ee;       // Cyan
  --portfolio-accent-glow: rgba(34, 211, 238, 0.12);
  --portfolio-card-bg: #151f35;
  --portfolio-card-border: rgba(255, 255, 255, 0.06);
  --portfolio-section-alt: #111a2e;
  // ... las mismas propiedades con valores oscuros
}
```

**¿Cómo funciona el cambio de tema?** Cuando `TemaService` agrega `class="dark"` al `<html>`, todas las variables CSS cambian automáticamente. No hay que tocar ningún componente: cada uno ya usa `var(--background)`, `var(--portfolio-accent)`, etc.

### _variables.scss — Variables SCSS estáticas

```scss
$font-ui: 'Inter', sans-serif;      // Fuente principal
$font-code: 'Fira Code', monospace; // Fuente para código/tecnologías

$sidebar-width: 280px;              // Ancho del sidebar
$mobile-header-height: 56px;        // Alto del header mobile

// Border radius (bordes redondeados)
$radius-sm: 0.375rem;   // 6px — bordes sutiles
$radius-md: 0.5rem;     // 8px
$radius-lg: 0.625rem;   // 10px
$radius-xl: 0.75rem;    // 12px — tarjetas
$radius-2xl: 1rem;      // 16px
$radius-full: 9999px;   // Completamente redondo (chips, badges, botón scroll)

// Breakpoints (puntos de quiebre para responsive)
$bp-sm: 640px;    // @include sm { }  → pantallas chicas
$bp-md: 768px;    // @include md { }  → tablets
$bp-lg: 1024px;   // @include lg { }  → desktop (acá aparece el sidebar)
$bp-xl: 1280px;   // @include xl { }  → pantallas grandes

// Z-index layers (capas de superposición)
$z-sidebar: 30;   // sidebar siempre arriba del contenido
$z-header: 40;    // header mobile encima del sidebar
$z-overlay: 45;   // overlay del drawer encima de todo
$z-drawer: 50;    // drawer encima del overlay
```

### _mixins.scss — Código reutilizable

```scss
// Responsive: se usan así → @include lg { display: flex; }
@mixin sm { @media (min-width: $bp-sm) { @content; } }
@mixin md { @media (min-width: $bp-md) { @content; } }
@mixin lg { @media (min-width: $bp-lg) { @content; } }

// Card base: estilo común para todas las tarjetas
@mixin card-base {
  background-color: var(--portfolio-card-bg);
  border: 1px solid var(--portfolio-card-border);
  border-radius: $radius-xl;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

// Padding estándar de sección
@mixin section-padding {
  padding: 5rem 1.5rem;
  @include md { padding: 5rem 2.5rem; }
  @include lg { padding: 5rem 4rem; }
}

// Borde con glow de acento al hacer hover
@mixin accent-glow {
  border: 1px solid var(--portfolio-accent);
  box-shadow: 0 0 16px var(--portfolio-accent-glow);
}

// Grilla de puntos decorativos (fondo de secciones)
@mixin dot-grid { ... }

// Solo mobile: oculta en desktop
@mixin mobile-only { @include lg { display: none; } }
```

### _base.scss — Estilos globales

Incluye:
- **Reset CSS**: `*, *::before, *::after { box-sizing: border-box; }`, margin/padding a 0
- **Tipografía**: font-family Inter, `text-rendering: optimizeLegibility`, font-smoothing antialiased
- **Scrollbar personalizada**: 5px de ancho, color accent, visible solo en el `<main>`
- **Selección de texto**: fondo violeta semitransparente
- **`.animate-on-scroll`**: la clase base para la directiva — `opacity: 0; transform: translateY(25px)` → transiciona a visible con `.visible`
- **Stagger delays**: `.animate-on-scroll:nth-child(n)` con delay incremental (`i * 0.06s`) para efecto cascada
- **`.section-in-view`**: optimización de `will-change` y `contain` — solo se aplica a secciones visibles (controlado por el IntersectionObserver de `main.ts`)
- **`prefers-reduced-motion`**: desactiva todas las animaciones para usuarios con accesibilidad de movimiento reducido

### BEM — Cómo se nombran las clases CSS

Todos los componentes usan la convención **BEM (Block Element Modifier)**:

```scss
.contact {                        // Block: el componente
  &__header { }                   // Element: parte del componente
  &__header-icon { }              // Element con sub-nombre
  &__input { }                    // Element
  &__input--error { }             // Modifier: variante del element
  &__input--focused { }
}
```

Esto genera clases como `.contact__header-icon` y `.contact__input--error`. La ventaja es que nunca hay conflictos entre componentes: cada clase es única y descriptiva.

---

## 7) Servicios: lógica compartida

### TemaService — Modo claro/oscuro

**Ubicación:** `servicios/tema.service.ts`

```typescript
@Injectable({ providedIn: 'root' }) // Singleton global
export class TemaService {
  // Signal: variable reactiva de Angular (como un BehaviorSubject más simple)
  theme = signal<Theme>(this.getInitialTheme());

  toggleTheme(): void {
    const next = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);           // Actualiza el signal
    localStorage.setItem(STORAGE_KEY, next);  // Persiste la preferencia
    this.applyTheme(next);          // Agrega/quita .dark en <html>
  }

  private getInitialTheme(): Theme {
    // Lee de localStorage, si no hay default 'dark'
    return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'dark';
  }

  private applyTheme(t: Theme): void {
    document.documentElement.classList.toggle('dark', t === 'dark');
  }
}
```

**¿Qué es un Signal?** Es una variable reactiva de Angular 16+. Cuando su valor cambia, Angular sabe que tiene que re-renderizar los componentes que lo usan. Se lee con `theme()` (con paréntesis) y se escribe con `theme.set(valor)`.

**¿Qué es `providedIn: 'root'`?** Significa que Angular crea **una sola instancia** del servicio para toda la aplicación (patrón *singleton*). Cualquier componente que inyecte `TemaService` recibe la misma instancia.

### ApiService — Comunicación con el backend

**Ubicación:** `core/services/api.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private urlApi = environment.apiUrl;  // '/api' tanto en dev como en prod

  // Interfaces tipadas
  // DatosContacto: { name, email, message }
  // RespuestaApi<T>: { success, message, data?, errors? }

  sendContactMessage(datos: DatosContacto): Observable<RespuestaApi<void>> {
    return this.http.post<RespuestaApi<void>>(`${this.urlApi}/contact`, datos)
      .pipe(catchError(this.manejarError));
  }

  private manejarError(error: HttpErrorResponse): Observable<never> {
    // Distingue entre error de red (cliente) y error del servidor
    // Devuelve un Observable con throwError para que el componente lo maneje en subscribe.error
  }
}
```

**¿Qué es un Observable?** Es un "flujo de datos" de RxJS. Es como una promesa, pero más potente: puede emitir múltiples valores y se puede cancelar. El componente se "suscribe" para recibir la respuesta:

```typescript
this.apiService.sendContactMessage(datos).subscribe({
  next: (respuesta) => { /* éxito: muestro toast verde */ },
  error: (err) => { /* error: muestro mensaje de error */ },
});
```

---

## 8) Directiva de animación al scroll

**Ubicación:** `core/directivas/animate-on-scroll.directive.ts`

La directiva `AnimateOnScrollDirective` hace que los elementos aparezcan con una animación **fade-up** cuando el usuario scrollea hasta ellos.

### ¿Cómo funciona?

```
1. Se agrega appAnimateOnScroll a cualquier elemento HTML
2. La directiva le pone la clase "animate-on-scroll" (opacity: 0, translateY: 25px)
3. Usa IntersectionObserver para detectar cuándo el elemento entra al viewport
4. Cuando entra: agrega clase "visible" (opacity: 1, translateY: 0) → transición suave
5. Llama unobserve() — la animación solo pasa una vez
6. En ngOnDestroy llama disconnect() para evitar memory leaks
```

El observer corre fuera de NgZone (`runOutsideAngular`) para no disparar change detection en cada entrada/salida del viewport.

### Uso en un template

```html
<!-- Animación básica -->
<div appAnimateOnScroll>
  Contenido que aparece al scrollear
</div>

<!-- Con delay personalizado (para efecto de cascada) -->
<div appAnimateOnScroll [animateDelay]="0.1">Card 1</div>
<div appAnimateOnScroll [animateDelay]="0.2">Card 2</div>
<div appAnimateOnScroll [animateDelay]="0.3">Card 3</div>
```

### El CSS que lo hace funcionar (en _base.scss)

```scss
.animate-on-scroll {
  opacity: 0;
  transform: translateY(25px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### ¿Qué es IntersectionObserver?

Es una API nativa del navegador que detecta cuándo un elemento entra o sale del viewport (la parte visible de la pantalla). Es mucho más eficiente que escuchar el evento `scroll` y calcular posiciones manualmente.

---

## 9) Componentes de layout (sidebar, header, drawer)

### BarraLateralComponent (sidebar desktop)

Visible solo en pantallas **≥ 1024px** (`@include lg`). Contiene:

- **Avatar**: foto de perfil (Foto_Perfil.webp)
- **Identidad**: nombre y subtítulo
- **Navegación**: **8 ítems** (uno por sección). El ítem activo se resalta con color accent. Los ítems se exportan como constante `NAV_ITEMS` (reutilizada en header mobile y AppComponent):

```typescript
export const NAV_ITEMS: NavItem[] = [
  { id: 'sobre-mi',             label: 'Sobre mí',              icon: 'user' },
  { id: 'habilidades-tecnicas', label: 'Habilidades técnicas',  icon: 'code-2' },
  { id: 'habilidades-blandas',  label: 'Habilidades blandas',   icon: 'heart' },
  { id: 'idiomas',              label: 'Idiomas',               icon: 'languages' },
  { id: 'experiencia',          label: 'Experiencia',           icon: 'briefcase' },
  { id: 'educacion',            label: 'Educación',             icon: 'graduation-cap' },
  { id: 'portfolio',            label: 'Portfolio',             icon: 'folder-open' },
  { id: 'contacto',             label: 'Contacto',              icon: 'mail' },
];
```

- **Barra de progreso de scroll**: línea vertical que crece según `scrollProgress` (0 a 1)
- **Toggle de tema**: botón con íconos sol/luna que llama a `TemaService.toggleTheme()`
- **Blobs animados**: formas decorativas con `@keyframes` en el fondo

### EncabezadoMovilComponent (mobile header + drawer)

Visible solo en pantallas **< 1024px**. Contiene:

- **Header fijo** (56px de alto): logo "MT" + botón hamburguesa/X
- **Overlay** (fondo oscuro con blur) que aparece cuando el drawer está abierto
- **Drawer** (panel lateral de 280px desde la derecha): contiene una instancia de `<app-barra-lateral>` dentro, con los mismos íconos y navegación que el sidebar desktop
- Al hacer clic en un ítem de navegación, cierra el drawer automáticamente
- El botón logo "MT" también funciona como "volver arriba" (con timer de 1500ms)

### BotonScrollArribaComponent

Botón circular flotante (esquina inferior derecha) que aparece con una animación de fade+scale cuando `scrollTop > 400px`. Usa **Angular Animations**:

```typescript
animations: [
  trigger('fadeScale', [
    transition(':enter', [
      style({ opacity: 0, transform: 'scale(0.5)' }),
      animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
    ]),
    transition(':leave', [
      animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.5)' })),
    ]),
  ]),
]
```

---

## 10) Las 9 secciones del portfolio

Cada sección sigue el mismo patrón:

```
┌─────────────────────────────────────────┐
│  Background (dots + blob decorativo)     │
│  ┌───────────────────────────────────┐  │
│  │  Header: ícono + título + línea   │  │
│  │  Contenido específico             │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

Todas usan `ChangeDetectionStrategy.OnPush` e `AnimateOnScrollDirective` para las animaciones de entrada.

### 1. Hero Section

- **Typewriter**: efecto máquina de escribir que rota entre 4 frases con velocidades distintas de escritura (60ms) y borrado (30ms)
- **Contadores animados**: números que crecen desde 0 con easing cubic-out durante 1600ms (8+ Proyectos, 15+ Tecnologías, 4+ Años Exp.)
- **Badge**: "Disponible para proyectos" con dot verde con animación ping
- **Botones sociales**: GitHub, LinkedIn, Email, Descargar CV
- **Fondo**: gradiente + 3 blobs animados + dot grid + 6 formas geométricas flotantes
- **Scroll indicator**: texto "SCROLL" + ícono chevron-down abajo del todo
- El hero mide `min-height: 100vh` (ocupa toda la pantalla)

### 2. Sobre Mí

Layout tipo **bento grid** (grilla asimétrica) con 5 cards:
- **Bio** (card grande): texto de presentación con link a AEROTEST en color accent
- **Ubicación**: Buenos Aires, Argentina con ícono map-pin
- **Objetivo**: "Full Stack orientado a calidad y automatización"
- **Aprendiendo**: chips morados (React avanzado, Java, Testing, CI/CD)
- **Stack Actual**: chips con color accent (JavaScript, TypeScript, Angular, React, etc.)

### 3. Habilidades Técnicas (Flip 3D)

Grid de **18 tarjetas** con efecto **flip 3D** al hacer clic:

- **Frente**: ícono SVG (imagen .webp o SVG inline sanitizado con `DomSanitizer`) + nombre de la tecnología
- **Reverso**: badge de estado (experiencia práctica / en formación) + descripción + estrellas de nivel (1–5)
- **8 con tag "active"** (experiencia práctica) y **10 con tag "learning"** (en formación)
- **Solo una tarjeta se voltea a la vez** (diseño "accordion" — hacer clic en una cierra la anterior)
- **En mobile** (< 640px): la tarjeta vuelve sola después de 3 segundos (auto-flip)

```scss
.flip-card {
  perspective: 800px;  // Crea el espacio 3D
}
.flip-card__inner {
  transform-style: preserve-3d;  // Los hijos viven en 3D
  transition: transform 0.5s ease;
}
.flip-card--flipped .flip-card__inner {
  transform: rotateY(180deg);  // Voltea la tarjeta
}
.flip-card__front, .flip-card__back {
  backface-visibility: hidden;  // Oculta la cara trasera cuando no mira al usuario
}
.flip-card__back {
  transform: rotateY(180deg);  // La cara trasera empieza volteada
}
```

### 4. Habilidades Blandas

Cards con íconos Lucide que muestran cada soft skill con una descripción corta. Diseño en grid responsive (1 columna mobile → 2 columnas md → 3 columnas lg).

### 5. Idiomas

Cards para cada idioma con nivel (nativo/intermedio/básico), barra de progreso visual con porcentaje y badge de nivel.

### 6. Experiencia

Card de experiencia laboral en AEROTEST con:
- Roles desempeñados como chips
- Métricas de impacto clave
- Responsabilidades con bullet points
- Tecnologías usadas en chips con fuente Fira Code

### 7. Educación

Cards para cada formación con:
- Línea lateral degradada en color propio (azul/verde)
- Ícono en caja de 48×48px
- Carrera, institución, descripción
- Badge de estado (En curso / Completado)
- Promedio en número grande con fuente Fira Code
- Nota motivacional con ícono sparkles

### 8. Portfolio (Tilt 3D + filtros animados)

Grid de **9 proyectos** con:
- **3 filtros** (Todos / En desarrollo / Finalizado) con contadores animados
- **4 proyectos destacados** (featured) con badge ámbar en la esquina superior izquierda
- **Efecto tilt 3D** al mover el mouse sobre una card (calcula ángulo según posición del cursor)
- **Animación enter/leave** al cambiar de filtro con Angular Animations (stagger de entrada)
- **Badges de estado** con colores por tipo (amber para featured, emerald para completado, violet para en desarrollo)
- **Chips de tecnología** en Fira Code
- **Botones de acción**: Demo (primario) y Código (secundario) — links a sitio y GitHub

### 9. Contacto

Layout 2 columnas (3/5 + 2/5 en desktop, 1 columna en mobile):

**Columna izquierda — Formulario:**
- Header strip con ícono MessageCircle + "Enviar mensaje"
- Name + Email en fila de 2 columnas (en sm+)
- Textarea de 8 filas para el mensaje
- Validación por campo con mensajes de error en rojo (nombre min 2 chars, email formato válido, mensaje min 10 chars)
- Botón submit full-width con ícono Send
- Estado de éxito: círculo verde con CheckCircle + "¡Mensaje enviado!"
- Usa **template-driven forms** con `[(ngModel)]` y validación manual

**Columna derecha — Info:**
- Card "Conectemos" con ícono Sparkles y badge "Disponible para trabajar" con dot ping
- 4 links de contacto (GitHub, LinkedIn, Email, CV) con hover color dinámico

**La lógica de envío usa `ApiService.sendContactMessage()`**, que hace POST a `/api/contact`.

---

## 11) Backend serverless (API de contacto)

### ¿Qué es una función serverless?

Una función serverless es código que se ejecuta **solo cuando alguien lo llama**. No hay un servidor corriendo 24/7. Vercel se encarga de:

1. Recibir la petición HTTP
2. Ejecutar tu función
3. Devolver la respuesta
4. Apagar todo

### api/index.js — Cómo funciona

```
POST /api/contact
  │
  ├── 1. Configura headers CORS (permite peticiones cross-origin)
  ├── 2. Si es OPTIONS → responde 200 (preflight del navegador)
  ├── 3. Si no es POST → responde 405 (método no permitido)
  ├── 4. Valida campos con express-validator:
  │      - name: requerido, 2–100 chars
  │      - email: requerido, formato válido, normalizado
  │      - message: requerido, 10–1000 chars
  ├── 5. Si hay errores de validación → 400 + array de mensajes
  ├── 6. Arma el email HTML con estilos inline (template literal)
  ├── 7. Envía con Nodemailer (Gmail SMTP)
  │      ├── from: "Portfolio Contacto" <EMAIL_USER>
  │      ├── to: marcostoledo96@gmail.com
  │      ├── subject: "📬 Nuevo mensaje de contacto de {name}"
  │      └── replyTo: email del remitente
  ├── Éxito → 200 + { success: true }
  └── Error → 500 + { success: false }
```

### Dependencias del backend (package.json raíz)

```json
{
  "type": "module",
  "dependencies": {
    "nodemailer": "^6.9.7",
    "express-validator": "^7.0.1"
  },
  "engines": { "node": "22.x" }
}
```

### Variables de entorno necesarias

En el dashboard de Vercel > Settings > Environment Variables:

| Variable | Valor |
|---|---|
| `EMAIL_USER` | Tu dirección de Gmail |
| `EMAIL_PASS` | App Password de Gmail (no tu contraseña normal) |

> Para crear un App Password: Google Account > Seguridad > Verificación en 2 pasos > Contraseñas de aplicación.

---

## 12) Deploy en Vercel

### Configuración (vercel.json)

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

- `--legacy-peer-deps`: necesario por conflictos de peer dependencies en Angular 20.
- `framework: null`: desactiva la detección automática de Vercel para que use los comandos exactos.
- Primer rewrite: dirige peticiones a `/api/*` a la función serverless `api/index.js`.
- Segundo rewrite: cualquier otra ruta sirve `index.html` (necesario para que la SPA funcione con refresh o navegación directa).

### Proceso de deploy

1. Conectás tu repositorio de GitHub a Vercel
2. Vercel ejecuta `installCommand` → instala dependencias del frontend
3. Vercel ejecuta `buildCommand` → genera los archivos estáticos en `dist/`
4. Vercel sirve los archivos desde `outputDirectory`
5. Las peticiones a `/api/*` ejecutan la función serverless
6. Cada push a `main` hace redeploy automático

### CI/CD con GitHub Actions

Cada push y PR a `main` ejecuta el workflow `.github/workflows/ci.yml`:

1. Checkout del repositorio
2. Setup Node.js (matrix: 18.x y 20.x)
3. `npm ci` en `frontend/`
4. Lint (si está configurado)
5. Build de producción
6. Tests unitarios con Chrome Headless + cobertura
7. Sube reporte de cobertura como artefacto (retención: 7 días)

> Para más detalle sobre el deploy, incluyendo troubleshooting y checklist, ver `DEPLOY.md`.

---

## 13) Glosario de conceptos clave

### Angular

| Concepto | Qué es | Ejemplo en el proyecto |
|---|---|---|
| **Component** | Pieza de UI con su propia lógica, template y estilos | `SeccionContactoComponent` |
| **Template** | HTML del componente con sintaxis Angular | `seccion-contacto.component.html` |
| **Directive** | Comportamiento que se agrega a un elemento HTML | `appAnimateOnScroll` |
| **Service** | Clase con lógica compartida entre componentes | `TemaService`, `ApiService` |
| **Signal** | Variable reactiva (Angular 16+) | `theme = signal<Theme>('dark')` |
| **@Input()** | Dato que el padre le pasa al hijo | `[activeSection]="activeSection"` |
| **@Output()** | Evento que el hijo emite al padre | `(navClick)="handleNavClick($event)"` |
| **@ViewChild** | Referencia a un elemento del template desde el TS | `@ViewChild('mainContent')` |
| **Standalone** | Componente que declara sus propias dependencias sin módulos | `standalone: true` |
| **Change Detection** | Mecanismo de Angular para actualizar la vista cuando cambian los datos | NgZone.run() lo dispara manualmente |
| **OnPush** | Estrategia optimizada — solo re-renderiza si cambia un @Input o se llama markForCheck | `ChangeDetectionStrategy.OnPush` |

### CSS / SCSS

| Concepto | Qué es |
|---|---|
| **CSS Custom Property** | Variable CSS nativa: `--nombre: valor;` / `var(--nombre)` |
| **SCSS Partial** | Archivo que empieza con `_` y se importa con `@use` |
| **Mixin** | Bloque de CSS reutilizable que se invoca con `@include` |
| **BEM** | Convención de nombres: `.block__element--modifier` |
| **Breakpoint** | Punto de quiebre donde cambia el layout (sm, md, lg, xl) |
| **perspective** | Propiedad CSS que crea un espacio 3D para transformaciones |
| **backface-visibility** | Oculta la cara trasera de un elemento rotado en 3D |
| **color-mix()** | Función CSS que mezcla dos colores |
| **will-change** | Hint para que el browser prepare la GPU para animar una propiedad |

### JavaScript / TypeScript

| Concepto | Qué es |
|---|---|
| **Observable** | Flujo de datos de RxJS al que te suscribís con `.subscribe()` |
| **pipe()** | Encadena operadores de RxJS (catchError, map, etc.) |
| **Interface** | Define la forma de un objeto (qué propiedades tiene y de qué tipo) |
| **Generic** | Tipo parametrizable: `RespuestaApi<T>` donde T puede ser cualquier tipo |
| **Singleton** | Una sola instancia compartida en toda la app |
| **IntersectionObserver** | API del navegador para detectar cuándo un elemento entra al viewport |
| **requestAnimationFrame** | Método del navegador que ejecuta código en el próximo frame (60fps) |
| **Arrow function** | Sintaxis corta de función: `(x) => x * 2` |
| **Template literal** | String con interpolación: `` `Hola ${nombre}` `` |
| **Optional chaining** | Acceso seguro a propiedades: `obj?.prop` (no rompe si `obj` es null) |
| **DomSanitizer** | Servicio Angular para marcar HTML/SVG como seguro e inyectarlo en el DOM |

### DevOps

| Concepto | Qué es |
|---|---|
| **Serverless** | Código que se ejecuta bajo demanda, sin servidor propio |
| **CDN** | Red de servidores distribuidos que sirven archivos rápido |
| **CORS** | Política del navegador que bloquea peticiones entre dominios diferentes |
| **SPA** | Single Page Application: una sola página que cambia dinámicamente |
| **Environment variables** | Valores secretos que se configuran en el server, no en el código |
| **CI/CD** | Integración continua / despliegue continuo — automatización de build, test y deploy |
| **GitHub Actions** | Servicio de automatización de GitHub para CI/CD pipelines |
| **App Password** | Contraseña específica para apps de terceros (Gmail no acepta la password normal) |
