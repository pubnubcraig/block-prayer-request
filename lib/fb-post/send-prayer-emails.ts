import { getDb } from '@/lib/db';
import { users, userProfiles, facebookPostLog } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '@/lib/email';

interface TopicInfo {
  topic: string;
  category: string;
  verseReference: string;
  verseText: string;
}

export async function sendMorningPrayerEmails(
  logId: string,
  topic: TopicInfo,
  postContent: string,
): Promise<void> {
  const db = getDb();
  if (!db) {
    console.error('[prayer-emails] Database unavailable');
    return;
  }

  // Idempotency — skip if already sent for this post
  const [logRow] = await db
    .select({ emailNotificationSentAt: facebookPostLog.emailNotificationSentAt })
    .from(facebookPostLog)
    .where(eq(facebookPostLog.id, logId))
    .limit(1);

  if (logRow?.emailNotificationSentAt) {
    console.log('[prayer-emails] Already sent for this post, skipping');
    return;
  }

  // Fetch all opted-in users with verified emails
  const subscribers = await db
    .select({ email: users.email, name: users.name })
    .from(userProfiles)
    .innerJoin(users, eq(userProfiles.userId, users.id))
    .where(eq(userProfiles.dailyPrayerEmailOptIn, true));

  // Mark as sent before sending so a retry doesn't double-send
  await db
    .update(facebookPostLog)
    .set({ emailNotificationSentAt: new Date() })
    .where(eq(facebookPostLog.id, logId));

  if (subscribers.length === 0) {
    console.log('[prayer-emails] No subscribers opted in');
    return;
  }

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://gofish.life')}`;
  const subject = `Today's Morning Prayer — ${topic.verseReference}`;
  const html = buildPrayerEmailHtml({ date, topic, fbShareUrl, postContent });

  let sentCount = 0;
  for (const subscriber of subscribers) {
    try {
      await sendEmail({ to: subscriber.email, subject, html });
      sentCount++;
    } catch (err) {
      console.error(
        `[prayer-emails] Failed to send to ${subscriber.email}:`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  console.log(
    `[prayer-emails] Sent to ${sentCount}/${subscribers.length} subscribers`,
  );
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPrayerEmailHtml(opts: {
  date: string;
  topic: TopicInfo;
  postContent: string;
  fbShareUrl: string;
}): string {
  const { date, topic, postContent, fbShareUrl } = opts;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Today's Morning Prayer</title>
</head>
<body style="margin:0;padding:0;background-color:#0D2B45;font-family:Georgia,'Times New Roman',serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D2B45;padding:24px 16px">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#112E4A;border-radius:8px;overflow:hidden">

        <!-- Header -->
        <tr>
          <td style="padding:28px 32px 20px;text-align:center;border-bottom:1px solid rgba(189,231,242,0.1)">
            <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#16A3A6">GoFish.Life</p>
            <h1 style="margin:0;font-family:Georgia,serif;font-size:24px;font-weight:700;color:#E6E9EC;letter-spacing:-0.01em">Morning Prayer</h1>
            <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:13px;color:rgba(189,231,242,0.65)">${esc(date)}</p>
          </td>
        </tr>

        <!-- Topic + Verse -->
        <tr>
          <td style="padding:24px 32px 0">
            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#16A3A6">${esc(topic.topic)}</p>
            <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:12px;color:rgba(189,231,242,0.6)">${esc(topic.verseReference)}</p>
            <blockquote style="margin:0;padding:12px 16px;background:rgba(22,163,166,0.1);border-left:3px solid #16A3A6;border-radius:0 4px 4px 0">
              <p style="margin:0;font-family:Georgia,serif;font-style:italic;font-size:15px;line-height:1.7;color:#BDE7F2">&ldquo;${esc(topic.verseText)}&rdquo;</p>
            </blockquote>
          </td>
        </tr>

        <!-- Prayer Content -->
        <tr>
          <td style="padding:24px 32px">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.8;color:#C8D8E8;white-space:pre-wrap">${esc(postContent)}</p>
          </td>
        </tr>

        <!-- Share Buttons -->
        <tr>
          <td style="padding:0 32px 28px">
            <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:13px;color:rgba(189,231,242,0.65);text-align:center">Share today's prayer to encourage someone</p>
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-right:6px">
                  <a href="${fbShareUrl}" target="_blank" rel="noopener noreferrer"
                    style="display:block;background-color:#3BA7E1;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:13px 16px;border-radius:6px;text-align:center">
                    Share on Facebook
                  </a>
                </td>
                <td style="padding-left:6px">
                  <a href="https://www.instagram.com/gofish.life" target="_blank" rel="noopener noreferrer"
                    style="display:block;background-color:#FF6B4A;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:13px 16px;border-radius:6px;text-align:center">
                    Follow on Instagram
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px 28px;border-top:1px solid rgba(189,231,242,0.08);text-align:center">
            <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;color:rgba(189,231,242,0.4)">You&rsquo;re receiving this because you opted in at GoFish.Life.</p>
            <a href="https://gofish.life/profile" style="font-family:Arial,sans-serif;font-size:11px;color:#16A3A6;text-decoration:underline">Manage email preferences</a>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
