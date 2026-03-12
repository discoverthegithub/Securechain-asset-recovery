const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  return transporter;
}

async function sendAssetEmail(to, subject, text) {
  try {
    await getTransporter().sendMail({
      from: `Secure Chain <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
    console.log(`Email sent to ${to} with subject: ${subject}`);
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
}

module.exports = sendAssetEmail; 