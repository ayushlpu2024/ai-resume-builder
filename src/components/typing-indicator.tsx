"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Typing indicator (3 bouncing dots) shown while the AI streams.
 */
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 animate-fade-in">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-bold">
        AI
      </div>
      {/* Dots */}
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/80 dark:bg-white/10 border border-gray-200/60 dark:border-white/10 backdrop-blur-sm">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "block w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
              )}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
