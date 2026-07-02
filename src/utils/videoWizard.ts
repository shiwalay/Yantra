// Universal Engaging Video Script generator — the data + deterministic logic
// behind the 6-step Create Videos wizard. Collects strategic inputs and turns
// them into a production package (titles, hooks, thumbnails, script, scenes,
// SEO, retention analysis). Works fully offline; upgrades to richer output via
// the /api/ai/script route when an AI key is configured.

import { buildScript, type ScriptBlock } from "./scriptEngine";

/* ----------------------------- Option lists ----------------------------- */

export const GOALS: string[] = [
  "Educate", "Sell a Product", "Generate Leads", "Build Authority", "Inspire People",
  "Tell a Story", "Build Trust", "Launch a Product", "Create Awareness", "Get Subscribers",
  "Increase Engagement", "Build a Community", "Promote an Event", "Drive Website Traffic",
  "Book Appointments",
];

export const TONES: string[] = [
  "Friendly", "Inspirational", "Emotional", "Funny", "Professional", "Luxury",
  "Spiritual", "Scientific", "Conversational", "Cinematic",
];

export const SCRIPT_STYLES: string[] = [
  "Storytelling", "Documentary", "Movie", "TED Talk", "Netflix Documentary",
  "Apple Launch Presentation", "MrBeast", "Alex Hormozi", "Simon Sinek", "Neil Patel",
];

export const PLATFORMS: string[] = [
  "YouTube", "Instagram", "TikTok", "LinkedIn", "Facebook", "X (Twitter)", "Website / VSL",
];

export const LANGUAGES: string[] = ["English", "Spanish", "Hindi", "German"];

export const DURATIONS: string[] = [
  "30 sec", "60 sec", "90 sec", "3 min", "5 min", "8 min", "10 min",
  "15 min", "20 min", "30 min", "45 min", "60 min", "90 min",
];

export type VideoType = {
  name: string;
  objective: string;
  duration: string;
  framework: string; // recommended framework (display)
  engineId: number; // mapped structural engine framework (1-6)
};

// The Digital Video Content Ecosystem — each type mapped to the closest
// structural engine framework so the generated script keeps a real spine.
export const VIDEO_TYPES: VideoType[] = [
  { name: "Brand Story", objective: "Build Trust", duration: "3-10 min", framework: "Hero's Journey", engineId: 2 },
  { name: "Founder Story", objective: "Authority", duration: "5-15 min", framework: "Problem → Journey → Transformation", engineId: 2 },
  { name: "Educational", objective: "Teach", duration: "5-20 min", framework: "Explain → Example → Exercise", engineId: 1 },
  { name: "How-to Tutorial", objective: "Skill Building", duration: "5-30 min", framework: "Step-by-Step", engineId: 1 },
  { name: "Case Study", objective: "Proof", duration: "3-10 min", framework: "Before → Process → Results", engineId: 4 },
  { name: "Customer Testimonial", objective: "Social Proof", duration: "2-5 min", framework: "Problem → Solution → Outcome", engineId: 4 },
  { name: "Product Demo", objective: "Product Education", duration: "2-8 min", framework: "Feature → Benefit → Use Case", engineId: 1 },
  { name: "Webinar", objective: "Lead Generation", duration: "60-120 min", framework: "Hook → Problem → Solution → Offer", engineId: 1 },
  { name: "Masterclass", objective: "Premium Education", duration: "90-180 min", framework: "Belief Shift", engineId: 5 },
  { name: "Sales Video (VSL)", objective: "Conversion", duration: "10-40 min", framework: "PAS + Story + Offer", engineId: 1 },
  { name: "Advertisement", objective: "Attention", duration: "15-60 sec", framework: "Hook → Emotion → CTA", engineId: 1 },
  { name: "Shorts / Reels", objective: "Reach", duration: "15-90 sec", framework: "Hook → Value → CTA", engineId: 1 },
  { name: "Podcast", objective: "Relationship", duration: "30-120 min", framework: "Conversation", engineId: 2 },
  { name: "Interview", objective: "Authority Transfer", duration: "20-90 min", framework: "Question Pyramid", engineId: 2 },
  { name: "FAQ", objective: "Objection Handling", duration: "1-5 min", framework: "Question → Answer → Proof", engineId: 1 },
  { name: "Comparison", objective: "Decision Making", duration: "5-15 min", framework: "Feature Matrix", engineId: 5 },
  { name: "Myth vs Fact", objective: "Awareness", duration: "2-10 min", framework: "Myth → Reality → Evidence", engineId: 5 },
  { name: "Explainer Animation", objective: "Simplify Complex Topics", duration: "2-8 min", framework: "Problem → Mechanism → Solution", engineId: 1 },
  { name: "Documentary", objective: "Emotional Connection", duration: "10-60 min", framework: "Narrative Arc", engineId: 2 },
  { name: "Event Coverage", objective: "Community Building", duration: "3-10 min", framework: "Highlights → Experience → Impact", engineId: 4 },
  { name: "Behind the Scenes", objective: "Authenticity", duration: "2-10 min", framework: "Process Story", engineId: 2 },
  { name: "Day in the Life", objective: "Personal Brand", duration: "5-20 min", framework: "Timeline", engineId: 2 },
  { name: "Live Session", objective: "Engagement", duration: "30-120 min", framework: "Open → Teach → Q&A → CTA", engineId: 1 },
  { name: "News Commentary", objective: "Thought Leadership", duration: "5-20 min", framework: "Context → Analysis → Opinion", engineId: 5 },
  { name: "Trend Analysis", objective: "Relevance", duration: "5-15 min", framework: "Trend → Impact → Prediction", engineId: 6 },
  { name: "Industry Report", objective: "Authority", duration: "10-30 min", framework: "Data → Insights → Action", engineId: 6 },
];

export function videoTypeByName(name: string): VideoType | undefined {
  return VIDEO_TYPES.find((v) => v.name === name);
}

/* --------------------------- Wizard input model --------------------------- */

export type WizardInput = {
  // Step 1 — End Goal
  goal: string;
  // Step 2 — Audience
  audience: string; // who / profession
  painPoint: string;
  desire: string;
  // Step 3 — Core Content
  topic: string;
  keyMessage: string;
  keyPoints: string; // newline-separated
  // Step 4 — Style
  videoType: string;
  tone: string;
  scriptStyle: string;
  // Step 5 — Production
  duration: string;
  platform: string;
  language: string;
  cta: string;
  brand: string;
  speaker: string;
};

export const DEFAULT_INPUT: WizardInput = {
  goal: "Build Authority",
  audience: "Business Owners",
  painPoint: "",
  desire: "",
  topic: "AI Business",
  keyMessage: "",
  keyPoints: "",
  videoType: "Educational",
  tone: "Conversational",
  scriptStyle: "Storytelling",
  duration: "10 min",
  platform: "YouTube",
  language: "English",
  cta: "Subscribe and grab the free guide in the description",
  brand: "",
  speaker: "",
};

export type Scene = { scene: string; dialogue: string; visual: string; emotion: string };
export type Seo = {
  title: string;
  description: string;
  keywords: string[];
  hashtags: string[];
  chapters: string[];
  tags: string[];
};

export type ProductionPackage = {
  frameworkName: string;
  titles: string[];
  hooks: string[];
  thumbnails: string[];
  script: ScriptBlock[];
  scenes: Scene[];
  seo: Seo;
  retention: string[];
  source: "engine" | "ai";
};

/* ------------------------------- Helpers -------------------------------- */

export function parseToMinutes(label: string): number {
  const n = parseFloat(label);
  if (!Number.isFinite(n) || n <= 0) return 12;
  return /sec/i.test(label) ? Math.max(0.25, n / 60) : n;
}

function titleize(t: string): string {
  return t.trim() || "Your Topic";
}

function generateTitles(topic: string, goal: string): string[] {
  const t = titleize(topic);
  return [
    `The ${t} Strategy Nobody Talks About`,
    `How to Master ${t} in 2026 (Full Breakdown)`,
    `${t}: The Truth Most People Get Wrong`,
    `I Tried ${t} for 30 Days — Here's What Happened`,
    `The Only ${t} Guide You'll Ever Need`,
    `Why 99% of People Fail at ${t}`,
    `${t} Explained in Under 10 Minutes`,
    `The ${t} Playbook That Actually Works (${goal})`,
    `Do This Before You Try ${t}`,
    `The Fastest Way to Win With ${t}`,
  ];
}

function generateHooks(topic: string, audience: string): string[] {
  const t = titleize(topic);
  const a = audience.trim() || "creators";
  return [
    `Most ${a} get ${t} completely wrong — here's the fix.`,
    `If you're serious about ${t}, watch the first 30 seconds.`,
    `This one ${t} mistake is quietly costing you everything.`,
    `I spent 100 hours on ${t} so you don't have to.`,
    `${t} is about to change — and most ${a} aren't ready.`,
    `Here's what nobody tells you about ${t}.`,
    `Stop doing ${t} like everyone else.`,
    `The ${t} secret the pros don't share.`,
    `In the next few minutes, ${t} will finally click.`,
    `What if ${t} could basically run on autopilot?`,
  ];
}

function generateThumbnails(topic: string): string[] {
  const t = titleize(topic).toUpperCase();
  return [
    `Bold face close-up + 3-word text "${t} SECRET"`,
    `Split screen: "WRONG" vs "RIGHT" ${topic} approach`,
    `Big red arrow pointing at a shocking ${topic} number`,
    `Before / After transformation with green metrics`,
    `Minimalist dark background, single glowing ${topic} icon`,
    `Genuine surprised face + one circled detail`,
    `"$0 → $10K" result overlay tied to ${topic}`,
    `Crossed-out myth text with a bold correction`,
    `3-step roadmap graphic teasing the ${topic} process`,
    `Countdown "7 DAYS" over a ${topic} workspace shot`,
  ];
}

const EMOTION_MAP: Record<string, string> = {
  hook: "Curiosity", problem: "Tension", agitate: "Urgency", stakes: "Fear",
  solution: "Relief", transformation: "Inspiration", proof: "Trust",
  analysis: "Clarity", truth: "Aha", shift: "Anticipation", prepare: "Motivation",
  cta: "Motivation", lesson: "Reflection", setup: "Empathy", conflict: "Suspense",
  result: "Triumph", reveal: "Triumph", belief: "Aha", breakdown: "Intrigue",
};

function emotionFor(section: string): string {
  const s = section.toLowerCase();
  for (const key of Object.keys(EMOTION_MAP)) {
    if (s.includes(key)) return EMOTION_MAP[key];
  }
  return "Engaged";
}

function generateSeo(topic: string, keyMessage: string, script: ScriptBlock[]): Seo {
  const t = titleize(topic);
  const words = t.split(/\s+/).filter(Boolean);
  const chapters = script.map((b) => `${b.time.split(" - ")[0]} — ${b.section}`);
  const base = keyMessage.trim() || `Everything you need to know about ${t}, broken into a clear, actionable framework.`;
  return {
    title: `${t}: The Complete 2026 Guide`,
    description: `${base} In this video you'll get the exact framework, real examples, and the steps to apply it today. Timestamps and free resources are in the description.`,
    keywords: [
      t.toLowerCase(), `${t.toLowerCase()} guide`, `${t.toLowerCase()} strategy`,
      `how to ${t.toLowerCase()}`, `${t.toLowerCase()} 2026`, `${t.toLowerCase()} tips`,
    ],
    hashtags: [
      `#${words.join("")}`, `#${words[0] || "Growth"}`, "#ContentStrategy",
      "#YouTubeGrowth", "#CreatorEconomy",
    ],
    chapters,
    tags: [t, `${t} tutorial`, `${t} explained`, "growth", "strategy", "2026"],
  };
}

function generateRetention(script: ScriptBlock[], videoType: string): string[] {
  const firstEnd = script[0]?.time.split(" - ")[1] || "0:30";
  return [
    `The hook resolves by ${firstEnd} with a specific promise, so viewers know exactly why to stay.`,
    `Add a pattern interrupt — cut, zoom, or graphic — every 15–20s to reset attention.`,
    `Most likely drop-off: the transition into the main content. Keep it under 3 seconds.`,
    `An open curiosity loop is set early and paid off near the end, pulling watch-time forward.`,
    `Emotional pacing rises through the problem, releases at the solution, and builds momentum into the CTA.`,
    `${videoType} viewers reward proof — keep at least one concrete result on screen mid-video.`,
    `End on the next-step bridge; never trail off with a slow "thanks for watching".`,
  ];
}

/* --------------------------- Package generation --------------------------- */

export function generatePackage(input: WizardInput): ProductionPackage {
  const vt = videoTypeByName(input.videoType);
  const engineId = vt?.engineId ?? 1;
  const frameworkName = vt?.framework ?? "PAS Framework";
  const durationMin = parseToMinutes(input.duration);

  const script = buildScript({
    topic: input.topic,
    audience: input.audience,
    durationMin,
    frameworkId: engineId,
    language: input.language,
  });

  const scenes: Scene[] = script.map((b) => ({
    scene: `${b.time} · ${b.section}`,
    dialogue: b.script,
    visual: b.visual,
    emotion: emotionFor(b.section),
  }));

  return {
    frameworkName,
    titles: generateTitles(input.topic, input.goal),
    hooks: generateHooks(input.topic, input.audience),
    thumbnails: generateThumbnails(input.topic),
    script,
    scenes,
    seo: generateSeo(input.topic, input.keyMessage, script),
    retention: generateRetention(script, input.videoType),
    source: "engine",
  };
}
