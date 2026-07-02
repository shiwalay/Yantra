import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { googleAuthUrl } from "@/utils/youtube";

// Kicks off the YouTube OAuth flow (our own, with offline access for refresh
// tokens). Requires a logged-in session.
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const state = crypto.randomUUID();
  const redirectUri = `${origin}/api/youtube/callback`;
  const res = NextResponse.redirect(googleAuthUrl(redirectUri, state));
  // CSRF: verify this nonce comes back in the callback.
  res.cookies.set("yt_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
