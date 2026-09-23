import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, HudMode } from './components/Sidebar';
import { RepoList } from './components/RepoList';
import { CommitCounterCard } from './components/CommitCounterCard';
import { LatestCommitCard } from './components/LatestCommitCard';
import { KanbanBoard } from './components/KanbanBoard';
import { PipelinesView } from './components/PipelinesView';
import { UrlDirectoryView } from './components/UrlDirectoryView';
import { PythonTerminalModal } from './components/PythonTerminalModal';
import { CommitInspectModal } from './components/CommitInspectModal';
import { AddRepoModal } from './components/AddRepoModal';
import { ProductionPythonModal } from './components/ProductionPythonModal';
import { 
  initialStats, 
  initialLatestCommit, 
  initialRepos, 
  initialKanbanCards, 
  initialCIPipelines, 
  initialUrlEndpoints 
} from './data/mockData';
import { Repository, DashboardStats, LatestCommit } from './types';

export default function App() {
  const [currentMode, setCurrentMode] = useState<HudMode>('terminal');
  const [repos, setRepos] = useState<Repository[]>(initialRepos);
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [latestCommit, setLatestCommit] = useState<LatestCommit>(initialLatestCommit);
  const [userName, setUserName] = useState<string>('Dnyanchand');

  // Modals state
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCommitInspectOpen, setIsCommitInspectOpen] = useState(false);
  const [isPythonGuideOpen, setIsPythonGuideOpen] = useState(false);
  const [isAddRepoOpen, setIsAddRepoOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with live fullstack backend if available
  useEffect(() => {
    async function loadLiveBackendData() {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const data = await res.json();
          if (data.user?.name) setUserName(data.user.name);
          if (data.stats) setStats(data.stats);
          if (data.latestCommit) setLatestCommit(data.latestCommit);
          if (data.repos?.length) setRepos(data.repos);
        }
      } catch (err) {
        // Fallback to initial embedded state
      }
    }
    loadLiveBackendData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Simulate Webhook Push
  const handleSimulateWebhook = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/webhook/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName: 'musafir-cafe',
          message: 'feat: optimize Redis async message queue & Celery latency (#522)',
          additions: 142,
          deletions: 18
        })
      });

      if (res.ok) {
        const data = await res.json();
        setLatestCommit(data.updatedCommit);
        setStats(prev => ({
          ...prev,
          totalCommits: data.newTotalCommits,
          sprintCommits: prev.sprintCommits + 1
        }));
        showToast('Webhook payload received! Commit #522 synced.');
      } else {
        throw new Error('API offline');
      }
    } catch {
      // Local fallback simulation
      const newHash = Math.random().toString(16).substring(2, 9);
      setStats(prev => ({
        ...prev,
        totalCommits: prev.totalCommits + 1,
        sprintCommits: prev.sprintCommits + 1
      }));
      setLatestCommit(prev => ({
        ...prev,
        hash: newHash,
        fullHash: newHash + "b98214fa82c40",
        message: 'feat: optimize Redis async message queue & Celery latency (#522)',
        timeAgo: 'Just now',
        timestamp: 'Today at ' + new Date().toISOString().substring(11, 19) + ' UTC',
        stats: { additions: 142, deletions: 18, filesChanged: 4 }
      }));
      showToast('Live Commit synced to musafir-cafe:main');
    } finally {
      setIsSimulating(false);
    }
  };

  // Add Repository
  const handleAddRepo = async (newRepoData: Partial<Repository>) => {
    try {
      const res = await fetch('/api/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRepoData)
      });
      if (res.ok) {
        const data = await res.json();
        setRepos(prev => [data.repo, ...prev]);
        showToast(`Repository ${data.repo.name} added to HUD!`);
        return;
      }
    } catch {}

    // Fallback local add
    const fallbackRepo: Repository = {
      id: `repo-${Date.now()}`,
      name: newRepoData.name || 'new-repo',
      visibility: newRepoData.visibility || 'Private',
      icon: 'cloud',
      description: newRepoData.description || 'Tracked service repository',
      primaryBranch: 'main',
      updatedAt: 'Just now',
      url: `https://github.com/dnyanchand/${newRepoData.name}`,
      liveUrl: `https://${newRepoData.name}.internal.app`,
      techStack: newRepoData.techStack || ['Python 3.10'],
      pipelineStatus: 'passing',
      commitsCount: 1,
      openPRs: 0
    };
    setRepos(prev => [fallbackRepo, ...prev]);
    showToast(`Repository ${fallbackRepo.name} added to HUD!`);
  };

  const handleOpenRepo = (repo: Repository) => {
    showToast(`Opened ${repo.name} repository overview`);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 rounded-lg border border-cyan-500/40 bg-[#0d1524] px-4 py-2.5 font-mono text-xs text-cyan-300 shadow-2xl animate-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        repoCount={repos.length}
        userName={userName}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenPythonGuide={() => setIsPythonGuideOpen(true)}
        onSimulateWebhook={handleSimulateWebhook}
        isSimulating={isSimulating}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar ("HUD MODES") */}
        <Sidebar
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
          prCount={stats.activePRs}
        />

        {/* Center / Right Viewport */}
        <main className="flex-1 p-5 md:p-6 overflow-y-auto max-w-[1440px] mx-auto w-full">
          {currentMode === 'terminal' && (
            <div className="space-y-6">
              {/* Top Section: Working Project URL List matching screenshot */}
              <RepoList
                repos={repos}
                totalCount={repos.length}
                onOpenRepo={handleOpenRepo}
                onAddNewRepo={() => setIsAddRepoOpen(true)}
              />

              {/* Bottom Section: Commit Counter & Latest Commit Activity Cards matching screenshot */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <CommitCounterCard stats={stats} />
                <LatestCommitCard
                  commit={latestCommit}
                  onInspectCommit={() => setIsCommitInspectOpen(true)}
                />
              </div>
            </div>
          )}

          {currentMode === 'kanban' && (
            <KanbanBoard initialCards={initialKanbanCards} />
          )}

          {currentMode === 'pipelines' && (
            <PipelinesView pipelines={initialCIPipelines} />
          )}

          {currentMode === 'urls' && (
            <UrlDirectoryView endpoints={initialUrlEndpoints} />
          )}
        </main>
      </div>

      {/* Modals */}
      <PythonTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      <CommitInspectModal
        isOpen={isCommitInspectOpen}
        commit={latestCommit}
        onClose={() => setIsCommitInspectOpen(false)}
      />

      <AddRepoModal
        isOpen={isAddRepoOpen}
        onClose={() => setIsAddRepoOpen(false)}
        onAddRepo={handleAddRepo}
      />

      <ProductionPythonModal
        isOpen={isPythonGuideOpen}
        onClose={() => setIsPythonGuideOpen(false)}
      />
    </div>
  );
}
