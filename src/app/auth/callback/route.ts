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
      // First-time users (incl. Google signups) go through onboarding once.
      let dest = next;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("onboarded")
          .eq("id", user.id)
          .single();
        if (profile && profile.onboarded === false) dest = "/onboarding";
      }
      return NextResponse.redirect(`${origin}${dest}`);
    }
    console.error("OAuth exchange error:", error.message);
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
