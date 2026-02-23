// Función serverless de contacto — se activa con POST /api/contact y envía el mensaje por Gmail SMTP.
import nodemailer from 'nodemailer';
import { body, validationResult } from 'express-validator';

// Transporter reutilizable; las credenciales vienen de las variables de entorno de Vercel.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // configurar en Vercel Dashboard → Settings → Environment Variables
    pass: process.env.EMAIL_PASS  // debe ser un App Password de Google, no la contraseña de cuenta
  }
});

// Reglas de validación aplicadas antes de procesar cada request.
const validadores = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

  body('message')
    .trim()
    .notEmpty().withMessage('El mensaje es requerido')
    .isLength({ min: 10, max: 1000 }).withMessage('El mensaje debe tener entre 10 y 1000 caracteres')
];

// Ejecuta todos los validadores en serie y devuelve el resultado consolidado.
const validate = async (req) => {
  for (const validator of validadores) {
    await validator.run(req);
  }
  return validationResult(req);
};

// Handler principal — Vercel detecta el export default y lo expone en /api.
export default async function handler(req, res) {
  // Headers CORS para permitir que el frontend llame a esta API desde cualquier dominio.
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Respondo el preflight del navegador antes de que envíe el POST real.
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  // Valido los campos del body antes de armar el email.
  const errors = await validate(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(e => e.msg)
    });
  }

  const { name, email, message } = req.body;

  // Armo el email que recibiré en mi cuenta personal.
  const mailOptions = {
    from: `"Portfolio Contacto" <${process.env.EMAIL_USER}>`,
    to: 'marcostoledo96@gmail.com',
    subject: `📬 Nuevo mensaje de contacto de ${name}`,
    // Estilos inline: necesarios porque la mayoría de clientes de email ignoran hojas de estilo externas.
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #0E1E40; border-bottom: 2px solid #00AEEF; padding-bottom: 10px;">
          Nuevo mensaje desde tu Portfolio
        </h2>
        <div style="margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>👤 Nombre:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #00AEEF;">${email}</a></p>
        </div>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>💬 Mensaje:</strong></p>
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="font-size: 12px; color: #666; text-align: center; margin: 10px 0;">
          Este mensaje fue enviado desde el formulario de contacto de tu portfolio web
        </p>
      </div>
    `,
    replyTo: email // permite responder directamente al remitente desde Gmail
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✉️ Email enviado exitosamente desde: ${email}`);
    res.status(200).json({
      success: true,
      message: '¡Mensaje enviado con éxito! Te responderé pronto.'
    });
  } catch (error) {
    // El error queda visible en los Function Logs de Vercel Dashboard.
    console.error('❌ Error al enviar email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el mensaje. Por favor, intenta de nuevo.'
    });
  }
}
