#!/bin/bash
set -euo pipefail
REAL_PATH="$(readlink -f "${BASH_SOURCE[0]}")"
SCRIPT_DIR="$(cd "$(dirname "$REAL_PATH")" && pwd)"
node "${SCRIPT_DIR}/execute.cjs" "$@"

