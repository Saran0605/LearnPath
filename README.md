# LearnPath 🎯

LearnPath is an AI-powered, community-backed learning resource aggregator built with the MERN stack (**M**ongoDB, **E**xpress, **R**eact, **N**ode.js) and powered by Google's open-weight **Gemma AI** model (`gemma-2-9b-it`).

It solves a common problem: **"I want to learn a skill, but I don't know which course, book, or video to trust."**

LearnPath automatically scans Hacker News, Reddit, and YouTube for real developer discussions, extracts course and book recommendations, and validates them against an **Anti-Hallucination rule Engine** before presenting them on a modern, real-time dashboard.

---

## 🌟 Key Features

- 🚫 **No User Accounts / Login Required**: Public, open dashboard for immediate access.
- 🤖 **Open-Weight Gemma AI Integration**: Utilizes Gemma model via Google AI Studio (`GEMINI_API_KEY` & `GEMINI_MODEL`).
- 🛡️ **Strict Anti-Hallucination Design**: The AI model is strictly prohibited from inventing URLs or drawing recommendations from memory. Recommendations are verified against raw fetched snippets.
- ⚡ **7-Day MongoDB Cache**: Repeated queries return cached results instantly.
- 🔎 **Real Community Sources**: Integrates Algolia Hacker News API, Reddit JSON Search, and YouTube Data API v3.
- 🎛️ **Instant Client-Side Filtering**: Filter results by Pricing (*Free, Paid, Freemium*), Type (*YouTube, Course, Book, Website*), and Experience Level (*Beginner, Intermediate, Advanced*).
- 📜 **Proof Drawer**: Every recommendation includes a "See proof" toggle with direct links to the original forum posts and video threads.
- 🎨 **Modern Glassmorphism UI**: Built with React, Vite, and custom CSS design system.

---

## 🏗️ Architecture & How It Works

```
                        +----------------------------+
                        |  User Input (e.g. "SQL")  |
                        +----------------------------+
                                      |
                                      v
                        +----------------------------+
                        |  Check 7-Day MongoDB Cache |
                        +----------------------------+
                           /                      \
                    (Found)                        (Not Found / Stale)
                       /                              \
                      v                                v
         Return Instant Cache           Fetch Parallel Sources:
                                        - Hacker News Algolia Search API
                                        - Reddit Public JSON Search
                                        - YouTube Data API v3
                                                      |
                                                      v
                                        Number & Format Snippets [ID 1, 2, ...]
                                                      |
                                                      v
                                        Send to Gemma AI (gemma-2-9b-it)
                                        with Strict System Prompt
                                                      |
                                                      v
                                        Anti-Hallucination Verification:
                                        - URL/Name match in raw source text?
                                        - Valid sourceIds list?
                                                      |
                                                      v
                                        Save to MongoDB & Return JSON
```

### 🛡️ Anti-Hallucination Verification
To prevent LLM hallucination:
1. The system prompt instructs Gemma: *"Do not use outside knowledge. Do not invent resources or URLs. If snippets contain no real evidence, leave it out."*
2. Server-side validation (`server/utils/validate.js`) inspects every returned resource. If a recommended URL or course name does not physically exist in the fetched raw source text, it is **discarded immediately**.

---

## ⚙️ Environment Variables

Create `.env` files based on `.env.example`:

| Environment Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB Atlas Connection String (or leave empty for automatic MongoMemoryServer fallback) | `mongodb+srv://user:pass@cluster.mongodb.net/learnpath` |
| `GEMINI_API_KEY` | Google AI Studio API Key | `AIzaSy...` |
| `GEMINI_MODEL` | Gemma / Gemini model name from Google AI Studio | `gemma-2-9b-it` |
| `YOUTUBE_API_KEY` | YouTube Data API v3 Key (Optional) | `AIzaSy...` |
| `PORT` | Server Port | `5000` |
| `CLIENT_ORIGIN` | Allowed Client Origin for CORS | `http://localhost:5173` |

---

## 🚀 Quick Start & Installation

### 1. Clone & Install Dependencies

In the root directory, run:
```bash
npm run install-all
```
*This installs root, server, and client dependencies concurrently.*

### 2. Seed Pre-Cached Demo Skills
Pre-cache popular skills (`SQL`, `Python`, `Guitar`) into the database:
```bash
npm run seed
```

### 3. Run Development Server
Start both client (Vite on `http://localhost:5173`) and server (Express on `http://localhost:5000`) simultaneously:
```bash
npm run dev
```

---

## 📁 Project Structure

```
LearnPath/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── components/         # Header, SearchBar, FilterBar, ResourceCard, etc.
│   │   ├── services/api.js     # Axios API service
│   │   ├── App.jsx             # Main Dashboard Container
│   │   └── App.css             # Glassmorphism Design System
│   └── package.json
├── server/                     # Express + Node.js Backend
│   ├── config/db.js            # MongoDB Atlas connection & fallback
│   ├── models/Search.js        # Search schema with 7-day TTL
│   ├── routes/search.js        # POST /api/search & GET /api/recent
│   ├── services/               # hackernews.js, reddit.js, youtube.js, gemini.js
│   ├── utils/validate.js       # Input validation & anti-hallucination engine
│   ├── scripts/seed.js         # Pre-caches popular demo skills
│   └── server.js               # Main Express app with rate limiter & helmet
├── package.json                # Root monorepo scripts (concurrently)
├── .env.example                # Template env file
├── .gitignore
└── README.md
```

---

## 🧪 Testing API Endpoints

- **Search Endpoint**:
  ```bash
  curl -X POST http://localhost:5000/api/search \
    -H "Content-Type: application/json" \
    -d '{"skill": "python"}'
  ```

- **Recent Searches**:
  ```bash
  curl http://localhost:5000/api/recent
  ```