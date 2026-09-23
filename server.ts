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
      username: "dnyanchand",
      email: "dnyanchand@dev.hub",
      repoCount: 18,
      role: "Lead Maintainer"
    },
    stats: {
      totalCommits: 1428,
      sprintCommits: 42,
      sprintName: "Sprint 34",
      primaryBranch: "main",
      velocityAvg: "+12.4% avg",
      activePRs: 12,
      activePipelines: 8,
      passingPipelines: 8,
      totalLinesAdded: 284,
      totalLinesDeleted: 46,
      filesChanged: 8,
      dailyVelocity: [
        { day: "Day 1", date: "Sep 10", commits: 14 },
        { day: "Day 2", date: "Sep 11", commits: 18 },
        { day: "Day 3", date: "Sep 12", commits: 22 },
        { day: "Day 4", date: "Sep 13", commits: 16 },
        { day: "Day 5", date: "Sep 14", commits: 19 },
        { day: "Day 6", date: "Sep 15", commits: 26 },
        { day: "Day 7", date: "Sep 16", commits: 24 },
        { day: "Day 8", date: "Sep 17", commits: 20 },
        { day: "Day 9", date: "Sep 18", commits: 29 },
        { day: "Day 10", date: "Sep 19", commits: 31 },
        { day: "Day 11", date: "Sep 20", commits: 28 },
        { day: "Day 12", date: "Sep 21", commits: 34 },
        { day: "Day 13", date: "Sep 22", commits: 38 },
        { day: "Day 14", date: "Sep 23", commits: 42, current: true }
      ]
    },
    latestCommit: {
      hash: "9f8e21a",
      fullHash: "9f8e21a8d05e34b901fc349cb112048f029c9103",
      message: "feat: implement high-density terminal metrics & latency probe (#521)",
      branch: "acme/web-app:main",
      syncMethod: "GitHub Webhook",
      timeAgo: "18 mins ago",
      timestamp: "Today at 14:32:08 UTC",
      author: {
        name: "Elena Rostova",
        email: "elena@acme.corp",
        avatar: "/src/assets/images/avatar_elena_rostova_1790176238815.jpg",
        role: "Staff Platform Engineer"
      },
      stats: {
        additions: 284,
        deletions: 46,
        filesChanged: 8
      },
      changedFiles: [
        { name: "src/telemetry/latency_probe.py", additions: 94, deletions: 12, status: "modified" },
        { name: "src/metrics/terminal_counter.py", additions: 72, deletions: 8, status: "modified" },
        { name: "src/api/webhook_receiver.py", additions: 48, deletions: 14, status: "modified" },
        { name: "src/analytics/velocity_engine.py", additions: 35, deletions: 2, status: "added" },
        { name: "tests/test_latency_probe.py", additions: 25, deletions: 4, status: "modified" },
        { name: "config/production_pipeline.yaml", additions: 10, deletions: 6, status: "modified" }
      ]
    },
    repos: [
      {
        id: "repo-1",
        name: "musafir-cafe",
        visibility: "Private",
        icon: "cloud",
        description: "Full-stack reservation, order dispatch, and payment gateway engine with Python FastAPI backend.",
        primaryBranch: "main",
        updatedAt: "12 mins ago",
        url: "https://github.com/dnyanchand/musafir-cafe",
        liveUrl: "https://musafir-cafe-prod.internal.app",
        techStack: ["Python 3.10", "FastAPI", "PostgreSQL", "Docker"],
        pipelineStatus: "passing",
        commitsCount: 248,
        openPRs: 2
      },
      {
        id: "repo-2",
        name: "email-automate",
        visibility: "Private",
        icon: "shield",
        description: "Asynchronous transactional mail dispatch system with delivery tracking and Celery worker mesh.",
        primaryBranch: "release-v2",
        updatedAt: "45 mins ago",
        url: "https://github.com/dnyanchand/email-automate",
        liveUrl: "https://email-dispatch.internal.app",
        techStack: ["Python 3.10", "Celery", "Redis", "RabbitMQ"],
        pipelineStatus: "passing",
        commitsCount: 184,
        openPRs: 1
      },
      {
        id: "repo-3",
        name: "ai-latency-probe",
        visibility: "Public",
        icon: "activity",
        description: "Sub-millisecond distributed network latency and throughput benchmarking daemon.",
        primaryBranch: "main",
        updatedAt: "3 hours ago",
        url: "https://github.com/dnyanchand/ai-latency-probe",
        liveUrl: "https://probe.network.internal",
        techStack: ["Python 3.10", "AsyncIO", "Prometheus"],
        pipelineStatus: "passing",
        commitsCount: 312,
        openPRs: 3
      },
      {
        id: "repo-4",
        name: "acme-web-hud",
        visibility: "Private",
        icon: "terminal",
        description: "Terminal developer heads-up-display frontend with real-time WebSocket state streaming.",
        primaryBranch: "main",
        updatedAt: "18 mins ago",
        url: "https://github.com/dnyanchand/acme-web-hud",
        liveUrl: "https://repohub-hud.internal.app",
        techStack: ["TypeScript", "Python Bridge", "TailwindCSS"],
        pipelineStatus: "passing",
        commitsCount: 512,
        openPRs: 4
      },
      {
        id: "repo-5",
        name: "terminal-metrics-core",
        visibility: "Private",
        icon: "cpu",
        description: "High-throughput log ingest and aggregate metrics counter service for distributed microservices.",
        primaryBranch: "main",
        updatedAt: "5 hours ago",
        url: "https://github.com/dnyanchand/terminal-metrics-core",
        liveUrl: "https://metrics.cluster.internal",
        techStack: ["Python 3.10", "NumPy", "gRPC"],
        pipelineStatus: "passing",
        commitsCount: 172,
        openPRs: 2
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
