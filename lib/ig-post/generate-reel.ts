// Reel generation using Creatomate API.
// Creates a 15-30 second video from a static image with slow zoom (Ken Burns effect),
// background music, and optional scripture text overlay.

import { put } from '@vercel/blob';

const CREATOMATE_API_BASE = 'https://api.creatomate.com/v1';

export type ReelInput = {
  imageUrl: string;
  musicUrl: string;
  scriptureText?: string;
  scriptureReference?: string;
  durationSeconds?: number;
};

export type ReelResult = {
  videoUrl: string;
  renderId: string;
};

function getApiKey(): string {
  const key = process.env.CREATOMATE_API_KEY;
  if (!key) throw new Error('CREATOMATE_API_KEY is not set');
  return key;
}

function buildTemplate(input: ReelInput): object {
  const duration = input.durationSeconds ?? 20;

  const elements: object[] = [
    // Background image with slow zoom
    {
      type: 'image',
      source: input.imageUrl,
      duration,
      animations: [
        {
          type: 'scale',
          start_scale: '100%',
          end_scale: '115%',
          duration,
          easing: 'linear',
        },
      ],
    },
  ];

  // Optional scripture text overlay
  if (input.scriptureText && input.scriptureReference) {
    elements.push({
      type: 'text',
      text: `"${input.scriptureText}"\n— ${input.scriptureReference} (ASV)`,
      y: '70%',
      width: '80%',
      x: '50%',
      x_alignment: '50%',
      y_alignment: '50%',
      font_family: 'Georgia',
      font_size: '3.5 vmin',
      font_weight: 400,
      font_style: 'italic',
      color: '#ffffff',
      text_alignment: 'center',
      shadow_color: 'rgba(0,0,0,0.6)',
      shadow_blur: '4',
      background_color: 'rgba(0,0,0,0.3)',
      background_border_radius: '8',
      padding: '4%',
      duration,
      animations: [
        {
          type: 'fade',
          fade: 'in',
          duration: 2,
        },
      ],
    });
  }

  // Background music
  if (input.musicUrl) {
    elements.push({
      type: 'audio',
      source: input.musicUrl,
      duration,
      audio_fade_out: 3,
    });
  }

  return {
    output_format: 'mp4',
    width: 1080,
    height: 1920,
    duration,
    elements,
  };
}

async function pollRenderStatus(
  renderId: string,
  apiKey: string,
  timeoutMs = 120_000,
): Promise<string> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${CREATOMATE_API_BASE}/renders/${renderId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!res.ok) {
      throw new Error(
        `Creatomate status check failed (${res.status}): ${await res.text()}`,
      );
    }

    const data = (await res.json()) as {
      status?: string;
      url?: string;
      error_message?: string;
    };

    if (data.status === 'succeeded' && data.url) {
      return data.url;
    }
    if (data.status === 'failed') {
      throw new Error(
        `Creatomate render failed: ${data.error_message ?? 'Unknown error'}`,
      );
    }

    await new Promise((r) => setTimeout(r, 3000));
  }

  throw new Error('Creatomate render timed out');
}

export async function generateReel(input: ReelInput): Promise<ReelResult> {
  const apiKey = getApiKey();
  const template = buildTemplate(input);

  // Start render
  const res = await fetch(`${CREATOMATE_API_BASE}/renders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(template),
  });

  if (!res.ok) {
    throw new Error(
      `Creatomate render start failed (${res.status}): ${await res.text()}`,
    );
  }

  const renderData = (await res.json()) as
    | Array<{ id?: string }>
    | { id?: string };
  const render = Array.isArray(renderData) ? renderData[0] : renderData;

  if (!render?.id) {
    throw new Error('Creatomate returned no render ID');
  }

  // Poll for completion
  const videoSourceUrl = await pollRenderStatus(render.id, apiKey);

  // Download and upload to Vercel Blob
  const videoResponse = await fetch(videoSourceUrl);
  if (!videoResponse.ok) {
    throw new Error(`Failed to download rendered video: ${videoResponse.status}`);
  }
  const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

  const timestamp = Date.now();
  const blob = await put(`ig-reels/reel-${timestamp}.mp4`, videoBuffer, {
    access: 'public',
    contentType: 'video/mp4',
  });

  return {
    videoUrl: blob.url,
    renderId: render.id,
  };
}
