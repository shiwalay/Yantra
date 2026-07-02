import { NextResponse } from "next/server";

// TEMPORARY diagnostic — reports whether YouTube env config is present in this
// deployment (booleans/lengths only, never the secret values). Protected by
// CRON_SECRET. Remove once the integration is confirmed working.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const secret = process.env.GOOGLE_CLIENT_SECRET || "";
  const id = process.env.GOOGLE_CLIENT_ID || "";
  return NextResponse.json({
    hasClientSecret: secret.length > 0,
    clientSecretLen: secret.length,
    clientSecretTrimmedMatches: secret === secret.trim(),
    clientIdSet: id.length > 0,
    clientIdPrefix: id.slice(0, 14),
    hasCronSecret: !!process.env.CRON_SECRET,
  });
}
