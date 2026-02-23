# Guía de deploy en Vercel — Portfolio Angular

Portfolio Angular 20 con función serverless de contacto (Nodemailer/Gmail). Todo vive en un único repositorio; Vercel lee la configuración de `vercel.json` en la raíz y no requiere configuración manual en el dashboard de proyecto.

---

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 22.x |
| npm | 9.x o superior |
| Angular CLI | local vía `npx ng` (ya incluido en `devDependencies`) |
| Cuenta Vercel | vinculada al repositorio GitHub |

---

## Estructura del repositorio

```
portfolio/
├── api/
│   └── index.js          ← función serverless (POST /api/contact)
├── frontend/             ← app Angular 20
│   ├── dist/             ← generado por el build (ignorado en git)
│   └── src/
├── vercel.json           ← configuración completa de Vercel
└── package.json          ← dependencias de la API (nodemailer, express-validator)
```

---

## Configuración de Vercel (`vercel.json`)

El archivo ya está configurado y Vercel lo lee automáticamente al conectar el repo:

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

- `--legacy-peer-deps`: necesario por dependencias de Angular 20 con paquetes de Material/UI que aún declaran peerDependencies estrictos.
- `framework: null`: desactiva la detección automática de Vercel para que use los comandos exactos del `vercel.json`.
- El primer rewrite enruta todas las llamadas a `/api/*` a la función serverless `api/index.js`.
- El segundo rewrite implementa el fallback del router de Angular (SPA).

---

## Variables de entorno

Configurarlas en **Vercel Dashboard → Project → Settings → Environment Variables** antes del primer deploy:

| Variable | Descripción |
|---|---|
| `EMAIL_USER` | Dirección Gmail desde la que se envían los mensajes (ej: `miportfolio@gmail.com`) |
| `EMAIL_PASS` | App Password de Google — **no** la contraseña de la cuenta. Generarlo en: Google Account → Seguridad → Verificación en dos pasos → Contraseñas de aplicación |

> Marcar ambas como **Production** (y también **Preview** si se quiere probar en branches).

---

## Build local (opcional, para validar antes de pushear)

```powershell
cd portfolio/frontend
npm install --legacy-peer-deps
npm run build
# Verificar que existe: frontend/dist/portfolio-frontend/browser/index.html
```

### Scripts disponibles en `frontend/`

```powershell
npm run build          # build de producción en español (el que usa Vercel)
npm run build:en       # build en inglés (genera dist separado)
npm run build:all      # build con ambos idiomas localizados
npm run build:stats    # build + stats.json para analizar el bundle
npm run analyze        # build + abre source-map-explorer en el browser
npm run extract-i18n   # extrae strings para traducción a src/locale/
```

---

## Pasos de deploy

### 1) Primer deploy — conectar el proyecto

1. Entrar a [vercel.com](https://vercel.com) → **Add New Project**.
2. Importar el repositorio desde GitHub.
3. Vercel detecta el `vercel.json` automáticamente — **no modificar** los campos de build/output en el wizard.
4. Agregar las variables de entorno `EMAIL_USER` y `EMAIL_PASS` en la pantalla de configuración antes de hacer clic en **Deploy**.
5. Clic en **Deploy** y esperar (~2-3 minutos).

### 2) Redeploys posteriores

Cada push a `main` dispara un redeploy automático:

```powershell
git add .
git commit -m "feat: descripción del cambio"
git push origin main
```

Para forzar un redeploy sin cambios de código:

```powershell
git commit --allow-empty -m "chore: trigger redeploy"
git push origin main
```

---

## Probar la función serverless en local

Vercel CLI permite emular la función localmente con las mismas variables de entorno:

```powershell
# Desde portfolio/ (raíz del proyecto)
npm install -g vercel       # solo la primera vez
vercel login
vercel dev                  # levanta frontend + función en localhost:3000
```

Crear un archivo `.env` en la raíz (ignorado por `.gitignore`) con:

```env
EMAIL_USER=miportfolio@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

---

## Checklist post-deploy

- [ ] La página carga en el dominio `.vercel.app`.
- [ ] El toggle de tema (claro/oscuro) funciona y persiste al recargar.
- [ ] En mobile: el drawer abre/cierra y la navegación a secciones funciona con scroll suave.
- [ ] Formulario de contacto: enviar un mensaje de prueba → verificar que llega el mail y aparece el toast de éxito.
- [ ] Formulario con campos vacíos: verificar que aparecen los mensajes de validación.
- [ ] Las imágenes, el CV y el favicon cargan desde `/assets`.
- [ ] Las animaciones de scroll reveal se activan al bajar la página.
- [ ] En Vercel Dashboard → **Functions** → verificar que `/api` aparece y que los logs no tienen errores.

---

## Internacionalización

El deploy predeterminado es en **español** (`npm run build`).  
Para publicar la versión en **inglés**, en Vercel cambiar el Build Command a:

```
cd frontend && npm run build:en
```

O crear un segundo proyecto Vercel apuntando al mismo repo con ese override.

---

## Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| Build falla con `ERESOLVE` | Conflicto de peer deps | Verificar que `vercel.json` usa `--legacy-peer-deps` en `installCommand` |
| Formulario devuelve 500 | Variables de entorno no seteadas | Chequear `EMAIL_USER` y `EMAIL_PASS` en Vercel Dashboard |
| Formulario devuelve 500 | `EMAIL_PASS` es la contraseña de cuenta | Usar un App Password de Google, no la contraseña principal |
| Rutas SPA dan 404 | Falta el rewrite del router | Verificar que el segundo rewrite `/(.*) → /index.html` está en `vercel.json` |
| Tema oscuro no persiste | `localStorage` bloqueado | El usuario tiene cookies/storage bloqueados en el browser |
