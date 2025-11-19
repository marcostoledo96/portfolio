# Cómo lo hice (Notas personales)

Acá dejo una explicación en primera persona de cómo armé este portfolio, por si quiero acordarme después o explicarlo a alguien. No es formal, es tal cual como lo resolvería yo cuando cuente el proceso.

**Resumen rápido**
- Proyecto: Portfolio personal (HTML/CSS/JS) con backend para el formulario.
- Objetivo clave: tema claro por defecto, modo oscuro opcional, paleta consistente y pequeños efectos de hover.
- Archivos principales: `index.html`, `css/styles.css`, `js/script.js`, `backend/server.js`, `api/index.js`.

**Estructura del repo (lo que importa)**
- `index.html` — la estructura HTML principal: sidebar, header móvil, secciones (sobre mí, habilidades, experiencia, educación, portafolio, contacto).
- `css/styles.css` — todo el styling, variables CSS para theming, hover effects, componentes.
- `js/script.js` — lógica: alternar tema (localStorage), abrir/cerrar cajón móvil, navegación interna, envío de formulario, tecleo animado.
- `backend/` — servidor Express (opcional si quiero correr back-end localmente) que maneja el envío real del contacto con Nodemailer.
- `api/index.js` — versión lista para serverless (Vercel).

**Decisiones de diseño y criterios**
- Quería que el modo claro sea el predeterminado (sin localStorage), y que el modo oscuro se active sólo si el usuario lo eligió.
- Paleta usada (la que elegí): `#063360`, `#FCFCFC`, `#35A7FF` (acento/celeste), `#1E2019`, `#031426`.
- Accesibilidad: contraste objetivo cercano a WCAG AA, foco de elementos, labels en formularios, roles/aria donde aplica.

**Cómo funciona el theming (explicado fácil)**
- Base: uso una clase en el `body` para marcar el tema claro: `body.claro`. Si la clase no está, se interpreta modo oscuro.
- En `js/script.js` leo/escribo `localStorage` para guardar la preferencia `"claro"` o `"oscuro"`.
  - Si en `localStorage` está `oscuro`, quito `claro` del `body`.
  - Si está `claro` o no hay nada (primera visita), agrego `claro` al `body`.
- En `css/styles.css` defino variables y reglas que dependen del tema. Ejemplos:
  - Variables globales: `--color-acento`, `--color-primario`, `--fondo` (definidas en `:root` o en ramas por tema).
  - Reglas específicas: `body.claro .texto-acento { color: var(--color-primario); }` hace que el texto de acento cambie en claro.

Ejemplo simplificado (lo que puse realmente):

```
/* en CSS */
.texto-acento { color: var(--color-acento); }
body.claro .texto-acento { color: var(--color-primario); }
```

Así el mismo selector cambia según el tema.

**Cambios recientes importantes (qué toqué y por qué)**
- Hice que el logo circular `.logo-circulo` use el acento celeste en ambos temas (`#35A7FF`) pero que el color del texto dentro cambie según el tema (negro en oscuro, blanco en claro). Lo resolví añadiendo reglas:
  - `.logo-circulo { background: #35A7FF; color: #000; }`
  - `body.claro .logo-circulo { color: #fff; }`
- El cursor de tecleo en el hero (`.cursor-tecleado`) originalmente tenía `color: var(--color-acento)`; lo cambié a `color: inherit;` para que tome exactamente el color del encabezado contenedor (`.texto-acento`) y así se sincronice automáticamente con el tema.
  - También agregué `transition: color .2s ease` para suavizar el cambio al alternar.

Por qué `inherit` es la solución buena:
- El texto que se escribe usa `texto-acento`, y esa clase tiene reglas distintas según el tema. Si el cursor hereda el color del `h3`, el cursor siempre coincidirá con el texto, sin necesitar lógica JS extra.

**Detalles clave en `css/styles.css`**
- Variables principales (ejemplo):
  - `--color-acento: #35A7FF;` (acento celeste)
  - `--color-primario: #063360;` (texto/primario en claro)
  - `--fondo-claro: #FCFCFC;` / `--fondo-oscuro: #031426` (backgrounds)
- Componentes:
  - `.barra-lateral` — colores y fondo adaptables por tema.
  - `.icono-circulo` — un círculo que contiene iconos; normalicé su fondo a `#35A7FF` y el color del icono cambia por `body.claro`.
  - `.boton.primario` — botón principal que usa `--color-acento` y adapta icono/texto según tema.
- Transiciones: añadí transiciones suaves a cards y secciones para que al cambiar de tema todo no sea abrupto.

**Qué cambié específicamente para el cursor (paso a paso técnico)**
1. Busqué la regla en `css/styles.css` que decía:
   ```css
   .cursor-tecleado { display: inline-block; margin-left: 2px; color: var(--color-acento); }
   ```
2. La reemplacé por:
   ```css
   .cursor-tecleado { display: inline-block; margin-left: 2px; color: inherit; transition: color .2s ease; }
   ```
3. Resultado: el cursor ahora hereda el color del `h3.texto-acento`. Cuando `body.claro` aplica la regla para `.texto-acento` el cursor será oscuro; cuando esté en modo oscuro el cursor será celeste — exactamente como el texto animado.

**JS importante en `js/script.js` (resumen)**
- Inicializo el tema leyendo `localStorage.getItem('tema')`.
- Código esencial (sintético):
  ```js
  const cuerpo = document.body;
  const temaGuardado = localStorage.getItem('tema');
  if (temaGuardado === 'oscuro') {
    cuerpo.classList.remove('claro');
  } else { // 'claro' o sin valor => claro por defecto
    cuerpo.classList.add('claro');
  }
  // Los botones de alternar tema guardan la preferencia en localStorage
  ```
- También manejo apertura del cajón móvil, navegación interna (scroll a secciones) y el tecleo animado que va cambiando el `textContent` de `#escrito`.

**Backend / formulario de contacto (cómo lo hice funcionar)**
- Tengo dos variantes:
  - `api/index.js` — handler listo para Vercel (serverless).
  - `backend/server.js` — Express tradicional para correr localmente.
- en `backend/server.js` uso `express`, `express-validator`, `nodemailer` y `cors` para aceptar POST con `name`, `email`, `message`, validarlo y enviarlo.
- Para probar localmente:
  1. `cd backend`
  2. `npm install`
  3. Crear `.env` con `EMAIL_USER` y `EMAIL_PASS` (credenciales SMTP)
  4. `node server.js` (o `npm start` si configuro script)
- En producción (Vercel) uso `api/index.js` que hace lo mismo pero adaptado a la plataforma serverless.

**Comandos útiles para desarrollo local**
- Abrir frontend (simple): abrir `index.html` en el navegador.
- Correr backend local (PowerShell):
```powershell
cd backend; npm install; $env:EMAIL_USER="tu@mail.com"; $env:EMAIL_PASS="tu_pass"; node server.js
```
(Si prefiero usar `.env`, instalo `dotenv` y ejecuto `node server.js`.)

**Testing rápido que suelo hacer**
- Alternar tema y revisar contraste.
- Probar el cursor del hero: cambiar tema y observar color.
- Enviar el formulario (si backend corriendo) y verificar recepción de email.
- Revisar botones `Ver sitio` y links externos.

**Notas y mejoras que puedo agregar después**
- Añadir preferencia `prefers-color-scheme` para respetar la preferencia del sistema la primera vez.
- Hacer que el cursor parpadee con CSS (`@keyframes blink`) si quiero más dinamismo.
- Añadir pruebas unitarias mínimas para el backend (supertest) y linters.
- Mejorar accesibilidad: manejo del foco visible en teclado y roles ARIA más completos.

**Fix importante: recuadro blanco en scroll móvil (resuelto)**
 - **Problema inicial**: En móviles reales (no en DevTools) aparecía un flash/recuadro blanco o azul tenue al hacer scroll rápido hacia abajo.
 - **Causa real**: El uso de `background-attachment: fixed` sobre el gradiente del `body` y `html` generaba un glitch de repintado en algunos navegadores móviles durante el cambio de altura del viewport (colapso/expansión de la barra). El navegador mostraba un área sin pintar (fallback blanco) antes de recomponer el gradiente.
 - **Primer intento**: Desactivar overscroll y igualar fondo de `html` y `body`. Mejoró pero seguía apareciendo el artefacto en algunos scrolls rápidos.
 - **Solución final estable**:
   1. Eliminé todos los `background-attachment: fixed`.
   2. Dejé `html, body` con un color sólido oscuro base para evitar cualquier flash (fallback inmediato).
   3. Creé una capa fija con pseudo-elemento: `body::before { position: fixed; inset:0; background: gradiente; z-index:-1; }`.
   4. Hice que en modo claro `body.claro::before` cambie a fondo claro.
   5. Usé `min-height: 100svh` y `100dvh` para estabilidad de viewport en móviles modernos.
   6. Ajusté `overscroll-behavior: contain;` en root para reducir bounce sin romper scroll interno.
 - **Resultado**: El fondo ya no parpadea ni muestra recuadros blancos/azules al hacer scroll rápido en móvil.
  3. Añadí `background-attachment: fixed;` al gradiente del `body` para que quede fijo durante el scroll.
  4. Puse un color de fondo sólido en el `html` (`background: var(--body-dark-bg-start)`) como fallback.
  5. Actualicé `js/script.js` para que también aplique la clase `claro` al elemento `<html>`, no solo al `<body>`.
- **Resultado**: El recuadro blanco desapareció en móviles y el scroll se siente más sólido.

Si querés, puedo:
- Añadir el parpadeo del cursor ahora.
- Incluir el `prefers-color-scheme` como opción por defecto (respetar sistema en primera visita).
- Generar un `README.md` con comandos de despliegue (Vercel) y variables de entorno.

¿Querés que agregue el parpadeo del cursor o que deje este archivo tal como está?