import React, { useState } from 'react';
import { 
  Link2, 
  Filter, 
  ExternalLink, 
  Cloud, 
  Shield, 
  Activity, 
  Terminal, 
  Cpu, 
  Database, 
  Lock, 
  Share2, 
  Search, 
  Plus, 
  X,
  Code2
} from 'lucide-react';
import { Repository } from '../types';

interface RepoListProps {
  repos: Repository[];
  totalCount: number;
  selectedRepoName?: string;
  onOpenRepo: (repo: Repository) => void;
  onSelectRepo?: (repo: Repository) => void;
  onAddNewRepo: () => void;
}

export const RepoList: React.FC<RepoListProps> = ({
  repos,
  totalCount,
  selectedRepoName,
  onOpenRepo,
  onSelectRepo,
  onAddNewRepo
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<'All' | 'Private' | 'Public'>('All');
  const [showAll, setShowAll] = useState(false);

  // Filter repos
  const filtered = repos.filter(repo => {
    const matchesSearch = 
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesVis = visibilityFilter === 'All' || repo.visibility === visibilityFilter;
    return matchesSearch && matchesVis;
  });

  // By default display 5 as shown in screenshot ("Showing 5 of 18 repos"), or all if toggled
  const displayLimit = showAll ? filtered.length : 5;
  const displayedRepos = filtered.slice(0, displayLimit);

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
      {/* Header matching screenshot exactly */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1b2537] pb-4">
        <div className="flex items-center gap-2">
          <Link2 className="h-4 w-4 text-cyan-400" />
          <h2 className="text-sm font-semibold tracking-tight text-white">
            Working project url
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400">
            Showing {displayedRepos.length} of {totalCount} repos
          </span>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-1.5 rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
              filterOpen || searchQuery || visibilityFilter !== 'All'
                ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300'
                : 'border-[#223147] bg-[#121927] text-slate-300 hover:bg-[#1a2538] hover:text-white'
            }`}
          >
            <Filter className="h-3 w-3" />
            <span>Filter</span>
          </button>

          <button
            onClick={onAddNewRepo}
            className="flex items-center gap-1 rounded-md bg-[#192438] px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-[#23334e] hover:text-white transition-colors border border-[#263750]"
            title="Track new repository"
          >
            <Plus className="h-3 w-3" />
            <span className="hidden sm:inline">Add Repo</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Expansion Tray */}
      {filterOpen && (
        <div className="mt-3 rounded-lg border border-[#223147] bg-[#0b0f17] p-3 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by repo name, tech stack, or description..."
                className="w-full rounded-md border border-[#1e2a3c] bg-[#131b28] py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 bg-[#131b28] p-1 rounded-md border border-[#1e2a3c]">
              {(['All', 'Private', 'Public'] as const).map((vis) => (
                <button
                  key={vis}
                  onClick={() => setVisibilityFilter(vis)}
                  className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    visibilityFilter === vis
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {vis}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Repositories Rows List matching screenshot */}
      <div className="mt-4 space-y-2.5">
        {displayedRepos.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No repositories matched the selected filters.
          </div>
        ) : (
          displayedRepos.map((repo) => {
            const isSelected = selectedRepoName === repo.name;
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
                {/* Left Column: Icon + Repo Name + Private/Public Badge */}
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

                      {isSelected && (
                        <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-cyan-300 border border-cyan-500/30">
                          Active Focus
                        </span>
                      )}

                      {/* Badge as seen in screenshot: e.g. Private in purple capsule */}
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

                {/* Right Column: Open Button matching screenshot */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {repo.liveUrl && repo.liveUrl !== repo.url && (
                    <a
                      href={repo.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-950/20 px-2.5 py-1.5 text-xs font-mono font-medium text-emerald-300 hover:bg-emerald-900/40 transition-colors"
                      title="Open Live Deployed Site"
                    >
                      <span>Live Site</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-md border border-[#223149] bg-[#151f31] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-cyan-500/40 hover:bg-[#1b273d] hover:text-cyan-300"
                    title="Open on GitHub"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Show more toggle */}
      {filtered.length > 5 && (
        <div className="mt-3 flex justify-center border-t border-[#1b2537] pt-3">
          <button
            onClick={() => setShowAll(!showAll)}
            className="font-mono text-xs text-cyan-400 hover:text-cyan-300 transition-colors py-1 px-3 rounded hover:bg-[#141d2d]"
          >
            {showAll ? 'Show less (5)' : `View all ${filtered.length} repositories →`}
          </button>
        </div>
      )}
    </div>
  );
};
