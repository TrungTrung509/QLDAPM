#!/bin/sh
# Restart only the supervisor script if it exits; never restart worker sessions.
SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
while true; do
  node "$SCRIPT_DIR/atelierx-watchdog.cjs" >> /home/node/.crewly/atelierx-watchdog.log 2>&1
  sleep 30
done
