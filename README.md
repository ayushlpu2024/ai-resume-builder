🚀 AI Resume Builder

A modern AI-powered resume builder that feels like chatting with a professional career coach. It collects your details conversationally and generates a structured, ready-to-download resume in real time.

📄 Source Documentation:

✨ Features
💬 Chat-based resume creation (like ChatGPT)
🧠 Dual AI processing (data + conversation)
⚡ Real-time resume preview
💾 Auto-save with localStorage
🎨 Multiple templates (Modern & Classic)
📥 One-click PDF download
🔄 Post-generation editing via chat
🏗️ Tech Stack
Layer	Technology
Framework	Next.js 15 (App Router)
Styling	Tailwind CSS
AI Integration	Vercel AI SDK + OpenAI gpt-4o
Icons	Lucide React
State Management	Custom React Hooks
Persistence	localStorage
PDF Export	Browser Print (window.print)
🧠 How It Works

The core of the app is a Dual-Stream AI System — meaning every user message triggers two parallel processes:

1️⃣ Data Extraction Mode (mode: "extract")
Extracts structured resume data from user input

Example input:

"My name is Ayush"

Output:
{
  "Fullname": [
    {
      "fullname": "Ayush",
    }
  ]
}
Updates resume instantly (no visible AI response needed)
2️⃣ Conversational Mode (mode: "chat")
Handles human-like interaction
Guides user step-by-step
Streams responses with typewriter effect

💡 Result:
You get both:

✔️ Smart conversation
✔️ Structured resume updates
🔄 State Management Flow
<img width="599" height="576" alt="image" src="https://github.com/user-attachments/assets/b339bf2e-4478-4399-b20a-e3765bdd621b" />

🧩 Core Architecture
🗂️ Central Store (useResumeStore)

Manages:

resumeData
messages
currentStep
🪜 Step-Based Flow

The app ensures no section is skipped:

greeting → name → contact → summary → experience → education → skills → complete
💾 Auto Persistence
Every change is saved to localStorage
Users can refresh or return later without losing progress
📄 Resume Preview
Built as a dynamic React component
Updates instantly as data changes
Supports multiple templates:
🎨 Templates
Modern
Classic

Templates only affect UI, not data

📥 PDF Export
Uses window.print()
Styled with @media print
Optimized for A4 format
⚙️ API Design
Endpoint: /api/chat

Handles both AI modes:

if (mode === "extract") {
  // Return structured JSON
} else {
  // Return conversational response
}
🛠️ Setup Instructions
1️⃣ Install Dependencies
npm install
2️⃣ Add Environment Variables

Create .env.local:

OPENAI_API_KEY=your_key_here
3️⃣ Run the App
npm run dev
🚀 User Flow
👋 AI greets user
📋 Collects resume details step-by-step
⚡ Updates resume in real-time
✏️ Allows refinement via chat
📥 Download final PDF
🔥 Example Commands (After Completion)

You can refine your resume like:

“Make my summary more professional”
“Fix grammar in experience”
“Add more impact to achievements”
🧠 Why This Project is Powerful

Unlike traditional resume builders:

❌ No boring forms
❌ No manual structuring
✅ Natural conversation
✅ Smart data extraction
✅ Real-time UI sync
📌 Future Enhancements
Multiple resume templates marketplace
AI-based job matching
Cover letter generator
LinkedIn import
Resume scoring system
