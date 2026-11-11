#!/usr/bin/env bash
# Serve this repo's viewer on localhost only (default port 8765).
# From the Mac, when it runs on the Bizon:
#   ssh -N -L 8765:127.0.0.1:8765 bizon   then open http://localhost:8765
set -euo pipefail
PORT="${1:-${PORT:-8765}}"
cd "$(dirname "$0")"
echo "Suitable teardown on http://127.0.0.1:${PORT}  (Ctrl+C to stop)"
exec python3 -m http.server "$PORT" --bind 127.0.0.1
