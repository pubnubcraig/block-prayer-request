const GRAPH_API_BASE = 'https://graph.facebook.com/v25.0';

export type InstagramPostResult = {
  mediaId: string;
  postId: string;
};

export type MediaInsights = {
  reach: number;
  impressions: number;
  saves: number;
  shares: number;
  comments: number;
  likes: number;
  profileVisits: number;
  websiteClicks: number;
};

function getConfig() {
  const igUserId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

  if (!igUserId || !accessToken) {
    throw new Error(
      'INSTAGRAM_BUSINESS_ACCOUNT_ID or FACEBOOK_PAGE_ACCESS_TOKEN not configured',
    );
  }

  return { igUserId, accessToken };
}

async function waitForContainer(
  containerId: string,
  accessToken: string,
  timeoutMs = 60_000,
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const url = `${GRAPH_API_BASE}/${containerId}?fields=status_code&access_token=${accessToken}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `Container status check failed (${res.status}): ${await res.text()}`,
      );
    }
    const data = (await res.json()) as { status_code?: string };
    if (data.status_code === 'FINISHED') return;
    if (data.status_code === 'ERROR') {
      throw new Error('Instagram media container processing failed');
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  throw new Error('Instagram media container processing timed out');
}

export async function publishImagePost(
  imageUrl: string,
  caption: string,
): Promise<InstagramPostResult> {
  const { igUserId, accessToken } = getConfig();

  // Step 1: Create media container
  const containerRes = await fetch(`${GRAPH_API_BASE}/${igUserId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      caption,
      access_token: accessToken,
    }),
  });

  if (!containerRes.ok) {
    throw new Error(
      `Instagram container creation failed (${containerRes.status}): ${await containerRes.text()}`,
    );
  }

  const containerData = (await containerRes.json()) as { id?: string };
  if (!containerData.id) throw new Error('No container ID returned');

  // Step 2: Wait for processing
  await waitForContainer(containerData.id, accessToken);

  // Step 3: Publish
  const publishRes = await fetch(
    `${GRAPH_API_BASE}/${igUserId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: accessToken,
      }),
    },
  );

  if (!publishRes.ok) {
    throw new Error(
      `Instagram publish failed (${publishRes.status}): ${await publishRes.text()}`,
    );
  }

  const publishData = (await publishRes.json()) as { id?: string };
  if (!publishData.id) throw new Error('No post ID returned from publish');

  return { mediaId: containerData.id, postId: publishData.id };
}

export async function publishStory(
  imageUrl: string,
): Promise<InstagramPostResult> {
  const { igUserId, accessToken } = getConfig();

  const containerRes = await fetch(`${GRAPH_API_BASE}/${igUserId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_url: imageUrl,
      media_type: 'STORIES',
      access_token: accessToken,
    }),
  });

  if (!containerRes.ok) {
    throw new Error(
      `Instagram story container failed (${containerRes.status}): ${await containerRes.text()}`,
    );
  }

  const containerData = (await containerRes.json()) as { id?: string };
  if (!containerData.id) throw new Error('No story container ID returned');

  await waitForContainer(containerData.id, accessToken);

  const publishRes = await fetch(
    `${GRAPH_API_BASE}/${igUserId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: accessToken,
      }),
    },
  );

  if (!publishRes.ok) {
    throw new Error(
      `Instagram story publish failed (${publishRes.status}): ${await publishRes.text()}`,
    );
  }

  const publishData = (await publishRes.json()) as { id?: string };
  if (!publishData.id) throw new Error('No story post ID returned');

  return { mediaId: containerData.id, postId: publishData.id };
}

export async function publishReel(
  videoUrl: string,
  caption: string,
  coverUrl?: string,
): Promise<InstagramPostResult> {
  const { igUserId, accessToken } = getConfig();

  const body: Record<string, string> = {
    video_url: videoUrl,
    caption,
    media_type: 'REELS',
    access_token: accessToken,
  };
  if (coverUrl) body.cover_url = coverUrl;

  const containerRes = await fetch(`${GRAPH_API_BASE}/${igUserId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!containerRes.ok) {
    throw new Error(
      `Instagram reel container failed (${containerRes.status}): ${await containerRes.text()}`,
    );
  }

  const containerData = (await containerRes.json()) as { id?: string };
  if (!containerData.id) throw new Error('No reel container ID returned');

  // Reels can take longer to process
  await waitForContainer(containerData.id, accessToken, 120_000);

  const publishRes = await fetch(
    `${GRAPH_API_BASE}/${igUserId}/media_publish`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: accessToken,
      }),
    },
  );

  if (!publishRes.ok) {
    throw new Error(
      `Instagram reel publish failed (${publishRes.status}): ${await publishRes.text()}`,
    );
  }

  const publishData = (await publishRes.json()) as { id?: string };
  if (!publishData.id) throw new Error('No reel post ID returned');

  return { mediaId: containerData.id, postId: publishData.id };
}

export async function postFirstComment(
  mediaId: string,
  message: string,
): Promise<void> {
  const { accessToken } = getConfig();

  const res = await fetch(`${GRAPH_API_BASE}/${mediaId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, access_token: accessToken }),
  });

  if (!res.ok) {
    throw new Error(
      `Instagram comment failed (${res.status}): ${await res.text()}`,
    );
  }
}

export async function getMediaInsights(
  mediaId: string,
): Promise<MediaInsights> {
  const { accessToken } = getConfig();

  const metrics = 'reach,impressions,saved,shares,comments,likes';
  const url = `${GRAPH_API_BASE}/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Instagram insights failed (${res.status}): ${await res.text()}`,
    );
  }

  const data = (await res.json()) as {
    data?: Array<{ name: string; values: Array<{ value: number }> }>;
  };

  const metrics_map: Record<string, number> = {};
  for (const metric of data.data ?? []) {
    metrics_map[metric.name] = metric.values?.[0]?.value ?? 0;
  }

  return {
    reach: metrics_map['reach'] ?? 0,
    impressions: metrics_map['impressions'] ?? 0,
    saves: metrics_map['saved'] ?? 0,
    shares: metrics_map['shares'] ?? 0,
    comments: metrics_map['comments'] ?? 0,
    likes: metrics_map['likes'] ?? 0,
    profileVisits: 0,
    websiteClicks: 0,
  };
}
