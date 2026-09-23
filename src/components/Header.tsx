import React, { useState } from 'react';
import { GitBranch, ChevronDown, Terminal, RefreshCw, Zap, Server, Check, Copy } from 'lucide-react';

interface HeaderProps {
  repoCount: number;
  userName: string;
  userAvatar?: string;
  onOpenTerminal: () => void;
  onOpenPythonGuide: () => void;
  onSimulateWebhook: () => void;
  onOpenAccountModal: () => void;
  onSyncLive: () => void;
  isSimulating: boolean;
  isSyncing: boolean;
  lastSyncedAt?: string;
}

export const Header: React.FC<HeaderProps> = ({
  repoCount,
  userName,
  userAvatar,
  onOpenTerminal,
  onOpenPythonGuide,
  onSimulateWebhook,
  onOpenAccountModal,
  onSyncLive,
  isSimulating,
  isSyncing,
  lastSyncedAt
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState(false);

  const copyEndpoint = () => {
    navigator.clipboard.writeText('https://api.github.com/users/' + userName);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  return (
    <header className="relative border-b border-[#1a2333] bg-[#0b0f17] px-5 py-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Brand Identity & User Context */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {/* Custom Branching HUD Logo matching screenshot */}
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

          {/* User profile dropdown pill */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-md bg-[#131b2a] px-2.5 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-[#1a2538] hover:text-white border border-[#223049]"
            >
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="h-5 w-5 rounded-full object-cover ring-1 ring-cyan-400/40" />
              ) : (
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
              )}
              <span className="font-medium text-slate-100">{userName}</span>
              <span className="font-mono text-slate-400">{repoCount} repos</span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute left-0 mt-2 w-72 rounded-lg border border-[#223049] bg-[#0f172a] p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-2 mb-2">
                  {userAvatar && (
                    <img src={userAvatar} alt={userName} className="h-8 w-8 rounded-full border border-cyan-400" />
                  )}
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{userName}</div>
                    <div className="text-[11px] font-mono text-cyan-400">Live GitHub Dynamic Mode</div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between py-1 px-1.5 rounded hover:bg-slate-800/60">
                    <span className="text-slate-400">Live Repositories:</span>
                    <span className="font-mono font-semibold text-white">{repoCount}</span>
                  </div>
                  <div className="flex justify-between py-1 px-1.5 rounded hover:bg-slate-800/60">
                    <span className="text-slate-400">Data Source:</span>
                    <span className="font-mono font-semibold text-emerald-400">api.github.com</span>
                  </div>
                  {lastSyncedAt && (
                    <div className="flex justify-between py-1 px-1.5 rounded hover:bg-slate-800/60">
                      <span className="text-slate-400">Last Synced:</span>
                      <span className="font-mono text-slate-300 text-[11px]">{lastSyncedAt}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAccountModal();
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-mono underline"
                  >
                    Change GitHub Account
                  </button>
                  <button 
                    onClick={copyEndpoint}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {copiedStatus ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedStatus ? 'Copied' : 'API Link'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Runtime indicators & Quick Actions */}
        <div className="flex items-center gap-2.5">
          {/* Real Live API Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-mono font-medium text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live GitHub API</span>
          </div>

          {/* Sync Live Button */}
          <button
            onClick={onSyncLive}
            disabled={isSyncing}
            title="Fetch fresh data from GitHub REST API"
            className="flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-950/40 px-3 py-1.5 text-xs font-mono font-medium text-cyan-300 transition-colors hover:bg-cyan-900/60 hover:text-cyan-100"
          >
            <RefreshCw className={`h-3 w-3 text-cyan-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync GitHub'}</span>
          </button>

          {/* Simulate Push */}
          <button
            onClick={onSimulateWebhook}
            disabled={isSimulating}
            title="Simulate an incoming GitHub commit webhook"
            className="hidden md:flex items-center gap-1.5 rounded-md border border-[#223049] bg-[#131b2a] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-[#1a2538] hover:text-white"
          >
            <Zap className={`h-3 w-3 text-amber-400 ${isSimulating ? 'animate-bounce' : ''}`} />
            <span>Simulate Push</span>
          </button>

          {/* Interactive HUD Terminal Button */}
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-1.5 rounded-md border border-[#223049] bg-[#131b2a] px-3 py-1.5 text-xs font-mono font-medium text-slate-200 transition-colors hover:bg-[#1a2538] hover:text-white"
          >
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">&gt;_ Terminal</span>
          </button>

          {/* Python Production Backend Guide Button */}
          <button
            onClick={onOpenPythonGuide}
            className="hidden lg:flex items-center gap-1.5 rounded-md border border-indigo-500/30 bg-indigo-950/30 px-3 py-1.5 text-xs font-mono font-medium text-indigo-300 transition-colors hover:bg-indigo-900/50 hover:text-indigo-100"
          >
            <Server className="h-3.5 w-3.5 text-indigo-400" />
            <span>Python Config</span>
          </button>
        </div>
      </div>
    </header>
  );
};
