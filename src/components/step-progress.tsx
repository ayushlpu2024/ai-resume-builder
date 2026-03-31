"use client";

import React from "react";
import type { ConversationStep } from "@/types/resume";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  FileText,
  GraduationCap,
  Briefcase,
  Wrench,
  FolderKanban,
  Award,
  CheckCircle2,
} from "lucide-react";

/** Step metadata for the progress sidebar */
const STEPS: { key: ConversationStep; label: string; icon: React.ReactNode }[] =
  [
    { key: "name", label: "Name", icon: <User size={14} /> },
    { key: "contact", label: "Contact", icon: <Mail size={14} /> },
    { key: "summary", label: "Summary", icon: <FileText size={14} /> },
    { key: "education", label: "Education", icon: <GraduationCap size={14} /> },
    { key: "experience", label: "Experience", icon: <Briefcase size={14} /> },
    { key: "skills", label: "Skills", icon: <Wrench size={14} /> },
    { key: "projects", label: "Projects", icon: <FolderKanban size={14} /> },
    { key: "certifications", label: "Certifications", icon: <Award size={14} /> },
    { key: "complete", label: "Done", icon: <CheckCircle2 size={14} /> },
  ];

const STEP_ORDER: ConversationStep[] = STEPS.map((s) => s.key);

interface StepProgressProps {
  currentStep: ConversationStep;
}

/**
 * Horizontal step-progress bar shown at the top of the chat panel.
 */
export function StepProgress({ currentStep }: StepProgressProps) {
  const currentIdx = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="flex items-center gap-0.5 px-4 py-3 overflow-x-auto">
      {STEPS.map((step, idx) => {
        const isComplete = idx < currentIdx;
        const isCurrent = step.key === currentStep;

        return (
          <React.Fragment key={step.key}>
            {/* Connector line */}
            {idx > 0 && (
              <div
                className={cn(
                  "flex-1 h-0.5 min-w-3 rounded-full transition-colors duration-300",
                  isComplete
                    ? "bg-violet-500"
                    : "bg-gray-200 dark:bg-white/10"
                )}
              />
            )}
            {/* Step dot + label */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300",
                  isComplete &&
                    "bg-violet-500 text-white shadow-md shadow-violet-500/30",
                  isCurrent &&
                    "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white ring-4 ring-violet-500/20 shadow-lg shadow-violet-500/30",
                  !isComplete &&
                    !isCurrent &&
                    "bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600"
                )}
              >
                {isComplete ? <CheckCircle2 size={14} /> : step.icon}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors duration-300 whitespace-nowrap",
                  isCurrent
                    ? "text-violet-600 dark:text-violet-400"
                    : isComplete
                    ? "text-gray-600 dark:text-gray-400"
                    : "text-gray-400 dark:text-gray-600"
                )}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
