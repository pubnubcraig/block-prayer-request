import { sendEmail } from '@/lib/email';

export async function notifyInstagramFailure(
  error: string,
  context: Record<string, unknown>,
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn(
      '[ig-post] ADMIN_EMAIL not set — skipping failure notification',
    );
    return;
  }

  await sendEmail({
    to: adminEmail,
    subject: 'GoFish: Instagram Post Failed',
    html: `
      <h2>Instagram Post Failed</h2>
      <p><strong>Error:</strong> ${error}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <p><strong>Details:</strong></p>
      <pre>${JSON.stringify(context, null, 2)}</pre>
      <p>Please check the Vercel function logs for more details.</p>
    `,
  });
}
