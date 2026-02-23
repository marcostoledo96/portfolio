# Portfolio Personal — Marcos Ezequiel Toledo

Portfolio personal desarrollado con **Angular 20** como Single Page Application. Incluye 9 secciones de contenido, tema claro/oscuro, animaciones de scroll, internacionalización es/en y un formulario de contacto funcional con backend serverless.

<!-- Descomentar cuando esté el dominio de produccion:
[![Deploy](https://img.shields.io/badge/Vercel-deployed-brightgreen)](https://tu-dominio.vercel.app)
-->
[![CI](https://github.com/marcostoledo96/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/marcostoledo96/portfolio/actions)

---

## Qué incluye

| Funcionalidad | Descripción |
|---|---|
| **Sidebar + Drawer mobile** | Navegación fija en desktop (≥1024px) y drawer deslizable en mobile |
| **Tema claro/oscuro** | Persiste en localStorage, CSS Custom Properties para cambio instantáneo |
| **Hero animado** | Texto tipo typewriter, contadores animados, botones sociales |
| **18 habilidades técnicas** | Tarjetas con efecto flip 3D (8 activas, 10 en formación) |
| **9 proyectos** | Filtros por estado, efecto tilt 3D, badges de proyecto destacado |
| **Formulario de contacto** | Validación por campo, envío real vía función serverless + Gmail |
| **Scroll reveal** | Animaciones fade-up con IntersectionObserver y stagger timing |
| **i18n** | Español (por defecto) e inglés con @angular/localize |
| **Responsive** | Mobile-first, breakpoints en 640px, 768px, 1024px y 1280px |
| **Performance** | OnPush en todos los componentes, scroll handler fuera de NgZone |

---

## Stack

| Categoría | Tecnología |
|---|---|
| **Frontend** | Angular 20, TypeScript, SCSS |
| **UI** | CSS Custom Properties, Angular Animations, Lucide Icons (CDN) |
| **Tipografías** | Inter (UI), Fira Code (código/tecnologías) |
| **Estado** | Angular Signals para tema, template-driven forms para contacto |
| **Backend** | Node.js + Nodemailer + express-validator (serverless en Vercel) |
| **i18n** | @angular/localize con archivos XLIFF |
| **Testing** | Jasmine + Karma con Chrome Headless |
| **CI/CD** | GitHub Actions (Node 18.x / 20.x matrix) |
| **Hosting** | Vercel (estáticos + función serverless) |

---

## Estructura del repositorio

```
portfolio/
├── api/index.js                 # Función serverless /api/contact
├── vercel.json                  # Configuración de deploy en Vercel
├── .github/workflows/ci.yml     # Pipeline CI
│
├── frontend/                    # App Angular
│   └── src/
│       ├── app/
│       │   ├── app.component.*         # Componente raíz (layout + scroll)
│       │   ├── servicios/              # TemaService (signal + localStorage)
│       │   ├── core/
│       │   │   ├── directivas/         # AnimateOnScrollDirective
│       │   │   └── services/           # ApiService (HttpClient)
│       │   └── componentes/
│       │       ├── barra-lateral/      # Sidebar desktop
│       │       ├── encabezado-movil/   # Header mobile + drawer
│       │       ├── boton-scroll-arriba/
│       │       ├── seccion-hero/
│       │       └── secciones/          # Sobre mí, Tech Skills, Soft Skills,
│       │                               # Idiomas, Experiencia, Educación,
│       │                               # Portfolio, Contacto
│       ├── assets/
│       │   ├── img/                    # Imágenes .webp
│       │   ├── doc/                    # CV en PDF
│       │   └── data/                   # proyectos.json
│       ├── styles/                     # _variables, _mixins, _theme, _base
│       ├── locale/                     # XLIFF traducciones es/en
│       └── environments/               # Configs dev/prod
│
├── GUIA.md                      # Documentación técnica para juniors
├── DEPLOY.md                    # Guía paso a paso de deploy en Vercel
└── README.md                    # Este archivo
```

> El proyecto usa la arquitectura **standalone** de Angular (sin NgModules). Cada componente declara sus propias dependencias.

---

## Cómo correrlo en local

**Requisitos:** Node.js 22.x, npm 9.x

```bash
git clone https://github.com/marcostoledo96/portfolio.git
cd portfolio/frontend
npm install --legacy-peer-deps
npm start
```

Abrir **http://localhost:4200** en el navegador.

> El formulario de contacto requiere backend. Para probarlo con envío real, usar `vercel dev` desde la raíz (ver [DEPLOY.md](DEPLOY.md)).

---

## Scripts disponibles

Desde `frontend/`:

| Script | Qué hace |
|---|---|
| `npm start` | Servidor de desarrollo en puerto 4200 |
| `npm run build` | Build de producción (español) |
| `npm run build:en` | Build en inglés |
| `npm run build:all` | Build en ambos idiomas |
| `npm run build:stats` | Build + estadísticas del bundle |
| `npm run analyze` | Abre source-map-explorer para analizar el bundle |
| `npm run extract-i18n` | Extrae strings para traducción a `src/locale/` |
| `npm run test` | Tests unitarios con Karma + Chrome Headless |

---

## Secciones del portfolio

1. **Hero** — Typewriter con frases rotativas, contadores animados, badges, links sociales
2. **Sobre mí** — Bento grid con bio, ubicación, objetivo, stack actual
3. **Habilidades técnicas** — 18 tarjetas con flip 3D (clic muestra nivel y descripción)
4. **Habilidades blandas** — Cards con soft skills
5. **Idiomas** — Niveles con barra de progreso
6. **Experiencia** — AEROTEST: roles, métricas, tecnologías usadas
7. **Educación** — Formación académica con badges de estado y promedio
8. **Portfolio** — 9 proyectos con filtros (todos / en desarrollo / finalizado), tilt 3D, links a demo y código
9. **Contacto** — Formulario validado + links de contacto + badge "Disponible para trabajar"

---

## API de contacto

- **Endpoint:** `POST /api/contact`
- **Body:** `{ name, email, message }`
- **Validación:** express-validator (name 2–100 chars, email válido, message 10–1000 chars)
- **Envío:** Nodemailer con Gmail SMTP

Variables de entorno necesarias en Vercel:

| Variable | Descripción |
|---|---|
| `EMAIL_USER` | Dirección de Gmail |
| `EMAIL_PASS` | App Password de Gmail |

---

## CI/CD

Cada push y PR a `main` ejecuta GitHub Actions:

1. Build de producción
2. Tests unitarios con Chrome Headless
3. Cobertura de código (artefacto con retención de 7 días)
4. Matrix de Node 18.x y 20.x

El deploy a Vercel se dispara automáticamente en cada push a `main`.

---

## Documentación adicional

| Documento | Para quién | Contenido |
|---|---|---|
| [GUIA.md](GUIA.md) | Desarrolladores junior | Arquitectura, flujo de inicio, cada componente en detalle, glosario |
| [DEPLOY.md](DEPLOY.md) | Cualquier dev | Configuración de Vercel, variables de entorno, troubleshooting |

---

## Contacto

- **GitHub:** [@marcostoledo96](https://github.com/marcostoledo96)
- **LinkedIn:** [Marcos Ezequiel Toledo](https://linkedin.com/in/marcostoledo96)
- **Email:** marcostoledo96@gmail.com

---

## Licencia

Proyecto de código abierto. Podés usarlo como base para tu propio portfolio mencionando la fuente original.
