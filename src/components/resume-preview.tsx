"use client";

import React from "react";
import type { ResumeData, ResumeTemplate } from "@/types/resume";
import { cn } from "@/lib/utils";
import {
  Mail,
  Phone,
  MapPin,
  Link as LinkedinIcon,
  Globe,
  GraduationCap,
  Briefcase,
  Wrench,
  FolderKanban,
  Award,
} from "lucide-react";

interface ResumePreviewProps {
  data: ResumeData;
  template: ResumeTemplate;
}

/**
 * Live resume preview — renders the structured resume data
 * with the selected template style. Wrapped in a printable container.
 */
export function ResumePreview({ data, template }: ResumePreviewProps) {
  const { personalInfo, education, experience, skills, projects, certifications } = data;

  const hasContent =
    personalInfo.fullName ||
    education.length > 0 ||
    experience.length > 0 ||
    skills.length > 0 ||
    projects.length > 0 ||
    certifications.length > 0;

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-400 dark:text-gray-600">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
          <FolderKanban size={32} className="text-gray-300 dark:text-gray-700" />
        </div>
        <p className="text-lg font-medium mb-1">Your resume will appear here</p>
        <p className="text-sm">Start chatting with the AI to build it step by step</p>
      </div>
    );
  }

  // Template-specific accent colors
  const accentMap: Record<ResumeTemplate, string> = {
    modern: "violet",
    classic: "slate",
    minimal: "gray",
  };
  const accent = accentMap[template];

  return (
    <div
      id="resume-content"
      className={cn(
        "w-full max-w-[816px] mx-auto bg-white text-gray-900 shadow-xl",
        "font-[system-ui,sans-serif] text-[13px] leading-snug",
        template === "modern" && "rounded-lg overflow-hidden",
        template === "classic" && "border border-gray-300",
        template === "minimal" && "rounded-none"
      )}
      style={{ minHeight: "1056px" }} // ~letter-size aspect
    >
      {/* ── Header ── */}
      <header
        className={cn(
          "px-8 py-6",
          template === "modern" &&
            "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white",
          template === "classic" &&
            "border-b-4 border-slate-800 text-slate-900",
          template === "minimal" && "border-b border-gray-200 text-gray-900"
        )}
      >
        {personalInfo.fullName && (
          <h1
            className={cn(
              "font-bold tracking-tight",
              template === "modern" && "text-2xl",
              template === "classic" && "text-3xl uppercase tracking-widest",
              template === "minimal" && "text-xl"
            )}
          >
            {personalInfo.fullName}
          </h1>
        )}

        {/* Contact row */}
        <div
          className={cn(
            "flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs",
            template === "modern" && "text-white/90",
            template === "classic" && "text-slate-600",
            template === "minimal" && "text-gray-500"
          )}
        >
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail size={11} />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone size={11} />
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {personalInfo.location}
            </span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <LinkedinIcon size={11} />
              {personalInfo.linkedin}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Globe size={11} />
              {personalInfo.portfolio}
            </span>
          )}
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <p
            className={cn(
              "mt-3 text-xs leading-relaxed",
              template === "modern" && "text-white/85",
              template === "classic" && "text-slate-700 italic",
              template === "minimal" && "text-gray-600"
            )}
          >
            {personalInfo.summary}
          </p>
        )}
      </header>

      {/* ── Body ── */}
      <div className="px-8 py-5 space-y-5">
        {/* Education */}
        {education.length > 0 && (
          <Section
            icon={<GraduationCap size={14} />}
            title="Education"
            accent={accent}
            template={template}
          >
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm">{edu.institution}</span>
                  <span className="text-xs text-gray-500">
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
                <p className="text-xs text-gray-700">
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </p>
                {edu.highlights.length > 0 && (
                  <ul className="mt-1 list-disc list-inside text-xs text-gray-600 space-y-0.5">
                    {edu.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <Section
            icon={<Briefcase size={14} />}
            title="Experience"
            accent={accent}
            template={template}
          >
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm">{exp.position}</span>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {exp.company}
                  {exp.location && ` • ${exp.location}`}
                </p>
                {exp.highlights.length > 0 && (
                  <ul className="mt-1 list-disc list-inside text-xs text-gray-600 space-y-0.5">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <Section
            icon={<Wrench size={14} />}
            title="Skills"
            accent={accent}
            template={template}
          >
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs",
                    template === "modern" &&
                      "bg-violet-100 text-violet-700",
                    template === "classic" &&
                      "bg-slate-100 text-slate-700 border border-slate-200",
                    template === "minimal" &&
                      "bg-gray-100 text-gray-700"
                  )}
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section
            icon={<FolderKanban size={14} />}
            title="Projects"
            accent={accent}
            template={template}
          >
            {projects.map((proj) => (
              <div key={proj.id} className="mb-2 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm">{proj.name}</span>
                  {proj.url && (
                    <span className="text-xs text-blue-500 truncate max-w-[180px]">
                      {proj.url}
                    </span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-xs text-gray-600 mt-0.5">
                    {proj.description}
                  </p>
                )}
                {proj.technologies.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    <span className="font-medium">Tech:</span>{" "}
                    {proj.technologies.join(", ")}
                  </p>
                )}
                {proj.highlights.length > 0 && (
                  <ul className="mt-1 list-disc list-inside text-xs text-gray-600 space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <Section
            icon={<Award size={14} />}
            title="Certifications"
            accent={accent}
            template={template}
          >
            {certifications.map((cert) => (
              <div key={cert.id} className="mb-1.5 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-sm">{cert.name}</span>
                  <span className="text-xs text-gray-500">{cert.date}</span>
                </div>
                <p className="text-xs text-gray-600">{cert.issuer}</p>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

// ── Section wrapper ────────────────────────────────────────────
function Section({
  icon,
  title,
  children,
  accent,
  template,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent: string;
  template: ResumeTemplate;
}) {
  return (
    <section>
      <div
        className={cn(
          "flex items-center gap-2 mb-2 pb-1 border-b",
          template === "modern" && "border-violet-200 text-violet-700",
          template === "classic" && "border-slate-300 text-slate-800",
          template === "minimal" && "border-gray-200 text-gray-800"
        )}
      >
        {icon}
        <h2
          className={cn(
            "font-bold uppercase tracking-wider",
            template === "classic" ? "text-sm" : "text-xs"
          )}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
