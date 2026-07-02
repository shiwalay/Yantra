import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// OAuth (Google) callback — exchanges the returned code for a Supabase session
// (sets the auth cookie), then sends the user into the app.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("OAuth exchange error:", error.message);
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
