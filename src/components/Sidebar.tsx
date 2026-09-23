import React from 'react';
import { Terminal, Columns, GitPullRequest, Link2, Activity, Play } from 'lucide-react';

export type HudMode = 'terminal' | 'kanban' | 'pipelines' | 'urls';

interface SidebarProps {
  currentMode: HudMode;
  onSelectMode: (mode: HudMode) => void;
  prCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMode,
  onSelectMode,
  prCount
}) => {
  const modes: { id: HudMode; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'terminal',
      label: 'Repository Terminal',
      icon: (
        <span className="flex items-center justify-center font-mono text-xs border border-slate-600/60 rounded px-1 py-0.5 text-slate-300">
          &gt;_
        </span>
      )
    },
    {
      id: 'kanban',
      label: 'Unified Kanban',
      icon: <Columns className="h-4 w-4 text-slate-400" />
    },
    {
      id: 'pipelines',
      label: 'PRs & CI Pipelines',
      icon: <GitPullRequest className="h-4 w-4 text-slate-400" />,
      badge: prCount
    },
    {
      id: 'urls',
      label: 'URL Directory',
      icon: <Link2 className="h-4 w-4 text-slate-400" />
    }
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-[#1a2333] bg-[#0b0f17] p-4 flex flex-col justify-between">
      <div>
        {/* HUD MODES Section Header as in screenshot */}
        <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
          HUD MODES
        </div>

        <nav className="space-y-1.5">
          {modes.map((mode) => {
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onSelectMode(mode.id)}
                className={`group relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#151f32] text-white shadow-sm border border-[#233552]'
                    : 'text-slate-400 hover:bg-[#121927] hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                    {mode.icon}
                  </div>
                  <span className="tracking-tight">{mode.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Badge count (e.g. 12 for PRs) */}
                  {mode.badge !== undefined && (
                    <span className="rounded-md bg-[#1e293b] px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-300 border border-slate-700/50">
                      {mode.badge}
                    </span>
                  )}

                  {/* Active Indicator Dot on right side as in screenshot */}
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer telemetry & stats */}
      <div className="mt-8 rounded-lg border border-[#1e2a3f] bg-[#0e1522] p-3 text-xs">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Activity className="h-3 w-3 text-emerald-400" />
            <span>Python Webhook Daemon</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">PORT 3000</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Listening for GitHub push events on primary branch <code className="font-mono text-cyan-300">main</code>.
        </p>
      </div>
    </aside>
  );
};
