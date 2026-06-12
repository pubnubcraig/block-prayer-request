const GRAPH_API_BASE = 'https://graph.facebook.com/v25.0';

export type FacebookPostResult = {
  postId: string;
};

export async function publishToPage(
  message: string,
): Promise<FacebookPostResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    throw new Error(
      'FACEBOOK_PAGE_ID or FACEBOOK_PAGE_ACCESS_TOKEN not configured',
    );
  }

  const url = `${GRAPH_API_BASE}/${pageId}/feed`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      access_token: accessToken,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Facebook API error (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as { id?: string };
  if (!data.id) throw new Error('Facebook API returned no post ID');

  return { postId: data.id };
}

export async function publishWithImage(
  message: string,
  imageUrl: string,
): Promise<FacebookPostResult> {
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!pageId || !accessToken) {
    throw new Error(
      'FACEBOOK_PAGE_ID or FACEBOOK_PAGE_ACCESS_TOKEN not configured',
    );
  }

  // Use /photos endpoint for posts with images
  const url = `${GRAPH_API_BASE}/${pageId}/photos`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: imageUrl, // Public image URL
      message: message,
      access_token: accessToken,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Facebook photo API error (${response.status}): ${errorBody}`,
    );
  }

  const data = (await response.json()) as { id?: string; post_id?: string };
  const postId = data.post_id || data.id;
  if (!postId) throw new Error('Facebook API returned no post ID');

  return { postId };
}

export async function postComment(
  postId: string,
  message: string,
): Promise<void> {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN not configured');
  }

  const url = `${GRAPH_API_BASE}/${postId}/comments`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      access_token: accessToken,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Facebook comment API error (${response.status}): ${errorBody}`,
    );
  }
}
