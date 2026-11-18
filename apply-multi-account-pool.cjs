#!/usr/bin/env node
/**
 * Patches Crewly's compiled backend (`dist/backend/backend/src`) to support
 * adding and load-balancing multiple accounts per runtime (`codex-cli`,
 * `antigravity-cli`, `claude-code`, `crewly-agent`, `gemini-cli`).
 *
 * Idempotent: safe to run repeatedly during Docker builds and tests.
 */

const fs = require('node:fs');
const path = require('node:path');

function replaceOnce(src, marker, replacement, label) {
  if (src.includes(replacement)) return src;
  if (!src.includes(marker)) {
    throw new Error(`Multi-account patch target changed [${label}]`);
  }
  return src.replace(marker, replacement);
}

function replaceAllOccurrences(src, marker, replacement, label, minCount = 1) {
  if (!src.includes(marker)) {
    if (src.includes(replacement)) return src;
    throw new Error(`Multi-account patch target changed [${label}]`);
  }
  const count = src.split(marker).length - 1;
  if (!src.includes(replacement) && count < minCount) {
    throw new Error(`Multi-account patch target count mismatch [${label}]: expected >= ${minCount}, found ${count}`);
  }
  return src.split(marker).join(replacement);
}

function patchFile(root, relative, label, transform) {
  const filePath = path.join(root, relative);
  const before = fs.readFileSync(filePath, 'utf8');
  const after = transform(
    before,
    (src, marker, replacement, subLabel) =>
      replaceOnce(src, marker, replacement, `${relative}:${subLabel || label}`),
    (src, marker, replacement, subLabel, minCount) =>
      replaceAllOccurrences(src, marker, replacement, `${relative}:${subLabel || label}`, minCount),
  );
  if (after !== before) {
    fs.writeFileSync(filePath, after, 'utf8');
  }
}

function apply(
  root = '/usr/local/lib/node_modules/crewly/dist/backend/backend/src',
  options = {},
) {
  const poolSource = options.poolModuleSource || path.join(__dirname, 'runtime-accounts-pool.mjs');
  const poolDest = path.join(root, 'services/harness/runtime-accounts-pool.mjs');
  if (fs.existsSync(poolSource)) {
    fs.mkdirSync(path.dirname(poolDest), { recursive: true });
    fs.copyFileSync(poolSource, poolDest);
  } else if (!fs.existsSync(poolDest)) {
    throw new Error(`Missing runtime-accounts-pool.mjs at ${poolSource}`);
  }

  // 1. Protect multi-account stores and isolated home directories from agent reads.
  patchFile(root, 'services/core/credential-files.js', 'guard-accounts', (src, rep) => {
    let out = rep(
      src,
      "import { CREWLY_CONSTANTS } from '../../../../config/constants.js';",
      "import { CREWLY_CONSTANTS } from '../../../../config/constants.js';\nimport { getAdditionalGuardedAccountPaths } from '../harness/runtime-accounts-pool.mjs';",
      'import',
    );
    out = rep(
      out,
      "add('claude-accounts', path.join(home, HARNESS_CONSTANTS.CLAUDE.ACCOUNTS.DIR), true);",
      "add('claude-accounts', path.join(home, HARNESS_CONSTANTS.CLAUDE.ACCOUNTS.DIR), true);\n    for (const extra of getAdditionalGuardedAccountPaths(home)) {\n        add(extra.id, extra.path, extra.isDirectory);\n    }",
      'paths',
    );
    return out;
  });

  // 2. Extend fallback target validation and settings (`balanceAccounts`).
  patchFile(root, 'services/runtime-fallback/runtime-fallback.types.js', 'types', (src, rep) => {
    let out = rep(
      src,
      "import { isClaudeAccountTarget, parseRuntimeTarget } from '../harness/claude-accounts.js';",
      "import { isClaudeAccountTarget } from '../harness/claude-accounts.js';\nimport { isMultiAccountTarget, parseRuntimeTarget } from '../harness/runtime-accounts-pool.mjs';",
      'import',
    );
    out = rep(
      out,
      'return KNOWN_RUNTIMES.includes(target) || isClaudeAccountTarget(target);',
      'return KNOWN_RUNTIMES.includes(target) || isClaudeAccountTarget(target) || isMultiAccountTarget(target);',
      'isKnownRuntimeTarget',
    );
    out = rep(
      out,
      '        enabled: true,\n        chain: [...RUNTIME_FALLBACK_CONSTANTS.DEFAULT_CHAIN],',
      '        enabled: true,\n        balanceAccounts: true,\n        chain: [...RUNTIME_FALLBACK_CONSTANTS.DEFAULT_CHAIN],',
      'defaults',
    );
    out = rep(
      out,
      "    if ('orcFollows' in p) {",
      "    if ('balanceAccounts' in p) {\n        if (typeof p.balanceAccounts !== 'boolean')\n            throw new RuntimeFallbackSettingsError('balanceAccounts must be true or false');\n        next.balanceAccounts = p.balanceAccounts;\n    }\n    if ('orcFollows' in p) {",
      'patch',
    );
    out = rep(
      out,
      '    let out = base;',
      "    if (typeof base.balanceAccounts !== 'boolean') base.balanceAccounts = true;\n    let out = base;",
      'normalize',
    );
    return out;
  });

  // 3. Emit availability rows for all configured runtime accounts without duplicating Claude entries.
  patchFile(root, 'services/runtime-fallback/runtime-availability.js', 'availability', (src, rep) => {
    let out = rep(
      src,
      "import { runtimeTarget } from '../harness/claude-accounts.js';",
      "import { runtimeTarget } from '../harness/claude-accounts.js';\nimport { runtimeTarget as poolRuntimeTarget } from '../harness/runtime-accounts-pool.mjs';",
      'import',
    );
    out = rep(
      out,
      '    return [...runtimes, ...accounts];',
      `    const seen = new Set(runtimes.map((r) => r.runtime));
    const mergedAccounts = [];
    for (const acct of input.runtimeAccounts ?? []) {
        const target = acct.target || poolRuntimeTarget(acct.runtime, acct.name);
        if (seen.has(target)) continue;
        seen.add(target);
        const baseLabel = runtimeLabel(target);
        const label = acct.model ? \`\${baseLabel} · \${acct.model}\` : baseLabel;
        if (acct.runtime === RUNTIME_TYPES.CREWLY_AGENT) {
            mergedAccounts.push(acct.signedIn
                ? { runtime: target, label, selectable: true }
                : { runtime: target, label, selectable: false, reason: 'No API key saved' });
            continue;
        }
        const harness = input.harnesses.find((h) => h.id === acct.runtime);
        if (!harness || !harness.installed) {
            mergedAccounts.push({ runtime: target, label, selectable: false, reason: 'Not installed' });
            continue;
        }
        if (!acct.signedIn) {
            mergedAccounts.push({ runtime: target, label, selectable: false, reason: 'Not signed in (sign in from Settings → Runtimes)' });
            continue;
        }
        mergedAccounts.push({ runtime: target, label, selectable: true });
    }
    for (const acc of accounts) {
        if (seen.has(acc.runtime)) continue;
        seen.add(acc.runtime);
        mergedAccounts.push(acc);
    }
    return [...runtimes, ...mergedAccounts];`,
      'compute',
    );
    return out;
  });

  // 4. Pass runtimeAccounts into computeRuntimeAvailability in wiring.
  patchFile(root, 'services/runtime-fallback/runtime-fallback.wiring.js', 'wiring', (src, rep) => {
    let out = rep(
      src,
      "import { claudeAccountConfigDir, describeClaudeAccounts, listClaudeAccounts, parseRuntimeTarget } from '../harness/claude-accounts.js';",
      "import { claudeAccountConfigDir, describeClaudeAccounts, listClaudeAccounts, parseRuntimeTarget } from '../harness/claude-accounts.js';\nimport { baseRuntimeOf, listRuntimeAccounts } from '../harness/runtime-accounts-pool.mjs';",
      'import',
    );
    out = rep(
      out,
      "    if (orc?.runtimeType === RUNTIME_TYPES.CREWLY_AGENT)\n        modelIds.push(orc.modelId);\n    for (const team of await storage.getTeams().catch(() => [])) {\n        for (const member of team.members) {\n            if (member.runtimeType === RUNTIME_TYPES.CREWLY_AGENT)\n                modelIds.push(member.modelId);\n        }\n    }",
      "    if (baseRuntimeOf(orc?.runtimeType) === RUNTIME_TYPES.CREWLY_AGENT)\n        modelIds.push(orc.modelId);\n    for (const team of await storage.getTeams().catch(() => [])) {\n        for (const member of team.members) {\n            if (baseRuntimeOf(member.runtimeType) === RUNTIME_TYPES.CREWLY_AGENT)\n                modelIds.push(member.modelId);\n        }\n    }",
      'crewlyAgentModelsInUse',
    );
    out = rep(
      out,
      '                claudeAccounts: describeClaudeAccounts(),',
      '                claudeAccounts: describeClaudeAccounts(),\n                runtimeAccounts: listRuntimeAccounts({ claudeAccountsList: describeClaudeAccounts() }),',
      'availability',
    );
    return out;
  });

  // 4b. Normalize base runtime & resolve explicit @account targets in effective-runtime.js.
  patchFile(root, 'services/runtime-fallback/effective-runtime.js', 'effective-runtime', (src, rep) => {
    let out = rep(
      src,
      'let hooks = null;',
      `let hooks = null;
function baseRt(r) {
    return typeof r === 'string' && r.includes('@') ? r.slice(0, r.indexOf('@')) : r;
}
function acctRt(r) {
    return typeof r === 'string' && r.includes('@') ? r.slice(r.indexOf('@') + 1) : null;
}`,
      'helpers',
    );
    out = rep(
      out,
      `export function effectiveRuntimeType(sessionName, configured) {
    if (!hooks || !sessionName)
        return configured;
    try {
        return hooks.overrideFor(sessionName) ?? configured;
    }
    catch {
        return configured;
    }
}`,
      `export function effectiveRuntimeType(sessionName, configured) {
    const fallbackBase = baseRt(configured);
    if (!hooks || !sessionName)
        return fallbackBase;
    try {
        return hooks.overrideFor(sessionName) ?? fallbackBase;
    }
    catch {
        return fallbackBase;
    }
}`,
      'effectiveRuntimeType',
    );
    out = rep(
      out,
      `export function effectiveClaudeAccount(sessionName) {
    if (!hooks || !sessionName)
        return null;
    try {
        return hooks.accountFor(sessionName);
    }
    catch {
        return null;
    }
}`,
      `export function effectiveClaudeAccount(sessionName, configured) {
    if (!hooks || !sessionName)
        return configured ? acctRt(configured) : null;
    try {
        const hooked = hooks.accountFor(sessionName);
        if (hooked)
            return hooked;
        if (hooks.overrideFor(sessionName))
            return null;
        return configured ? acctRt(configured) : null;
    }
    catch {
        return configured ? acctRt(configured) : null;
    }
}`,
      'effectiveClaudeAccount',
    );
    return out;
  });

  // 5. Load balance across healthy accounts, track poolAssignments, fail over per-account, and activate new logins.
  patchFile(root, 'services/runtime-fallback/runtime-fallback.service.js', 'service', (src, rep, repAll) => {
    let out = rep(
      src,
      "import { accountOf, baseRuntimeOf, parseRuntimeTarget, runtimeTarget } from '../harness/claude-accounts.js';",
      "import { accountOf, baseRuntimeOf, parseRuntimeTarget, runtimeTarget } from '../harness/claude-accounts.js';\nimport { pickBalancedAccountTarget, resolveCrewlyAgentAccountModel } from '../harness/runtime-accounts-pool.mjs';",
      'import',
    );
    out = rep(
      out,
      '    recentRecoveries = new Map();',
      '    recentRecoveries = new Map();\n    /** Per-session load-balanced account assignments (runtime@account). */\n    poolAssignments = new Map();',
      'field',
    );
    out = rep(
      out,
      '    overrideFor(sessionName) {\n        const target = this.state.overrides[sessionName]?.runtime;\n        return target ? baseRuntimeOf(target) : null;\n    }',
      '    overrideFor(sessionName) {\n        const target = this.state.overrides[sessionName]?.runtime ?? this.poolAssignments.get(sessionName);\n        return target ? baseRuntimeOf(target) : null;\n    }',
      'overrideFor',
    );
    out = rep(
      out,
      '    accountFor(sessionName) {\n        const target = this.state.overrides[sessionName]?.runtime;\n        return target ? accountOf(target) : null;\n    }',
      '    accountFor(sessionName) {\n        const target = this.state.overrides[sessionName]?.runtime ?? this.poolAssignments.get(sessionName);\n        return target ? accountOf(target) : null;\n    }',
      'accountFor',
    );
    out = rep(
      out,
      '    async onAccountLogin(account) {',
      `    async onRuntimeAccountLogin(runtime, account) {
        this.availability = null;
        const target = runtimeTarget(runtime, account);
        try {
            await this.recheckAfterLogin(target);
            if (!this.state.exhausted[target]) {
                try {
                    const { TaskPoolService } = await import('../task-pool/task-pool.service.js');
                    const { WorkItemDispatchSubscriber } = await import('../v3/workitem-dispatch.subscriber.js');
                    const pool = TaskPoolService.getInstance();
                    for (const item of await pool.getAllItems()) {
                        if (item.status === 'blocked' && item.target && /usage_limit|quota/i.test(item.blockedReason ?? '')) {
                            await pool.releaseBack(item.id, \`\${target} signed in and ready\`);
                        }
                    }
                    const items = await pool.getAvailableItems();
                    for (const item of items.filter((item) => item.status === 'queued' && item.target)) {
                        await WorkItemDispatchSubscriber.getInstance().redispatch(item);
                    }
                }
                catch {
                    // Task pool may not be initialized in standalone unit tests.
                }
            }
        }
        finally {
            if (this.addToChains(target))
                this.logger.info('Added the signed-in account to the fallback order', { runtime: target });
            this.availability = null;
            void this.reevaluateExhausted().catch((err) => this.logger.warn('Re-evaluating agents after an account sign-in failed', { runtime: target, error: err instanceof Error ? err.message : String(err) }));
        }
    }
    async onAccountLogin(account) {
        return this.onRuntimeAccountLogin(RUNTIME_TYPES.CLAUDE_CODE, account);
    }
    async _unusedLegacyOnAccountLogin(account) {`,
      'onAccountLogin',
    );
    out = rep(
      out,
      `    addToChains(target) {
        const insert = (chain) => {
            if (chain.includes(target))
                return chain;
            let at = -1;
            chain.forEach((r, i) => {
                if (baseRuntimeOf(r) === RUNTIME_TYPES.CLAUDE_CODE)
                    at = i;
            });
            const next = [...chain];
            next.splice(at + 1, 0, target);
            return next;
        };
        const settings = this.state.settings;
        let changed = false;
        const chain = insert(settings.chain);
        if (chain !== settings.chain) {
            settings.chain = chain;
            changed = true;
        }
        for (const [memberId, own] of Object.entries(settings.memberChains)) {
            if (!own.some((r) => baseRuntimeOf(r) === RUNTIME_TYPES.CLAUDE_CODE))
                continue;
            const next = insert(own);
            if (next !== own) {
                settings.memberChains[memberId] = next;
                changed = true;
            }
        }
        if (changed)
            this.save();
        return changed;
    }`,
      `    addToChains(target) {
        const base = baseRuntimeOf(target);
        const insert = (chain) => {
            if (chain.includes(target))
                return chain;
            let at = -1;
            chain.forEach((r, i) => {
                if (baseRuntimeOf(r) === base)
                    at = i;
            });
            const next = [...chain];
            next.splice(at + 1, 0, target);
            return next;
        };
        const settings = this.state.settings;
        let changed = false;
        const chain = insert(settings.chain);
        if (chain !== settings.chain) {
            settings.chain = chain;
            changed = true;
        }
        for (const [memberId, own] of Object.entries(settings.memberChains)) {
            if (!own.some((r) => baseRuntimeOf(r) === base))
                continue;
            const next = insert(own);
            if (next !== own) {
                settings.memberChains[memberId] = next;
                changed = true;
            }
        }
        if (changed)
            this.save();
        return changed;
    }`,
      'addToChains',
    );
    out = repAll(
      out,
      'const current = this.state.overrides[sessionName]?.runtime ?? agent.primary;',
      'const current = this.state.overrides[sessionName]?.runtime ?? this.poolAssignments.get(sessionName) ?? agent.primary;',
      'reevaluate-and-doSwitch-current',
      2,
    );
    out = rep(
      out,
      'const target = this.state.overrides[sessionName]?.runtime ?? (await this.deps.getAgent(sessionName).catch(() => null))?.primary;',
      'const target = this.state.overrides[sessionName]?.runtime ?? this.poolAssignments.get(sessionName) ?? (await this.deps.getAgent(sessionName).catch(() => null))?.primary;',
      'onWorking-target',
    );
    out = rep(
      out,
      'const current = this.state.overrides[sessionName]?.runtime ?? runtime;',
      'const current = this.state.overrides[sessionName]?.runtime ?? this.poolAssignments.get(sessionName) ?? runtime;',
      'beforeDelivery-current',
    );
    out = rep(
      out,
      '            else if (!this.state.exhausted[existing.primary]) {',
      '            else if (!this.state.exhausted[existing.primary] && !this.state.exhausted[existing.runtime]) {',
      'resolveLaunch-check-existing-exhausted',
    );
    out = rep(
      out,
      `    async revertIdle() {
        for (const [sessionName, override] of Object.entries(this.state.overrides)) {
            if (this.state.exhausted[override.primary]) {
                await this.upgradeIfBetter(sessionName, override);
                continue;
            }`,
      `    async revertIdle() {
        const entries = Object.entries(this.state.overrides);
        if (entries.length === 0)
            return;
        const avail = await this.getAvailability();
        const selectableSet = new Set(avail.filter((a) => a.selectable).map((a) => a.runtime));
        for (const [sessionName, override] of entries) {
            if (this.state.exhausted[override.primary] || (avail.length > 0 && !selectableSet.has(override.primary))) {
                await this.upgradeIfBetter(sessionName, override);
                continue;
            }`,
      'revertIdle-primary-guard',
    );
    out = rep(
      out,
      `    async resolveLaunch(input) {
        const configured = { runtime: input.configured, overridden: false };`,
      `    async resolveLaunch(input) {
        const { runtime: configuredBase, account: configuredAccount } = parseRuntimeTarget(input.configured);
        const configuredAccountModel = configuredBase === RUNTIME_TYPES.CREWLY_AGENT && configuredAccount
            ? resolveCrewlyAgentAccountModel(configuredAccount)
            : null;
        const configured = {
            runtime: configuredBase,
            overridden: false,
            ...(configuredAccount ? { claudeAccount: configuredAccount } : {}),
            ...(configuredAccountModel ? { crewlyAgentModel: configuredAccountModel } : {}),
        };
        if (configuredAccount) {
            this.poolAssignments.set(input.sessionName, input.configured);
        }`,
      'resolveLaunch-configured',
    );
    out = rep(
      out,
      `        if (!this.state.exhausted[input.configured]) {
            // Not out of usage, but maybe not installed / signed in on this machine
            // (a team moved here): run the agent on its fallback until it is.
            if (input.isOrchestrator && !this.state.settings.orcFollows)
                return configured;
            if (!(await this.markUnavailableHere(input.configured)))
                return configured;
        }`,
      `        if (configuredAccount) {
            if (!this.state.exhausted[input.configured]) {
                const avail = await this.getAvailability();
                const entry = avail.find((a) => a.runtime === input.configured);
                if (avail.length === 0 || (entry && entry.selectable)) {
                    this.poolAssignments.set(input.sessionName, input.configured);
                    return configured;
                }
            }
            this.poolAssignments.delete(input.sessionName);
        }
        else {
            const balanced = pickBalancedAccountTarget(
                input.sessionName,
                input.configured,
                await this.getAvailability(),
                this.state.exhausted,
                this.state.settings.balanceAccounts !== false,
            );
            if (balanced) {
                if (balanced === input.configured) {
                    this.poolAssignments.delete(input.sessionName);
                    if (!this.state.exhausted[input.configured])
                        return configured;
                }
                else {
                    this.poolAssignments.set(input.sessionName, balanced);
                    return this.decision(balanced);
                }
            }
            else {
                this.poolAssignments.delete(input.sessionName);
            }
            if (!this.state.exhausted[input.configured]) {
                // Not out of usage, but maybe not installed / signed in on this machine
                // (a team moved here): run the agent on its fallback until it is.
                if (input.isOrchestrator && !this.state.settings.orcFollows)
                    return configured;
                if (!(await this.markUnavailableHere(input.configured)))
                    return configured;
            }
        }`,
      'resolveLaunch-balance',
    );
    out = rep(
      out,
      `    targetOf(sessionName, runtime) {
        const override = this.state.overrides[sessionName]?.runtime;
        return override && baseRuntimeOf(override) === runtime ? override : runtime;
    }`,
      `    targetOf(sessionName, runtime) {
        const assigned = this.state.overrides[sessionName]?.runtime ?? this.poolAssignments.get(sessionName);
        return assigned && baseRuntimeOf(assigned) === runtime ? assigned : runtime;
    }`,
      'targetOf',
    );
    out = rep(
      out,
      '        const existing = this.state.overrides[sessionName];',
      '        this.poolAssignments.delete(sessionName);\n        const existing = this.state.overrides[sessionName];',
      'recordSwitch-clear-pool',
    );
    out = rep(
      out,
      `    async pickFallback(agent, current) {
        const available = await this.getAvailability();
        const selectable = new Set(available.filter((a) => a.selectable).map((a) => a.runtime));
        for (const runtime of this.chainFor(agent)) {
            if (runtime === current || this.state.exhausted[runtime])
                continue;
            if (selectable.has(runtime))
                return runtime;
        }
        return null;
    }`,
      `    async pickFallback(agent, current) {
        const available = await this.getAvailability();
        const selectable = new Set(available.filter((a) => a.selectable).map((a) => a.runtime));
        const sameBasePool = available
            .filter((a) => a.selectable && baseRuntimeOf(a.runtime) === baseRuntimeOf(agent.primary))
            .map((a) => a.runtime);
        const candidates = [...new Set([...this.chainFor(agent), ...sameBasePool])];
        for (const runtime of candidates) {
            if (runtime === current || this.state.exhausted[runtime])
                continue;
            if (selectable.has(runtime))
                return runtime;
        }
        return null;
    }`,
      'pickFallback',
    );
    out = rep(
      out,
      `    async snapshot() {
        const runtimes = (await this.getAvailability()).map((a) => ({ ...a, exhausted: Boolean(this.state.exhausted[a.runtime]) }));
        return {
            settings: this.getSettings(),
            runtimes,
            exhausted: Object.values(this.state.exhausted).map((e) => ({ ...e })),
            overrides: Object.keys(this.state.overrides)
                .map((s) => this.overrideView(s))
                .filter((v) => v !== null),
        };
    }`,
      `    clearAccountState(target) {
        delete this.state.exhausted[target];
        this.noticeDue?.delete(target);
        for (const [sess, assigned] of [...this.poolAssignments.entries()]) {
            if (assigned === target)
                this.poolAssignments.delete(sess);
        }
        this.save();
    }
    clearSessionRuntimeChange(sessionName) {
        if (!sessionName)
            return;
        this.poolAssignments.delete(sessionName);
        if (this.state.overrides[sessionName]) {
            delete this.state.overrides[sessionName];
            this.save();
        }
    }
    async snapshot() {
        const runtimes = (await this.getAvailability()).map((a) => ({ ...a, exhausted: Boolean(this.state.exhausted[a.runtime]) }));
        return {
            settings: this.getSettings(),
            runtimes,
            exhausted: Object.values(this.state.exhausted).map((e) => ({ ...e })),
            overrides: Object.keys(this.state.overrides)
                .map((s) => this.overrideView(s))
                .filter((v) => v !== null),
            poolAssignments: Object.fromEntries(this.poolAssignments),
        };
    }`,
      'snapshot',
    );
    out = rep(
      out,
      `    decision(target) {
        const { runtime, account } = parseRuntimeTarget(target);
        return {
            runtime,
            overridden: true,
            ...(account ? { claudeAccount: account } : {}),
            ...(runtime === RUNTIME_TYPES.CREWLY_AGENT ? { crewlyAgentModel: this.state.settings.crewlyAgentModel } : {}),
        };
    }`,
      `    decision(target) {
        const { runtime, account } = parseRuntimeTarget(target);
        const accountModel = runtime === RUNTIME_TYPES.CREWLY_AGENT && account ? resolveCrewlyAgentAccountModel(account) : null;
        return {
            runtime,
            overridden: true,
            ...(account ? { claudeAccount: account } : {}),
            ...(runtime === RUNTIME_TYPES.CREWLY_AGENT ? { crewlyAgentModel: accountModel || this.state.settings.crewlyAgentModel } : {}),
        };
    }`,
      'decision',
    );
    return out;
  });

  // 6. Probe named accounts and Antigravity keys independently.
  patchFile(root, 'services/runtime-fallback/runtime-usage-probe.js', 'probe', (src, rep) => {
    let out = rep(
      src,
      "import { claudeAccountEnv, parseRuntimeTarget } from '../harness/claude-accounts.js';",
      "import { claudeAccountEnv, parseRuntimeTarget } from '../harness/claude-accounts.js';\nimport { probeRuntimeAccountUsage } from '../harness/runtime-accounts-pool.mjs';",
      'import',
    );
    out = rep(
      out,
      '            const { runtime, account } = parseRuntimeTarget(target);',
      `            const { runtime, account } = parseRuntimeTarget(target);
            if (account || runtime === RUNTIME_TYPES.ANTIGRAVITY_CLI) {
                const fetchFn = deps.fetch ?? globalThis.fetch;
                const probed = await probeRuntimeAccountUsage(target, {
                    run,
                    resolve,
                    baseEnv,
                    fetchFn,
                    timeoutMs,
                    scratchDir: deps.scratchDir,
                    ...(typeof classifyCodexUsageProbe === 'function'
                        ? { classifyCodexResult: classifyCodexUsageProbe }
                        : {
                            classifyCodexResult: (r) => {
                                const m = detectUsageLimit((r.stdout || '') + '\\n' + (r.stderr || ''), RUNTIME_TYPES.CODEX_CLI);
                                if (m && isExhaustingKind(m.kind)) return 'limited';
                                return r.code === 0 ? 'available' : 'unknown';
                            },
                        }),
                });
                if (probed !== 'delegate')
                    return probed;
            }`,
      'account-probe',
    );
    return out;
  });

  // 7. Support per-account Codex & Claude broker sign-ins directly from the Web UI.
  patchFile(root, 'services/harness/login-broker.service.js', 'login-broker', (src, rep) => {
    let out = rep(
      src,
      "import { ensureClaudeAccountDir, prepareClaudeAccountAfterLogin } from './claude-accounts.js';",
      "import { ensureClaudeAccountDir, prepareClaudeAccountAfterLogin } from './claude-accounts.js';\nimport { ensureRuntimeAccountDir } from './runtime-accounts-pool.mjs';",
      'import',
    );
    out = rep(
      out,
      `        const account = options.account;
        if (account && def.id !== HARNESS_CONSTANTS.IDS.CLAUDE_CODE) {
            throw new LoginBrokerError('unsupported_method', \`\${def.displayName} has no per-account "\${method}" login\`);
        }
        const live = this.getActiveSession(def.id, account);
        if (live)
            return live;
        this.prune();
        const env = this.buildEnv();
        if (account) {
            try {
                env[HARNESS_CONSTANTS.CLAUDE.CONFIG_DIR_ENV] = this.ensureAccountDir(account);
            }
            catch (error) {
                throw new LoginBrokerError('spawn_failed', \`Could not create the account folder: \${error instanceof Error ? error.message : String(error)}\`);
            }
        }
        if (def.id === HARNESS_CONSTANTS.IDS.CLAUDE_CODE) {
            // A token or key in the env would satisfy \`claude auth login\` without
            // a sign-in (and a token in the env is what Claude Code would use
            // instead of its own stored login).
            delete env[HARNESS_CONSTANTS.CLAUDE.OAUTH_TOKEN_ENV];
            delete env[HARNESS_CONSTANTS.CLAUDE.API_KEY_ENV];
        }`,
      `        const account = options.account;
        if (account && def.id !== HARNESS_CONSTANTS.IDS.CLAUDE_CODE && def.id !== HARNESS_CONSTANTS.IDS.CODEX_CLI) {
            throw new LoginBrokerError('unsupported_method', \`\${def.displayName} has no per-account "\${method}" login\`);
        }
        const live = this.getActiveSession(def.id, account);
        if (live)
            return live;
        this.prune();
        const env = this.buildEnv();
        if (account) {
            try {
                if (def.id === HARNESS_CONSTANTS.IDS.CODEX_CLI) {
                    env[HARNESS_CONSTANTS.CODEX.HOME_ENV] = ensureRuntimeAccountDir('codex-cli', account);
                }
                else {
                    env[HARNESS_CONSTANTS.CLAUDE.CONFIG_DIR_ENV] = this.ensureAccountDir(account);
                }
            }
            catch (error) {
                throw new LoginBrokerError('spawn_failed', \`Could not create the account folder: \${error instanceof Error ? error.message : String(error)}\`);
            }
        }
        if (def.id === HARNESS_CONSTANTS.IDS.CLAUDE_CODE) {
            // A token or key in the env would satisfy \`claude auth login\` without
            // a sign-in (and a token in the env is what Claude Code would use
            // instead of its own stored login).
            delete env[HARNESS_CONSTANTS.CLAUDE.OAUTH_TOKEN_ENV];
            delete env[HARNESS_CONSTANTS.CLAUDE.API_KEY_ENV];
        }
        if (def.id === HARNESS_CONSTANTS.IDS.CODEX_CLI) {
            delete env.OPENAI_API_KEY;
        }`,
      'start',
    );
    out = rep(
      out,
      `        const snapshot = { ...record.session };
        record.resolveDone(snapshot);
        this.emit(LOGIN_BROKER_EVENTS.FINISHED, snapshot);`,
      `        const snapshot = { ...record.session };
        record.resolveDone(snapshot);
        this.emit(LOGIN_BROKER_EVENTS.FINISHED, snapshot);
        if (state === 'succeeded') {
            void import('../runtime-fallback/runtime-fallback.service.js')
                .then(({ getRuntimeFallbackService }) => {
                const fb = getRuntimeFallbackService();
                if (!fb)
                    return;
                if (record.session.account)
                    return fb.onRuntimeAccountLogin?.(record.session.harnessId, record.session.account);
                return fb.onRuntimeLogin?.(record.session.harnessId);
            })
                .catch(() => undefined);
        }`,
      'finish',
    );
    return out;
  });

  // 8. Verify per-account Codex CLI logins against that account's isolated CODEX_HOME.
  patchFile(root, 'services/harness/harness.service.js', 'verify', (src, rep) => {
    let out = rep(
      src,
      "import { claudeAccountConfigDir } from './claude-accounts.js';",
      "import { claudeAccountConfigDir } from './claude-accounts.js';\nimport { accountDirFor } from './runtime-accounts-pool.mjs';",
      'import',
    );
    out = rep(
      out,
      `            const def = getHarnessDefinition(harnessId);
            if (!def)
                return false;
            const installed = await status.getInstalledInfo(def);
            const login = await status.getLoginInfo(def, installed.path);
            return login.loginState === 'logged_in';`,
      `            const def = getHarnessDefinition(harnessId);
            if (!def)
                return false;
            const installed = await status.getInstalledInfo(def);
            if (harnessId === HARNESS_CONSTANTS.IDS.CODEX_CLI && account) {
                const codexHome = accountDirFor('codex-cli', account);
                if (!codexHome)
                    return false;
                const scopedEnv = { ...env, [HARNESS_CONSTANTS.CODEX.HOME_ENV]: codexHome };
                delete scopedEnv.OPENAI_API_KEY;
                const scopedStatus = new HarnessStatusService({ logger, env: scopedEnv });
                const login = await scopedStatus.getLoginInfo(def, installed.path);
                return login.loginState === 'logged_in';
            }
            const login = await status.getLoginInfo(def, installed.path);
            return login.loginState === 'logged_in';`,
      'verify',
    );
    return out;
  });

  // 9. Inject account-specific HOME/API keys when spawning PTY or crewly-agent sessions.
  patchFile(root, 'services/agent/agent-registration.service.js', 'agent-env', (src, rep) => {
    let out = rep(
      src,
      "import { claudeAccountConfigDir, claudeAccountEnv } from '../harness/claude-accounts.js';",
      "import { claudeAccountConfigDir, claudeAccountEnv } from '../harness/claude-accounts.js';\nimport { baseRuntimeOf, runtimeAccountSpawnEnv } from '../harness/runtime-accounts-pool.mjs';",
      'import',
    );
    out = rep(
      out,
      `    buildAgentIdentityEnv(sessionName, role, cwd, runtimeType) {
        const account = runtimeType === RUNTIME_TYPES.CLAUDE_CODE ? effectiveClaudeAccount(sessionName) : null;
        return {
            ...harnessEnvForAgents(process.env, runtimeType),
            ...(account ? claudeAccountEnv(account) : {}),`,
      `    buildAgentIdentityEnv(sessionName, role, cwd, runtimeType, configuredTarget) {
        const rawTarget = configuredTarget ?? runtimeType;
        runtimeType = runtimeType ? baseRuntimeOf(runtimeType) : runtimeType;
        const account = runtimeType ? effectiveClaudeAccount(sessionName, rawTarget) : null;
        const accountEnv = account ? runtimeAccountSpawnEnv(runtimeType, account, { claudeAccountEnvFn: claudeAccountEnv }) : {};
        return {
            ...harnessEnvForAgents(process.env, runtimeType),
            ...accountEnv,`,
      'identityEnv',
    );
    out = rep(
      out,
      'const recreationKeyEnv = await this.buildApiKeyEnv(runtimeType);',
      'const recreationKeyEnv = await this.buildApiKeyEnv(baseRuntimeOf(runtimeType), sessionName, runtimeType);',
      'call1',
    );
    out = rep(
      out,
      `        const apiKeyEnv = await this.buildApiKeyEnv(config.runtimeType ?? RUNTIME_TYPES.CLAUDE_CODE);
        await (await this.getSessionHelper()).createSession(config.sessionName, config.projectPath, {
            env: { ...this.buildAgentIdentityEnv(config.sessionName, ORCHESTRATOR_ROLE, config.projectPath, config.runtimeType), ...apiKeyEnv },
        });`,
      `        const rawTarget = config.runtimeType ?? RUNTIME_TYPES.CLAUDE_CODE;
        const apiKeyEnv = await this.buildApiKeyEnv(baseRuntimeOf(rawTarget), config.sessionName, rawTarget);
        await (await this.getSessionHelper()).createSession(config.sessionName, config.projectPath, {
            env: { ...this.buildAgentIdentityEnv(config.sessionName, ORCHESTRATOR_ROLE, config.projectPath, baseRuntimeOf(rawTarget), rawTarget), ...apiKeyEnv },
        });`,
      'call2',
    );
    out = rep(
      out,
      `        // Get runtime type from config or default to claude-code
        let runtimeType = config.runtimeType || RUNTIME_TYPES.CLAUDE_CODE;`,
      `        // Get runtime type from config or default to claude-code
        let configuredRuntimeTarget = config.runtimeType || RUNTIME_TYPES.CLAUDE_CODE;
        let runtimeType = baseRuntimeOf(configuredRuntimeTarget);`,
      'sessionInit',
    );
    out = rep(
      out,
      `                        if (member.runtimeType) {
                            runtimeType = member.runtimeType;
                        }`,
      `                        if (member.runtimeType) {
                            configuredRuntimeTarget = member.runtimeType;
                            runtimeType = baseRuntimeOf(configuredRuntimeTarget);
                        }`,
      'memberRuntime',
    );
    out = rep(
      out,
      `                if (!config.runtimeType && orchestratorStatus?.runtimeType) {
                    runtimeType = orchestratorStatus.runtimeType;
                }`,
      `                if (!config.runtimeType && orchestratorStatus?.runtimeType) {
                    configuredRuntimeTarget = orchestratorStatus.runtimeType;
                    runtimeType = baseRuntimeOf(configuredRuntimeTarget);
                }`,
      'orcRuntime',
    );
    out = rep(
      out,
      `        let fallbackCrewlyAgentModel;
        {
            const launch = await resolveLaunchRuntime({
                sessionName,
                configured: runtimeType,
                memberId: config.memberId,
                teamId: config.teamId,
                isOrchestrator: role === ORCHESTRATOR_ROLE,
            });`,
      `        let fallbackCrewlyAgentModel;
        let launchOverridden = false;
        {
            const launch = await resolveLaunchRuntime({
                sessionName,
                configured: configuredRuntimeTarget,
                memberId: config.memberId,
                teamId: config.teamId,
                isOrchestrator: role === ORCHESTRATOR_ROLE,
            });
            launchOverridden = Boolean(launch.overridden);`,
      'resolveLaunchCall',
    );
    out = rep(
      out,
      `                const apiKeyEnv = await this.buildApiKeyEnv(runtimeType);
                const telemetryEnv = await this.buildTelemetryEnv(runtimeType);
                const createdSession = await sessionHelper.createSession(sessionName, cwdToUse, {
                    env: { ...this.buildAgentIdentityEnv(sessionName, role, cwdToUse, runtimeType), ...telemetryEnv, ...apiKeyEnv },
                });`,
      `                const apiKeyEnv = await this.buildApiKeyEnv(runtimeType, sessionName, configuredRuntimeTarget);
                const telemetryEnv = await this.buildTelemetryEnv(runtimeType);
                const createdSession = await sessionHelper.createSession(sessionName, cwdToUse, {
                    env: { ...this.buildAgentIdentityEnv(sessionName, role, cwdToUse, runtimeType, configuredRuntimeTarget), ...telemetryEnv, ...apiKeyEnv },
                });`,
      'call3',
    );
    out = rep(
      out,
      `    async buildApiKeyEnv(runtimeType) {
        const settingsService = getSettingsService();
        const runtimeContext = { runtime: runtimeType };
        const env = {};
        // Gemini key — needed by gemini-cli. An Antigravity session whose key
        // was saved in Settings → Runtimes already got it at spawn
        // (buildAgentIdentityEnv); a settings key must not override it.
        const antigravityKeyAtSpawn = runtimeType === RUNTIME_TYPES.ANTIGRAVITY_CLI && getHarnessCredentialsStore().getAntigravityGeminiApiKey() !== null;
        const geminiKey = antigravityKeyAtSpawn ? undefined : await settingsService.getApiKey('gemini', runtimeContext);
        if (geminiKey) {
            env.GOOGLE_GENERATIVE_AI_API_KEY = geminiKey;
            env[ENV_CONSTANTS.GEMINI_API_KEY] = geminiKey;
        }
        // Anthropic key — needed by claude-code
        const anthropicKey = await settingsService.getApiKey('anthropic', runtimeContext);
        if (anthropicKey)
            env.ANTHROPIC_API_KEY = anthropicKey;
        // OpenAI key — needed by codex-cli and opencode-cli. Skipped for Codex
        // when it already has its own login (see docstring above).
        const openaiKey = await settingsService.getApiKey('openai', runtimeContext);
        if (openaiKey && !(runtimeType === RUNTIME_TYPES.CODEX_CLI && codexHasOwnLogin())) {
            env.OPENAI_API_KEY = openaiKey;
        }
        return env;
    }`,
      `    async buildApiKeyEnv(runtimeType, sessionName, configuredTarget) {
        const rawTarget = configuredTarget ?? runtimeType;
        runtimeType = runtimeType ? baseRuntimeOf(runtimeType) : runtimeType;
        const account = effectiveClaudeAccount(sessionName, rawTarget);
        if (account) {
            const scoped = runtimeAccountSpawnEnv(runtimeType, account, { claudeAccountEnvFn: claudeAccountEnv });
            if (Object.keys(scoped).length > 0)
                return scoped;
        }
        const settingsService = getSettingsService();
        const runtimeContext = { runtime: runtimeType };
        const env = {};
        // Gemini key — needed by gemini-cli. An Antigravity session whose key
        // was saved in Settings → Runtimes already got it at spawn
        // (buildAgentIdentityEnv); a settings key must not override it.
        const antigravityKeyAtSpawn = runtimeType === RUNTIME_TYPES.ANTIGRAVITY_CLI && getHarnessCredentialsStore().getAntigravityGeminiApiKey() !== null;
        const geminiKey = antigravityKeyAtSpawn ? undefined : await settingsService.getApiKey('gemini', runtimeContext);
        if (geminiKey) {
            env.GOOGLE_GENERATIVE_AI_API_KEY = geminiKey;
            env[ENV_CONSTANTS.GEMINI_API_KEY] = geminiKey;
        }
        // Anthropic key — needed by claude-code
        const anthropicKey = await settingsService.getApiKey('anthropic', runtimeContext);
        if (anthropicKey)
            env.ANTHROPIC_API_KEY = anthropicKey;
        // OpenAI key — needed by codex-cli and opencode-cli. Skipped for Codex
        // when it already has its own login (see docstring above).
        const openaiKey = await settingsService.getApiKey('openai', runtimeContext);
        if (openaiKey && !(runtimeType === RUNTIME_TYPES.CODEX_CLI && codexHasOwnLogin())) {
            env.OPENAI_API_KEY = openaiKey;
        }
        return env;
    }`,
      'buildApiKeyEnv',
    );
    out = rep(
      out,
      `            if (launch.overridden && launch.runtime !== runtimeType) {
                this.logger.info('Launching on the fallback runtime', { sessionName, configured: runtimeType, runtime: launch.runtime });
                runtimeType = launch.runtime;
                fallbackCrewlyAgentModel = launch.crewlyAgentModel;`,
      `            if (launch.crewlyAgentModel)
                fallbackCrewlyAgentModel = launch.crewlyAgentModel;
            if (launch.overridden && launch.runtime !== runtimeType) {
                this.logger.info('Launching on the fallback runtime', { sessionName, configured: runtimeType, runtime: launch.runtime });
                runtimeType = launch.runtime;`,
      'modelPropagation',
    );
    out = rep(
      out,
      `                if (fallbackCrewlyAgentModel)
                    memberModelId = fallbackCrewlyAgentModel;`,
      `                if (fallbackCrewlyAgentModel && (launchOverridden || !memberModelId))
                    memberModelId = fallbackCrewlyAgentModel;`,
      'crewlyAgentModelOverride',
    );
    return out;
  });

  // 10. Antigravity & HarnessStatus recognize pooled Gemini keys when default slot is empty.
  patchFile(root, 'services/agent/antigravity-runtime.service.js', 'antigravity', (src, rep) => {
    let out = rep(
      src,
      "import { getHarnessCredentialsStore } from '../harness/harness-credentials.store.js';",
      "import { getHarnessCredentialsStore } from '../harness/harness-credentials.store.js';\nimport { firstStoredAccountApiKey } from '../harness/runtime-accounts-pool.mjs';",
      'import',
    );
    out = rep(
      out,
      `    const fromEnv = process.env[ANTIGRAVITY_CONSTANTS.API_KEY_ENV];
    return fromEnv && isUsableEnvValue(fromEnv) ? fromEnv : null;`,
      `    const fromEnv = process.env[ANTIGRAVITY_CONSTANTS.API_KEY_ENV];
    if (fromEnv && isUsableEnvValue(fromEnv))
        return fromEnv;
    return firstStoredAccountApiKey(RUNTIME_TYPES.ANTIGRAVITY_CLI);`,
      'fallbackKey',
    );
    return out;
  });

  patchFile(root, 'services/harness/harness-status.service.js', 'status', (src, rep) => {
    let out = rep(
      src,
      "import { getHarnessCredentialsStore } from './harness-credentials.store.js';",
      "import { getHarnessCredentialsStore } from './harness-credentials.store.js';\nimport { firstStoredAccountApiKey } from './runtime-accounts-pool.mjs';",
      'import',
    );
    out = rep(
      out,
      `        const envName = this.firstSetEnv([ANTIGRAVITY_CONSTANTS.API_KEY_ENV]);
        if (envName)
            return { loginState: 'logged_in', loginSource: \`env:\${envName}\` };
        return { loginState: 'logged_out', loginSource: null };`,
      `        const envName = this.firstSetEnv([ANTIGRAVITY_CONSTANTS.API_KEY_ENV]);
        if (envName)
            return { loginState: 'logged_in', loginSource: \`env:\${envName}\` };
        if (firstStoredAccountApiKey(HARNESS_CONSTANTS.IDS.ANTIGRAVITY_CLI))
            return { loginState: 'logged_in', loginSource: 'account-pool' };
        return { loginState: 'logged_out', loginSource: null };`,
      'agyLogin',
    );
    return out;
  });

  // 11. Inject per-account provider API keys into external crewly-agent child processes.
  patchFile(root, 'services/agent/crewly-agent/crewly-agent-external-runtime.service.js', 'crewly-agent', (src, rep) => {
    let out = rep(
      src,
      "import { getCrewlyHomePath } from '../../core/crewly-home.utils.js';",
      "import { getCrewlyHomePath } from '../../core/crewly-home.utils.js';\nimport { effectiveClaudeAccount } from '../../runtime-fallback/effective-runtime.js';\nimport { runtimeAccountSpawnEnv } from '../../harness/runtime-accounts-pool.mjs';",
      'import',
    );
    out = rep(
      out,
      '        delete env[API_SECURITY_CONSTANTS.ENV.API_TOKEN];',
      `        const account = effectiveClaudeAccount(config.sessionName);
        if (account) {
            Object.assign(env, runtimeAccountSpawnEnv(RUNTIME_TYPES.CREWLY_AGENT, account));
        }
        delete env[API_SECURITY_CONSTANTS.ENV.API_TOKEN];`,
      'buildChildEnv',
    );
    return out;
  });

  // 12. Expose REST endpoints & snapshot fields for all runtime accounts.
  patchFile(root, 'controllers/system/runtime-fallback.controller.js', 'controller', (src, rep) => {
    let out = rep(
      src,
      "import { ClaudeAccountNameError, describeClaudeAccounts, ensureClaudeAccountDir, removeClaudeAccount, requireClaudeAccountName, runtimeTarget, } from '../../services/harness/claude-accounts.js';",
      `import { ClaudeAccountNameError, describeClaudeAccounts, ensureClaudeAccountDir, removeClaudeAccount, requireClaudeAccountName, runtimeTarget, } from '../../services/harness/claude-accounts.js';
import { buildHarnessPath, resolveExecutable, runCommand } from '../../services/harness/harness-exec.utils.js';
import { getHarnessService } from '../../services/harness/harness.service.js';
import { listRuntimeAccounts, registerMultiAccountRoutes, registerPendingAccountStub, removeRuntimeAccount, saveRuntimeAccountApiKey } from '../../services/harness/runtime-accounts-pool.mjs';`,
      'import',
    );
    out = rep(
      out,
      '    return { ...(await fallback.snapshot()), claudeAccounts };',
      '    const runtimeAccounts = listRuntimeAccounts({ claudeAccountsList: claudeAccounts });\n    return { ...(await fallback.snapshot()), claudeAccounts, runtimeAccounts };',
      'fullSnapshot',
    );
    out = rep(
      out,
      'export function registerRuntimeFallbackRoutes(router, deps = defaultDeps()) {',
      `export function registerRuntimeFallbackRoutes(router, deps = defaultDeps()) {
    registerMultiAccountRoutes(router, {
        ensureOwnerCaller,
        fallback: () => deps.fallback(),
        buildSnapshot: (fallback) => fullSnapshot(fallback, deps),
        listAccounts: () => listRuntimeAccounts({ claudeAccountsList: deps.accounts?.().list() ?? [] }),
        saveApiKeyAccount: (payload) => saveRuntimeAccountApiKey(payload, {
            resolveCodexBinary: () => resolveExecutable('codex', buildHarnessPath(process.env.PATH)),
            runCommandFn: runCommand,
        }),
        registerBrokerStub: ({ runtime, name, authKind }) => {
            if (runtime === RUNTIME_TYPES.CLAUDE_CODE)
                deps.accounts?.().ensure(name);
            return registerPendingAccountStub({ runtime, name, authKind });
        },
        startBrokerLogin: (runtime, method, name) => getHarnessService().broker.start(runtime, method, { account: name }),
        removeAccount: (runtime, name) => removeRuntimeAccount(runtime, name, {
            removeClaudeAccountFn: (n) => deps.accounts?.().remove(n),
        }),
    });`,
      'registerRoutes',
    );
    return out;
  });

  // 13. Allow pinned <runtime>@<account> targets and relaunch live sessions immediately on runtime change.
  patchFile(root, 'controllers/team/team.controller.js', 'team-controller', (src, rep) => {
    let out = rep(
      src,
      "import { memberAgentId, resolveMemberSessionName } from '../../utils/member-session-name.utils.js';",
      `import { memberAgentId, resolveMemberSessionName } from '../../utils/member-session-name.utils.js';
import { isMultiAccountTarget } from '../../services/harness/runtime-accounts-pool.mjs';
function isValidBaseOrAccountRuntime(rt) {
    return Object.values(RUNTIME_TYPES).includes(rt) || isMultiAccountTarget(rt);
}
function relaunchMembersAfterRuntimeEdit(ctx, entries, isOrchestrator = false) {
    if (!Array.isArray(entries) || entries.length === 0)
        return;
    void (async () => {
        try {
            const { getRuntimeFallbackService } = await import('../../services/runtime-fallback/runtime-fallback.service.js');
            const fb = getRuntimeFallbackService?.();
            for (const e of entries) {
                if (e?.sessionName)
                    fb?.clearSessionRuntimeChange?.(e.sessionName);
            }
        }
        catch {}
        try {
            const { clearUsageLimit } = await import('../../services/runtime-fallback/usage-limit-state.js');
            for (const e of entries) {
                if (e?.sessionName)
                    clearUsageLimit(e.sessionName);
            }
        }
        catch {}
        try {
            const { getSessionStatePersistence } = await import('../../services/session/session-state-persistence.js');
            const persistence = getSessionStatePersistence?.();
            for (const e of entries) {
                if (e?.sessionName)
                    persistence?.clearSessionId?.(e.sessionName);
            }
        }
        catch {}
        const reg = ctx?.agentRegistrationService;
        if (isOrchestrator) {
            try {
                const { markPlannedRelaunch, clearPlannedRelaunch } = await import('../../services/agent/planned-relaunch.registry.js');
                const { stopForRelaunch } = await import('../../services/agent/member-relaunch.js');
                const orcName = CREWLY_CONSTANTS.SESSIONS.ORCHESTRATOR_NAME;
                markPlannedRelaunch(orcName, 'owner_runtime_change');
                if (reg)
                    await stopForRelaunch(reg, orcName).catch(() => false);
                const { OrchestratorRestartService } = await import('../../services/orchestrator/orchestrator-restart.service.js');
                const restarted = await OrchestratorRestartService.getInstance().attemptRestart({ planned: true, reason: 'owner_runtime_change' });
                if (!restarted)
                    clearPlannedRelaunch(orcName);
            }
            catch {}
            return;
        }
        if (!reg)
            return;
        try {
            const { markPlannedRelaunch, clearPlannedRelaunch } = await import('../../services/agent/planned-relaunch.registry.js');
            const { stopForRelaunch, startMemberSession } = await import('../../services/agent/member-relaunch.js');
            const backend = typeof getSessionBackendSync === 'function' ? getSessionBackendSync() : null;
            for (const e of entries) {
                const s = e?.sessionName;
                if (!s)
                    continue;
                const isLive = Boolean((await reg.isSessionLiveOrLaunching?.(s)) || reg.isInProcessRuntimeActive?.(s) || backend?.sessionExists?.(s));
                if (!isLive)
                    continue;
                markPlannedRelaunch(s, 'owner_runtime_change');
                const ok = await stopForRelaunch(reg, s)
                    .then(() => startMemberSession({ storage: ctx.storageService }, reg, s))
                    .catch(() => false);
                if (!ok)
                    clearPlannedRelaunch(s);
            }
        }
        catch {}
    })();
}`,
      'import',
    );
    out = rep(
      out,
      `        const validRuntimeTypes = Object.values(RUNTIME_TYPES);
        if (!validRuntimeTypes.includes(runtimeType)) {`,
      `        const validRuntimeTypes = Object.values(RUNTIME_TYPES);
        if (!validRuntimeTypes.includes(runtimeType) && !isMultiAccountTarget(runtimeType)) {`,
      'updateTeamMemberRuntime-validate',
    );
    out = rep(
      out,
      `        if (teamId === 'orchestrator') {
            // Use the orchestrator-specific runtime update function
            await this.storageService.updateOrchestratorRuntimeType(runtimeType);`,
      `        if (teamId === 'orchestrator') {
            // Use the orchestrator-specific runtime update function
            await this.storageService.updateOrchestratorRuntimeType(runtimeType);
            relaunchMembersAfterRuntimeEdit(this, [{ sessionName: CREWLY_CONSTANTS.SESSIONS.ORCHESTRATOR_NAME }], true);`,
      'updateTeamMemberRuntime-orchestrator',
    );
    out = rep(
      out,
      `        // Update the member's runtime type
        const updatedMember = {
            ...team.members[memberIndex],
            runtimeType: runtimeType,
            updatedAt: new Date().toISOString()
        };
        recordActivity({
            actor: actorFromRequest(req),
            action: 'team.member.updated',
            target: { type: 'member', id: updatedMember.id, name: updatedMember.name },
            before: { runtimeType: team.members[memberIndex].runtimeType },
            after: { runtimeType },
        });
        team.members[memberIndex] = updatedMember;
        team.updatedAt = new Date().toISOString();
        await this.storageService.saveTeam(team);`,
      `        // Update the member's runtime type
        const prevRuntimeType = team.members[memberIndex].runtimeType;
        const updatedMember = {
            ...team.members[memberIndex],
            runtimeType: runtimeType,
            updatedAt: new Date().toISOString()
        };
        recordActivity({
            actor: actorFromRequest(req),
            action: 'team.member.updated',
            target: { type: 'member', id: updatedMember.id, name: updatedMember.name },
            before: { runtimeType: prevRuntimeType },
            after: { runtimeType },
        });
        team.members[memberIndex] = updatedMember;
        team.updatedAt = new Date().toISOString();
        await this.storageService.saveTeam(team);
        if (prevRuntimeType !== runtimeType) {
            relaunchMembersAfterRuntimeEdit(this, [updatedMember], false);
        }`,
      'updateTeamMemberRuntime-relaunch',
    );
    out = rep(
      out,
      `        const memberBefore = team.members[memberIndex];
        team.members[memberIndex] = updatedMember;
        team.updatedAt = new Date().toISOString();
        await this.storageService.saveTeam(team);`,
      `        const memberBefore = team.members[memberIndex];
        team.members[memberIndex] = updatedMember;
        team.updatedAt = new Date().toISOString();
        await this.storageService.saveTeam(team);
        if (memberBefore.runtimeType !== updatedMember.runtimeType) {
            relaunchMembersAfterRuntimeEdit(this, [updatedMember], false);
        }`,
      'updateTeamMember-relaunch',
    );
    out = rep(
      out,
      `            const inProcessStatus = getInProcessRuntimeStatusMap(this.agentRegistrationService);
            const orchestratorTeam = buildOrchestratorTeam(orchestratorStatus?.agentStatus || CREWLY_CONSTANTS.AGENT_STATUSES.INACTIVE, orchestratorStatus, { projectIds: updates.projectIds }, inProcessStatus);`,
      `            const prevOrcRt = orchestratorStatus?.runtimeType;
            const mainOrcUpdate = Array.isArray(updates.members)
                ? updates.members.find((m) => m?.role === 'orchestrator' && m?.name !== 'Assistant')
                : null;
            if (mainOrcUpdate?.runtimeType && isValidBaseOrAccountRuntime(mainOrcUpdate.runtimeType) && mainOrcUpdate.runtimeType !== prevOrcRt) {
                await this.storageService.updateOrchestratorRuntimeType(mainOrcUpdate.runtimeType);
                orchestratorStatus.runtimeType = mainOrcUpdate.runtimeType;
                relaunchMembersAfterRuntimeEdit(this, [{ sessionName: CREWLY_CONSTANTS.SESSIONS.ORCHESTRATOR_NAME }], true);
            }
            const inProcessStatus = getInProcessRuntimeStatusMap(this.agentRegistrationService);
            const orchestratorTeam = buildOrchestratorTeam(orchestratorStatus?.agentStatus || CREWLY_CONSTANTS.AGENT_STATUSES.INACTIVE, orchestratorStatus, { projectIds: updates.projectIds }, inProcessStatus);`,
      'updateTeam-orchestrator',
    );
    out = rep(
      out,
      `        // Activity log (crewly#881): the shallow team fields before this edit; members are logged by their own handlers.
        const teamBefore = { ...team, members: undefined, updatedAt: undefined };`,
      `        // Activity log (crewly#881): the shallow team fields before this edit; members are logged by their own handlers.
        const teamBefore = { ...team, members: undefined, updatedAt: undefined };
        const prevRtById = new Map((team.members || []).map((m) => [m.id, m.runtimeType]));`,
      'updateTeam-snapshot-rt',
    );
    out = rep(
      out,
      `        team.updatedAt = new Date().toISOString();
        await this.storageService.saveTeam(team);
        recordActivity({
            actor: actorFromRequest(req),
            action: 'team.updated',`,
      `        team.updatedAt = new Date().toISOString();
        await this.storageService.saveTeam(team);
        const rtChanged = (team.members || []).filter((m) => prevRtById.has(m.id) && prevRtById.get(m.id) !== m.runtimeType);
        if (rtChanged.length > 0) {
            relaunchMembersAfterRuntimeEdit(this, rtChanged, false);
        }
        recordActivity({
            actor: actorFromRequest(req),
            action: 'team.updated',`,
      'updateTeam-relaunch',
    );
    return out;
  });

  // 14. Replace retired Codex tier default (`gpt-5.4` -> `gpt-6-sol`) and normalize @account tier lookups.
  const applyModelTierFix = (targetRoot) => {
    patchFile(targetRoot, 'constants.js', 'codex-tier-default', (src, rep) =>
      rep(
        src,
        "'codex-cli': { strong: 'gpt-5.6-sol', mid: 'gpt-5.4' },",
        "'codex-cli': { strong: 'gpt-6.1-sol', mid: 'gpt-6-sol', weak: 'gpt-6-luna' },",
        'DEFAULT_TIER_MODELS.codex-cli',
      ),
    );
    patchFile(targetRoot, 'utils/model-tier.utils.js', 'codex-tier-map', (src, rep) =>
      rep(
        src,
        [
          'export function tierMapFor(runtime, overrides) {',
          '    const base = MODEL_TIER_CONSTANTS.DEFAULT_TIER_MODELS[runtime] ?? {};',
          '    const own = overrides?.[runtime] ?? {};',
          '    const out = {};',
          '    for (const tier of MODEL_TIERS) {',
          "        const candidate = typeof own[tier] === 'string' && own[tier].trim() && isSafeModelId(own[tier].trim()) ? own[tier].trim() : base[tier];",
        ].join('\n'),
        [
          'export function tierMapFor(runtime, overrides) {',
          "    const baseRt = typeof runtime === 'string' && runtime.includes('@') ? runtime.split('@')[0] : runtime;",
          '    const base = MODEL_TIER_CONSTANTS.DEFAULT_TIER_MODELS[baseRt] ?? {};',
          '    const own = { ...(overrides?.[baseRt] ?? {}), ...(overrides?.[runtime] ?? {}) };',
          '    const out = {};',
          '    for (const tier of MODEL_TIERS) {',
          "        const rawCandidate = typeof own[tier] === 'string' && own[tier].trim() && isSafeModelId(own[tier].trim()) ? own[tier].trim() : base[tier];",
          "        const candidate = baseRt === 'codex-cli' && rawCandidate === 'gpt-5.4' ? 'gpt-6-sol' : rawCandidate;",
        ].join('\n'),
        'tierMapFor',
      ),
    );
    patchFile(targetRoot, 'utils/runtime-model-flags.utils.js', 'codex-flag-upgrade', (src, rep) =>
      rep(
        src,
        [
          '        case RUNTIME_TYPES.CODEX_CLI:',
          '            return [',
          "                ...(model ? ['-m', model] : []),",
          '                ...(effort ? [\'-c\', `model_reasoning_effort="${effort}"`] : []),',
          '            ];',
        ].join('\n'),
        [
          '        case RUNTIME_TYPES.CODEX_CLI: {',
          "            const codexModel = model === 'gpt-5.4' ? 'gpt-6-sol' : model;",
          '            return [',
          "                ...(codexModel ? ['-m', codexModel] : []),",
          '                ...(effort ? [\'-c\', `model_reasoning_effort="${effort}"`] : []),',
          '            ];',
          '        }',
        ].join('\n'),
        'buildRuntimeModelFlags',
      ),
    );
  };
  applyModelTierFix(root);
  const cliRoot = path.resolve(root, '../../../cli/backend/src');
  if (
    cliRoot !== path.resolve(root) &&
    ['constants.js', 'utils/model-tier.utils.js', 'utils/runtime-model-flags.utils.js'].every((rel) =>
      fs.existsSync(path.join(cliRoot, rel)),
    )
  ) {
    applyModelTierFix(cliRoot);
  }

  // 15. Broadcast every recordTurn/chat_message over /ws/chat (agent replies, watchdog notes) with broadcast dedupe.
  patchFile(root, 'websocket/chat-v2.gateway.js', 'chat-v2-ws-dedupe', (src, rep) =>
    rep(
      src,
      [
        '    broadcast(channelId, event) {',
        '        // 1. Fan to local WebSocket subscribers (the original behaviour).',
      ].join('\n'),
      [
        '    broadcast(channelId, event) {',
        "        if (event?.type === 'message' && typeof event?.payload?.message?.id === 'string') {",
        '            const msg = event.payload.message;',
        "            const dedupeKey = `${msg.id}\\u0000${msg.content ?? ''}`;",
        '            this._recentMessageKeys ??= new Set();',
        '            if (this._recentMessageKeys.has(dedupeKey))',
        '                return;',
        '            this._recentMessageKeys.add(dedupeKey);',
        '            if (this._recentMessageKeys.size > 500) {',
        '                const oldest = this._recentMessageKeys.values().next().value;',
        '                if (oldest !== undefined)',
        '                    this._recentMessageKeys.delete(oldest);',
        '            }',
        '        }',
        '        // 1. Fan to local WebSocket subscribers (the original behaviour).',
      ].join('\n'),
      'broadcast',
    ),
  );
  patchFile(root, 'index.js', 'chat-v2-ws-message-wire', (src, rep) => {
    let out = rep(
      src,
      'const [{ ChatV2Gateway, devAnonymousTokenVerifier, buildReadStateEvent },',
      'const [{ ChatV2Gateway, devAnonymousTokenVerifier, buildMessageEvent, buildReadStateEvent },',
      'import',
    );
    out = rep(
      out,
      [
        "                chatService.on('read_state', (state) => {",
        '                    chatGateway.broadcast(state.channelId, buildReadStateEvent(state));',
        '                });',
      ].join('\n'),
      [
        "                chatService.on('chat_message', (dto) => {",
        '                    chatGateway.broadcast(dto.channelId, buildMessageEvent(dto.channelId, dto));',
        '                });',
        "                chatService.on('read_state', (state) => {",
        '                    chatGateway.broadcast(state.channelId, buildReadStateEvent(state));',
        '                });',
      ].join('\n'),
      'listener',
    );
    return out;
  });

  console.log('[Multi-Account] Crewly backend multi-account pool installed.');
}

module.exports = apply;
if (require.main === module) apply();
