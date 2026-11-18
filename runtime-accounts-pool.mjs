/**
 * Multi-account token pool manager for Crewly runtimes.
 *
 * Isolates credentials and CLI home directories per `(runtime, account)` pair
 * under `<CREWLY_HOME>` so users can attach multiple ChatGPT/OpenAI, Gemini/
 * Antigravity, Anthropic/Claude Code, and Crewly Agent accounts per runtime.
 *
 * Secret values (API keys, OAuth tokens) stay strictly on disk (mode 0600)
 * and are injected only into child process environments when launching agents.
 */

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

export const SUPPORTED_ACCOUNT_RUNTIMES = Object.freeze([
  'codex-cli',
  'antigravity-cli',
  'claude-code',
  'crewly-agent',
  'gemini-cli',
]);

export const ACCOUNT_NAME_RE = /^[a-z0-9][a-z0-9_-]{0,31}$/;
export const RESERVED_ACCOUNT_NAMES = Object.freeze([
  'default',
  'code',
  'cli',
  'agent',
  'account',
  'accounts',
  'claude',
  'none',
  'null',
]);
export const ACCOUNTS_STORE_FILE = 'runtime-accounts.json';
export const TARGET_SEPARATOR = '@';

export const DEFAULT_PROVIDER_MODELS = Object.freeze({
  deepseek: 'deepseek/deepseek-chat',
  gemini: 'google/gemini-2.5-flash',
  google: 'google/gemini-2.5-flash',
  openai: 'openai/gpt-4o',
  anthropic: 'anthropic/claude-sonnet-4-20250514',
});

const RUNTIME_DIR_PREFIXES = Object.freeze({
  'codex-cli': 'codex-accounts',
  'claude-code': 'claude-accounts',
  'gemini-cli': 'gemini-accounts',
});

const DEFAULT_RUNTIME_PROVIDER = Object.freeze({
  'codex-cli': 'openai',
  'antigravity-cli': 'gemini',
  'gemini-cli': 'gemini',
  'claude-code': 'anthropic',
  'crewly-agent': 'gemini',
});

const ALLOWED_PROVIDERS_BY_RUNTIME = Object.freeze({
  'codex-cli': ['openai'],
  'antigravity-cli': ['gemini'],
  'gemini-cli': ['gemini'],
  'claude-code': ['anthropic'],
  'crewly-agent': ['gemini', 'deepseek', 'openai', 'anthropic'],
});

const PROVIDER_DISPLAY = Object.freeze({
  openai: 'OpenAI',
  gemini: 'Google Gemini',
  google: 'Google Gemini',
  anthropic: 'Anthropic',
  deepseek: 'DeepSeek',
});

const RUNTIME_LABELS = Object.freeze({
  'claude-code': 'Claude Code',
  'codex-cli': 'Codex',
  'antigravity-cli': 'Antigravity CLI',
  'gemini-cli': 'Gemini CLI',
  'crewly-agent': 'Crewly Agent',
});

const NESTED_CLAUDE_ENV_KEYS = Object.freeze([
  'CLAUDECODE',
  'CLAUDE_CODE_ENTRYPOINT',
  'CLAUDE_CODE_SESSION_ID',
]);

export class RuntimeAccountError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'RuntimeAccountError';
    this.code = code;
  }
}

export function resolveCrewlyHome(crewlyHome) {
  if (crewlyHome && typeof crewlyHome === 'string') return path.resolve(crewlyHome);
  if (process.env.CREWLY_HOME && process.env.CREWLY_HOME.trim()) {
    return path.resolve(process.env.CREWLY_HOME.trim());
  }
  return path.join(os.homedir(), '.crewly');
}

export function normaliseAccountName(raw) {
  return typeof raw === 'string' ? raw.trim().toLowerCase() : '';
}

export function isValidAccountName(name) {
  return typeof name === 'string' && ACCOUNT_NAME_RE.test(name) && !RESERVED_ACCOUNT_NAMES.includes(name);
}

export function requireAccountName(raw) {
  const name = normaliseAccountName(raw);
  if (!isValidAccountName(name)) {
    throw new RuntimeAccountError(
      'invalid_name',
      `Account names must be 1–32 chars of [a-z0-9_-], starting with a-z/0-9 (not ${RESERVED_ACCOUNT_NAMES.join(', ')})`,
    );
  }
  return name;
}

export function isSupportedAccountRuntime(runtime) {
  return typeof runtime === 'string' && SUPPORTED_ACCOUNT_RUNTIMES.includes(runtime);
}

export function parseRuntimeTarget(target) {
  if (typeof target !== 'string') return { runtime: '' };
  const at = target.indexOf(TARGET_SEPARATOR);
  if (at <= 0) return { runtime: target };
  return { runtime: target.slice(0, at), account: target.slice(at + 1) };
}

export function baseRuntimeOf(target) {
  return parseRuntimeTarget(target).runtime;
}

export function accountOf(target) {
  return parseRuntimeTarget(target).account ?? null;
}

export function runtimeTarget(runtime, account) {
  return account ? `${runtime}${TARGET_SEPARATOR}${account}` : runtime;
}

export function isMultiAccountTarget(target) {
  const { runtime, account } = parseRuntimeTarget(target);
  return isSupportedAccountRuntime(runtime) && account !== undefined && isValidAccountName(account);
}

export function runtimeAccountsFilePath(crewlyHome) {
  return path.join(resolveCrewlyHome(crewlyHome), ACCOUNTS_STORE_FILE);
}

export function accountDirFor(runtime, account, crewlyHome) {
  const sub = RUNTIME_DIR_PREFIXES[runtime];
  if (!sub || !isValidAccountName(account)) return null;
  return path.join(resolveCrewlyHome(crewlyHome), sub, account);
}

export function getAdditionalGuardedAccountPaths(crewlyHome) {
  const home = resolveCrewlyHome(crewlyHome);
  return [
    { id: 'runtime-accounts', path: path.join(home, ACCOUNTS_STORE_FILE), isDirectory: false },
    { id: 'codex-accounts', path: path.join(home, RUNTIME_DIR_PREFIXES['codex-cli']), isDirectory: true },
    { id: 'gemini-accounts', path: path.join(home, RUNTIME_DIR_PREFIXES['gemini-cli']), isDirectory: true },
  ];
}

export function readAccountsStore(crewlyHome) {
  const file = runtimeAccountsFilePath(crewlyHome);
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.accounts && typeof parsed.accounts === 'object') {
      return { version: 1, accounts: parsed.accounts };
    }
  } catch {
    // Missing or unreadable file starts empty.
  }
  return { version: 1, accounts: {} };
}

export function writeAccountsStore(store, crewlyHome) {
  const file = runtimeAccountsFilePath(crewlyHome);
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  const payload = JSON.stringify({ version: 1, accounts: store?.accounts ?? {} }, null, 2) + '\n';
  const fd = fs.openSync(tmp, 'w', 0o600);
  try {
    fs.writeSync(fd, payload, null, 'utf8');
  } finally {
    fs.closeSync(fd);
  }
  try { fs.chmodSync(tmp, 0o600); } catch {}
  fs.renameSync(tmp, file);
  try { fs.chmodSync(file, 0o600); } catch {}
}

export function ensureRuntimeAccountDir(runtime, account, options = {}) {
  const name = requireAccountName(account);
  const dir = accountDirFor(runtime, name, options.crewlyHome);
  if (!dir) return null;
  const existed = fs.existsSync(dir);
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  try { fs.chmodSync(dir, 0o700); } catch {}

  if (!existed && runtime === 'codex-cli') {
    const defaultCodexHome =
      (options.defaultEnv?.CODEX_HOME && options.defaultEnv.CODEX_HOME.trim()) ||
      path.join(options.homeDir || os.homedir(), '.codex');
    const srcConfig = path.join(defaultCodexHome, 'config.toml');
    const dstConfig = path.join(dir, 'config.toml');
    try {
      // Carry safe preferences only — never copy auth.json across accounts.
      if (fs.existsSync(srcConfig) && !fs.existsSync(dstConfig)) {
        fs.copyFileSync(srcConfig, dstConfig);
      }
    } catch {
      // Optional copy; ignore permission errors.
    }
  }
  return dir;
}

export function maskSecret(secret) {
  if (typeof secret !== 'string' || secret.trim().length === 0) return null;
  const trimmed = secret.trim();
  return trimmed.length >= 4 ? `••••${trimmed.slice(-4)}` : '••••';
}

export function decodeJwtClaims(jwt) {
  if (typeof jwt !== 'string') return null;
  const parts = jwt.split('.');
  if (parts.length < 2) return null;
  try {
    return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export function readCodexAuthSummary(dir) {
  if (!dir) return { signedIn: false, identity: null, authMode: null };
  const authPath = path.join(dir, 'auth.json');
  try {
    if (!fs.existsSync(authPath)) return { signedIn: false, identity: null, authMode: null };
    const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    if (!auth || typeof auth !== 'object') return { signedIn: false, identity: null, authMode: null };
    const claims = decodeJwtClaims(auth.tokens?.id_token);
    if (claims?.email) {
      return { signedIn: true, identity: String(claims.email), authMode: auth.auth_mode || 'chatgpt' };
    }
    if (typeof auth.OPENAI_API_KEY === 'string' && auth.OPENAI_API_KEY.trim()) {
      return { signedIn: true, identity: maskSecret(auth.OPENAI_API_KEY) || 'API key', authMode: 'apikey' };
    }
    if (auth.tokens?.access_token || auth.tokens?.refresh_token) {
      return { signedIn: true, identity: 'ChatGPT account', authMode: auth.auth_mode || 'chatgpt' };
    }
  } catch {
    // Corrupted or unreadable auth.json
  }
  return { signedIn: false, identity: null, authMode: null };
}

function normaliseKey(runtime, account) {
  return runtimeTarget(runtime, account);
}

export function getStoredAccountEntry(runtime, account, crewlyHome) {
  const store = readAccountsStore(crewlyHome);
  const direct = store.accounts[normaliseKey(runtime, account)];
  if (direct && typeof direct === 'object') return direct;
  return null;
}

export function firstStoredAccountApiKey(runtime, crewlyHome) {
  const store = readAccountsStore(crewlyHome);
  for (const [key, entry] of Object.entries(store.accounts)) {
    const parsed = parseRuntimeTarget(key);
    if (parsed.runtime !== runtime) continue;
    if (typeof entry?.apiKey === 'string' && entry.apiKey.trim()) {
      return entry.apiKey.trim();
    }
  }
  return null;
}

export function listRuntimeAccounts(options = {}) {
  const crewlyHome = resolveCrewlyHome(options.crewlyHome);
  const store = readAccountsStore(crewlyHome);
  const merged = new Map();

  const claudeByName = new Map();
  for (const ca of options.claudeAccountsList ?? []) {
    if (ca && isValidAccountName(ca.name)) claudeByName.set(ca.name, ca);
  }

  for (const [key, entry] of Object.entries(store.accounts)) {
    const { runtime, account } = parseRuntimeTarget(key);
    if (!isSupportedAccountRuntime(runtime) || !isValidAccountName(account) || !entry || typeof entry !== 'object') continue;
    const dir = accountDirFor(runtime, account, crewlyHome);
    const hasKey = typeof entry.apiKey === 'string' && entry.apiKey.trim().length > 0;
    let signedIn = hasKey;
    let identity = entry.identity || (hasKey ? maskSecret(entry.apiKey) : null);

    if (runtime === 'codex-cli') {
      const codexAuth = readCodexAuthSummary(dir);
      if (codexAuth.signedIn) {
        signedIn = true;
        identity = codexAuth.identity || identity;
      }
    } else if (runtime === 'claude-code') {
      const ca = claudeByName.get(account);
      if (ca?.signedIn) signedIn = true;
    }

    merged.set(key, {
      runtime,
      name: account,
      target: key,
      authKind: entry.authKind || (hasKey ? 'api_key' : 'broker'),
      provider: entry.provider || DEFAULT_RUNTIME_PROVIDER[runtime],
      ...(entry.model ? { model: entry.model } : {}),
      identity: identity || null,
      signedIn,
      updatedAt: entry.updatedAt || null,
    });
  }

  // Include filesystem-discovered Codex and Gemini dirs even if added via CLI.
  for (const runtime of ['codex-cli', 'gemini-cli']) {
    const parent = path.join(crewlyHome, RUNTIME_DIR_PREFIXES[runtime]);
    try {
      for (const d of fs.readdirSync(parent, { withFileTypes: true })) {
        if (!d.isDirectory() || !isValidAccountName(d.name)) continue;
        const key = normaliseKey(runtime, d.name);
        if (merged.has(key)) continue;
        const dir = path.join(parent, d.name);
        const codexAuth = runtime === 'codex-cli' ? readCodexAuthSummary(dir) : { signedIn: false, identity: null };
        merged.set(key, {
          runtime,
          name: d.name,
          target: key,
          authKind: 'broker',
          provider: DEFAULT_RUNTIME_PROVIDER[runtime],
          identity: codexAuth.identity,
          signedIn: codexAuth.signedIn,
          updatedAt: null,
        });
      }
    } catch {
      // Directory does not exist yet.
    }
  }

  // Include all Claude Code accounts reported by claude-accounts.js.
  for (const [name, ca] of claudeByName.entries()) {
    const key = normaliseKey('claude-code', name);
    const existing = merged.get(key);
    if (existing) {
      if (ca.signedIn) existing.signedIn = true;
      continue;
    }
    merged.set(key, {
      runtime: 'claude-code',
      name,
      target: key,
      authKind: 'broker',
      provider: 'anthropic',
      identity: null,
      signedIn: Boolean(ca.signedIn),
      updatedAt: null,
    });
  }

  const order = new Map(SUPPORTED_ACCOUNT_RUNTIMES.map((r, i) => [r, i]));
  return [...merged.values()].sort((a, b) => {
    const da = order.get(a.runtime) ?? 99;
    const db = order.get(b.runtime) ?? 99;
    if (da !== db) return da - db;
    return a.name.localeCompare(b.name);
  });
}

export async function validateProviderApiKey(provider, apiKey, options = {}) {
  const key = typeof apiKey === 'string' ? apiKey.trim() : '';
  if (key.length < 12 || key.length > 512 || /\s/.test(key)) {
    throw new RuntimeAccountError('invalid_key', 'API key format looks invalid (expected 12–512 non-whitespace characters)');
  }
  const fetchFn = options.fetchFn ?? globalThis.fetch;
  if (typeof fetchFn !== 'function') return 'unverified';
  const timeoutMs = options.timeoutMs ?? 8000;
  const p = provider === 'google' ? 'gemini' : provider;

  const endpoints = {
    gemini: { url: 'https://generativelanguage.googleapis.com/v1beta/models', headers: { 'x-goog-api-key': key } },
    anthropic: { url: 'https://api.anthropic.com/v1/models', headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' } },
    openai: { url: 'https://api.openai.com/v1/models', headers: { authorization: `Bearer ${key}` } },
    deepseek: { url: 'https://api.deepseek.com/models', headers: { authorization: `Bearer ${key}` } },
  };
  const cfg = endpoints[p];
  if (!cfg) return 'unverified';

  try {
    const res = await fetchFn(cfg.url, {
      method: 'GET',
      headers: cfg.headers,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status >= 200 && res.status < 300) return 'valid';
    if (res.status === 400 || res.status === 401 || res.status === 403) return 'invalid';
    return 'unverified';
  } catch {
    return 'unverified';
  }
}

export async function saveRuntimeAccountApiKey(params, deps = {}) {
  const runtime = params?.runtime;
  if (!isSupportedAccountRuntime(runtime)) {
    throw new RuntimeAccountError('invalid_runtime', `Unsupported runtime "${String(runtime)}"`);
  }
  const name = requireAccountName(params?.name);
  const rawProvider = typeof params?.provider === 'string' ? params.provider.trim().toLowerCase() : '';
  const provider = rawProvider || DEFAULT_RUNTIME_PROVIDER[runtime];
  const allowedProviders = ALLOWED_PROVIDERS_BY_RUNTIME[runtime] || [];
  if (!allowedProviders.includes(provider)) {
    throw new RuntimeAccountError('invalid_provider', `${runtime} does not support provider "${provider}" (allowed: ${allowedProviders.join(', ')})`);
  }

  let model = typeof params?.model === 'string' && params.model.trim() ? params.model.trim() : undefined;
  if (model && !/^[a-z0-9-]+\/[A-Za-z0-9._:-]+$/.test(model)) {
    throw new RuntimeAccountError('invalid_model', 'Model must look like provider/model (e.g. deepseek/deepseek-chat)');
  }
  if (runtime === 'crewly-agent' && !model) {
    model = DEFAULT_PROVIDER_MODELS[provider];
  }

  const key = typeof params?.apiKey === 'string' ? params.apiKey.trim() : '';
  const check = await validateProviderApiKey(provider, key, {
    fetchFn: deps.fetchFn,
    timeoutMs: deps.timeoutMs,
  });
  if (check === 'invalid') {
    throw new RuntimeAccountError('invalid_key', `${PROVIDER_DISPLAY[provider] ?? provider} rejected this API key (HTTP 400/401/403)`);
  }

  const crewlyHome = resolveCrewlyHome(params?.crewlyHome ?? deps.crewlyHome);
  const dir = accountDirFor(runtime, name, crewlyHome);
  if (dir) ensureRuntimeAccountDir(runtime, name, { crewlyHome });

  // For codex-cli API keys, seed CODEX_HOME/auth.json when codex CLI is available
  // (fall back cleanly to stored apiKey injected as OPENAI_API_KEY at spawn).
  if (runtime === 'codex-cli' && dir && typeof deps.seedCodexApiKeyFn === 'function') {
    await deps.seedCodexApiKeyFn(dir, key);
  } else if (runtime === 'codex-cli' && dir && deps.resolveCodexBinary) {
    const codexBin = deps.resolveCodexBinary();
    if (codexBin && typeof deps.runCommandFn === 'function') {
      await deps.runCommandFn(codexBin, ['login', '--with-api-key'], {
        cwd: dir,
        env: { ...process.env, CODEX_HOME: dir },
        input: `${key}\n`,
      }).catch(() => undefined);
    }
  }

  const target = normaliseKey(runtime, name);
  const store = readAccountsStore(crewlyHome);
  store.accounts[target] = {
    runtime,
    name,
    authKind: 'api_key',
    provider,
    ...(model ? { model } : {}),
    apiKey: key,
    identity: `${maskSecret(key)} (${PROVIDER_DISPLAY[provider] ?? provider})`,
    verified: check,
    updatedAt: new Date().toISOString(),
  };
  writeAccountsStore(store, crewlyHome);

  return {
    runtime,
    name,
    target,
    authKind: 'api_key',
    provider,
    ...(model ? { model } : {}),
    identity: store.accounts[target].identity,
    signedIn: true,
    updatedAt: store.accounts[target].updatedAt,
  };
}

export function registerPendingAccountStub({ runtime, name, authKind = 'broker', crewlyHome }) {
  if (!isSupportedAccountRuntime(runtime)) {
    throw new RuntimeAccountError('invalid_runtime', `Unsupported runtime "${String(runtime)}"`);
  }
  const cleanName = requireAccountName(name);
  const home = resolveCrewlyHome(crewlyHome);
  ensureRuntimeAccountDir(runtime, cleanName, { crewlyHome: home });
  const target = normaliseKey(runtime, cleanName);
  const store = readAccountsStore(home);
  const prev = store.accounts[target];
  store.accounts[target] = {
    ...(prev && typeof prev === 'object' ? prev : {}),
    runtime,
    name: cleanName,
    authKind,
    provider: prev?.provider || DEFAULT_RUNTIME_PROVIDER[runtime],
    updatedAt: new Date().toISOString(),
  };
  writeAccountsStore(store, home);
  return target;
}

export function removeRuntimeAccount(runtime, name, options = {}) {
  if (!isSupportedAccountRuntime(runtime)) {
    throw new RuntimeAccountError('invalid_runtime', `Unsupported runtime "${String(runtime)}"`);
  }
  const cleanName = requireAccountName(name);
  const crewlyHome = resolveCrewlyHome(options.crewlyHome);
  const target = normaliseKey(runtime, cleanName);

  const store = readAccountsStore(crewlyHome);
  if (target in store.accounts) {
    delete store.accounts[target];
    writeAccountsStore(store, crewlyHome);
  }

  if (runtime === 'claude-code' && typeof options.removeClaudeAccountFn === 'function') {
    options.removeClaudeAccountFn(cleanName);
  } else {
    const dir = accountDirFor(runtime, cleanName, crewlyHome);
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  }
  return target;
}

export function runtimeAccountSpawnEnv(runtime, account, options = {}) {
  if (!account || !isValidAccountName(account)) return {};
  const crewlyHome = resolveCrewlyHome(options.crewlyHome);
  const stored = getStoredAccountEntry(runtime, account, crewlyHome);
  const key = typeof stored?.apiKey === 'string' && stored.apiKey.trim() ? stored.apiKey.trim() : null;

  if (runtime === 'codex-cli') {
    const dir = ensureRuntimeAccountDir('codex-cli', account, { crewlyHome });
    const hasAuth = fs.existsSync(path.join(dir, 'auth.json'));
    return {
      CODEX_HOME: dir,
      ...(!hasAuth && key ? { OPENAI_API_KEY: key } : {}),
    };
  }

  if (runtime === 'claude-code') {
    const dir = accountDirFor('claude-code', account, crewlyHome);
    if (key) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
      return {
        CLAUDE_CONFIG_DIR: dir,
        CLAUDE_CODE_OAUTH_TOKEN: '',
        ANTHROPIC_API_KEY: key,
      };
    }
    if (typeof options.claudeAccountEnvFn === 'function') {
      return options.claudeAccountEnvFn(account);
    }
    return {
      CLAUDE_CONFIG_DIR: dir,
      CLAUDE_CODE_OAUTH_TOKEN: '',
      ANTHROPIC_API_KEY: '',
    };
  }

  if (runtime === 'antigravity-cli') {
    if (!key) return {};
    return {
      GEMINI_API_KEY: key,
      GOOGLE_GENERATIVE_AI_API_KEY: key,
      AGY_CLI_DISABLE_AUTO_UPDATE: 'true',
    };
  }

  if (runtime === 'gemini-cli') {
    const dir = ensureRuntimeAccountDir('gemini-cli', account, { crewlyHome });
    return {
      GEMINI_CLI_HOME: dir,
      ...(key ? { GEMINI_API_KEY: key, GOOGLE_GENERATIVE_AI_API_KEY: key } : {}),
    };
  }

  if (runtime === 'crewly-agent' && key) {
    const p = stored?.provider || 'gemini';
    if (p === 'deepseek') return { DEEPSEEK_API_KEY: key };
    if (p === 'openai') return { OPENAI_API_KEY: key };
    if (p === 'anthropic') return { ANTHROPIC_API_KEY: key };
    if (p === 'gemini' || p === 'google') {
      return { GEMINI_API_KEY: key, GOOGLE_GENERATIVE_AI_API_KEY: key };
    }
  }

  return {};
}

export function resolveCrewlyAgentAccountModel(account, crewlyHome) {
  if (!account) return null;
  const stored = getStoredAccountEntry('crewly-agent', account, crewlyHome);
  if (!stored) return null;
  if (typeof stored.model === 'string' && stored.model.trim()) return stored.model.trim();
  return DEFAULT_PROVIDER_MODELS[stored.provider] ?? null;
}

export function fnv1aHash(str) {
  let hash = 2166136261;
  const s = String(str ?? '');
  for (let i = 0; i < s.length; i++) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Pick a healthy account target of `configuredRuntime` for load balancing.
 *
 * When multiple accounts of the same runtime are healthy and `balanceEnabled`
 * is true, hashes `sessionName` deterministically so agents spread evenly across
 * accounts without causing unnecessary restarts on re-launch. If the default
 * slot is signed out while named account(s) are healthy, always selects one of
 * the healthy named accounts so work continues automatically.
 */
export function pickBalancedAccountTarget(
  sessionName,
  configuredRuntime,
  availabilityList = [],
  exhaustedMap = {},
  balanceEnabled = true,
) {
  const healthy = (availabilityList || [])
    .filter((entry) => entry && entry.selectable && baseRuntimeOf(entry.runtime) === configuredRuntime && !exhaustedMap?.[entry.runtime])
    .sort((a, b) => {
      if (a.runtime === configuredRuntime) return -1;
      if (b.runtime === configuredRuntime) return 1;
      return a.runtime.localeCompare(b.runtime);
    });

  if (healthy.length === 0) return null;

  const hasDefault = healthy.some((e) => e.runtime === configuredRuntime);
  if (!balanceEnabled) {
    return hasDefault ? null : healthy[0].runtime;
  }

  if (healthy.length === 1 && hasDefault) return null;
  const idx = fnv1aHash(sessionName) % healthy.length;
  return healthy[idx].runtime;
}

function isQuotaHttpResponse(status, bodyText = '') {
  if (status === 429 || status === 402) return true;
  return /quota|rate.?limit|resource.?exhausted|insufficient.?balance|usage.?limit/i.test(String(bodyText));
}

export async function probeRuntimeAccountUsage(target, deps = {}) {
  const { runtime, account } = parseRuntimeTarget(target);
  const crewlyHome = resolveCrewlyHome(deps.crewlyHome);
  const baseEnv = deps.baseEnv ?? process.env;
  const timeoutMs = deps.timeoutMs ?? 15000;
  const fetchFn = deps.fetchFn ?? globalThis.fetch;

  if (runtime === 'antigravity-cli' || runtime === 'gemini-cli') {
    const stored = account ? getStoredAccountEntry(runtime, account, crewlyHome) : null;
    const key = stored?.apiKey || (!account ? (firstStoredAccountApiKey(runtime, crewlyHome) || baseEnv.GEMINI_API_KEY) : null);
    if (!key || typeof fetchFn !== 'function') return 'unknown';
    try {
      const res = await fetchFn('https://generativelanguage.googleapis.com/v1beta/models', {
        method: 'GET',
        headers: { 'x-goog-api-key': key },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.status >= 200 && res.status < 300) return 'available';
      const body = await res.text().catch(() => '');
      return isQuotaHttpResponse(res.status, body) ? 'limited' : 'unknown';
    } catch {
      return 'unknown';
    }
  }

  if (runtime === 'crewly-agent' && account) {
    const stored = getStoredAccountEntry('crewly-agent', account, crewlyHome);
    if (!stored?.apiKey || typeof fetchFn !== 'function') return 'unknown';
    const check = await validateProviderApiKey(stored.provider || 'gemini', stored.apiKey, { fetchFn, timeoutMs }).catch(() => 'unverified');
    if (check === 'valid') return 'available';
    if (check === 'invalid') return 'limited';
    return 'unknown';
  }

  if (runtime === 'claude-code' && account) {
    const stored = getStoredAccountEntry('claude-code', account, crewlyHome);
    if (stored?.authKind === 'api_key' && stored.apiKey && typeof fetchFn === 'function') {
      try {
        const res = await fetchFn('https://api.anthropic.com/v1/models', {
          method: 'GET',
          headers: { 'x-api-key': stored.apiKey, 'anthropic-version': '2023-06-01' },
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (res.status >= 200 && res.status < 300) return 'available';
        const body = await res.text().catch(() => '');
        return isQuotaHttpResponse(res.status, body) ? 'limited' : 'unknown';
      } catch {
        return 'unknown';
      }
    }
    return 'delegate';
  }

  if (runtime === 'codex-cli' && account) {
    const binary = typeof deps.resolve === 'function' ? deps.resolve('codex') : null;
    if (!binary || typeof deps.run !== 'function') return 'unknown';
    const dir = accountDirFor('codex-cli', account, crewlyHome);
    if (!dir) return 'unknown';
    const stored = getStoredAccountEntry('codex-cli', account, crewlyHome);
    const hasAuth = fs.existsSync(path.join(dir, 'auth.json'));
    const env = { ...baseEnv, CODEX_HOME: dir };
    for (const k of NESTED_CLAUDE_ENV_KEYS) delete env[k];
    if (!hasAuth && stored?.apiKey) env.OPENAI_API_KEY = stored.apiKey;
    else delete env.OPENAI_API_KEY;
    const scratch = deps.scratchDir ?? path.join(os.tmpdir(), 'crewly-usage-probe');
    fs.mkdirSync(scratch, { recursive: true });
    const result = await deps.run(
      binary,
      ['exec', '--model', 'gpt-6-luna', '--skip-git-repo-check', '--sandbox', 'read-only', 'Reply exactly OK'],
      { env, timeoutMs, cwd: scratch },
    );
    const text = `${result.stdout || ''}\n${result.stderr || ''}`;
    if (typeof deps.classifyCodexResult === 'function') return deps.classifyCodexResult(result);
    if (/usage.?limit|rate.?limit|quota|too many requests|429/i.test(text)) return 'limited';
    return result.code === 0 ? 'available' : 'unknown';
  }

  return 'delegate';
}

export function listCodexIdentities(crewlyHome) {
  const home = resolveCrewlyHome(crewlyHome);
  const items = [];
  const defaultAuthDir = path.join(os.homedir(), '.codex');
  const def = readCodexAuthSummary(defaultAuthDir);
  if (def.signedIn) items.push({ target: 'codex-cli', name: 'default', ...def });
  const poolDir = path.join(home, 'codex-accounts');
  try {
    for (const d of fs.readdirSync(poolDir, { withFileTypes: true })) {
      if (!d.isDirectory() || !isValidAccountName(d.name)) continue;
      const sum = readCodexAuthSummary(path.join(poolDir, d.name));
      if (sum.signedIn) items.push({ target: `codex-cli@${d.name}`, name: d.name, ...sum });
    }
  } catch {
    // Pool directory empty or missing.
  }
  return items;
}

export function runtimeAccountLabel(target) {
  const { runtime, account } = parseRuntimeTarget(target);
  const baseLabel = RUNTIME_LABELS[runtime] ?? runtime;
  return account ? `${baseLabel} (${account})` : baseLabel;
}

function sendAccountError(res, err) {
  if (err instanceof RuntimeAccountError) {
    const statusMap = {
      invalid_runtime: 400,
      invalid_name: 400,
      invalid_key: 400,
      invalid_provider: 400,
      invalid_model: 400,
      unsupported_method: 400,
      not_found: 404,
      conflict: 409,
      login_failed: 422,
    };
    res.status(statusMap[err.code] ?? 400).json({ success: false, code: err.code, error: err.message });
    return;
  }
  res.status(500).json({ success: false, error: err instanceof Error ? err.message : String(err) });
}

/**
 * Mount REST routes for adding, re-authenticating, listing, and removing accounts
 * of any Crewly runtime directly from the Web UI (zero Slack requirement).
 */
export function registerMultiAccountRoutes(router, deps) {
  router.get('/system/runtime-fallback/accounts', async (_req, res) => {
    try {
      const runtimeAccounts = deps.listAccounts();
      res.json({ success: true, data: { runtimeAccounts } });
    } catch (err) {
      sendAccountError(res, err);
    }
  });

  const handleAddOrLogin = async (req, res, statusOk, explicitRuntime, explicitName) => {
    if (!deps.ensureOwnerCaller(req, res, `${req.method} ${req.path}`)) return;
    const fallback = deps.fallback();
    if (!fallback) {
      res.status(503).json({ success: false, error: 'Runtime fallback is not ready yet — Crewly is still starting.' });
      return;
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const runtime = explicitRuntime || body.runtime;
    const rawName = explicitName || body.name;
    const method = body.method || (runtime === 'antigravity-cli' || runtime === 'crewly-agent' || runtime === 'gemini-cli' ? 'api_key' : 'device');

    try {
      if (!isSupportedAccountRuntime(runtime)) {
        throw new RuntimeAccountError('invalid_runtime', `Unsupported runtime "${String(runtime)}"`);
      }
      const name = requireAccountName(rawName);

      if (method === 'api_key' || (typeof body.apiKey === 'string' && body.apiKey.trim().length > 0)) {
        const account = await deps.saveApiKeyAccount({
          runtime,
          name,
          apiKey: body.apiKey,
          provider: body.provider,
          model: body.model,
        });
        fallback.invalidateAvailability?.();
        await fallback.onRuntimeAccountLogin?.(runtime, name);
        res.status(statusOk).json({
          success: true,
          data: {
            ...(await deps.buildSnapshot(fallback)),
            account,
          },
        });
        return;
      }

      if ((runtime === 'codex-cli' && method === 'device') || (runtime === 'claude-code' && method === 'subscription')) {
        deps.registerBrokerStub({ runtime, name, authKind: 'broker' });
        fallback.invalidateAvailability?.();
        const loginSession = await deps.startBrokerLogin(runtime, method, name);
        res.status(statusOk).json({
          success: true,
          data: {
            ...(await deps.buildSnapshot(fallback)),
            account: {
              runtime,
              name,
              target: runtimeTarget(runtime, name),
              authKind: 'broker',
              provider: DEFAULT_RUNTIME_PROVIDER[runtime],
              identity: null,
              signedIn: false,
            },
            loginSession,
          },
        });
        return;
      }

      throw new RuntimeAccountError('unsupported_method', `${runtime} does not support login method "${method}"`);
    } catch (err) {
      sendAccountError(res, err);
    }
  };

  router.post('/system/runtime-fallback/accounts', async (req, res) => {
    await handleAddOrLogin(req, res, 201, null, null);
  });

  router.post('/system/runtime-fallback/accounts/:runtime/:name/login', async (req, res) => {
    await handleAddOrLogin(req, res, 202, req.params.runtime, req.params.name);
  });

  router.delete('/system/runtime-fallback/accounts/:runtime/:name', async (req, res) => {
    if (!deps.ensureOwnerCaller(req, res, 'DELETE /system/runtime-fallback/accounts/:runtime/:name')) return;
    const fallback = deps.fallback();
    if (!fallback) {
      res.status(503).json({ success: false, error: 'Runtime fallback is not ready yet — Crewly is still starting.' });
      return;
    }

    try {
      const runtime = req.params.runtime;
      if (!isSupportedAccountRuntime(runtime)) {
        throw new RuntimeAccountError('invalid_runtime', `Unsupported runtime "${String(runtime)}"`);
      }
      const name = requireAccountName(req.params.name);
      const target = runtimeTarget(runtime, name);

      const snap = await fallback.snapshot();
      const activeOverrides = (snap.overrides || []).filter((o) => o.runtime === target);
      if (activeOverrides.length > 0) {
        res.status(409).json({
          success: false,
          code: 'conflict',
          error: `${activeOverrides.length} agent(s) are currently running on ${target}. Wait until they finish or switch before deleting.`,
        });
        return;
      }

      const settings = fallback.getSettings?.();
      if (settings) {
        const memberChains = {};
        for (const [memberId, chain] of Object.entries(settings.memberChains || {})) {
          const next = chain.filter((r) => r !== target);
          memberChains[memberId] = next.length > 0 ? next : null;
        }
        fallback.updateSettings({
          chain: (settings.chain || []).filter((r) => r !== target),
          memberChains,
        });
      }

      fallback.clearAccountState?.(target);
      deps.removeAccount(runtime, name);
      fallback.invalidateAvailability?.();
      res.json({ success: true, data: await deps.buildSnapshot(fallback) });
    } catch (err) {
      sendAccountError(res, err);
    }
  });
}
