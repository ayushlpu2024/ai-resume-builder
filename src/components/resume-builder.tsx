"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { ConversationStep, ResumeData } from "@/types/resume";
import { useResumeStore } from "@/hooks/use-resume-store";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { Header } from "@/components/header";
import { ChatBubble } from "@/components/chat-bubble";
import { ChatInput } from "@/components/chat-input";
import { TypingIndicator } from "@/components/typing-indicator";
import { StepProgress } from "@/components/step-progress";
import { ResumePreview } from "@/components/resume-preview";
import { TemplateSelector } from "@/components/template-selector";
import { DownloadButton } from "@/components/download-button";
import { defaultResumeData } from "@/lib/resume-defaults";
import { MessageSquare, Eye } from "lucide-react";

/**
 * Map a conversation step to the next step, given the user just answered.
 * The AI greeting has already happened, so the first user message triggers "name" → "contact", etc.
 */
const NEXT_STEP: Record<ConversationStep, ConversationStep> = {
  greeting: "name",
  name: "contact",
  contact: "summary",
  summary: "education",
  education: "experience",
  experience: "skills",
  skills: "projects",
  projects: "certifications",
  certifications: "complete",
  complete: "complete",
};

export default function ResumeBuilder() {
  const {
    resumeData,
    updateResumeData,
    messages,
    addMessage,
    currentStep,
    setCurrentStep,
    isLoading,
    setIsLoading,
    template,
    setTemplate,
    resetResume,
    hasHydrated,
  } = useResumeStore();

  const { isDark, toggle: toggleDark } = useDarkMode();

  const bottomRef = useAutoScroll(messages);
  const [streamingText, setStreamingText] = useState("");
  // Mobile tab toggle: "chat" or "preview"
  const [mobileTab, setMobileTab] = useState<"chat" | "preview">("chat");


  // ── Kick off the greeting on first mount ──
  useEffect(() => {
    if (messages.length === 0 && currentStep === "greeting") {
      triggerAI("greeting", "Hello! I want to build my resume.", defaultResumeData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Stream an AI chat response ──
  const triggerAI = useCallback(
    async (
      step: ConversationStep,
      userMsg: string,
      dataSnapshot: ResumeData
    ) => {
      setIsLoading(true);
      setStreamingText("");

      try {
        // Build conversation history (last 10 messages for context)
        const history = messages.slice(-10).map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "chat",
            step,
            userMessage: userMsg,
            resumeData: dataSnapshot,
            conversationHistory: history,
          }),
        });

        if (!res.ok) throw new Error("Chat API error");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            fullText += chunk;
            setStreamingText(fullText);
          }
        }

        addMessage("assistant", fullText);
        setStreamingText("");
      } catch (err) {
        console.error("AI chat error:", err);
        addMessage(
          "assistant",
          "I'm sorry, I encountered an error. Please make sure your OpenAI API key is configured correctly in the `.env.local` file, then try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, addMessage, setIsLoading]
  );

  // ── Extract structured data from user message ──
  const extractData = useCallback(
    async (
      step: ConversationStep,
      userMsg: string,
      currentData: ResumeData
    ): Promise<ResumeData> => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "extract",
            step,
            userMessage: userMsg,
            resumeData: currentData,
          }),
        });

        if (!res.ok) return currentData;

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fullText += decoder.decode(value, { stream: true });
          }
        }

        // Try to parse the JSON — the model sometimes wraps in ```json
        let cleaned = fullText.trim();
        if (cleaned.startsWith("```")) {
          cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
        }

        const parsed = JSON.parse(cleaned) as ResumeData;
        return parsed;
      } catch (err) {
        console.error("Extraction error:", err);
        return currentData;
      }
    },
    []
  );

  // ── Handle user message ──
  const handleSend = useCallback(
    async (text: string) => {
      addMessage("user", text);

      // 1. Extract structured data in background
      const updatedData = await extractData(currentStep, text, resumeData);
      updateResumeData(updatedData);

      // 2. Advance step
      const nextStep = NEXT_STEP[currentStep];
      setCurrentStep(nextStep);

      // 3. Stream AI response for the new step
      await triggerAI(nextStep, text, updatedData);
    },
    [
      addMessage,
      currentStep,
      resumeData,
      extractData,
      updateResumeData,
      setCurrentStep,
      triggerAI,
    ]
  );

  // ── Reset handler ──
  const handleReset = useCallback(() => {
    if (window.confirm("Start over? This will clear your current resume.")) {
      resetResume();
      // Re-trigger greeting
      setTimeout(() => {
        triggerAI("greeting", "Hello! I want to build my resume.", defaultResumeData);
      }, 100);
    }
  }, [resetResume, triggerAI]);

  // ── Prevent hydration mismatch by waiting for mount ──
  // MUST come after ALL hook declarations (useState, useCallback, useEffect, etc.)
  if (!hasHydrated) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Header isDark={isDark} onToggleDark={toggleDark} onReset={handleReset} />

      {/* Mobile tab bar */}
      <div className="flex lg:hidden border-b border-gray-200/60 dark:border-white/10 bg-white/60 dark:bg-gray-950/60 backdrop-blur-md">
        <button
          onClick={() => setMobileTab("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
            mobileTab === "chat"
              ? "text-violet-600 dark:text-violet-400 border-b-2 border-violet-500"
              : "text-gray-500 dark:text-gray-500"
          }`}
        >
          <MessageSquare size={16} />
          Chat
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
            mobileTab === "preview"
              ? "text-violet-600 dark:text-violet-400 border-b-2 border-violet-500"
              : "text-gray-500 dark:text-gray-500"
          }`}
        >
          <Eye size={16} />
          Preview
        </button>
      </div>

      {/* Main split layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT: Chat Panel ── */}
        <div
          className={`flex flex-col w-full lg:w-1/2 xl:w-[45%] border-r border-gray-200/60 dark:border-white/10 ${
            mobileTab !== "chat" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Step progress */}
          <div className="border-b border-gray-200/60 dark:border-white/10 bg-white/60 dark:bg-gray-950/60 backdrop-blur-md">
            <StepProgress currentStep={currentStep} />
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
            ))}

            {/* Streaming text */}
            {isLoading && streamingText && (
              <ChatBubble
                role="assistant"
                content={streamingText}
                isStreaming
              />
            )}

            {/* Typing indicator */}
            {isLoading && !streamingText && <TypingIndicator />}

            {/* Auto-scroll anchor */}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <ChatInput
            onSend={handleSend}
            disabled={isLoading}
            placeholder={
              currentStep === "complete"
                ? "Ask me to edit any section…"
                : "Type your answer…"
            }
          />
        </div>

        {/* ── RIGHT: Resume Preview Panel ── */}
        <div
          className={`flex flex-col w-full lg:w-1/2 xl:w-[55%] bg-gray-100/50 dark:bg-gray-900/50 ${
            mobileTab !== "preview" ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200/60 dark:border-white/10 bg-white/60 dark:bg-gray-950/60 backdrop-blur-md">
            <TemplateSelector selected={template} onSelect={setTemplate} />
            <DownloadButton />
          </div>

          {/* Preview scroll area */}
          <div className="flex-1 overflow-y-auto p-6">
            <ResumePreview data={resumeData} template={template} />
          </div>
        </div>
      </div>
    </div>
  );
}
