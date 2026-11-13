#!/bin/bash
set -e

echo "=== [Crewly Starter] Initializing container environment ==="

# 1. Sync custom skills into user skills directory
mkdir -p /home/node/.crewly/skills
if [ -d "/home/node/seed-crewly/skills" ]; then
  echo "[Crewly Starter] Syncing custom skills (post-team-chat, manage-ticket-spec)..."
  cp -rf /home/node/seed-crewly/skills/* /home/node/.crewly/skills/
  chmod -R 755 /home/node/.crewly/skills/* 2>/dev/null || true
fi

# 2. Seed preconfigured teams if missing
if [ ! -d "/home/node/.crewly/teams/62132154-1530-4fc7-b0bc-54999a9c7fa8" ]; then
  echo "[Crewly Starter] Seeding QLDA Team (7 agents: Leader, TPM, Designer, FE, BE, Fullstack, Tester)..."
  mkdir -p /home/node/.crewly/teams
  cp -rf /home/node/seed-crewly/teams/* /home/node/.crewly/teams/
fi

# 3. Seed project definition if missing
if [ ! -f "/home/node/.crewly/projects.json" ]; then
  echo "[Crewly Starter] Seeding default project config..."
  cp /home/node/seed-crewly/projects.json /home/node/.crewly/projects.json
fi

node /home/node/seed-crewly/install-atelierx.cjs

# 4. Dynamically adjust project path in projects.json to match the mounted directory
node -e "
const fs = require('fs');
const pFile = '/home/node/.crewly/projects.json';
if (fs.existsSync(pFile)) {
  try {
    const list = JSON.parse(fs.readFileSync(pFile, 'utf8'));
    let targetPath = '/home/node/project/Barbershop-Booking-System';
    if (!fs.existsSync(targetPath)) {
      if (fs.existsSync('/home/node/project/apps') || fs.existsSync('/home/node/project/package.json')) {
        targetPath = '/home/node/project';
      }
    }
    let changed = false;
    list.forEach(p => {
      if (p.id === 'f0c67446-db1b-4209-b12b-d45e577b1d97' && p.path !== targetPath) {
        p.path = targetPath;
        changed = true;
      }
    });
    if (changed) {
      fs.writeFileSync(pFile, JSON.stringify(list, null, 2), 'utf8');
      console.log('[Crewly Starter] Updated project path to:', targetPath);
    }
  } catch (err) {
    console.error('[Crewly Starter] Failed to adjust project path:', err.message);
  }
}
"

# 5. Fix permissions for node user if root
if [ "$(id -u)" = "0" ]; then
  chown -R node:node /home/node/.crewly /home/node/seed-crewly 2>/dev/null || true
  exec su node -c "crewly start --no-browser"
else
  exec crewly start --no-browser
fi

