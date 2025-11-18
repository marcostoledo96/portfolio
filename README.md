# Portfolio

Visita mi sitio: https://marcostoledo.cv

Contacto: marcostoledo96@gmail.com

Construi esta version de mi portfolio para mostrar quien soy, que tecnologias domino y como trabajo cuando tengo que cuidar cada detalle. Todo el sitio esta hecho a mano con HTML, CSS y JavaScript puro, sin frameworks. Preferi enfocarme en la experiencia, la accesibilidad y el rendimiento, y dejar el codigo lo suficientemente claro como para poder mantenerlo yo mismo en el tiempo.

## Que vas a encontrar
- **Barra lateral fija** en desktop con mi foto, navegacion contextual y un interruptor de tema que funciona como toggle con sol/luna.
- **Modo oscuro/claro** persistente (localStorage) sin parpadeos y con estilos especificos para que la barra lateral mantenga siempre mi paleta oscura.
- **Drawer movil** con animacion y control de foco para navegar comodo desde el telefono.
- **Hero vivo** con titulo animado, resaltado de mi nombre y links a redes.
- **Secciones de habilidades, experiencia, educacion y proyectos** diseniadas como tarjetas con microinteracciones y grillas responsive.
- **Formulario de contacto real** que valida datos en el cliente, muestra notificaciones y envia la informacion a mi backend Node/Express.

## Stack y dependencias
- **Frontend:** HTML semantico, CSS modularizado en `css/styles.css`, JavaScript organizado en `js/script.js`.
- **Fuentes:** Inter y Poppins cargadas via Google Fonts.
- **Iconografia:** Lucide desde CDN, inicializado en `script.js` cada vez que cambio un icono dinamico.
- **Backend opcional:** carpeta `backend/` con un microservicio en Express que usa Nodemailer para reenviar los mensajes del formulario a mi correo.

## Estructura del repositorio
```
Portfolio-2.0/
|-- css/styles.css        # Variables, layout, componentes y media queries
|-- js/script.js          # Scroll suave, menu activo, drawer, toggle de tema y formulario
|-- img/                  # Fotografia y assets
|-- backend/              # API para el formulario de contacto
|-- doc/CV_ToledoMarcos.pdf  # CV en PDF
\-- index.html            # Todas las secciones del sitio
```

## Como correrlo en local
### Frontend
1. Clonar o descargar el repositorio.
2. Abrir `index.html` directo en el navegador **o** levantar un servidor estatico:
   ```powershell
   # dentro de Portfolio
   python -m http.server 8080
   ```
3. Navegar a `http://localhost:8080`.

### Backend (opcional pero recomendado para el formulario)
1. Ir a la carpeta `backend`.
   ```powershell
   cd backend
   npm install
   ```
2. Copiar `.env.example` a `.env` y completar:
   ```env
   PORT=3000
   FRONTEND_URL=http://127.0.0.1:8080   # o la URL donde sirvo el front
   EMAIL_USER=tu_correo@gmail.com
   EMAIL_PASS=contrasena_de_aplicacion
   ```
3. Conseguir una contrasena de aplicacion de Gmail (2FA activado) y colocarla en `EMAIL_PASS`.
4. Levantar el servidor:
   ```powershell
   npm run dev   # o npm start
   ```
5. Por defecto el frontend envia los datos a `http://localhost:3000/api/contact`. Si lo despliego, solo cambio la URL en `js/script.js`.

## Flujo del formulario de contacto
1. El usuario completa nombre, email y mensaje.
2. `script.js` valida que los campos no esten vacios y deshabilita el boton mientras envia los datos.
3. Hago un `fetch` al endpoint `/api/contact` del backend.
4. El backend valida, arma un correo HTML y lo envia con Nodemailer usando mis credenciales seguras.
5. Si todo sale bien, muestro un toast de exito y limpio el formulario; si algo falla, aviso con un mensaje de error amigable.

## Detalles que cuide
- Los estados activos del menu cambian con scroll y funcionan igual en escritorio y movil.
- La animacion del subtitulo del hero esta escrita desde cero para poder ajustar velocidades y tiempos muertos.
- El toggle de tema usa accesibilidad nativa (`role="switch"` + `aria-checked`) y mantiene la posicion visual del "thumb" sincronizada con el estado real.
- El drawer movil bloquea el scroll del body cuando esta abierto y se puede cerrar tocando fuera o con el boton.
- Los mensajes del formulario se notifican con un componente ligero que se destruye solo para no ensuciar el DOM.

---
Hecho con paciencia y mucho cafe por Marcos Ezequiel Toledo.
