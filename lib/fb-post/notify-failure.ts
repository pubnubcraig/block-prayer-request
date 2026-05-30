import { sendEmail } from '@/lib/email';

export async function notifyPostFailure(
  error: string,
  context: Record<string, unknown>,
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn(
      '[fb-post] ADMIN_EMAIL not set — skipping failure notification',
    );
    return;
  }

  await sendEmail({
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
