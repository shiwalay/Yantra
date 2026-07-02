-- YouTube channel connections. One per user. Refresh token is stored
-- AES-256-GCM encrypted (see src/utils/encryption.ts). Channel stats +
-- analytics snapshot are refreshed at connect time and by the daily cron.
CREATE TABLE IF NOT EXISTS public.youtube_connections (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  channel_id TEXT,
  channel_title TEXT,
  thumbnail_url TEXT,
  subscriber_count BIGINT DEFAULT 0,
  view_count BIGINT DEFAULT 0,
  video_count INTEGER DEFAULT 0,
  refresh_token TEXT,          -- encrypted
  analytics JSONB,             -- { series:[{day,views,minutes,subs}], totals, avgRetention }
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ
);

ALTER TABLE public.youtube_connections ENABLE ROW LEVEL SECURITY;

-- Users manage only their own connection. The refresh_token column is never
-- selected by client code (server routes read it via the service role).
CREATE POLICY "Users manage their own YouTube connection" ON public.youtube_connections
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
