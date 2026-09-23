#!/usr/bin/env python3
"""
RepoHub Terminal HUD - Production Python Server
Zero-dependency, high-performance production HTTP REST API server.
Can be run directly with: python3 server.py --port 8000
"""

import sys
import os
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from datetime import datetime, timezone

# Add parent directory to path to import engine
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from python.repo_engine import get_initial_data
except ImportError:
    # Fallback if imported directly
    def get_initial_data():
        return {"status": "ok"}

DATA = get_initial_data()

class RepoHubAPIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = parse_qs(parsed.query)

        if path == "/api/health" or path == "/health":
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "healthy",
                "engine": "Python 3.10 Production Core",
                "timestamp": datetime.now(timezone.utc).isoformat()
            }).encode("utf-8"))
            return

        if path == "/api/data" or path == "/api/all":
            self._set_headers(200)
            self.wfile.write(json.dumps(DATA, indent=2).encode("utf-8"))
            return

        if path == "/api/repos":
            repos = DATA.get("repos", [])
            visibility = query.get("visibility", [None])[0]
            search = query.get("search", [None])[0]

            filtered = repos
            if visibility and visibility.lower() != "all":
                filtered = [r for r in filtered if r["visibility"].lower() == visibility.lower()]
            if search:
                search_lower = search.lower()
                filtered = [r for r in filtered if search_lower in r["name"].lower() or search_lower in r["description"].lower()]

            self._set_headers(200)
            self.wfile.write(json.dumps({
                "total": len(repos),
                "count": len(filtered),
                "repos": filtered
            }, indent=2).encode("utf-8"))
            return

        if path == "/api/metrics":
            self._set_headers(200)
            self.wfile.write(json.dumps(DATA.get("stats", {}), indent=2).encode("utf-8"))
            return

        if path == "/api/commits/latest":
            self._set_headers(200)
            self.wfile.write(json.dumps(DATA.get("latestCommit", {}), indent=2).encode("utf-8"))
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Endpoint not found", "path": path}).encode("utf-8"))

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"
        try:
            payload = json.loads(body)
        except Exception:
            payload = {}

        if path == "/api/python/execute":
            # Safely execute python analytics snippet
            code = payload.get("code", "")
            if not code:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "No code provided"}).encode("utf-8"))
                return

            import io
            import contextlib
            stdout_buf = io.StringIO()
            stderr_buf = io.StringIO()

            start_t = datetime.now()
            try:
                with contextlib.redirect_stdout(stdout_buf), contextlib.redirect_stderr(stderr_buf):
                    exec_globals = {
                        "DATA": DATA,
                        "datetime": datetime,
                        "json": json,
                        "math": __import__("math")
                    }
                    exec(code, exec_globals)
                duration_ms = (datetime.now() - start_t).total_seconds() * 1000
                output = stdout_buf.getvalue()
                error_out = stderr_buf.getvalue()
                self._set_headers(200)
                self.wfile.write(json.dumps({
                    "success": True,
                    "stdout": output,
                    "stderr": error_out,
                    "execution_time_ms": round(duration_ms, 2)
                }).encode("utf-8"))
            except Exception as e:
                duration_ms = (datetime.now() - start_t).total_seconds() * 1000
                self._set_headers(200)
                self.wfile.write(json.dumps({
                    "success": False,
                    "error": str(e),
                    "execution_time_ms": round(duration_ms, 2)
                }).encode("utf-8"))
            return

        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Unknown POST route"}).encode("utf-8"))

def run(port=8000):
    server_address = ("0.0.0.0", port)
    httpd = HTTPServer(server_address, RepoHubAPIHandler)
    print(f"[*] RepoHub Python Production Server listening on http://0.0.0.0:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[*] Server stopped.")

if __name__ == "__main__":
    port = 8000
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run(port)
