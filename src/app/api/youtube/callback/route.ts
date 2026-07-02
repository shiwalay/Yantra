import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { exchangeCode, fetchChannel, fetchAnalytics } from "@/utils/youtube";
import { encrypt } from "@/utils/encryption";

// Handles the Google redirect: exchanges the code, pulls channel + analytics,
// stores an (encrypted) refresh token + snapshot, marks the user onboarded.
export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("yt_oauth_state")?.value;

  const fail = (reason: string) =>
    NextResponse.redirect(`${origin}/dashboard?youtube=error&reason=${reason}`);

  if (!code || !state || state !== expectedState) return fail("state");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(`${origin}/login`);

  const tokens = await exchangeCode(code, `${origin}/api/youtube/callback`);
  if (!tokens.access_token) {
    console.error("YouTube token exchange failed:", JSON.stringify(tokens));
    return fail(tokens.error ? `token_${tokens.error}` : "token");
  }

  const channel = await fetchChannel(tokens.access_token);
  if (!channel) return fail("channel");
  const analytics = await fetchAnalytics(tokens.access_token, channel.channelId);

  await supabase.from("user_profiles").update({ onboarded: true }).eq("id", user.id);
  await supabase.from("youtube_connections").upsert({
    user_id: user.id,
    channel_id: channel.channelId,
    channel_title: channel.title,
    thumbnail_url: channel.thumbnail,
    subscriber_count: channel.subscriberCount,
    view_count: channel.viewCount,
    video_count: channel.videoCount,
    // Only overwrite the refresh token when Google returns a new one.
    ...(tokens.refresh_token ? { refresh_token: encrypt(tokens.refresh_token) } : {}),
    analytics,
    last_synced_at: new Date().toISOString(),
  });

  const res = NextResponse.redirect(`${origin}/dashboard?youtube=connected`);
  res.cookies.delete("yt_oauth_state");
  return res;
}
