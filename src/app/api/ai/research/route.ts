import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { createClient } from "@/utils/supabase/server";

// Personalized topic-research engine. Reads the signed-in creator's onboarding
// profile (creator_type / niche / goal) AND their connected YouTube channel,
// then returns recommendations tailored to *them* — never generic. Gemini is
// the primary engine, OpenAI the fallback, and a profile-aware deterministic
// engine is the last resort so the endpoint always personalizes.

function hasKey(v?: string) {
  return !!v && !/^(your_|xxx|placeholder|sk-proj-xxx)/i.test(v.trim());
}

const CREATOR: Record<string, string> = {
  solo: "solo creator building a personal brand",
  coach: "coach/consultant attracting high-paying clients",
  agency: "agency owner managing client channels",
  business: "business/SaaS driving product sales",
};
const GOAL: Record<string, string> = {
  views: "maximize views & reach",
  subs: "grow the subscriber base",
  leads: "generate leads & sales",
  brand: "build brand authority",
};

type Profile = { creator_type: string | null; niche: string | null; goal: string | null };
type Channel = { title: string; subs: number; views: number; videos: number } | null;

function creatorContext(p: Profile, ch: Channel) {
  const who = p.creator_type ? CREATOR[p.creator_type] ?? p.creator_type : "a YouTube creator";
  const niche = p.niche ?? "an unspecified niche";
  const goal = p.goal ? GOAL[p.goal] ?? p.goal : "channel growth";
  const channel = ch
    ? `Connected channel "${ch.title}": ${ch.subs} subscribers, ${ch.views} total views, ${ch.videos} videos published (size the advice to a channel this stage).`
    : "No channel connected yet — assume an early-stage creator who needs momentum.";
  return `Creator profile:
- They are ${who}
- Niche: ${niche}
- Primary goal: ${goal}
- ${channel}`;
}

function buildSuggestPrompt(p: Profile, ch: Channel) {
  return `You are a world-class YouTube growth strategist. Based ONLY on this specific creator, propose winning video topics they should make next.

${creatorContext(p, ch)}

Return ONLY valid JSON (no prose):
{
  "insight": "one sharp, personalized sentence about where this creator's biggest opportunity is right now",
  "suggestions": ["6 specific, searchable video topics tailored to THEIR niche and goal — each 2 to 6 words, high-opportunity, not generic"]
}`;
}

function buildAnalyzePrompt(keyword: string, p: Profile, ch: Channel) {
  return `You are a world-class YouTube research analyst. Analyze the topic "${keyword}" specifically for this creator and how well it fits THEM.

${creatorContext(p, ch)}

Return ONLY valid JSON (no prose), all scores are integers 0-100:
{
  "keyword": "${keyword}",
  "score": overall opportunity score for this creator,
  "volume": search demand,
  "competition": how crowded (higher = more competitive),
  "trend": 6-month momentum,
  "revenue": monetization potential for their goal,
  "virality": shareability,
  "intent": "audience intent (e.g. Commercial / Educational)",
  "seasonality": "one line on seasonal demand",
  "chartData": [{"name":"Jan","interest":n},{"name":"Feb","interest":n},{"name":"Mar","interest":n},{"name":"Apr","interest":n},{"name":"May","interest":n},{"name":"Jun","interest":n}],
  "related": [{"term":"breakout sub-topic","growth":"+NNN%","difficulty":"Easy|Medium|Hard"} , x4 total],
  "videos": [{"title":"realistic competitor video title","channel":"channel name","views":"NNK","velocity":"NNN v/h","age":"N days ago"} , x3 total],
  "recommendation": {
    "fitScore": how well this topic fits THIS creator's niche/goal/channel size (0-100),
    "why": "1-2 sentences tying the verdict to their niche, goal and channel stage",
    "angle": "the single sharpest angle THIS creator should take on it",
    "firstStep": "the immediate next action for them"
  }
}`;
}

// ---- Deterministic, still-personalized fallbacks ----

function seedFrom(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function fallbackSuggest(p: Profile) {
  const niche = p.niche ?? "your niche";
  const goalPhrase = p.goal ? GOAL[p.goal] ?? p.goal : "channel growth";
  return {
    insight: `Double down on ${niche} topics that serve your goal to ${goalPhrase} — specific beats broad.`,
    suggestions: [
      `${niche} for beginners`,
      `${niche} mistakes to avoid`,
      `${niche} tools in 2026`,
      `How I grew with ${niche}`,
      `${niche} case study`,
      `${niche} in 10 minutes`,
    ],
  };
}

function fallbackAnalyze(keyword: string, p: Profile, ch: Channel) {
  const r = seedFrom(keyword + (p.niche ?? ""));
  const rnd = (min: number, span: number, salt: number) => min + ((r >> salt) % span);
  const volume = rnd(55, 40, 1);
  const competition = rnd(30, 50, 3);
  const trend = rnd(60, 40, 5);
  const revenue = rnd(60, 30, 7);
  const virality = rnd(50, 40, 9);
  const score = Math.round(volume * 0.3 + (100 - competition) * 0.2 + trend * 0.2 + revenue * 0.15 + virality * 0.15);
  const nicheMatch = p.niche && keyword.toLowerCase().includes(p.niche.toLowerCase().split(" ")[0]);
  const fitScore = Math.max(35, Math.min(98, score + (nicheMatch ? 12 : -8)));
  const goalPhrase = p.goal ? GOAL[p.goal] ?? p.goal : "channel growth";
  const stage = ch && ch.subs > 5000 ? "your established channel" : "an early-stage channel";
  return {
    analysis: {
      keyword,
      score, volume, competition, trend, revenue, virality,
      intent: "Informational / Commercial",
      seasonality: "Steady demand with seasonal variation",
      chartData: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((name, i) => ({
        name, interest: Math.max(15, Math.min(100, trend - 30 + i * 8 + ((r >> (i + 2)) % 12))),
      })),
      related: [
        { term: `${keyword} for beginners`, growth: `+${rnd(80, 200, 2)}%`, difficulty: "Easy" },
        { term: `${keyword} mistakes`, growth: `+${rnd(60, 150, 4)}%`, difficulty: "Medium" },
        { term: `Best ${keyword} strategy`, growth: `+${rnd(40, 120, 6)}%`, difficulty: "Hard" },
        { term: `${keyword} case study`, growth: `+${rnd(50, 140, 8)}%`, difficulty: "Medium" },
      ],
      videos: [
        { title: `How to master ${keyword} fast`, channel: "Creator Pro", views: `${rnd(20, 60, 1)}K`, velocity: `${rnd(120, 400, 3)} v/h`, age: "1 week ago" },
        { title: `The truth about ${keyword}`, channel: "Inside Look", views: `${rnd(40, 90, 5)}K`, velocity: `${rnd(200, 500, 7)} v/h`, age: "4 days ago" },
        { title: `${keyword}: what nobody tells you`, channel: "Signal", views: `${rnd(15, 50, 9)}K`, velocity: `${rnd(100, 350, 2)} v/h`, age: "6 days ago" },
      ],
    },
    recommendation: {
      fitScore,
      why: nicheMatch
        ? `This sits squarely in your niche and supports your goal to ${goalPhrase} — a strong fit for ${stage}.`
        : `It's adjacent to your niche; angle it back toward your core audience so it still serves your goal to ${goalPhrase}.`,
      angle: `Frame "${keyword}" around one concrete outcome your audience wants, with a contrarian promise in the title.`,
      firstStep: "Draft the hook first — it decides whether the rest gets watched.",
    },
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
  let mode = "analyze";
  let keyword = "";
  try {
    const b = await req.json();
    mode = b.mode === "suggest" ? "suggest" : b.keyword ? "analyze" : "suggest";
    keyword = String(b.keyword || "").slice(0, 120).trim();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (mode === "analyze" && !keyword) {
    return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
  }

  // Load the creator's profile + connected channel so every result is personalized.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile: Profile = { creator_type: null, niche: null, goal: null };
  let channel: Channel = null;
  if (user) {
    const [{ data: prof }, { data: yt }] = await Promise.all([
      supabase.from("user_profiles").select("creator_type, niche, goal").eq("id", user.id).maybeSingle(),
      supabase.from("youtube_connections").select("channel_title, subscriber_count, view_count, video_count").maybeSingle(),
    ]);
    if (prof) profile = prof as Profile;
    if (yt) channel = { title: yt.channel_title, subs: yt.subscriber_count ?? 0, views: yt.view_count ?? 0, videos: yt.video_count ?? 0 };
  }

  const noKeys = !hasKey(process.env.GEMINI_API_KEY) && !hasKey(process.env.OPENAI_API_KEY);

  if (mode === "suggest") {
    if (noKeys) return NextResponse.json({ ...fallbackSuggest(profile), source: "engine" });
    try {
      const raw = await generate(buildSuggestPrompt(profile, channel));
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.suggestions && Array.isArray(parsed.suggestions) && parsed.suggestions.length) {
        return NextResponse.json({ insight: parsed.insight ?? "", suggestions: parsed.suggestions.slice(0, 6), source: "ai" });
      }
      return NextResponse.json({ ...fallbackSuggest(profile), source: "engine" });
    } catch (e) {
      console.error("Research suggest error:", e);
      return NextResponse.json({ ...fallbackSuggest(profile), source: "engine" });
    }
  }

  // analyze
  if (noKeys) return NextResponse.json({ ...fallbackAnalyze(keyword, profile, channel), source: "engine" });
  try {
    const raw = await generate(buildAnalyzePrompt(keyword, profile, channel));
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.keyword && Array.isArray(parsed.chartData)) {
      const { recommendation, ...analysis } = parsed;
      return NextResponse.json({ analysis, recommendation: recommendation ?? null, source: "ai" });
    }
    return NextResponse.json({ ...fallbackAnalyze(keyword, profile, channel), source: "engine" });
  } catch (e) {
    console.error("Research analyze error:", e);
    return NextResponse.json({ ...fallbackAnalyze(keyword, profile, channel), source: "engine" });
  }
}
