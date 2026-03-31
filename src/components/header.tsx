"use client";

import React from "react";
import { Moon, Sun, RotateCcw, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  onReset: () => void;
}

/**
 * Top navigation bar with logo, dark-mode toggle, and reset button.
 */
export function Header({ isDark, onToggleDark, onReset }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl z-50">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <FileText size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent leading-tight">
            AI Resume Builder
          </h1>
          <p className="text-[10px] text-gray-400 dark:text-gray-600 font-medium -mt-0.5">
            Build your perfect resume with AI
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          title="Start over"
          className={cn(
            "p-2 rounded-lg text-gray-500 dark:text-gray-400 transition-all duration-200",
            "hover:bg-gray-100 dark:hover:bg-white/5 hover:text-red-500"
          )}
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={onToggleDark}
          title="Toggle dark mode"
          className={cn(
            "p-2 rounded-lg text-gray-500 dark:text-gray-400 transition-all duration-200",
            "hover:bg-gray-100 dark:hover:bg-white/5"
          )}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
