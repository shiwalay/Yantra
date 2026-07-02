import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { decrypt } from "@/utils/encryption";
import { syncFromRefreshToken } from "@/utils/youtube";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Daily cron (see vercel.json) — refreshes every connected channel's stats +
// analytics using its stored refresh token. Protected by CRON_SECRET (Vercel
// sends it as a Bearer token automatically when the env var is set).
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: rows } = await supabase
    .from("youtube_connections")
    .select("user_id, refresh_token")
    .not("refresh_token", "is", null);

  let synced = 0, failed = 0;
  for (const row of rows ?? []) {
    try {
      const rt = decrypt(row.refresh_token as string);
      const result = rt ? await syncFromRefreshToken(rt) : null;
      if (!result) { failed++; continue; }
      const { channel, analytics } = result;
      await supabase.from("youtube_connections").update({
        channel_id: channel.channelId,
        channel_title: channel.title,
        thumbnail_url: channel.thumbnail,
        subscriber_count: channel.subscriberCount,
        view_count: channel.viewCount,
        video_count: channel.videoCount,
        analytics,
        last_synced_at: new Date().toISOString(),
      }).eq("user_id", row.user_id);
      synced++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ synced, failed });
}
