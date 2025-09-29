const nodemailer = require('nodemailer')

function createTransport() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('SMTP_USER and SMTP_PASS must be set in environment')
  }
  const host = process.env.SMTP_HOST || 'smtp.gmail.com'
  const port = parseInt(process.env.SMTP_PORT || '465', 10)
  // If SMTP_SECURE not explicitly set, infer from port (465 = secure, 587 = STARTTLS)
  const secure = process.env.SMTP_SECURE
    ? process.env.SMTP_SECURE === 'true'
    : port === 465

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: secure ? undefined : { ciphers: 'SSLv3' },
  })

  return transporter
}

async function sendOtpEmail(to, code) {
  const transporter = createTransport()
  const from = process.env.MAIL_FROM || process.env.SMTP_USER
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Your Zypto verification code',
      text: `Your verification code is ${code}. It expires in 5 minutes.`,
      html: `<p>Your verification code is <strong>${code}</strong>.</p><p>It expires in 5 minutes.</p>`,
    })
    return info
  } catch (err) {
    // Log detailed error server-side, but throw a concise message upward
    console.error('Mailer error:', err)
    throw new Error('Email delivery failed. Please verify SMTP settings.')
  }
}

module.exports = { sendOtpEmail }


