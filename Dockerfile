FROM node:20-bookworm-slim

# Install Linux system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git curl bash tmux jq procps lsof python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install Crewly globally (official release)
RUN npm install -g crewly@latest

# Install AI Harnesses (Antigravity CLI & Claude Code)
RUN npm install -g @anthropic-ai/claude-code@latest 2>/dev/null || true
RUN curl -fsSL https://antigravity.google/cli/install.sh | bash \
    && cp /root/.local/bin/agy /usr/local/bin/agy-bin \
    && chmod 755 /usr/local/bin/agy-bin

COPY agy-wrapper.sh /usr/local/bin/agy
RUN sed -i 's/\r$//' /usr/local/bin/agy && chmod 755 /usr/local/bin/agy

# Apply customized frontend overrides (3D Virtual Office, skills selector, custom UI)
COPY frontend-overrides/ /usr/local/lib/node_modules/crewly/frontend/dist/

# Patch backend to suppress update checks and lock customized features
COPY patch-crewly.js /tmp/patch-crewly.js
RUN node /tmp/patch-crewly.js && rm /tmp/patch-crewly.js

# Setup directories for non-root node user and copy seed configuration
RUN mkdir -p /home/node/.crewly /home/node/project /home/node/seed-crewly
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
