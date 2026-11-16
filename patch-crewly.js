#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const crewlyRoot = "/usr/local/lib/node_modules/crewly";

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.lstatSync(fullPath);
    if (stat.isSymbolicLink()) continue;
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

console.log("[Patch] Checking for version-check services in", crewlyRoot);

walkDir(crewlyRoot, (filePath) => {
  if (filePath.endsWith('/services/task-pool/task-pool.service.js')) {
    const content=fs.readFileSync(filePath,'utf8');
    const marker='requiresVerification(wi) {\n        const metaFlag = wi.metadata?.requiresVerification;';
    if(!content.includes(marker))throw Error('AtelierX verification policy target changed');
    fs.writeFileSync(filePath,content.replace(marker,"requiresVerification(wi) {\n        if (wi.target?.startsWith('atelierx-') || wi.metadata?.teamId === 'af30c001-2789-4f20-b917-000000000010') return false;\n        const metaFlag = wi.metadata?.requiresVerification;"),'utf8');
  }
  if (filePath.endsWith('/services/v3/request.service.js')) {
    const content=fs.readFileSync(filePath,'utf8');
    const marker='const previousStatus = request.status;';
    if(!content.includes(marker))throw Error('AtelierX ticket gate target changed');
    const guard=`${marker}\n        if (/PLAN_STANDALONE\\.md/.test(request.description ?? '') && (updates.status === 'waiting_confirmation' || (updates.status === 'done' && updates.accepted !== true))) { const id=String(updates.result ?? '').match(/ATEL-\\d+/)?.[0]; let published=false; if(id){try{const catalog=JSON.parse(await (await import('node:fs/promises')).readFile('/home/node/project/AtelierX/showcase/catalog.json','utf8'));published=catalog.products?.some(p=>p.id===id&&p.status==='complete')===true}catch{}} if(!published||!/ATELIERX_DELIVERY_VERIFIED/.test(String(updates.result ?? '')))updates={...updates,status:'running',accepted:false}; }`;
    fs.writeFileSync(filePath,content.replace(marker,guard),'utf8');
  }
  if (filePath.endsWith('/services/v3/ticket-review.service.js')) {
    const content=fs.readFileSync(filePath,'utf8');
    const marker="if (t.status !== 'waiting_confirmation' || !ticketNeedsReview(t) || !t.submittedAt)";
    if(!content.includes(marker))throw Error('AtelierX auto-accept gate target changed');
    fs.writeFileSync(filePath,content.replace(marker,"if (/PLAN_STANDALONE\\.md/.test(t.description ?? '')) continue;\n                "+marker),'utf8');
  }
  if (filePath.endsWith('runtime-fallback.service.js')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const marker = "await this.recheckAfterLogin(runtime);";
    if (!content.includes(marker)) throw new Error('Crewly login recovery patch target changed: ' + filePath);
    const replacement = `${marker}
            if (runtime === RUNTIME_TYPES.CODEX_CLI && !this.state.exhausted[runtime]
                && await this.deps.probe(runtime) === 'available') {
                const { TaskPoolService } = await import('../task-pool/task-pool.service.js');
                const { WorkItemDispatchSubscriber } = await import('../v3/workitem-dispatch.subscriber.js');
                const pool = TaskPoolService.getInstance();
                for (const item of await pool.getAllItems()) {
                    if (item.status === 'blocked' && item.target && /usage_limit|quota/i.test(item.blockedReason ?? ''))
                        await pool.releaseBack(item.id, 'Codex account signed in and quota probe passed');
                }
                const items = await pool.getAvailableItems();
                for (const item of items.filter((item) => item.status === 'queued' && item.target))
                    await WorkItemDispatchSubscriber.getInstance().redispatch(item);
            }`;
    fs.writeFileSync(filePath, content.replace(marker, replacement), 'utf8');
    console.log('[Patch] Codex login redispatches queued WorkItems:', filePath);
  }
  if (filePath.endsWith('runtime-usage-probe.js')) {
    const content = fs.readFileSync(filePath, 'utf8');
    const marker = "if (runtime !== RUNTIME_TYPES.CLAUDE_CODE)\n                return 'unsupported';";
    if (!content.includes(marker)) throw new Error('Crewly Codex probe patch target changed: ' + filePath);
    const replacement = `if (runtime === RUNTIME_TYPES.CODEX_CLI) {
                const binary = resolve('codex');
                if (!binary) return 'unknown';
                const scratch = deps.scratchDir ?? path.join(os.tmpdir(), 'crewly-usage-probe');
                fs.mkdirSync(scratch, { recursive: true });
                const env = { ...baseEnv };
                for (const name of STRIPPED_ENV) delete env[name];
                const result = await run(binary, ['exec', '--model', 'gpt-6-luna', '--skip-git-repo-check', '--sandbox', 'read-only', 'Reply exactly OK'], { env, timeoutMs, cwd: scratch });
                const match = detectUsageLimit(result.stdout + '\\n' + result.stderr, RUNTIME_TYPES.CODEX_CLI);
                if (match && isExhaustingKind(match.kind)) return 'limited';
                return result.code === 0 ? 'available' : 'unknown';
            }
            ${marker}`;
    fs.writeFileSync(filePath, content.replace(marker, replacement), 'utf8');
    console.log('[Patch] Codex usage probe enabled:', filePath);
  }
  if (filePath.endsWith("version-check.service.js")) {
    let content = fs.readFileSync(filePath, "utf8");
    // Force updateAvailable to false
    let patched = content.replace(
      /updateAvailable\s*=\s*latestVersion\s*!==\s*null\s*&&[^;]+;/g,
      "updateAvailable = false;",
    );
    patched = patched.replace(
      /async checkForUpdate\(\)\s*\{[\s\S]*?return this\.cachedResult;\s*\}/,
      "async checkForUpdate() { const currentVersion = this.getLocalVersion(); this.cachedResult = { currentVersion, latestVersion: currentVersion, updateAvailable: false }; return this.cachedResult; }",
    );
    if (patched !== content) {
      fs.writeFileSync(filePath, patched, "utf8");
      console.log("[Patch] Successfully patched:", filePath);
    }
  }

  if (filePath.endsWith("system-control.service.js")) {
    let content = fs.readFileSync(filePath, "utf8");
    let patched = content.replace(
      /async upgradeSystem\([^)]*\)\s*\{[\s\S]*?\n\s*\}/,
      'async upgradeSystem() { return { success: true, message: "System is running customized build. Upgrade disabled." }; }',
    );
    if (patched !== content) {
      fs.writeFileSync(filePath, patched, "utf8");
      console.log("[Patch] Successfully patched:", filePath);
    }
  }

  if (filePath.endsWith("runtime-startup-screen.js")) {
    const content = fs.readFileSync(filePath, "utf8");
    const marker = "const lines = shellOutputLines(output);";
    const replacement = "const lines = shellOutputLines(output).filter((line) => !/^WARNING: proceeding, even though we could not create PATH aliases: Permission denied \\(os error 13\\)$/.test(line));";
    if (!content.includes(marker)) throw new Error("Crewly startup screen patch target changed: " + filePath);
    fs.writeFileSync(filePath, content.replace(marker, replacement), "utf8");
    console.log("[Patch] Ignoring Codex PATH alias warning:", filePath);
  }

  if (filePath.endsWith("chat-v2.dispatcher.service.js")) {
    const content = fs.readFileSync(filePath, "utf8");
    const start = content.indexOf("async dispatchChannelMentions(channel, message) {");
    const end = content.indexOf("async dispatchToAgent(channel, message", start);
    if (start < 0 || end < 0) throw new Error("Crewly channel dispatch patch target changed: " + filePath);
    const section = content.slice(start, end);
    const marker = "channelName: channel.name,\n                agentSession: target.sessionName,";
    if (!section.includes(marker)) throw new Error("Crewly channel prompt format changed: " + filePath);
    const patched = section.replace(marker, "channelName: channel.name,\n                replyVia: 'reply-channel',\n                threadId: message.threadId ?? message.id,\n                agentSession: target.sessionName,");
    const assembled = content.slice(0, start) + patched + content.slice(end);
    const coreHint = "if (args.wakeRole !== 'orchestrator') {\n        const replyIdentity";
    if (!assembled.includes(coreHint)) throw new Error("Crewly generic reply hint changed: " + filePath);
    const routed = assembled.replace(coreHint, "if (args.wakeRole !== 'orchestrator' && replyVia !== 'reply-channel') {\n        const replyIdentity");
    const routeGuard = "if (message.senderType !== 'user') {\n            return {\n                strategy: 'skip',";
    if (!routed.includes(routeGuard)) throw new Error("Crewly route guard changed: " + filePath);
    fs.writeFileSync(filePath, routed.replace(routeGuard, "if (message.senderType !== 'user' && !(channel.type === 'channel' && message.senderType === 'agent')) {\n            return {\n                strategy: 'skip',"), "utf8");
    console.log("[Patch] Team channel replies use reply-channel:", filePath);
  }

  if (filePath.endsWith("chat-v2.service.js")) {
    const content = fs.readFileSync(filePath, "utf8");
    const start = content.indexOf("toMessageDTO(row, attachments) {");
    if (start < 0) throw new Error("Crewly message DTO changed: " + filePath);
    const prefix = content.slice(0, start);
    const section = content.slice(start);
    const before = "        return {\n            id: row.id,\n            channelId: row.channel_id,\n            seq: row.seq,\n            senderType: row.sender_type,\n            senderId: row.sender_id,";
    const after = "        const authorAgentSession = row.sender_kind === 'agent' && typeof metadata?.authorAgentSession === 'string' ? metadata.authorAgentSession : null;\n        return {\n            id: row.id,\n            channelId: row.channel_id,\n            seq: row.seq,\n            senderType: authorAgentSession ? 'agent' : row.sender_type,\n            senderId: authorAgentSession ?? row.sender_id,";
    if (!section.includes(before)) throw new Error("Crewly DTO sender mapping changed: " + filePath);
    fs.writeFileSync(filePath, prefix + section.replace(before, after), "utf8");
    console.log("[Patch] Display verified agent author in team chat:", filePath);
  }

  if (filePath.endsWith("chat-v2/sqlite/message.store.js")) {
    const content = fs.readFileSync(filePath, "utf8");
    const before = "  id, channel_id, seq, sender_type, sender_id, content, content_type,\n  created_at, metadata, mentions, thread_id";
    const after = "  id, channel_id, seq, sender_type, sender_id, sender_kind, agent_session, content, content_type,\n  created_at, metadata, mentions, thread_id";
    if (!content.includes(before)) throw new Error("Crewly message select columns changed: " + filePath);
    fs.writeFileSync(filePath, content.replace(before, after), "utf8");
    console.log("[Patch] Read agent author columns in chat API:", filePath);
  }

  if (filePath.endsWith("chat-v2.controller.js")) {
    const content = fs.readFileSync(filePath, "utf8");
    const before = "channelForDispatch && persisted.senderType === 'user'";
    const after = "channelForDispatch && (persisted.senderType === 'user' || (channelForDispatch.type === 'channel' && persisted.senderType === 'agent'))";
    if (!content.includes(before)) throw new Error("Crewly channel dispatch controller changed: " + filePath);
    fs.writeFileSync(filePath, content.replace(before, after), "utf8");
    console.log("[Patch] Keep agent mentions dispatchable:", filePath);
  }
});

console.log("[Patch] Crewly patching complete.");
