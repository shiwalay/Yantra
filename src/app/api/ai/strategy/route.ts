import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { createClient } from "@/utils/supabase/server";

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

function buildPrompt(topic: string, p: Profile) {
  const who = p.creator_type ? CREATOR[p.creator_type] ?? p.creator_type : "a YouTube creator";
  const niche = p.niche ?? "their niche";
  const goal = p.goal ? GOAL[p.goal] ?? p.goal : "channel growth";
  return `You are a world-class YouTube growth strategist. Design a concrete video strategy.

Creator profile:
- They are a ${who}
- Niche: ${niche}
- Primary goal: ${goal}
- Video idea: "${topic}"

Return ONLY valid JSON (no prose), tailored to the profile and goal:
{
  "angle": "the single sharpest angle/positioning for this video",
  "framework": "recommended structure (e.g. PAS, Story, Case Study, Myth-Truth, Future Prediction)",
  "targetAudience": "who exactly this should reach",
  "whyItWorks": "1-2 sentences of strategic rationale tied to their goal",
  "titles": ["three click-worthy titles"],
  "hook": "the exact first spoken line",
  "thumbnailIdea": "one strong thumbnail concept",
  "cta": "the call to action that serves their goal",
  "firstStep": "the immediate next action to take"
}`;
}

function fallbackStrategy(topic: string, p: Profile) {
  const goal = p.goal ? GOAL[p.goal] ?? p.goal : "channel growth";
  return {
    angle: `Position "${topic}" around a specific, contrarian promise your audience can't ignore.`,
    framework: "PAS (Problem → Agitate → Solution)",
    targetAudience: p.niche ? `${p.niche} viewers who want fast, actionable results` : "viewers seeking a clear outcome",
    whyItWorks: `Leads with tension and a concrete payoff, which drives retention — directly supporting your goal to ${goal}.`,
    titles: [
      `The ${topic} Strategy Nobody Talks About`,
      `Why 99% Get ${topic} Wrong (And How to Fix It)`,
      `${topic}: The Only Guide You Need`,
    ],
    hook: `Most people get ${topic} completely wrong — here's the fix in the next few minutes.`,
    thumbnailIdea: `Bold face close-up + 3-word text "${topic.toUpperCase()}" with a red slash through the common mistake.`,
    cta: "Point to the free checklist in the pinned comment and the next-step video.",
    firstStep: "Draft the hook first — it decides whether the rest gets watched.",
  };
}

export async function POST(req: Request) {
  let topic = "";
  try {
    const b = await req.json();
    topic = String(b.topic || "").slice(0, 200);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!topic.trim()) return NextResponse.json({ error: "Topic is required" }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile: Profile = { creator_type: null, niche: null, goal: null };
  if (user) {
    const { data } = await supabase.from("user_profiles").select("creator_type, niche, goal").eq("id", user.id).maybeSingle();
    if (data) profile = data as Profile;
  }

  const prompt = buildPrompt(topic, profile);

  if (!hasKey(process.env.GEMINI_API_KEY) && !hasKey(process.env.OPENAI_API_KEY)) {
    return NextResponse.json({ strategy: fallbackStrategy(topic, profile), source: "engine" });
  }

  try {
    let raw: string | null | undefined;
    if (hasKey(process.env.GEMINI_API_KEY)) {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const r = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });
      raw = r.text;
    } else {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const c = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      });
      raw = c.choices[0]?.message?.content;
    }
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.angle && Array.isArray(parsed.titles)) {
      return NextResponse.json({ strategy: parsed, source: "ai" });
    }
    return NextResponse.json({ strategy: fallbackStrategy(topic, profile), source: "engine" });
  } catch (e) {
    console.error("Strategy AI error:", e);
    return NextResponse.json({ strategy: fallbackStrategy(topic, profile), source: "engine" });
  }
}
