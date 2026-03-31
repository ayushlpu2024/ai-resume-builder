import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { buildSystemPrompt, buildExtractionPrompt } from "@/lib/prompts";
import type { ConversationStep, ResumeData } from "@/types/resume";

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? "",
});

/**
 * POST /api/chat
 * Handles two modes:
 *   1. "chat"    — streams the AI's conversational reply
 *   2. "extract" — returns structured resume JSON from user message
 */
export async function POST(request: Request) {
  const body = await request.json();
  const {
    mode,
    step,
    userMessage,
    resumeData,
    conversationHistory,
  }: {
    mode: "chat" | "extract";
    step: ConversationStep;
    userMessage: string;
    resumeData: ResumeData;
    conversationHistory?: { role: "user" | "assistant"; content: string }[];
  } = body;

  // ── Extract mode: return structured JSON ──────────────────────
  if (mode === "extract") {
    const extractionPrompt = buildExtractionPrompt(
      step,
      userMessage,
      resumeData
    );

    const result = await streamText({
      model: openai("gpt-4o"),
      messages: [{ role: "user", content: extractionPrompt }],
      temperature: 0.1,
    });

    return result.toTextStreamResponse();
  }

  // ── Chat mode: stream conversational reply ────────────────────
  const systemPrompt = buildSystemPrompt(step, resumeData);

  const messages: { role: "user" | "assistant" | "system"; content: string }[] =
    [
      { role: "system", content: systemPrompt },
      ...(conversationHistory ?? []),
      { role: "user", content: userMessage },
    ];

  const result = await streamText({
    model: openai("gpt-4o"),
    messages,
    temperature: 0.7,
    maxOutputTokens: 1024,
  });

  return result.toTextStreamResponse();
}
