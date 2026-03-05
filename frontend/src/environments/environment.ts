// Configuración de entorno para desarrollo local (ng serve / vercel dev).
// apiUrl en /api funciona tanto con ng serve + vercel dev como con el proxy de development.
export const environment = {
    production: false,
    apiUrl: '/api',
    // Cloudflare Turnstile — clave de prueba oficial (siempre pasa, solo para dev)
    // Obtener clave real en: https://dash.cloudflare.com → Turnstile
    turnstileSiteKey: '1x00000000000000000000AA'
};


