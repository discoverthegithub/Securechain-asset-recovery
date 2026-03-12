const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendAssetEmail(to, subject, text) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Or your verified sender from Resend
      to,
      subject,
      html: `<pre>${text}</pre>` // Use HTML for better formatting
    });
    console.log(`Email sent to ${to} with subject: ${subject}`);
  } catch (err) {
    console.error('Error sending email:', err);
    throw err;
  }
}

module.exports = sendAssetEmail;