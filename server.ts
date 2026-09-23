import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Memory store initialized with mock + Python engine sync
let repoData: any = null;

// Load initial data from python/repo_engine.py or fallback
async function loadRepoData() {
  try {
    const pythonScript = path.join(__dirname, 'python', 'repo_engine.py');
    if (fs.existsSync(pythonScript)) {
      const { stdout } = await execFileAsync('python3', [pythonScript, 'dump']);
      repoData = JSON.parse(stdout);
      return repoData;
    }
  } catch (err) {
    console.warn('[Server] Error calling python/repo_engine.py, using embedded state:', err);
  }

  // Fallback state
  repoData = {
    user: {
      name: "Dnyanchand",
      username: "dpxtd-ai",
      email: "ygyan0804@gmail.com",
      repoCount: 2,
      role: "Lead Maintainer",
      avatarUrl: "https://avatars.githubusercontent.com/u/327059590?v=4"
    },
    stats: {
      totalCommits: 28,
      sprintCommits: 14,
      sprintName: "Live Sprint",
      primaryBranch: "main",
      velocityAvg: "+18.2% avg",
      activePRs: 1,
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
    },
    latestCommit: {
      hash: "14aae0c",
      fullHash: "14aae0c85e585a5db32dc20a6ab957c39a5d06b9",
      message: "feat: initialize RepoHub Terminal HUD project",
      branch: "dashboard:main",
      syncMethod: "GitHub REST API",
      timeAgo: "Live",
      timestamp: "Today at 15:22:40 UTC",
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
        { name: "package.json", additions: 35, deletions: 1, status: "modified" }
      ]
    },
    repos: [
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
    ]
  };
  return repoData;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Load initial data
  await loadRepoData();

  // Python version check
  let pythonVersion = "Python 3.10";
  try {
    const { stdout } = await execFileAsync('python3', ['--version']);
    pythonVersion = stdout.trim();
  } catch (e) {
    // ignore
  }

  // --- REST API ROUTES ---
  app.get('/api/health', (req, res) => {
    res.json({
      status: "ok",
      python: pythonVersion,
      serverTime: new Date().toISOString(),
      activeRepo: "musafir-cafe",
      totalRepos: repoData.repos.length
    });
  });

  app.get('/api/data', (req, res) => {
    res.json(repoData);
  });

  app.get('/api/repos', (req, res) => {
    const { visibility, search } = req.query;
    let list = [...repoData.repos];
    if (visibility && visibility !== 'all') {
      list = list.filter(r => r.visibility.toLowerCase() === (visibility as string).toLowerCase());
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    res.json({
      total: repoData.repos.length,
      filteredCount: list.length,
      repos: list
    });
  });

  app.get('/api/metrics', (req, res) => {
    res.json(repoData.stats);
  });

  app.get('/api/commits/latest', (req, res) => {
    res.json(repoData.latestCommit);
  });

  // Execute live Python code directly on host Python 3 runtime
  app.post('/api/python/run', async (req, res) => {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: "Missing or invalid 'code' string parameter" });
    }

    const startTime = Date.now();
    try {
      // Execute code with 6 second timeout
      const { stdout, stderr } = await execFileAsync('python3', ['-c', code], {
        timeout: 6000,
        maxBuffer: 1024 * 512
      });

      const durationMs = Date.now() - startTime;
      res.json({
        success: true,
        stdout: stdout || "",
        stderr: stderr || "",
        durationMs,
        pythonVersion
      });
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      res.json({
        success: false,
        error: err.message || "Execution failed",
        stderr: err.stderr || err.toString(),
        durationMs,
        pythonVersion
      });
    }
  });

  // Simulate webhook push to update live commit & counter
  app.post('/api/webhook/simulate', (req, res) => {
    const { message, author, repoName, additions = 34, deletions = 12 } = req.body;
    const newHash = Math.random().toString(16).substring(2, 9);
    repoData.stats.totalCommits += 1;
    repoData.stats.sprintCommits += 1;
    repoData.latestCommit = {
      hash: newHash,
      fullHash: newHash + "a1b2c3d4e5f60718293a4b5c6d7e8f",
      message: message || "chore(core): automated latency regression benchmark pass",
      branch: `${repoName || 'musafir-cafe'}:main`,
      syncMethod: "GitHub Webhook (Live Trigger)",
      timeAgo: "Just now",
      timestamp: `Today at ${new Date().toISOString().substring(11, 19)} UTC`,
      author: {
        name: author || "Elena Rostova",
        email: "elena@acme.corp",
        avatar: "/src/assets/images/avatar_elena_rostova_1790176238815.jpg",
        role: "Staff Platform Engineer"
      },
      stats: {
        additions: Number(additions),
        deletions: Number(deletions),
        filesChanged: Math.max(1, Math.floor(Math.random() * 6))
      },
      changedFiles: [
        { name: "src/telemetry/latency_probe.py", additions: 22, deletions: 4, status: "modified" },
        { name: "python_production/server.py", additions: 12, deletions: 8, status: "modified" }
      ]
    };

    res.json({
      success: true,
      updatedCommit: repoData.latestCommit,
      newTotalCommits: repoData.stats.totalCommits
    });
  });

  // Add new repository
  app.post('/api/repos', (req, res) => {
    const { name, visibility = 'Private', description, techStack = ["Python 3.10"] } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Repository name is required" });
    }

    const newRepo = {
      id: `repo-${Date.now()}`,
      name: name.toLowerCase().replace(/\s+/g, '-'),
      visibility: visibility === 'Public' ? 'Public' : 'Private',
      icon: "cloud",
      description: description || "Production service repository tracked by RepoHub Terminal HUD.",
      primaryBranch: "main",
      updatedAt: "Just now",
      url: `https://github.com/dnyanchand/${name.toLowerCase().replace(/\s+/g, '-')}`,
      liveUrl: `https://${name.toLowerCase().replace(/\s+/g, '-')}.internal.app`,
      techStack: Array.isArray(techStack) ? techStack : [techStack],
      pipelineStatus: "passing",
      commitsCount: 1,
      openPRs: 0
    };

    repoData.repos.unshift(newRepo);
    repoData.user.repoCount = repoData.repos.length;

    res.json({
      success: true,
      repo: newRepo,
      totalRepos: repoData.repos.length
    });
  });

  // Integrate Vite dev middleware
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RepoHub] HUD Server listening on http://0.0.0.0:${PORT} (${pythonVersion})`);
  });
}

startServer().catch((err) => {
  console.error('[RepoHub Server Error]:', err);
  process.exit(1);
});
