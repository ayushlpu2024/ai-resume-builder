// ============================================================
// Resume Data Types — shared across the entire application
// ============================================================

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  highlights: string[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

/** The master resume state object */
export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
}

/** Chat message shape */
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/** Conversation step for the guided flow */
export type ConversationStep =
  | "greeting"
  | "name"
  | "contact"
  | "summary"
  | "education"
  | "experience"
  | "skills"
  | "projects"
  | "certifications"
  | "complete";

/** Which template to render */
export type ResumeTemplate = "modern" | "classic" | "minimal";
