// Configuración de entorno para producción.
// Aca defino la URL de la funcion serverless que uso cuando compilo la app para deploy en Vercel.
// En producción las APIs están en rutas relativas o en el mismo dominio que el frontend.

export const environment = {
    production: true,
    apiUrl: '/api'
};

