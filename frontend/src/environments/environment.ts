// Configuración de entorno para desarrollo.
// Aco defino la URL de la funci??n serverless que uso cuando corro la app localmente con ng serve.
// Uso la ruta relativa /api para apuntar al handler de contacto (o a vercel dev si est? disponible).

export const environment = {
    production: false,
    apiUrl: '/api'
};


