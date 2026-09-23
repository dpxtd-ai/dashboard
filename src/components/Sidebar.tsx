import React from 'react';

export type HudMode = 'terminal';

interface SidebarProps {
  currentMode: HudMode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMode
}) => {
  return (
    <aside className="w-full md:w-64 shrink-0 border-r border-[#1a2333] bg-[#0b0f17] p-4 flex flex-col justify-between">
      <div>
        {/* HUD MODES Section Header */}
        <div className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
          HUD MODES
        </div>

        <nav className="space-y-1.5">
          <div
            className="group relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium bg-[#151f32] text-white shadow-sm border border-[#233552] cursor-default"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center font-mono text-xs border border-cyan-500/40 rounded px-1 py-0.5 text-cyan-300">
                &gt;_
              </span>
              <span className="tracking-tight font-medium text-slate-100">Repository Terminal</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};
