#!/usr/bin/env bash
set -euo pipefail
case "${1:-}" in --resolve) resolve=true; shift;; *) resolve=false;; esac
for arg in "$@"; do
  case "$arg" in --channel|-c|--json|--channel=*|--json=*|'{'*) echo "Use the AtelierX team channel only" >&2; exit 2;; esac
done
channel=$(node "$(dirname "$0")/resolve.cjs")
if "$resolve"; then printf '%s\n' "$channel"; exit; fi
: "${CREWLY_SESSION_NAME:?Run inside an agent session}"
exec bash /usr/local/lib/node_modules/crewly/config/skills/agent/core/reply-channel/execute.sh --channel "$channel" "$@"
