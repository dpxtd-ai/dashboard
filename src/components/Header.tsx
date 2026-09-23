import React from 'react';
import { GitBranch } from 'lucide-react';

interface HeaderProps {
  repoCount: number;
  userName: string;
  userAvatar?: string;
}

export const Header: React.FC<HeaderProps> = ({
  repoCount,
  userName,
  userAvatar
}) => {
  return (
    <header className="relative border-b border-[#1a2333] bg-[#0b0f17] px-5 py-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand Identity & Disabled User Profile Badge */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* Custom Branching HUD Logo */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-1.5 ring-1 ring-white/10 shadow-inner">
              <div className="relative flex items-center justify-center">
                <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-cyan-400"></div>
                <div className="absolute -right-1 -bottom-1 h-2 w-2 rounded-full bg-indigo-500"></div>
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <GitBranch className="h-4 w-4 text-cyan-400 transform -rotate-45" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white font-sans">
                  RepoHub
                </span>
                <span className="text-xs font-mono font-medium text-slate-400">
                  Terminal HUD
                </span>
              </div>
            </div>
          </div>

          {/* Profile pill - Disabled as requested, no dropdown or links */}
          <div 
            className="flex items-center gap-2 rounded-md bg-[#131b2a] px-2.5 py-1.5 text-xs font-medium text-slate-300 border border-[#223049] select-none cursor-default"
            title="Profile (read-only)"
          >
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="h-5 w-5 rounded-full object-cover ring-1 ring-cyan-400/40" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
            )}
            <span className="font-medium text-slate-200">{userName}</span>
            <span className="font-mono text-slate-400">{repoCount} {repoCount === 1 ? 'repo' : 'repos'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
