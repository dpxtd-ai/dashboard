import React, { useState } from 'react';
import { RotateCcw, TrendingUp } from 'lucide-react';
import { DashboardStats } from '../types';

interface CommitCounterCardProps {
  stats: DashboardStats;
}

export const CommitCounterCard: React.FC<CommitCounterCardProps> = ({ stats }) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const maxCommits = Math.max(...stats.dailyVelocity.map(d => d.commits), 45);

  return (
    <div className="rounded-xl border border-[#1b2537] bg-[#0d131f] p-5 shadow-lg flex flex-col justify-between">
      <div>
        {/* Header Row matching screenshot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4 text-slate-400" />
            <h3 className="text-sm font-semibold tracking-tight text-white">
              Commit Counter
            </h3>
          </div>

          <div className="rounded-md border border-[#233550] bg-[#141f32] px-2.5 py-1 font-mono text-[11px] font-medium text-cyan-300">
            +{stats.sprintCommits} this sprint
          </div>
        </div>

        {/* Subtitle matching screenshot */}
        <p className="mt-2 text-xs text-slate-400 leading-normal">
          Total recorded commits on primary tracking branch <span className="font-mono text-slate-300">main</span>.
        </p>

        {/* Big Number: 1,428 commits */}
        <div className="mt-5 flex items-baseline gap-2">
          <span className="font-mono text-4xl sm:text-5xl font-bold tracking-tight text-white tabular-nums">
            {stats.totalCommits.toLocaleString()}
          </span>
          <span className="font-mono text-xs text-slate-400">
            commits
          </span>
        </div>
      </div>

      {/* 14-day velocity section matching screenshot */}
      <div className="mt-6 pt-4 border-t border-[#182335]">
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-slate-400">Recent 14-day velocity</span>
          <span className="font-mono font-semibold text-emerald-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {stats.velocityAvg}
          </span>
        </div>

        {/* 14-day bar chart matching screenshot */}
        <div className="relative">
          {/* Tooltip on hover */}
          {hoveredBar !== null && (
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-[#0b0f17] border border-cyan-500/40 px-2 py-0.5 text-[10px] font-mono text-cyan-300 whitespace-nowrap shadow-md z-10">
              {stats.dailyVelocity[hoveredBar].date}: {stats.dailyVelocity[hoveredBar].commits} commits
            </div>
          )}

          <div className="flex items-end justify-between gap-1.5 h-16 pt-2">
            {stats.dailyVelocity.map((day, idx) => {
              const heightPercent = Math.max(15, Math.round((day.commits / maxCommits) * 100));
              const isCurrent = day.current || idx === stats.dailyVelocity.length - 1;

              return (
                <div
                  key={day.day}
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="flex-1 flex flex-col items-center group cursor-pointer"
                >
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-sm transition-all duration-200 ${
                      isCurrent
                        ? 'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)]'
                        : 'bg-[#1e2a3c] hover:bg-[#2c3d56]'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2 px-0.5">
            <span>14d ago</span>
            <span>7d ago</span>
            <span className="text-cyan-300">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};
