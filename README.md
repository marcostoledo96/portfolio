# Portfolio - Angular v20

Es mi portfolio personal construido con Angular 20 como single page. Lo uso para mostrar quién soy, qué tecnologías manejo y cómo trabajo. Mantengo la arquitectura lo más simple posible: un solo módulo de aplicación y los componentes declarados directo en `AppModule`.

## Qué incluye
- Barra lateral fija en desktop y drawer en mobile para navegar por secciones.
- Modo claro/oscuro persistente con toggle accesible.
- Hero con texto animado tipo “typed” y enlaces a redes.
- Secciones de habilidades, experiencia, educación y proyectos con tarjetas y microinteracciones.
- Formulario de contacto real: valida datos, muestra toasts y envía a la función serverless `/api/contact`.
- Assets propios (foto, logos de tecnologías, CV en PDF) servidos desde `/assets`.

## Pensado para vos (recruiter o visitante)
- Navegación simple: todo está en una sola página, los botones llevan a cada sección con scroll suave.
- Rápido de revisar: textos cortos, tarjetas claras y links directos a proyectos y redes.
- Contacto real: el formulario envía un correo usando mi función serverless, sin depender de un backend externo.

## Stack y arquitectura
- **Framework:** Angular 20 + TypeScript.
- **Estado y utilidades:** BehaviorSubject para tema, drawer y notificaciones; HttpClient para la API.
- **Estilos:** SCSS único en `styles.scss`, fuentes Inter y Poppins, íconos Lucide por CDN.
- **API de contacto:** función serverless en `api/index.js` (Vercel) con `express-validator` y `nodemailer`.
- **Sin backend local separado:** todo se resuelve con la función `/api/contact` y el frontend en `frontend/`.

## Estructura del repo
```
Portfolio-a/
├─ frontend/                   # App Angular
│  ├─ src/app/
│  │  ├─ core/layout/          # Sidebar, mobile header, drawer
│  │  ├─ core/services/        # ThemeService, DrawerService, ApiService, NotificationService
│  │  ├─ features/home/        # HomeComponent con todas las secciones y el formulario
│  │  ├─ app.module.ts         # Declaro todos los componentes
│  │  ├─ app-routing.module.ts # Ruta única a HomeComponent
│  │  └─ app.component.ts      # Layout principal
│  ├─ assets/                  # img/, doc/ (CV), favicon
│  ├─ styles.scss              # Estilos globales y temas
│  └─ index.html               # Entry point Angular
├─ api/index.js                # Función serverless /api/contact
├─ vercel.json                 # Build y rewrites para Vercel
├─ GUIA.md                     # Nota técnica para mí
└─ README.md                   # Este archivo
```

## Cómo correrlo en local
1) Instalar dependencias del frontend:
```powershell
cd frontend
npm install
```
2) Levantar en dev:
```powershell
npm start   # alias de ng serve
```
3) Abrir http://localhost:4200

## API de contacto
- Endpoint: `POST /api/contact`.
- Se espera `{ name, email, message }`.
- Env vars en Vercel: `EMAIL_USER`, `EMAIL_PASS` (contraseña de aplicación de Gmail).
- La respuesta devuelve `success` y `message`; en errores envío mensajes claros al usuario.

## Build y deploy
- Build prod local: `cd frontend && npm run build` (salida en `frontend/dist/portfolio-frontend/browser`).
- Vercel usa `vercel.json` para: `buildCommand: "cd frontend && npm run build"`, output `frontend/dist/portfolio-frontend/browser`, rewrite `/api/:path* -> /api` y fallback a `index.html` para el router.

## Cómo probar rápido
- Cambiar de tema con el switch (sol/luna) y verificar que persiste al recargar.
- Abrir/cerrar el drawer en mobile y navegar a secciones; el scroll es suave.
- Enviar el formulario con datos válidos e inválidos y ver los toasts de éxito/error.
- Revisar que las imágenes y el CV en `assets/` cargan correctamente.
