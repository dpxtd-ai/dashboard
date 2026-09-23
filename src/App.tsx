import React, { useState, useEffect, useCallback } from 'react';
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
import { AccountModal } from './components/AccountModal';
import { GitHubService, GitHubUserProfile } from './services/githubService';
import { 
  initialStats, 
  initialLatestCommit, 
  initialRepos, 
  initialKanbanCards, 
  initialCIPipelines, 
  initialUrlEndpoints 
} from './data/mockData';
import { Repository, DashboardStats, LatestCommit, KanbanCard, CIPipeline, UrlEndpoint } from './types';

export default function App() {
  const [currentMode, setCurrentMode] = useState<HudMode>('terminal');
  const [username, setUsername] = useState<string>(() => GitHubService.getStoredUsername());
  const [userProfile, setUserProfile] = useState<GitHubUserProfile | null>(null);
  const [repos, setRepos] = useState<Repository[]>(initialRepos);
  const [selectedRepoName, setSelectedRepoName] = useState<string>('dashboard');
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [latestCommit, setLatestCommit] = useState<LatestCommit>(initialLatestCommit);
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>(initialKanbanCards);
  const [pipelines, setPipelines] = useState<CIPipeline[]>(initialCIPipelines);
  const [urlEndpoints, setUrlEndpoints] = useState<UrlEndpoint[]>(initialUrlEndpoints);

  // Sync state
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>('Just now');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isCommitInspectOpen, setIsCommitInspectOpen] = useState(false);
  const [isPythonGuideOpen, setIsPythonGuideOpen] = useState(false);
  const [isAddRepoOpen, setIsAddRepoOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  /**
   * Main function to fetch live dynamic data from GitHub REST API
   */
  const syncWithGitHub = useCallback(async (targetUser: string) => {
    setIsSyncing(true);
    try {
      // 1. Fetch user profile
      const profile = await GitHubService.fetchUserProfile(targetUser);
      setUserProfile(profile);

      // 2. Fetch all public/private repositories
      const rawRepos = await GitHubService.fetchUserRepos(targetUser);
      if (rawRepos && rawRepos.length > 0) {
        const transformedRepos = rawRepos.map(GitHubService.transformRepo);
        setRepos(transformedRepos);

        // Pick active repo (either previously selected or first repo)
        const activeRepo = transformedRepos.find(r => r.name.toLowerCase() === selectedRepoName.toLowerCase()) || transformedRepos[0];
        setSelectedRepoName(activeRepo.name);

        // 3. Fetch real commits for active repo
        const commits = await GitHubService.fetchRepoCommits(targetUser, activeRepo.name, 30);
        if (commits && commits.length > 0) {
          const transformedCommit = GitHubService.transformLatestCommit(commits[0], activeRepo.primaryBranch);
          setLatestCommit(transformedCommit);

          // 4. Compute real 14-day velocity and counts
          const dailyVelocity = GitHubService.computeVelocity(commits);
          const totalCommitsInPeriod = commits.length;
          
          setStats(prev => ({
            ...prev,
            totalCommits: Math.max(totalCommitsInPeriod, prev.totalCommits),
            sprintCommits: Math.min(totalCommitsInPeriod, 25),
            primaryBranch: activeRepo.primaryBranch,
            dailyVelocity,
            filesChanged: transformedCommit.stats.filesChanged,
            totalLinesAdded: transformedCommit.stats.additions,
            totalLinesDeleted: transformedCommit.stats.deletions,
            activePRs: activeRepo.openPRs,
            passingPipelines: transformedRepos.length,
            activePipelines: transformedRepos.length
          }));
        }

        // 5. Fetch real issues and PRs for active repo
        const [issues, pulls] = await Promise.all([
          GitHubService.fetchRepoIssues(targetUser, activeRepo.name),
          GitHubService.fetchRepoPulls(targetUser, activeRepo.name)
        ]);
        const dynamicKanban = GitHubService.transformIssuesToKanban(issues, pulls, activeRepo.name);
        setKanbanCards(dynamicKanban);

        // 6. Generate dynamic pipelines and URL directory for all user repos
        setPipelines(GitHubService.generateDynamicPipelines(transformedRepos));
        setUrlEndpoints(GitHubService.generateDynamicUrlEndpoints(transformedRepos));

        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSyncedAt(timeStr);
        showToast(`Live dynamic data synced for @${targetUser}`);
      }
    } catch (err: any) {
      console.warn('GitHub API sync note:', err.message);
      showToast(`Showing cached HUD data for @${targetUser}`);
    } finally {
      setIsSyncing(false);
    }
  }, [selectedRepoName]);

  // Initial sync on mount
  useEffect(() => {
    syncWithGitHub(username);
  }, []);

  /**
   * Switch active repository to inspect its live commit and stats
   */
  const handleSelectRepo = async (repo: Repository) => {
    setSelectedRepoName(repo.name);
    showToast(`Loading live telemetry for ${repo.name}...`);
    try {
      const commits = await GitHubService.fetchRepoCommits(username, repo.name, 30);
      if (commits && commits.length > 0) {
        setLatestCommit(GitHubService.transformLatestCommit(commits[0], repo.primaryBranch));
        const dailyVelocity = GitHubService.computeVelocity(commits);
        setStats(prev => ({
          ...prev,
          primaryBranch: repo.primaryBranch,
          dailyVelocity,
          activePRs: repo.openPRs
        }));
      }

      const [issues, pulls] = await Promise.all([
        GitHubService.fetchRepoIssues(username, repo.name),
        GitHubService.fetchRepoPulls(username, repo.name)
      ]);
      setKanbanCards(GitHubService.transformIssuesToKanban(issues, pulls, repo.name));
      showToast(`Active focus set to ${repo.name}`);
    } catch {
      showToast(`Viewing ${repo.name}`);
    }
  };

  /**
   * Update GitHub credentials / username in modal
   */
  const handleUpdateAccount = async (newUsername: string, token: string) => {
    GitHubService.setStoredUsername(newUsername);
    GitHubService.setStoredToken(token);
    setUsername(newUsername);
    await syncWithGitHub(newUsername);
  };

  /**
   * Simulate a Webhook Push
   */
  const handleSimulateWebhook = async () => {
    setIsSimulating(true);
    const newHash = Math.random().toString(16).substring(2, 9);
    const dateStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setStats(prev => {
      const updatedDaily = [...prev.dailyVelocity];
      if (updatedDaily.length > 0) {
        updatedDaily[updatedDaily.length - 1] = {
          ...updatedDaily[updatedDaily.length - 1],
          commits: updatedDaily[updatedDaily.length - 1].commits + 1
        };
      }
      return {
        ...prev,
        totalCommits: prev.totalCommits + 1,
        sprintCommits: prev.sprintCommits + 1,
        dailyVelocity: updatedDaily
      };
    });

    setLatestCommit(prev => ({
      ...prev,
      hash: newHash,
      fullHash: newHash + "f41d08c8b21a",
      message: `fix(core): hot-reload dynamic routes & ping check (#${Math.floor(Math.random() * 50) + 10})`,
      timeAgo: 'Just now',
      timestamp: `Today at ${dateStr}`,
      stats: { additions: 34, deletions: 6, filesChanged: 2 },
      changedFiles: [
        { name: 'src/services/githubService.ts', additions: 28, deletions: 4, status: 'modified' },
        { name: 'src/App.tsx', additions: 6, deletions: 2, status: 'modified' }
      ]
    }));

    showToast(`Live push simulated on ${selectedRepoName}:main!`);
    setIsSimulating(false);
  };

  /**
   * Add a repository manually or via GitHub
   */
  const handleAddRepo = async (newRepoData: Partial<Repository>) => {
    const fallbackRepo: Repository = {
      id: `gh-custom-${Date.now()}`,
      name: newRepoData.name || 'new-service',
      visibility: newRepoData.visibility || 'Public',
      icon: 'terminal',
      description: newRepoData.description || 'Dynamic tracked repository',
      primaryBranch: 'main',
      updatedAt: 'Just now',
      url: `https://github.com/${username}/${newRepoData.name || 'new-service'}`,
      liveUrl: `https://${username}.github.io/${newRepoData.name || 'new-service'}/`,
      techStack: newRepoData.techStack || ['TypeScript'],
      pipelineStatus: 'passing',
      commitsCount: 1,
      openPRs: 0
    };

    const updated = [fallbackRepo, ...repos];
    setRepos(updated);
    setUrlEndpoints(GitHubService.generateDynamicUrlEndpoints(updated));
    setPipelines(GitHubService.generateDynamicPipelines(updated));
    setSelectedRepoName(fallbackRepo.name);
    showToast(`Repository ${fallbackRepo.name} added to HUD!`);
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

      {/* Top Header with live GitHub state */}
      <Header
        repoCount={repos.length}
        userName={userProfile?.name || username}
        userAvatar={userProfile?.avatar_url}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenPythonGuide={() => setIsPythonGuideOpen(true)}
        onSimulateWebhook={handleSimulateWebhook}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        onSyncLive={() => syncWithGitHub(username)}
        isSimulating={isSimulating}
        isSyncing={isSyncing}
        lastSyncedAt={lastSyncedAt}
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
              {/* Top Section: Working Project URL List */}
              <RepoList
                repos={repos}
                totalCount={repos.length}
                selectedRepoName={selectedRepoName}
                onSelectRepo={handleSelectRepo}
                onOpenRepo={handleSelectRepo}
                onAddNewRepo={() => setIsAddRepoOpen(true)}
              />

              {/* Bottom Section: Commit Counter & Latest Commit Activity Cards */}
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
            <KanbanBoard initialCards={kanbanCards} />
          )}

          {currentMode === 'pipelines' && (
            <PipelinesView pipelines={pipelines} />
          )}

          {currentMode === 'urls' && (
            <UrlDirectoryView endpoints={urlEndpoints} />
          )}
        </main>
      </div>

      {/* Account / Data Source Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        currentUsername={username}
        onClose={() => setIsAccountModalOpen(false)}
        onUpdateAccount={handleUpdateAccount}
        isLoading={isSyncing}
      />

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
