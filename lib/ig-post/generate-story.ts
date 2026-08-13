// Story image generation with text overlay.
// Takes the DALL-E generated story background (1024x1792) and overlays:
// - Hook text at the top
// - Scripture quote in the middle
// - CTA with topic link at the bottom
//
// Uses sharp for server-side image compositing with SVG text overlay.

import sharp from 'sharp';
import { put } from '@vercel/blob';

export type StoryInput = {
  storyImageUrl: string;
  hookText: string;
  scriptureText: string;
  scriptureReference: string;
  topicSlug: string;
};

export type StoryResult = {
  storyUrl: string;
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine = currentLine ? `${currentLine} ${word}` : word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());
  return lines;
}

function buildOverlaySvg(input: StoryInput): string {
  const width = 1024;
  const height = 1792;

  // Hook text at top
  const hookLines = wrapText(input.hookText, 30);
  const hookSvg = hookLines
    .map(
      (line, i) =>
        `<text x="${width / 2}" y="${220 + i * 55}" font-family="Georgia, serif" font-size="44" font-weight="bold" fill="white" text-anchor="middle" filter="url(#shadow)">${escapeXml(line)}</text>`,
    )
    .join('\n');

  // Scripture in the middle
  const verseLines = wrapText(`"${input.scriptureText}"`, 35);
  const verseStartY = height / 2 - (verseLines.length * 48) / 2;
  const verseSvg = verseLines
    .map(
      (line, i) =>
        `<text x="${width / 2}" y="${verseStartY + i * 48}" font-family="Georgia, serif" font-size="36" font-style="italic" fill="white" text-anchor="middle" filter="url(#shadow)">${escapeXml(line)}</text>`,
    )
    .join('\n');
  const refY = verseStartY + verseLines.length * 48 + 30;
  const refSvg = `<text x="${width / 2}" y="${refY}" font-family="Georgia, serif" font-size="30" fill="#e0e0e0" text-anchor="middle" filter="url(#shadow)">— ${escapeXml(input.scriptureReference)} (ASV)</text>`;

  // CTA at bottom
  const ctaY = height - 250;
  const ctaSvg = `
    <rect x="${width / 2 - 250}" y="${ctaY}" width="500" height="60" rx="30" fill="rgba(255,255,255,0.25)" />
    <text x="${width / 2}" y="${ctaY + 40}" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">🙏 Pray about this topic</text>
    <text x="${width / 2}" y="${ctaY + 90}" font-family="Arial, sans-serif" font-size="24" fill="#e0e0e0" text-anchor="middle">gofish.life/prayer-topics/${escapeXml(input.topicSlug)}</text>
  `;

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.7)" />
        </filter>
      </defs>
      ${hookSvg}
      ${verseSvg}
      ${refSvg}
      ${ctaSvg}
    </svg>
  `;
}

export async function generateStoryImage(
  input: StoryInput,
): Promise<StoryResult> {
  // Download the background image
  const bgResponse = await fetch(input.storyImageUrl);
  if (!bgResponse.ok) {
    throw new Error(
      `Failed to download story background: ${bgResponse.status}`,
    );
  }
  const bgBuffer = Buffer.from(await bgResponse.arrayBuffer());

  // Create text overlay SVG
  const overlaySvg = buildOverlaySvg(input);
  const overlayBuffer = Buffer.from(overlaySvg);

  // Composite the overlay onto the background
  const result = await sharp(bgBuffer)
    .resize(1024, 1792, { fit: 'cover' })
    .composite([{ input: overlayBuffer, top: 0, left: 0 }])
    .png({ quality: 90 })
    .toBuffer();

  // Upload to Vercel Blob
  const timestamp = Date.now();
  const blob = await put(
    `ig-stories/story-${input.topicSlug}-${timestamp}.png`,
    result,
    { access: 'public', contentType: 'image/png' },
  );

  return { storyUrl: blob.url };
}
