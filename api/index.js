// ============================================================================
// API SERVERLESS - Función para enviar emails desde el formulario de contacto
// ============================================================================
// Esta es una función serverless que se ejecuta en Vercel
// Se activa cuando alguien hace POST a /api/contact
// Envía un email usando Gmail SMTP con Nodemailer

// === IMPORTS (ES6 MODULES) ===
// import: sintaxis de ES6 modules (más moderna que require())
// from: de dónde importar (paquete npm)

// nodemailer: librería para enviar emails usando SMTP
// SMTP = Simple Mail Transfer Protocol (protocolo para enviar emails)
import nodemailer from 'nodemailer';

// express-validator: librería para validar datos del request
// body: función para validar campos del body (nombre, email, mensaje)
// validationResult: función para obtener los resultados de las validaciones
import { body, validationResult } from 'express-validator';

// === CONFIGURACIÓN DE NODEMAILER ===
// transporter: objeto que maneja el envío de emails
// const: variable que no se puede reasignar (pero su contenido sí se puede modificar)
const transporter = nodemailer.createTransport({
  // service: servicio de email a usar
  // 'gmail' = Gmail SMTP (podría ser 'hotmail', 'yahoo', etc.)
  service: 'gmail',
  
  // auth: credenciales de autenticación
  auth: {
    // process.env: objeto con variables de entorno
    // EMAIL_USER: email desde el que enviar (ej: 'miportfolio@gmail.com')
    // Las variables de entorno se configuran en Vercel Dashboard
    user: process.env.EMAIL_USER,
    
    // EMAIL_PASS: contraseña o App Password de Gmail
    // NUNCA poner la contraseña directamente en el código (inseguro)
    // Debe ser un App Password generado en Google Account -> Security
    pass: process.env.EMAIL_PASS
  }
});

// === VALIDADORES ===
// Array de validadores que se ejecutan antes de procesar el request
// Cada validador es una función que valida un campo específico
const validadores = [
  // === VALIDADOR DEL CAMPO 'name' ===
  body('name')
    // .trim(): quita espacios al inicio y final del string
    // "  Juan  " -> "Juan"
    .trim()
    
    // .notEmpty(): verifica que no esté vacío
    // .withMessage(): mensaje de error si falla la validación
    .notEmpty().withMessage('El nombre es requerido')
    
    // .isLength({ min, max }): verifica la longitud del string
    // min: 2 = mínimo 2 caracteres
    // max: 100 = máximo 100 caracteres
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  // === VALIDADOR DEL CAMPO 'email' ===
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    
    // .isEmail(): verifica que sea un email válido
    // Chequea que tenga @, dominio, etc.
    .isEmail().withMessage('Email inválido')
    
    // .normalizeEmail(): normaliza el email
    // 'Juan.Perez@Gmail.com' -> 'juanperez@gmail.com'
    // Quita puntos (Gmail los ignora) y convierte a minúsculas
    .normalizeEmail(),
  
  // === VALIDADOR DEL CAMPO 'message' ===
  body('message')
    .trim()
    .notEmpty().withMessage('El mensaje es requerido')
    .isLength({ min: 10, max: 1000 }).withMessage('El mensaje debe tener entre 10 y 1000 caracteres')
];

// === FUNCIÓN HELPER PARA VALIDAR ===
// async: palabra clave que permite usar 'await' dentro de la función
// async siempre devuelve una Promise (promesa)
const validate = async (req) => {
  // for...of: bucle que itera sobre cada elemento de un array
  // const validator of validadores: por cada validador en el array
  for (const validator of validadores) {
    // await: espera a que la promesa se resuelva antes de continuar
    // Sin await, el código continuaría sin esperar la validación
    // validator.run(req): ejecuta el validador sobre el request
    await validator.run(req);
  }
  
  // validationResult(req): obtiene los resultados de todas las validaciones
  // Devuelve un objeto con métodos isEmpty(), array(), etc.
  return validationResult(req);
};

// === FUNCIÓN HANDLER (PUNTO DE ENTRADA) ===
// export default: exporta esta función como exportación por defecto
// Vercel busca 'export default' y la usa como handler de la función serverless
// async function: función asíncrona que puede usar 'await'
// Parámetros:
//   req: objeto request (tiene body, method, headers, etc.)
//   res: objeto response (para enviar respuestas al cliente)
export default async function handler(req, res) {
  // === CONFIGURACIÓN DE CORS ===
  // CORS = Cross-Origin Resource Sharing
  // Permite que el frontend (diferente dominio) haga peticiones a esta API
  
  // res.setHeader(): configura un header HTTP en la respuesta
  
  // 'Access-Control-Allow-Credentials': permite enviar cookies
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // 'Access-Control-Allow-Origin': qué dominios pueden hacer peticiones
  // '*' = cualquier dominio (en producción mejor especificar el dominio exacto)
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // 'Access-Control-Allow-Methods': qué métodos HTTP están permitidos
  // GET, POST, PUT, DELETE, etc.
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  // 'Access-Control-Allow-Headers': qué headers puede enviar el cliente
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // === MANEJO DE PREFLIGHT REQUEST ===
  // Preflight: petición OPTIONS que envía el navegador antes de POST/PUT/DELETE
  // El navegador verifica si tiene permiso para hacer la petición real
  if (req.method === 'OPTIONS') {
    // res.status(200): configura el status HTTP a 200 (OK)
    // .end(): termina la respuesta sin enviar body
    res.status(200).end();
    return;  // Salgo de la función
  }

  // === VERIFICO QUE SEA MÉTODO POST ===
  // Solo permitir POST (no GET, PUT, DELETE, etc.)
  if (req.method !== 'POST') {
    // !== : diferente estricto (valor Y tipo deben ser diferentes)
    // return: salgo de la función inmediatamente
    // res.status(405): Method Not Allowed (método no permitido)
    // .json({ ... }): envío respuesta en formato JSON
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  // === VALIDACIÓN DE DATOS ===
  // await: espera a que la función validate() termine
  // const: variable que no se puede reasignar
  // errors: objeto con los resultados de las validaciones
  const errors = await validate(req);
  
  // errors.isEmpty(): devuelve true si NO hay errores, false si hay errores
  // ! : operador NOT (invierte el booleano)
  // !errors.isEmpty() = si HAY errores
  if (!errors.isEmpty()) {
    // res.status(400): Bad Request (solicitud incorrecta)
    // .json({ ... }): envío respuesta JSON con los errores
    return res.status(400).json({ 
      success: false,
      // errors.array(): convierte los errores a un array
      // .map(e => e.msg): transformo cada error para obtener solo el mensaje
      // map() crea un nuevo array aplicando una función a cada elemento
      // e => e.msg: arrow function que extrae la propiedad 'msg'
      errors: errors.array().map(e => e.msg) 
    });
  }

  // === DESTRUCTURING DEL BODY ===
  // Destructuring: extraigo propiedades de un objeto
  // const { name, email, message } = req.body
  // Es equivalente a:
  //   const name = req.body.name;
  //   const email = req.body.email;
  //   const message = req.body.message;
  const { name, email, message } = req.body;

  // === CONFIGURACIÓN DEL EMAIL ===
  // mailOptions: objeto con la configuración del email a enviar
  const mailOptions = {
    // from: quién envía el email (mi cuenta de Gmail)
    // Template literal: `texto ${variable} texto`
    // Equivalente a: '"Portfolio Contacto" <' + process.env.EMAIL_USER + '>'
    from: `"Portfolio Contacto" <${process.env.EMAIL_USER}>`,
    
    // to: a quién le llega el email (a mí mismo)
    // Uso mi email personal (no el del .env, podría ser diferente)
    to: 'marcostoledo96@gmail.com',
    
    // subject: asunto del email
    // 📬 : emoji de buzón (funciona en la mayoría de clientes de email)
    subject: `📬 Nuevo mensaje de contacto de ${name}`,
    // === HTML DEL EMAIL ===
    // html: contenido del email en formato HTML
    // Template literal multilínea: ` ... ` permite escribir HTML en múltiples líneas
    // ${variable}: inyecta variables JavaScript en el HTML
    html: `
      <!-- Contenedor principal del email con estilos inline -->
      <!-- Los estilos inline son necesarios porque muchos clientes de email no soportan <style> -->
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <!-- Título del email -->
        <h2 style="color: #0E1E40; border-bottom: 2px solid #00AEEF; padding-bottom: 10px;">
          Nuevo mensaje desde tu Portfolio
        </h2>
        
        <!-- Información del remitente -->
        <div style="margin: 20px 0;">
          <!-- ${name}: inyecta el nombre del usuario -->
          <p style="margin: 10px 0;"><strong>👤 Nombre:</strong> ${name}</p>
          
          <!-- ${email}: inyecta el email del usuario -->
          <!-- <a href="mailto:${email}">: crea un link clicable para responder -->
          <p style="margin: 10px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #00AEEF;">${email}</a></p>
        </div>
        
        <!-- Contenedor del mensaje con fondo gris -->
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>💬 Mensaje:</strong></p>
          
          <!-- ${message}: inyecta el mensaje del usuario -->
          <!-- white-space: pre-wrap: respeta saltos de línea y espacios -->
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        
        <!-- Línea separadora -->
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        
        <!-- Pie del email -->
        <p style="font-size: 12px; color: #666; text-align: center; margin: 10px 0;">
          Este mensaje fue enviado desde el formulario de contacto de tu portfolio web
        </p>
      </div>
    `,
    
    // replyTo: cuando responda el email, irá a esta dirección (el email del usuario)
    // Así puedo responder directamente desde Gmail
    replyTo: email
  };

  // === INTENTO ENVIAR EL EMAIL ===
  // try/catch: manejo de errores en JavaScript
  // try: intenta ejecutar este código
  // catch: si hay un error, ejecuta este bloque
  try {
    // await: espera a que transporter.sendMail() termine
    // transporter.sendMail(): envía el email usando Nodemailer
    // Devuelve una Promise que se resuelve cuando el email se envía exitosamente
    await transporter.sendMail(mailOptions);
    
    // === LOG DE ÉXITO ===
    // console.log: imprime en la consola del servidor (logs de Vercel)
    // Template literal: `texto ${variable}`
    // ✉️ : emoji de sobre
    console.log(`✉️ Email enviado exitosamente desde: ${email}`);
    
    // === RESPUESTA EXITOSA AL CLIENTE ===
    // res.status(200): 200 OK (exitoso)
    // .json({ ... }): envío respuesta JSON
    res.status(200).json({ 
      success: true, 
      message: '¡Mensaje enviado con éxito! Te responderé pronto.' 
    });
    
  } catch (error) {
    // === BLOQUE CATCH: SE EJECUTA SI HAY ERROR ===
    // error: objeto con información del error (message, stack, etc.)
    
    // console.error: imprime en consola con estilo de error (rojo)
    // ❌ : emoji de cruz roja
    console.error('❌ Error al enviar email:', error);
    
    // === RESPUESTA DE ERROR AL CLIENTE ===
    // res.status(500): 500 Internal Server Error
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar el mensaje. Por favor, intenta de nuevo.' 
    });
  }
}
