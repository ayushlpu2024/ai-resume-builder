"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

/**
 * A single chat bubble — left-aligned for assistant, right-aligned for user.
 * Supports a blinking cursor when streaming.
 */
export function ChatBubble({ role, content, isStreaming }: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 w-full animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold",
          isUser
            ? "bg-gradient-to-br from-violet-500 to-fuchsia-500"
            : "bg-gradient-to-br from-cyan-500 to-blue-600"
        )}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "relative max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
          isUser
            ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-tr-sm"
            : "bg-white/80 dark:bg-white/10 text-gray-800 dark:text-gray-100 rounded-tl-sm border border-gray-200/60 dark:border-white/10 backdrop-blur-sm"
        )}
      >
        {content}
        {isStreaming && (
          <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse rounded-sm" />
        )}
      </div>
    </div>
  );
}
