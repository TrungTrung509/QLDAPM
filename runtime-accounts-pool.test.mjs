import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  RuntimeAccountError,
  accountDirFor,
  decodeJwtClaims,
  ensureRuntimeAccountDir,
  firstStoredAccountApiKey,
  getAdditionalGuardedAccountPaths,
  getStoredAccountEntry,
  isMultiAccountTarget,
  isValidAccountName,
  listCodexIdentities,
  listRuntimeAccounts,
  normaliseAccountName,
  parseRuntimeTarget,
  pickBalancedAccountTarget,
  probeRuntimeAccountUsage,
  registerMultiAccountRoutes,
  registerPendingAccountStub,
  removeRuntimeAccount,
  requireAccountName,
  resolveCrewlyAgentAccountModel,
  runtimeAccountSpawnEnv,
  saveRuntimeAccountApiKey,
} from './runtime-accounts-pool.mjs';

function makeTempHome(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'crewly-pool-test-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function makeFakeJwt(payload) {
  const h = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const b = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${h}.${b}.sig`;
}

test('target parsing and account name validation cover all supported runtimes', () => {
  assert.equal(normaliseAccountName('  Work_2 '), 'work_2');
  assert.equal(isValidAccountName('work-01'), true);
  assert.equal(isValidAccountName('default'), false);
  assert.equal(isValidAccountName('claude'), false);
  assert.throws(() => requireAccountName('Bad Space!'), RuntimeAccountError);

  assert.deepEqual(parseRuntimeTarget('codex-cli@acc2'), { runtime: 'codex-cli', account: 'acc2' });
  assert.deepEqual(parseRuntimeTarget('antigravity-cli'), { runtime: 'antigravity-cli' });
  assert.equal(isMultiAccountTarget('codex-cli@acc2'), true);
  assert.equal(isMultiAccountTarget('antigravity-cli@gem_1'), true);
  assert.equal(isMultiAccountTarget('crewly-agent@ds2'), true);
  assert.equal(isMultiAccountTarget('opencode-cli@foo'), false);
  assert.equal(isMultiAccountTarget('codex-cli@default'), false);
});

test('directory isolation for Codex copies safe config.toml only and never copies auth.json', (t) => {
  const root = makeTempHome(t);
  const crewlyHome = path.join(root, '.crewly');
  const homeDir = path.join(root, 'home');
  const defaultCodex = path.join(homeDir, '.codex');
  fs.mkdirSync(defaultCodex, { recursive: true });
  fs.writeFileSync(path.join(defaultCodex, 'config.toml'), 'model = "gpt-6-luna"\n', 'utf8');
  fs.writeFileSync(path.join(defaultCodex, 'auth.json'), JSON.stringify({ tokens: { id_token: makeFakeJwt({ email: 'main@example.com' }) } }), 'utf8');

  const accDir = ensureRuntimeAccountDir('codex-cli', 'acc2', { crewlyHome, homeDir, defaultEnv: {} });
  assert.equal(accDir, accountDirFor('codex-cli', 'acc2', crewlyHome));
  assert.equal(fs.existsSync(path.join(accDir, 'config.toml')), true);
  assert.equal(fs.existsSync(path.join(accDir, 'auth.json')), false, 'Must NEVER copy default auth.json into a secondary account');

  // Seed acc2 with its own ChatGPT login and verify listRuntimeAccounts extracts email safely.
  fs.writeFileSync(
    path.join(accDir, 'auth.json'),
    JSON.stringify({ auth_mode: 'chatgpt', tokens: { id_token: makeFakeJwt({ email: 'second@example.com' }), access_token: 'secret-tok' } }),
    'utf8',
  );
  const listed = listRuntimeAccounts({ crewlyHome });
  assert.equal(listed.length, 1);
  assert.equal(listed[0].target, 'codex-cli@acc2');
  assert.equal(listed[0].signedIn, true);
  assert.equal(listed[0].identity, 'second@example.com');
  assert.equal(decodeJwtClaims('invalid'), null);

  const guardedIds = getAdditionalGuardedAccountPaths(crewlyHome).map((g) => g.id);
  assert.deepEqual(guardedIds, ['runtime-accounts', 'codex-accounts', 'gemini-accounts']);
});

test('multi-account API key storage validates keys, never leaks secrets in listRuntimeAccounts, and isolates spawn env', async (t) => {
  const crewlyHome = path.join(makeTempHome(t), '.crewly');
  const fetchMock = async (url, init) => {
    const hdr = init?.headers || {};
    if (hdr['x-goog-api-key'] === 'AIzaBadKeyRejected123') return { status: 403, text: async () => 'Forbidden' };
    return { status: 200, text: async () => '{"models":[]}' };
  };

  await assert.rejects(
    () => saveRuntimeAccountApiKey({ runtime: 'antigravity-cli', name: 'bad', apiKey: 'AIzaBadKeyRejected123', crewlyHome }, { fetchFn: fetchMock }),
    (err) => err instanceof RuntimeAccountError && err.code === 'invalid_key',
  );

  // Add two Antigravity Gemini keys + one Crewly Agent DeepSeek key + one Codex OpenAI key (with seeded auth.json)
  await saveRuntimeAccountApiKey({ runtime: 'antigravity-cli', name: 'gem1', apiKey: 'AIzaValidKeyOne_11111111', crewlyHome }, { fetchFn: fetchMock });
  await saveRuntimeAccountApiKey({ runtime: 'antigravity-cli', name: 'gem2', apiKey: 'AIzaValidKeyTwo_22222222', crewlyHome }, { fetchFn: fetchMock });
  await saveRuntimeAccountApiKey(
    { runtime: 'crewly-agent', name: 'ds2', provider: 'deepseek', apiKey: 'sk-deepseek-valid-333333', crewlyHome },
    { fetchFn: fetchMock },
  );
  await saveRuntimeAccountApiKey(
    { runtime: 'codex-cli', name: 'oa1', apiKey: 'sk-openai-valid-44444444', crewlyHome },
    {
      fetchFn: fetchMock,
      seedCodexApiKeyFn: async (dir, key) => {
        fs.writeFileSync(path.join(dir, 'auth.json'), JSON.stringify({ OPENAI_API_KEY: key }), 'utf8');
      },
    },
  );
  await saveRuntimeAccountApiKey({ runtime: 'claude-code', name: 'cl1', apiKey: 'sk-ant-valid-5555555555', crewlyHome }, { fetchFn: fetchMock });

  assert.equal(firstStoredAccountApiKey('antigravity-cli', crewlyHome), 'AIzaValidKeyOne_11111111');
  assert.equal(resolveCrewlyAgentAccountModel('ds2', crewlyHome), 'deepseek/deepseek-chat');

  const safeList = listRuntimeAccounts({ crewlyHome });
  assert.equal(safeList.length, 5);
  const serialized = JSON.stringify(safeList);
  assert.equal(serialized.includes('AIzaValidKeyOne_11111111'), false);
  assert.equal(serialized.includes('sk-deepseek-valid-333333'), false);
  assert.equal(serialized.includes('sk-openai-valid-44444444'), false);
  assert.equal(serialized.includes('sk-ant-valid-5555555555'), false);

  assert.deepEqual(runtimeAccountSpawnEnv('antigravity-cli', 'gem2', { crewlyHome }), {
    GEMINI_API_KEY: 'AIzaValidKeyTwo_22222222',
    GOOGLE_GENERATIVE_AI_API_KEY: 'AIzaValidKeyTwo_22222222',
    AGY_CLI_DISABLE_AUTO_UPDATE: 'true',
  });
  assert.deepEqual(runtimeAccountSpawnEnv('crewly-agent', 'ds2', { crewlyHome }), {
    DEEPSEEK_API_KEY: 'sk-deepseek-valid-333333',
  });
  assert.deepEqual(runtimeAccountSpawnEnv('codex-cli', 'oa1', { crewlyHome }), {
    CODEX_HOME: accountDirFor('codex-cli', 'oa1', crewlyHome),
  });
  assert.deepEqual(runtimeAccountSpawnEnv('claude-code', 'cl1', { crewlyHome }), {
    CLAUDE_CONFIG_DIR: accountDirFor('claude-code', 'cl1', crewlyHome),
    CLAUDE_CODE_OAUTH_TOKEN: '',
    ANTHROPIC_API_KEY: 'sk-ant-valid-5555555555',
  });

  // Remove one account and confirm directory + entry cleanup.
  removeRuntimeAccount('codex-cli', 'oa1', { crewlyHome });
  assert.equal(getStoredAccountEntry('codex-cli', 'oa1', crewlyHome), null);
  assert.equal(fs.existsSync(accountDirFor('codex-cli', 'oa1', crewlyHome)), false);
  assert.deepEqual(listCodexIdentities(crewlyHome).filter((x) => x.target === 'codex-cli@oa1'), []);
});

test('pickBalancedAccountTarget spreads 6 AtelierX agents across healthy accounts and avoids exhausted ones', () => {
  const sessions = [
    'atelierx-team-leader-0001',
    'atelierx-tpm-0002',
    'atelierx-designer-0003',
    'atelierx-qa-0004',
    'atelierx-backend-developer-0005',
    'atelierx-frontend-developer-0006',
  ];
  const avail = [
    { runtime: 'codex-cli', selectable: true },
    { runtime: 'codex-cli@acc2', selectable: true },
    { runtime: 'codex-cli@acc3', selectable: true },
    { runtime: 'codex-cli@offline', selectable: false },
  ];

  const picks = new Map(sessions.map((s) => [s, pickBalancedAccountTarget(s, 'codex-cli', avail, {}, true)]));
  const usedTargets = new Set(picks.values());
  assert.ok(usedTargets.size >= 2, `Expected multiple Codex accounts used across 6 sessions, got: ${[...usedTargets]}`);
  assert.equal(usedTargets.has('codex-cli@offline'), false);

  // If codex-cli@acc2 becomes exhausted, agents deterministically route only to healthy targets.
  const afterOut = sessions.map((s) => pickBalancedAccountTarget(s, 'codex-cli', avail, { 'codex-cli@acc2': { runtime: 'codex-cli@acc2' } }, true));
  assert.equal(afterOut.includes('codex-cli@acc2'), false);

  // If default codex-cli is logged out and balance=false, named account still activates cleanly.
  const onlyNamedAvail = [
    { runtime: 'codex-cli', selectable: false },
    { runtime: 'codex-cli@acc2', selectable: true },
  ];
  assert.equal(pickBalancedAccountTarget(sessions[0], 'codex-cli', onlyNamedAvail, {}, false), 'codex-cli@acc2');
});

test('probeRuntimeAccountUsage detects per-account quota exhaustion independently', async (t) => {
  const crewlyHome = path.join(makeTempHome(t), '.crewly');
  const okFetch = async (url, init) => {
    const k = init?.headers?.['x-goog-api-key'] || init?.headers?.['x-api-key'];
    if (k === 'AIzaLimitedKey_99999999') return { status: 429, text: async () => 'RESOURCE_EXHAUSTED' };
    return { status: 200, text: async () => '{}' };
  };
  await saveRuntimeAccountApiKey({ runtime: 'antigravity-cli', name: 'g1', apiKey: 'AIzaLimitedKey_99999999', crewlyHome }, { fetchFn: okFetch });
  await saveRuntimeAccountApiKey({ runtime: 'antigravity-cli', name: 'g2', apiKey: 'AIzaHealthyKey_88888888', crewlyHome }, { fetchFn: okFetch });

  assert.equal(await probeRuntimeAccountUsage('antigravity-cli@g1', { crewlyHome, fetchFn: okFetch }), 'limited');
  assert.equal(await probeRuntimeAccountUsage('antigravity-cli@g2', { crewlyHome, fetchFn: okFetch }), 'available');

  ensureRuntimeAccountDir('codex-cli', 'c2', { crewlyHome });
  const codexProbe = await probeRuntimeAccountUsage('codex-cli@c2', {
    crewlyHome,
    resolve: () => '/usr/bin/codex',
    run: async (_bin, _args, opts) => {
      assert.equal(opts.env.CODEX_HOME, accountDirFor('codex-cli', 'c2', crewlyHome));
      return { code: 1, stdout: '', stderr: 'usage_limit_reached' };
    },
  });
  assert.equal(codexProbe, 'limited');
});

test('registerMultiAccountRoutes handles GET, POST api_key/broker, DELETE, and 409 active conflict', async (t) => {
  const crewlyHome = path.join(makeTempHome(t), '.crewly');
  const handlers = new Map();
  const router = {
    get: (p, fn) => handlers.set(`GET ${p}`, fn),
    post: (p, fn) => handlers.set(`POST ${p}`, fn),
    delete: (p, fn) => handlers.set(`DELETE ${p}`, fn),
  };

  let settings = { enabled: true, balanceAccounts: true, chain: ['claude-code'], memberChains: {} };
  let overrides = [];
  const clearedTargets = [];
  const loginCalls = [];

  const mockRes = () => {
    const out = { statusCode: 200, body: null };
    return {
      status(c) { out.statusCode = c; return this; },
      json(b) { out.body = b; out.sent = true; return this; },
      out,
    };
  };

  const fallbackMock = {
    invalidateAvailability() {},
    async onRuntimeAccountLogin(rt, name) {
      loginCalls.push(`${rt}@${name}`);
      settings.chain = [...settings.chain, `${rt}@${name}`];
    },
    getSettings: () => settings,
    updateSettings: (patch) => { settings = { ...settings, ...patch }; return settings; },
    snapshot: async () => ({ settings, runtimes: [], exhausted: [], overrides }),
    clearAccountState: (target) => clearedTargets.push(target),
  };

  registerMultiAccountRoutes(router, {
    ensureOwnerCaller: () => true,
    fallback: () => fallbackMock,
    buildSnapshot: async (fb) => ({ ...(await fb.snapshot()), runtimeAccounts: listRuntimeAccounts({ crewlyHome }) }),
    listAccounts: () => listRuntimeAccounts({ crewlyHome }),
    saveApiKeyAccount: (payload) => saveRuntimeAccountApiKey({ ...payload, crewlyHome }, { fetchFn: async () => ({ status: 200 }) }),
    registerBrokerStub: ({ runtime, name, authKind }) => registerPendingAccountStub({ runtime, name, authKind, crewlyHome }),
    startBrokerLogin: async (rt, method, name) => ({ id: 'sess-1', harnessId: rt, account: name, method, state: 'awaiting_user', userCode: 'ABCD-1234' }),
    removeAccount: (rt, name) => removeRuntimeAccount(rt, name, { crewlyHome }),
  });

  // 1. Add Antigravity API key account
  const resAddKey = mockRes();
  await handlers.get('POST /system/runtime-fallback/accounts')(
    { method: 'POST', path: '/system/runtime-fallback/accounts', body: { runtime: 'antigravity-cli', name: 'gem2', method: 'api_key', apiKey: 'AIzaTestRouteKey_7777777' } },
    resAddKey,
  );
  assert.equal(resAddKey.out.statusCode, 201);
  assert.equal(resAddKey.out.body.success, true);
  assert.equal(resAddKey.out.body.data.account.target, 'antigravity-cli@gem2');
  assert.deepEqual(loginCalls, ['antigravity-cli@gem2']);

  // 2. Add Codex Device Code broker account directly from web UI (no Slack)
  const resBroker = mockRes();
  await handlers.get('POST /system/runtime-fallback/accounts')(
    { method: 'POST', path: '/system/runtime-fallback/accounts', body: { runtime: 'codex-cli', name: 'acc2', method: 'device' } },
    resBroker,
  );
  assert.equal(resBroker.out.statusCode, 201);
  assert.equal(resBroker.out.body.data.loginSession.userCode, 'ABCD-1234');

  // 3. Delete blocked when agent has active override on that account
  overrides = [{ sessionName: 'atelierx-designer-0003', runtime: 'antigravity-cli@gem2' }];
  const resConflict = mockRes();
  await handlers.get('DELETE /system/runtime-fallback/accounts/:runtime/:name')(
    { params: { runtime: 'antigravity-cli', name: 'gem2' } },
    resConflict,
  );
  assert.equal(resConflict.out.statusCode, 409);

  // 4. Delete succeeds once override clears, cleaning chain and state
  overrides = [];
  const resDel = mockRes();
  await handlers.get('DELETE /system/runtime-fallback/accounts/:runtime/:name')(
    { params: { runtime: 'antigravity-cli', name: 'gem2' } },
    resDel,
  );
  assert.equal(resDel.out.statusCode, 200);
  assert.equal(settings.chain.includes('antigravity-cli@gem2'), false);
  assert.deepEqual(clearedTargets, ['antigravity-cli@gem2']);
});
