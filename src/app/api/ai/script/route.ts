import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { buildScript, parseDurationMin } from '@/utils/scriptEngine';

// Generates a structured, parameter-accurate YouTube script.
// Uses an LLM when a key is configured (fully honors language); otherwise
// falls back to the deterministic engine so the endpoint always returns a
// usable, parameter-driven script.

type Params = {
  topic: string;
  audience: string;
  duration: string;
  durationMin: number;
  language: string;
  frameworkId: number;
  frameworkName: string;
  goal: string;
  tone: string;
  scriptStyle: string;
  keyMessage: string;
  cta: string;
  platform: string;
};

function hasKey(v?: string) {
  return !!v && !/^(your_|xxx|placeholder|sk-proj-xxx)/i.test(v.trim());
}

function deterministic(p: Params) {
  return buildScript({
    topic: p.topic,
    audience: p.audience,
    durationMin: p.durationMin,
    frameworkId: p.frameworkId,
    language: p.language,
  });
}

function buildPrompt(p: Params) {
  return `You are a world-class screenwriter, direct-response copywriter, and YouTube strategist. Write an engaging, retention-optimized video script.

Parameters (obey ALL of them exactly):
- Primary goal: ${p.goal}
- Topic: ${p.topic}
- Key message to remember: ${p.keyMessage || p.topic}
- Target audience: ${p.audience}
- Video type / framework: ${p.frameworkName}
- Total length: ${p.duration}
- Platform: ${p.platform}
- Tone: ${p.tone}
- Script style: ${p.scriptStyle}
- Call to action: ${p.cta}
- Language: ${p.language} (write ALL "script" text in this language)

Return ONLY valid JSON of this shape, no prose:
{"blocks":[{"time":"M:SS - M:SS","section":"string","script":"spoken voiceover","visual":"on-screen visual direction","audio":"sound/music cue","tip":"delivery coaching tip","warning":"retention risk note or null"}]}

Rules:
- Timestamps must span 0:00 to exactly ${p.duration} with no gaps.
- 5-6 blocks following the ${p.frameworkName} structure.
- Match the ${p.tone} tone and ${p.scriptStyle} style; end on the CTA.
- Weave the topic, audience and goal naturally into every block.
- Longer durations = longer, more detailed "script" text per block.
- "section", "visual", "audio", "tip", "warning" may be in English; "script" MUST be in ${p.language}.`;
}

export async function POST(req: Request) {
  let params: Params;
  try {
    const body = await req.json();
    const durationLabel = String(body.duration || '12 min');
    const durationMin = Number(body.durationMin) > 0
      ? Number(body.durationMin)
      : parseDurationMin(durationLabel);
    params = {
      topic: String(body.topic || '').slice(0, 200),
      audience: String(body.audience || 'creators').slice(0, 200),
      duration: durationLabel,
      durationMin,
      language: String(body.language || 'English'),
      frameworkId: Number(body.frameworkId) || 4,
      frameworkName: String(body.frameworkName || 'Case Study Framework'),
      goal: String(body.goal || 'Educate').slice(0, 120),
      tone: String(body.tone || 'Conversational').slice(0, 60),
      scriptStyle: String(body.scriptStyle || 'Storytelling').slice(0, 60),
      keyMessage: String(body.keyMessage || '').slice(0, 300),
      cta: String(body.cta || '').slice(0, 200),
      platform: String(body.platform || 'YouTube').slice(0, 60),
    };
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // No key configured → deterministic engine (always works).
  if (!hasKey(process.env.OPENAI_API_KEY) && !hasKey(process.env.GEMINI_API_KEY)) {
    return NextResponse.json({ blocks: deterministic(params), source: 'engine' });
  }

  try {
    let raw: string | null | undefined;
    if (hasKey(process.env.OPENAI_API_KEY)) {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [{ role: 'user', content: buildPrompt(params) }],
      });
      raw = completion.choices[0]?.message?.content;
    } else {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: buildPrompt(params),
      });
      raw = response.text;
    }

    const parsed = raw ? JSON.parse(raw) : null;
    const blocks = parsed?.blocks;
    if (Array.isArray(blocks) && blocks.length > 0) {
      return NextResponse.json({ blocks, source: 'ai' });
    }
    return NextResponse.json({ blocks: deterministic(params), source: 'engine' });
  } catch (error) {
    console.error('Script AI error:', error);
    // Graceful fallback — never leave the user without a script.
    return NextResponse.json({ blocks: deterministic(params), source: 'engine' });
  }
}
