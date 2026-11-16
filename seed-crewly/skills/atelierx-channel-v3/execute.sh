#!/usr/bin/env bash
set -euo pipefail
case "${1:-}" in --resolve) resolve=true; shift;; *) resolve=false;; esac
has_thread=false
has_new_thread=false
for arg in "$@"; do
  case "$arg" in --channel|-c|--json|--channel=*|--json=*|'{'*) echo "Use the AtelierX team channel only" >&2; exit 2;; esac
  case "$arg" in --thread|-t) has_thread=true;; --new-thread) has_new_thread=true;; esac
done
channel=$(node "$(dirname "$0")/resolve.cjs")
if "$resolve"; then printf '%s\n' "$channel"; exit; fi
: "${CREWLY_SESSION_NAME:?Run inside an agent session}"
if "$has_thread"; then
  set -- "$@" --adds-new
elif ! "$has_new_thread"; then
  set -- "$@" --new-thread
fi
result=$(bash /usr/local/lib/node_modules/crewly/config/skills/agent/core/reply-channel/execute.sh --channel "$channel" "$@") || { printf '%s\n' "$result" >&2; exit 1; }
printf '%s\n' "$result"
RESULT="$result" node -e 'const r=JSON.parse(process.env.RESULT); if(!r.messageId || r.posted === false) { console.error("AtelierX message was not posted in the team channel"); process.exit(1) }'
