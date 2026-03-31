AI Resume Builder - Detailed Documentation
This document provides a comprehensive technical overview of the AI Resume Builder, focusing on its architecture, the dual-stream chat system, and state management.

🏗️ Architecture Overview
The application is built using a modern full-stack web architecture:

Framework: Next.js 15 (App Router)
Styling: Tailwind CSS
AI Integration: Vercel AI SDK with OpenAI's gpt-4o
Icons: Lucide React
State Management: Custom React Hooks + localStorage for persistence
PDF Generation: Browser-based printing/PDF generation from the preview canvas
💬 The Chat System: "The Brain"
The core magic of the application lies in its Dual-Stream Processing model. Unlike simple chatbots, every user message triggers two distinct AI processes to ensure both a smooth conversation and accurate data updates.

1. Data Extraction Mode (mode: "extract")
When you type a message like "I'm a Senior Developer at Meta since 2021", the frontend sends a background request to the AI with instructions to only extract relevant resume data.

Process: extractData() function in resume-builder.tsx.
Prompting: Uses buildExtractionPrompt to feed the current JSON and the user's message to the AI.
Output: Pure JSON format that matches the ResumeData TypeScript interface.
Result: The "Experience" section of your resume updates instantly on the right side of the screen without the AI having to "say" it.
2. Conversational Mode (mode: "chat")
Simultaneously, a second request is made to handle the "human" side of the interaction.

Process: triggerAI() function in resume-builder.tsx.
Prompting: Uses buildSystemPrompt to guide the AI on what to ask next based on the current step (e.g., if you just gave your name, it asks for contact info).
Output: A streamed text response with a typewriter effect.
Result: You feel like you're talking to a professional resume consultant.
🔄 State Synchronization
The application uses a "Single Source of Truth" pattern managed by src/hooks/use-resume-store.ts.

Trigger
Trigger
JSON
Stream
Reactive Sync
Persistence
User Message
Chat Interface
API Chat: Mode Extract
API Chat: Mode Chat
Resume Store
Chat UI
Resume Preview Canvas
LocalStorage
Key Components:
useResumeStore: Centralizes the resumeData, messages, and currentStep.
Step Controller: A strict sequence (greeting -> name -> contact -> ... -> complete) ensures no section is missed.
Auto-Sync: Every update to the resume is immediately saved to localStorage, allowing users to close the tab and return later without losing progress.
📑 Resume Preview & Templates
The resume is not just a static image; it's a dynamic React component (src/components/resume-preview.tsx) that renders the resumeData object in real-time.

Templates: Users can switch between "Modern" and "Classic" templates. This change is purely CSS/Styling and does not affect the underlying data.
PDF Generation: Leverages window.print() with @media print CSS rules to ensure the resume looks professional on A4 paper.
🛠️ Developer Implementation Details
Environment Variables
To run the project, a .env.local file is required:

bash
OPENAI_API_KEY=your_key_here
API Endpoint (/api/chat)
The backend is a single Next.js Route Handler that routes traffic based on the mode parameter. It uses streamText from the AI SDK for low-latency responses.

typescript
// Example from src/app/api/chat/route.ts
if (mode === "extract") {
  // Logic to return structured JSON
} else {
  // Logic to return conversational text
}
🚀 The Step-by-Step Process
Step 1: Greeting - AI introduces itself and asks the first question.
Step 2: Data Gathering - AI proceeds through 8 distinct steps (Contact, Summary, Experience, etc.).
Step 3: Background Update - With every answer, the AI extracts data and populates the JSON state.
Step 4: Refinement - Once "complete", users can ask the AI to "make my summary more professional" or "fix the dates in experience", and the AI will update the structured data accordingly.
Step 5: Download - User selects a template and clicks "Download PDF".
