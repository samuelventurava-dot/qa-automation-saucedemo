import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import AdmZip from 'adm-zip';

dotenv.config();

async function sendReport() {
  console.log('\n=================================================');
  console.log(' PREPARANDO REPORTE COMPLETO PARA ENVÍO');
  console.log('=================================================\n');

  const reportFolder = path.join(__dirname, '../playwright-report');
  const zipPath = path.join(__dirname, '../Playwright_Report_Saucedemo.zip');

  // 1. Comprimir la carpeta completa (HTML + Imágenes + Trazas)
  if (fs.existsSync(reportFolder)) {
    console.log('Comprimiendo el reporte y sus dependencias visuales...');
    const zip = new AdmZip();
    zip.addLocalFolder(reportFolder);
    zip.writeZip(zipPath);
  } else {
    console.warn('No se encontró la carpeta playwright-report. Ejecuta las pruebas primero.');
    return;
  }

  // 2. Configurar el transporter (Conexión SMTP)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 3. Configurar el correo instruyendo al evaluador
  const mailOptions = {
    from: `"QA Automation Framework" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER,
    subject: 'Resultados de Ejecución E2E - Saucedemo',
    html: `
      <h2>Reporte de Pruebas Automatizadas</h2>
      <p>Hola,</p>
      <p>La ejecución de la suite de pruebas E2E en Saucedemo ha finalizado.</p>
      <p>Debido a que el reporte incluye imágenes de evidencias y trazas interactivas, <b>he adjuntado el reporte completo en un archivo .zip</b>.</p>
      <h3>Instrucciones:</h3>
      <ol>
        <li>Descarga el archivo adjunto.</li>
        <li>Extrae el contenido en tu computadora.</li>
        <li>Abre el archivo <b>index.html</b> en cualquier navegador para ver las gráficas y las capturas en cada paso.</li>
      </ol>
      <br>
      <p>Saludos,<br><b>Equipo de QA Automation</b></p>
    `,
    attachments: [
      { filename: 'Playwright_Report.zip', path: zipPath }
    ],
  };

  // 4. Enviar el correo
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Correo enviado exitosamente a: ${info.accepted}`);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
}

sendReport();