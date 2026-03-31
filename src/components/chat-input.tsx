"use client";

import React, { useState, useRef, type FormEvent, type KeyboardEvent } from "react";
import { SendHorizonal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Chat text-area with send button.
 * Supports Enter to send, Shift+Enter for new line.
 */
export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type your answer…",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 p-3 bg-white/60 dark:bg-white/5 border-t border-gray-200/60 dark:border-white/10 backdrop-blur-md"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        className={cn(
          "flex-1 resize-none rounded-xl px-4 py-3 text-sm bg-gray-100/80 dark:bg-white/10",
          "border border-gray-200/60 dark:border-white/10",
          "text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500",
          "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50",
          "transition-all duration-200",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={cn(
          "flex-shrink-0 p-3 rounded-xl text-white transition-all duration-200",
          "bg-gradient-to-r from-violet-500 to-fuchsia-500",
          "hover:from-violet-600 hover:to-fuchsia-600 hover:shadow-lg hover:shadow-violet-500/25",
          "active:scale-95",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
        )}
      >
        <SendHorizonal size={18} />
      </button>
    </form>
  );
}
