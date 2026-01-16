# 🎬 AI Video Course Generator

> **Turn any topic into a comprehensive video course in seconds using AI.**


## 🚀 Features

### 🧠 **AI-Powered Content Generation**
-   **Smart Curriculum**: Uses **Google Gemini AI** to generate structured chapters and modules.
-   **AI Scriptwriting**: Automatically writes educational scripts for every slide.
-   **Study Notes**: Generates detailed markdown study notes for each chapter.

### 🎥 **Dynamic Video Rendering**
-   **Remotion Integration**: Renders professional video presentations on the fly in the browser.
-   **TTS Voiceovers**: Uses **Fonada AI** text-to-speech for lifelike narration.
-   **Animated Slides**: Beautiful, auto-generated slides with smooth transitions.

### 👤 **User Dashboard & Profile**
-   **"My Courses"**: Persists all your generated courses in a PostgreSQL database.
-   **Statistics**: Profile page tracks your learning progress and content creation stats.
-   **Authentication**: Secure login via **Google** and **GitHub** (using Better Auth).

### 🎨 **Modern UI/UX**
-   **Premium Design**: Dark/Light mode support, glassmorphism effects, and smooth animations using **Framer Motion**.
-   **Responsive**: Fully optimized for customized mobile and desktop experiences.

---

## 🛠️ Tech Stack

This project is built with the "T3 Stack" philosophy + AI superpowers:

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/)) + [Prisma ORM](https://www.prisma.io/)
-   **AI Models**: [Google Gemini](https://deepmind.google/technologies/gemini/) (LLM) + [LangChain](https://js.langchain.com/)
-   **Video Engine**: [Remotion](https://www.remotion.dev/)
-   **Auth**: [Better Auth](https://github.com/better-auth/better-auth)

---

## ⚡ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-video-generator.git
cd ai-video-generator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env` file in the root directory and add:
```env
DATABASE_URL="postgresql://..."
GOOGLE_CLIENT_ID="your_google_id"
GOOGLE_CLIENT_SECRET="your_google_secret"
GITHUB_CLIENT_ID="your_github_id"
GITHUB_CLIENT_SECRET="your_github_secret"
GEMINI_API_KEY="your_gemini_key"
FONADA_API_KEY="your_fonada_key"
BETTER_AUTH_SECRET="random_secret"
BETTER_AUTH_URL="http://localhost:3000"
```

### 4. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result!

---



---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/ai-video-generator/issues).

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request


## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Built with ❤️ by Manokamna**
