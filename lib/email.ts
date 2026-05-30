import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.purelymail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'support@gofish.life',
    pass: process.env.SMTP_PASS || '',
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  from,
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  await transporter.sendMail({
    from: from || process.env.EMAIL_FROM || 'GoFish <support@gofish.life>',
    to,
    subject,
    html,
  });
}
