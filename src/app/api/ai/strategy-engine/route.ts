import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { createClient } from "@/utils/supabase/server";

// AI Strategy Engine — turns the 15-step consultation answers into a
// personalized 6-month YouTube + personal-brand growth roadmap, then persists
// both the answers and the report to strategy_profiles. Gemini is primary,
// OpenAI is the fallback, and a deterministic scaffold is the last resort so a
// creator always leaves with a usable plan.

export const maxDuration = 60;

function hasKey(v?: string) {
  return !!v && !/^(your_|xxx|placeholder|sk-proj-xxx)/i.test(v.trim());
}

type Answers = Record<string, unknown>;

function buildPrompt(a: Answers, channel: string) {
  return `You are an elite YouTube + personal-brand growth strategist running a premium consultation. A creator has completed a deep intake. Produce a personalized, specific, ambitious yet realistic 6-month growth strategy. Use THEIR words, niche, strengths and constraints — never generic filler.

${channel}

Creator intake (JSON):
${JSON.stringify(a).slice(0, 6000)}

Return ONLY valid JSON with EXACTLY this shape (fill every field with concrete, personalized content):
{
  "executiveSummary": { "currentPosition": "", "growthPotential": "", "keyChallenges": ["","",""], "competitiveAdvantages": ["","",""] },
  "brand": { "mission": "", "vision": "", "uvp": "", "personality": ["","",""], "voice": "", "contentPromise": "", "taglines": ["","",""] },
  "audience": { "primary": "", "secondary": "", "painPoints": ["","",""], "desires": ["","",""], "viewingHabits": "", "platformBehaviour": "" },
  "content": { "pillars": [{"name":"","description":""}], "seriesIdeas": ["",""], "longForm": "", "shorts": "", "storytellingFramework": "", "contentMix": "", "evergreenVsTrending": "" },
  "calendar": [ { "month": 1, "theme": "", "goal": "", "uploads": [{"week":1,"topic":"","format":"","kpi":""}] } ],
  "seo": { "keywordClusters": ["",""], "titleFormula": "", "thumbnailStrategy": "", "descriptionTemplate": "", "hashtags": ["",""], "playlists": ["",""] },
  "distribution": { "instagram": "", "linkedin": "", "newsletter": "", "podcast": "", "whatsapp": "", "community": "" },
  "personalBrand": { "authority": "", "networking": "", "speaking": "", "bookIdeas": ["",""], "mediaOutreach": "" },
  "brandCollab": { "idealCategories": ["",""], "readiness": "", "mediaKit": ["",""], "sponsorshipPositioning": "" },
  "monetization": [ { "month": 1, "focus": "", "streams": ["",""] } ],
  "productivity": { "weeklyWorkflow": ["",""], "pipeline": { "research": "", "writing": "", "recording": "", "editing": "", "publishing": "" } },
  "kpis": [ { "metric": "Subscribers", "current": "", "sixMonthTarget": "" } ]
}

Requirements:
- "content.pillars": 5 to 8 pillars.
- "calendar": exactly 6 entries (month 1-6), each with 4 weekly uploads tied to the theme.
- "monetization": 6 entries (month 1-6), sequencing revenue from easiest to hardest for their stage.
- "kpis": include Subscribers, Views, Watch Time, CTR, Retention, Revenue, Brand Deals with honest 6-month targets scaled to their current channel size.
- Every string must be specific to this creator's mission, niche and goals.`;
}

function fallbackReport(a: Answers) {
  const mission = String(a.mission || "your storytelling mission");
  const pillarSeeds = Array.isArray(a.storyTypes) && a.storyTypes.length ? (a.storyTypes as string[]) : ["Signature stories", "Teaching", "Behind-the-scenes", "Community", "Trends"];
  const months = [1, 2, 3, 4, 5, 6];
  return {
    executiveSummary: {
      currentPosition: "Early-stage creator with a clear mission and room to define a repeatable content system.",
      growthPotential: `Strong — ${mission} is a durable, emotionally resonant angle that compounds with consistency.`,
      keyChallenges: ["Consistency & publishing cadence", "Sharpening a repeatable hook formula", "Turning viewers into a community"],
      competitiveAdvantages: ["A specific, values-driven mission", "A defined audience you understand", "Willingness to commit weekly time"],
    },
    brand: {
      mission, vision: "Become the most trusted storyteller in your niche within 18 months.",
      uvp: "Stories that make people feel something and act on it.",
      personality: ["Authentic", "Inspiring", "Grounded"], voice: "Warm, confident, conversational.",
      contentPromise: "Every video leaves you with one idea worth sharing.",
      taglines: ["Stories that move you.", "Where meaning meets momentum.", "Your daily dose of story."],
    },
    audience: {
      primary: String(a.audience || "People seeking meaning and inspiration."),
      secondary: "Aspiring creators who admire your craft.",
      painPoints: ["Information overload", "Lack of inspiration", "Wanting depth, not noise"],
      desires: ["To feel inspired", "To learn something real", "To belong to a community"],
      viewingHabits: "Evenings and weekends, mostly mobile.",
      platformBehaviour: "Discovers via Shorts, commits via long-form.",
    },
    content: {
      pillars: pillarSeeds.slice(0, 6).map((p) => ({ name: String(p), description: `Regular ${String(p).toLowerCase()} content that serves your mission.` })),
      seriesIdeas: ["A weekly signature series", "A monthly deep-dive"],
      longForm: "One flagship 8-12 min video per week built on a strong narrative arc.",
      shorts: "3 shorts/week repurposed from the long-form's best moments.",
      storytellingFramework: "Hook → Tension → Turn → Payoff → Call to reflect.",
      contentMix: "60% evergreen, 40% timely.",
      evergreenVsTrending: "Lead with evergreen pillars; ride trends only when they fit the mission.",
    },
    calendar: months.map((m) => ({
      month: m, theme: `${pillarSeeds[(m - 1) % pillarSeeds.length]} focus`, goal: `Establish rhythm and grow watch time in month ${m}.`,
      uploads: [1, 2, 3, 4].map((w) => ({ week: w, topic: `${pillarSeeds[(m + w) % pillarSeeds.length]} story`, format: w % 2 ? "Long-form" : "Short", kpi: "CTR > 5%, retention > 40%" })),
    })),
    seo: {
      keywordClusters: ["your niche + beginners", "your niche + story", "your niche + how to"],
      titleFormula: "[Emotion] + [Specific Outcome] + [Curiosity Gap]",
      thumbnailStrategy: "One face, one emotion, 3 words max, high contrast.",
      descriptionTemplate: "Hook line → what they'll learn → timestamps → links → CTA.",
      hashtags: ["#storytelling", "#creator", "#yourNiche"], playlists: ["Signature series", "Best of", "Start here"],
    },
    distribution: {
      instagram: "Reels of your best hooks + carousels of key ideas.", linkedin: "Written stories that mirror your videos.",
      newsletter: "Weekly 'story behind the story' email.", podcast: "Audio versions of long-form.",
      whatsapp: "Broadcast channel for new drops.", community: "Weekly prompt to spark discussion.",
    },
    personalBrand: {
      authority: "Publish a signature POV piece monthly.", networking: "Reach out to 3 peer creators/week.",
      speaking: "Pitch one local/online talk per quarter.", bookIdeas: ["A collection of your best stories"],
      mediaOutreach: "Build a simple press kit and pitch niche newsletters.",
    },
    brandCollab: {
      idealCategories: ["Tools you already use", "Values-aligned brands"], readiness: "Ready once you pass ~5k engaged subs.",
      mediaKit: ["Audience snapshot", "Top videos", "Rates"], sponsorshipPositioning: "Premium storyteller, not a discount pitch.",
    },
    monetization: months.map((m) => ({ month: m, focus: m < 3 ? "Audience first" : m < 5 ? "Affiliates & products" : "Brand deals", streams: m < 3 ? ["AdSense (once eligible)"] : m < 5 ? ["Affiliate", "Digital product"] : ["Brand partnerships", "Membership"] })),
    productivity: {
      weeklyWorkflow: ["Mon: research", "Tue-Wed: write & record", "Thu: edit", "Fri: publish & promote", "Sat: analytics"],
      pipeline: { research: "Batch topic + hook research.", writing: "Script to the framework.", recording: "Record in one session.", editing: "Cut for retention.", publishing: "Title/thumbnail A/B, schedule." },
    },
    kpis: [
      { metric: "Subscribers", current: "—", sixMonthTarget: "+2,000" },
      { metric: "Views", current: "—", sixMonthTarget: "+150k" },
      { metric: "Watch Time", current: "—", sixMonthTarget: "+3,000 hrs" },
      { metric: "CTR", current: "—", sixMonthTarget: "5-8%" },
      { metric: "Retention", current: "—", sixMonthTarget: "45%+" },
      { metric: "Revenue", current: "—", sixMonthTarget: "First $500/mo" },
      { metric: "Brand Deals", current: "0", sixMonthTarget: "1-2 aligned deals" },
    ],
  };
}

async function generate(prompt: string): Promise<string | null | undefined> {
  if (hasKey(process.env.GEMINI_API_KEY)) {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const r = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    return r.text;
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const c = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [{ role: "user", content: prompt }],
  });
  return c.choices[0]?.message?.content;
}

export async function POST(req: Request) {
  let answers: Answers = {};
  try {
    const b = await req.json();
    answers = (b.answers ?? {}) as Answers;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Channel context (if connected) makes targets realistic.
  const { data: yt } = await supabase
    .from("youtube_connections")
    .select("channel_title, subscriber_count, view_count, video_count")
    .maybeSingle();
  const channelCtx = yt
    ? `Connected channel "${yt.channel_title}": ${yt.subscriber_count ?? 0} subscribers, ${yt.view_count ?? 0} views, ${yt.video_count ?? 0} videos. Size all targets to a channel this stage.`
    : "No channel connected yet — assume an early-stage creator who needs momentum.";

  // Mark processing (best-effort; ignore errors so generation still proceeds).
  await supabase.from("strategy_profiles").upsert(
    { user_id: user.id, answers, status: "processing", updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );

  let report: unknown;
  let source: "ai" | "engine" = "engine";
  const noKeys = !hasKey(process.env.GEMINI_API_KEY) && !hasKey(process.env.OPENAI_API_KEY);
  if (noKeys) {
    report = fallbackReport(answers);
  } else {
    try {
      const raw = await generate(buildPrompt(answers, channelCtx));
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.executiveSummary && parsed?.calendar) {
        report = parsed;
        source = "ai";
      } else {
        report = fallbackReport(answers);
      }
    } catch (e) {
      console.error("Strategy engine error:", e);
      report = fallbackReport(answers);
    }
  }

  const { error: saveErr } = await supabase.from("strategy_profiles").upsert(
    {
      user_id: user.id,
      answers,
      report,
      status: "ready",
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (saveErr) console.error("Strategy save error:", saveErr.message);

  return NextResponse.json({ report, source });
}
