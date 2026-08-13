import OpenAI from 'openai';
import { put } from '@vercel/blob';
import { getSceneForTopic, FALLBACK_SCENE } from './image-prompts';

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set');
  return new OpenAI({ apiKey });
}

export type ImageGenerationResult = {
  imageUrl: string;
  storyImageUrl: string;
};

function buildPrompt(scene: string): string {
  return `Photorealistic photograph, ${scene}, professional photography, warm natural lighting, cinematic depth of field, emotional and authentic, high quality. No text, no words, no letters, no cartoons, no illustrations, no anime, no watermarks.`;
}

async function generateAndUpload(
  client: OpenAI,
  prompt: string,
  size: '1024x1792' | '1792x1024' | '1024x1024',
  filename: string,
): Promise<string> {
  const response = await client.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size,
    quality: 'standard',
  });

  const imageUrl = response.data?.[0]?.url;
  if (!imageUrl) throw new Error('DALL-E 3 returned no image URL');

  // Download the image
  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) {
    throw new Error(`Failed to download generated image: ${imageResponse.status}`);
  }
  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

  // Upload to Vercel Blob
  const blob = await put(filename, imageBuffer, {
    access: 'public',
    contentType: 'image/png',
  });

  return blob.url;
}

export async function generateTopicImage(
  topic: string,
  category: string,
  theme: string,
): Promise<ImageGenerationResult> {
  const client = getClient();
  const scene = getSceneForTopic(topic);
  const prompt = buildPrompt(scene);
  const timestamp = Date.now();
  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  let imageUrl: string;
  try {
    imageUrl = await generateAndUpload(
      client,
      prompt,
      '1024x1792',
      `ig-posts/${slug}-${timestamp}-feed.png`,
    );
  } catch (err) {
    // Fallback to generic scene if content policy blocks the prompt
    console.warn(
      `[ig-post] DALL-E rejected prompt for "${topic}", using fallback scene:`,
      err,
    );
    const fallbackPrompt = buildPrompt(FALLBACK_SCENE);
    imageUrl = await generateAndUpload(
      client,
      fallbackPrompt,
      '1024x1792',
      `ig-posts/${slug}-${timestamp}-feed-fallback.png`,
    );
  }

  let storyImageUrl: string;
  try {
    storyImageUrl = await generateAndUpload(
      client,
      prompt,
      '1024x1792',
      `ig-posts/${slug}-${timestamp}-story.png`,
    );
  } catch (err) {
    console.warn(
      `[ig-post] DALL-E rejected story prompt for "${topic}", using fallback:`,
      err,
    );
    const fallbackPrompt = buildPrompt(FALLBACK_SCENE);
    storyImageUrl = await generateAndUpload(
      client,
      fallbackPrompt,
      '1024x1792',
      `ig-posts/${slug}-${timestamp}-story-fallback.png`,
    );
  }

  return { imageUrl, storyImageUrl };
}
