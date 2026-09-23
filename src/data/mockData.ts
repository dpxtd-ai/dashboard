import { Repository, DashboardStats, LatestCommit, KanbanCard, CIPipeline, UrlEndpoint } from '../types';

/**
 * Initial baseline structures for RepoHub Terminal HUD
 * Populated dynamically from GitHub REST API at runtime.
 */

export const initialStats: DashboardStats = {
  totalCommits: 28,
  sprintCommits: 14,
  sprintName: "Live Sprint",
  primaryBranch: "main",
  velocityAvg: "+18.2% avg",
  activePRs: 2,
  activePipelines: 2,
  passingPipelines: 2,
  totalLinesAdded: 520,
  totalLinesDeleted: 42,
  filesChanged: 14,
  dailyVelocity: [
    { day: "Sun", date: "Sep 10", commits: 2 },
    { day: "Mon", date: "Sep 11", commits: 4 },
    { day: "Tue", date: "Sep 12", commits: 3 },
    { day: "Wed", date: "Sep 13", commits: 5 },
    { day: "Thu", date: "Sep 14", commits: 6 },
    { day: "Fri", date: "Sep 15", commits: 4 },
    { day: "Sat", date: "Sep 16", commits: 7 },
    { day: "Sun", date: "Sep 17", commits: 3 },
    { day: "Mon", date: "Sep 18", commits: 6 },
    { day: "Tue", date: "Sep 19", commits: 8 },
    { day: "Wed", date: "Sep 20", commits: 5 },
    { day: "Thu", date: "Sep 21", commits: 9 },
    { day: "Fri", date: "Sep 22", commits: 11 },
    { day: "Sat", date: "Sep 23", commits: 14, current: true }
  ]
};

export const initialLatestCommit: LatestCommit = {
  hash: "14aae0c",
  fullHash: "14aae0c85e585a5db32dc20a6ab957c39a5d06b9",
  message: "feat: initialize RepoHub Terminal HUD project",
  branch: "dashboard:main",
  syncMethod: "GitHub REST API",
  timeAgo: "Live",
  timestamp: "Sep 23, 2026, 15:22 UTC",
  author: {
    name: "Dnyanchand",
    email: "ygyan0804@gmail.com",
    avatar: "https://avatars.githubusercontent.com/u/327059590?v=4",
    role: "Repository Maintainer"
  },
  stats: {
    additions: 245,
    deletions: 18,
    filesChanged: 7
  },
  changedFiles: [
    { name: "src/App.tsx", additions: 140, deletions: 12, status: "modified" },
    { name: "vite.config.ts", additions: 18, deletions: 2, status: "modified" },
    { name: "package.json", additions: 35, deletions: 1, status: "modified" },
    { name: ".github/workflows/static.yml", additions: 52, deletions: 3, status: "modified" }
  ]
};

export const initialRepos: Repository[] = [
  {
    id: "gh-dashboard",
    name: "dashboard",
    visibility: "Public",
    icon: "terminal",
    description: "High-density developer terminal HUD and GitHub repository command center with live metrics and Python engine.",
    primaryBranch: "main",
    updatedAt: "just now",
    url: "https://github.com/dpxtd-ai/dashboard",
    liveUrl: "https://dpxtd-ai.github.io/dashboard/",
    techStack: ["TypeScript", "React", "Vite", "Tailwind CSS"],
    pipelineStatus: "passing",
    commitsCount: 14,
    openPRs: 1
  },
  {
    id: "gh-musafir-cafe",
    name: "musafir-cafe",
    visibility: "Public",
    icon: "share2",
    description: "Musafir Cafe digital experience and ordering web portal.",
    primaryBranch: "main",
    updatedAt: "1 hour ago",
    url: "https://github.com/dpxtd-ai/musafir-cafe",
    liveUrl: "https://dpxtd-ai.github.io/musafir-cafe/",
    techStack: ["HTML", "JavaScript", "CSS"],
    pipelineStatus: "passing",
    commitsCount: 12,
    openPRs: 0
  }
];

export const initialKanbanCards: KanbanCard[] = [
  {
    id: "kb-1",
    title: "Deploy dynamic GitHub REST API sync for live repo statistics",
    repo: "dashboard",
    prNumber: 4,
    assignee: "Dnyanchand",
    avatar: "https://avatars.githubusercontent.com/u/327059590?v=4",
    priority: "high",
    tags: ["feature", "api"],
    status: "in_progress"
  },
  {
    id: "kb-2",
    title: "Automate GitHub Actions static Pages workflow with Node 22",
    repo: "dashboard",
    prNumber: 3,
    assignee: "Dnyanchand",
    avatar: "https://avatars.githubusercontent.com/u/327059590?v=4",
    priority: "high",
    tags: ["ci/cd", "gh-pages"],
    status: "done"
  },
  {
    id: "kb-3",
    title: "Add menu booking & real-time order notifications",
    repo: "musafir-cafe",
    assignee: "Dnyanchand",
    avatar: "https://avatars.githubusercontent.com/u/327059590?v=4",
    priority: "medium",
    tags: ["menu", "ui"],
    status: "review"
  },
  {
    id: "kb-4",
    title: "Optimize SVG asset delivery and mobile viewport layout",
    repo: "musafir-cafe",
    assignee: "Dnyanchand",
    avatar: "https://avatars.githubusercontent.com/u/327059590?v=4",
    priority: "low",
    tags: ["performance"],
    status: "backlog"
  }
];

export const initialCIPipelines: CIPipeline[] = [
  {
    id: "pipe-1",
    title: "CI / Static Site Build & Deploy",
    repo: "dashboard",
    prNumber: 3,
    author: "Dnyanchand",
    branch: "main",
    status: "success",
    testsCount: 24,
    duration: "23s",
    updatedAt: "just now",
    pythonVersion: "Node 22 / Vite"
  },
  {
    id: "pipe-2",
    title: "Static Content Deploy to Pages",
    repo: "musafir-cafe",
    prNumber: 1,
    author: "Dnyanchand",
    branch: "main",
    status: "success",
    testsCount: 8,
    duration: "14s",
    updatedAt: "1h ago",
    pythonVersion: "Static HTML5"
  }
];

export const initialUrlEndpoints: UrlEndpoint[] = [
  {
    id: "ep-1",
    title: "RepoHub Terminal HUD (GitHub Pages)",
    repo: "dashboard",
    environment: "Production",
    url: "https://dpxtd-ai.github.io/dashboard/",
    status: "200 OK",
    latencyMs: 18,
    lastChecked: "Just now"
  },
  {
    id: "ep-2",
    title: "Musafir Cafe Web App (GitHub Pages)",
    repo: "musafir-cafe",
    environment: "Production",
    url: "https://dpxtd-ai.github.io/musafir-cafe/",
    status: "200 OK",
    latencyMs: 22,
    lastChecked: "Just now"
  },
  {
    id: "ep-3",
    title: "Dashboard GitHub Repository",
    repo: "dashboard",
    environment: "API Docs",
    url: "https://github.com/dpxtd-ai/dashboard",
    status: "200 OK",
    latencyMs: 28,
    lastChecked: "Just now"
  },
  {
    id: "ep-4",
    title: "Musafir Cafe GitHub Repository",
    repo: "musafir-cafe",
    environment: "API Docs",
    url: "https://github.com/dpxtd-ai/musafir-cafe",
    status: "200 OK",
    latencyMs: 31,
    lastChecked: "Just now"
  }
];
