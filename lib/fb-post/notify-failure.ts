import { Resend } from 'resend';

export async function notifyPostFailure(
  error: string,
  context: Record<string, unknown>,
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!resendKey || !adminEmail) {
    console.warn(
      '[fb-post] RESEND_API_KEY or ADMIN_EMAIL not set — skipping failure notification',
    );
    return;
  }

  const resend = new Resend(resendKey);

  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'GoFish <noreply@gofish.app>',
    to: adminEmail,
    subject: 'GoFish: Daily Facebook Post Failed',
    html: `
      <h2>Daily Facebook Post Failed</h2>
      <p><strong>Error:</strong> ${error}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Details:</strong></p>
      <pre>${JSON.stringify(context, null, 2)}</pre>
      <p>Please check the Vercel function logs for more details.</p>
    `,
  });
}
