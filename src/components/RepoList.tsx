import React from 'react';
import { 
  Link2, 
  ExternalLink, 
  Cloud, 
  Shield, 
  Activity, 
  Terminal, 
  Cpu, 
  Database, 
  Lock, 
  Share2, 
  Code2
} from 'lucide-react';
import { Repository } from '../types';

interface RepoListProps {
  repos: Repository[];
  totalCount: number;
  selectedRepoName?: string;
  onOpenRepo: (repo: Repository) => void;
  onSelectRepo?: (repo: Repository) => void;
}

export const RepoList: React.FC<RepoListProps> = ({
  repos,
  selectedRepoName,
  onOpenRepo,
  onSelectRepo
}) => {
  // Exclude "dashboard" from the Working project url list as requested
  // Any repo added to the account other than "dashboard" will show here
  const displayedRepos = repos.filter(repo => repo.name.toLowerCase() !== 'dashboard');

  const getRepoIcon = (iconName: string) => {
    switch (iconName) {
      case 'cloud': return <Cloud className="h-4 w-4 text-cyan-400" />;
      case 'shield': return <Shield className="h-4 w-4 text-purple-400" />;
      case 'activity': return <Activity className="h-4 w-4 text-emerald-400" />;
      case 'terminal': return <Terminal className="h-4 w-4 text-indigo-400" />;
      case 'cpu': return <Cpu className="h-4 w-4 text-amber-400" />;
      case 'database': return <Database className="h-4 w-4 text-blue-400" />;
      case 'lock': return <Lock className="h-4 w-4 text-rose-400" />;
      case 'share2': return <Share2 className="h-4 w-4 text-teal-400" />;
      default: return <Code2 className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="rounded-xl border border-[#1b2537] bg-[#0d131f] p-5 shadow-lg">
      {/* Header without Filter and Add Repo buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1b2537] pb-4">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-tight text-white">
            Working project url
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            Showing {displayedRepos.length} of {displayedRepos.length} {displayedRepos.length === 1 ? 'repo' : 'repos'}
          </span>
        </div>
      </div>

      {/* Repositories Rows List */}
      <div className="mt-4 space-y-2.5">
        {displayedRepos.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 font-mono">
            No active project repositories found. Any newly created repository on your GitHub account will automatically appear here.
          </div>
        ) : (
          displayedRepos.map((repo) => {
            const isSelected = selectedRepoName === repo.name;
            const liveUrl = repo.liveUrl || (repo.url ? `https://dpxtd-ai.github.io/${repo.name}/` : '');

            return (
              <div
                key={repo.id}
                onClick={() => onSelectRepo?.(repo)}
                className={`group flex flex-wrap items-center justify-between gap-4 rounded-lg border px-4 py-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500/60 bg-[#122036] shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'border-[#182335] bg-[#101725] hover:border-[#283852] hover:bg-[#131d2e]'
                }`}
              >
                {/* Left Column: Icon + Repo Name + Public Badge */}
                <div className="flex items-center gap-3.5">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                    isSelected ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300' : 'bg-[#192437] border-[#223149]'
                  }`}>
                    {getRepoIcon(repo.icon)}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`font-mono text-sm font-semibold transition-colors ${
                        isSelected ? 'text-cyan-300' : 'text-slate-100 group-hover:text-cyan-300'
                      }`}>
                        {repo.name}
                      </span>

                      {/* Badge: Public/Private */}
                      <span className={`rounded px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide ${
                        repo.visibility === 'Private'
                          ? 'bg-[#261d3b] text-[#c084fc] border border-[#3f2f5f]'
                          : 'bg-[#132d29] text-[#34d399] border border-[#1d4c42]'
                      }`}>
                        {repo.visibility}
                      </span>
                    </div>

                    {/* Secondary metadata */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{repo.techStack.join(' · ')}</span>
                      <span className="text-slate-600">·</span>
                      <span className="font-mono text-[10px] text-slate-500">branch: {repo.primaryBranch}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 text-[10px]">pushed {repo.updatedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Live Site link button only (GitHub link removed as requested) */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {liveUrl && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-950/30 px-3 py-1.5 text-xs font-mono font-medium text-emerald-300 hover:bg-emerald-900/50 hover:text-emerald-100 transition-colors"
                      title="Open Live Deployed Site"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
