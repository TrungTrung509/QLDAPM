#!/bin/bash
set -e

echo "=== [Crewly Starter] Initializing container environment ==="


# 1. Sync custom skills into user skills directory
mkdir -p /home/node/.crewly/skills
if [ -d "/home/node/seed-crewly/skills" ]; then
  echo "[Crewly Starter] Installing new custom skills without replacing existing volume files..."
  for skill in /home/node/seed-crewly/skills/*; do
    name="$(basename "$skill")"
    if [ ! -e "/home/node/.crewly/skills/$name" ]; then
      cp -r "$skill" "/home/node/.crewly/skills/$name"
      chmod -R 755 "/home/node/.crewly/skills/$name" 2>/dev/null || true
    fi
  done
fi

# 2. Seed the AtelierX project definition if missing
if [ ! -f "/home/node/.crewly/projects.json" ]; then
  echo "[Crewly Starter] Seeding default project config..."
  cp /home/node/seed-crewly/projects.json /home/node/.crewly/projects.json
fi

node /home/node/seed-crewly/install-atelierx.cjs
node /home/node/project/crewly-docker/set-codex-fresh-start.cjs

# Deterministic recovery; polling uses no model tokens.
sh /home/node/project/crewly-docker/atelierx-watchdog.sh &

# Fresh Codex conversations need a team start after the API is ready.
(
  for attempt in $(seq 1 90); do
    if curl -fsS http://127.0.0.1:8787/health >/dev/null 2>&1; then
      node /home/node/project/crewly-docker/start-atelierx-team.cjs
      exit $?
    fi
    sleep 2
  done
  echo '[Crewly Starter] AtelierX start skipped: API did not become healthy' >&2
) &

# 3. Fix permissions for node user if root
if [ "$(id -u)" = "0" ]; then
  chown -R node:node /home/node/.crewly /home/node/seed-crewly 2>/dev/null || true
  exec su node -c "crewly start --no-browser"
else
  exec crewly start --no-browser
fi

