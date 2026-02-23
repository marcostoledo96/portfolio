// Configuración de entorno para producción (ng build → deploy en Vercel).
// La ruta /api es relativa al dominio de Vercel; el rewrite en vercel.json la redirige a la función serverless.
export const environment = {
    production: true,
    apiUrl: '/api'
};

