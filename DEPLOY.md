# 🚀 Guía de Despliegue en Vercel

Esta guía te llevará paso a paso para desplegar tu portfolio (frontend + backend) en Vercel completamente gratis.

## 📋 Requisitos previos

1. Cuenta de GitHub (crea una en https://github.com si no tienes)
2. Cuenta de Vercel (puedes registrarte con GitHub en https://vercel.com)
3. Contraseña de aplicación de Gmail configurada

## 🎯 Opción 1: Desplegar desde GitHub (Recomendado)

### Paso 1: Crear repositorio en GitHub

1. Ve a https://github.com/new
2. Crea un nuevo repositorio:
   - **Nombre**: `portfolio` o el nombre que prefieras
   - **Visibilidad**: Público o Privado (ambos funcionan con Vercel)
   - NO marques "Add a README file" (ya tienes uno)
3. Clic en **Create repository**

### Paso 2: Subir tu código a GitHub

Abre PowerShell en la carpeta de tu proyecto y ejecuta:

```powershell
# Inicializar Git (si no lo hiciste antes)
git init

# Añadir todos los archivos
git add .

# Crear el primer commit
git commit -m "Initial commit: Portfolio completo con backend"

# Conectar con tu repositorio de GitHub (reemplaza con TU URL)
git remote add origin https://github.com/marcostoledo96/portfolio.git

# Subir el código
git branch -M main
git push -u origin main
```

**Nota:** Reemplaza `marcostoledo96/portfolio` con tu usuario y nombre de repositorio.

### Paso 3: Desplegar en Vercel

1. Ve a https://vercel.com y haz login con tu cuenta de GitHub
2. Clic en **"Add New..."** → **"Project"**
3. Selecciona tu repositorio `portfolio` de la lista
4. Vercel detectará automáticamente la configuración (gracias a `vercel.json`)
5. **ANTES de hacer clic en Deploy**, configura las variables de entorno:

#### Configurar Variables de Entorno:

Clic en **"Environment Variables"** y añade:

| Name | Value | Environment |
|------|-------|-------------|
| `EMAIL_USER` | `marcostoledo96@gmail.com` | Production |
| `EMAIL_PASS` | `tu-contraseña-de-aplicacion-gmail` | Production |
| `PORT` | `3000` | Production |

6. Clic en **"Deploy"**
7. Espera 1-2 minutos mientras Vercel construye y despliega tu sitio

### Paso 4: ¡Listo! 🎉

Vercel te dará una URL como:
```
https://portfolio-usuario.vercel.app
```

Visita esa URL y prueba el formulario de contacto. Los mensajes te llegarán a `marcostoledo96@gmail.com`.

---

## 🎯 Opción 2: Desplegar desde la CLI de Vercel

Si prefieres no usar GitHub:

### Paso 1: Instalar Vercel CLI

```powershell
npm install -g vercel
```

### Paso 2: Login en Vercel

```powershell
vercel login
```

Sigue las instrucciones en el navegador para autenticarte.

### Paso 3: Desplegar

Desde la carpeta raíz de tu proyecto:

```powershell
vercel
```

La CLI te hará algunas preguntas:
- **Set up and deploy?** → `Y`
- **Which scope?** → Selecciona tu cuenta
- **Link to existing project?** → `N`
- **What's your project's name?** → `portfolio` (o el que prefieras)
- **In which directory is your code located?** → `./` (presiona Enter)

### Paso 4: Configurar variables de entorno

```powershell
vercel env add EMAIL_USER
# Ingresa: marcostoledo96@gmail.com

vercel env add EMAIL_PASS
# Ingresa: tu-contraseña-de-aplicacion-gmail

vercel env add PORT
# Ingresa: 3000
```

### Paso 5: Desplegar a producción

```powershell
vercel --prod
```

¡Listo! Vercel te dará la URL de tu sitio.

---

## 🔧 Configuración avanzada

### Dominio personalizado

1. En el dashboard de Vercel, ve a tu proyecto
2. Settings → Domains
3. Añade tu dominio personalizado (ej: `marcostoledo.dev`)
4. Sigue las instrucciones para configurar los DNS

### Variables de entorno adicionales

Si necesitas cambiar algo después del deploy:

1. Dashboard de Vercel → Tu proyecto → Settings → Environment Variables
2. Añade/edita las variables
3. Redeploy el proyecto para aplicar cambios

---

## 🐛 Solución de problemas

### El formulario no envía emails

1. Verifica las variables de entorno en Vercel:
   - Settings → Environment Variables
   - Confirma que `EMAIL_USER` y `EMAIL_PASS` estén correctos
2. Revisa que la contraseña sea de **aplicación**, no tu contraseña normal de Gmail
3. En los logs de Vercel (Functions → Ver logs), busca errores

### "Failed to connect to backend"

- El backend se despliega automáticamente como una Serverless Function
- Verifica en Functions que `/api/contact` aparezca
- Revisa los logs de la función

### Cambios no se reflejan

1. En el dashboard: Deployments → Redeploy
2. O desde la CLI: `vercel --prod`

---

## 📊 Monitorear tu sitio

En el dashboard de Vercel puedes ver:
- **Analytics**: visitas, performance
- **Functions**: logs del backend
- **Deployments**: historial de versiones

---

## 🔄 Actualizar el sitio

### Con GitHub:
```powershell
git add .
git commit -m "Descripción de los cambios"
git push
```
Vercel detectará el push y redesplegará automáticamente.

### Con CLI:
```powershell
vercel --prod
```

---

## 📝 Notas importantes

- ✅ Frontend y backend se despliegan juntos
- ✅ El backend se ejecuta como Serverless Function (sin servidor dedicado)
- ✅ Vercel te da HTTPS gratis automáticamente
- ✅ El plan gratuito es suficiente para portfolios personales
- ✅ Las variables de entorno están encriptadas y seguras

---

## 🆘 ¿Necesitas ayuda?

Si algo no funciona:
1. Revisa los logs en Vercel (Functions tab)
2. Verifica las variables de entorno
3. Asegúrate de que `.env` NO esté subido a GitHub (está en `.gitignore`)

---

## 🎉 ¡Felicitaciones!

Tu portfolio profesional ya está en línea y el formulario de contacto está funcionando. Ahora puedes compartir tu URL en:
- LinkedIn
- GitHub (README del perfil)
- CV
- Redes sociales

**URL de ejemplo:**
`https://portfolio-marcostoledo.vercel.app`
