// Configuración de entorno para producción (ng build → deploy en Vercel).
// La ruta /api es relativa al dominio de Vercel; el rewrite en vercel.json la redirige a la función serverless.
export const environment = {
    production: true,
    apiUrl: '/api',
    // Cloudflare Turnstile — reemplazar con la clave real del sitio registrado
    // Registrar en: https://dash.cloudflare.com → Turnstile → Add Site
    turnstileSiteKey: '0x4AAAAAACmepJybyiSX4jqW'
};

