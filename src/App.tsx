import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RepoList } from './components/RepoList';
import { CommitCounterCard } from './components/CommitCounterCard';
import { LatestCommitCard } from './components/LatestCommitCard';
import { CommitInspectModal } from './components/CommitInspectModal';
import { GitHubService, GitHubUserProfile } from './services/githubService';
import { 
  initialStats, 
  initialLatestCommit, 
  initialRepos 
} from './data/mockData';
import { Repository, DashboardStats, LatestCommit } from './types';

export default function App() {
  const [username] = useState<string>(() => GitHubService.getStoredUsername());
  const [userProfile, setUserProfile] = useState<GitHubUserProfile | null>(null);
  const [repos, setRepos] = useState<Repository[]>(initialRepos);
  const [selectedRepoName, setSelectedRepoName] = useState<string>('musafir-cafe');
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [latestCommit, setLatestCommit] = useState<LatestCommit>(initialLatestCommit);

  // Modals state
  const [isCommitInspectOpen, setIsCommitInspectOpen] = useState(false);

  /**
   * Main function to fetch live dynamic data from GitHub REST API
   * Excludes the 'dashboard' repo itself as requested, so only user projects are shown.
   */
  const syncWithGitHub = useCallback(async (targetUser: string) => {
    try {
      // 1. Fetch user profile
      const profile = await GitHubService.fetchUserProfile(targetUser);
      setUserProfile(profile);

      // 2. Fetch all repositories
      const rawRepos = await GitHubService.fetchUserRepos(targetUser);
      if (rawRepos && rawRepos.length > 0) {
        const transformedRepos = rawRepos.map(GitHubService.transformRepo);
        
        // Filter out 'dashboard' so only actual project repos appear in the list
        const projectRepos = transformedRepos.filter(
          r => r.name.toLowerCase() !== 'dashboard'
        );
        
        setRepos(projectRepos);

        // Pick active repo (either previously selected or the first project repo)
        const activeRepo = projectRepos.find(
          r => r.name.toLowerCase() === selectedRepoName.toLowerCase()
        ) || projectRepos[0];

        if (activeRepo) {
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
              sprintCommits: Math.min(totalCommitsInPeriod, 15),
              primaryBranch: activeRepo.primaryBranch,
              dailyVelocity,
              filesChanged: transformedCommit.stats.filesChanged,
              totalLinesAdded: transformedCommit.stats.additions,
              totalLinesDeleted: transformedCommit.stats.deletions,
              activePRs: activeRepo.openPRs,
              passingPipelines: projectRepos.length,
              activePipelines: projectRepos.length
            }));
          }
        }
      }
    } catch (err: any) {
      console.warn('GitHub API sync note:', err.message);
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
    } catch (err) {
      console.warn('Could not fetch commits for', repo.name, err);
    }
  };

  // Only project repos (dashboard excluded)
  const projectRepos = repos.filter(r => r.name.toLowerCase() !== 'dashboard');

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Header with disabled profile indicator and clean title */}
      <Header
        repoCount={projectRepos.length}
        userName={userProfile?.name || username}
        userAvatar={userProfile?.avatar_url}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar ("HUD MODES") - only Repository Terminal kept */}
        <Sidebar currentMode="terminal" />

        {/* Center / Right Viewport */}
        <main className="flex-1 p-5 md:p-6 overflow-y-auto max-w-[1440px] mx-auto w-full">
          <div className="space-y-6">
            {/* Top Section: Working Project URL List (dashboard excluded, only Live Site button) */}
            <RepoList
              repos={projectRepos}
              totalCount={projectRepos.length}
              selectedRepoName={selectedRepoName}
              onSelectRepo={handleSelectRepo}
              onOpenRepo={handleSelectRepo}
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
        </main>
      </div>

      {/* Commit Details Modal */}
      <CommitInspectModal
        isOpen={isCommitInspectOpen}
        commit={latestCommit}
        onClose={() => setIsCommitInspectOpen(false)}
      />
    </div>
  );
}
