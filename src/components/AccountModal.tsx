import React, { useState } from 'react';
import { X, Github, Key, Check, RefreshCw, User, ShieldCheck } from 'lucide-react';
import { GitHubService } from '../services/githubService';

interface AccountModalProps {
  isOpen: boolean;
  currentUsername: string;
  onClose: () => void;
  onUpdateAccount: (username: string, token: string) => Promise<void>;
  isLoading: boolean;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  currentUsername,
  onClose,
  onUpdateAccount,
  isLoading
}) => {
  const [username, setUsername] = useState(currentUsername);
  const [token, setToken] = useState(GitHubService.getStoredToken());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    await onUpdateAccount(username.trim(), token.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-xl border border-[#233550] bg-[#0d1422] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1b273c] bg-[#090e18] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Github className="h-5 w-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">GitHub Account & Data Source</h3>
              <p className="text-xs text-slate-400">Live dynamic sync with GitHub REST API</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              GitHub Username or Organization *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. dpxtd-ai"
                className="w-full rounded-md border border-[#1e2a3c] bg-[#070b12] py-2 pl-9 pr-3 font-mono text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Loads all public repositories, commits, and branch activity directly from GitHub.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono text-slate-300">
                Personal Access Token (Optional)
              </label>
              <span className="text-[10px] text-slate-500 font-mono">Stored in browser localStorage</span>
            </div>
            <div className="relative">
              <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx (Optional for private repos)"
                className="w-full rounded-md border border-[#1e2a3c] bg-[#070b12] py-2 pl-9 pr-3 font-mono text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Enables access to private repositories and increases GitHub API rate limit from 60 to 5,000 requests/hr.
            </p>
          </div>

          <div className="rounded-lg border border-[#1a2538] bg-[#090f1a] p-3 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              All data is queried directly from <code className="text-cyan-300">api.github.com</code> in real time. Static placeholder data is replaced with live repo activity.
            </span>
          </div>

          <div className="pt-2 border-t border-[#1b273c] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-[#192437] px-3.5 py-1.5 text-xs text-slate-300 hover:bg-[#23324d]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-md bg-cyan-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : savedSuccess ? (
                <>
                  <Check className="h-3 w-3 text-emerald-300" />
                  <span>Synced!</span>
                </>
              ) : (
                <span>Sync Real Data</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
