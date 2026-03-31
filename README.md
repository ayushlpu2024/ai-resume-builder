# 🚀 AI Resume Builder - Detailed Documentation

A comprehensive technical overview of the **AI Resume Builder**, focusing on architecture, dual-stream chat processing, and state management.

---

## 🏗️ Architecture Overview

The application is built using a modern full-stack web architecture:

- **Framework:** Next.js 15 (App Router)  
- **Styling:** Tailwind CSS  
- **AI Integration:** Vercel AI SDK (OpenAI GPT-4o)  
- **Icons:** Lucide React  
- **State Management:** Custom React Hooks + localStorage  
- **PDF Generation:** Browser-based (`window.print()`)

---

## 💬 The Chat System: "The Brain"

The core of the application is a **Dual-Stream Processing Model**.

Every user message triggers **two parallel AI processes**:
1. Data extraction (structured JSON)
2. Conversational response (chat)

---

## 🧠 1. Data Extraction Mode (`mode: "extract"`)

When a user types:

> "I'm a Senior Developer at Meta since 2021"

### ⚙️ Flow:
- Frontend sends background request → `/api/chat`
- AI extracts structured resume data

### 🔧 Implementation:
- Function: `extractData()` (resume-builder.tsx)  
- Prompt: `buildExtractionPrompt()`  
- Output: JSON matching `ResumeData` interface  

### ✅ Result:
- Resume updates instantly  
- No visible AI response required  

---

## 💬 2. Conversational Mode (`mode: "chat"`)

Handles the **human interaction layer**.

### ⚙️ Flow:
- AI asks next question based on user progress  

### 🔧 Implementation:
- Function: `triggerAI()`  
- Prompt: `buildSystemPrompt()`  

### 📤 Output:
- Streamed text response (typing effect)

### ✅ Result:
- Feels like chatting with a resume expert  

---

## 🔄 State Synchronization

Uses a **Single Source of Truth** pattern:

📁 `src/hooks/use-resume-store.ts`

### 🔑 Key Components:

- **useResumeStore**  
  - Stores: `resumeData`, `messages`, `currentStep`

- **Step Controller**  
  - Flow:  
    `greeting → name → contact → ... → complete`

- **Auto-Sync**  
  - Saves data instantly to `localStorage`  
  - Prevents data loss  

---

## 📑 Resume Preview & Templates

The resume is a **dynamic React component**:

📁 `src/components/resume-preview.tsx`

### ✨ Features:

- 🔄 Real-time rendering from `resumeData`  
- 🎨 Multiple templates:
  - Modern  
  - Classic  
- 📄 PDF Download:
  - Uses `window.print()`  
  - Optimized for A4  

---

## 🛠️ Developer Implementation

### 🔑 Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_key_here
