# Backend del Portfolio - Formulario de Contacto

Backend en Node.js con Express para manejar el envío de mensajes del formulario de contacto de tu portfolio.

## 🚀 Configuración Rápida

### 1. Instalar dependencias

```powershell
cd backend
npm install
```

### 2. Configurar variables de entorno

1. Copia el archivo `.env.example` a `.env`:
   ```powershell
   copy .env.example .env
   ```

2. Edita el archivo `.env` con tus credenciales:
   ```env
   PORT=3000
   FRONTEND_URL=http://127.0.0.1:5500
   EMAIL_USER=marcostoledo96@gmail.com
   EMAIL_PASS=tu-contraseña-de-aplicacion-aqui
   ```

### 3. Obtener Contraseña de Aplicación de Gmail

**IMPORTANTE**: No uses tu contraseña normal de Gmail. Debes crear una "Contraseña de aplicación".

#### Pasos para obtenerla:

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. En el menú izquierdo, selecciona **Seguridad**
3. Activa la **Verificación en dos pasos** (si no la tienes)
4. Una vez activada, busca **Contraseñas de aplicaciones**
5. Selecciona:
   - App: "Correo"
   - Dispositivo: "Otro (nombre personalizado)" → escribe "Portfolio Backend"
6. Haz clic en **Generar**
7. Copia la contraseña de 16 caracteres (sin espacios)
8. Pégala en tu archivo `.env` en `EMAIL_PASS`

### 4. Iniciar el servidor

```powershell
npm start
```

O en modo desarrollo (con auto-reload):
```powershell
npm run dev
```

Verás:
```
🚀 Servidor backend corriendo en http://localhost:3000
✅ Servidor de email listo para enviar mensajes
📧 Los mensajes se enviarán a: marcostoledo96@gmail.com
```

## 🧪 Probar el endpoint

### Con el frontend
1. Asegúrate de que el backend esté corriendo
2. Abre tu portfolio en el navegador
3. Completa el formulario de contacto y envía

### Con Postman o Thunder Client

```http
POST http://localhost:3000/api/contact
Content-Type: application/json

{
  "name": "Prueba Test",
  "email": "prueba@ejemplo.com",
  "message": "Este es un mensaje de prueba del formulario de contacto"
}
```

## 📁 Estructura del proyecto

```
backend/
├── server.js          # Servidor Express con endpoints
├── package.json       # Dependencias y scripts
├── .env              # Variables de entorno (NO subir a Git)
├── .env.example      # Plantilla de variables
└── README.md         # Esta documentación
```

## 🔒 Seguridad

- **NUNCA** subas tu archivo `.env` a Git (ya está en `.gitignore`)
- Usa contraseñas de aplicación de Gmail, no tu contraseña principal
- El servidor valida y sanitiza todos los inputs
- CORS configurado para permitir solo tu frontend

## 🌐 Desplegar en producción

### Opción 1: Vercel (Recomendado para serverless)

1. Instala Vercel CLI:
   ```powershell
   npm i -g vercel
   ```

2. Desde la carpeta `backend`, ejecuta:
   ```powershell
   vercel
   ```

3. Configura las variables de entorno en el dashboard de Vercel

### Opción 2: Railway

1. Crea una cuenta en https://railway.app
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno
4. Railway detectará automáticamente Node.js y desplegará

### Opción 3: Render

1. Crea una cuenta en https://render.com
2. Crea un nuevo "Web Service"
3. Conecta tu repo y configura:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Añade las variables de entorno

## 🛠️ Actualizar el frontend

Una vez desplegado el backend, actualiza la URL en tu `script.js`:

```javascript
// En lugar de http://localhost:3000
const API_URL = 'https://tu-backend.vercel.app';
```

## ✅ Health Check

Endpoint para verificar que el servidor está funcionando:

```http
GET http://localhost:3000/api/health
```

Respuesta:
```json
{
  "status": "ok",
  "timestamp": "2025-11-12T..."
}
```

## 📧 Formato del email recibido

Los mensajes llegarán a `marcostoledo96@gmail.com` con:
- Asunto: "📬 Nuevo mensaje de contacto de [Nombre]"
- Formato HTML profesional
- Reply-to configurado para responder directamente
- Información organizada: nombre, email, mensaje

## 🐛 Solución de problemas

### "Error al conectar con el servidor de email"
- Verifica que la contraseña de aplicación sea correcta
- Confirma que la verificación en dos pasos esté activa
- Revisa que `EMAIL_USER` sea tu email completo

### "CORS error"
- Asegúrate de que `FRONTEND_URL` en `.env` coincida con la URL desde la que abres tu portfolio

### El servidor no inicia
- Verifica que el puerto 3000 no esté ocupado
- Ejecuta `npm install` de nuevo para reinstalar dependencias

## 📝 Licencia

MIT - Marcos Toledo © 2025
