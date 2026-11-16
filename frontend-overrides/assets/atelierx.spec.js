import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Prevent auto-boot on import when running tests
globalThis.__ATELIERX_MANUAL_BOOT__ = true;

import {
  STUDIO_ZONES,
  esc,
  repairBrokenVietnamese,
  flowLabel,
  formatAgentRuntimeStatus,
  cleanTicketTitle,
  parseStructuredBrief,
  classifyWorkBucket,
  resolveDepartmentForIdentifier,
  filterStudioTasks,
  resolveTicketDepartment,
  buildDepartmentWorkloads,
  computeAgentTokenInfo,
  computeSceneBoundsAndCollisions,
  initAtelierXStudio,
} from './atelierx.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');

test('Sàn trưng bày serves a local catalog and CSP-compatible viewer', () => {
  const showcase = path.resolve(repoRoot, '../AtelierX/showcase');
  const catalog = JSON.parse(fs.readFileSync(path.join(showcase, 'catalog.json'), 'utf8'));
  assert.ok(catalog.products.length > 0);
  const product = catalog.products[0];
  assert.ok(['preview', 'complete'].includes(product.status));
  assert.ok(fs.existsSync(path.join(showcase, product.model)));
  const viewer = fs.readFileSync(path.join(showcase, product.viewer), 'utf8');
  assert.match(viewer, /\/atelierx-products\/assets\/model-viewer\.min\.js/);
  assert.match(viewer, /\/atelierx-products\/assets\/viewer\.js/);
  assert.doesNotMatch(viewer, /<script(?![^>]*\bsrc=)[^>]*>/i);
  const studio = fs.readFileSync(path.join(repoRoot, 'frontend-overrides/atelierx.html'), 'utf8');
  assert.match(studio, /id="showcase-list"/);
  assert.match(studio, /id="showcase-frame"/);
});

function parseMarkdownTicket(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  assert.ok(fmMatch, `Valid frontmatter in ${filePath}`);
  const [, fmText, body] = fmMatch;
  const ticket = { labels: [], acceptance: [], log: [] };

  for (const line of fmText.split('\n')) {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const [, key, rawVal] = m;
    const val = rawVal.trim();
    if (val === 'null' || val === '') ticket[key] = null;
    else if (val === 'true') ticket[key] = true;
    else if (val === 'false') ticket[key] = false;
    else if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim();
      ticket[key] = inner ? inner.split(',').map((s) => s.trim()) : [];
    } else {
      ticket[key] = val.replace(/^["']|["']$/g, '');
    }
  }

  const descMatch = body.match(/## Description\s+([\s\S]*?)(?=\n## |\s*$)/);
  ticket.description = descMatch ? descMatch[1].trim() : '';

  const accMatch = body.match(/## Acceptance criteria\s+([\s\S]*?)(?=\n## |\s*$)/);
  if (accMatch) {
    ticket.acceptance = accMatch[1]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('- ['))
      .map((l) => ({ done: l.startsWith('- [x]') || l.startsWith('- [X]'), text: l.slice(6).trim() }));
  }

  const logMatch = body.match(/## Log\s+([\s\S]*?)$/);
  if (logMatch) {
    ticket.log = logMatch[1]
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('- '))
      .map((l) => l.slice(2).trim());
  }

  return ticket;
}

// Lightweight deterministic DOM harness for testing initAtelierXStudio() in Node
function createStudioDomHarness() {
  const toKebab = (k) => k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
  const decodeHtml = (s) =>
    String(s)
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&times;/g, '×');

  class MockElement {
    constructor(tagName) {
      this.tagName = String(tagName || 'div').toUpperCase();
      this.attributes = new Map();
      this.children = [];
      this.parentNode = null;
      this._rawHtml = '';
      this._text = '';
      this.listeners = new Map();
      this.scrollCalls = 0;
      this.colSpan = 1;
      this.hidden = false;

      const styleStore = new Map();
      this.style = {
        cssText: '',
        color: '',
        fontWeight: '',
        textAlign: '',
        setProperty(k, v) {
          styleStore.set(k, String(v));
        },
        getPropertyValue(k) {
          return styleStore.get(k) || '';
        },
      };

      const el = this;
      this.dataset = new Proxy(
        {},
        {
          get(_, prop) {
            if (typeof prop !== 'string') return undefined;
            const attr = 'data-' + toKebab(prop);
            return el.attributes.has(attr) ? el.attributes.get(attr) : undefined;
          },
          set(_, prop, val) {
            el.setAttribute('data-' + toKebab(String(prop)), String(val));
            return true;
          },
        },
      );

      this.classList = {
        _set() {
          return new Set((el.attributes.get('class') || '').split(/\s+/).filter(Boolean));
        },
        _sync(s) {
          el.attributes.set('class', [...s].join(' '));
        },
        add(...tokens) {
          const s = this._set();
          tokens.filter(Boolean).forEach((t) => s.add(t));
          this._sync(s);
        },
        remove(...tokens) {
          const s = this._set();
          tokens.forEach((t) => s.delete(t));
          this._sync(s);
        },
        contains(token) {
          return this._set().has(token);
        },
        toggle(token, force) {
          const s = this._set();
          const next = force !== undefined ? Boolean(force) : !s.has(token);
          if (next) s.add(token);
          else s.delete(token);
          this._sync(s);
          return next;
        },
      };
    }

    get id() {
      return this.attributes.get('id') || '';
    }
    set id(v) {
      this.setAttribute('id', v);
    }

    get className() {
      return this.attributes.get('class') || '';
    }
    set className(v) {
      this.setAttribute('class', v);
    }

    setAttribute(name, value) {
      this.attributes.set(String(name), String(value));
      if (name === 'hidden') this.hidden = true;
    }
    removeAttribute(name) {
      this.attributes.delete(String(name));
      if (name === 'hidden') this.hidden = false;
    }
    getAttribute(name) {
      return this.attributes.has(String(name)) ? this.attributes.get(String(name)) : null;
    }

    get childElementCount() {
      return this.children.length;
    }

    get innerHTML() {
      if (this.children.length === 0) {
        return this._rawHtml || esc(this._text);
      }
      if (this._rawHtml) {
        // Append dynamic children added after raw HTML (e.g. inside .corridor-walkers)
        const dynamicChildren = this.children.filter((c) => !c._fromRawParse);
        const extra = dynamicChildren
          .map((c) => {
            const attrs = [...c.attributes.entries()].map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
            const tag = c.tagName.toLowerCase();
            return `<${tag}${attrs}>${c.innerHTML}</${tag}>`;
          })
          .join('');
        return this._rawHtml + extra;
      }
      return this.children
        .map((c) => {
          const attrs = [...c.attributes.entries()].map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
          const tag = c.tagName.toLowerCase();
          return `<${tag}${attrs}>${c.innerHTML}</${tag}>`;
        })
        .join('');
    }
    set innerHTML(html) {
      this.children = [];
      this._text = '';
      this._rawHtml = String(html ?? '');
      // Parse key SVG groups in #world so `.room`, `.staff`, `.corridor-walkers`, `.hud-overlays` queries work
      const groupMatches = this._rawHtml.matchAll(
        /<g\s+([^>]*class="(?:room|corridor-walkers|hud-overlays)[^"]*"[^>]*)>/g,
      );
      for (const m of groupMatches) {
        const attrText = m[1];
        const g = new MockElement('g');
        g._fromRawParse = true;
        for (const am of attrText.matchAll(/([a-zA-Z0-9_-]+)="([^"]*)"/g)) {
          g.setAttribute(am[1], am[2]);
        }
        g.parentNode = this;
        this.children.push(g);
      }
    }

    get textContent() {
      if (this.children.length === 0) {
        return this._rawHtml ? decodeHtml(this._rawHtml) : this._text;
      }
      if (this._rawHtml) {
        return decodeHtml(this._rawHtml);
      }
      return this.children.map((c) => c.textContent).join('');
    }
    set textContent(val) {
      this.children = [];
      this._rawHtml = '';
      this._text = String(val ?? '');
    }

    append(...nodes) {
      for (const n of nodes) {
        if (n instanceof MockElement) {
          n.parentNode = this;
          this.children.push(n);
        }
      }
    }

    replaceChildren(...nodes) {
      this.children = [];
      this._rawHtml = '';
      this._text = '';
      this.append(...nodes);
    }

    insertRow() {
      const tr = new MockElement('tr');
      this.append(tr);
      return tr;
    }

    insertCell() {
      const td = new MockElement('td');
      this.append(td);
      return td;
    }

    scrollIntoView() {
      this.scrollCalls += 1;
    }

    matches(selector) {
      const sel = selector.trim();
      if (sel.startsWith('#')) return this.id === sel.slice(1);
      if (sel.startsWith('.')) return this.classList.contains(sel.slice(1));
      const attrMatch = sel.match(/^\[([a-zA-Z0-9_-]+)(?:="([^"]*)")?\]$/);
      if (attrMatch) {
        const [, attr, expected] = attrMatch;
        if (!this.attributes.has(attr)) return false;
        return expected === undefined ? true : this.attributes.get(attr) === expected;
      }
      return this.tagName.toLowerCase() === sel.toLowerCase();
    }

    closest(selector) {
      let cur = this;
      while (cur) {
        if (typeof cur.matches === 'function' && cur.matches(selector)) return cur;
        cur = cur.parentNode;
      }
      return null;
    }

    querySelectorAll(selector) {
      const out = [];
      const visit = (node) => {
        for (const child of node.children) {
          if (child.matches(selector)) out.push(child);
          visit(child);
        }
      };
      visit(this);
      return out;
    }

    querySelector(selector) {
      return this.querySelectorAll(selector)[0] || null;
    }

    addEventListener(type, fn) {
      if (!this.listeners.has(type)) this.listeners.set(type, []);
      this.listeners.get(type).push(fn);
    }

    removeEventListener(type, fn) {
      const arr = this.listeners.get(type);
      if (!arr) return;
      this.listeners.set(
        type,
        arr.filter((f) => f !== fn),
      );
    }

    dispatchEvent(event) {
      const ev = {
        target: event.target || this,
        preventDefault() {
          this.defaultPrevented = true;
        },
        stopPropagation() {
          this._stopped = true;
        },
        ...event,
      };
      let cur = this;
      while (cur) {
        const handlers = cur.listeners.get(ev.type) || [];
        for (const h of [...handlers]) {
          h.call(cur, ev);
        }
        if (ev._stopped) break;
        cur = cur.parentNode;
      }
      return !ev.defaultPrevented;
    }

    click() {
      this.dispatchEvent({ type: 'click', target: this });
    }
  }

  // Construct the exact DOM tree matching atelierx.html
  const documentElement = new MockElement('html');
  documentElement.setAttribute('data-studio-theme', 'day');
  const body = new MockElement('body');
  documentElement.append(body);

  const mk = (tag, id, cls = '', attrs = {}) => {
    const e = new MockElement(tag);
    if (id) e.id = id;
    if (cls) e.className = cls;
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return e;
  };

  body.append(
    mk('div', 'kpi-active-work', 'kpi-chip kpi-active'),
    mk('div', 'kpi-queued-work', 'kpi-chip'),
    mk('div', 'kpi-done-work', 'kpi-chip'),
  );
  const tokBtn = mk('button', 'token-summary-btn');
  tokBtn.append(mk('span', 'token-summary-indicator'));
  body.append(
    tokBtn,
    mk('div', 'status'),
    mk('button', 'btn-theme-toggle'),
    mk('button', 'btn-sync-now'),
    mk('button', 'btn-toggle-links', 'hud-pill active'),
    mk('button', 'btn-toggle-callouts', 'hud-pill active'),
    mk('span', 'zoom-indicator', 'hud-pill'),
  );

  const svg = mk('svg', 'scene');
  const world = mk('g', 'world');
  svg.append(world);
  body.append(
    svg,
    mk('button', 'btn-open-token-modal'),
    mk('button', 'btn-focus-active'),
    mk('button', 'minus'),
    mk('button', 'reset'),
    mk('button', 'plus'),
    mk('button', 'btn-wide-sidebar'),
    mk('span', 'sync-badge'),
    mk('button', 'btn-sort-mode', 'tiny-btn is-active'),
    mk('button', 'btn-expand-all', 'tiny-btn'),
  );

  const filterBar = mk('div', 'dept-filter-tabs');
  for (const f of ['all', 'active', 'queued', 'done']) {
    filterBar.append(
      mk('button', '', f === 'all' ? 'dept-filter-btn active' : 'dept-filter-btn', { 'data-dept-filter': f }),
    );
  }
  body.append(
    filterBar,
    mk('section', 'active-spotlight', 'active-spotlight'),
    mk('nav', 'rooms'),
    mk('section', 'info'),
    mk('section', 'task-flow'),
  );

  const modal = mk('div', 'token-modal', 'modal-overlay');
  modal.append(
    mk('button', 'modal-close-btn', 'modal-close'),
    mk('div', 'modal-runtime-banner', 'modal-runtime-banner', { hidden: '' }),
    mk('button', '', 'modal-tab-btn active', { data_filter_placeholder: '1', 'data-filter': 'all' }),
    mk('button', '', 'modal-tab-btn', { 'data-filter': 'ok' }),
    mk('button', '', 'modal-tab-btn', { 'data-filter': 'out' }),
    mk('tbody', 'token-table-body'),
  );
  body.append(modal);

  const docListeners = new Map();
  const doc = {
    documentElement,
    body,
    createElement: (tag) => new MockElement(tag),
    createElementNS: (_, tag) => new MockElement(tag),
    querySelector: (sel) => documentElement.querySelector(sel),
    querySelectorAll: (sel) => documentElement.querySelectorAll(sel),
    getElementById: (id) => documentElement.querySelector('#' + id),
    addEventListener(type, fn) {
      if (!docListeners.has(type)) docListeners.set(type, []);
      docListeners.get(type).push(fn);
    },
    removeEventListener(type, fn) {
      const arr = docListeners.get(type) || [];
      docListeners.set(
        type,
        arr.filter((f) => f !== fn),
      );
    },
    dispatchKeyDown(key) {
      for (const fn of [...(docListeners.get('keydown') || [])]) {
        fn({ key });
      }
    },
  };

  const storage = new Map();
  const localStorageMock = {
    getItem: (k) => (storage.has(k) ? storage.get(k) : null),
    setItem: (k, v) => storage.set(k, String(v)),
    clear: () => storage.clear(),
  };

  return { doc, localStorageMock, svg, world };
}

test('STUDIO_ZONES defines 6 specialist departments plus central Sàn trưng bày', () => {
  assert.equal(STUDIO_ZONES.length, 7);
  const indices = STUDIO_ZONES.map((z) => z.index);
  assert.deepEqual(indices, [0, 1, 2, 3, 4, 5, 6]);
  assert.equal(STUDIO_ZONES[6].label, 'Sàn trưng bày');
  assert.equal(STUDIO_ZONES[6].memberName, '');
});

test('cleanTicketTitle & repairBrokenVietnamese strip repeated prefixes and repair ?-mojibake safely', () => {
  assert.equal(
    cleanTicketTitle('ATEL-8', 'ATEL-8: ATEL-8 QA retest hoodie ATEL-1 revision v2'),
    'QA retest hoodie ATEL-1 revision v2',
  );
  assert.equal(
    cleanTicketTitle('ATEL-2', '"ATEL-2 - Hoodie đen và họa tiết đầu lâu lưng v1"'),
    'Hoodie đen và họa tiết đầu lâu lưng v1',
  );
  assert.equal(
    cleanTicketTitle('ATEL-4', 'ATEL-4: Nghi?n c?u th? tr??ng, ch? th? v? b? c?c hoodie ATEL-1'),
    'Nghiên cứu thị trường, chủ thể và bố cục hoodie ATEL-1',
  );
  assert.equal(
    cleanTicketTitle('ATEL-5', 'ATEL-5: Ch?n v?t li?u s? v? m?u hoodie ATEL-1'),
    'Chọn vật liệu số và màu hoodie ATEL-1',
  );
  assert.equal(
    cleanTicketTitle('ATEL-6', 'ATEL-6: Ki?m tra m?u v1 hoodie ATEL-1'),
    'Kiểm tra mẫu v1 hoodie ATEL-1',
  );
  // Normal trailing question mark must remain untouched
  assert.equal(repairBrokenVietnamese('Bạn cần kiểm tra mẫu nào?'), 'Bạn cần kiểm tra mẫu nào?');
  assert.equal(cleanTicketTitle('ATEL-9', ''), 'ATEL-9');
  assert.equal(cleanTicketTitle('', ''), 'Công việc không tên');
});

test('parseStructuredBrief handles literal \\n, multi-line fields, and trailing Eval sentences without colons', () => {
  const raw =
    'Goal: kiểm tra bundle ATEL-2/v2 và tích hợp viewer ATEL-3/v2 cho đơn ATEL-1.\\nExpected Outcome: phiếu QA tiếng Việt gắn rõ revision v2.';
  const parsed = parseStructuredBrief(raw);
  assert.equal(parsed.goal, 'kiểm tra bundle ATEL-2/v2 và tích hợp viewer ATEL-3/v2 cho đơn ATEL-1.');
  assert.equal(parsed.outcome, 'phiếu QA tiếng Việt gắn rõ revision v2.');
  assert.equal(parsed.summary, '');

  const atel2Raw =
    'Goal: dựng asset 3D hoodie pullover đen.\nExpected outcome: GLB, texture/artwork source và test có thể tái tạo. Eval tập trung vào tính hợp lệ của asset.';
  const atel2Parsed = parseStructuredBrief(atel2Raw);
  assert.equal(atel2Parsed.goal, 'dựng asset 3D hoodie pullover đen.');
  assert.equal(atel2Parsed.outcome, 'GLB, texture/artwork source và test có thể tái tạo');

  const plain = parseStructuredBrief('Đơn từ DM Studio Lead. Kiểm tra phom hoodie.');
  assert.equal(plain.goal, '');
  assert.equal(plain.summary, 'Đơn từ DM Studio Lead. Kiểm tra phom hoodie.');
  assert.deepEqual(parseStructuredBrief(null), { goal: '', outcome: '', summary: '' });
});

test('flowLabel, classifyWorkBucket, and formatAgentRuntimeStatus handle all runtime states including cancelled', () => {
  assert.equal(flowLabel('in_progress'), 'Đang thực hiện');
  assert.equal(flowLabel('pending_assignment'), 'Chờ nhận việc');
  assert.equal(flowLabel('ready'), 'Sẵn sàng');
  assert.equal(flowLabel('to_review'), 'Chờ kiểm duyệt');
  assert.equal(flowLabel('blocked'), 'Tạm nghẽn');
  assert.equal(flowLabel('done'), 'Hoàn thành');
  assert.equal(flowLabel('verified'), 'Hoàn thành');
  assert.equal(classifyWorkBucket('to_review', ''), 'review');
  assert.equal(classifyWorkBucket('ready', 'blocked'), 'review');
  assert.equal(classifyWorkBucket('cancelled', ''), 'cancelled');
  assert.equal(classifyWorkBucket('', 'cancelled'), 'cancelled');

  assert.deepEqual(formatAgentRuntimeStatus(null), { text: 'Chưa đồng bộ', online: false });
  assert.deepEqual(formatAgentRuntimeStatus({ agentStatus: 'active', workingStatus: 'in_progress' }), {
    text: 'Trực tuyến · Đang xử lý việc',
    online: true,
  });
});

test('resolveTicketDepartment routes direct, history-unassigned, and domain tickets accurately', () => {
  assert.equal(resolveDepartmentForIdentifier('atelierx-designer-0003'), 3);
  assert.equal(resolveDepartmentForIdentifier('technical designer / qa'), 4);
  assert.equal(resolveDepartmentForIdentifier(''), -1);

  assert.deepEqual(
    resolveTicketDepartment({ id: 'ATEL-8', assignee: 'atelierx-qa-0004', labels: [], log: [] }),
    { deptIndex: 4, assignmentSource: 'direct' },
  );

  assert.deepEqual(
    resolveTicketDepartment({
      id: 'ATEL-3',
      title: 'ATEL-3: Viewer web xoay 360 hoodie ATEL-1 v2',
      status: 'ready',
      assignee: null,
      labels: ['atelierx', 'ATEL-1', 'viewer'],
      log: ['2026-11-13T13:38:41.040Z · lead · assigned to atelierx-frontend-developer-0006 — WorkItem 0a66'],
    }),
    { deptIndex: 5, assignmentSource: 'history' },
  );

  assert.deepEqual(
    resolveTicketDepartment({ id: 'ATEL-10', title: 'Ch?n v?t li?u v?i m?i', assignee: null, labels: [], log: [] }),
    { deptIndex: 2, assignmentSource: 'domain' },
  );
  assert.deepEqual(
    resolveTicketDepartment({
      id: 'ATEL-11',
      title: 'Đơn thiết kế áo khoác mới từ khách',
      source: 'owner',
      assignee: null,
      labels: [],
      log: [],
    }),
    { deptIndex: 0, assignmentSource: 'lead_fallback' },
  );
});

test('REGRESSION Bug 1 & Bug 2: parent ATEL-1 never steals child WorkItems mentioning ATEL-1, and pending_assignment WorkItems with empty session are retained', () => {
  const teamFile = path.join(repoRoot, 'seed-crewly/teams/af30c001-2789-4f20-b917-000000000010/config.json');
  const team = JSON.parse(fs.readFileSync(teamFile, 'utf8'));

  const tickets = [
    {
      id: 'ATEL-1',
      title: 'Mô phỏng áo hoodie đen có họa tiết đầu lâu ở lưng',
      status: 'in_progress',
      source: 'owner',
      assignee: 'atelierx-team-leader-0001',
      workItemId: 'stale-lead-wi',
      log: [],
    },
    {
      id: 'ATEL-3',
      title: 'ATEL-3: Viewer web xoay 360 hoodie ATEL-1 v2',
      status: 'ready',
      assignee: null,
      labels: ['viewer'],
      log: ['2026-11-13T13:38:41Z · lead · assigned to atelierx-frontend-developer-0006'],
    },
  ];

  // Raw pool from /api/in-progress-tasks:
  // 1) Active Frontend WorkItem mentioning "cho đơn ATEL-1"
  // 2) Queued QA WorkItem (`pending_assignment`) with empty projectId/teamId/assignedSessionName (as seen in h2!)
  // 3) Unrelated task from another project (must be excluded)
  const rawPool = [
    {
      id: 'wi-fe-new',
      projectId: 'af30c001-2789-4f20-b917-000000000020',
      teamId: '',
      assignedSessionName: 'atelierx-frontend-developer-0006',
      targetRole: 'frontend-developer',
      taskName: 'Goal: tích hợp trang viewer xoay 360 cho đơn ATEL-1.\\nExpected Outcome: URL viewer live.',
      status: 'active',
    },
    {
      id: 'wi-qa-queued',
      projectId: '',
      teamId: '',
      assignedSessionName: '',
      targetRole: 'qa',
      taskName: 'Goal: kiểm tra bundle ATEL-2/v2 cho đơn ATEL-1.\\nExpected Outcome: phiếu QA.',
      status: 'pending_assignment',
    },
    {
      id: 'wi-other-proj',
      projectId: 'other-project-999',
      teamId: 'other-team-999',
      assignedSessionName: 'marketing-agent-01',
      taskName: 'Write blog post',
      status: 'active',
    },
    { id: 'wi-barber', projectId: 'other-project-999', teamId: 'other-team-999', assignedSessionName: 'atelierx-designer-0003', taskName: 'BBS-5 booking', status: 'pending_assignment' },
    { id: 'wi-qa:review:blocked', projectId: '', teamId: team.id, taskName: 'Blocked: ATEL-1 QA', status: 'pending_assignment' },
    { id: 'wi-miss:review:redelivery_miss', projectId: '', teamId: team.id, taskName: 'Brief not reaching atelierx-designer-0003', status: 'pending_assignment' },
  ];

  const studioTasks = filterStudioTasks(rawPool, {
    activeProjectId: 'af30c001-2789-4f20-b917-000000000020',
    teamId: team.id,
    members: team.members,
    tickets,
  });

  assert.equal(studioTasks.length, 2, 'Retains both AtelierX tasks including pending_assignment, drops unrelated project');

  const workloads = buildDepartmentWorkloads(tickets, studioTasks, team.members);

  // ATEL-1 in Ban Điều phối MUST NOT steal wi-fe-new or wi-qa-queued!
  assert.equal(workloads.departments[0].items[0].id, 'ATEL-1');
  assert.equal(workloads.departments[0].items[0].rawTask, null);

  // wi-fe-new correlates to ATEL-3 in Ban Studio hình ảnh (dept 5), turning it active!
  assert.equal(workloads.departments[5].activeCount, 1);
  assert.equal(workloads.departments[5].items[0].id, 'ATEL-3');
  assert.equal(workloads.departments[5].items[0].rawTask?.id, 'wi-fe-new');

  // wi-qa-queued routes cleanly to Ban Kỹ thuật (dept 4) as a queued WorkItem!
  assert.equal(workloads.departments[4].queuedCount, 1);
  assert.equal(workloads.departments[4].items[0].rawTask?.id, 'wi-qa-queued');
});

test('buildDepartmentWorkloads groups real AtelierX tickets, repairs mojibake, skips boilerplate logs, and infers log blockers', () => {
  const teamFile = path.join(repoRoot, 'seed-crewly/teams/af30c001-2789-4f20-b917-000000000010/config.json');
  const team = JSON.parse(fs.readFileSync(teamFile, 'utf8'));

  const ticketsDir = path.join(repoRoot, 'AtelierX/.crewly/tickets');
  if (fs.existsSync(ticketsDir)) {
    const files = fs.readdirSync(ticketsDir).filter((f) => /^ATEL-\d+.*\.md$/.test(f));
    const tickets = files.map((f) => parseMarkdownTicket(path.join(ticketsDir, f)));

    // Even with NO live WorkItems returned by /api/in-progress-tasks, ATEL-8's log-level BLOCKED note is surfaced!
    const result = buildDepartmentWorkloads(tickets, [], team.members);

    assert.deepEqual(result.departments[0].items.map((i) => i.id), ['ATEL-1']);
    assert.deepEqual(result.departments[1].items.map((i) => i.id), ['ATEL-4']);
    assert.deepEqual(result.departments[2].items.map((i) => i.id), ['ATEL-5']);
    assert.deepEqual(result.departments[3].items.map((i) => i.id), ['ATEL-7', 'ATEL-2']);
    assert.deepEqual(result.departments[4].items.map((i) => i.id), ['ATEL-8', 'ATEL-6']);
    assert.deepEqual(result.departments[5].items.map((i) => i.id), ['ATEL-3']);

    // Verify ATEL-4, ATEL-5, ATEL-6 titles have zero broken `?` characters in UI display
    assert.doesNotMatch(result.departments[1].items[0].title, /\?/);
    assert.doesNotMatch(result.departments[2].items[0].title, /\?/);
    assert.doesNotMatch(result.departments[4].items[1].title, /\?/);

    // Verify ATEL-8 surfaces log-inferred blocker clause even when liveTasks=[]
    const atel8 = result.departments[4].items.find((i) => i.id === 'ATEL-8');
    assert.equal(atel8.hasBlocker, true);
    assert.match(atel8.blockerNote, /\bBLOCKED\b/i);

    // Verify completed ATEL-7 surfaces substantive Designer handoff note rather than `WorkItem ... verified → done`
    const atel7 = result.departments[3].items.find((i) => i.id === 'ATEL-7');
    assert.ok(atel7.latestLog);
    assert.doesNotMatch(atel7.latestLog.text, /^WorkItem\s+/);
    assert.match(atel7.latestLog.text, /ATEL-2\/v2 bundle complete/);

    assert.equal(result.totals.total, 8);
    assert.equal(result.totals.active, 2);
    assert.equal(result.totals.queued, 1);
    assert.equal(result.totals.done, 5);
  }
});

test('REGRESSION Bug 3: computeAgentTokenInfo integrates SpendCap + RuntimeFallbackService exhausted & fallback overrides', () => {
  assert.equal(computeAgentTokenInfo(6, [], null), null);

  const members = [
    {
      name: 'Studio Lead',
      sessionName: 'atelierx-team-leader-0001',
      agentId: 'atelierx-team-leader-0001',
      runtimeType: 'antigravity-cli',
      modelId: 'gpt-6-luna',
    },
    {
      name: 'Fashion Designer',
      sessionName: 'atelierx-designer-0003',
      agentId: 'atelierx-designer-0003',
      runtimeType: 'antigravity-cli',
      modelId: 'gpt-6-luna',
    },
  ];

  // Case A: Unknown / no spend cap and healthy runtime -> never falsely shows HẾT TOKEN
  const unknownTok = computeAgentTokenInfo(3, members, null, null);
  assert.equal(unknownTok.status, 'unknown');
  assert.equal(unknownTok.hasToken, true);
  assert.doesNotMatch(unknownTok.shortBadge, /HẾT/);

  // Case B: Antigravity is exhausted, Studio Lead switched to Codex (healthy fallback), Designer switched to Codex AND Codex is ALSO exhausted (matching screenshot h1!)
  const fallbackBothOut = {
    overrides: [
      { sessionName: 'atelierx-designer-0003', runtime: 'codex-cli', reason: 'Antigravity quota exceeded' },
    ],
    exhausted: [{ runtime: 'antigravity-cli' }, { runtime: 'codex-cli' }],
  };
  const exhaustedLead = computeAgentTokenInfo(0, members, { agents: [], teams: [] }, fallbackBothOut);
  assert.equal(exhaustedLead.status, 'out');
  assert.equal(exhaustedLead.hasToken, false);
  assert.match(exhaustedLead.shortBadge, /Hết quota Antigravity/);

  const exhaustedDesigner = computeAgentTokenInfo(3, members, { agents: [], teams: [] }, fallbackBothOut);
  assert.equal(exhaustedDesigner.status, 'out');
  assert.equal(exhaustedDesigner.hasToken, false);
  assert.match(exhaustedDesigner.shortBadge, /Hết quota Codex/);

  // Case C: Antigravity exhausted, Studio Lead switched to healthy fallback Codex -> warn/fallback badge (`🟠 Dự phòng Codex`)
  const fallbackHealthy = {
    overrides: [{ sessionName: 'atelierx-team-leader-0001', runtime: 'codex-cli' }],
    exhausted: [{ runtime: 'antigravity-cli' }],
  };
  const onFallbackTok = computeAgentTokenInfo(0, members, { agents: [], teams: [] }, fallbackHealthy);
  assert.equal(onFallbackTok.status, 'unlimited');
  assert.equal(onFallbackTok.hasToken, true);
  assert.equal(onFallbackTok.isRunningOnFallback, true);
  assert.equal(onFallbackTok.pillClass, 'tok-warn');
  assert.match(onFallbackTok.shortBadge, /Dự phòng Codex/);
  assert.match(onFallbackTok.model, /Antigravity → Codex/);

  // Case D: SpendCap 15% remaining -> low warning (`🟠 Còn 15%`)
  const lowTok = computeAgentTokenInfo(3, members, {
    agents: [{ session: 'atelierx-designer-0003', todayTokens: 85000, capTokens: 100000, stopped: false }],
    teams: [],
    totalCapTodayTokens: null,
    totalStopped: false,
  });
  assert.equal(lowTok.status, 'ok');
  assert.equal(lowTok.isLow, true);
  assert.equal(lowTok.pctRemaining, 15);
  assert.equal(lowTok.pillClass, 'tok-warn');
});

test('REGRESSION Bug 4: 3D Citadel geometry has ZERO SVG pill collisions, ZERO text overflows, and 100% viewBox containment', () => {
  const teamFile = path.join(repoRoot, 'seed-crewly/teams/af30c001-2789-4f20-b917-000000000010/config.json');
  const team = JSON.parse(fs.readFileSync(teamFile, 'utf8'));
  const ticketsDir = path.join(repoRoot, 'AtelierX/.crewly/tickets');
  const tickets = fs.existsSync(ticketsDir)
    ? fs
        .readdirSync(ticketsDir)
        .filter((f) => /^ATEL-\d+.*\.md$/.test(f))
        .map((f) => parseMarkdownTicket(path.join(ticketsDir, f)))
    : [];

  const workloads = buildDepartmentWorkloads(tickets, [], team.members);
  const worstCaseFallback = {
    overrides: [{ sessionName: 'atelierx-team-leader-0001', runtime: 'codex-cli' }],
    exhausted: [{ runtime: 'antigravity-cli' }],
  };

  const audit = computeSceneBoundsAndCollisions(workloads, team.members, { agents: [], teams: [] }, worstCaseFallback, {
    showCallouts: true,
  });

  assert.equal(audit.collisions.length, 0, `Expected 0 pill overlaps, got: ${JSON.stringify(audit.collisions)}`);
  assert.equal(audit.overflows.length, 0, `Expected 0 pill text overflows, got: ${JSON.stringify(audit.overflows)}`);
  assert.equal(
    audit.fitsInViewBox,
    true,
    `Expected full scene inside viewBox ${JSON.stringify(audit.viewBox)}, got bounds ${JSON.stringify(audit.bounds)}`,
  );
  // Also ensure >= 40px top/bottom clearance from floating HUD bars
  assert.ok(audit.bounds.minY >= audit.viewBox.y1 + 38, `Top pill too close to top HUD: ${audit.bounds.minY}`);
  assert.ok(audit.bounds.maxY <= audit.viewBox.y2 - 38, `Bottom element too close to bottom HUD: ${audit.bounds.maxY}`);
});

test('initAtelierXStudio end-to-end DOM controller: priority sorting, z-order, runtime-fallback modal, filters, XSS & offline fallback', async () => {
  const { doc, localStorageMock, svg, world } = createStudioDomHarness();
  const prevDoc = globalThis.document;
  const prevStorage = globalThis.localStorage;
  const prevFetch = globalThis.fetch;

  const teamFile = path.join(repoRoot, 'seed-crewly/teams/af30c001-2789-4f20-b917-000000000010/config.json');
  const team = JSON.parse(fs.readFileSync(teamFile, 'utf8'));
  team.members = team.members.map((m, idx) => ({
    ...m,
    agentStatus: idx < 4 ? 'active' : 'inactive',
    workingStatus: idx === 4 ? 'in_progress' : 'idle',
  }));

  const mockTickets = [
    {
      id: 'ATEL-1',
      title: 'Đơn tổng hợp áo hoodie <img src=x onerror="alert(1)">',
      status: 'ready',
      priority: 'P1',
      assignee: 'atelierx-team-leader-0001',
      description: 'Goal: điều phối đơn tổng.\\nExpected Outcome: bàn giao mẫu 3D.',
      acceptance: [{ done: true, text: 'A' }, { done: false, text: 'B' }],
      log: ['2026-11-13T12:00:00Z · lead · Đã mở đơn thiết kế'],
    },
    {
      id: 'ATEL-8',
      title: 'ATEL-8: Kiểm định GLB v2',
      status: 'in_progress',
      priority: 'P2',
      assignee: 'atelierx-qa-0004',
      workItemId: 'wi-qa-8',
      description: 'Goal: kiểm tra mesh v2.\\nExpected Outcome: báo cáo QA.',
      acceptance: [{ done: false, text: 'Check UV' }],
      log: ['2026-11-13T13:50:00Z · qa · Static QA passed, waiting browser'],
    },
    {
      id: 'ATEL-3',
      title: 'ATEL-3: Viewer web xoay 360',
      status: 'ready',
      priority: 'P2',
      assignee: null,
      labels: ['viewer'],
      log: ['2026-11-13T13:38:00Z · lead · assigned to atelierx-frontend-developer-0006 — WorkItem 0a66'],
    },
    { id: 'ATEL-2', title: 'Hoodie v1', status: 'done', assignee: 'atelierx-designer-0003', updatedAt: '2026-11-13T12:10:00Z' },
    { id: 'ATEL-7', title: 'Hoodie v2', status: 'done', assignee: 'atelierx-designer-0003', updatedAt: '2026-11-13T12:20:00Z' },
    { id: 'ATEL-9', title: 'Hoodie v3', status: 'done', assignee: 'atelierx-designer-0003', updatedAt: '2026-11-13T12:30:00Z' },
  ];

  let shouldFailFetch = false;
  globalThis.document = doc;
  globalThis.localStorage = localStorageMock;
  globalThis.fetch = async (url) => {
    if (shouldFailFetch) throw new Error('network down');
    const u = String(url);
    if (u.startsWith('/api/teams')) {
      return { ok: true, json: async () => ({ data: { teams: [team] } }) };
    }
    if (u.startsWith('/api/project-tickets/')) {
      return { ok: true, json: async () => ({ data: { tickets: mockTickets } }) };
    }
    if (u.startsWith('/api/in-progress-tasks')) {
      return {
        ok: true,
        json: async () => ({
          tasks: [
            {
              id: 'wi-qa-8',
              projectId: 'af30c001-2789-4f20-b917-000000000020',
              taskName: 'ATEL-8: Kiểm định GLB v2',
              assignedSessionName: 'atelierx-qa-0004',
              status: 'blocked',
              blockReason: 'Browser relay offline',
            },
          ],
        }),
      };
    }
    if (u.startsWith('/api/system/usage/caps')) {
      return {
        ok: true,
        json: async () => ({
          data: {
            agents: [{ session: 'atelierx-qa-0004', todayTokens: 20000, capTokens: 100000, stopped: false }],
            teams: [],
            totalCapTodayTokens: null,
            totalStopped: false,
          },
        }),
      };
    }
    if (u.startsWith('/api/system/runtime-fallback')) {
      return {
        ok: true,
        json: async () => ({
          data: {
            overrides: [
              { sessionName: 'atelierx-frontend-developer-0006', runtime: 'antigravity-cli', reason: 'quota' },
            ],
            exhausted: [{ runtime: 'antigravity-cli' }],
          },
        }),
      };
    }
    return { ok: false, json: async () => ({}) };
  };

  let controller = null;
  try {
    controller = initAtelierXStudio();
    assert.ok(controller);
    await controller.sync();

    // 1. Verify SVG world rendered cleanly with zero NaN/undefined, Catwalk badge, and proper Z-order (.staff BEFORE .hud-overlays!)
    const worldMarkup = world.innerHTML;
    assert.doesNotMatch(worldMarkup, /\bNaN\b/);
    assert.doesNotMatch(worldMarkup, /\bundefined\b/);
    assert.match(worldMarkup, /CATWALK TRUNG TÂM/);
    assert.equal(
      (worldMarkup.match(/class="room staff"/g) || []).length,
      6,
      'All 6 specialist staff figures rendered inside pavilions',
    );
    const lastStaffIdx = worldMarkup.lastIndexOf('class="room staff"');
    const hudIdx = worldMarkup.indexOf('class="hud-overlays"');
    assert.ok(lastStaffIdx > 0 && hudIdx > lastStaffIdx, 'HUD overlays must render AFTER all staff figures in SVG z-order');

    // 2. Verify Priority Department Sorting puts active Dept 4 (Kỹ thuật) FIRST in #rooms by default, and #btn-sort-mode toggles canonical order
    const firstDeptCard = doc.getElementById('rooms').children[0];
    assert.equal(firstDeptCard.dataset.deptIndex, '4', 'Active Ban Kỹ thuật sorted to top of sidebar by default');
    doc.getElementById('btn-sort-mode').click();
    assert.equal(doc.getElementById('rooms').children[0].dataset.deptIndex, '0', 'Canonical order starts with Dept 0');
    doc.getElementById('btn-sort-mode').click();
    assert.equal(doc.getElementById('rooms').children[0].dataset.deptIndex, '4', 'Priority order restored');

    // 3. Verify initial auto-select jumped to Dept 4 (Kỹ thuật), and manual selection of Dept 0 is preserved across sync()
    assert.equal(doc.querySelector('.is-selected').dataset.deptIndex, '4');
    controller.selectDepartment(0, true);
    assert.equal(doc.querySelector('.is-selected').dataset.deptIndex, '0');
    await controller.sync();
    assert.equal(doc.querySelector('.is-selected').dataset.deptIndex, '0', 'Periodic sync must not hijack manual user selection');

    // 4. Verify XSS neutralization in rendered HTML
    const roomsHtml = doc.getElementById('rooms').innerHTML;
    assert.doesNotMatch(roomsHtml, /<img\b/i, 'XSS payload must be escaped, never parsed as raw HTML tag');
    assert.match(roomsHtml, /&lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;/);

    // 5. Verify "+ Xem thêm 1 việc đã hoàn thành" button on Dept 3
    const dept3Card = doc.querySelector('[data-dept-index="3"]');
    const moreBtn = dept3Card.querySelector('.more-done-btn');
    assert.ok(moreBtn, 'Unselected department with 3 done tasks shows "+ Xem thêm" button');
    assert.match(moreBtn.textContent, /Xem thêm 1 việc/);
    moreBtn.click();
    const dept3AfterExpand = doc.querySelector('[data-dept-index="3"]');
    assert.equal(dept3AfterExpand.querySelectorAll('.dept-task-card').length, 3);

    // 6. Verify Sàn trưng bày (index 6) interactive 6-stage pipeline buttons
    controller.selectDepartment(6, true);
    const runwayCard = doc.querySelector('[data-dept-index="6"]');
    assert.ok(runwayCard);
    assert.equal(runwayCard.scrollCalls, 1);
    const pipeButtons = runwayCard.querySelectorAll('.pipeline-step');
    assert.equal(pipeButtons.length, 6);
    pipeButtons[0].click(); // stageOrder[0] === Dept 1 (Nghiên cứu)
    assert.equal(doc.querySelector('.is-selected').dataset.deptIndex, '1');

    // 7. Verify Spotlight item click focuses active Dept 4
    const spotlightBtn = doc.getElementById('active-spotlight').querySelector('.spotlight-item');
    assert.ok(spotlightBtn);
    spotlightBtn.click();
    assert.equal(doc.querySelector('.is-selected').dataset.deptIndex, '4');

    // 8. Verify Department Filter tabs (`active`, `queued`, `done`, `all`)
    const filterButtons = doc.querySelectorAll('[data-dept-filter]');
    filterButtons.find((b) => b.dataset.deptFilter === 'active').click();
    assert.equal(doc.getElementById('rooms').children.length, 1);
    filterButtons.find((b) => b.dataset.deptFilter === 'queued').click();
    assert.equal(doc.getElementById('rooms').children.length, 2);
    filterButtons.find((b) => b.dataset.deptFilter === 'all').click();
    assert.equal(doc.getElementById('rooms').children.length, 7);

    // 9. Verify Day <-> Night Runway Theme toggle & Wide Sidebar toggle & Zoom controls
    doc.getElementById('btn-theme-toggle').click();
    assert.equal(doc.documentElement.getAttribute('data-studio-theme'), 'night');
    assert.equal(localStorageMock.getItem('atelierx_studio_theme'), 'night');
    assert.doesNotMatch(world.innerHTML, /\bNaN\b/);

    doc.getElementById('btn-wide-sidebar').click();
    assert.equal(doc.body.classList.contains('sidebar-wide'), true);

    doc.getElementById('plus').click();
    assert.notEqual(svg.getAttribute('viewBox'), '-660 -450 1320 880');
    doc.getElementById('reset').click();
    assert.equal(svg.getAttribute('viewBox'), '-660 -450 1320 880');
    assert.match(doc.getElementById('zoom-indicator').textContent, /100%/);

    // 10. Verify Token Quota Modal + Runtime Fallback Banner (`antigravity-cli` exhausted -> Nhi marked `out`)
    doc.getElementById('token-summary-btn').click();
    const modal = doc.getElementById('token-modal');
    assert.equal(modal.classList.contains('open'), true);
    const rtBanner = doc.getElementById('modal-runtime-banner');
    assert.equal(rtBanner.hidden, false);
    assert.match(rtBanner.textContent, /Antigravity/);

    const tbody = doc.getElementById('token-table-body');
    assert.equal(tbody.children.length, 6);
    const modalTabs = doc.querySelectorAll('.modal-tab-btn');
    modalTabs.find((b) => b.dataset.filter === 'out').click();
    assert.equal(tbody.children.length, 1, 'Nhi running on exhausted Antigravity override appears under out filter');
    modalTabs.find((b) => b.dataset.filter === 'ok').click();
    assert.equal(tbody.children.length, 5);

    doc.dispatchKeyDown('Escape');
    assert.equal(modal.classList.contains('open'), false);

    // 11. Verify offline / network failure fallback
    shouldFailFetch = true;
    await controller.sync();
    assert.match(doc.getElementById('status').textContent, /Chế độ độc lập/);
  } finally {
    if (controller) controller.destroy();
    globalThis.document = prevDoc;
    globalThis.localStorage = prevStorage;
    globalThis.fetch = prevFetch;
  }
});

test('REGRESSION Bug 5 + CSP, DOM ID contract, font asset existence, LF bundle cleanliness & empty-board guard', () => {
  assert.equal(esc('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');

  const html = fs.readFileSync(path.join(repoRoot, 'frontend-overrides/atelierx.html'), 'utf8');
  const jsSource = fs.readFileSync(path.join(repoRoot, 'frontend-overrides/assets/atelierx.js'), 'utf8');

  const scriptTags = html.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || [];
  assert.equal(scriptTags.length, 1, 'Exactly one external module script tag');
  assert.match(scriptTags[0], /src="\/assets\/atelierx\.js\?v=20261114v8"/);
  assert.doesNotMatch(html, /\son[a-z]+\s*=/i, 'No inline event handlers in HTML');

  // Verify every ID queried by atelierx.js exists in atelierx.html
  const htmlIds = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  const jsQueriedIds = [
    ...[...jsSource.matchAll(/getElementById\('([^']+)'\)/g)].map((m) => m[1]),
    ...[...jsSource.matchAll(/querySelector\('#([a-zA-Z0-9_-]+)'\)/g)].map((m) => m[1]),
  ];
  assert.ok(jsQueriedIds.length >= 26, 'Expected >=26 queried DOM IDs');
  for (const id of jsQueriedIds) {
    assert.ok(htmlIds.has(id), `atelierx.html must contain id="${id}" queried by atelierx.js`);
  }

  // Verify every self-hosted font URL in atelierx.html exists in frontend-overrides/assets/
  const fontUrls = [...html.matchAll(/url\("\/assets\/([^"]+)"\)/g)].map((m) => m[1]);
  assert.equal(fontUrls.length, 24, '12 @font-face rules * 2 formats (woff2 + woff)');
  for (const fontFile of fontUrls) {
    const fullPath = path.join(repoRoot, 'frontend-overrides/assets', fontFile);
    assert.ok(fs.existsSync(fullPath), `Font file missing: ${fontFile}`);
  }

  // Verify index.html points to ?v=20261113v4, both index-05f23a33.js copies match byte-for-byte, have ZERO \r, and guard ganttView!==2
  const indexHtml = fs.readFileSync(path.join(repoRoot, 'frontend-overrides/index.html'), 'utf8');
  assert.match(indexHtml, /\/assets\/index-05f23a33\.js\?v=20261113v4/);

  const rootBundle = fs.readFileSync(path.join(repoRoot, 'frontend-overrides/index-05f23a33.js'), 'utf8');
  const assetsBundle = fs.readFileSync(path.join(repoRoot, 'frontend-overrides/assets/index-05f23a33.js'), 'utf8');
  assert.equal(rootBundle, assetsBundle, 'Both copies of index-05f23a33.js must stay identical');
  assert.equal(assetsBundle.includes('\r'), false, 'Bundle must preserve pure LF line endings (zero CRLF noise)');
  assert.match(assetsBundle, /J\?pe&&ganttView!==2\?/, 'AtelierX Studio tab must render even when project has 0 tickets');
  assert.match(assetsBundle, /ce&&ke\.length===0&&ganttView!==2&&/, 'Empty ticket filter must not hide AtelierX Studio tab');
  assert.match(assetsBundle, /height:"calc\(100dvh - 190px\)",minHeight:"520px"/, 'Responsive iframe height avoids laptop double scrollbars');
  assert.match(assetsBundle, /\/atelierx\.html\?v=20261113v4/);
});
