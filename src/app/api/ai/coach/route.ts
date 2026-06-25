import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { message, engine = 'openai' } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (engine === 'openai') {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are the AI YouTube Growth Coach. Provide actionable, data-driven advice for YouTube creators." },
          { role: "user", content: message }
        ],
      });
      return NextResponse.json({ response: completion.choices[0].message.content });
    } else {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are the AI YouTube Growth Coach. Provide actionable, data-driven advice for YouTube creators.\n\nUser: ${message}`,
      });
      return NextResponse.json({ response: response.text });
    }

  } catch (error) {
    console.error("AI engine error:", error);
    return NextResponse.json({ error: "Failed to generate AI response" }, { status: 500 });
  }
}
