"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  ResumeData,
  ChatMessage,
  ConversationStep,
  ResumeTemplate,
} from "@/types/resume";
import { defaultResumeData } from "@/lib/resume-defaults";
import { generateId } from "@/lib/utils";

/** Step order for the guided conversation flow */
const STEP_ORDER: ConversationStep[] = [
  "greeting",
  "name",
  "contact",
  "summary",
  "education",
  "experience",
  "skills",
  "projects",
  "certifications",
  "complete",
];

/**
 * Global-ish resume store hook.
 * Manages resume data, chat messages, conversation step, and template.
 */
export function useResumeStore() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>("greeting");
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState<ResumeTemplate>("modern");
  const [hasHydrated, setHasHydrated] = useState(false);

  // ── Sync with localStorage AFTER mount to avoid hydration mismatch ──
  useEffect(() => {
    const savedData = localStorage.getItem("resumeData");
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData) as ResumeData);
      } catch (err) {
        console.error("Failed to parse saved resume data:", err);
      }
    }
    setHasHydrated(true);
  }, []);

  /** Persist resume to localStorage whenever it changes */
  const updateResumeData = useCallback((data: ResumeData) => {
    setResumeData(data);
    if (typeof window !== "undefined") {
      localStorage.setItem("resumeData", JSON.stringify(data));
    }
  }, []);

  /** Add a message to the chat */
  const addMessage = useCallback(
    (role: "user" | "assistant", content: string) => {
      const msg: ChatMessage = {
        id: generateId(),
        role,
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, msg]);
      return msg;
    },
    []
  );

  /** Advance to the next conversation step */
  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => {
      const idx = STEP_ORDER.indexOf(prev);
      if (idx < STEP_ORDER.length - 1) {
        return STEP_ORDER[idx + 1];
      }
      return prev;
    });
  }, []);

  /** Jump to a specific step (for editing) */
  const goToStep = useCallback((step: ConversationStep) => {
    setCurrentStep(step);
  }, []);

  /** Reset everything */
  const resetResume = useCallback(() => {
    setResumeData(defaultResumeData);
    setMessages([]);
    setCurrentStep("greeting");
    if (typeof window !== "undefined") {
      localStorage.removeItem("resumeData");
    }
  }, []);

  return {
    resumeData,
    updateResumeData,
    messages,
    setMessages,
    addMessage,
    currentStep,
    setCurrentStep,
    advanceStep,
    goToStep,
    isLoading,
    setIsLoading,
    template,
    setTemplate,
    resetResume,
    hasHydrated,
  };
}

