FROM node:20-bookworm-slim

# Install Linux system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl bash tmux jq procps lsof python3 make g++ ca-certificates chromium \
    && rm -rf /var/lib/apt/lists/*

# Install Crewly globally (official release)
RUN npm install -g crewly@1.20.472
RUN npm install -g @openai/codex@latest

# Install AI Harnesses (Antigravity CLI & Claude Code)
RUN npm install -g @anthropic-ai/claude-code@latest 2>/dev/null || true
RUN curl -fsSL https://antigravity.google/cli/install.sh | bash \
    && cp /root/.local/bin/agy /usr/local/bin/agy-bin \
    && chmod 755 /usr/local/bin/agy-bin

RUN apt-get update -qq && apt-get install -y -qq --no-install-recommends ripgrep \
    && rm -rf /var/lib/apt/lists/*

COPY agy-wrapper.sh /usr/local/bin/agy
RUN sed -i 's/\r$//' /usr/local/bin/agy && chmod 755 /usr/local/bin/agy

# Apply customized frontend overrides (3D Virtual Office, skills selector, custom UI)
COPY frontend-overrides/ /usr/local/lib/node_modules/crewly/frontend/dist/
RUN ln -sfn /home/node/project/AtelierX/showcase /usr/local/lib/node_modules/crewly/frontend/dist/atelierx-products

# Patch backend to suppress update checks and lock customized features
COPY patch-crewly.js /tmp/patch-crewly.js
RUN node /tmp/patch-crewly.js && rm /tmp/patch-crewly.js
COPY apply-atelierx-runtime.cjs /tmp/apply-atelierx-runtime.cjs
RUN node /tmp/apply-atelierx-runtime.cjs && rm /tmp/apply-atelierx-runtime.cjs
COPY runtime-accounts-pool.mjs /usr/local/lib/node_modules/crewly/dist/backend/backend/src/services/harness/runtime-accounts-pool.mjs
COPY apply-multi-account-pool.cjs /tmp/apply-multi-account-pool.cjs
RUN node /tmp/apply-multi-account-pool.cjs && rm /tmp/apply-multi-account-pool.cjs

# Setup directories for non-root node user and copy seed configuration
RUN mkdir -p /home/node/.crewly /home/node/.codex /home/node/project /home/node/seed-crewly /home/node/crewly-runtime /home/node/crewly-runtime-baked
COPY set-codex-fresh-start.cjs atelierx-watchdog.sh atelierx-watchdog.cjs codex-rate-limits.cjs atelierx-delivery.cjs atelierx-flow-dispatch.cjs atelierx-task-title.cjs start-atelierx-team.cjs /home/node/crewly-runtime-baked/
RUN cp -a /home/node/crewly-runtime-baked/. /home/node/crewly-runtime/ \
    && find /home/node/crewly-runtime-baked /home/node/crewly-runtime -type f -name "*.sh" -exec sed -i 's/\r$//' {} +
COPY seed-crewly/ /home/node/seed-crewly/
RUN find /home/node/seed-crewly -type f \( -name "*.sh" -o -name "*.cjs" \) -exec sed -i 's/\r$//' {} + \
    && chown -R node:node /home/node

# Copy container entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint.sh && chmod 755 /usr/local/bin/entrypoint.sh

USER node
WORKDIR /home/node/project

EXPOSE 8787

ENV NODE_ENV=production
ENV WEB_PORT=8787

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
