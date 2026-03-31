"use client";

import React from "react";
import type { ResumeTemplate } from "@/types/resume";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";

const TEMPLATES: { key: ResumeTemplate; label: string; desc: string }[] = [
  { key: "modern", label: "Modern", desc: "Violet gradient header" },
  { key: "classic", label: "Classic", desc: "Traditional black & white" },
  { key: "minimal", label: "Minimal", desc: "Clean borderless" },
];

interface TemplateSelectorProps {
  selected: ResumeTemplate;
  onSelect: (t: ResumeTemplate) => void;
}

/**
 * Horizontal radio-button group for picking a resume template.
 */
export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Palette size={14} className="text-gray-400" />
      {TEMPLATES.map((t) => (
        <button
          key={t.key}
          onClick={() => onSelect(t.key)}
          title={t.desc}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border",
            selected === t.key
              ? "bg-violet-500 text-white border-violet-500 shadow-md shadow-violet-500/20"
              : "bg-white/60 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-violet-300 dark:hover:border-violet-500/30"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
