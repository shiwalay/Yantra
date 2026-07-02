// Deterministic, parameter-accurate YouTube script generator.
// Every parameter genuinely shapes the output:
//   • Topic + Audience are woven into every beat.
//   • Length scales BOTH the timeline AND the depth of the spoken script
//     (each beat carries layered lines; more are included for longer videos).
//   • Each of the 6 Frameworks has its own distinct beat structure.
//   • Language localizes the section titles (full voiceover via the AI route).

export type ScriptBlock = {
  time: string;
  section: string;
  script: string;
  visual: string;
  audio: string;
  tip: string;
  warning: string | null;
};

type Line = (topic: string, audience: string) => string;

type Beat = {
  section: string;
  weight: number; // relative share of total runtime
  // Ordered lines: [0] is the essential core; later lines are elaboration
  // included only as the video gets longer.
  lines: Line[];
  visual: (topic: string) => string;
  audio: string;
  tip: string;
  warning?: string | null;
};

export type Framework = {
  id: number;
  code: string;
  name: string;
  beats: Beat[];
};

const MAX_DURATION = 18; // longest option in the UI — used to scale script depth

// Section-title localization so the Language parameter visibly takes effect
// on the script structure even in the offline (no-AI-key) path.
const SECTION_I18N: Record<string, Record<string, string>> = {
  Spanish: {
    "Opening Hook": "Gancho de Apertura", Problem: "Problema", Agitate: "Agitar",
    "Solution & Proof": "Solución y Prueba", "CTA & Next Video": "CTA y Próximo Video",
    "Story Hook": "Gancho Narrativo", "The Setup": "El Planteamiento", "The Conflict": "El Conflicto",
    "The Transformation": "La Transformación", "Lesson & CTA": "Lección y CTA",
    "Challenge Hook": "Gancho del Reto", "The Stakes": "Lo que está en Juego", "The Attempt": "El Intento",
    "Result & Reveal": "Resultado y Revelación", "Proof Hook": "Gancho de Prueba",
    "Case Breakdown": "Análisis del Caso", "Deep Analysis": "Análisis Profundo",
    "Repeatable Framework": "Marco Repetible", "Action CTA": "CTA de Acción",
    "Myth Hook": "Gancho del Mito", "The Common Belief": "La Creencia Común",
    "Why It Fails": "Por Qué Falla", "The Real Truth": "La Verdad Real",
    "Apply It & CTA": "Aplícalo y CTA", "Prediction Hook": "Gancho de Predicción",
    "Current Landscape": "Panorama Actual", "The Shift Coming": "El Cambio que Viene",
    "How to Prepare": "Cómo Prepararse", "First-Mover CTA": "CTA de Pionero",
  },
  Hindi: {
    "Opening Hook": "शुरुआती हुक", Problem: "समस्या", Agitate: "उत्तेजना",
    "Solution & Proof": "समाधान और प्रमाण", "CTA & Next Video": "CTA और अगला वीडियो",
    "Story Hook": "कहानी हुक", "The Setup": "भूमिका", "The Conflict": "संघर्ष",
    "The Transformation": "बदलाव", "Lesson & CTA": "सीख और CTA",
    "Challenge Hook": "चैलेंज हुक", "The Stakes": "दांव", "The Attempt": "प्रयास",
    "Result & Reveal": "नतीजा और खुलासा", "Proof Hook": "प्रमाण हुक",
    "Case Breakdown": "केस विश्लेषण", "Deep Analysis": "गहन विश्लेषण",
    "Repeatable Framework": "दोहराने योग्य ढांचा", "Action CTA": "एक्शन CTA",
    "Myth Hook": "मिथक हुक", "The Common Belief": "आम धारणा",
    "Why It Fails": "यह क्यों विफल होता है", "The Real Truth": "असली सच",
    "Apply It & CTA": "लागू करें और CTA", "Prediction Hook": "भविष्यवाणी हुक",
    "Current Landscape": "वर्तमान परिदृश्य", "The Shift Coming": "आने वाला बदलाव",
    "How to Prepare": "तैयारी कैसे करें", "First-Mover CTA": "अग्रणी CTA",
  },
  German: {
    "Opening Hook": "Eröffnungs-Hook", Problem: "Problem", Agitate: "Verstärken",
    "Solution & Proof": "Lösung & Beweis", "CTA & Next Video": "CTA & Nächstes Video",
    "Story Hook": "Story-Hook", "The Setup": "Die Ausgangslage", "The Conflict": "Der Konflikt",
    "The Transformation": "Die Transformation", "Lesson & CTA": "Lektion & CTA",
    "Challenge Hook": "Challenge-Hook", "The Stakes": "Der Einsatz", "The Attempt": "Der Versuch",
    "Result & Reveal": "Ergebnis & Enthüllung", "Proof Hook": "Beweis-Hook",
    "Case Breakdown": "Fallanalyse", "Deep Analysis": "Tiefenanalyse",
    "Repeatable Framework": "Wiederholbares Framework", "Action CTA": "Aktions-CTA",
    "Myth Hook": "Mythos-Hook", "The Common Belief": "Die gängige Annahme",
    "Why It Fails": "Warum es scheitert", "The Real Truth": "Die echte Wahrheit",
    "Apply It & CTA": "Anwenden & CTA", "Prediction Hook": "Prognose-Hook",
    "Current Landscape": "Aktuelle Lage", "The Shift Coming": "Der kommende Wandel",
    "How to Prepare": "Wie du dich vorbereitest", "First-Mover CTA": "Vorreiter-CTA",
  },
};

export const FRAMEWORKS: Record<number, Framework> = {
  1: {
    id: 1, code: "FW 01", name: "PAS Framework",
    beats: [
      {
        section: "Opening Hook", weight: 1,
        lines: [
          (t, a) => `Most ${a} will pour weeks into ${t} and still get ignored — because they skip one structural rule. In the next few minutes I'll show you exactly why ${t} stalls, and how to flip it starting today.`,
          (t, a) => `Stick with me, because by the end you'll have a repeatable structure you can drop onto your very next video about ${t}.`,
          (t) => `No fluff and no theory — just the exact moves I'd make if I were starting ${t} from zero right now.`,
        ],
        visual: (t) => `Pattern interrupt: zoom on face, overlay bold text "${t.toUpperCase()}" with a red slash.`,
        audio: "Deep bass drop.", tip: "Intense eye contact. Do not blink for the first 6 seconds.",
        warning: "Land the hook in under 30s or you bleed the curiosity loop.",
      },
      {
        section: "Problem", weight: 3,
        lines: [
          (t, a) => `Here's the reality for ${a}: the algorithm doesn't reward effort on ${t}, it rewards retention. The moment you dive into details without tension, you kill curiosity — and I fell into that exact trap for two years.`,
          (t) => `Think about the last time you clicked a video on ${t} and left within ten seconds. That drop-off is exactly what you're accidentally creating.`,
          (t, a) => `The painful part is that ${a} often do everything 'right' on paper — good camera, clean edit — and still watch ${t} flatline.`,
        ],
        visual: () => `Screen-cap of a declining retention curve with red highlights.`,
        audio: "Subtle analog static.", tip: "Self-deprecating, conversational pacing.", warning: null,
      },
      {
        section: "Agitate", weight: 3,
        lines: [
          (t, a) => `If you don't fix this, ${t} keeps uploading into the void. Your numbers stay flat, your revenue stays at zero, and the ${a} you want to reach never even see you.`,
          (t) => `Every week you wait, a competitor covering ${t} is compounding watch-time you will never get back.`,
          () => `And the worst part? It is almost never a talent problem — it's a structure problem hiding in plain sight.`,
        ],
        visual: () => `Flat subscriber graph, then a glowing green lock clicking open.`,
        audio: "Heartbeat drum fades in.", tip: "Lift your pitch slightly. Sound urgent.",
        warning: "High drop-off zone — pin an on-screen text promise of the fix.",
      },
      {
        section: "Solution & Proof", weight: 5,
        lines: [
          (t, a) => `Here's the 3-step blueprint for ${t}: structure the hook, add a pattern interrupt every 15 seconds, then place a visual payoff. Using this exact model, a ${a}-focused channel went from 2,000 to 240,000 views in three weeks.`,
          (t, a) => `Step one is the hook contract — promise a specific outcome in the first line so ${a} know exactly why to stay through your ${t} video.`,
          () => `Steps two and three are where retention compounds: keep re-earning attention, then reward it with proof they can actually see on screen.`,
        ],
        visual: () => `Side-by-side analytics screenshots, "240,000" in green.`,
        audio: "Success chime.", tip: "High energy. Point to graphics as they appear.", warning: null,
      },
      {
        section: "CTA & Next Video", weight: 2,
        lines: [
          (t) => `I packed this whole ${t} blueprint into a free 1-page checklist — it's in the pinned comment. And if you want to film these in under an hour, this next video breaks it down.`,
          (t) => `Save it, apply it to your next upload about ${t}, and watch the shape of your retention graph change.`,
        ],
        visual: () => `End-screen cards; point to the right corner.`,
        audio: "Upbeat synth fades out.", tip: "Smile, point, end abruptly to hold session duration.",
        warning: "Never say 'thanks for watching' — it triggers an instant click-away.",
      },
    ],
  },
  2: {
    id: 2, code: "FW 02", name: "Story Framework",
    beats: [
      {
        section: "Story Hook", weight: 1,
        lines: [
          (t, a) => `Two years ago I knew nothing about ${t}, and it nearly cost me everything. If you're one of the ${a} staring at the same wall, stay — because this is the exact moment it turned around.`,
          () => `I'm going to tell you the whole thing, mistakes included, because the mistakes are where the real lesson lives.`,
        ],
        visual: (t) => `Cinematic push-in, moody lighting, caption: "How ${t} changed everything".`,
        audio: "Soft piano swell.", tip: "Slow, vulnerable delivery. Let the first line breathe.",
        warning: "Open mid-story — never start with 'hi guys, welcome back'.",
      },
      {
        section: "The Setup", weight: 3,
        lines: [
          (t, a) => `Picture where most ${a} start with ${t}: confident, busy, and completely stuck. That was me — doing everything 'right' and watching nothing move.`,
          (t) => `I had the tools, the plan, the motivation. What I didn't have was the one thing that actually makes ${t} work.`,
          () => `And the longer nothing changed, the more I convinced myself the problem was me.`,
        ],
        visual: () => `B-roll of late-night desk work, calendar pages flipping.`,
        audio: "Ambient room tone.", tip: "Paint a scene the viewer recognizes themselves in.", warning: null,
      },
      {
        section: "The Conflict", weight: 3,
        lines: [
          (t) => `Then it broke. The approach to ${t} I trusted collapsed in public, and I had to admit the whole model was wrong.`,
          () => `For a week I genuinely thought about quitting. It's embarrassing to say out loud, but that's exactly where the turn happened.`,
        ],
        visual: () => `Sharp cut to red analytics dip; freeze-frame on the low point.`,
        audio: "Tension string rises, then silence.", tip: "Drop your voice at the turning point.",
        warning: "This is the retention valley — keep the cut tight and fast.",
      },
      {
        section: "The Transformation", weight: 4,
        lines: [
          (t, a) => `What changed everything with ${t} was one shift: stop performing, start systemizing. Within weeks the results compounded — and it's the same shift any of these ${a} can copy.`,
          (t) => `The moment I treated ${t} as a repeatable system instead of a daily gamble, the pressure dropped and the numbers climbed.`,
          () => `It wasn't more effort. It was the same effort pointed at the thing that actually mattered.`,
        ],
        visual: () => `Upward montage, green metrics climbing, confident reshoot.`,
        audio: "Hopeful synth builds.", tip: "Energy lifts here — the viewer should feel the climb.", warning: null,
      },
      {
        section: "Lesson & CTA", weight: 2,
        lines: [
          (t) => `The lesson: ${t} rewards the people who stay in the game long enough to fix the system. I wrote the full playbook — link's below. Watch this next to see step one in action.`,
          () => `If this hit home, the next video is where the story actually gets good.`,
        ],
        visual: () => `End screen with the next-video card.`,
        audio: "Warm outro pad.", tip: "Land the lesson as one quotable line, then exit.",
        warning: "Don't over-explain the moral — say it once.",
      },
    ],
  },
  3: {
    id: 3, code: "FW 03", name: "Challenge Framework",
    beats: [
      {
        section: "Challenge Hook", weight: 1,
        lines: [
          (t, a) => `I gave myself one rule: master ${t} in 7 days, on camera, no edits hiding the failures. If you're one of the ${a} who keeps 'planning,' this is what actually happens when you just start.`,
          () => `Seven days, filmed start to finish, with a real deadline and real consequences.`,
        ],
        visual: (t) => `Countdown timer "7 DAYS" slams on screen over a shot of ${t} workspace.`,
        audio: "Punchy percussion hit.", tip: "Say the challenge and the deadline in the first sentence.",
        warning: "State the stakes immediately or the premise feels low.",
      },
      {
        section: "The Stakes", weight: 2,
        lines: [
          (t, a) => `Here's why it mattered: if ${t} didn't work in a week, I'd prove every doubter right. For most ${a}, that fear is exactly what keeps them frozen.`,
          () => `I made it public on purpose — nothing forces focus like the possibility of failing where everyone can see.`,
        ],
        visual: () => `Split screen: "win" vs "humiliation" outcome cards.`,
        audio: "Low pulsing drone.", tip: "Make the downside real and personal.", warning: null,
      },
      {
        section: "The Attempt", weight: 4,
        lines: [
          (t) => `Day one through three with ${t} were a disaster — wrong assumptions, dead ends, almost quit twice.`,
          () => `Then on day four, one small tweak changed the entire trajectory, and everything I'd struggled with suddenly clicked.`,
          (t) => `I'll show you the exact change, because it's the part of ${t} nobody tells you about.`,
        ],
        visual: () => `Fast time-lapse of attempts, red X overlays, then a green check.`,
        audio: "Building montage beat.", tip: "Keep cuts fast; show real struggle, not a highlight reel.",
        warning: "Mid-section drop risk — add an open loop teasing day four.",
      },
      {
        section: "Result & Reveal", weight: 3,
        lines: [
          (t, a) => `By day seven, ${t} actually clicked — and the result beat what I thought was possible. Here's the exact number, and the one move any ${a} can steal.`,
          () => `I didn't just hit the goal, I understood why it worked — which matters far more than the number itself.`,
        ],
        visual: () => `Reveal the final metric in large green type.`,
        audio: "Triumphant sting.", tip: "Pause before the number for tension.", warning: null,
      },
      {
        section: "CTA & Next Video", weight: 2,
        lines: [
          (t) => `If you want the 7-day ${t} plan I followed, it's free in the description. And this next video is the challenge that came after — watch how far it went.`,
          () => `Do the challenge yourself, then tell me what broke first — I read every comment.`,
        ],
        visual: () => `End-screen cards, point to next video.`,
        audio: "Upbeat outro.", tip: "Tie the CTA to the next challenge for binge viewing.",
        warning: "Keep the outro under 15 seconds.",
      },
    ],
  },
  4: {
    id: 4, code: "FW 04", name: "Case Study Framework",
    beats: [
      {
        section: "Proof Hook", weight: 1,
        lines: [
          (t, a) => `This ${a} built a result with ${t} that most people would call impossible — no ads, no audience, no budget. In this video I'm reverse-engineering their exact playbook.`,
          () => `Every number I show you is real, and every step is one you can copy by the end of this video.`,
        ],
        visual: (t) => `Whiteboard graphic of a big result with an up-arrow, "${t}" labeled.`,
        audio: "Whoosh into upbeat percussion.", tip: "Deliver the numbers fast and with excitement.",
        warning: "No greetings — speak within 0.5s of the video starting.",
      },
      {
        section: "Case Breakdown", weight: 3,
        lines: [
          (t, a) => `Let's look at the timeline. They were a struggling ${a}, generating almost nothing — until they applied ${t} in one focused move that brought in a flood of high-intent leads.`,
          () => `What's wild is how ordinary the starting point was — no special advantage, just a decision to do one thing differently.`,
          (t) => `I mapped the whole ${t} sequence week by week so you can see exactly when the momentum turned.`,
        ],
        visual: () => `Show their channel/homepage, scroll to the breakout moment.`,
        audio: "Mouse-click SFX.", tip: "Sound analytical, like a researcher walking the data.",
        warning: "Hit the screen transition by 0:45 or you lose ~8%.",
      },
      {
        section: "Deep Analysis", weight: 4,
        lines: [
          (t) => `So how did ${t} actually work for them? It comes down to one mechanism: lead with the end result, then bridge backward to the steps. Curiosity does the rest.`,
          () => `The reason this beats the 'explain everything' approach is simple — people follow a promise, not a syllabus.`,
          (t) => `Once you see this mechanism, you'll spot it in every piece of ${t} content that goes viral.`,
        ],
        visual: () => `Draw a bridge diagram: "Problem —— (Bridge) —— Result".`,
        audio: "Chalk-draw SFX.", tip: "Slow down. Emphasize the named mechanism.", warning: null,
      },
      {
        section: "Repeatable Framework", weight: 3,
        lines: [
          (t, a) => `Here's how any ${a} copies it with ${t}: one, find a concrete win; two, map the timeline; three, reveal the specific tool. No fancy gear — just a screen recorder.`,
          () => `Do it in that order and the story writes itself, even if you've never made a video before.`,
        ],
        visual: () => `Animated 3-step bullet list.`,
        audio: "Slide-transition sweeps.", tip: "Confident and encouraging — demystify the difficulty.", warning: null,
      },
      {
        section: "Action CTA", weight: 2,
        lines: [
          (t) => `If you want help building this ${t} engine for your business, the link's in the description. And to see how we rank it #1 in search, watch this next.`,
          () => `Start with step one this week — momentum beats perfect every time.`,
        ],
        visual: () => `Point down for link, then to the next-video card.`,
        audio: "Ambient electronic close.", tip: "Frame the CTA as the logical next step, not a pitch.",
        warning: "Keep the end-screen card visible 15s+ for CTR.",
      },
    ],
  },
  5: {
    id: 5, code: "FW 05", name: "Myth-Truth Framework",
    beats: [
      {
        section: "Myth Hook", weight: 1,
        lines: [
          (t, a) => `Almost everything ${a} are told about ${t} is wrong — and the most popular advice is quietly costing you the most. Let me show you the truth nobody's selling.`,
          () => `I believed the myth too, right up until the data forced me to change my mind on camera.`,
        ],
        visual: (t) => `Bold text "MYTH" stamped over a generic ${t} thumbnail, then shattered.`,
        audio: "Glass-break SFX.", tip: "Confident, almost contrarian tone.",
        warning: "Name the myth in the first line — no slow build.",
      },
      {
        section: "The Common Belief", weight: 2,
        lines: [
          (t, a) => `Here's the belief: that ${t} is about working harder, posting more, doing what everyone else does. It feels right, which is exactly why ${a} keep repeating it.`,
          () => `And to be fair, it's not stupid advice — it's just advice that stopped working a while ago.`,
        ],
        visual: () => `Montage of identical "common advice" clips.`,
        audio: "Flat, ironic underscore.", tip: "Steelman the myth fairly before you break it.", warning: null,
      },
      {
        section: "Why It Fails", weight: 3,
        lines: [
          (t) => `But here's why ${t} breaks under that belief: the mechanism it relies on stopped working years ago. The data shows the opposite of what the gurus claim.`,
          () => `Look at this chart — if the popular advice were true, this line would go up. It goes down.`,
          (t) => `That single gap is why so many people grind at ${t} and get nowhere.`,
        ],
        visual: () => `Chart contradicting the popular claim, red trend line.`,
        audio: "Record-scratch, then tension.", tip: "Let the contradiction land — pause on the chart.",
        warning: "Back the claim with a visible data point or it reads as opinion.",
      },
      {
        section: "The Real Truth", weight: 3,
        lines: [
          (t, a) => `The real truth about ${t}: it's a leverage game, not a volume game. The ${a} who win do less, but they do the one thing that compounds.`,
          () => `Once you internalize that, the whole strategy simplifies — you stop chasing everything and start owning one thing.`,
        ],
        visual: () => `Single highlighted lever vs a pile of busywork.`,
        audio: "Clarifying chime.", tip: "This is the payoff — slow, deliberate delivery.", warning: null,
      },
      {
        section: "Apply It & CTA", weight: 2,
        lines: [
          (t) => `So apply it: drop the busywork, double down on the leverage point in ${t}. I put the full breakdown in a free guide below — and this next video proves it with real numbers.`,
          () => `Pick the one lever today. Ignore the rest for a week and watch what happens.`,
        ],
        visual: () => `End-screen cards; point to next video.`,
        audio: "Upbeat outro.", tip: "Give one concrete action before the CTA.",
        warning: "Don't introduce a second myth at the end.",
      },
    ],
  },
  6: {
    id: 6, code: "FW 06", name: "Future Prediction Framework",
    beats: [
      {
        section: "Prediction Hook", weight: 1,
        lines: [
          (t, a) => `Within 18 months, ${t} will look nothing like it does today — and the ${a} who move now will own the window everyone else misses. Here's exactly what's coming.`,
          () => `This isn't a hot take. It's a pattern I've watched play out three times already, and it's starting again.`,
        ],
        visual: (t) => `Futuristic title card: "The Future of ${t}" with a forward-motion sweep.`,
        audio: "Cinematic riser.", tip: "Deliver the prediction with total conviction.",
        warning: "Make the timeframe specific — vague predictions don't retain.",
      },
      {
        section: "Current Landscape", weight: 2,
        lines: [
          (t, a) => `Right now, most ${a} treat ${t} like it's stable. It isn't. The signals are already shifting under the surface, and almost nobody is reading them.`,
          () => `The people who look 'lucky' in two years are the ones quietly repositioning right now.`,
        ],
        visual: () => `Map of the current "state of play" with subtle cracks appearing.`,
        audio: "Low ambient pulse.", tip: "Establish the status quo so the shift feels bigger.", warning: null,
      },
      {
        section: "The Shift Coming", weight: 4,
        lines: [
          (t) => `Here's the shift: ${t} is moving from manual to automated, from crowded to leverage-driven. I'll show you the three signals proving it's already started.`,
          () => `Signal one is in the tooling, signal two is in the money, and signal three is in who's suddenly paying attention.`,
          (t) => `Put them together and the direction of ${t} is impossible to unsee.`,
        ],
        visual: () => `Three rising signal lines converging on a tipping point.`,
        audio: "Building tech underscore.", tip: "Number the signals so they're easy to follow.",
        warning: "This is the core — pace it so each signal gets a beat.",
      },
      {
        section: "How to Prepare", weight: 3,
        lines: [
          (t, a) => `So how do ${a} get ahead of ${t}? Position now: build the skill, claim the lane, and ship before the wave is obvious. Early beats perfect every single time.`,
          () => `You don't need to bet everything — you need one small, early move you can compound.`,
        ],
        visual: () => `Checklist of 3 preparation moves animating in.`,
        audio: "Motivational build.", tip: "Make 'start now' feel urgent but achievable.", warning: null,
      },
      {
        section: "First-Mover CTA", weight: 2,
        lines: [
          (t) => `I mapped the full ${t} roadmap into a free guide — grab it below before the window closes. And this next video shows the first move to make this week.`,
          () => `The best time to move was a year ago. The second-best time is the moment this video ends.`,
        ],
        visual: () => `End-screen cards; point to next video.`,
        audio: "Forward-driving outro.", tip: "Tie the CTA to first-mover advantage.",
        warning: "End on momentum — don't trail off.",
      },
    ],
  },
};

function fmt(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.round(totalSec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function localizeSection(section: string, language: string): string {
  if (language === "English" || !SECTION_I18N[language]) return section;
  return SECTION_I18N[language][section] || section;
}

// How many of a beat's layered lines to include, scaled by video length.
// Shorter videos → the tight core; longer videos → the full, detailed script.
function linesForDuration(available: number, durationMin: number): number {
  const ratio = Math.min(1, durationMin / MAX_DURATION);
  return Math.max(1, Math.min(available, Math.round(ratio * available)));
}

export type BuildParams = {
  topic: string;
  audience: string;
  durationMin: number;
  frameworkId: number;
  language?: string;
};

export function buildScript({
  topic,
  audience,
  durationMin,
  frameworkId,
  language = "English",
}: BuildParams): ScriptBlock[] {
  const fw = FRAMEWORKS[frameworkId] || FRAMEWORKS[4];
  const safeTopic = (topic || "your topic").trim();
  const safeAudience = (audience || "creators").trim();
  const totalSec = Math.max(60, durationMin * 60);

  const weightSum = fw.beats.reduce((acc, b) => acc + b.weight, 0);
  let cursor = 0;

  return fw.beats.map((beat, i) => {
    const isLast = i === fw.beats.length - 1;
    const start = cursor;
    const dur = Math.round((beat.weight / weightSum) * totalSec);
    const end = isLast ? totalSec : Math.min(totalSec, start + dur);
    cursor = end;

    const lineCount = linesForDuration(beat.lines.length, durationMin);
    const script = beat.lines
      .slice(0, lineCount)
      .map((fn) => fn(safeTopic, safeAudience))
      .join(" ");

    return {
      time: `${fmt(start)} - ${fmt(end)}`,
      section: localizeSection(beat.section, language),
      script,
      visual: beat.visual(safeTopic),
      audio: beat.audio,
      tip: beat.tip,
      warning: beat.warning ?? null,
    };
  });
}

export function buildHooks(topic: string, audience: string): string[] {
  const t = (topic || "your topic").trim();
  const a = (audience || "creators").trim();
  return [
    `How I used ${t} to win over ${a} in under 14 days.`,
    `The biggest lie ${a} believe about ${t}…`,
    `Why 2026 is the golden window for ${t}.`,
  ];
}

export function parseDurationMin(label: string): number {
  const n = parseInt(label, 10);
  return Number.isFinite(n) && n > 0 ? n : 12;
}
