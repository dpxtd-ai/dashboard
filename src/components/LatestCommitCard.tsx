import React, { useState } from 'react';
import { 
  GitCommit, 
  Clock, 
  Check, 
  Copy, 
  Calendar, 
  PlusCircle, 
  MinusCircle, 
  ExternalLink,
  Target
} from 'lucide-react';
import { LatestCommit } from '../types';

interface LatestCommitCardProps {
  commit: LatestCommit;
  onInspectCommit: () => void;
}

export const LatestCommitCard: React.FC<LatestCommitCardProps> = ({
  commit,
  onInspectCommit
}) => {
  const [copied, setCopied] = useState(false);

  const copyHash = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(commit.fullHash || commit.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[#1b2537] bg-[#0d131f] p-5 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header Row matching screenshot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center text-slate-400 font-mono text-sm">
              -o-
            </span>
            <h3 className="text-sm font-semibold tracking-tight text-white">
              Latest Commit Activity
            </h3>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
            <Clock className="h-3 w-3" />
            <span>{commit.timeAgo}</span>
          </div>
        </div>

        {/* Subtitle matching screenshot */}
        <p className="mt-2 text-xs text-slate-400 leading-normal">
          Most recent push synced via {commit.syncMethod} to{' '}
          <span className="font-mono text-slate-300">{commit.branch}</span>.
        </p>

        {/* Commit Detail Nested Box matching screenshot */}
        <div className="mt-4 rounded-lg border border-[#1d293d] bg-[#080d16] p-3.5 space-y-3">
          {/* Top row: circle target icon + commit message + commit hash badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <Target className="h-4 w-4 text-cyan-400 mt-0.5 shrink-0" />
              <p className="text-xs font-mono font-medium text-slate-200 line-clamp-2 leading-relaxed">
                {commit.message}
              </p>
            </div>

            <button
              onClick={copyHash}
              title="Copy commit SHA"
              className="flex items-center gap-1.5 rounded bg-[#162133] px-2 py-1 font-mono text-[11px] text-slate-300 border border-[#233550] hover:bg-[#1e2e47] hover:text-white shrink-0 transition-colors"
            >
              <span>{commit.hash}</span>
              {copied ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3 text-slate-400" />
              )}
            </button>
          </div>

          {/* Author row matching screenshot */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#162133] text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <img
                src={commit.author.avatar}
                alt={commit.author.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback avatar
                  (e.target as HTMLImageElement).src =
                    'https://api.dicebear.com/7.x/identicon/svg?seed=' + commit.author.name;
                }}
                className="h-5 w-5 rounded-full object-cover ring-1 ring-white/10"
              />
              <span className="font-medium text-slate-200">{commit.author.name}</span>
              <span className="text-slate-400 font-mono text-[11px]">&lt;{commit.author.email}&gt;</span>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span>{commit.timestamp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom status line matching screenshot */}
      <div className="mt-5 pt-3 border-t border-[#182335] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <PlusCircle className="h-3 w-3" />
            <span>+{commit.stats.additions} lines</span>
          </span>

          <span className="flex items-center gap-1 text-rose-400">
            <MinusCircle className="h-3 w-3" />
            <span>-{commit.stats.deletions} lines</span>
          </span>

          <span className="text-slate-400">
            · {commit.stats.filesChanged} files changed
          </span>
        </div>

        <button
          onClick={onInspectCommit}
          className="flex items-center gap-1 text-slate-400 hover:text-cyan-300 font-mono text-xs transition-colors"
        >
          <span>Inspect in GitHub</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
