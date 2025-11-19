# Guía personal de despliegue en Vercel

Después de pulir la versión 2.0 de mi portfolio quería verlo online rápido y sin servidores caros. Esto es exactamente lo que hice para dejarlo funcionando en Vercel, con frontend y backend dentro del mismo proyecto.

## Lo que preparé antes

1. Cuenta de GitHub con acceso HTTPS o SSH (https://github.com).
2. Cuenta de Vercel enlazada con GitHub (https://vercel.com).
3. Contraseña de aplicación de Gmail (desde Security > App passwords).
4. Git y Node.js instalados para poder commitear y correr scripts antes de subir.

## Paso 1. Repositorio en GitHub

- Entré a https://github.com/new y creé un repo limpio (sin README ni gitignore porque ya existen en mi carpeta).
- Lo nombré `portfolio-2.0`, aunque cualquier nombre sirve.
- Lo dejé privado al principio y luego lo pasé a público cuando estuvo listo.

## Paso 2. Subí mi código

En la raíz del proyecto abrí PowerShell y ejecuté:

```powershell
git init
git add .
git commit -m "Portfolio 2.0 listo para producción"
git branch -M main
git remote add origin https://github.com/marcostoledo96/portfolio.git
git push -u origin main
```

(Reemplaza la URL con la tuya; todo lo demás es igual.)

## Paso 3. Conecté el repo con Vercel

1. Fui a https://vercel.com/dashboard y elegí Add New > Project.
2. Autoricé a Vercel para leer mis repos y seleccioné `portfolio-2.0`.
3. Vercel detectó automáticamente el framework gracias al `vercel.json`.
4. Antes de tocar Deploy configuré las variables de entorno.

### Variables de entorno que uso

| Name       | Value                             | Environment |
|------------|-----------------------------------|-------------|
| EMAIL_USER | tuemail@gmail.com                 | Production  |
| EMAIL_PASS | contraseña de aplicación de Gmail | Production  |
| PORT       | 3000                              | Production  |

Con eso Vercel crea automáticamente la Serverless Function `/api/contact`.

## Paso 4. Deploy y verificación

- Hice clic en Deploy y esperé a que terminara el build (tarda 1-2 minutos).
- Probé la URL que me dio Vercel (`https://portfolio-marcostoledo.vercel.app` en mi caso).
- Fui directo al formulario de contacto y mandé un mensaje de prueba para confirmar que llegaba a mi correo.
- Revisé los Logs de Functions dentro del dashboard por si había errores.

## Ajustes posteriores que me funcionaron

- **Dominio personalizado:** en Project Settings > Domains añadí mi dominio y seguí los pasos DNS de Vercel.
- **Variables nuevas:** cada vez que cambio una env (por ejemplo otra cuenta de correo) la edito en Settings > Environment Variables y disparo un Redeploy.
- **Analytics y logs:** desde el dashboard veo visitas, performance y trazas de la función `/api/contact`.

## Cómo lo actualizo en el día a día

```powershell
git add .
git commit -m "Describe aquí el cambio"
git push
```

Con eso Vercel vuelve a construir solo. Si estoy afuera y necesito algo rápido, corro `vercel --prod` desde la notebook y listo.

## Compartí el resultado

Una vez que vi todo funcionando, sumé la URL al README de mi perfil, LinkedIn, CV y redes. Así cualquiera puede ver el portfolio y usar el formulario real.

Cualquier paso de aquí arriba lo fui ajustando a medida que repetía el despliegue, así que si sigues estos puntos deberías terminar con el mismo setup que estoy usando hoy.
