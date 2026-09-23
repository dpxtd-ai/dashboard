import React, { useState } from 'react';
import { GitPullRequest, CheckCircle2, PlayCircle, XCircle, Clock, RefreshCw, Terminal, Check } from 'lucide-react';
import { CIPipeline } from '../types';

interface PipelinesViewProps {
  pipelines: CIPipeline[];
}

export const PipelinesView: React.FC<PipelinesViewProps> = ({ pipelines: initialPipelines }) => {
  const [pipelines, setPipelines] = useState<CIPipeline[]>(initialPipelines);
  const [runningId, setRunningId] = useState<string | null>(null);

  const triggerRerun = (id: string) => {
    setRunningId(id);
    setPipelines(prev => prev.map(p => p.id === id ? { ...p, status: 'running', duration: '5s' } : p));

    setTimeout(() => {
      setPipelines(prev => prev.map(p => p.id === id ? { ...p, status: 'success', duration: '1m 20s' } : p));
      setRunningId(null);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#1b2537] bg-[#0d131f] p-4">
        <div className="flex items-center gap-2.5">
          <GitPullRequest className="h-5 w-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-semibold text-white">Pull Requests & CI/CD Pipelines</h2>
            <p className="text-xs text-slate-400">Automated Python test runners, mypy typechecking, and container build logs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/40">
            ● 8 / 8 Passing on main
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-[#1b2537] bg-[#0d131f] overflow-hidden">
        <div className="divide-y divide-[#182335]">
          {pipelines.map((pipe) => (
            <div key={pipe.id} className="p-4 flex flex-wrap items-center justify-between gap-4 hover:bg-[#111927] transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {pipe.status === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400" />}
                  {pipe.status === 'running' && <RefreshCw className="h-5 w-5 text-cyan-400 animate-spin" />}
                  {pipe.status === 'failed' && <XCircle className="h-5 w-5 text-rose-400" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-white">{pipe.title}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-cyan-400">{pipe.repo}</span>
                    <span>·</span>
                    <span className="font-mono">branch: {pipe.branch}</span>
                    <span>·</span>
                    <span>by {pipe.author}</span>
                    <span>·</span>
                    <span className="font-mono text-emerald-400">pytest ({pipe.testsCount} tests)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right text-xs font-mono">
                  <div className="flex items-center gap-1 text-slate-300 justify-end">
                    <Clock className="h-3 w-3 text-slate-500" />
                    <span>{pipe.duration}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{pipe.pythonVersion}</div>
                </div>

                <button
                  onClick={() => triggerRerun(pipe.id)}
                  disabled={runningId === pipe.id}
                  className="flex items-center gap-1.5 rounded-md border border-[#233550] bg-[#141f32] px-3 py-1.5 text-xs font-mono text-slate-300 hover:bg-[#1a2b45] hover:text-white transition-colors"
                >
                  <RefreshCw className={`h-3 w-3 text-cyan-400 ${runningId === pipe.id ? 'animate-spin' : ''}`} />
                  <span>Re-run CI</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
