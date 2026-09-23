import React from 'react';
import { X, GitCommit, Target, FileCode, CheckCircle, ExternalLink, Calendar, User } from 'lucide-react';
import { LatestCommit } from '../types';

interface CommitInspectModalProps {
  isOpen: boolean;
  commit: LatestCommit;
  onClose: () => void;
}

export const CommitInspectModal: React.FC<CommitInspectModalProps> = ({ isOpen, commit, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-xl border border-[#233550] bg-[#0d1422] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1b273c] bg-[#090e18] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <GitCommit className="h-5 w-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">GitHub Commit Inspector</h3>
              <p className="font-mono text-[11px] text-slate-400">{commit.branch}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Commit Message Box */}
          <div className="rounded-lg border border-[#1e2a3c] bg-[#070b13] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="font-mono text-xs font-semibold text-white">
                  {commit.message}
                </span>
                <p className="font-mono text-[11px] text-slate-400">
                  Full SHA: <span className="text-cyan-300">{commit.fullHash}</span>
                </p>
              </div>

              <span className="rounded bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 font-mono text-xs text-cyan-300 shrink-0">
                {commit.hash}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-[#182335] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <img
                  src={commit.author.avatar}
                  alt={commit.author.name}
                  referrerPolicy="no-referrer"
                  className="h-6 w-6 rounded-full ring-1 ring-white/10"
                />
                <span className="text-slate-200 font-medium">{commit.author.name}</span>
                <span className="text-slate-400 font-mono text-[11px]">&lt;{commit.author.email}&gt;</span>
              </div>

              <div className="flex items-center gap-1 font-mono text-[11px]">
                <Calendar className="h-3 w-3 text-slate-400" />
                <span>{commit.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-[#1b2537] bg-[#0b101c] p-3 text-center">
              <div className="text-xs text-slate-400">Additions</div>
              <div className="font-mono text-lg font-bold text-emerald-400">+{commit.stats.additions}</div>
            </div>
            <div className="rounded-lg border border-[#1b2537] bg-[#0b101c] p-3 text-center">
              <div className="text-xs text-slate-400">Deletions</div>
              <div className="font-mono text-lg font-bold text-rose-400">-{commit.stats.deletions}</div>
            </div>
            <div className="rounded-lg border border-[#1b2537] bg-[#0b101c] p-3 text-center">
              <div className="text-xs text-slate-400">Files Changed</div>
              <div className="font-mono text-lg font-bold text-cyan-400">{commit.stats.filesChanged}</div>
            </div>
          </div>

          {/* Changed Files List */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Changed Files ({commit.changedFiles.length})
            </h4>

            <div className="rounded-lg border border-[#1b2537] bg-[#080d16] divide-y divide-[#182335]">
              {commit.changedFiles.map((file, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-cyan-400" />
                    <span className="text-slate-200">{file.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400">+{file.additions}</span>
                    <span className="text-rose-400">-{file.deletions}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-[#1b273c] bg-[#090e18] px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-[#192437] px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-[#23324d] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
