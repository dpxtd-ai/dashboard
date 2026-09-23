import React, { useState } from 'react';
import { Link2, ExternalLink, Activity, CheckCircle, Globe, Shield, RefreshCw } from 'lucide-react';
import { UrlEndpoint } from '../types';

interface UrlDirectoryViewProps {
  endpoints: UrlEndpoint[];
}

export const UrlDirectoryView: React.FC<UrlDirectoryViewProps> = ({ endpoints: initialEndpoints }) => {
  const [endpoints, setEndpoints] = useState<UrlEndpoint[]>(initialEndpoints);
  const [testingId, setTestingId] = useState<string | null>(null);

  const pingEndpoint = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setEndpoints(prev => prev.map(e => e.id === id ? { ...e, latencyMs: Math.floor(Math.random() * 20) + 10, lastChecked: 'Just now' } : e));
      setTestingId(null);
    }, 700);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#1b2537] bg-[#0d131f] p-4">
        <div className="flex items-center gap-2.5">
          <Link2 className="h-5 w-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-semibold text-white">Repository URL & Microservice Directory</h2>
            <p className="text-xs text-slate-400">Production deployments, staging gateways, webhooks, and OpenAPI documentation endpoints</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
          <span>5 Active Gateways</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {endpoints.map((ep) => (
          <div key={ep.id} className="rounded-xl border border-[#1b2537] bg-[#0d131f] p-4 flex flex-col justify-between hover:border-[#263750] transition-colors">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold ${
                  ep.environment === 'Production' ? 'bg-cyan-950/50 text-cyan-300 border border-cyan-800/40' :
                  ep.environment === 'Webhook' ? 'bg-purple-950/50 text-purple-300 border border-purple-800/40' :
                  'bg-emerald-950/50 text-emerald-300 border border-emerald-800/40'
                }`}>
                  {ep.environment}
                </span>

                <div className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>{ep.status}</span>
                  <span className="text-slate-500">({ep.latencyMs}ms)</span>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-white mb-1">{ep.title}</h3>
              <p className="font-mono text-xs text-cyan-400 break-all bg-[#090e18] p-2 rounded border border-[#182335] select-all">
                {ep.url}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#182335] flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 text-[11px]">Checked {ep.lastChecked}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => pingEndpoint(ep.id)}
                  className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded bg-[#131b28] border border-[#1e2a3c]"
                >
                  <RefreshCw className={`h-3 w-3 ${testingId === ep.id ? 'animate-spin' : ''}`} />
                  <span>Ping</span>
                </button>

                <a
                  href={ep.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-[#131b28] border border-[#1e2a3c]"
                >
                  <span>Open</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
