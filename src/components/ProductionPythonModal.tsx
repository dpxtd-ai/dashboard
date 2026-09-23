import React, { useState } from 'react';
import { X, Server, Copy, Check, Terminal, ExternalLink, Code2 } from 'lucide-react';

interface ProductionPythonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PYTHON_SERVER_SNIPPET = `#!/usr/bin/env python3
"""
RepoHub Terminal HUD - Standalone Production Python Backend
Zero-dependency, production-ready HTTP REST server using standard library.
"""
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from urllib.parse import urlparse, parse_qs
from datetime import datetime, timezone

class RepoHubAPI(BaseHTTPRequestHandler):
    def _headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._headers(204)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/health":
            self._headers(200)
            self.wfile.write(json.dumps({"status": "healthy", "python": "3.10"}).encode())
        elif path == "/api/metrics":
            self._headers(200)
            self.wfile.write(json.dumps({
                "totalCommits": 1428,
                "sprintCommits": 42,
                "velocityAvg": "+12.4% avg"
            }).encode())
        else:
            self._headers(404)
            self.wfile.write(b'{"error": "Not Found"}')

if __name__ == "__main__":
    port = 8000
    print(f"[*] Serving RepoHub API on http://0.0.0.0:{port}")
    HTTPServer(("0.0.0.0", port), RepoHubAPI).serve_forever()
`;

export const ProductionPythonModal: React.FC<ProductionPythonModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!isOpen) return null;

  const copyCode = () => {
    navigator.clipboard.writeText(PYTHON_SERVER_SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCurl = () => {
    navigator.clipboard.writeText('curl -X GET http://localhost:8000/api/metrics');
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-xl border border-[#233550] bg-[#0d1422] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1b273c] bg-[#090e18] px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Server className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-semibold text-white">Production Python Deployment</h3>
              <p className="text-xs text-slate-400">Standalone Python backend service & deployment recipes</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto font-mono text-xs">
          {/* Quick Run Card */}
          <div className="rounded-lg border border-[#1e2a3c] bg-[#070b13] p-4">
            <div className="text-slate-300 font-semibold mb-1 text-sm font-sans flex items-center justify-between">
              <span>Run Production Python Server Directly</span>
              <span className="text-[11px] text-emerald-400 font-mono">Zero external dependencies</span>
            </div>
            <p className="text-slate-400 font-sans text-xs mb-3">
              This repository contains <code className="text-cyan-300">python_production/server.py</code> ready for direct standalone execution in Linux, Docker, or Kubernetes:
            </p>

            <div className="bg-[#05080e] p-3 rounded border border-[#1b2537] text-cyan-200 select-all flex justify-between items-center">
              <code>python3 python_production/server.py 8000</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('python3 python_production/server.py 8000');
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-slate-400 hover:text-white ml-2 shrink-0"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Test with Curl */}
          <div className="rounded-lg border border-[#1e2a3c] bg-[#070b13] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-sans font-semibold">Test Metric Endpoint via cURL</span>
              <button
                onClick={copyCurl}
                className="text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedCurl ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span className="text-[11px] font-sans">Copy</span>
              </button>
            </div>
            <div className="bg-[#05080e] p-2.5 rounded border border-[#1b2537] text-emerald-400">
              <code>curl -X GET http://localhost:8000/api/metrics</code>
            </div>
          </div>

          {/* Source Code Preview */}
          <div>
            <div className="flex items-center justify-between mb-2 font-sans">
              <span className="text-slate-300 text-xs font-semibold">
                Core Production Python Engine (<code className="text-cyan-400">python_production/server.py</code>)
              </span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>Copy Python Code</span>
              </button>
            </div>

            <pre className="rounded-lg border border-[#1b2537] bg-[#05080e] p-3 text-slate-300 overflow-x-auto max-h-56 text-[11px] leading-relaxed">
              {PYTHON_SERVER_SNIPPET}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#1b273c] bg-[#090e18] px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-cyan-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-cyan-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
