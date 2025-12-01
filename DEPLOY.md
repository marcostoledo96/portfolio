# Guía de deploy en Vercel (mi portfolio Angular)

Documento los pasos para publicar el portfolio en Vercel con frontend Angular y la función serverless de contacto. Todo vive en este repo, sin backend separado.

## Prep previo
- Node 18+ y npm instalados.
- Cuenta en Vercel vinculada a mi GitHub.
- Variables de entorno listas: `EMAIL_USER` y `EMAIL_PASS` (contraseña de aplicación de Gmail).

## Comandos de build

Tengo varios scripts disponibles según lo que necesite:

```powershell
# Build estándar en español
cd frontend
npm run build

# Build en inglés (genera dist separado)
npm run build:en

# Build de ambos idiomas
npm run build:all

# Analizar el bundle
npm run build:stats
npm run analyze

# Extraer textos para traducir
npm run extract-i18n
```

## Pasos de deploy
1) Build local (opcional, para validar):
```powershell
cd frontend
npm install
npm run build
```
Verifico que se genera `frontend/dist/portfolio-frontend/browser`.

2) Subo cambios al repo (main):
```powershell
git add .
git commit -m "Deploy: ajustes"
git push origin main
```

3) En Vercel:
- Creo proyecto nuevo o selecciono el existente.
- Fuente: el repo de GitHub.
- Command de build: `cd frontend && npm run build`.
- Output: `frontend/dist/portfolio-frontend/browser`.
- Rewrites (ya en `vercel.json`):
  - `/api/:path* -> /api` (función serverless de contacto)
  - `/(.*) -> /index.html` (Angular router)

4) Variables de entorno (Production):
- `EMAIL_USER` = mi correo Gmail
- `EMAIL_PASS` = contraseña de aplicación

5) Deploy automático: Vercel instala deps, corre el build y publica. Reviso logs para ver que la función `/api/contact` quedó OK.

## Tests rápidos post-deploy
- Cargo la página y pruebo el toggle de tema (persiste al recargar).
- En móvil: abro/cierro el drawer y navego a secciones con scroll suave.
- Pruebo el doble toque en los botones sociales (debería mostrar tooltip primero).
- Formulario: envío un mensaje de prueba y confirmo que llega el mail y aparece el toast. Pruebo validaciones con campos vacíos.
- Verifico que las imágenes y el CV cargan desde `/assets`.
- Reviso que las animaciones scroll reveal funcionen al hacer scroll.

## Redeploys
Cada push a `main` redeploya solo. Si necesito forzar sin cambios: `git commit --allow-empty -m "Trigger redeploy" && git push`.

## Ambiente local con la función
Si quiero probar la función en local puedo usar `vercel dev` desde la raíz, con las mismas env vars (`EMAIL_USER`, `EMAIL_PASS`).

## Notas sobre internacionalización
El build principal es en español. Si quisiera publicar la versión en inglés, debería cambiar el command de Vercel a `npm run build:en` o crear un proyecto separado para cada idioma.
