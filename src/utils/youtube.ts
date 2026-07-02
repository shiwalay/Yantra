// YouTube integration service layer (server-only). Handles the Google OAuth
// token dance and the Data + Analytics API calls. Never import from client code.
import "server-only";

const CLIENT_ID =
  process.env.GOOGLE_CLIENT_ID ||
  "645164139755-7a7kijrp36r4nde5tb8d4o6n4ke45vsh.apps.googleusercontent.com";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

export const YOUTUBE_SCOPES = [
  "https://www.googleapis.com/auth/youtube.readonly",
  "https://www.googleapis.com/auth/yt-analytics.readonly",
];

export function googleAuthUrl(redirectUri: string, state: string): string {
  const p = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: YOUTUBE_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${p.toString()}`;
}

async function tokenRequest(body: Record<string, string>) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });
  return res.json();
}

export async function exchangeCode(code: string, redirectUri: string) {
  return tokenRequest({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  }) as Promise<{ access_token?: string; refresh_token?: string; expires_in?: number; error?: string }>;
}

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const j = await tokenRequest({
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "refresh_token",
  });
  return j.access_token ?? null;
}

export type ChannelStats = {
  channelId: string;
  title: string;
  thumbnail: string | null;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
};

export async function fetchChannel(accessToken: string): Promise<ChannelStats | null> {
  const res = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const j = await res.json();
  const c = j.items?.[0];
  if (!c) return null;
  return {
    channelId: c.id,
    title: c.snippet?.title ?? "",
    thumbnail: c.snippet?.thumbnails?.default?.url ?? null,
    subscriberCount: Number(c.statistics?.subscriberCount ?? 0),
    viewCount: Number(c.statistics?.viewCount ?? 0),
    videoCount: Number(c.statistics?.videoCount ?? 0),
  };
}

export type Analytics = {
  series: { day: string; views: number; minutes: number; subs: number }[];
  totals: { views: number; minutes: number; subs: number };
  avgRetention: number;
};

export async function fetchAnalytics(accessToken: string, channelId: string): Promise<Analytics | null> {
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  const end = new Date();
  const start = new Date(end.getTime() - 27 * 24 * 60 * 60 * 1000);
  const q = new URLSearchParams({
    ids: `channel==${channelId}`,
    startDate: fmt(start),
    endDate: fmt(end),
    metrics: "views,estimatedMinutesWatched,subscribersGained,averageViewPercentage",
    dimensions: "day",
    sort: "day",
  });
  const res = await fetch(`https://youtubeanalytics.googleapis.com/v2/reports?${q.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  const j = await res.json();
  const rows: number[][] = j.rows ?? [];
  const series = rows.map((r) => ({ day: String(r[0]), views: Number(r[1]), minutes: Number(r[2]), subs: Number(r[3]) }));
  const totals = series.reduce(
    (a, r) => ({ views: a.views + r.views, minutes: a.minutes + r.minutes, subs: a.subs + r.subs }),
    { views: 0, minutes: 0, subs: 0 }
  );
  const avgRetention = rows.length ? Math.round(rows.reduce((a, r) => a + Number(r[4] ?? 0), 0) / rows.length) : 0;
  return { series, totals, avgRetention };
}

// Full refresh from a stored refresh token → the DB update payload.
export async function syncFromRefreshToken(refreshToken: string) {
  const accessToken = await refreshAccessToken(refreshToken);
  if (!accessToken) return null;
  const channel = await fetchChannel(accessToken);
  if (!channel) return null;
  const analytics = await fetchAnalytics(accessToken, channel.channelId);
  return { accessToken, channel, analytics };
}
