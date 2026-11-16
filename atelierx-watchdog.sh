#!/bin/sh
# Restart only the supervisor script if it exits; never restart worker sessions.
while true; do
  node /home/node/project/crewly-docker/atelierx-watchdog.cjs >> /home/node/.crewly/atelierx-watchdog.log 2>&1
  sleep 30
done
