import { Repository, DashboardStats, LatestCommit, KanbanCard, CIPipeline, UrlEndpoint } from '../types';

/**
 * Initial baseline structures for RepoHub Terminal HUD
 * Focuses on active user project repositories (excluding dashboard)
 */

export const initialStats: DashboardStats = {
  totalCommits: 14,
  sprintCommits: 7,
  sprintName: "Sprint",
  primaryBranch: "main",
  velocityAvg: "+18.2% avg",
  activePRs: 0,
  activePipelines: 1,
  passingPipelines: 1,
  totalLinesAdded: 320,
  totalLinesDeleted: 24,
  filesChanged: 6,
  dailyVelocity: [
    { day: "Sun", date: "Sep 10", commits: 1 },
    { day: "Mon", date: "Sep 11", commits: 2 },
    { day: "Tue", date: "Sep 12", commits: 1 },
    { day: "Wed", date: "Sep 13", commits: 3 },
    { day: "Thu", date: "Sep 14", commits: 2 },
    { day: "Fri", date: "Sep 15", commits: 4 },
    { day: "Sat", date: "Sep 16", commits: 3 },
    { day: "Sun", date: "Sep 17", commits: 2 },
    { day: "Mon", date: "Sep 18", commits: 4 },
    { day: "Tue", date: "Sep 19", commits: 5 },
    { day: "Wed", date: "Sep 20", commits: 3 },
    { day: "Thu", date: "Sep 21", commits: 6 },
    { day: "Fri", date: "Sep 22", commits: 8 },
    { day: "Sat", date: "Sep 23", commits: 7, current: true }
  ]
};

export const initialLatestCommit: LatestCommit = {
  hash: "68c50f2",
  fullHash: "68c50f2d1bed9caf9008bf63e1bee4a342d80f1b",
  message: "Update index.html",
  branch: "musafir-cafe:main",
  syncMethod: "GitHub REST API",
  timeAgo: "Live",
  timestamp: "Sep 23, 2026, 11:29 UTC",
  author: {
    name: "Dnyanchand",
    email: "ygyan0804@gmail.com",
    avatar: "https://avatars.githubusercontent.com/u/327059590?v=4",
    role: "Repository Maintainer"
  },
  stats: {
    additions: 45,
    deletions: 12,
    filesChanged: 1
  },
  changedFiles: [
    { name: "index.html", additions: 45, deletions: 12, status: "modified" }
  ]
};

export const initialRepos: Repository[] = [
  {
    id: "gh-musafir-cafe",
    name: "musafir-cafe",
    visibility: "Public",
    icon: "share2",
    description: "Musafir Cafe digital experience and ordering web portal.",
    primaryBranch: "main",
    updatedAt: "just now",
    url: "https://github.com/dpxtd-ai/musafir-cafe",
    liveUrl: "https://dpxtd-ai.github.io/musafir-cafe/",
    techStack: ["HTML", "JavaScript", "CSS"],
    pipelineStatus: "passing",
    commitsCount: 12,
    openPRs: 0
  }
];

export const initialKanbanCards: KanbanCard[] = [];
export const initialCIPipelines: CIPipeline[] = [];
export const initialUrlEndpoints: UrlEndpoint[] = [];
