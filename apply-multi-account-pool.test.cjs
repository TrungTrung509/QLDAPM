const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

const applyMultiAccount = require('./apply-multi-account-pool.cjs');

/**
 * Create a self-contained runnable ESM tree mimicking Crewly's compiled dist
 * for all 11 patched files + their local dependency stubs, then verify both
 * idempotency AND real ESM dynamic import/execution of the patched modules!
 */
function buildRunnableDistFixture(root) {
  const files = {
    'config/constants.js': `export const CREWLY_CONSTANTS = { PATHS: { CREWLY_HOME: '.crewly' } };`,
    'backend/src/constants.js': `
export const ORCHESTRATOR_SESSION_NAME = 'crewly-orc';
export const API_SECURITY_CONSTANTS = { ENV: { API_TOKEN: 'CREWLY_API_TOKEN' }, AGENT_ENV_DENYLIST: [] };
export const ENV_CONSTANTS = { CREWLY_SESSION_NAME: 'CREWLY_SESSION_NAME', CREWLY_ROLE: 'CREWLY_ROLE', CREWLY_API_URL: 'CREWLY_API_URL', CREWLY_PROJECT_PATH: 'CREWLY_PROJECT_PATH', CREWLY_INSTALL_DIR: 'CREWLY_INSTALL_DIR', GEMINI_API_KEY: 'GEMINI_API_KEY' };
export const OWNER_AUTH_CONSTANTS = { AGENT_BADGE_ENV: 'CREWLY_AGENT_BADGE' };
export const ANTIGRAVITY_CONSTANTS = { BINARY: 'agy', API_KEY_ENV: 'GEMINI_API_KEY', ADD_DIR_FLAG: '--add-dir', DISABLE_AUTO_UPDATE_ENV: 'AGY_CLI_DISABLE_AUTO_UPDATE', DISABLE_AUTO_UPDATE_VALUE: 'true', SCREEN: { ACCOUNT_LOGIN_MARKERS: [], MISSING_KEY_ERROR: '', FIRST_RUN_MARKERS: [] }, MESSAGES: {} };
export const HARNESS_CONSTANTS = {
  IDS: { CLAUDE_CODE: 'claude-code', CODEX_CLI: 'codex-cli', ANTIGRAVITY_CLI: 'antigravity-cli', GEMINI_CLI: 'gemini-cli' },
  CREDENTIALS_FILE: 'harness-credentials.json',
  CLAUDE: { OAUTH_TOKEN_ENV: 'CLAUDE_CODE_OAUTH_TOKEN', API_KEY_ENV: 'ANTHROPIC_API_KEY', CONFIG_DIR_ENV: 'CLAUDE_CONFIG_DIR', DATA_DIR: '.claude', CONFIG_FILE: '.claude.json', PROBE_ARGS: ['-p', 'OK'], ACCOUNTS: { DIR: 'claude-accounts' } },
  CODEX: { HOME_ENV: 'CODEX_HOME', HOME_DIR: '.codex', AUTH_FILE: 'auth.json' },
  GEMINI: { OAUTH_CREDS_FILE: 'oauth_creds.json', KEY_ENV: ['GEMINI_API_KEY'] },
  PROBE_TIMEOUT_MS: 5000,
  VERSION_PATTERN: /\\d+\\.\\d+\\.\\d+/,
  LOGIN: { PTY_COLS: 200, PTY_ROWS: 50, SCREEN_MAX_CHARS: 2000, LOG_MESSAGE_MAX_CHARS: 300, BROWSER_SUPPRESS_VALUE: 'true', ENTER: '\\r', SUBMIT_DELAY_MS: 0, SUBMIT_RETRY_MS: 0 },
  RELOGIN: { PROBE_TIMEOUT_MS: 5000 },
};
export const RUNTIME_TYPES = { CLAUDE_CODE: 'claude-code', GEMINI_CLI: 'gemini-cli', CODEX_CLI: 'codex-cli', OPENCODE_CLI: 'opencode-cli', ANTIGRAVITY_CLI: 'antigravity-cli', CREWLY_AGENT: 'crewly-agent' };
export const RUNTIME_FALLBACK_CONSTANTS = {
  DEFAULT_CHAIN: ['claude-code', 'crewly-agent', 'antigravity-cli'],
  DEFAULT_CREWLY_AGENT_MODEL: 'deepseek/deepseek-chat',
  DEFAULT_PROBE_INTERVAL_MINUTES: 15,
  MIN_PROBE_INTERVAL_MINUTES: 5,
  MAX_PROBE_INTERVAL_MINUTES: 240,
  TICK_MS: 30000,
  SAFE_POINT_POLL_MS: 10,
  SAFE_POINT_MAX_WAIT_MS: 50,
  BILLING_PROBE_INTERVAL_MS: 60000,
  FAILED_REVERT_WINDOW_MS: 60000,
  MAX_PROBE_BACKOFF_MS: 120000,
  RESET_GRACE_MS: 1000,
  TRANSIENT_ESCALATE_COUNT: 4,
  TRANSIENT_WINDOW_MS: 60000,
  TRANSIENT_ESCALATED_HORIZON_MS: 60000,
  WORKING_EVIDENCE_GRACE_MS: 60000,
  WORKING_EVIDENCE_THROTTLE_MS: 60000,
  SMOKE: { TEAM_PREFIX: 'smoke-' },
  LABELS: { 'claude-code': 'Claude Code', 'codex-cli': 'Codex', 'antigravity-cli': 'Antigravity CLI', 'gemini-cli': 'Gemini CLI', 'crewly-agent': 'Crewly Agent' },
  SHORT_LABELS: { 'claude-code': 'Claude', 'codex-cli': 'Codex', 'antigravity-cli': 'Antigravity', 'gemini-cli': 'Gemini', 'crewly-agent': 'Crewly Agent' },
};
export const MODEL_TIER_CONSTANTS = {
  TIERS: ['strong', 'mid', 'weak'],
  DEFAULT_TIER_MODELS: {
    'claude-code': { strong: 'opus', mid: 'sonnet', weak: 'haiku' },
    'codex-cli': { strong: 'gpt-5.6-sol', mid: 'gpt-5.4' },
  },
};`,
    'backend/src/services/core/crewly-home.utils.js': `export function getCrewlyHomePath() { return process.env.CREWLY_HOME || '/tmp/crewly'; }`,
    'backend/src/services/core/api-token.service.js': `export function getApiTokenFilePath() { return '/tmp/crewly/api-token'; } export function getApiToken() { return 'tok'; }`,
    'backend/src/services/core/logger.service.js': `export const LoggerService = { getInstance() { return { createComponentLogger() { return { info(){}, warn(){}, debug(){}, error(){} }; } }; } };`,
    'backend/src/services/harness/claude-accounts.js': `
export class ClaudeAccountNameError extends Error {}
export function accountOf(t) { const i = String(t).indexOf('@'); return i > 0 ? t.slice(i + 1) : null; }
export function baseRuntimeOf(t) { const i = String(t).indexOf('@'); return i > 0 ? t.slice(0, i) : t; }
export function parseRuntimeTarget(t) { const i = String(t).indexOf('@'); return i > 0 ? { runtime: t.slice(0, i), account: t.slice(i + 1) } : { runtime: t }; }
export function runtimeTarget(r, a) { return a ? r + '@' + a : r; }
export function isClaudeAccountTarget(t) { return String(t).startsWith('claude-code@'); }
export function claudeAccountConfigDir(a) { return '/tmp/claude-' + a; }
export function claudeAccountEnv(a) { return { CLAUDE_CONFIG_DIR: '/tmp/claude-' + a }; }
export function describeClaudeAccounts() { return []; }
export function listClaudeAccounts() { return []; }
export function ensureClaudeAccountDir() {}
export function removeClaudeAccount() {}
export function requireClaudeAccountName(n) { return String(n); }
export function prepareClaudeAccountAfterLogin() {}`,
    'backend/src/services/harness/claude-config.utils.js': `export function prepareClaudeConfigForCrewlyLogin(){} export function getClaudeConfigFile(){return '';} export function getClaudeCredentialsFile(){return '';}`,
    'backend/src/services/harness/claude-native-login.js': `export async function probeClaudeNativeLogin(){return 'logged_in';} export async function refreshClaudeNativeLogins(){}`,
    'backend/src/services/harness/claude-token-migration.service.js': `export function getClaudeTokenMigrationService(){return { async afterLogin(){} };}`,
    'backend/src/services/harness/harness-credentials.store.js': `export function getHarnessCredentialsStore(){return { getAntigravityGeminiApiKey(){return null;} };} export function harnessEnvForAgents(){return {};}`,
    'backend/src/services/harness/harness-exec.utils.js': `export function buildHarnessPath(p){return p||'';} export function buildNpmPath(p){return p||'';} export function resolveExecutable(){return null;} export async function runCommand(){return {code:1,stdout:'',stderr:''};}`,
    'backend/src/services/harness/harness-registry.js': `export function getHarnessDefinition(id){return {id,displayName:id,command:'codex',versionArgs:['--version']};} export function listHarnessDefinitions(){return [];} export function toPublicLoginMethods(){return [];} export function getLoginMethod(){return null;}`,
    'backend/src/services/harness/harness-install.service.js': `export class HarnessInstallService{}`,
    'backend/src/services/harness/harness.types.js': `export const SILENT_HARNESS_LOGGER={info(){},warn(){},debug(){}}; export function isTerminalLoginState(s){return ['succeeded','failed','timed_out','cancelled'].includes(s);}`,
    'backend/src/services/harness/login-rules.js': `export function evaluateLoginRules(){} export function getLoginRules(){return null;} export function normalizeTerminalOutput(s){return s;} export function redactSecrets(s){return s;}`,
    'backend/src/services/harness/orc-harness.store.js': `export class OrcHarnessStore{} export class UnknownHarnessError extends Error{}`,
    'backend/src/services/harness/harness-api-key.service.js': `export class HarnessApiKeyService{}`,
    'backend/src/services/harness/harness-relogin.service.js': `export function getHarnessReloginService(){return {startOwnerLogin(){return {status:'started',dmAvailable:false};},setAccountLoginHandler(){},setHarnessLoginHandler(){}};}`,
    'backend/src/services/trace/trace-recorder.js': `export function traceRuntimeBlocked(){}`,
    'backend/src/services/runtime-fallback/usage-limit-rules.js': `export function detectUsageLimit(){return null;} export function isExhaustingKind(){return false;}`,
    'backend/src/services/runtime-fallback/usage-limit-state.js': `export function clearUsageLimit(){}`,
    'backend/src/services/runtime-fallback/runtime-fallback.store.js': `export class FileRuntimeFallbackStore{ load(){return {};} save(){} }`,
    'backend/src/services/runtime-fallback/effective-runtime.js': `
let hooks = null;
export function setRuntimeFallbackHooks(next) { hooks = next; }
export function effectiveRuntimeType(sessionName, configured) {
    if (!hooks || !sessionName)
        return configured;
    try {
        return hooks.overrideFor(sessionName) ?? configured;
    }
    catch {
        return configured;
    }
}
export function effectiveClaudeAccount(sessionName) {
    if (!hooks || !sessionName)
        return null;
    try {
        return hooks.accountFor(sessionName);
    }
    catch {
        return null;
    }
}
export async function resolveLaunchRuntime(input) {
    return hooks ? await hooks.resolveLaunch(input) : { runtime: input.configured, overridden: false };
}`,
    'backend/src/utils/member-session-name.utils.js': `export function memberAgentId(id){return id;} export function resolveMemberSessionName(n){return n;}`,
    'backend/src/services/runtime-fallback/runtime-smoke-test.service.js': `export class LocalSmokeApi{} export class RuntimeSmokeTestService{}`,
    'backend/src/services/runtime-terms/runtime-terms-consent.service.js': `export function getRuntimeTermsConsentService(){return null;} export function reportRuntimeTermsScreen(){}`,
    'backend/src/controllers/system/system-control.controller.js': `export function ensureOwnerCaller(){return true;}`,
    'backend/src/utils/local-api-url.utils.js': `export function getLocalApiBaseUrl(){return 'http://127.0.0.1:8787';}`,
    'backend/src/utils/async.utils.js': `export function delay(){}`,
    'backend/src/utils/terminal-string-ops.js': `export function stripAnsiCodes(s){return s;}`,
    'backend/src/utils/runtime-model-flags.utils.js': `
import { RUNTIME_TYPES } from '../constants.js';
export function isSafeModelId(modelId) { return typeof modelId === 'string' && /^[A-Za-z0-9._:/-]+$/.test(modelId); }
export function isSafeReasoningEffort(effort) { return typeof effort === 'string' && /^[a-z]+$/.test(effort); }
export function buildRuntimeModelFlags(runtimeType, modelId, reasoningEffort) {
    const model = isSafeModelId(modelId) ? modelId : undefined;
    const effort = isSafeReasoningEffort(reasoningEffort) ? reasoningEffort : undefined;
    switch (runtimeType) {
        case RUNTIME_TYPES.CODEX_CLI:
            return [
                ...(model ? ['-m', model] : []),
                ...(effort ? ['-c', \`model_reasoning_effort="\${effort}"\`] : []),
            ];
        default:
            return [];
    }
}`,
    'backend/src/utils/model-tier.utils.js': `
import { MODEL_TIER_CONSTANTS } from '../constants.js';
import { isSafeModelId } from './runtime-model-flags.utils.js';
export const MODEL_TIERS = MODEL_TIER_CONSTANTS.TIERS;
export function isModelTier(value) { return typeof value === 'string' && MODEL_TIERS.includes(value); }
export function tierMapFor(runtime, overrides) {
    const base = MODEL_TIER_CONSTANTS.DEFAULT_TIER_MODELS[runtime] ?? {};
    const own = overrides?.[runtime] ?? {};
    const out = {};
    for (const tier of MODEL_TIERS) {
        const candidate = typeof own[tier] === 'string' && own[tier].trim() && isSafeModelId(own[tier].trim()) ? own[tier].trim() : base[tier];
        if (candidate)
            out[tier] = candidate;
    }
    return out;
}
export function resolveTierModel(runtime, tier, overrides) {
    if (!isModelTier(tier))
        return undefined;
    const map = tierMapFor(runtime, overrides);
    if (map[tier])
        return map[tier];
    if (tier === 'weak')
        return map.mid;
    return undefined;
}`,
    'backend/src/utils/antigravity-settings.utils.js': `export async function ensureAntigravityApiKeyProvider(){return 'ok';}`,
    'backend/src/websocket/chat-v2.gateway.js': `
const WebSocket = { OPEN: 1 };
export const devAnonymousTokenVerifier = async () => ({ userId: 'dev-user-001' });
export class ChatV2Gateway {
    subscribers = new Map();
    externalListeners = new Set();
    broadcast(channelId, event) {
        // 1. Fan to local WebSocket subscribers (the original behaviour).
        const set = this.subscribers.get(channelId);
        if (set && set.size > 0) {
            const frame = JSON.stringify(event);
            for (const sub of set) {
                if (sub.ws.readyState !== WebSocket.OPEN)
                    continue;
                sub.ws.send(frame);
            }
        }
        for (const listener of this.externalListeners) {
            listener(channelId, event);
        }
    }
}
export function buildMessageEvent(channelId, message) {
    return { type: 'message', payload: { channelId, message } };
}
export function buildReadStateEvent(state) {
    return { type: 'read_state', payload: state };
}`,
    'backend/src/index.js': `
export async function wireChatV2Sample(chatService) {
    try {
        {
            {
                const [{ ChatV2Gateway, devAnonymousTokenVerifier, buildReadStateEvent },] = await Promise.all([
                    import('./websocket/chat-v2.gateway.js'),
                ]);
                const chatGateway = new ChatV2Gateway();
                chatService.on('read_state', (state) => {
                    chatGateway.broadcast(state.channelId, buildReadStateEvent(state));
                });
                return { chatGateway, devAnonymousTokenVerifier };
            }
        }
    } catch (e) { throw e; }
}`,
    'backend/src/services/session/tui-input-guard.js': `export function isInputBoxRule(){return false;}`,
    'backend/src/services/settings/settings.service.js': `export function getSettingsService(){return {async getApiKey(){return undefined;}};}`,
    'backend/src/services/agent/runtime-agent.service.abstract.js': `export class RuntimeAgentService{}`,
    'backend/src/services/agent/runtime-startup-blocked.error.js': `export class RuntimeStartupBlockedError extends Error{}`,
    'backend/src/services/agent/runtime-startup-screen.js': `export function findStartupErrorPattern(){return null;}`,
    'backend/src/services/agent/runtime-session-recovery.js': `export function stripNestedClaudeSessionEnv(e){return e;} export function buildHandoverSummary(){return '';} export function chainedHandoverBlock(){return '';} export function claudeTranscriptPath(){return '';} export function copyClaudeConversation(){return null;} export function defaultClaudeHome(){return '';} export function latestHandoverFile(){return null;}`,
    'backend/src/services/agent/handover-pointers.js': `export function withHandoverPointers(s){return s;}`,
    'backend/src/services/agent/planned-relaunch.registry.js': `export function clearPlannedRelaunch(){} export function markPlannedRelaunch(){}`,
    'backend/src/services/agent/member-relaunch.js': `export async function isAgentBusy(){return false;} export async function startMemberSession(){return true;} export async function stopForRelaunch(){}`,
    'backend/src/services/agent/pty-activity-tracker.service.js': `export const PtyActivityTrackerService={getInstance(){return {recordApiActivity(){}};}};`,
    'backend/src/services/agent/agent-heartbeat.service.js': `export async function updateAgentHeartbeat(){}`,
    'backend/src/services/monitoring/token-usage.service.js': `export const TokenUsageService={getInstance(){return {recordUsage(){}};}};`,
    'backend/src/services/agent/crewly-agent/types.js': `export const CREWLY_AGENT_DEFAULTS={DEFAULT_MODEL:{provider:'deepseek',modelId:'deepseek-chat'},MAX_STEPS:10,MAX_HISTORY_MESSAGES:10,COMPACTION_THRESHOLD:0.8,HEARTBEAT_INTERVAL_MS:1000};`,
    'backend/src/services/agent/crewly-agent/in-process-log-buffer.js': `export class InProcessLogBuffer{static getInstance(){return new InProcessLogBuffer();}}`,
    'backend/src/services/agent/credential-guard.service.js': `export function credentialGuardEnvFor(){return {};}`,
    'backend/src/services/core/owner-auth.service.js': `export function mintAgentBadge(){return 'badge';}`,
    'backend/src/types/settings.types.js': `export const API_KEY_ENV_VARS={}; export const API_KEY_PROVIDERS=[];`,
    // Minimal exact target slices from crewly@1.20.472 for all 11 patched files:
    'backend/src/services/core/credential-files.js': `
import * as path from 'path';
import { HARNESS_CONSTANTS } from '../../constants.js';
import { getCrewlyHomePath } from './crewly-home.utils.js';
import { CREWLY_CONSTANTS } from '../../../../config/constants.js';
export function getGuardedCredentialPaths() {
    const home = getCrewlyHomePath();
    const out = [];
    const seen = new Set();
    const add = (id, p, isDirectory) => { const abs = path.resolve(p); if (!seen.has(abs)) { seen.add(abs); out.push({ id, path: abs, isDirectory }); } };
    add('claude-accounts', path.join(home, HARNESS_CONSTANTS.CLAUDE.ACCOUNTS.DIR), true);
    return out;
}`,
    'backend/src/services/runtime-fallback/runtime-fallback.types.js': `
import { RUNTIME_FALLBACK_CONSTANTS, RUNTIME_TYPES } from '../../constants.js';
import { isClaudeAccountTarget, parseRuntimeTarget } from '../harness/claude-accounts.js';
export const KNOWN_RUNTIMES = Object.values(RUNTIME_TYPES);
export function isKnownRuntimeTarget(target) {
    return KNOWN_RUNTIMES.includes(target) || isClaudeAccountTarget(target);
}
export function defaultRuntimeFallbackSettings() {
    return {
        enabled: true,
        chain: [...RUNTIME_FALLBACK_CONSTANTS.DEFAULT_CHAIN],
        memberChains: {},
        orcFollows: true,
        crewlyAgentModel: RUNTIME_FALLBACK_CONSTANTS.DEFAULT_CREWLY_AGENT_MODEL,
        probeIntervalMinutes: RUNTIME_FALLBACK_CONSTANTS.DEFAULT_PROBE_INTERVAL_MINUTES,
    };
}
export function runtimeLabel(runtime) {
    const { runtime: base, account } = parseRuntimeTarget(runtime);
    if (account) return \`\${RUNTIME_FALLBACK_CONSTANTS.LABELS[base] ?? base} (\${account})\`;
    return RUNTIME_FALLBACK_CONSTANTS.LABELS[runtime] ?? runtime;
}
export function runtimeShortLabel(runtime) { return runtime; }
export class RuntimeFallbackSettingsError extends Error {}
export function applySettingsPatch(current, patch) {
    const p = patch || {};
    const next = { ...current, chain: [...current.chain], memberChains: { ...current.memberChains } };
    if ('enabled' in p) next.enabled = p.enabled;
    if ('orcFollows' in p) {
        if (typeof p.orcFollows !== 'boolean') throw new RuntimeFallbackSettingsError('orcFollows');
        next.orcFollows = p.orcFollows;
    }
    if ('chain' in p) next.chain = p.chain;
    return next;
}
export function normalizeSettings(raw) {
    const base = defaultRuntimeFallbackSettings();
    let out = base;
    for (const [k, v] of Object.entries(raw || {})) { out = applySettingsPatch(out, { [k]: v }); }
    return out;
}`,
    'backend/src/services/runtime-fallback/runtime-availability.js': `
import { RUNTIME_TYPES } from '../../constants.js';
import { runtimeTarget } from '../harness/claude-accounts.js';
import { KNOWN_RUNTIMES, runtimeLabel } from './runtime-fallback.types.js';
export function computeRuntimeAvailability(input) {
    const runtimes = KNOWN_RUNTIMES.map((runtime) => {
        const label = runtimeLabel(runtime);
        if (runtime === RUNTIME_TYPES.CREWLY_AGENT) {
            return input.hasProviderKey('deepseek') ? { runtime, label, selectable: true } : { runtime, label, selectable: false };
        }
        const h = input.harnesses.find((x) => x.id === runtime);
        if (!h || !h.installed) return { runtime, label, selectable: false, loginProblem: true };
        if (h.loginState !== 'logged_in') return { runtime, label, selectable: false, loginProblem: true };
        return { runtime, label, selectable: true };
    });
    const claude = input.harnesses.find((h) => h.id === RUNTIME_TYPES.CLAUDE_CODE);
    const accounts = (input.claudeAccounts ?? []).map((account) => {
        const runtime = runtimeTarget(RUNTIME_TYPES.CLAUDE_CODE, account.name);
        return { runtime, label: runtimeLabel(runtime), selectable: Boolean(claude?.installed && account.signedIn) };
    });
    return [...runtimes, ...accounts];
}`,
    'backend/src/services/runtime-fallback/runtime-fallback.wiring.js': `
import { RUNTIME_TYPES } from '../../constants.js';
import { claudeAccountConfigDir, describeClaudeAccounts, listClaudeAccounts, parseRuntimeTarget } from '../harness/claude-accounts.js';
import { computeRuntimeAvailability } from './runtime-availability.js';
export async function crewlyAgentModelsInUse(storage) {
    const modelIds = [];
    const orc = await storage.getOrchestratorStatus().catch(() => null);
    if (orc?.runtimeType === RUNTIME_TYPES.CREWLY_AGENT)
        modelIds.push(orc.modelId);
    for (const team of await storage.getTeams().catch(() => [])) {
        for (const member of team.members) {
            if (member.runtimeType === RUNTIME_TYPES.CREWLY_AGENT)
                modelIds.push(member.modelId);
        }
    }
    return modelIds;
}
export function sampleWiringCall(harnesses, settings) {
    return {
        getAvailability: async () => {
            return computeRuntimeAvailability({
                harnesses,
                crewlyAgentModel: settings.crewlyAgentModel,
                hasProviderKey: () => false,
                claudeAccounts: describeClaudeAccounts(),
            });
        },
    };
}`,
    'backend/src/services/runtime-fallback/runtime-fallback.service.js': `
import { RUNTIME_TYPES, RUNTIME_FALLBACK_CONSTANTS } from '../../constants.js';
import { accountOf, baseRuntimeOf, parseRuntimeTarget, runtimeTarget } from '../harness/claude-accounts.js';
import { applySettingsPatch, runtimeLabel } from './runtime-fallback.types.js';
export class RuntimeFallbackService {
    deps; state; logger = { info(){}, warn(){}, debug(){} }; now = () => Date.now();
    recentRecoveries = new Map();
    noticeDue = new Map();
    kickoffNotes = new Map();
    switching = new Set();
    availability = null;
    constructor(deps) { this.deps = deps; this.state = deps.store.load(); }
    getSettings() { return JSON.parse(JSON.stringify(this.state.settings)); }
    updateSettings(patch) { this.state.settings = applySettingsPatch(this.state.settings, patch); this.availability = null; this.save(); return this.getSettings(); }
    invalidateAvailability() { this.availability = null; }
    async getAvailability() { return await this.deps.getAvailability(this.state.settings); }
    isExempt() { return false; }
    async recover() {}
    scheduleNotice() {}
    label(r) { return runtimeLabel(r); }
    overrideFor(sessionName) {
        const target = this.state.overrides[sessionName]?.runtime;
        return target ? baseRuntimeOf(target) : null;
    }
    accountFor(sessionName) {
        const target = this.state.overrides[sessionName]?.runtime;
        return target ? accountOf(target) : null;
    }
    async onAccountLogin(account) { this.availability = null; }
    addToChains(target) {
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
    }
    async reevaluateExhausted() {
        const current = this.state.overrides[sessionName]?.runtime ?? agent.primary;
        return current;
    }
    async recheckAfterLogin() {}
    async onWorking(sessionName) {
        const target = this.state.overrides[sessionName]?.runtime ?? (await this.deps.getAgent(sessionName).catch(() => null))?.primary;
        return target;
    }
    beforeDelivery(sessionName, runtime) {
        const current = this.state.overrides[sessionName]?.runtime ?? runtime;
        return this.state.exhausted[current] ? 'queue' : 'deliver';
    }
    async resolveLaunch(input) {
        const configured = { runtime: input.configured, overridden: false };
        const existing = this.state.overrides[input.sessionName];
        if (existing) {
            if (existing.primary !== input.configured) { delete this.state.overrides[input.sessionName]; }
            else if (existing.revertPending && !this.state.exhausted[existing.primary]) { return configured; }
            else if (!this.state.exhausted[existing.primary]) {
                return this.decision(existing.runtime);
            }
            else {
                const better = await this.betterTarget({ ...input, primary: input.configured }, existing.runtime, true);
                if (better) return this.decision(better);
                return this.decision(existing.runtime);
            }
        }
        if (!this.state.exhausted[input.configured]) {
            // Not out of usage, but maybe not installed / signed in on this machine
            // (a team moved here): run the agent on its fallback until it is.
            if (input.isOrchestrator && !this.state.settings.orcFollows)
                return configured;
            if (!(await this.markUnavailableHere(input.configured)))
                return configured;
        }
        const agent = await this.launchAgent(input);
        const target = await this.pickFallback(agent, input.configured);
        if (!target) return configured;
        await this.recordSwitch(agent, input.configured, target);
        return this.decision(target);
    }
    async launchAgent(input) { return { sessionName: input.sessionName, name: input.sessionName, primary: input.configured, memberId: input.memberId, isOrchestrator: input.isOrchestrator }; }
    async markUnavailableHere(runtime) {
        const avail = await this.getAvailability();
        const entry = avail.find((a) => a.runtime === runtime);
        if (!entry || entry.selectable || !entry.loginProblem) return false;
        this.state.exhausted[runtime] = { runtime, kind: 'login', switched: [], switchedTo: [] };
        return true;
    }
    targetOf(sessionName, runtime) {
        const override = this.state.overrides[sessionName]?.runtime;
        return override && baseRuntimeOf(override) === runtime ? override : runtime;
    }
    async doSwitch(sessionName) {
        const agent = await this.deps.getAgent(sessionName);
        if (!agent) return 'skipped';
        const current = this.state.overrides[sessionName]?.runtime ?? agent.primary;
        if (!this.state.exhausted[current]) return 'skipped';
        const target = await this.pickFallback(agent, current);
        if (!target) return 'no_fallback';
        await this.recordSwitch(agent, current, target);
        return 'switched';
    }
    async recordSwitch(agent, from, target) {
        const sessionName = agent.sessionName;
        const existing = this.state.overrides[sessionName];
        if (target === agent.primary) delete this.state.overrides[sessionName];
        else this.state.overrides[sessionName] = { runtime: target, primary: agent.primary, reason: 'usage_limit', since: new Date().toISOString() };
        this.save();
    }
    async pickFallback(agent, current) {
        const available = await this.getAvailability();
        const selectable = new Set(available.filter((a) => a.selectable).map((a) => a.runtime));
        for (const runtime of this.chainFor(agent)) {
            if (runtime === current || this.state.exhausted[runtime])
                continue;
            if (selectable.has(runtime))
                return runtime;
        }
        return null;
    }
    chainFor() { return this.state.settings.chain; }
    async betterTarget(agent, current) {
        const best = await this.pickFallback(agent, agent.primary);
        return best && best !== current ? best : null;
    }
    async upgradeIfBetter() {}
    async finishRevertOffline(s) { delete this.state.overrides[s]; }
    async revertSession(s) { delete this.state.overrides[s]; }
    async revertIdle() {
        for (const [sessionName, override] of Object.entries(this.state.overrides)) {
            if (this.state.exhausted[override.primary]) {
                await this.upgradeIfBetter(sessionName, override);
                continue;
            }
            override.revertPending = true;
            await this.revertSession(sessionName);
        }
    }
    overrideView(sessionName) { const o = this.state.overrides[sessionName]; return o ? { ...o, sessionName } : null; }
    async snapshot() {
        const runtimes = (await this.getAvailability()).map((a) => ({ ...a, exhausted: Boolean(this.state.exhausted[a.runtime]) }));
        return {
            settings: this.getSettings(),
            runtimes,
            exhausted: Object.values(this.state.exhausted).map((e) => ({ ...e })),
            overrides: Object.keys(this.state.overrides)
                .map((s) => this.overrideView(s))
                .filter((v) => v !== null),
        };
    }
    decision(target) {
        const { runtime, account } = parseRuntimeTarget(target);
        return {
            runtime,
            overridden: true,
            ...(account ? { claudeAccount: account } : {}),
            ...(runtime === RUNTIME_TYPES.CREWLY_AGENT ? { crewlyAgentModel: this.state.settings.crewlyAgentModel } : {}),
        };
    }
    save() { this.deps.store.save(this.state); }
}`,
    'backend/src/services/runtime-fallback/runtime-usage-probe.js': `
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { HARNESS_CONSTANTS, RUNTIME_TYPES } from '../../constants.js';
import { claudeAccountEnv, parseRuntimeTarget } from '../harness/claude-accounts.js';
import { getHarnessCredentialsStore } from '../harness/harness-credentials.store.js';
import { buildHarnessPath, resolveExecutable, runCommand } from '../harness/harness-exec.utils.js';
import { detectUsageLimit, isExhaustingKind } from './usage-limit-rules.js';
export function createRuntimeUsageProbe(deps = {}) {
    const run = deps.run ?? runCommand;
    const baseEnv = deps.env ?? process.env;
    const homeDir = deps.homeDir ?? os.homedir();
    const timeoutMs = deps.timeoutMs ?? 5000;
    const resolve = deps.resolveCommand ?? (() => null);
    return async (target) => {
        try {
            const { runtime, account } = parseRuntimeTarget(target);
            if (runtime !== RUNTIME_TYPES.CLAUDE_CODE)
                return 'unsupported';
            return 'unknown';
        } catch { return 'unknown'; }
    };
}`,
    'backend/src/services/harness/login-broker.service.js': `
import { EventEmitter } from 'events';
import { API_SECURITY_CONSTANTS, HARNESS_CONSTANTS } from '../../constants.js';
import { ensureClaudeAccountDir, prepareClaudeAccountAfterLogin } from './claude-accounts.js';
import { getHarnessDefinition, getLoginMethod } from './harness-registry.js';
import { isTerminalLoginState } from './harness.types.js';
export const LOGIN_BROKER_EVENTS = { UPDATE: 'update', FINISHED: 'finished' };
export class LoginBrokerError extends Error { constructor(c, m){ super(m); this.code = c; } }
export class LoginBrokerService extends EventEmitter {
    buildEnv(){ return {}; } getActiveSession(){ return null; } prune(){}
    start(harnessId, method, options = {}) {
        const def = getHarnessDefinition(harnessId);
        const methodDef = getLoginMethod(def.id, method);
        const account = options.account;
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
        }
        return env;
    }
    finish(record, state, message) {
        const snapshot = { ...record.session };
        record.resolveDone(snapshot);
        this.emit(LOGIN_BROKER_EVENTS.FINISHED, snapshot);
    }
}`,
    'backend/src/services/harness/harness.service.js': `
import { HARNESS_CONSTANTS } from '../../constants.js';
import { claudeAccountConfigDir } from './claude-accounts.js';
import { getHarnessDefinition } from './harness-registry.js';
import { HarnessStatusService } from './harness-status.service.js';
import { LoginBrokerService } from './login-broker.service.js';
export function getHarnessService() { return { broker: { start() { return { id: 'b1' }; } } }; }
export async function verifySample(status, harnessId, account, env = process.env, logger = {}) {
            const def = getHarnessDefinition(harnessId);
            if (!def)
                return false;
            const installed = await status.getInstalledInfo(def);
            const login = await status.getLoginInfo(def, installed.path);
            return login.loginState === 'logged_in';
}`,
    'backend/src/services/agent/agent-registration.service.js': `
import { ENV_CONSTANTS, OWNER_AUTH_CONSTANTS, RUNTIME_TYPES } from '../../constants.js';
import { claudeAccountConfigDir, claudeAccountEnv } from '../harness/claude-accounts.js';
import { effectiveClaudeAccount, resolveLaunchRuntime } from '../runtime-fallback/effective-runtime.js';
import { harnessEnvForAgents } from '../harness/harness-credentials.store.js';
import { getSettingsService } from '../settings/settings.service.js';
import { getCrewlyHomePath } from '../core/crewly-home.utils.js';
import { getHarnessCredentialsStore } from '../harness/harness-credentials.store.js';
const RUNTIME_INPUT_SAFETY = { CLAUDE_CODE_ENV: {} };
const ORCHESTRATOR_ROLE = 'orchestrator';
function mintAgentBadge(){return 'b';}
function getLocalApiBaseUrl(){return '';}
function credentialGuardEnvFor(){return {};}
function codexHasOwnLogin(){return false;}
export class AgentRegistrationService {
    projectRoot = '/tmp';
    buildAgentIdentityEnv(sessionName, role, cwd, runtimeType) {
        const account = runtimeType === RUNTIME_TYPES.CLAUDE_CODE ? effectiveClaudeAccount(sessionName) : null;
        return {
            ...harnessEnvForAgents(process.env, runtimeType),
            ...(account ? claudeAccountEnv(account) : {}),
            ...(runtimeType === RUNTIME_TYPES.CLAUDE_CODE ? RUNTIME_INPUT_SAFETY.CLAUDE_CODE_ENV : {}),
            [ENV_CONSTANTS.CREWLY_SESSION_NAME]: sessionName,
            [OWNER_AUTH_CONSTANTS.AGENT_BADGE_ENV]: mintAgentBadge(sessionName),
            [ENV_CONSTANTS.CREWLY_ROLE]: role,
            [ENV_CONSTANTS.CREWLY_API_URL]: getLocalApiBaseUrl(),
            [ENV_CONSTANTS.CREWLY_PROJECT_PATH]: cwd,
            [ENV_CONSTANTS.CREWLY_INSTALL_DIR]: this.projectRoot,
            ...credentialGuardEnvFor(getCrewlyHomePath(), this.projectRoot),
        };
    }
    async buildApiKeyEnv(runtimeType) {
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
    }
    logger = { info(){}, warn(){}, debug(){} };
    async getSessionHelper() { return { async createSession(_s, _c, opts) { return opts; } }; }
    async buildTelemetryEnv() { return {}; }
    async createOrchestratorSession(config) {
        const apiKeyEnv = await this.buildApiKeyEnv(config.runtimeType ?? RUNTIME_TYPES.CLAUDE_CODE);
        await (await this.getSessionHelper()).createSession(config.sessionName, config.projectPath, {
            env: { ...this.buildAgentIdentityEnv(config.sessionName, ORCHESTRATOR_ROLE, config.projectPath, config.runtimeType), ...apiKeyEnv },
        });
    }
    async recreationPath(sessionName, runtimeType) {
        const recreationKeyEnv = await this.buildApiKeyEnv(runtimeType);
        return recreationKeyEnv;
    }
    async sampleCallPaths(sessionName, config, member, orchestratorStatus, role, cwdToUse, memberModelId) {
        // Get runtime type from config or default to claude-code
        let runtimeType = config.runtimeType || RUNTIME_TYPES.CLAUDE_CODE;
        if (role !== ORCHESTRATOR_ROLE && member) {
                        if (member.runtimeType) {
                            runtimeType = member.runtimeType;
                        }
        }
        if (role === ORCHESTRATOR_ROLE) {
                if (!config.runtimeType && orchestratorStatus?.runtimeType) {
                    runtimeType = orchestratorStatus.runtimeType;
                }
        }
        let fallbackCrewlyAgentModel;
        {
            const launch = await resolveLaunchRuntime({
                sessionName,
                configured: runtimeType,
                memberId: config.memberId,
                teamId: config.teamId,
                isOrchestrator: role === ORCHESTRATOR_ROLE,
            });
            if (launch.overridden && launch.runtime !== runtimeType) {
                this.logger.info('Launching on the fallback runtime', { sessionName, configured: runtimeType, runtime: launch.runtime });
                runtimeType = launch.runtime;
                fallbackCrewlyAgentModel = launch.crewlyAgentModel;
            }
        }
                if (fallbackCrewlyAgentModel)
                    memberModelId = fallbackCrewlyAgentModel;
                const sessionHelper = await this.getSessionHelper();
                const apiKeyEnv = await this.buildApiKeyEnv(runtimeType);
                const telemetryEnv = await this.buildTelemetryEnv(runtimeType);
                const createdSession = await sessionHelper.createSession(sessionName, cwdToUse, {
                    env: { ...this.buildAgentIdentityEnv(sessionName, role, cwdToUse, runtimeType), ...telemetryEnv, ...apiKeyEnv },
                });
        return { createdSession, runtimeType, fallbackCrewlyAgentModel, memberModelId };
    }
}`,
    'backend/src/services/agent/antigravity-runtime.service.js': `
import { ANTIGRAVITY_CONSTANTS, RUNTIME_TYPES } from '../../constants.js';
import { getHarnessCredentialsStore } from '../harness/harness-credentials.store.js';
import { isUsableEnvValue } from '../harness/harness-status.service.js';
import { getSettingsService } from '../settings/settings.service.js';
export async function resolveAntigravityApiKey() {
    const stored = getHarnessCredentialsStore().getAntigravityGeminiApiKey();
    if (stored) return stored;
    const fromEnv = process.env[ANTIGRAVITY_CONSTANTS.API_KEY_ENV];
    return fromEnv && isUsableEnvValue(fromEnv) ? fromEnv : null;
}`,
    'backend/src/services/harness/harness-status.service.js': `
import { ANTIGRAVITY_CONSTANTS, HARNESS_CONSTANTS } from '../../constants.js';
import { getHarnessCredentialsStore } from './harness-credentials.store.js';
export function isUsableEnvValue(v) { return Boolean(v); }
export class HarnessStatusService {
    credentials = getHarnessCredentialsStore();
    firstSetEnv() { return null; }
    getInstalledInfo() { return { path: null }; }
    getLoginInfo() { return { loginState: 'logged_out' }; }
    getAntigravityLogin() {
        if (this.credentials.getAntigravityGeminiApiKey()) {
            return { loginState: 'logged_in', loginSource: 'stored-key' };
        }
        const envName = this.firstSetEnv([ANTIGRAVITY_CONSTANTS.API_KEY_ENV]);
        if (envName)
            return { loginState: 'logged_in', loginSource: \`env:\${envName}\` };
        return { loginState: 'logged_out', loginSource: null };
    }
}`,
    'backend/src/services/agent/crewly-agent/crewly-agent-external-runtime.service.js': `
import { API_SECURITY_CONSTANTS, RUNTIME_TYPES } from '../../../constants.js';
import { getCrewlyHomePath } from '../../core/crewly-home.utils.js';
export async function buildChildEnv(config) {
        const env = { CREWLY_HOME: getCrewlyHomePath(), CREWLY_API_TOKEN: 'secret' };
        delete env[API_SECURITY_CONSTANTS.ENV.API_TOKEN];
        return env;
}`,
    'backend/src/controllers/system/runtime-fallback.controller.js': `
import { RUNTIME_TYPES } from '../../constants.js';
import { ClaudeAccountNameError, describeClaudeAccounts, ensureClaudeAccountDir, removeClaudeAccount, requireClaudeAccountName, runtimeTarget, } from '../../services/harness/claude-accounts.js';
import { ensureOwnerCaller } from './system-control.controller.js';
async function fullSnapshot(fallback, deps) {
    let claudeAccounts = [];
    return { ...(await fallback.snapshot()), claudeAccounts };
}
function defaultDeps() { return { fallback: () => null, accounts: () => ({ list: () => [], ensure() {}, remove() {} }) }; }
export function registerRuntimeFallbackRoutes(router, deps = defaultDeps()) {
    router.get('/system/runtime-fallback', () => {});
}`,
    'backend/src/controllers/team/team.controller.js': `
import { memberAgentId, resolveMemberSessionName } from '../../utils/member-session-name.utils.js';
import { RUNTIME_TYPES } from '../../constants.js';
const CREWLY_CONSTANTS = { SESSIONS: { ORCHESTRATOR_NAME: 'crewly-orc' }, AGENT_STATUSES: { INACTIVE: 'inactive' } };
function recordActivity() {}
function actorFromRequest() { return 'owner'; }
function getInProcessRuntimeStatusMap() { return {}; }
function buildOrchestratorTeam(_s, orch, opts) { return { id: 'orchestrator', members: [{ runtimeType: orch?.runtimeType }], projectIds: opts?.projectIds }; }
function getSessionBackendSync() { return null; }
export async function updateTeamMemberRuntime(req, res) {
    const { teamId, memberId } = req.params || {};
    const { runtimeType } = req.body || {};
        const validRuntimeTypes = Object.values(RUNTIME_TYPES);
        if (!validRuntimeTypes.includes(runtimeType)) {
            res.status(400).json({
                success: false,
                error: 'Invalid runtime type',
            });
            return;
        }
        if (teamId === 'orchestrator') {
            // Use the orchestrator-specific runtime update function
            await this.storageService.updateOrchestratorRuntimeType(runtimeType);
            res.json({ success: true, data: { runtimeType } });
            return;
        }
        if (!this?.storageService) {
            res.json({ success: true, data: { runtimeType } });
            return;
        }
        const teams = await this.storageService.getTeams();
        const team = teams.find(t => t.id === teamId);
        const memberIndex = team.members.findIndex(m => m.id === memberId);
        // Update the member's runtime type
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
        await this.storageService.saveTeam(team);
        res.json({ success: true, data: updatedMember });
}
export async function updateTeamMember(team, memberIndex, updatedMember) {
        const memberBefore = team.members[memberIndex];
        team.members[memberIndex] = updatedMember;
        team.updatedAt = new Date().toISOString();
        await this.storageService.saveTeam(team);
        return memberBefore;
}
export async function updateTeam(req, res, isOrc, orchestratorStatus, updates, team) {
        if (isOrc) {
            const inProcessStatus = getInProcessRuntimeStatusMap(this.agentRegistrationService);
            const orchestratorTeam = buildOrchestratorTeam(orchestratorStatus?.agentStatus || CREWLY_CONSTANTS.AGENT_STATUSES.INACTIVE, orchestratorStatus, { projectIds: updates.projectIds }, inProcessStatus);
            res.json({ success: true, data: orchestratorTeam });
            return;
        }
        // Activity log (crewly#881): the shallow team fields before this edit; members are logged by their own handlers.
        const teamBefore = { ...team, members: undefined, updatedAt: undefined };
        if (Array.isArray(updates.members)) {
            team.members = updates.members;
        }
        team.updatedAt = new Date().toISOString();
        await this.storageService.saveTeam(team);
        recordActivity({
            actor: actorFromRequest(req),
            action: 'team.updated',
        });
        return teamBefore;
}`,
  };

  for (const [rel, body] of Object.entries(files)) {
    const p = path.join(root, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body.trimStart().replace(/\r\n/g, '\n'), 'utf8');
  }
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ type: 'module' }), 'utf8');
  return path.join(root, 'backend/src');
}

test('apply-multi-account-pool patches idempotently, resolves real ESM imports (.mjs), and executes load-balance + failover', async (t) => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'crewly-apply-multi-'));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

  const backendRoot = buildRunnableDistFixture(tmp);
  applyMultiAccount(backendRoot);
  applyMultiAccount(backendRoot); // Verify idempotency!

  assert.equal(fs.existsSync(path.join(backendRoot, 'services/harness/runtime-accounts-pool.mjs')), true);
  execFileSync('node', ['--check', path.join(backendRoot, 'services/harness/runtime-accounts-pool.mjs')]);

  // Actually import compiled ESM files via file:// URL so any missing .mjs extension throws ERR_MODULE_NOT_FOUND!
  const crewlyHome = path.join(tmp, '.crewly');
  process.env.CREWLY_HOME = crewlyHome;
  t.after(() => { delete process.env.CREWLY_HOME; });

  const constantsMod = await import(pathToFileURL(path.join(backendRoot, 'constants.js')).href);
  const modelTierMod = await import(pathToFileURL(path.join(backendRoot, 'utils/model-tier.utils.js')).href);
  const flagsMod = await import(pathToFileURL(path.join(backendRoot, 'utils/runtime-model-flags.utils.js')).href);
  const poolMod = await import(pathToFileURL(path.join(backendRoot, 'services/harness/runtime-accounts-pool.mjs')).href);
  const typesMod = await import(pathToFileURL(path.join(backendRoot, 'services/runtime-fallback/runtime-fallback.types.js')).href);
  const availMod = await import(pathToFileURL(path.join(backendRoot, 'services/runtime-fallback/runtime-availability.js')).href);
  const serviceMod = await import(pathToFileURL(path.join(backendRoot, 'services/runtime-fallback/runtime-fallback.service.js')).href);
  const effMod = await import(pathToFileURL(path.join(backendRoot, 'services/runtime-fallback/effective-runtime.js')).href);
  const wiringMod = await import(pathToFileURL(path.join(backendRoot, 'services/runtime-fallback/runtime-fallback.wiring.js')).href);
  const credFilesMod = await import(pathToFileURL(path.join(backendRoot, 'services/core/credential-files.js')).href);
  await import(pathToFileURL(path.join(backendRoot, 'services/runtime-fallback/runtime-usage-probe.js')).href);
  await import(pathToFileURL(path.join(backendRoot, 'services/harness/login-broker.service.js')).href);
  await import(pathToFileURL(path.join(backendRoot, 'services/harness/harness.service.js')).href);
  const agentRegMod = await import(pathToFileURL(path.join(backendRoot, 'services/agent/agent-registration.service.js')).href);
  await import(pathToFileURL(path.join(backendRoot, 'services/agent/antigravity-runtime.service.js')).href);
  await import(pathToFileURL(path.join(backendRoot, 'services/harness/harness-status.service.js')).href);
  await import(pathToFileURL(path.join(backendRoot, 'services/agent/crewly-agent/crewly-agent-external-runtime.service.js')).href);
  await import(pathToFileURL(path.join(backendRoot, 'controllers/system/runtime-fallback.controller.js')).href);
  const teamCtrlMod = await import(pathToFileURL(path.join(backendRoot, 'controllers/team/team.controller.js')).href);
  const wsGatewayMod = await import(pathToFileURL(path.join(backendRoot, 'websocket/chat-v2.gateway.js')).href);
  const indexMod = await import(pathToFileURL(path.join(backendRoot, 'index.js')).href);

  // Confirm credential guard includes multi-account paths
  const guarded = credFilesMod.getGuardedCredentialPaths().map((g) => g.id);
  assert.ok(guarded.includes('runtime-accounts'));
  assert.ok(guarded.includes('codex-accounts'));

  // Confirm settings & chain target validation accept any runtime@account
  assert.equal(typesMod.isKnownRuntimeTarget('codex-cli@acc2'), true);
  assert.equal(typesMod.isKnownRuntimeTarget('antigravity-cli@gem1'), true);
  assert.equal(typesMod.defaultRuntimeFallbackSettings().balanceAccounts, true);

  // Seed two Codex accounts and compute availability without default login
  poolMod.ensureRuntimeAccountDir('codex-cli', 'acc1', { crewlyHome });
  poolMod.ensureRuntimeAccountDir('codex-cli', 'acc2', { crewlyHome });
  fs.writeFileSync(path.join(poolMod.accountDirFor('codex-cli', 'acc1', crewlyHome), 'auth.json'), JSON.stringify({ OPENAI_API_KEY: 'k1' }));
  fs.writeFileSync(path.join(poolMod.accountDirFor('codex-cli', 'acc2', crewlyHome), 'auth.json'), JSON.stringify({ OPENAI_API_KEY: 'k2' }));

  const avail = availMod.computeRuntimeAvailability({
    harnesses: [{ id: 'codex-cli', installed: true, loginState: 'logged_out' }],
    hasProviderKey: () => false,
    runtimeAccounts: poolMod.listRuntimeAccounts({ crewlyHome }),
  });
  assert.equal(avail.find((a) => a.runtime === 'codex-cli@acc1')?.selectable, true);
  assert.equal(avail.find((a) => a.runtime === 'codex-cli@acc2')?.selectable, true);

  // Boot RuntimeFallbackService and verify load balance + per-account exhaustion failover + revertIdle safety guard
  let savedState = {
    version: 1,
    settings: typesMod.defaultRuntimeFallbackSettings(),
    exhausted: {},
    overrides: {},
  };
  const svc = new serviceMod.RuntimeFallbackService({
    store: { load: () => savedState, save: (s) => { savedState = s; } },
    getAvailability: async () => avail,
    getAgent: async (s) => ({ sessionName: s, name: s, primary: 'codex-cli', isOrchestrator: false }),
    isLive: () => true,
  });

  const d1 = await svc.resolveLaunch({ sessionName: 'atelierx-designer-0003', configured: 'codex-cli', isOrchestrator: false });
  assert.equal(d1.runtime, 'codex-cli');
  assert.ok(['acc1', 'acc2'].includes(d1.claudeAccount));
  const firstAcc = d1.claudeAccount;
  const otherAcc = firstAcc === 'acc1' ? 'acc2' : 'acc1';
  assert.equal(svc.accountFor('atelierx-designer-0003'), firstAcc);
  assert.equal(svc.targetOf('atelierx-designer-0003', 'codex-cli'), `codex-cli@${firstAcc}`);

  // Mark the chosen account exhausted and verify doSwitch moves to sibling Codex account without reverting to logged-out default!
  savedState.exhausted[`codex-cli@${firstAcc}`] = { runtime: `codex-cli@${firstAcc}`, since: new Date().toISOString() };
  const outcome = await svc.doSwitch('atelierx-designer-0003');
  assert.equal(outcome, 'switched');
  assert.equal(svc.accountFor('atelierx-designer-0003'), otherAcc);

  // Run revertIdle while default codex-cli is STILL logged out -> must NOT revert to unselectable default slot!
  await svc.revertIdle();
  assert.equal(svc.accountFor('atelierx-designer-0003'), otherAcc);

  const snap = await svc.snapshot();
  assert.equal(snap.overrides[0].runtime, `codex-cli@${otherAcc}`);

  // Verify pinned <runtime>@<account> member runtimeType support:
  // 1. effectiveRuntimeType strips @account even without hooks; effectiveClaudeAccount extracts @account unless overridden onto an account-less fallback.
  effMod.setRuntimeFallbackHooks(null);
  assert.equal(effMod.effectiveRuntimeType('sess-pin', 'antigravity-cli@test1'), 'antigravity-cli');
  assert.equal(effMod.effectiveClaudeAccount('sess-pin', 'antigravity-cli@test1'), 'test1');

  // 2. Pinned member 'codex-cli@acc2' launches on acc2 directly (no load-balancing) when healthy,
  // and fails over to sibling healthy 'codex-cli@acc1' when 'codex-cli@acc2' is marked exhausted.
  delete savedState.exhausted['codex-cli@acc1'];
  delete savedState.exhausted['codex-cli@acc2'];
  const svcPin = new serviceMod.RuntimeFallbackService({
    store: { load: () => savedState, save: (s) => { savedState = s; } },
    getAvailability: async () => avail,
    getAgent: async (s) => ({ sessionName: s, name: s, primary: 'codex-cli@acc2', isOrchestrator: false }),
    isLive: () => true,
  });
  effMod.setRuntimeFallbackHooks(svcPin);
  const pinnedLaunch = await svcPin.resolveLaunch({ sessionName: 'pinned-sess', configured: 'codex-cli@acc2', isOrchestrator: false });
  assert.equal(pinnedLaunch.runtime, 'codex-cli');
  assert.equal(pinnedLaunch.overridden, false);
  assert.equal(pinnedLaunch.claudeAccount, 'acc2');
  assert.equal(svcPin.accountFor('pinned-sess'), 'acc2');
  assert.equal(svcPin.overrideFor('pinned-sess'), 'codex-cli');
  assert.equal(effMod.effectiveRuntimeType('pinned-sess', 'codex-cli@acc2'), 'codex-cli');
  assert.equal(effMod.effectiveClaudeAccount('pinned-sess', 'codex-cli@acc2'), 'acc2');

  savedState.exhausted['codex-cli@acc2'] = { runtime: 'codex-cli@acc2', since: new Date().toISOString() };
  const failoverLaunch = await svcPin.resolveLaunch({ sessionName: 'pinned-sess-2', configured: 'codex-cli@acc2', isOrchestrator: false });
  assert.equal(failoverLaunch.runtime, 'codex-cli');
  assert.equal(failoverLaunch.overridden, true);
  assert.equal(failoverLaunch.claudeAccount, 'acc1');
  assert.equal(effMod.effectiveClaudeAccount('pinned-sess-2', 'codex-cli@acc2'), 'acc1');

  // When overridden onto an account-less fallback, effectiveClaudeAccount must NOT leak the primary @account!
  savedState.overrides['overridden-no-acct'] = { runtime: 'crewly-agent', primary: 'codex-cli@acc2' };
  assert.equal(effMod.effectiveRuntimeType('overridden-no-acct', 'codex-cli@acc2'), 'crewly-agent');
  assert.equal(effMod.effectiveClaudeAccount('overridden-no-acct', 'codex-cli@acc2'), null);

  // clearSessionRuntimeChange wipes stale poolAssignments & overrides when switching runtime
  svcPin.clearSessionRuntimeChange('overridden-no-acct');
  svcPin.clearSessionRuntimeChange('pinned-sess');
  assert.equal(svcPin.accountFor('pinned-sess'), null);
  assert.equal(savedState.overrides['overridden-no-acct'], undefined);

  // 3. AgentRegistrationService normalizes pinned runtimeType, resolves healthy @account env, and preserves explicit memberModelId
  const regSvc = new agentRegMod.AgentRegistrationService();
  effMod.setRuntimeFallbackHooks(svcPin);
  delete savedState.exhausted['codex-cli@acc2'];
  const sampleRes = await regSvc.sampleCallPaths(
    'pinned-sess',
    { sessionName: 'pinned-sess', runtimeType: 'codex-cli@acc2' },
    { runtimeType: 'codex-cli@acc2' },
    null,
    'developer',
    tmp,
    'openai/gpt-4o',
  );
  assert.equal(sampleRes.runtimeType, 'codex-cli');
  assert.equal(sampleRes.createdSession.env.CODEX_HOME, poolMod.accountDirFor('codex-cli', 'acc2', crewlyHome));
  assert.equal(sampleRes.memberModelId, 'openai/gpt-4o');

  // And when pinned acc2 is exhausted at launch, sampleCallPaths fails over cleanly to acc1
  savedState.exhausted['codex-cli@acc2'] = { runtime: 'codex-cli@acc2', since: new Date().toISOString() };
  const sampleFailover = await regSvc.sampleCallPaths(
    'pinned-sess-failover',
    { sessionName: 'pinned-sess-failover', runtimeType: 'codex-cli@acc2' },
    { runtimeType: 'codex-cli@acc2' },
    null,
    'developer',
    tmp,
    'openai/gpt-4o',
  );
  assert.equal(sampleFailover.createdSession.env.CODEX_HOME, poolMod.accountDirFor('codex-cli', 'acc1', crewlyHome));

  // 4. crewlyAgentModelsInUse treats crewly-agent@ds1 as crewly-agent
  const caModels = await wiringMod.crewlyAgentModelsInUse({
    getOrchestratorStatus: async () => ({ runtimeType: 'crewly-agent@ds1', modelId: 'deepseek/deepseek-chat' }),
    getTeams: async () => [{ members: [{ runtimeType: 'crewly-agent@gem1', modelId: 'google/gemini-2.5-flash' }] }],
  });
  assert.deepEqual(caModels, ['deepseek/deepseek-chat', 'google/gemini-2.5-flash']);

  // 5. team.controller.js updateTeamMemberRuntime accepts <runtime>@<account> and rejects invalid targets
  let statusCode = 200;
  let body = null;
  const mkRes = () => ({ status(c) { statusCode = c; return this; }, json(b) { body = b; return this; } });
  await teamCtrlMod.updateTeamMemberRuntime({ body: { runtimeType: 'antigravity-cli@test1' } }, mkRes());
  assert.equal(statusCode, 200);
  assert.equal(body.success, true);

  statusCode = 200;
  await teamCtrlMod.updateTeamMemberRuntime({ body: { runtimeType: 'not-a-runtime@acc1' } }, mkRes());
  assert.equal(statusCode, 400);
  assert.equal(body.success, false);

  // Orchestrator updateTeam handler persists runtimeType edits from Edit Team modal
  let savedOrcRt = 'antigravity-cli';
  const orchCtx = {
    storageService: { async updateOrchestratorRuntimeType(rt) { savedOrcRt = rt; } },
    agentRegistrationService: null,
  };
  await teamCtrlMod.updateTeam.call(
    orchCtx,
    { params: { id: 'orchestrator' }, body: {} },
    mkRes(),
    true,
    { runtimeType: 'antigravity-cli', agentStatus: 'active' },
    { members: [{ role: 'orchestrator', name: 'Agentmux Orchestrator', runtimeType: 'codex-cli' }] },
  );
  assert.equal(savedOrcRt, 'codex-cli');
  assert.equal(body.data.members[0].runtimeType, 'codex-cli');

  // 6. Codex tier model map replaces retired gpt-5.4 with active gpt-6-sol and normalizes @account targets
  assert.deepEqual(constantsMod.MODEL_TIER_CONSTANTS.DEFAULT_TIER_MODELS['codex-cli'], {
    strong: 'gpt-6.1-sol',
    mid: 'gpt-6-sol',
    weak: 'gpt-6-luna',
  });
  assert.equal(modelTierMod.resolveTierModel('codex-cli', 'mid'), 'gpt-6-sol');
  assert.equal(modelTierMod.resolveTierModel('codex-cli@acc2', 'mid'), 'gpt-6-sol');
  assert.equal(modelTierMod.resolveTierModel('codex-cli', 'mid', { 'codex-cli': { mid: 'gpt-5.4' } }), 'gpt-6-sol');
  assert.deepEqual(flagsMod.buildRuntimeModelFlags('codex-cli', 'gpt-5.4', 'medium'), [
    '-m',
    'gpt-6-sol',
    '-c',
    'model_reasoning_effort="medium"',
  ]);

  // 7. chat_message from recordTurn broadcasts live over /ws/chat with (id, content) dedupe
  const { EventEmitter } = require('node:events');
  const chatService = new EventEmitter();
  const { chatGateway } = await indexMod.wireChatV2Sample(chatService);
  const frames = [];
  chatGateway.subscribers.set('ch-1', new Set([{ ws: { readyState: 1, send: (f) => frames.push(JSON.parse(f)) } }]));
  const dto1 = { id: 'msg-1', channelId: 'ch-1', senderType: 'agent', content: 'Hello live' };
  chatService.emit('chat_message', dto1);
  assert.equal(frames.length, 1);
  assert.deepEqual(frames[0], { type: 'message', payload: { channelId: 'ch-1', message: dto1 } });
  // Duplicate broadcast of the exact same (id, content) is suppressed
  chatGateway.broadcast('ch-1', wsGatewayMod.buildMessageEvent('ch-1', dto1));
  assert.equal(frames.length, 1);
  // Content mutation with the same id (e.g. updateSystemMessage) is still delivered
  const dtoUpdated = { id: 'msg-1', channelId: 'ch-1', senderType: 'system', content: 'Updated content' };
  chatGateway.broadcast('ch-1', wsGatewayMod.buildMessageEvent('ch-1', dtoUpdated));
  assert.equal(frames.length, 2);
  assert.equal(frames[1].payload.message.content, 'Updated content');
});
