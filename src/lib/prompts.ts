import type { ConversationStep, ResumeData } from "@/types/resume";

/**
 * Build the system prompt for the AI based on the current step & resume state.
 * The AI asks ONE question at a time and refines user answers professionally.
 */
export function buildSystemPrompt(
  step: ConversationStep,
  resumeData: ResumeData
): string {
  const base = `You are a professional resume-writing assistant. Your job is to help the user build a polished, ATS-friendly resume by asking ONE question at a time.

CRITICAL RULES:
1. Ask only ONE question per message.
2. Refine casual user answers into professional resume language.
   Example: input "i made a website" → output "Developed a responsive web application using React and Tailwind CSS"
3. After the user answers, acknowledge briefly, store the info, then move to the next question.
4. Be warm, encouraging, and concise.
5. NEVER dump all questions at once.
6. When refining answers, include the polished version in your response so the user sees the improvement.

CURRENT RESUME DATA (JSON):
${JSON.stringify(resumeData, null, 2)}
`;

  const stepInstructions: Record<ConversationStep, string> = {
    greeting: `Greet the user warmly. Tell them you'll help build an amazing resume step-by-step. Then ask for their FULL NAME.`,
    name: `The user just provided (or is providing) their full name. Confirm it and then ask for their CONTACT INFORMATION: email, phone number, and location (city, state/country).`,
    contact: `The user provided contact info. Confirm what you captured and ask for a brief PROFESSIONAL SUMMARY (2-3 sentences about who they are and what they bring to the table). Help them refine it if needed.`,
    summary: `The user has given a professional summary. Refine it to be compelling. Then ask about their EDUCATION: university/college name, degree, field of study, graduation date, GPA (optional). Ask if they have multiple degrees.`,
    education: `The user shared education info. Refine and confirm, then ask about WORK EXPERIENCE: company name, job title, dates, and key achievements/responsibilities. Ask them to describe what they did — you'll polish it into bullet points.`,
    experience: `The user shared experience info. Transform their descriptions into powerful bullet points using action verbs. Then ask about TECHNICAL & SOFT SKILLS. Ask them to list their key skills.`,
    skills: `The user listed skills. Organise them neatly. Then ask about PROJECTS: name, description, technologies used, and any measurable outcomes.`,
    projects: `The user described projects. Refine them professionally. Then ask about CERTIFICATIONS: name, issuing organisation, and date. Tell them it's okay to skip if they don't have any.`,
    certifications: `The user provided certifications (or said they have none). Wrap up by giving a brief summary of all sections collected. Tell them their resume is ready for preview and download! Congratulate them.`,
    complete: `The resume is complete! If the user has follow-up questions about editing any section, help them. Otherwise remind them they can download their resume as a PDF.`,
  };

  return `${base}\n\nCURRENT STEP: ${step}\nINSTRUCTIONS FOR THIS STEP:\n${stepInstructions[step]}`;
}

/**
 * Returns the extraction prompt to pull structured data from AI text.
 */
export function buildExtractionPrompt(
  step: ConversationStep,
  userMessage: string,
  currentData: ResumeData
): string {
  return `You are a data extraction engine. Given the user's message and the current resume step, extract structured data and return ONLY valid JSON matching the ResumeData schema below.

CURRENT STEP: ${step}
USER MESSAGE: "${userMessage}"
EXISTING DATA: ${JSON.stringify(currentData, null, 2)}

SCHEMA:
{
  "personalInfo": { "fullName": "", "email": "", "phone": "", "location": "", "linkedin": "", "portfolio": "", "summary": "" },
  "education": [{ "id": "", "institution": "", "degree": "", "field": "", "startDate": "", "endDate": "", "gpa": "", "highlights": [] }],
  "experience": [{ "id": "", "company": "", "position": "", "location": "", "startDate": "", "endDate": "", "current": false, "highlights": [] }],
  "skills": [],
  "projects": [{ "id": "", "name": "", "description": "", "technologies": [], "url": "", "highlights": [] }],
  "certifications": [{ "id": "", "name": "", "issuer": "", "date": "", "url": "" }]
}

RULES:
- Merge new info into the existing data — do NOT erase previous fields.
- Generate a short random "id" string for new array items.
- If the user message does not contain info for a step, keep existing data unchanged.
- Return ONLY the JSON object, no markdown, no explanation.`;
}
