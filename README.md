# RepoHub Terminal HUD

> High-density developer terminal HUD and GitHub repository command center with live metrics, commit velocity analytics, and real-time project tracking.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-cyan.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.10-yellow.svg)](https://www.python.org/)

---

## 📌 Overview

**RepoHub Terminal HUD** is a streamlined, dark-mode developer heads-up display (HUD) designed for monitoring active GitHub projects. It seamlessly connects with the GitHub REST API to fetch live repository metadata, track recent commit history, and display 14-day velocity trends in an aesthetic, terminal-inspired interface.

The application automatically focuses on user project repositories (such as [musafir-cafe](https://dpxtd-ai.github.io/musafir-cafe/)), filtering out the meta-dashboard itself so that you only see your working applications and deployments.

---

## ✨ Features

- **🚀 Live GitHub Integration**: Automatically fetches user profile data, active repositories, commit timelines, and push events directly from `api.github.com`.
- **🌐 Working Project URLs**: Clean catalog of your active web deployments with instant links to their live production sites.
- **📈 14-Day Commit Velocity Chart**: Visual breakdown of recent commit trends across the tracking sprint.
- **🔍 Latest Commit Activity Inspector**: Displays author info, timestamp, commit hash, file modification stats, and an interactive inspection modal with per-file diff breakdowns.
- **⚡ Dual Runtime Architecture**: Express Node/TypeScript server powered by a dedicated Python 3.10 metrics analytics engine (`python/repo_engine.py`).
- **🎯 Clean & Focused UI**: Distraction-free, dark-themed terminal HUD with high contrast and zero clutter.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons, Motion
- **Build Tool**: Vite 8
- **Backend**: Node.js, Express (`server.ts`), TSX
- **Analytics Engine**: Python 3.10 (`python/repo_engine.py`)
- **Data Source**: GitHub REST API v3

---

## 📂 Project Structure

```text
├── python/
│   └── repo_engine.py          # Python metrics & commit analytics engine
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Top navigation bar with user profile
│   │   ├── Sidebar.tsx         # HUD mode switcher
│   │   ├── RepoList.tsx        # Project repository listing & live site links
│   │   ├── CommitCounterCard.tsx # 14-day velocity and commit count metrics
│   │   ├── LatestCommitCard.tsx  # Latest commit overview card
│   │   └── CommitInspectModal.tsx # Commit file diff inspection modal
│   ├── data/
│   │   └── mockData.ts         # Fallback baseline dataset
│   ├── services/
│   │   └── githubService.ts    # GitHub REST API client & data transformers
│   ├── types.ts                # TypeScript interfaces and type definitions
│   ├── App.tsx                 # Core application component
│   └── main.tsx                # React DOM entry point
├── server.ts                   # Express server with API routes & Vite middleware
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher (v20+ recommended)
- **Python**: 3.10+ (optional, for backend analytics scripts)
- **npm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dpxtd-ai/dashboard.git
   cd dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The dashboard runs on `http://localhost:3000`.

### Production Build

To build the static bundle for production deployment (e.g. GitHub Pages or static host):

```bash
npm run build
```

The production output will be generated in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## ⚙️ Configuration & Customization

The dashboard connects to GitHub via `src/services/githubService.ts`. By default, it tracks user `@dpxtd-ai`.

- To configure a custom username or optional Personal Access Token (for private repos and higher rate limits), update `localStorage`:
  - `repohub_github_username`: Target GitHub username or organization
  - `repohub_github_token`: GitHub Personal Access Token (`ghp_...`)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
