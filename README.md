# 🚀 AI Resume Builder

An AI-powered resume builder that lets users create resumes through a **chat interface** instead of traditional forms.

---

## ✨ Features

- 💬 Chat-based resume creation  
- 🧠 AI extracts structured data in real-time  
- ⚡ Live resume preview (instant updates)  
- 🔄 Streaming responses (typing effect)  
- 💾 Auto-save using localStorage  

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 15, TypeScript  
- **Styling:** Tailwind CSS  
- **State Management:** Zustand  
- **AI:** Vercel AI SDK (GPT-4o)  
- **Deployment:** Vercel  

---

## 🧠 How It Works

### 1. Extraction Mode (Background)
- User message → AI extracts JSON  
- Resume updates instantly  

### 2. Chat Mode (Conversational)
- AI asks next questions  
- Guides user step-by-step  

---

## 🔄 Architecture Flow

```mermaid
sequenceDiagram
User->>Frontend: Message
Frontend->>API: /api/chat (extract)
API->>AI: Process
AI-->>Frontend: JSON
Frontend->>Store: Update Resume

Frontend->>API: /api/chat (chat)
API->>AI: Ask Next Question
AI-->>Frontend: Text Response
