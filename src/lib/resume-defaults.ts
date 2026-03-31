import type { ResumeData } from "@/types/resume";

/** Empty resume state — used as the initial value */
export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    summary: "",
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
};
