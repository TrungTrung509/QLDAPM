// AtelierX Grand Citadel 3D — Monumental Isometric Studio & Department-Centric Task Engine

export const STUDIO_ZONES = [
  {
    index: 0,
    label: 'Điều phối',
    staffName: 'Minh',
    memberName: 'Studio Lead',
    agentId: 'atelierx-team-leader-0001',
    memberId: 'af30c001-2789-4f20-b917-000000000001',
    roleKey: 'team-leader',
    icon: '👑',
    duty: 'Điều phối đơn hàng, phân việc song song & duyệt bàn giao cuối',
    x: -240,
    y: -240,
    h: 46,
    color: '#C98A4B',
    kind: 'desk',
  },
  {
    index: 1,
    label: 'Nghiên cứu',
    staffName: 'An',
    memberName: 'Market & Trend Researcher',
    agentId: 'atelierx-tpm-0002',
    memberId: 'af30c001-2789-4f20-b917-000000000002',
    roleKey: 'tpm',
    icon: '🔍',
    duty: 'Nghiên cứu thị trường, chủ thể minh họa, bố cục & bảng màu',
    x: -290,
    y: 20,
    h: 32,
    color: '#3E9BA9',
    kind: 'board',
  },
  {
    index: 2,
    label: 'Vật liệu',
    staffName: 'Linh',
    memberName: 'Merchandiser / Material Specialist',
    agentId: 'atelierx-backend-developer-0005',
    memberId: 'af30c001-2789-4f20-b917-000000000005',
    roleKey: 'backend-developer',
    icon: '🧵',
    duty: 'Đặc tả chất liệu số PBR, màu vải, độ nhám & vùng in',
    x: 20,
    y: -290,
    h: 32,
    color: '#6E9A63',
    kind: 'fabric',
  },
  {
    index: 3,
    label: 'Thiết kế',
    staffName: 'Vy',
    memberName: 'Fashion Designer',
    agentId: 'atelierx-designer-0003',
    memberId: 'af30c001-2789-4f20-b917-000000000003',
    roleKey: 'designer',
    icon: '🎨',
    duty: 'Dựng phom áo 3D, thiết kế artwork, UV placement & xuất GLB',
    x: -20,
    y: 290,
    h: 20,
    color: '#CA7279',
    kind: 'sketch',
  },
  {
    index: 4,
    label: 'Kỹ thuật',
    staffName: 'Khoa',
    memberName: 'Technical Designer / QA',
    agentId: 'atelierx-qa-0004',
    memberId: 'af30c001-2789-4f20-b917-000000000004',
    roleKey: 'qa',
    icon: '📐',
    duty: 'Kiểm định hình học GLB, mặt in, hướng artwork & QA Viewer thực tế',
    x: 290,
    y: -20,
    h: 20,
    color: '#5C7EB8',
    kind: 'cut',
  },
  {
    index: 5,
    label: 'Studio hình ảnh',
    staffName: 'Nhi',
    memberName: 'Brand & Commerce / Visual Studio',
    agentId: 'atelierx-frontend-developer-0006',
    memberId: 'af30c001-2789-4f20-b917-000000000006',
    roleKey: 'frontend-developer',
    icon: '📸',
    duty: 'Tích hợp Web Viewer xoay 360°, camera orbit, ánh sáng & trình diễn',
    x: 255,
    y: 255,
    h: 14,
    color: '#8D70B5',
    kind: 'photo',
  },
  {
    index: 6,
    label: 'Sàn trưng bày',
    staffName: 'Runway',
    memberName: '',
    agentId: null,
    memberId: null,
    roleKey: 'runway',
    icon: '✨',
    duty: 'Sàn Catwalk trung tâm trưng bày mẫu 3D & theo dõi dây chuyền 6 chặng',
    x: 0,
    y: 0,
    h: 24,
    color: '#3D8F7D',
    kind: 'runway',
  },
];

const DEFAULT_TEAM_ID = 'af30c001-2789-4f20-b917-000000000010';
const DEFAULT_PROJECT_ID = 'af30c001-2789-4f20-b917-000000000020';
const DEFAULT_VIEW_W = 1320;
const DEFAULT_VIEW_H = 880;
const DEFAULT_CX = 0;
const DEFAULT_CY = -10;
const DYES = ['#d96b62', '#efc66b', '#4d9299', '#8a82b5', '#f3ede0', '#63a375'];

// Dedicated open-floor standing coordinates per specialist pavilion (never colliding with furniture)
const STAFF_AISLE_OFFSETS = [
  [-8, 22],  // 0 Điều phối: open carpet in front of executive desk, left of holo-table
  [-48, 24], // 1 Nghiên cứu: open aisle left of round collaboration table
  [-4, 34],  // 2 Vật liệu: open inspection aisle between PBR scanner and fabric rolls
  [26, 28],  // 3 Thiết kế: open studio floor beside prototype hoodie mannequin
  [26, 26],  // 4 Kỹ thuật: open QA floor beside laser turntable
  [-28, 26], // 5 Studio hình ảnh: open director aisle beside camera tripod
];

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const MOJIBAKE_PHRASE_PAIRS = [
  [/nghi\?n\s+c\?u\s+y\?u\s+c\?u/gi, 'nghiên cứu yêu cầu'],
  [/nghi\?n\s+c\?u/gi, 'nghiên cứu'],
  [/y\?u\s+c\?u/gi, 'yêu cầu'],
  [/ph\?n\s+t\?ch\s+brief\s+\?o\s+hoodie\s+\?en/gi, 'phân tích brief áo hoodie đen'],
  [/ph\?n\s+t\?ch/gi, 'phân tích'],
  [/\?o\s+hoodie\s+\?en/gi, 'áo hoodie đen'],
  [/hoodie\s+\?en/gi, 'hoodie đen'],
  [/th\?\s+tr\?\?ng/gi, 'thị trường'],
  [/ch\?\s+th\?\s+v\?\s+b\?\s+c\?c/gi, 'chủ thể và bố cục'],
  [/ch\?\s+th\?/gi, 'chủ thể'],
  [/\?\?a\s+b\?\s+c\?c,\s*t\?\s+l\?,\s*phong\s+c\?ch\s+v\?\s+ti\?u\s+ch\?\s+nh\?n\s+di\?n/gi, 'đưa bố cục, tỉ lệ, phong cách và tiêu chí nhận diện'],
  [/b\?\s+c\?c/gi, 'bố cục'],
  [/t\?\s+l\?/gi, 'tỉ lệ'],
  [/phong\s+c\?ch/gi, 'phong cách'],
  [/ti\?u\s+ch\?\s+nh\?n\s+di\?n/gi, 'tiêu chí nhận diện'],
  [/ch\?n\s+v\?t\s+li\?u\s+s\?\s+v\?\s+m\?u/gi, 'chọn vật liệu số và màu'],
  [/ch\?n\s+v\?t\s+li\?u\s+s\?/gi, 'chọn vật liệu số'],
  [/ch\?n\s+v\?t\s+li\?u/gi, 'chọn vật liệu'],
  [/v\?t\s+li\?u\s+v\?i\s+m\?i/gi, 'vật liệu vải mới'],
  [/v\?t\s+li\?u\s+s\?/gi, 'vật liệu số'],
  [/v\?t\s+li\?u/gi, 'vật liệu'],
  [/s\?\s+v\?\s+m\?u/gi, 'số và màu'],
  [/m\?u\s+h\?nh\s+\?\?u\s+l\?u/gi, 'màu hình đầu lâu'],
  [/th\?ng\s+s\?\s+b\?\s+m\?t\s+v\?\s+v\?ng\s+in\s+kh\?\s+d\?ng/gi, 'thông số bề mặt và vùng in khả dụng'],
  [/ki\?m\s+t\?\?ng\s+th\?ch\s+v\?i\s+m\?u/gi, 'kiểm tương thích với mẫu'],
  [/b\?o\s+asset\s+thi\?u/gi, 'báo asset thiếu'],
  [/m\?u\s+v\?i/gi, 'màu vải'],
  [/ki\?m\s+tra\s+m\?u/gi, 'kiểm tra mẫu'],
  [/ki\?m\s+b\?n\s+d\?ng/gi, 'kiểm bản dựng'],
  [/\?\?ng\s+phom/gi, 'đúng phom'],
  [/\?\?u\s+l\?u\s+\?\?ng\s+m\?t\s+l\?ng/gi, 'đầu lâu đúng mặt lưng'],
  [/h\?a\s+ti\?t\s+\?\?u\s+l\?u\s+\?\s+l\?ng/gi, 'họa tiết đầu lâu ở lưng'],
  [/kh\?ng\s+b\?\s+l\?t\/c\?t,\s*xoay\s+\?\?\?c/gi, 'không bị lật/cắt, xoay được'],
  [/b\?o\s+l\?i\s+c\?\s+th\?\s+ho\?c\s+\?\?t/gi, 'báo lỗi cụ thể hoặc đạt'],
  [/c\?\s+k\?t\s+qu\?\s+c\?\s+th\?\s+g\?n/gi, 'có kết quả cụ thể gắn'],
  [/b\?n\s+giao\s+b\?ng\s+ti\?ng\s+vi\?t/gi, 'bàn giao bằng tiếng Việt'],
  [/b\?n\s+giao/gi, 'bàn giao'],
  [/ki\?m\s+tra/gi, 'kiểm tra'],
  [/ki\?m\s+d\?nh/gi, 'kiểm định'],
  [/ki\?m\s+duy\?t/gi, 'kiểm duyệt'],
  [/h\?a\s+ti\?t/gi, 'họa tiết'],
  [/(?:\?\?u|[dđ]\?u)\s+l\?u/gi, 'đầu lâu'],
  [/thi\?t\s+k\?/gi, 'thiết kế'],
  [/k\?\s+thu\?t/gi, 'kỹ thuật'],
  [/h\?nh\s+\?nh/gi, 'hình ảnh'],
  [/d\?ng\s+m\?u/gi, 'dựng mẫu'],
  [/(?<=\s)v\?(?=\s+[a-zA-ZÀ-ỹ0-9])/gi, 'và'],
];

function matchInitialCase(source, replacement) {
  if (!source || !replacement) return replacement;
  if (source === source.toUpperCase() && source !== source.toLowerCase()) {
    return replacement.toUpperCase();
  }
  const first = source[0];
  if (first === first.toUpperCase() && first !== first.toLowerCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

export function repairBrokenVietnamese(input) {
  const str = String(input ?? '');
  if (!str.includes('?')) return str;
  let out = str;
  for (const [pattern, target] of MOJIBAKE_PHRASE_PAIRS) {
    out = out.replace(pattern, (matched) => matchInitialCase(matched, target));
  }
  return out;
}

export function flowLabel(status) {
  const map = {
    in_progress: 'Đang thực hiện',
    active: 'Đang thực hiện',
    running: 'Đang chạy',
    working: 'Đang làm việc',
    assigned: 'Đã giao việc',
    ready: 'Sẵn sàng',
    backlog: 'Chờ phân công',
    queued: 'Đang chờ nhận',
    pending_assignment: 'Chờ nhận việc',
    to_review: 'Chờ kiểm duyệt',
    review: 'Chờ duyệt',
    verifying: 'Đang nghiệm thu',
    submitted: 'Đã nộp kết quả',
    input_required: 'Cần phản hồi',
    blocked: 'Tạm nghẽn',
    failed: 'Báo lỗi',
    rejected: 'Cần làm lại',
    done: 'Hoàn thành',
    completed: 'Hoàn thành',
    verified: 'Hoàn thành',
    done_by_worker: 'Hoàn thành',
    cancelled: 'Đã hủy',
  };
  return map[status] || status || 'Chưa rõ';
}

export function formatAgentRuntimeStatus(member) {
  if (!member) return { text: 'Chưa đồng bộ', online: false };
  const aMap = {
    active: 'Trực tuyến',
    started: 'Đã khởi chạy',
    starting: 'Đang khởi động',
    activating: 'Đang kích hoạt',
    idle: 'Sẵn sàng',
    suspended: 'Tạm dừng',
    inactive: 'Tạm nghỉ',
  };
  const wMap = {
    in_progress: 'Đang xử lý việc',
    working: 'Đang xử lý việc',
    idle: 'Rảnh',
  };
  const isOnline = member.agentStatus === 'active' || member.agentStatus === 'started';
  const aTxt = aMap[member.agentStatus] || member.agentStatus || 'Chưa rõ';
  const wTxt = wMap[member.workingStatus] || member.workingStatus || '';
  return {
    text: wTxt ? `${aTxt} · ${wTxt}` : aTxt,
    online: isOnline,
  };
}

export function cleanTicketTitle(id, rawTitle) {
  const raw = repairBrokenVietnamese(String(rawTitle ?? ''))
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!raw) return id || 'Công việc không tên';
  if (!id) return raw;
  const escapedId = String(id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const stripped = raw
    .replace(new RegExp(`^(?:["']?${escapedId}\\s*[:·\\-–—]?\\s*)+`, 'i'), '')
    .replace(/^["']|["']$/g, '')
    .trim();
  return stripped || raw;
}

export function parseStructuredBrief(rawText) {
  if (!rawText) return { goal: '', outcome: '', summary: '' };
  const normalized = repairBrokenVietnamese(String(rawText))
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .trim();

  const collapse = (s) => s.replace(/\s+/g, ' ').trim();
  const goalMatch = normalized.match(
    /(?:^|\n|\.\s*)(?:Goal|Mục tiêu)\s*:\s*([\s\S]+?)(?=(?:\s+(?:Expected [Oo]utcome|Eval Criteria|Kỳ vọng|Đầu ra)\s*:)|(?:\.\s+Eval\b)|\n\s*\n|$)/i,
  );
  const outcomeMatch = normalized.match(
    /(?:^|\n|\.\s*)(?:Expected [Oo]utcome|Kỳ vọng|Đầu ra)\s*:\s*([\s\S]+?)(?=(?:\s+(?:Eval Criteria|Eval)\s*:)|(?:\.\s+Eval\b)|\n\s*\n|$)/i,
  );

  const lines = normalized
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const plainSummary = lines[0] || '';
  return {
    goal: goalMatch ? collapse(goalMatch[1]) : '',
    outcome: outcomeMatch ? collapse(outcomeMatch[1]) : '',
    summary: !goalMatch && !outcomeMatch ? plainSummary : '',
  };
}

export function classifyWorkBucket(ticketStatus, liveTaskStatus) {
  const s = String(ticketStatus || '').toLowerCase();
  const ls = String(liveTaskStatus || '').toLowerCase();

  if (s === 'cancelled' || (!s && ls === 'cancelled')) return 'cancelled';
  if (['done', 'completed', 'verified', 'done_by_worker'].includes(s)) return 'done';
  if (['to_review', 'review', 'verifying', 'blocked', 'failed', 'rejected', 'input_required'].includes(s)) {
    return 'review';
  }
  if (s === 'in_progress' || ['active', 'running', 'in_progress', 'working', 'assigned'].includes(ls)) {
    return 'active';
  }
  if (['blocked', 'failed', 'input_required'].includes(ls)) return 'review';
  if (!s && ['done', 'completed', 'verified'].includes(ls)) {
    return 'done';
  }
  return 'queued';
}

export function resolveDepartmentForIdentifier(identifier, members = []) {
  const needle = String(identifier || '').trim();
  if (!needle) return -1;
  const lower = needle.toLowerCase();

  for (let i = 0; i < 6; i++) {
    const zone = STUDIO_ZONES[i];
    const mem = members.find(
      (m) =>
        m.name === zone.memberName ||
        m.id === zone.memberId ||
        m.agentId === zone.agentId ||
        m.role === zone.roleKey,
    );
    const candidates = [
      zone.agentId,
      zone.memberId,
      zone.memberName,
      zone.roleKey,
      zone.label,
      zone.staffName,
      mem?.id,
      mem?.agentId,
      mem?.sessionName,
      mem?.name,
      mem?.role,
    ]
      .filter(Boolean)
      .map((v) => String(v).toLowerCase());

    if (candidates.includes(lower)) return i;
  }

  if (lower.includes('team-leader') || lower.includes('studio lead')) return 0;
  if (lower.includes('tpm') || lower.includes('researcher')) return 1;
  if (lower.includes('backend') || lower.includes('material') || lower.includes('merchandiser')) return 2;
  if (lower.includes('designer') && !lower.includes('technical')) return 3;
  if (lower.includes('qa') || lower.includes('technical designer')) return 4;
  if (lower.includes('frontend') || lower.includes('visual studio')) return 5;

  return -1;
}

function resolveWorkItemDepartment(task, members = []) {
  if (!task) return -1;
  let idx = resolveDepartmentForIdentifier(task.assignedSessionName, members);
  if (idx < 0) idx = resolveDepartmentForIdentifier(task.assignedTeamMemberId, members);
  if (idx < 0) idx = resolveDepartmentForIdentifier(task.targetRole, members);
  return idx;
}

export function filterStudioTasks(allTasks = [], { activeProjectId = DEFAULT_PROJECT_ID, teamId = DEFAULT_TEAM_ID, members = [], tickets = [] } = {}) {
  if (!Array.isArray(allTasks)) return [];
  const ticketWorkItemIds = new Set(
    (Array.isArray(tickets) ? tickets : []).map((tk) => tk && tk.workItemId).filter(Boolean),
  );
  const knownTicketIds = (Array.isArray(tickets) ? tickets : [])
    .map((tk) => (tk && tk.id ? String(tk.id).toUpperCase() : ''))
    .filter(Boolean);
  const completedTickets = (Array.isArray(tickets) ? tickets : []).filter(
    (tk) => tk && ['done', 'completed', 'verified', 'cancelled'].includes(String(tk.status || '').toLowerCase()),
  );

  return allTasks.filter((t) => {
    if (!t) return false;
    if (/^(?:Refresh standing answer|Cleanup \d+ of \d+ low-quality wiki page|Migrate \d+ legacy wiki item)/i.test(String(t.taskName || ''))) return false;
    // Review/redelivery WorkItems are internal orchestration diagnostics, not studio tasks.
    if (String(t.id || '').includes(':review:')) return false;
    if (/^(?:Brief not reaching|Went quiet on a running task|Blocked:|Mission review)/i.test(String(t.taskName || ''))) return false;
    // Completed ticket history must not return as a live error/queue card.
    if (completedTickets.some((tk) => {
      if (tk.workItemId && (t.id === tk.workItemId || String(t.id || '').startsWith(`${tk.workItemId}:`))) return true;
      const prefix = new RegExp(`^\\s*(?:Retry\\s+\\d+\/\\d+:\\s*)?(?:Verify:\\s*)?${String(tk.id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[:\\s.-]|$)`, 'i');
      return prefix.test(String(t.taskName || ''));
    })) return false;
    // An explicit foreign project always wins over a matching session or title.
    if (t.projectId && activeProjectId && t.projectId !== activeProjectId) return false;
    if (t.teamId && teamId && t.teamId !== teamId && !t.projectId) return false;
    if (activeProjectId && t.projectId === activeProjectId) return true;
    if (teamId && t.teamId === teamId) return true;
    if (t.id && ticketWorkItemIds.has(t.id)) return true;

    const session = String(t.assignedSessionName || '');
    if (session.startsWith('atelierx-')) return true;
    if (session && resolveDepartmentForIdentifier(session, members) >= 0) return true;
    if (t.assignedTeamMemberId && resolveDepartmentForIdentifier(t.assignedTeamMemberId, members) >= 0) {
      return true;
    }

    // Retain queued / pending_assignment WorkItems whose projectId/teamId/session are empty
    // when their brief references an AtelierX ticket (e.g. ATEL-2, ATEL-8)
    if (!t.projectId && !t.teamId) {
      const upperName = String(t.taskName || '').toUpperCase();
      if (/\bATEL-\d+\b/.test(upperName)) return true;
      if (knownTicketIds.some((id) => upperName.includes(id))) return true;
    }

    return false;
  });
}

export function resolveTicketDepartment(ticket, members = []) {
  if (!ticket) return { deptIndex: 0, assignmentSource: 'lead_fallback' };

  const direct = resolveDepartmentForIdentifier(ticket.assignee, members);
  if (direct >= 0) {
    return { deptIndex: direct, assignmentSource: 'direct' };
  }

  // Check reverse chronological log for previous assignment (e.g. ticket returned to `ready`)
  const logs = Array.isArray(ticket.log) ? ticket.log : [];
  for (let idx = logs.length - 1; idx >= 0; idx--) {
    const line = String(logs[idx] || '');
    const m = line.match(/assigned to\s+([^\s—·,]+)/i);
    if (m && m[1]) {
      const fromLog = resolveDepartmentForIdentifier(m[1], members);
      if (fromLog >= 0) {
        return { deptIndex: fromLog, assignmentSource: 'history' };
      }
    }
  }

  // Domain inference from labels & title
  const labels = (Array.isArray(ticket.labels) ? ticket.labels : []).map((l) => String(l).toLowerCase());
  const text = repairBrokenVietnamese(`${labels.join(' ')} ${String(ticket.title || '')}`).toLowerCase();

  if (/\b(viewer|360|lookbook|showcase|poster|visual|camera)\b/.test(text)) {
    return { deptIndex: 5, assignmentSource: 'domain' };
  }
  if (/\b(qa|retest|print-qa|viewer-qa|geometry)\b|ki[eể?]m\s*tra/.test(text)) {
    return { deptIndex: 4, assignmentSource: 'domain' };
  }
  if (/\b(material|surface|palette|roughness|vải)\b|v[aậ?]t\s*li[eệ?]u/.test(text)) {
    return { deptIndex: 2, assignmentSource: 'domain' };
  }
  if (/\b(research|trend|moodboard|art-direction|intent)\b|nghi[eê?]n\s*c[uứ?]u/.test(text)) {
    return { deptIndex: 1, assignmentSource: 'domain' };
  }
  if (/\b(glb|artwork|texture|asset|uv)\b|h[oọ?]a\s*ti[eế?]t/.test(text) && String(ticket.source || '') !== 'owner') {
    return { deptIndex: 3, assignmentSource: 'domain' };
  }

  return { deptIndex: 0, assignmentSource: 'lead_fallback' };
}

export function buildDepartmentWorkloads(tickets = [], tasks = [], members = []) {
  const validTickets = Array.isArray(tickets) ? tickets.filter((t) => t && t.status !== 'cancelled') : [];
  const validTasks = Array.isArray(tasks) ? tasks.filter((t) => t && t.status !== 'cancelled' &&
    !['standing-refresh', 'wiki_quality_cleanup', 'wiki_legacy_migrate'].includes(t.metadata?.kind)) : [];

  const matchedTaskIds = new Set();
  const ticketMeta = validTickets.map((ticket) => ({
    ticket,
    ...resolveTicketDepartment(ticket, members),
    linkedTask: null,
  }));

  // Pass 1: Exact `workItemId === task.id` correlation across ALL tickets first
  for (const entry of ticketMeta) {
    const wid = entry.ticket.workItemId;
    if (!wid) continue;
    const exact = validTasks.find((t) => !matchedTaskIds.has(t.id) && t.id === wid);
    if (exact) {
      entry.linkedTask = exact;
      matchedTaskIds.add(exact.id);
    }
  }

  // Pass 2a: Explicit leading ticket prefix (`^ATEL-8: ...`) with department ownership check
  for (const entry of ticketMeta) {
    if (entry.linkedTask || !entry.ticket.id) continue;
    const idUpper = String(entry.ticket.id).toUpperCase();
    const escapedId = idUpper.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefixRe = new RegExp(`^["']?${escapedId}(?:[:\\s·\\-–—]|$)`, 'i');

    const candidate = validTasks.find((t) => {
      if (matchedTaskIds.has(t.id)) return false;
      const taskDept = resolveWorkItemDepartment(t, members);
      if (taskDept >= 0 && taskDept !== entry.deptIndex) return false;
      return prefixRe.test(String(t.taskName || '').trim());
    });
    if (candidate) {
      entry.linkedTask = candidate;
      matchedTaskIds.add(candidate.id);
    }
  }

  // Pass 2b: Same-department body mention (`\bATEL-X\b`), never letting parent ATEL-1 steal child departments' WorkItems!
  for (const entry of ticketMeta) {
    if (entry.linkedTask || !entry.ticket.id) continue;
    const isCompletedTicket = ['done', 'completed', 'verified', 'done_by_worker'].includes(
      String(entry.ticket.status || '').toLowerCase(),
    );
    if (isCompletedTicket) continue;

    const idUpper = String(entry.ticket.id).toUpperCase();
    const escapedId = idUpper.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordRe = new RegExp(`\\b${escapedId}\\b`, 'i');

    const candidate = validTasks.find((t) => {
      if (matchedTaskIds.has(t.id)) return false;
      const taskDept = resolveWorkItemDepartment(t, members);
      // Require exact department match if the WorkItem specifies a specialist department;
      // if unassigned (taskDept < 0), do not let owner root tickets (e.g. ATEL-1) swallow child briefs
      if (taskDept >= 0) {
        if (taskDept !== entry.deptIndex) return false;
      } else if (String(entry.ticket.source || '') === 'owner') {
        return false;
      }
      return wordRe.test(String(t.taskName || ''));
    });
    if (candidate) {
      entry.linkedTask = candidate;
      matchedTaskIds.add(candidate.id);
    }
  }

  // Pass 2c: Specialist single-open-ticket correlation — when a specialist department (1..5)
  // has exactly ONE open ticket without a linked WorkItem, and an unmatched live WorkItem is
  // explicitly assigned to that exact specialist department (e.g. delegated with "cho đơn ATEL-1"),
  // merge them cleanly instead of spawning a duplicate LIVE card beside the open ticket!
  for (let dIdx = 1; dIdx < 6; dIdx++) {
    const openUnlinked = ticketMeta.filter((e) => {
      if (e.deptIndex !== dIdx || e.linkedTask) return false;
      const st = String(e.ticket.status || '').toLowerCase();
      return !['done', 'completed', 'verified', 'done_by_worker', 'cancelled'].includes(st);
    });
    if (openUnlinked.length !== 1) continue;

    const deptTasks = validTasks.filter(
      (t) => !matchedTaskIds.has(t.id) && resolveWorkItemDepartment(t, members) === dIdx,
    );
    if (deptTasks.length === 1) {
      openUnlinked[0].linkedTask = deptTasks[0];
      matchedTaskIds.add(deptTasks[0].id);
    }
  }

  const deptItems = Array.from({ length: 6 }, () => []);

  for (const entry of ticketMeta) {
    const { ticket, deptIndex, assignmentSource, linkedTask } = entry;
    const bucket = classifyWorkBucket(ticket.status, linkedTask?.status);
    if (bucket === 'cancelled') continue;

    const title = cleanTicketTitle(ticket.id, ticket.title);
    const brief = parseStructuredBrief(ticket.description || linkedTask?.taskName || '');
    const acceptance = Array.isArray(ticket.acceptance) ? ticket.acceptance : [];
    const doneCriteria = acceptance.filter((c) => c && c.done).length;
    const logs = Array.isArray(ticket.log) ? ticket.log : [];
    const latestLog = selectBestLogEntry(logs);

    const blockerClauseMatch =
      bucket !== 'done' && latestLog?.rawNote
        ? latestLog.rawNote.match(/(?:\bBLOCKED\b[^.;\n]*[:—-]?\s*[^]*|Blocker\s*cuối\s*:\s*[^]*)$/i)
        : null;
    const logIndicatesBlocked = Boolean(blockerClauseMatch) && (!linkedTask ? ticket.status === 'blocked' : linkedTask.status === 'blocked');

    const hasBlocker =
      (bucket !== 'done' && linkedTask?.status === 'blocked') ||
      (linkedTask?.status === 'blocked' && Boolean(linkedTask?.blockedReason || linkedTask?.blockReason)) ||
      ticket.status === 'blocked' ||
      logIndicatesBlocked;

    const blockerNote = linkedTask?.status === 'blocked' && (linkedTask?.blockedReason || linkedTask?.blockReason)
      ? cleanOneLine(linkedTask.blockedReason || linkedTask.blockReason, 300)
      : linkedTask?.status === 'blocked' && blockerClauseMatch
        ? cleanOneLine(blockerClauseMatch[0], 175)
        : '';

    deptItems[deptIndex].push({
      key: `ticket-${ticket.id}`,
      kind: 'ticket',
      id: ticket.id,
      title,
      priority: ticket.priority || null,
      bucket,
      statusLabel:
        linkedTask?.status === 'blocked' ? flowLabel('blocked') :
        linkedTask?.status === 'queued' ? flowLabel('queued') :
        assignmentSource !== 'direct' && !ticket.assignee && bucket === 'queued'
          ? `${flowLabel(ticket.status)} · Chờ giao`
          : flowLabel(ticket.status),
      liveStatusLabel: linkedTask ? flowLabel(linkedTask.status) : null,
      hasBlocker,
      blockerNote,
      brief,
      criteriaDone: doneCriteria,
      criteriaTotal: acceptance.length,
      latestLog,
      updatedAt: Date.parse(ticket.updatedAt || ticket.createdAt || '') || 0,
      deptIndex,
      assignmentSource,
      rawTicket: ticket,
      rawTask: linkedTask,
    });
  }

  // Add any standalone live WorkItems not already correlated to a ticket
  for (const task of validTasks) {
    if (matchedTaskIds.has(task.id)) continue;
    let deptIndex = resolveWorkItemDepartment(task, members);
    if (deptIndex < 0) {
      const inferred = resolveTicketDepartment({ title: task.taskName || '', labels: [], log: [] }, members);
      deptIndex = inferred.deptIndex;
    }

    const bucket = classifyWorkBucket('', task.status);
    if (bucket === 'cancelled') continue;
    const brief = parseStructuredBrief(task.taskName || '');
    const headline = brief.goal || brief.summary || cleanOneLine(task.taskName || 'Tác vụ trực tiếp', 110);

    deptItems[deptIndex].push({
      key: `task-${task.id}`,
      kind: 'workitem',
      id: 'LIVE',
      title: cleanTicketTitle('', headline),
      priority: task.priority ? String(task.priority).toUpperCase() : null,
      bucket,
      statusLabel: flowLabel(task.status),
      liveStatusLabel: null,
      hasBlocker: task.status === 'blocked',
      blockerNote: task.status === 'blocked' && (task.blockedReason || task.blockReason) ? cleanOneLine(task.blockedReason || task.blockReason, 300) : '',
      brief,
      criteriaDone: 0,
      criteriaTotal: 0,
      latestLog: null,
      updatedAt: Date.parse(task.lastCheckedAt || task.assignedAt || '') || 0,
      deptIndex,
      assignmentSource: 'direct',
      rawTicket: null,
      rawTask: task,
    });
  }

  const bucketRank = { active: 0, review: 1, queued: 2, done: 3 };
  const departments = STUDIO_ZONES.slice(0, 6).map((zone, i) => {
    const items = deptItems[i].sort((a, b) => {
      const rankDiff = (bucketRank[a.bucket] ?? 9) - (bucketRank[b.bucket] ?? 9);
      if (rankDiff !== 0) return rankDiff;
      return b.updatedAt - a.updatedAt;
    });

    const activeItems = items.filter((it) => it.bucket === 'active');
    const reviewItems = items.filter((it) => it.bucket === 'review');
    const queuedItems = items.filter((it) => it.bucket === 'queued');
    const doneItems = items.filter((it) => it.bucket === 'done');

    return {
      deptIndex: i,
      zone,
      items,
      activeItems,
      reviewItems,
      queuedItems,
      doneItems,
      activeCount: activeItems.length,
      reviewCount: reviewItems.length,
      queuedCount: queuedItems.length,
      doneCount: doneItems.length,
      totalCount: items.length,
      primaryItem: activeItems[0] || reviewItems[0] || queuedItems[0] || doneItems[0] || null,
    };
  });

  const activeSpotlightItems = departments.flatMap((d) => d.activeItems);
  const totalActive = departments.reduce((sum, d) => sum + d.activeCount, 0);
  const totalReview = departments.reduce((sum, d) => sum + d.reviewCount, 0);
  const totalQueued = departments.reduce((sum, d) => sum + d.queuedCount, 0);
  const totalDone = departments.reduce((sum, d) => sum + d.doneCount, 0);
  const totalItems = departments.reduce((sum, d) => sum + d.totalCount, 0);

  return {
    departments,
    activeSpotlightItems,
    totals: {
      active: totalActive,
      review: totalReview,
      queued: totalQueued,
      pendingAttention: totalQueued + totalReview,
      done: totalDone,
      total: totalItems,
      completionPct: totalItems > 0 ? Math.round((totalDone / totalItems) * 100) : 0,
    },
  };
}

function cleanOneLine(str, maxLen = 140) {
  const s = repairBrokenVietnamese(String(str ?? ''))
    .replace(/\\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen - 1).trimEnd() + '…';
}

function parseLatestLogEntry(rawLine) {
  if (!rawLine) return null;
  const parts = String(rawLine).split(' · ');
  if (parts.length >= 3) {
    const ts = parts[0];
    const actor = parts[1];
    const note = parts.slice(2).join(' · ').trim();
    let shortTime = '';
    const d = new Date(ts);
    if (!Number.isNaN(d.getTime())) {
      shortTime = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return {
      time: shortTime,
      actor,
      rawNote: note,
      text: cleanOneLine(note, 185),
    };
  }
  return { time: '', actor: '', rawNote: String(rawLine).trim(), text: cleanOneLine(rawLine, 185) };
}

function selectBestLogEntry(logs) {
  if (!Array.isArray(logs) || logs.length === 0) return null;
  const boilerplateRe =
    /^(?:WorkItem\s+[0-9a-f-]+\s+verified\s*→\s*done|created\s*\([^)]*\)|delegated\s+by\s+\S+|assigned\s+to\s+\S+(?:\s*—\s*WorkItem\s+[0-9a-f-]+)?|updated\s+(?:title|description|acceptance criteria)(?:,\s*(?:title|description|acceptance criteria))*)$/i;

  for (let i = logs.length - 1; i >= 0; i--) {
    const parsed = parseLatestLogEntry(logs[i]);
    if (parsed && parsed.rawNote && !boilerplateRe.test(parsed.rawNote)) {
      return parsed;
    }
  }
  return parseLatestLogEntry(logs[logs.length - 1]);
}

export function shortRuntimeName(runtimeType) {
  const raw = String(runtimeType || '').trim();
  if (!raw) return '';
  const lower = raw.toLowerCase();
  if (lower.includes('antigravity')) return 'Antigravity';
  if (lower.includes('codex')) return 'Codex';
  if (lower.includes('claude')) return 'Claude';
  if (lower.includes('gemini')) return 'Gemini';
  return raw.replace(/-cli$/i, '');
}

export function computeAgentTokenInfo(deptIndex, members = [], liveTokenUsage = null, liveRuntimeFallback = null) {
  const zone = STUDIO_ZONES[deptIndex];
  if (!zone || !zone.memberName || deptIndex === 6) {
    return null;
  }

  const mem = members.find(
    (m) => m.name === zone.memberName || m.id === zone.memberId || m.agentId === zone.agentId,
  );
  const view = liveTokenUsage;
  const team = view?.teams?.find((t) => t.teamId === DEFAULT_TEAM_ID || String(t.name || '').includes('AtelierX'));
  const row = view?.agents?.find(
    (a) =>
      (mem && [mem.sessionName, mem.agentId].filter(Boolean).includes(a.session)) ||
      a.session === zone.agentId ||
      (team && a.teamId === team.teamId && a.name === zone.memberName),
  );

  const limits = [
    [row?.capTokens, row?.todayTokens],
    [team?.capTokens, team?.todayTokens],
    [view?.totalCapTodayTokens, view?.todayTokens],
  ].filter(([cap, used]) => typeof cap === 'number' && cap > 0 && Number.isFinite(used));

  const remaining = limits.length ? Math.max(0, Math.min(...limits.map(([cap, used]) => cap - used))) : null;
  const budget = limits.length ? Math.min(...limits.map(([cap]) => cap)) : null;

  // Inspect RuntimeFallbackService state (`/api/system/runtime-fallback`) for provider quota exhaustion!
  const overrides = Array.isArray(liveRuntimeFallback?.overrides) ? liveRuntimeFallback.overrides : [];
  const exhaustedArr = Array.isArray(liveRuntimeFallback?.exhausted) ? liveRuntimeFallback.exhausted : [];
  const exhaustedSet = new Set(exhaustedArr.map((e) => String(e?.runtime || '').toLowerCase()).filter(Boolean));

  const sessionCandidates = [mem?.sessionName, mem?.agentId, zone.agentId].filter(Boolean);
  const activeOverride = overrides.find((o) => sessionCandidates.includes(o?.sessionName)) || null;
  const baseRuntime = String(mem?.runtimeType || '');
  const effectiveRuntime = String(activeOverride?.runtime || baseRuntime || '');
  const effRuntimeShort = shortRuntimeName(effectiveRuntime);
  const baseRuntimeShort = shortRuntimeName(baseRuntime);

  const isEffectiveRuntimeExhausted = Boolean(
    effectiveRuntime && exhaustedSet.has(effectiveRuntime.toLowerCase()),
  );
  const isRunningOnFallback = Boolean(
    activeOverride && effectiveRuntime && effectiveRuntime.toLowerCase() !== baseRuntime.toLowerCase(),
  );

  const isSpendCapStopped = Boolean(
    view && (row?.stopped || team?.stopped || view.totalStopped || (limits.length > 0 && remaining === 0)),
  );

  let status = 'unknown';
  if (isSpendCapStopped || isEffectiveRuntimeExhausted) {
    status = 'out';
  } else if (view) {
    status = limits.length > 0 ? 'ok' : 'unlimited';
  } else if (isRunningOnFallback) {
    status = 'unlimited';
  }

  const pct = budget && remaining !== null ? Math.round((remaining / budget) * 100) : null;
  const isLow = (status === 'ok' && pct !== null && pct <= 20) || (status !== 'out' && isRunningOnFallback);
  const hasToken = status !== 'out';

  let statusLabel = 'Sẵn sàng';
  let shortBadge = '⚡ Sẵn sàng';
  let pillClass = 'tok-unlimited';
  let statusColor = '#059669';

  if (status === 'out') {
    if (isEffectiveRuntimeExhausted && !isSpendCapStopped) {
      statusLabel = `HẾT QUOTA ${effRuntimeShort.toUpperCase()}`;
      shortBadge = `🔴 Hết quota ${effRuntimeShort}`;
    } else {
      statusLabel = 'HẾT HẠN MỨC';
      shortBadge = '🔴 HẾT TOKEN';
    }
    pillClass = 'tok-out';
    statusColor = '#dc2626';
  } else if (status === 'ok') {
    if (pct !== null && pct <= 20) {
      statusLabel = `SẮP HẾT (${pct}%)`;
      shortBadge = `🟠 Còn ${pct}%`;
      pillClass = 'tok-warn';
      statusColor = '#d97706';
    } else if (isRunningOnFallback) {
      statusLabel = `DỰ PHÒNG ${effRuntimeShort.toUpperCase()} (${pct}%)`;
      shortBadge = `🟠 Dự phòng ${effRuntimeShort}`;
      pillClass = 'tok-warn';
      statusColor = '#d97706';
    } else {
      statusLabel = `CÒN ${pct}%`;
      shortBadge = `🟢 Còn ${pct}%`;
      pillClass = 'tok-ok';
      statusColor = '#059669';
    }
  } else if (isRunningOnFallback) {
    statusLabel = `DỰ PHÒNG ${effRuntimeShort.toUpperCase()}`;
    shortBadge = `🟠 Dự phòng ${effRuntimeShort}`;
    pillClass = 'tok-warn';
    statusColor = '#d97706';
  } else if (status === 'unlimited') {
    statusLabel = 'Không giới hạn';
    shortBadge = '⚡ Không giới hạn';
    pillClass = 'tok-unlimited';
    statusColor = '#059669';
  } else {
    statusLabel = 'Chưa đặt cap';
    shortBadge = '⚡ Chưa đặt cap';
    pillClass = 'tok-unlimited';
    statusColor = '#475569';
  }

  const baseModel = mem?.modelId || 'gpt-6-luna';
  const runtimeDisplay = isRunningOnFallback
    ? `${baseRuntimeShort || 'Primary'} → ${effRuntimeShort}`
    : effRuntimeShort;
  const noteText = isEffectiveRuntimeExhausted
    ? `Runtime ${effRuntimeShort} hết quota`
    : isRunningOnFallback
      ? `Chuyển dự phòng từ ${baseRuntimeShort || 'runtime gốc'}`
      : remaining == null
        ? 'Không giới hạn'
        : remaining.toLocaleString('vi-VN');

  return {
    deptIndex,
    name: zone.memberName,
    staffName: zone.staffName,
    deptLabel: zone.label,
    role: mem?.role || zone.roleKey,
    model: runtimeDisplay ? `${baseModel} · ${runtimeDisplay}` : baseModel,
    rawModel: baseModel,
    effectiveRuntime,
    isRunningOnFallback,
    isRuntimeExhausted: isEffectiveRuntimeExhausted,
    budget,
    used: row?.todayTokens ?? null,
    remaining,
    noteText,
    pctRemaining: pct,
    status,
    hasToken,
    isLow,
    statusLabel,
    shortBadge,
    statusColor,
    pillClass,
    barClass: status === 'out' ? 'out' : isLow ? 'warn' : 'ok',
  };
}

// ================= ISOMETRIC ARCHITECTURAL GRAPHICS ENGINE (h1) =================

const iso = (x, y, z = 0) => [
  Math.round((x - y) * 0.94 * 10) / 10,
  Math.round(((x + y) * 0.46 - z) * 10) / 10,
];

function estimateSvgTextWidth(text, fontSize = 10) {
  let units = 0;
  for (const ch of String(text || '')) {
    const code = ch.codePointAt(0) || 0;
    if (code > 0x1f000 || (code >= 0x2600 && code <= 0x27bf)) {
      units += 1.32;
    } else if ('MW@#%&⇔'.includes(ch)) {
      units += 0.88;
    } else if ('il.,:;|!·()[] '.includes(ch)) {
      units += 0.36;
    } else if (ch === ch.toUpperCase() && ch !== ch.toLowerCase()) {
      units += 0.72;
    } else {
      units += 0.6;
    }
  }
  return Math.ceil(units * fontSize);
}

function shade(hex, factor) {
  let clean = String(hex || '#8899aa').replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const parts = clean.match(/^[0-9a-fA-F]{6}$/) ? clean.match(/../g) : ['88', '99', 'aa'];
  const lift = factor > 1 ? (factor - 1) * 34 : 0;
  return (
    '#' +
    parts
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(parseInt(v, 16) * factor + lift)))
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}

const poly = (pts, fill, extra = '') =>
  `<polygon points="${pts.map((t) => t.join(',')).join(' ')}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;

const face = (pts3d, fill, extra = '') => poly(pts3d.map((v) => iso(...v)), fill, extra);

function box(x, y, z, w, d, h, color, stroke = '') {
  const a = x + w;
  const b = y + d;
  const t = z + h;
  const st = stroke ? `stroke="${stroke}" stroke-width="0.55"` : '';
  return (
    face([[x, b, z], [a, b, z], [a, b, t], [x, b, t]], shade(color, 0.77), st) +
    face([[a, y, z], [a, b, z], [a, b, t], [a, y, t]], shade(color, 0.62), st) +
    face([[x, y, t], [a, y, t], [a, b, t], [x, b, t]], color, st)
  );
}

function oval(x, y, z, rx, ry, fill, extra = '') {
  const [cx, cy] = iso(x, y, z);
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;
}

function glassPanel(x, y, z, w, d, h, tint = '#bae6fd', opacity = 0.34) {
  const a = x + w;
  const b = y + d;
  const t = z + h;
  const edge = `stroke="${shade(tint, 0.78)}" stroke-width="0.9" fill-opacity="${opacity}"`;
  return (
    face([[x, b, z], [a, b, z], [a, b, t], [x, b, t]], tint, edge) +
    face([[a, y, z], [a, b, z], [a, b, t], [a, y, t]], shade(tint, 0.9), edge) +
    face([[x, y, t], [a, y, t], [a, b, t], [x, b, t]], '#ffffff', `fill-opacity="${opacity * 0.8}"`)
  );
}

// Custom 3D Pullover Hoodie / Couture Mannequin Display
function hoodieShowcase(x, y, z, bodyHex = '#1e2430', emblemHex = '#f1ece1', withTurntable = true) {
  let g = '';
  if (withTurntable) {
    g += oval(x, y, z + 1, 16, 7.5, '#1e293b', 'opacity="0.32"');
    g += oval(x, y, z + 2, 14.5, 6.8, '#cbd5e1', 'stroke="#38bdf8" stroke-width="1"');
    g += oval(x, y, z + 3.5, 11, 5, '#0f172a');
  }
  const standZ = withTurntable ? z + 3.5 : z;
  g += box(x - 1.5, y - 1.5, standZ, 3, 3, 28, '#94a3b8');
  const [px, py] = iso(x, y, standZ);
  g += `<g transform="translate(${px} ${py})">
    <path d="M-8 -45 L-17 -39 L-14 -24 L-9 -26 L-10 -12 Q0 -8 10 -12 L9 -26 L14 -24 L17 -39 L8 -45 Q0 -41 -8 -45 Z" fill="${bodyHex}" stroke="${shade(bodyHex, 1.45)}" stroke-width="0.9"/>
    <path d="M-6 -45 Q0 -54 6 -45 Q3 -40 0 -40 Q-3 -40 -6 -45 Z" fill="${shade(bodyHex, 1.18)}" stroke="${shade(bodyHex, 1.5)}" stroke-width="0.7"/>
    <circle cx="0" cy="-31" r="4.6" fill="${emblemHex}" opacity="0.92"/>
    <circle cx="0" cy="-31.5" r="1.4" fill="${bodyHex}"/>
    <path d="M-2.5 -27 L2.5 -27 L1.8 -24.5 L-1.8 -24.5 Z" fill="${emblemHex}" opacity="0.85"/>
  </g>`;
  return g;
}

function dressForm(x, y, z, dressHex) {
  const [px, py] = iso(x, y, z);
  return (
    oval(x, y, z + 1, 9.5, 4.2, '#475569', 'opacity="0.45"') +
    box(x - 1.4, y - 1.4, z + 1, 2.8, 2.8, 34, '#a88b67') +
    `<g transform="translate(${px} ${py})">
      <path d="M-4 -48 L-11 -44 L-9 -35 L-5 -32 L-12 -13 Q0 -8 12 -13 L5 -32 L9 -35 L11 -44 L4 -48 Q0 -43 -4 -48 Z" fill="${dressHex}" stroke="rgba(255,255,255,0.4)" stroke-width="0.6"/>
      <path d="M0 -43 L1.5 -32 L-1 -12" fill="none" stroke="#ffffff" opacity="0.42" stroke-width="0.9"/>
    </g>`
  );
}

const props = {
  lushPlant(x, y, z) {
    return (
      box(x, y, z, 8, 8, 9, '#5c4938') +
      box(x + 0.8, y + 0.8, z + 9, 6.4, 6.4, 1, '#3b2e22') +
      oval(x + 4, y + 4, z + 16, 9, 7.5, '#2b8a68') +
      oval(x + 2.5, y + 5, z + 22, 7, 6, '#3fb685') +
      oval(x + 5.5, y + 3, z + 25, 5.5, 4.8, '#6ee7b7')
    );
  },
  cypressTree(x, y, z) {
    return (
      box(x - 5.5, y - 5.5, z, 11, 11, 6.5, '#cbd5e1') +
      box(x - 1.6, y - 1.6, z + 6.5, 3.2, 3.2, 11, '#6b4f3a') +
      oval(x, y, z + 21, 9.5, 11.5, '#23664f') +
      oval(x, y, z + 31, 7.2, 9.2, '#349272') +
      oval(x, y, z + 40, 4.8, 6.8, '#52b788')
    );
  },
  streetLamp(x, y, z, isNight) {
    const glow = isNight
      ? oval(x, y, z + 31, 13, 7.5, '#fde68a', 'opacity="0.34"') + oval(x, y, z, 18, 8.5, '#fde68a', 'opacity="0.15"')
      : '';
    return (
      box(x - 2.2, y - 2.2, z, 4.4, 4.4, 3.2, '#475569') +
      box(x - 0.9, y - 0.9, z + 3.2, 1.8, 1.8, 27, '#64748b') +
      oval(x, y, z + 31, 4.5, 3, '#fef3c7', 'stroke="#f59e0b" stroke-width="0.9"') +
      glow
    );
  },
  obeliskPylon(x, y, z, isNight) {
    const body = isNight ? '#1e293b' : '#334155';
    return (
      box(x - 7, y - 7, z, 14, 14, 6, '#94a3b8') +
      box(x - 5, y - 5, z + 6, 10, 10, 34, body, '#d99b43') +
      box(x - 3.5, y - 3.5, z + 40, 7, 7, 6, '#f59e0b') +
      oval(x, y, z + 48, 5, 3, '#fef08a', isNight ? 'opacity="0.95"' : 'opacity="0.75"')
    );
  },
  stool(x, y, z, cushion = '#334e68') {
    return (
      oval(x + 1, y + 1, z + 0.5, 5, 2.3, '#0f172a', 'opacity="0.18"') +
      box(x, y, z, 2.2, 2.2, 10, '#64748b') +
      box(x - 3.2, y - 3.2, z + 10, 8.6, 8.6, 2.6, cushion)
    );
  },
  execDesk(x, y, z, accent = '#38bdf8') {
    return (
      box(x, y, z, 5, 5, 15, '#5b4636') +
      box(x + 47, y + 20, z, 5, 5, 15, '#5b4636') +
      box(x, y + 20, z, 5, 5, 15, '#5b4636') +
      box(x - 2, y - 2, z + 15, 56, 28, 3.2, '#dfc3a0') +
      box(x + 12, y + 3, z + 18, 2.5, 2.5, 4, '#334155') +
      box(x + 4, y + 2, z + 22, 20, 2, 13, '#1e293b') +
      box(x + 6, y + 4.1, z + 25, 15, 0.5, 8, accent) +
      box(x + 33, y + 5, z + 18, 2.5, 2.5, 4, '#334155') +
      box(x + 26, y + 4, z + 22, 18, 2, 12, '#1e293b') +
      box(x + 28, y + 6.1, z + 25, 13, 0.5, 7, '#a7f3d0') +
      box(x + 14, y + 12, z + 18.2, 14, 6, 0.8, '#e2e8f0') +
      box(x + 44, y + 15, z + 18.2, 3.2, 3.2, 4.2, '#fffbeb')
    );
  },
  fabricRoll(x, y, z, k) {
    const c = DYES[k % DYES.length];
    return (
      box(x, y, z, 6.5, 6.5, 14, c) +
      oval(x + 3.2, y + 3.2, z + 14, 5.2, 2.6, shade(c, 1.08)) +
      oval(x + 3.2, y + 3.2, z + 14, 1.8, 0.9, '#78624c')
    );
  },
  softboxLight(x, y, z) {
    return (
      oval(x, y, z + 0.5, 7, 3.4, '#1e293b', 'opacity="0.32"') +
      box(x - 1, y - 1, z, 2.2, 2.2, 32, '#475569') +
      box(x - 7, y - 3, z + 30, 15, 6, 12, '#1e293b') +
      box(x - 5.8, y + 3.1, z + 31.2, 12.6, 0.8, 9.6, '#fef9c3')
    );
  },
};

function renderCampusPlaza(isNight) {
  let svg = '';
  const foundation = isNight ? '#101935' : '#bccde4';
  const moatRim = isNight ? '#1a2850' : '#d5e3f4';
  const upperFill = isNight ? 'url(#plazaTopNight)' : 'url(#plazaTopDay)';
  const rimAccent = isNight ? '#38bdf8' : '#8fb1da';

  // Monumental Three-Tier Grand Citadel Terrace (fits cleanly inside 1320x860 viewBox)
  svg += oval(0, 0, -30, 595, 282, '#0f172a', 'opacity="0.18" filter="url(#shadow)"');
  svg += box(-346, -346, -26, 692, 692, 10, foundation);

  // Perimeter Reflecting Water Moat framing the Citadel
  svg += box(-336, -336, -16, 672, 672, 4, moatRim, rimAccent);
  svg += face(
    [
      [-332, -332, -11.8],
      [332, -332, -11.8],
      [332, 332, -11.8],
      [-332, 332, -11.8],
    ],
    'url(#waterPool)',
  );

  // Raised Travertine Grand Courtyard Deck
  svg += box(-320, -320, -12, 640, 640, 8, isNight ? '#182447' : '#e6effa', rimAccent);
  svg += face(
    [
      [-319, -319, -3.9],
      [319, -319, -3.9],
      [319, 319, -3.9],
      [-319, 319, -3.9],
    ],
    upperFill,
  );

  // Architectural stone grid & golden diagonal boulevards
  const gridStroke = isNight ? 'rgba(148,163,218,0.12)' : 'rgba(95,120,162,0.15)';
  for (let g = -280; g <= 280; g += 70) {
    const [x1, y1] = iso(g, -312, -3.7);
    const [x2, y2] = iso(g, 312, -3.7);
    const [x3, y3] = iso(-312, g, -3.7);
    const [x4, y4] = iso(312, g, -3.7);
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${gridStroke}" stroke-width="1"/>`;
    svg += `<line x1="${x3}" y1="${y3}" x2="${x4}" y2="${y4}" stroke="${gridStroke}" stroke-width="1"/>`;
  }

  // Grand Central Compass-Rose Medallion beneath the Catwalk Hub
  svg += oval(0, 0, -3.6, 156, 72, 'none', `stroke="${isNight ? '#d99b43' : '#cfa054'}" stroke-width="1.6" opacity="0.55"`);
  svg += oval(0, 0, -3.6, 134, 62, 'none', `stroke="${isNight ? '#38bdf8' : '#60a5fa'}" stroke-width="1.1" stroke-dasharray="6 4" opacity="0.5"`);

  // 4 Courtyard Reflecting Light Pools with Illuminated Fountain Jets
  const poolCoords = [
    [-162, -142, 66, 52],
    [-142, 92, 52, 66],
    [92, -162, 66, 52],
    [102, 102, 58, 58],
  ];
  for (const [px, py, pw, pd] of poolCoords) {
    svg += box(px, py, -4.4, pw, pd, 1.8, isNight ? '#0c4a6e' : '#bae6fd', '#38bdf8');
    svg += face(
      [
        [px + 3, py + 3, -2.5],
        [px + pw - 3, py + 3, -2.5],
        [px + pw - 3, py + pd - 3, -2.5],
        [px + 3, py + pd - 3, -2.5],
      ],
      'url(#waterPool)',
    );
    const cx = px + pw / 2;
    const cy = py + pd / 2;
    svg += oval(cx, cy, -2.2, 8.5, 4, '#e0f2fe', 'opacity="0.78"');
    svg += oval(cx, cy, 2.5, 3.2, 5.5, '#bae6fd', 'opacity="0.72"');
  }

  // Grand Ceremonial Front Staircase + Twin Illuminated Citadel Obelisk Pylons
  for (let s = 0; s < 5; s++) {
    svg += box(
      284 + s * 9,
      284 + s * 9,
      -25 + (4 - s) * 3.4,
      54 - s * 4,
      54 - s * 4,
      3.4,
      isNight ? '#263766' : '#dce7f5',
      rimAccent,
    );
  }
  svg += props.obeliskPylon(268, 314, -12, isNight);
  svg += props.obeliskPylon(314, 268, -12, isNight);

  // Depth-sorted Cypress Colonnade & Boulevard Lamps along the Citadel Perimeter
  const plazaProps = [
    { kind: 'tree', x: -306, y: -306 },
    { kind: 'tree', x: -306, y: -128 },
    { kind: 'tree', x: -128, y: -306 },
    { kind: 'lamp', x: -195, y: -304 },
    { kind: 'lamp', x: -304, y: -195 },
    { kind: 'tree', x: -306, y: 158 },
    { kind: 'tree', x: 158, y: -306 },
    { kind: 'lamp', x: -304, y: 112 },
    { kind: 'lamp', x: 112, y: -304 },
    { kind: 'tree', x: -162, y: 304 },
    { kind: 'tree', x: 304, y: -162 },
    { kind: 'lamp', x: -112, y: 302 },
    { kind: 'lamp', x: 302, y: -112 },
    { kind: 'tree', x: 304, y: 222 },
    { kind: 'tree', x: 222, y: 304 },
  ].sort((a, b) => a.x + a.y - (b.x + b.y));

  for (const item of plazaProps) {
    svg += item.kind === 'tree' ? props.cypressTree(item.x, item.y, -4) : props.streetLamp(item.x, item.y, -4, isNight);
  }

  return svg;
}

function renderSkybridge(fromZone, toZone, statusMode, showLinks, isOuterRing = false, isNight = false) {
  const dx = toZone.x - fromZone.x;
  const dy = toZone.y - fromZone.y;
  const length = Math.hypot(dx, dy) || 1;
  const halfW = 86;
  const halfD = 70;
  const edgeStart = Math.min(halfW / Math.abs(dx || 0.001), halfD / Math.abs(dy || 0.001)) * 0.96;
  const edgeEnd = 1 - edgeStart;
  if (edgeEnd <= edgeStart) return '';

  const widthHalf = isOuterRing ? 8.2 : 12;
  const nx = (-dy / length) * widthHalf;
  const ny = (dx / length) * widthHalf;

  let parts = '';
  const steps = isOuterRing ? 10 : 13;
  const zStart = fromZone.h + 10;
  const zEnd = toZone.h + 10;

  // Mid-span architectural support pier rising from Courtyard Plaza
  const midX = fromZone.x + dx * 0.5;
  const midY = fromZone.y + dy * 0.5;
  const midZ = (zStart + zEnd) * 0.5;
  parts += box(midX - 4.5, midY - 4.5, -4, 9, 9, Math.max(8, midZ + 2), isNight ? '#26355c' : '#94a3b8');

  for (let k = 0; k < steps; k++) {
    const t0 = edgeStart + ((edgeEnd - edgeStart) * k) / steps;
    const t1 = edgeStart + ((edgeEnd - edgeStart) * (k + 1)) / steps;
    const x0 = fromZone.x + dx * t0;
    const y0 = fromZone.y + dy * t0;
    const x1 = fromZone.x + dx * t1;
    const y1 = fromZone.y + dy * t1;
    const z = zStart + ((zEnd - zStart) * k) / Math.max(1, steps - 1);
    const deckColor = isNight
      ? isOuterRing
        ? k % 2
          ? '#1e2b4d'
          : '#263761'
        : k % 2
          ? '#24345c'
          : '#304578'
      : isOuterRing
        ? k % 2
          ? '#cbd5e1'
          : '#dde6f2'
        : k % 2
          ? '#c4d3e8'
          : '#e5eef9';
    parts += face(
      [
        [x0 - nx, y0 - ny, z],
        [x1 - nx, y1 - ny, z],
        [x1 + nx, y1 + ny, z],
        [x0 + nx, y0 + ny, z],
      ],
      deckColor,
    );
  }

  // Tempered glass balustrades + brushed steel handrails
  for (const side of [-1, 1]) {
    const aBot = iso(fromZone.x + dx * edgeStart + side * nx, fromZone.y + dy * edgeStart + side * ny, zStart);
    const bBot = iso(fromZone.x + dx * edgeEnd + side * nx, fromZone.y + dy * edgeEnd + side * ny, zEnd);
    const aTop = iso(fromZone.x + dx * edgeStart + side * nx, fromZone.y + dy * edgeStart + side * ny, zStart + 10.5);
    const bTop = iso(fromZone.x + dx * edgeEnd + side * nx, fromZone.y + dy * edgeEnd + side * ny, zEnd + 10.5);

    parts += poly([aBot, bBot, bTop, aTop], '#93c5fd', 'fill-opacity="0.24"');
    parts += `<path d="M${aTop.join(' ')} L${bTop.join(' ')}" stroke="#64748b" stroke-width="1.6" fill="none"/>`;
  }

  // Animated workflow energy stream along skybridge
  if (showLinks && statusMode !== 'idle') {
    const pStart = iso(fromZone.x + dx * edgeStart, fromZone.y + dy * edgeStart, zStart + 2.5);
    const pEnd = iso(fromZone.x + dx * edgeEnd, fromZone.y + dy * edgeEnd, zEnd + 2.5);
    if (statusMode === 'active') {
      parts += `<path d="M${pStart.join(' ')} L${pEnd.join(' ')}" stroke="#3b82f6" stroke-width="5" stroke-opacity="0.28" fill="none"/>`;
      parts += `<path d="M${pStart.join(' ')} L${pEnd.join(' ')}" stroke="#2563eb" stroke-width="2.6" fill="none" class="bridge-energy-active"/>`;
    } else if (statusMode === 'queued') {
      parts += `<path d="M${pStart.join(' ')} L${pEnd.join(' ')}" stroke="#f59e0b" stroke-width="2.2" fill="none" class="bridge-energy-queued"/>`;
    } else if (statusMode === 'done') {
      parts += `<path d="M${pStart.join(' ')} L${pEnd.join(' ')}" stroke="#10b981" stroke-width="1.6" stroke-opacity="0.58" fill="none"/>`;
    }
  }

  return parts;
}

function buildPavilionInterior(zone, z, isNight) {
  let art = '';
  const i = zone.index;

  // Architectural rear glass curtain wall & side gallery partition
  art += box(-84, -69, z, 168, 3.8, 4.5, '#64748b');
  art += glassPanel(-82, -68.5, z + 4.5, 164, 2.5, 42, '#bae6fd', isNight ? 0.22 : 0.36);
  for (let m = 0; m <= 4; m++) {
    art += box(-82 + m * 40.5, -69, z + 4.5, 2.2, 3.2, 43, '#475569');
  }

  // Cantilevered Architectural Skylight Pergola Ribs (gives true multi-story building volume without occluding interior!)
  art += box(-83, -69.5, z + 46.5, 166, 4, 3, '#334155');
  for (let rib = 0; rib < 4; rib++) {
    art += box(-72 + rib * 46, -68, z + 47, 3.2, 34, 2, isNight ? '#475569' : '#64748b');
  }
  art += glassPanel(-76, -67, z + 48.5, 152, 30, 1, '#e0f2fe', isNight ? 0.14 : 0.24);

  // Left glass gallery wall
  art += box(-84, -69, z, 3.8, 122, 4.5, '#64748b');
  art += glassPanel(-83.5, -66, z + 4.5, 2.5, 112, 36, '#bae6fd', isNight ? 0.16 : 0.26);

  // Decorative woven floor trim along front edge
  for (let k = 0; k < 15; k++) {
    art += box(-78 + k * 10.8, 62, z, 7.6, 2.5, 0.6, k % 2 ? '#f6e7c8' : '#ffffff');
  }

  // Bespoke Equipment per Department
  if (i === 0) {
    // 👑 Điều phối — Executive Command Penthouse
    art += box(-60, -54, z, 120, 52, 3, shade(zone.color, 0.92));
    art += box(-54, -63, z + 8, 102, 2.5, 31, '#f8fafc');
    for (let col = 0; col < 4; col++) {
      art += box(-49 + col * 24, -60.2, z + 32, 19, 0.8, 4.2, DYES[col]);
      for (let row = 0; row < 2; row++) {
        art += box(-49 + col * 24, -60.2, z + 13 + row * 8.5, 18, 0.8, 6.2, '#e2e8f0');
      }
    }
    art += props.execDesk(-44, -30, z + 3, '#38bdf8');
    // Central Holographic Collection Table projecting mini 3D Hoodie!
    art += box(24, 14, z, 38, 28, 12, '#1e293b', '#38bdf8');
    art += oval(43, 28, z + 12.5, 14, 6.8, '#38bdf8', 'opacity="0.48"');
    const [hx, hy] = iso(43, 28, z + 13);
    art += `<polygon points="${hx - 12},${hy} ${hx + 12},${hy} ${hx + 20},${hy - 29} ${hx - 20},${hy - 29}" fill="url(#holoCone)"/>`;
    art += hoodieShowcase(43, 28, z + 12, '#0f172a', '#67e8f9', false);
    art += props.stool(-54, 28, z, '#92400e') + props.stool(-36, 36, z, '#92400e');
    art += props.lushPlant(62, -52, z) + props.lushPlant(-74, 46, z);
  } else if (i === 1) {
    // 🔍 Nghiên cứu — Trend & Moodboard Intelligence Lab
    for (let p = 0; p < 3; p++) {
      art += box(-66 + p * 44, -63, z + 7, 38, 2.5, 31, '#fffbeb');
      for (let sw = 0; sw < 4; sw++) {
        art += box(-62 + p * 44 + sw * 8.2, -60.2, z + 12 + (sw % 2) * 7, 6.8, 0.8, 12, DYES[(p + sw) % DYES.length]);
      }
    }
    art += props.execDesk(-44, -18, z, '#2dd4bf');
    art += box(22, -32, z, 42, 20, 14, '#e2e8f0');
    for (let b = 0; b < 6; b++) {
      art += box(26 + b * 6, -28, z + 14, 4.2, 12, 6, DYES[b % DYES.length]);
    }
    art += box(2, 32, z, 4, 4, 12, '#64748b') + oval(4, 34, z + 13, 20, 9.5, '#f8fafc', 'stroke="#94a3b8" stroke-width="1"');
    art += props.stool(-18, 32, z, '#0f766e') + props.stool(24, 34, z, '#0f766e');
    art += props.lushPlant(62, 42, z) + props.lushPlant(-74, 44, z);
  } else if (i === 2) {
    // 🧵 Vật liệu — Digital Textile Vault & PBR Scanner Lab
    for (let bay = 0; bay < 3; bay++) {
      const bx = -64 + bay * 42;
      art += box(bx, -61, z, 36, 14, 36, '#7c5e42');
      for (let shelf = 0; shelf < 2; shelf++) {
        for (let r = 0; r < 4; r++) {
          art += box(bx + 3 + r * 8, -58, z + 4 + shelf * 16, 6.2, 10, 11, DYES[(bay + shelf + r) % DYES.length]);
        }
      }
    }
    art += box(-58, 2, z, 50, 25, 15, '#e2e8f0');
    art += box(-52, 6, z + 15, 25, 17, 2.2, '#0f172a');
    art += face([[-50, 8, z + 17.4], [-29, 8, z + 17.4], [-29, 21, z + 17.4], [-50, 21, z + 17.4]], '#38bdf8', 'fill-opacity="0.55"');
    art += box(-21, 5, z + 15, 11, 2, 11, '#1e293b') + box(-19, 7.2, z + 17, 7.5, 0.5, 7, '#6ee7b7');
    for (let k = 0; k < 6; k++) {
      art += props.fabricRoll(18 + (k % 3) * 14, 4 + Math.floor(k / 3) * 16, z, k);
    }
    art += props.lushPlant(62, 44, z) + props.lushPlant(-74, 44, z);
  } else if (i === 3) {
    // 🎨 Thiết kế — 3D Couture & CAD Sculpting Atelier
    art += box(-60, -63, z + 8, 116, 2.5, 30, '#fff7ed');
    for (let k = 0; k < 5; k++) {
      art += box(-54 + k * 22, -60.2, z + 13, 17, 0.8, 20, k === 2 ? '#1e293b' : DYES[k]);
    }
    art += props.execDesk(-54, -18, z, '#f472b6');
    art += hoodieShowcase(36, -22, z, '#181c24', '#f8fafc', true);
    art += dressForm(58, 4, z, '#e11d48');
    art += box(-42, 24, z, 46, 24, 14, '#f5ebe0', '#b08968');
    art += box(-34, 28, z + 14.2, 24, 15, 1.4, '#1e293b');
    art += props.lushPlant(60, 44, z) + props.lushPlant(-74, 46, z);
  } else if (i === 4) {
    // 📐 Kỹ thuật — Precision QA & glTF Validation Lab
    art += box(-58, -63, z + 8, 112, 2.5, 29, '#0f172a');
    for (let bar = 0; bar < 4; bar++) {
      art += box(-50 + bar * 26, -60, z + 14, 20, 0.8, 17, bar === 3 ? '#f59e0b' : '#10b981');
    }
    art += oval(40, -18, z + 1.5, 24, 11.5, 'none', 'stroke="#38bdf8" stroke-width="1.3" stroke-dasharray="4 3"');
    art += hoodieShowcase(40, -18, z, '#1e293b', '#e2e8f0', true);
    art += box(-58, -12, z, 56, 26, 15, '#cbd5e1');
    art += box(-54, -8, z + 15, 48, 18, 1.8, '#e0f2fe', '#38bdf8');
    art += box(-44, -3, z + 17, 26, 10, 0.8, '#334155');
    art += box(-50, 26, z, 46, 20, 14, '#334155');
    art += box(-44, 28, z + 14, 18, 2, 11, '#0f172a') + box(-22, 28, z + 14, 18, 2, 11, '#0f172a');
    art += props.lushPlant(60, 44, z) + props.lushPlant(-74, 44, z);
  } else if (i === 5) {
    // 📸 Studio hình ảnh — 360° Cyclorama & WebGL Visual Studio
    art += box(-60, -61, z, 116, 42, 2.5, '#f8fafc');
    art += box(-60, -61, z + 2.5, 116, 5, 40, '#ffffff');
    art += box(-60, -61, z + 2.5, 5, 42, 40, '#f1f5f9');
    art += oval(-2, -36, z + 3, 25, 12, '#e2e8f0', 'stroke="#8b5cf6" stroke-width="1.4"');
    art += hoodieShowcase(-2, -36, z + 2.5, '#141821', '#f8fafc', true);
    art += props.softboxLight(-54, 2, z);
    art += props.softboxLight(46, -4, z);
    art += box(-2, 14, z, 3.5, 3.5, 24, '#334155') + box(-7, 10, z + 24, 13, 11, 8, '#0f172a') + box(-3, 6, z + 26, 5, 5, 5, '#38bdf8');
    art += box(22, 24, z, 38, 20, 14, '#1e293b');
    art += box(28, 27, z + 14, 24, 2, 14, '#0f172a') + box(30, 29.2, z + 16, 20, 0.6, 10, '#a78bfa');
    art += props.lushPlant(-74, 44, z) + props.lushPlant(62, 44, z);
  } else if (i === 6) {
    // ✨ Sàn trưng bày — Grand Central Catwalk Rotunda & Panoramic Runway Wall
    art += box(-70, -50, z, 140, 100, 5, isNight ? '#1e293b' : '#f8fafc', '#38bdf8');
    art += box(-58, -26, z + 5, 116, 52, 4.8, isNight ? '#0f172a' : '#fffbeb', '#f59e0b');

    // Panoramic Runway LED Backdrop Screen at rear of Catwalk
    art += box(-54, -56, z + 5, 108, 4, 38, '#0f172a', '#38bdf8');
    art += box(-48, -51.8, z + 10, 96, 0.8, 28, '#1e293b');
    art += box(-18, -51, z + 14, 36, 0.8, 20, '#38bdf8');

    for (let led = 0; led < 7; led++) {
      art += oval(-46 + led * 15.2, -21, z + 10.2, 2.2, 1.1, '#38bdf8');
      art += oval(-46 + led * 15.2, 21, z + 10.2, 2.2, 1.1, '#38bdf8');
    }
    art += hoodieShowcase(0, 0, z + 9.8, '#111622', '#fef3c7', true);
    art += dressForm(-38, -2, z + 9.8, '#e11d48');
    art += dressForm(38, -2, z + 9.8, '#2563eb');
    art += dressForm(-22, -34, z + 5, '#f59e0b');
    art += dressForm(22, -34, z + 5, '#10b981');

    art += box(-50, 33, z + 5, 44, 10, 5.5, '#7f1d1d') + box(6, 33, z + 5, 44, 10, 5.5, '#7f1d1d');

    // Overhead Architectural Spotlight Truss & Dual-Color Light Cones
    art += box(-62, -28, z + 9.8, 3.2, 3.2, 54, '#475569') + box(58.8, -28, z + 9.8, 3.2, 3.2, 54, '#475569');
    art += box(-62, 24, z + 9.8, 3.2, 3.2, 54, '#475569') + box(58.8, 24, z + 9.8, 3.2, 3.2, 54, '#475569');
    art += box(-63, -29, z + 63, 126, 3.2, 3.2, '#334155') + box(-63, 24, z + 63, 126, 3.2, 3.2, '#334155');
    art += box(-63, -29, z + 63, 3.2, 56, 3.2, '#334155') + box(59.8, -29, z + 63, 3.2, 56, 3.2, '#334155');

    for (const [sx, grad] of [[-36, 'url(#spotlightCyan)'], [0, 'url(#spotlightBeam)'], [36, 'url(#spotlightCyan)']]) {
      const [topX, topY] = iso(sx, 0, z + 63);
      const [botX, botY] = iso(sx, 0, z + 10);
      art += `<polygon points="${topX - 4},${topY} ${topX + 4},${topY} ${botX + 21},${botY} ${botX - 21},${botY}" fill="${grad}" pointer-events="none"/>`;
    }
    art += props.lushPlant(-78, 50, z) + props.lushPlant(68, 50, z);
  }

  return art;
}

function renderCharacterFigure(index, isWorking, hasToken) {
  const skinPalette = ['#eab38f', '#d49a76', '#f3c8ad', '#c58b68', '#e8b494', '#f0c4a8'];
  const outfitPalette = ['#b45309', '#0e7490', '#3f6212', '#be123c', '#1d4ed8', '#6d28d9'];
  const skin = hasToken ? skinPalette[index % 6] : '#cbd5e1';
  const outfit = hasToken ? outfitPalette[index % 6] : '#64748b';
  const hair = ['#1e293b', '#3b2820', '#27272a', '#451a03', '#0f172a', '#312e81'][index % 6];

  let ring = '';
  if (!hasToken) {
    ring = `<ellipse cx="0" cy="2" rx="16" ry="7.5" fill="none" stroke="#ef4444" stroke-width="2.2" class="pulse-out"/>`;
  } else if (isWorking) {
    ring = `<ellipse cx="0" cy="2" rx="16" ry="7.5" fill="rgba(37,99,235,0.18)" stroke="#3b82f6" stroke-width="2" class="pulse-out"/>`;
  }

  const armPath = isWorking ? 'M1 -23 l8 3 l8 -7' : 'M1 -23 l5 6 l5 1';
  return `${ring}
    <ellipse rx="9" ry="3.8" fill="#0f172a" opacity="0.22"/>
    <g transform="scale(${index % 2 ? -1.25 : 1.25} 1.25)">
      <path d="M-3 -14 l-1 13 M2.5 -14 l2.5 13" fill="none" stroke="#1e293b" stroke-width="3.8" stroke-linecap="round"/>
      <path d="M-5.5 -27 Q0 -30 5.5 -26 L5 -13 Q0 -11 -6 -14 Z" fill="${outfit}"/>
      <path d="${armPath}" fill="none" stroke="${skin}" stroke-width="2.8" stroke-linecap="round"/>
      <ellipse cy="-33.5" rx="4.6" ry="5.5" fill="${skin}"/>
      <path d="M-4.5 -33 Q-6 -40 1 -39.5 Q6.5 -39.5 5 -34 L0 -35 Z" fill="${hair}"/>
    </g>`;
}

function buildPavilionPillSpecs(zone, deptSummary, tok, showCallouts) {
  const i = zone.index;
  const h = zone.h;
  const [u, v] = iso(zone.x, zone.y, 0);
  const labelY = 66 - h;
  const pills = [];

  const titleText = i < 6 ? `${zone.icon} ${zone.label} · ${zone.staffName}` : `${zone.icon} ${zone.label}`;
  const titleEst = estimateSvgTextWidth(titleText, 10.5);
  const titleW = Math.max(138, titleEst + 24);
  pills.push({
    kind: 'nameplate',
    zoneIndex: i,
    text: titleText,
    localX: -titleW / 2,
    localY: labelY - 11,
    width: titleW,
    height: 22,
    estTextWidth: titleEst,
    centerY: labelY,
  });

  if (i === 6) {
    const catTxt = '✨ CATWALK TRUNG TÂM';
    const catEst = estimateSvgTextWidth(catTxt, 9.2);
    const catW = Math.max(134, catEst + 22);
    pills.push({
      kind: 'subbadge',
      zoneIndex: i,
      text: catTxt,
      localX: -catW / 2,
      localY: labelY + 23 - 9,
      width: catW,
      height: 18,
      estTextWidth: catEst,
      centerY: labelY + 23,
    });
  } else if (tok) {
    const subEst = estimateSvgTextWidth(tok.shortBadge, 9.2);
    const subW = Math.max(118, subEst + 22);
    pills.push({
      kind: 'subbadge',
      zoneIndex: i,
      text: tok.shortBadge,
      localX: -subW / 2,
      localY: labelY + 23 - 9,
      width: subW,
      height: 18,
      estTextWidth: subEst,
      centerY: labelY + 23,
    });
  }

  if (showCallouts && deptSummary && i < 6) {
    const topY = -96 - h;
    if (deptSummary.activeCount > 0) {
      const active = deptSummary.activeItems[0];
      const snippet = cleanOneLine(`${active.id} · ${active.title}`, 28);
      const callEst = estimateSvgTextWidth(snippet, 9.5);
      const callW = Math.max(176, callEst + 38);
      pills.push({
        kind: 'callout-active',
        zoneIndex: i,
        text: snippet,
        localX: -callW / 2,
        localY: topY - 12,
        width: callW,
        height: 24,
        estTextWidth: callEst,
        centerY: topY,
      });
    } else if (deptSummary.reviewCount > 0 || deptSummary.queuedCount > 0) {
      const nextItem = deptSummary.reviewItems[0] || deptSummary.queuedItems[0];
      const snippet = cleanOneLine(`⏳ ${nextItem.id} · ${nextItem.title}`, 28);
      const callEst = estimateSvgTextWidth(snippet, 9.2);
      const callW = Math.max(166, callEst + 26);
      pills.push({
        kind: 'callout-queued',
        zoneIndex: i,
        text: snippet,
        localX: -callW / 2,
        localY: topY - 11,
        width: callW,
        height: 22,
        estTextWidth: callEst,
        centerY: topY,
      });
    } else if (deptSummary.doneCount > 0) {
      const doneTxt = `✓ ${deptSummary.doneCount} việc hoàn thành`;
      const callEst = estimateSvgTextWidth(doneTxt, 9);
      const callW = Math.max(112, callEst + 22);
      pills.push({
        kind: 'callout-done',
        zoneIndex: i,
        text: doneTxt,
        localX: -callW / 2,
        localY: topY + 4 - 9.5,
        width: callW,
        height: 19,
        estTextWidth: callEst,
        centerY: topY + 4,
      });
    }
  }

  return pills.map((p) => ({
    ...p,
    x1: u + p.localX,
    y1: v + p.localY,
    x2: u + p.localX + p.width,
    y2: v + p.localY + p.height,
  }));
}

export function computeSceneBoundsAndCollisions(
  workloads,
  members = [],
  liveTokenUsage = null,
  liveRuntimeFallback = null,
  { showCallouts = true } = {},
) {
  const viewBox = {
    x1: DEFAULT_CX - DEFAULT_VIEW_W / 2,
    y1: DEFAULT_CY - DEFAULT_VIEW_H / 2,
    x2: DEFAULT_CX + DEFAULT_VIEW_W / 2,
    y2: DEFAULT_CY + DEFAULT_VIEW_H / 2,
  };

  const pills = [];
  for (const zone of STUDIO_ZONES) {
    const deptSummary = zone.index < 6 ? workloads?.departments?.[zone.index] || null : null;
    const tok = computeAgentTokenInfo(zone.index, members, liveTokenUsage, liveRuntimeFallback);
    pills.push(...buildPavilionPillSpecs(zone, deptSummary, tok, showCallouts));
  }

  const collisions = [];
  for (let i = 0; i < pills.length; i++) {
    for (let j = i + 1; j < pills.length; j++) {
      const a = pills[i];
      const b = pills[j];
      const overlapX = Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1);
      const overlapY = Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1);
      if (overlapX > 0 && overlapY > 0) {
        collisions.push({ a, b, overlapX, overlapY });
      }
    }
  }

  // Include Citadel Plaza corners & Grand Staircase & Tallest Roof Spire in scene bounds check
  const structuralPoints = [
    iso(-346, -346, 0),
    iso(-346, 346, -26),
    iso(346, -346, -26),
    iso(354, 354, -25),
    iso(STUDIO_ZONES[0].x - 84, STUDIO_ZONES[0].y - 69.5, STUDIO_ZONES[0].h + 59.5),
  ];

  let minX = Math.min(...structuralPoints.map((p) => p[0]), ...pills.map((p) => p.x1));
  let maxX = Math.max(...structuralPoints.map((p) => p[0]), ...pills.map((p) => p.x2));
  let minY = Math.min(...structuralPoints.map((p) => p[1]), ...pills.map((p) => p.y1));
  let maxY = Math.max(...structuralPoints.map((p) => p[1]), ...pills.map((p) => p.y2));

  const overflows = pills.filter((p) => {
    const usable = p.kind === 'callout-active' ? p.width - 28 : p.width - 14;
    return p.estTextWidth > usable;
  });

  return {
    viewBox,
    bounds: { minX, maxX, minY, maxY },
    fitsInViewBox: minX >= viewBox.x1 && maxX <= viewBox.x2 && minY >= viewBox.y1 && maxY <= viewBox.y2,
    pills,
    collisions,
    overflows,
  };
}

function renderPavilion(zone, deptSummary, tok, isSelected, showCallouts, isNight) {
  const i = zone.index;
  const h = zone.h;
  const z = h + 10;
  const [u, v] = iso(zone.x, zone.y, 0);

  let slab = '';
  // Monumental Fluted Support Columns with Stone Plinths rising from Citadel Plaza (-4)
  for (const [cx, cy] of [[-76, -58], [0, -58], [66, -58], [-76, 54], [66, 54]]) {
    slab += box(cx - 2, cy - 2, -4, 14, 14, 4, isNight ? '#475569' : '#cbd5e1');
    slab += box(cx, cy, 0, 10, 10, h + 2, isNight ? '#334155' : '#94a3b8');
  }

  // Stepped Lower Architectural Podium + Main Pavilion Deck
  const deckColor = isSelected ? shade(zone.color, 1.07) : zone.color;
  slab += oval(0, 0, -3, 114, 49, '#0f172a', 'opacity="0.18" filter="url(#shadow)"');
  slab += box(-92, -73, Math.max(0, h - 6), 184, 146, 6, shade(deckColor, 0.85));
  slab += box(-88, -70, Math.max(0, h), 176, 140, 10, deckColor);
  if (h > 6) {
    slab += box(-84, -66, 0, 168, 132, h - 6, shade(deckColor, 0.78));
  }

  // Active Execution Rim Light + Rooftop Beacon Spire when Active!
  if (deptSummary && deptSummary.activeCount > 0) {
    slab += face(
      [
        [-89, -71, z + 0.4],
        [89, -71, z + 0.4],
        [89, 71, z + 0.4],
        [-89, 71, z + 0.4],
      ],
      'none',
      'stroke="#3b82f6" stroke-width="2.8"',
    );
    slab += `<polygon points="-10,${-52 - h} 10,${-52 - h} 22,${-92 - h} -22,${-92 - h}" fill="url(#beaconSpire)" pointer-events="none"/>`;
  } else if (isSelected) {
    slab += face(
      [
        [-89, -71, z + 0.4],
        [89, -71, z + 0.4],
        [89, 71, z + 0.4],
        [-89, 71, z + 0.4],
      ],
      'none',
      'stroke="#f59e0b" stroke-width="2.3"',
    );
  }

  // Front Entrance Steps on Pavilion
  for (let k = 0; k < 4; k++) {
    slab += box(16, 62 + k * 4.5, z - 4 - k * 3.5, 28, 4.5, 3.5, shade(zone.color, 0.94));
  }

  slab += buildPavilionInterior(zone, z, isNight);

  // Render stationary specialist character IN PROPER DEPTH ORDER inside their open pavilion aisle!
  if (i < 6) {
    const [offX, offY] = STAFF_AISLE_OFFSETS[i] || [8, 18];
    const [sx, sy] = iso(offX, offY, z);
    const isWorking = (deptSummary?.activeCount || 0) > 0;
    const hasToken = tok ? tok.hasToken : true;
    const summaryAction = deptSummary?.primaryItem
      ? `${deptSummary.primaryItem.statusLabel}: ${deptSummary.primaryItem.id} ${deptSummary.primaryItem.title}`
      : 'Sẵn sàng nhận việc';

    slab += `<g class="room staff" data-index="${i}" role="button" tabindex="0" aria-label="${esc(`${zone.staffName} · ${zone.label} · ${summaryAction}`)}" transform="translate(${sx} ${sy})">
      ${renderCharacterFigure(i, isWorking, hasToken)}
      <rect x="-24" y="-68" width="48" height="15" rx="7.5" fill="${isWorking ? '#1d4ed8' : '#0f172a'}" stroke="rgba(255,255,255,0.5)" stroke-width="0.9"/>
      <text y="-57.5" text-anchor="middle" fill="#ffffff" font-size="9.2" font-weight="800">${esc(zone.staffName)}</text>
    </g>`;
  }

  // Build collision-free dynamic-width HUD pills
  const pillSpecs = buildPavilionPillSpecs(zone, deptSummary, tok, showCallouts);
  const nameplateSpec = pillSpecs.find((p) => p.kind === 'nameplate');
  const subSpec = pillSpecs.find((p) => p.kind === 'subbadge');
  const calloutSpec = pillSpecs.find((p) => p.kind.startsWith('callout-'));

  const nameplateFill = isSelected ? '#1e3a8a' : isNight ? '#0f172a' : '#ffffff';
  const nameplateText = isSelected || isNight ? '#ffffff' : '#13203b';
  const nameplateBorder = isSelected ? '#60a5fa' : deptSummary?.activeCount > 0 ? '#3b82f6' : '#cbd5e1';

  let subBadgeSvg = '';
  if (subSpec) {
    if (i === 6) {
      subBadgeSvg = `
        <g class="token-badge-svg" transform="translate(0, ${subSpec.centerY})">
          <rect x="${subSpec.localX}" y="-9" width="${subSpec.width}" height="18" rx="9" fill="#ecfdf5" stroke="#34d399" stroke-width="1.3"/>
          <text text-anchor="middle" y="3.5" fill="#047857" font-size="9.2" font-weight="800">${esc(subSpec.text)}</text>
        </g>`;
    } else if (tok) {
      const bg =
        tok.status === 'out'
          ? '#fef2f2'
          : tok.isLow
            ? '#fffbeb'
            : tok.status === 'ok'
              ? '#ecfdf5'
              : '#f8fafc';
      const border =
        tok.status === 'out'
          ? '#ef4444'
          : tok.isLow
            ? '#f59e0b'
            : tok.status === 'ok'
              ? '#22c55e'
              : '#94a3b8';
      const textCol =
        tok.status === 'out'
          ? '#b91c1c'
          : tok.isLow
            ? '#b45309'
            : tok.status === 'ok'
              ? '#15803d'
              : '#334155';

      subBadgeSvg = `
        <g class="token-badge-svg" transform="translate(0, ${subSpec.centerY})">
          <rect x="${subSpec.localX}" y="-9" width="${subSpec.width}" height="18" rx="9" fill="${bg}" stroke="${border}" stroke-width="1.3"/>
          <text text-anchor="middle" y="3.5" fill="${textCol}" font-size="9.2" font-weight="800">${esc(subSpec.text)}</text>
        </g>`;
    }
  }

  let taskCalloutSvg = '';
  if (calloutSpec) {
    if (calloutSpec.kind === 'callout-active') {
      const dotX = calloutSpec.localX + 13;
      taskCalloutSvg = `
        <g class="task-callout-svg" transform="translate(0, ${calloutSpec.centerY})">
          <rect x="${calloutSpec.localX}" y="-12" width="${calloutSpec.width}" height="24" rx="12" fill="#1d4ed8" stroke="#93c5fd" stroke-width="1.5"/>
          <circle cx="${dotX}" cy="0" r="4" fill="#6ee7b7" class="live-beacon"/>
          <text text-anchor="middle" x="7" y="3.5" fill="#ffffff" font-size="9.5" font-weight="800">${esc(calloutSpec.text)}</text>
        </g>`;
    } else if (calloutSpec.kind === 'callout-queued') {
      taskCalloutSvg = `
        <g class="task-callout-svg" transform="translate(0, ${calloutSpec.centerY})">
          <rect x="${calloutSpec.localX}" y="-11" width="${calloutSpec.width}" height="22" rx="11" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.4"/>
          <text text-anchor="middle" y="3" fill="#b45309" font-size="9.2" font-weight="800">${esc(calloutSpec.text)}</text>
        </g>`;
    } else {
      taskCalloutSvg = `
        <g class="task-callout-svg" transform="translate(0, ${calloutSpec.centerY})">
          <rect x="${calloutSpec.localX}" y="-9.5" width="${calloutSpec.width}" height="19" rx="9.5" fill="#ecfdf5" stroke="#6ee7b7" stroke-width="1.2"/>
          <text text-anchor="middle" y="3" fill="#047857" font-size="9" font-weight="800">${esc(calloutSpec.text)}</text>
        </g>`;
    }
  }

  const labelOverlay = `
    <g class="pavilion-hud-overlay">
      ${taskCalloutSvg}
      <g transform="translate(0, ${nameplateSpec.centerY})">
        <rect x="${nameplateSpec.localX}" y="-11" width="${nameplateSpec.width}" height="22" rx="11" fill="${nameplateFill}" stroke="${nameplateBorder}" stroke-width="1.5"/>
        <text text-anchor="middle" y="4" fill="${nameplateText}" font-size="10.5" font-weight="800">${esc(nameplateSpec.text)}</text>
      </g>
      ${subBadgeSvg}
    </g>`;

  return {
    pavilionSvg: `<g class="room" data-index="${i}" tabindex="0" role="button" aria-label="${esc(zone.label)}" transform="translate(${u} ${v})">${slab}</g>`,
    overlaySvg: `<g class="room" data-index="${i}" aria-hidden="true" transform="translate(${u} ${v})">${labelOverlay}</g>`,
  };
}

// ================= INTERACTIVE STUDIO CONTROLLER =================

export function initAtelierXStudio() {
  const svg = document.querySelector('#scene');
  const world = document.querySelector('#world');
  const nav = document.querySelector('#rooms');
  const spotlightEl = document.querySelector('#active-spotlight');
  const taskFlowFooter = document.querySelector('#task-flow');
  const infoLegacy = document.querySelector('#info');

  if (!svg || !world || !nav) return null;

  let cx = DEFAULT_CX;
  let cy = DEFAULT_CY;
  let scale = 1;
  let selected = 0;
  let deptFilter = 'all';
  let sortByActive = true;
  let expandAllDepts = false;
  let showLinks = true;
  let showCallouts = true;
  let activeFocusCursor = 0;
  let expandedDoneDepts = new Set();
  let hasAutoSelected = false;
  let destroyed = false;
  let syncPromise = null;

  let members = [];
  let studioTickets = [];
  let studioTasks = [];
  let liveTokenUsage = null;
  let liveRuntimeFallback = null;
  let codexIdentity = null;
  let activeProjectId = DEFAULT_PROJECT_ID;
  let online = false;
  let activeModalFilter = 'all';
  const assignments = new Map();

  // Initialize Day / Night Runway theme
  let studioTheme = 'day';
  try {
    const saved = localStorage.getItem('atelierx_studio_theme');
    if (saved === 'night' || saved === 'day') {
      studioTheme = saved;
    } else if (localStorage.getItem('crewly-theme') === 'dark') {
      studioTheme = 'night';
    }
  } catch {
    // ignore storage errors
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-studio-theme', studioTheme);
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {
      btn.textContent = studioTheme === 'night' ? '☀️ Sáng' : '🌙 Đêm';
    }
  }
  applyTheme();

  function camera() {
    const w = DEFAULT_VIEW_W / scale;
    const h = DEFAULT_VIEW_H / scale;
    svg.setAttribute('viewBox', [cx - w / 2, cy - h / 2, w, h].join(' '));
    const zoomEl = document.getElementById('zoom-indicator');
    if (zoomEl) {
      zoomEl.textContent = `🔍 ${Math.round(scale * 100)}%`;
    }
  }

  function getWorkloads() {
    return buildDepartmentWorkloads(studioTickets, studioTasks, members);
  }

  function bridgeModeForDept(deptSummary) {
    if (!deptSummary) return 'idle';
    if (deptSummary.activeCount > 0) return 'active';
    if (deptSummary.reviewCount > 0 || deptSummary.queuedCount > 0) return 'queued';
    if (deptSummary.doneCount > 0) return 'done';
    return 'idle';
  }

  function renderWorld(workloads) {
    const isNight = studioTheme === 'night';
    const byDept = workloads.departments;
    const hub = STUDIO_ZONES[6];

    let sceneHtml = renderCampusPlaza(isNight);

    // Outer architectural gallery walkways connecting neighboring wings
    const outerPairs = [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [3, 5],
      [4, 5],
    ];
    for (const [aIdx, bIdx] of outerPairs) {
      const mode =
        byDept[aIdx]?.activeCount > 0 || byDept[bIdx]?.activeCount > 0
          ? 'active'
          : 'idle';
      sceneHtml += renderSkybridge(STUDIO_ZONES[aIdx], STUDIO_ZONES[bIdx], mode, showLinks, true, isNight);
    }

    // 6 Primary Radial Skybridges to Central Catwalk Hub
    for (let i = 0; i < 6; i++) {
      sceneHtml += renderSkybridge(
        STUDIO_ZONES[i],
        hub,
        bridgeModeForDept(byDept[i]),
        showLinks,
        false,
        isNight,
      );
    }

    // Painter's sort back-to-front by (x + y)
    const sortedZones = STUDIO_ZONES.slice().sort((a, b) => a.x + a.y - (b.x + b.y));
    const overlays = [];

    for (const zone of sortedZones) {
      const deptSummary = zone.index < 6 ? byDept[zone.index] : null;
      const tok = computeAgentTokenInfo(zone.index, members, liveTokenUsage, liveRuntimeFallback);
      const { pavilionSvg, overlaySvg } = renderPavilion(
        zone,
        deptSummary,
        tok,
        selected === zone.index,
        showCallouts,
        isNight,
      );
      sceneHtml += pavilionSvg;
      overlays.push(overlaySvg);
    }

    // Corridor walker layer sits BEFORE hud-overlays so HUD badges are never occluded!
    world.innerHTML =
      sceneHtml +
      `<g class="corridor-walkers"></g>` +
      `<g class="hud-overlays">${overlays.join('')}</g>`;

    renderCorridorWalkers(byDept);
  }

  function renderCorridorWalkers(byDept) {
    const walkerLayer = world.querySelector('.corridor-walkers');
    if (!walkerLayer) return;
    const ns = 'http://www.w3.org/2000/svg';

    STUDIO_ZONES.slice(1, 6).forEach((zone) => {
      const i = zone.index;
      const elapsed = Date.now() - (assignments.get(i)?.start || 0);
      if (elapsed >= 20000) return;

      const deptSummary = byDept[i];
      const tok = computeAgentTokenInfo(i, members, liveTokenUsage, liveRuntimeFallback);
      const [offX, offY] = STAFF_AISLE_OFFSETS[i] || [8, 18];
      const [x, y] = iso(zone.x + offX, zone.y + offY, zone.h + 10);
      const [hx, hy] = iso(0, 0, STUDIO_ZONES[6].h + 14);
      const [lx, ly] = iso(
        STUDIO_ZONES[0].x + 28 + (i % 3) * 7,
        STUDIO_ZONES[0].y + 18 + i * 3,
        STUDIO_ZONES[0].h + 10,
      );

      const node = document.createElementNS(ns, 'g');
      node.setAttribute('class', 'room courier');
      node.dataset.index = String(i);
      node.innerHTML = renderCharacterFigure(i, (deptSummary?.activeCount || 0) > 0, tok ? tok.hasToken : true);
      node.setAttribute('transform', `translate(${x} ${y})`);

      const d = `M0 0 L${hx - x} ${hy - y} L${lx - x} ${ly - y} L${lx - x} ${ly - y} L${hx - x} ${hy - y} L0 0`;
      const motion = document.createElementNS(ns, 'animateMotion');
      motion.setAttribute('path', d);
      motion.setAttribute('dur', '20s');
      motion.setAttribute('calcMode', 'linear');
      motion.setAttribute('keyTimes', '0;.18;.32;.68;.82;1');
      motion.setAttribute('begin', 'indefinite');
      node.append(motion);
      walkerLayer.append(node);

      if (
        typeof matchMedia === 'function' &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches &&
        typeof motion.beginElementAt === 'function'
      ) {
        motion.beginElementAt(-elapsed / 1000);
      }
    });
  }

  function updateHeaderTelemetry(workloads) {
    const { totals } = workloads;

    const kpiActive = document.getElementById('kpi-active-work');
    if (kpiActive) {
      kpiActive.innerHTML = `<span class="kpi-dot ${totals.active > 0 ? 'live-beacon' : ''}" style="background:#2563eb"></span><span>Đang làm: <strong>${totals.active}</strong></span>`;
    }
    const kpiQueued = document.getElementById('kpi-queued-work');
    if (kpiQueued) {
      kpiQueued.innerHTML = `<span class="kpi-dot" style="background:#f59e0b"></span><span>Chờ / Duyệt: <strong>${totals.pendingAttention}</strong></span>`;
    }
    const kpiDone = document.getElementById('kpi-done-work');
    if (kpiDone) {
      kpiDone.innerHTML = `<span class="kpi-dot" style="background:#10b981"></span><span>Xong: <strong>${totals.done}/${totals.total}</strong> (${totals.completionPct}%)</span>`;
    }

    // Update filter tab counts
    const activeDeptCount = workloads.departments.filter((d) => d.activeCount > 0).length;
    const queuedDeptCount = workloads.departments.filter((d) => d.queuedCount + d.reviewCount > 0).length;
    const doneDeptCount = workloads.departments.filter((d) => d.doneCount > 0).length;

    document.querySelectorAll('[data-dept-filter]').forEach((btn) => {
      const f = btn.dataset.deptFilter;
      if (f === 'all') btn.textContent = 'Tất cả (7)';
      else if (f === 'active') btn.textContent = `⚡ Đang làm (${activeDeptCount})`;
      else if (f === 'queued') btn.textContent = `⏳ Chờ / Duyệt (${queuedDeptCount})`;
      else if (f === 'done') btn.textContent = `✅ Đã xong (${doneDeptCount})`;
      btn.classList.toggle('active', f === deptFilter);
    });

    // Update Token & Runtime Fallback Header Summary
    const allAgents = [0, 1, 2, 3, 4, 5]
      .map((idx) => computeAgentTokenInfo(idx, members, liveTokenUsage, liveRuntimeFallback))
      .filter(Boolean);
    const okCount = allAgents.filter((a) => a.status === 'ok').length;
    const fallbackCount = allAgents.filter((a) => a.status !== 'out' && a.isRunningOnFallback).length;
    const unlimitedCount = allAgents.filter((a) => a.status === 'unlimited').length;
    const outCount = allAgents.filter((a) => a.status === 'out').length;
    const unknownCount = allAgents.filter((a) => a.status === 'unknown').length;

    const summaryEl = document.querySelector('#token-summary-indicator');
    if (summaryEl) {
      if (outCount > 0) {
        summaryEl.innerHTML = `<span style="color:#059669">🟢 ${6 - outCount} Sẵn sàng</span> · <span style="color:#dc2626">🔴 ${outCount} Hết quota</span>`;
      } else if (fallbackCount > 0) {
        summaryEl.innerHTML = `<span style="color:#d97706">🟠 ${fallbackCount} Dự phòng</span> · <span style="color:#059669">🟢 ${6 - fallbackCount} Ổn định</span>`;
      } else if (okCount > 0) {
        summaryEl.innerHTML = `<span style="color:#059669">🟢 ${okCount}/6 Còn hạn mức</span>`;
      } else if (unlimitedCount > 0) {
        summaryEl.textContent = `⚡ ${unlimitedCount}/6 Agent không giới hạn`;
      } else if (unknownCount > 0) {
        summaryEl.textContent = `⚡ 6 Agent · Chưa đặt cap`;
      }
    }
  }

  function renderActiveSpotlight(workloads) {
    if (!spotlightEl) return;
    spotlightEl.replaceChildren();

    const activeItems = workloads.activeSpotlightItems;
    if (activeItems.length === 0) {
      spotlightEl.classList.add('idle-state');
      const head = document.createElement('div');
      head.className = 'spotlight-header';
      head.innerHTML = `<span class="spotlight-title" style="color:var(--text-2)">✨ Trạng thái thực thi trực tiếp</span><span style="font-size:11px;color:var(--text-3);font-weight:700">${workloads.totals.done}/${workloads.totals.total} hoàn tất</span>`;
      const sub = document.createElement('div');
      sub.style.cssText = 'font-size:12px;color:var(--text-2)';
      sub.textContent =
        workloads.totals.pendingAttention > 0
          ? `Hiện không có tác vụ đang chạy · Có ${workloads.totals.pendingAttention} công việc sẵn sàng hoặc chờ kiểm duyệt trong các ban bên dưới.`
          : online
            ? 'Tất cả phòng ban hiện đang rảnh và sẵn sàng nhận đơn thiết kế mới.'
            : 'Đang chờ đồng bộ dữ liệu công việc trực tiếp từ máy chủ Crewly…';
      spotlightEl.append(head, sub);
      return;
    }

    spotlightEl.classList.remove('idle-state');
    const head = document.createElement('div');
    head.className = 'spotlight-header';
    head.innerHTML = `
      <span class="spotlight-title">
        <span class="kpi-dot live-beacon" style="background:#2563eb"></span>
        ĐANG THỰC HIỆN TRONG XƯỞNG (${activeItems.length})
      </span>
      <span style="font-size:10.5px;font-weight:700;color:var(--text-2)">Bấm để tới ban</span>
    `;
    spotlightEl.append(head);

    const list = document.createElement('div');
    list.className = 'spotlight-list';

    for (const item of activeItems) {
      const zone = STUDIO_ZONES[item.deptIndex];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'spotlight-item';
      const subProgress = item.blockerNote
        ? `⚠️ ${cleanOneLine(item.blockerNote, 96)}`
        : item.latestLog?.text
          ? `💬 ${cleanOneLine(item.latestLog.text, 96)}`
          : '';
      btn.innerHTML = `
        <div class="spotlight-item-top">
          <span class="spotlight-dept-tag">${esc(zone.icon)} Ban ${esc(zone.label)} · ${esc(zone.staffName)}</span>
          <span style="color:var(--active-text)">⚡ ${esc(item.statusLabel)}${item.hasBlocker ? ' · ⚠️ Nghẽn phụ thuộc' : ''}</span>
        </div>
        <div class="spotlight-item-main">
          <span class="task-id-badge" style="margin-right:5px">${esc(item.id)}</span>${esc(item.title)}
        </div>
        ${subProgress ? `<div class="spotlight-item-sub">${esc(subProgress)}</div>` : ''}
      `;
      btn.addEventListener('click', () => selectDepartment(item.deptIndex, true));
      list.append(btn);
    }

    spotlightEl.append(list);
  }

  function createTaskCardElement(item, isDetailed) {
    const card = document.createElement('div');
    card.className = `dept-task-card bucket-${item.bucket}`;

    const tagClass =
      item.bucket === 'active'
        ? 'tag-active'
        : item.bucket === 'review'
          ? 'tag-review'
          : item.bucket === 'queued'
            ? 'tag-queued'
            : 'tag-done';

    const tagIcon =
      item.bucket === 'active'
        ? '⚡ '
        : item.bucket === 'review'
          ? '⚠️ '
          : item.bucket === 'queued'
            ? '⏳ '
            : '✓ ';

    const top = document.createElement('div');
    top.className = 'task-card-top';
    top.innerHTML = `
      <span class="task-code-cluster">
        <span class="task-id-badge">${esc(item.id)}</span>
        ${item.priority ? `<span class="task-priority-badge">${esc(item.priority)}</span>` : ''}
      </span>
      <span class="task-status-tag ${tagClass}">${tagIcon}${esc(item.statusLabel)}</span>
    `;
    card.append(top);

    const titleEl = document.createElement('div');
    titleEl.className = 'task-title-text';
    titleEl.textContent = item.title;
    card.append(titleEl);

    const showFull = isDetailed || item.bucket === 'active' || item.bucket === 'review';

    if (showFull && (item.brief.goal || item.brief.outcome || item.brief.summary)) {
      const briefBox = document.createElement('div');
      briefBox.className = 'task-brief-box';
      if (item.brief.goal) {
        const line = document.createElement('div');
        line.className = 'task-brief-line';
        line.innerHTML = `<strong>Mục tiêu:</strong> ${esc(cleanOneLine(item.brief.goal, isDetailed ? 240 : 140))}`;
        briefBox.append(line);
      }
      if (item.brief.outcome && (isDetailed || item.bucket === 'active')) {
        const line = document.createElement('div');
        line.className = 'task-brief-line';
        line.innerHTML = `<strong>Đầu ra:</strong> ${esc(cleanOneLine(item.brief.outcome, isDetailed ? 220 : 130))}`;
        briefBox.append(line);
      }
      if (!item.brief.goal && item.brief.summary) {
        const line = document.createElement('div');
        line.className = 'task-brief-line';
        line.textContent = cleanOneLine(item.brief.summary, isDetailed ? 220 : 140);
        briefBox.append(line);
      }
      if (briefBox.childElementCount > 0) {
        card.append(briefBox);
      }
    }

    if (item.hasBlocker && (item.blockerNote || item.liveStatusLabel)) {
      const blk = document.createElement('div');
      blk.className = 'task-blocker-note';
      blk.textContent = item.blockerNote
        ? `⚠️ Ghi chú thực thi: ${item.blockerNote}`
        : `⚠️ Trạng thái WorkItem: ${item.liveStatusLabel}`;
      card.append(blk);
    }

    if (showFull && (item.criteriaTotal > 0 || item.liveStatusLabel)) {
      const meta = document.createElement('div');
      meta.className = 'task-meta-footer';
      const leftTxt =
        item.criteriaTotal > 0
          ? `📋 Nghiệm thu: ${item.criteriaDone}/${item.criteriaTotal} tiêu chí`
          : '📋 Công việc trực tiếp';
      const rightTxt = item.liveStatusLabel ? `Luồng chạy: ${item.liveStatusLabel}` : '';
      meta.innerHTML = `<span>${esc(leftTxt)}</span>${rightTxt ? `<span>${esc(rightTxt)}</span>` : ''}`;
      card.append(meta);
    }

    // Show latest progress log on ALL active tasks (when not duplicating blockerNote) and on expanded cards!
    const shouldShowLog =
      Boolean(item.latestLog && item.latestLog.text) &&
      (isDetailed || (item.bucket === 'active' && !item.blockerNote));

    if (shouldShowLog) {
      const logDiv = document.createElement('div');
      logDiv.className = 'task-log-snippet';
      const prefix = item.latestLog.time ? `[${item.latestLog.time}] ` : '';
      logDiv.textContent = `💬 Cập nhật mới nhất: ${prefix}${cleanOneLine(item.latestLog.text, isDetailed ? 185 : 130)}`;
      card.append(logDiv);
    }

    return card;
  }

  function computeOrderedDepartmentIndices(workloads) {
    const base = [0, 1, 2, 3, 4, 5].filter((idx) => {
      if (deptFilter === 'all') return true;
      const d = workloads.departments[idx];
      if (deptFilter === 'active') return d.activeCount > 0;
      if (deptFilter === 'queued') return d.queuedCount + d.reviewCount > 0;
      if (deptFilter === 'done') return d.doneCount > 0;
      return true;
    });

    if (sortByActive && workloads.totals.total > 0) {
      const deptUrgency = (idx) => {
        const d = workloads.departments[idx];
        if (d.activeCount > 0) return 0;
        if (d.reviewCount > 0) return 1;
        if (d.queuedCount > 0) return 2;
        if (d.doneCount > 0) return 3;
        return 4;
      };
      base.sort((a, b) => {
        const diff = deptUrgency(a) - deptUrgency(b);
        return diff !== 0 ? diff : a - b;
      });
    }

    if (deptFilter === 'all') {
      base.push(6);
    }
    return base;
  }

  function renderDepartmentsPanel(workloads) {
    nav.replaceChildren();

    const visibleIndices = computeOrderedDepartmentIndices(workloads);

    if (visibleIndices.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'dept-card';
      empty.innerHTML = `<div class="dept-empty-note">Không có phòng ban nào khớp bộ lọc hiện tại. Bấm "Tất cả (7)" để xem toàn bộ xưởng.</div>`;
      nav.append(empty);
      return;
    }

    for (const i of visibleIndices) {
      const zone = STUDIO_ZONES[i];
      const isSelected = selected === i;
      const isExpanded = isSelected || expandAllDepts;

      if (i === 6) {
        // ✨ Sàn trưng bày — Central Catwalk & 6-Stage Pipeline Card
        const runwayCard = document.createElement('article');
        runwayCard.className = `dept-card ${isSelected ? 'is-selected' : ''}`;
        runwayCard.style.setProperty('--dept-color', zone.color);
        runwayCard.dataset.deptIndex = '6';
        runwayCard.setAttribute('aria-current', isSelected ? 'true' : 'false');

        const header = document.createElement('div');
        header.className = 'dept-card-header';
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.innerHTML = `
          <div class="dept-identity">
            <div class="dept-emblem">${zone.icon}</div>
            <div class="dept-titles">
              <div class="dept-name-row">
                <span class="dept-name">${esc(zone.label)}</span>
              </div>
              <div class="dept-subrole">Sàn Catwalk trung tâm &amp; Dây chuyền 6 chặng</div>
            </div>
          </div>
          <div class="dept-badges">
            <span class="mini-pill work-done">${workloads.totals.completionPct}% tiến độ</span>
          </div>
        `;
        header.addEventListener('click', () => selectDepartment(6, true));
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectDepartment(6, true);
          }
        });
        runwayCard.append(header);

        const pipeGrid = document.createElement('div');
        pipeGrid.className = 'pipeline-grid';
        const stageOrder = [1, 2, 3, 5, 4, 0];
        for (const sIdx of stageOrder) {
          const sd = workloads.departments[sIdx];
          const sz = STUDIO_ZONES[sIdx];
          const badge =
            sd.activeCount > 0
              ? '⚡ Đang làm'
              : sd.reviewCount + sd.queuedCount > 0
                ? '⏳ Chờ'
                : sd.doneCount > 0
                  ? '✅ Xong'
                  : '○ Chờ';
          const step = document.createElement('button');
          step.type = 'button';
          step.className = 'pipeline-step';
          step.dataset.stageDept = String(sIdx);
          step.innerHTML = `<span>${esc(sz.icon)} ${esc(sz.label)}</span><span style="font-size:10.5px;color:var(--text-2)">${badge}</span>`;
          step.addEventListener('click', () => selectDepartment(sIdx, true));
          pipeGrid.append(step);
        }
        runwayCard.append(pipeGrid);
        const galleryButton = document.createElement('button');
        galleryButton.type = 'button';
        galleryButton.className = 'tiny-btn';
        galleryButton.textContent = '✦ Xem danh sách sản phẩm 3D';
        galleryButton.style.margin = '10px 16px 16px';
        galleryButton.addEventListener('click', () => selectDepartment(6, true));
        runwayCard.append(galleryButton);
        nav.append(runwayCard);
        continue;
      }

      const d = workloads.departments[i];
      const mem = members.find(
        (m) => m.name === zone.memberName || m.id === zone.memberId || m.agentId === zone.agentId,
      );
      const runtime = formatAgentRuntimeStatus(mem);
      const tok = computeAgentTokenInfo(i, members, liveTokenUsage, liveRuntimeFallback);

      const card = document.createElement('article');
      card.className = `dept-card ${isSelected ? 'is-selected' : ''} ${d.activeCount > 0 ? 'has-active-work' : ''}`;
      card.style.setProperty('--dept-color', zone.color);
      card.dataset.deptIndex = String(i);
      card.setAttribute('aria-current', isSelected ? 'true' : 'false');

      let workSummaryPill = `<span class="mini-pill tok-unlimited">Chưa có việc</span>`;
      if (d.activeCount > 0) {
        workSummaryPill = `<span class="mini-pill work-active">⚡ ${d.activeCount} đang làm${d.doneCount ? ` · ${d.doneCount} xong` : ''}</span>`;
      } else if (d.reviewCount + d.queuedCount > 0) {
        workSummaryPill = `<span class="mini-pill work-queued">⏳ ${d.reviewCount + d.queuedCount} chờ xử lý${d.doneCount ? ` · ${d.doneCount} xong` : ''}</span>`;
      } else if (d.doneCount > 0) {
        workSummaryPill = `<span class="mini-pill work-done">✅ ${d.doneCount} hoàn thành</span>`;
      }

      const tokenPillHtml = tok
        ? `<span class="mini-pill ${tok.pillClass}">${esc(tok.shortBadge)}</span>`
        : '';

      const header = document.createElement('div');
      header.className = 'dept-card-header';
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      header.innerHTML = `
        <div class="dept-identity">
          <div class="dept-emblem">${zone.icon}</div>
          <div class="dept-titles">
            <div class="dept-name-row">
              <span class="dept-name">Ban ${esc(zone.label)}</span>
              <span class="agent-state-dot ${runtime.online ? 'online' : ''}">● ${esc(zone.staffName)}</span>
            </div>
            <div class="dept-subrole" title="${esc(zone.memberName)}">${esc(zone.memberName)}</div>
          </div>
        </div>
        <div class="dept-badges">
          ${workSummaryPill}
          ${tokenPillHtml}
        </div>
      `;
      header.addEventListener('click', () => selectDepartment(i, true));
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectDepartment(i, true);
        }
      });
      card.append(header);

      if (d.totalCount > 0) {
        const activePct = (d.activeCount / d.totalCount) * 100;
        const pendingPct = ((d.queuedCount + d.reviewCount) / d.totalCount) * 100;
        const donePct = (d.doneCount / d.totalCount) * 100;
        const prog = document.createElement('div');
        prog.className = 'dept-progress-row';
        prog.innerHTML = `
          <div class="dept-progress-track" aria-hidden="true">
            <div class="dept-progress-seg" style="width:${activePct}%;background:#2563eb"></div>
            <div class="dept-progress-seg" style="width:${pendingPct}%;background:#f59e0b"></div>
            <div class="dept-progress-seg" style="width:${donePct}%;background:#10b981"></div>
          </div>
          <span>${d.doneCount}/${d.totalCount} xong</span>
        `;
        card.append(prog);
      }

      const taskGroup = document.createElement('div');
      taskGroup.className = 'dept-tasks-group';

      if (d.items.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'dept-empty-note';
        empty.textContent = 'Chưa có công việc phát sinh cho ban này.';
        taskGroup.append(empty);
      } else {
        const nonDone = d.items.filter((it) => it.bucket !== 'done');
        const doneList = d.items.filter((it) => it.bucket === 'done');

        for (const item of nonDone) {
          taskGroup.append(createTaskCardElement(item, isExpanded));
        }

        const showAllDone = isExpanded || expandedDoneDepts.has(i);
        const visibleDone = showAllDone ? doneList : doneList.slice(0, nonDone.length > 0 ? 1 : 2);

        for (const item of visibleDone) {
          taskGroup.append(createTaskCardElement(item, isExpanded));
        }

        if (!showAllDone && doneList.length > visibleDone.length) {
          const moreBtn = document.createElement('button');
          moreBtn.type = 'button';
          moreBtn.className = 'more-done-btn';
          moreBtn.textContent = `+ Xem thêm ${doneList.length - visibleDone.length} việc đã hoàn thành`;
          moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            expandedDoneDepts.add(i);
            renderDepartmentsPanel(workloads);
          });
          taskGroup.append(moreBtn);
        }
      }
      card.append(taskGroup);

      if (isSelected) {
        const extra = document.createElement('div');
        extra.className = 'dept-inspector-extra';
        extra.innerHTML = `
          <div style="font-size:11.5px;color:var(--text-2)"><strong>Chức năng ban:</strong> ${esc(zone.duty)}</div>
          <div class="inspector-meta-grid">
            <div class="inspector-stat">
              <div class="inspector-stat-label">Trạng thái Agent</div>
              <div class="inspector-stat-val">${esc(runtime.text)}</div>
            </div>
            <div class="inspector-stat">
              <div class="inspector-stat-label">Model &amp; Runtime</div>
              <div class="inspector-stat-val" title="${esc(tok?.model || 'gpt-6-luna')}">${esc(tok?.model || 'gpt-6-luna')}</div>
            </div>
          </div>
        `;

        if (tok && (tok.budget != null || tok.status === 'out')) {
          const pctVal = tok.pctRemaining ?? (tok.status === 'out' ? 0 : 100);
          const rightSummary =
            tok.budget != null
              ? `${tok.remaining?.toLocaleString('vi-VN') ?? 0} còn lại (${pctVal}%)`
              : tok.noteText;
          const tokBar = document.createElement('div');
          tokBar.innerHTML = `
            <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:700;margin-bottom:4px">
              <span>⚡ Hạn mức Quota &amp; Runtime</span>
              <span style="color:${tok.statusColor}">${esc(rightSummary)}</span>
            </div>
            <div class="token-bar-bg">
              <div class="token-bar-fill ${tok.barClass}" style="width:${pctVal}%"></div>
            </div>
          `;
          extra.append(tokBar);
        }
        card.append(extra);
      }

      nav.append(card);
    }

    if (infoLegacy) {
      const z = STUDIO_ZONES[selected] || STUDIO_ZONES[0];
      infoLegacy.textContent = `${z.label} · ${z.staffName}`;
    }
  }

  function renderStudioFooterSummary(workloads) {
    if (!taskFlowFooter) return;
    taskFlowFooter.replaceChildren();
    const { totals } = workloads;
    const title = document.createElement('div');
    title.style.cssText = 'font-weight:800;color:var(--text-1);display:flex;justify-content:space-between;align-items:center';
    title.innerHTML = `<span>📊 Tổng kết luồng công việc AtelierX</span><span>${totals.done}/${totals.total} hoàn tất (${totals.completionPct}%)</span>`;
    const desc = document.createElement('div');
    desc.textContent =
      totals.total > 0
        ? `Phân bổ tự động vào 6 ban chuyên môn: ${totals.active} đang thực hiện · ${totals.pendingAttention} sẵn sàng / chờ duyệt · ${totals.done} đã hoàn thành.`
        : online
          ? 'Chưa có ticket nào trong dự án AtelierX.'
          : 'Chế độ xem kiến trúc xưởng (sẽ tự động nạp danh sách việc theo ban khi kết nối Crewly).';
    taskFlowFooter.append(title, desc);
  }

  function renderTokenModalTable(workloads) {
    const banner = document.getElementById('modal-runtime-banner');
    if (banner) {
      if (codexIdentity?.email) {
        banner.removeAttribute?.('hidden'); banner.hidden = false;
        const quota = codexIdentity.quota;
        const measuredAt = quota?.measuredAt ? Date.parse(quota.measuredAt) : NaN;
        const checkedAt = codexIdentity.checkedAt ? Date.parse(codexIdentity.checkedAt) : NaN;
        const quotaFresh = Number.isFinite(measuredAt) && Date.now() - measuredAt < 5 * 60 * 1000;
        const updaterFresh = Number.isFinite(checkedAt) && Date.now() - checkedAt < 2 * 60 * 1000;
        const quotaLabel = quotaFresh
          ? `Còn ${quota.fiveHourRemaining}% (5 giờ), ${quota.weeklyRemaining ?? '?'}% (tuần)`
          : quota ? `Quota chưa cập nhật (số đo cuối: ${quota.fiveHourRemaining}% / ${quota.weeklyRemaining ?? '?'}%)` : 'Đang chờ số đo quota mới';
        const syncLabel = updaterFresh ? 'Đồng bộ đang chạy' : 'Đồng bộ đã dừng hoặc mất kết nối';
        const timeLabel = Number.isFinite(measuredAt) ? new Date(measuredAt).toLocaleTimeString('vi-VN') : 'chưa có';
        banner.textContent = `Codex: ${codexIdentity.email} · ${quotaLabel} · ${codexIdentity.sessionsFresh ? 'Phiên agent đã làm mới' : 'Đang chờ làm mới phiên agent'} · ${syncLabel} · đo ${timeLabel}`;
      }
      const exhausted = Array.isArray(liveRuntimeFallback?.exhausted) ? liveRuntimeFallback.exhausted : [];
      const overrides = Array.isArray(liveRuntimeFallback?.overrides) ? liveRuntimeFallback.overrides : [];
      if (!codexIdentity?.email && (exhausted.length > 0 || overrides.length > 0)) {
        const exNames = exhausted.map((e) => shortRuntimeName(e.runtime)).filter(Boolean);
        banner.removeAttribute?.('hidden');
        banner.hidden = false;
        banner.textContent =
          exNames.length > 0
            ? `⚠️ Cảnh báo Runtime Crewly: ${exNames.join(', ')} đã chạm giới hạn quota${overrides.length > 0 ? ` · ${overrides.length} Agent đã chuyển sang Runtime dự phòng.` : '.'}`
            : `ℹ️ Có ${overrides.length} Agent đang chạy trên Runtime dự phòng.`;
      } else if (!codexIdentity?.email) {
        banner.setAttribute('hidden', '');
        banner.hidden = true;
        banner.textContent = '';
      }
    }

    const tbody = document.getElementById('token-table-body');
    if (!tbody) return;
    tbody.replaceChildren();

    const list = [0, 1, 2, 3, 4, 5]
      .map((idx) => ({
        tok: computeAgentTokenInfo(idx, members, liveTokenUsage, liveRuntimeFallback),
        dept: workloads.departments[idx],
        zone: STUDIO_ZONES[idx],
      }))
      .filter(({ tok }) => {
        if (!tok) return false;
        if (activeModalFilter === 'all') return true;
        if (activeModalFilter === 'ok') return tok.hasToken;
        return tok.status === 'out';
      });

    if (list.length === 0) {
      const tr = tbody.insertRow();
      const td = tr.insertCell();
      td.colSpan = 6;
      td.style.textAlign = 'center';
      td.textContent = 'Không có Agent nào thuộc bộ lọc này.';
      return;
    }

    for (const { tok, dept, zone } of list) {
      const tr = tbody.insertRow();
      const currentWork = dept.activeItems[0]
        ? `⚡ ${dept.activeItems[0].id}: ${cleanOneLine(dept.activeItems[0].title, 42)}`
        : dept.queuedItems[0] || dept.reviewItems[0]
          ? `⏳ ${(dept.queuedItems[0] || dept.reviewItems[0]).id}: ${cleanOneLine((dept.queuedItems[0] || dept.reviewItems[0]).title, 40)}`
          : dept.doneCount > 0
            ? `✓ Đã xong ${dept.doneCount} việc`
            : 'Đang rảnh';

      const cells = [
        `${zone.icon} Ban ${zone.label} (${zone.staffName})`,
        currentWork,
        tok.model,
        tok.statusLabel,
        tok.used == null ? '--' : tok.used.toLocaleString('vi-VN'),
        tok.noteText,
      ];

      cells.forEach((val, idx) => {
        const td = tr.insertCell();
        td.textContent = val;
        if (idx === 0) td.style.fontWeight = '700';
        if (idx === 3) {
          td.style.color = tok.statusColor;
          td.style.fontWeight = '800';
        }
      });
    }
  }

  function renderAll() {
    const workloads = getWorkloads();
    renderWorld(workloads);
    updateHeaderTelemetry(workloads);
    renderActiveSpotlight(workloads);
    renderDepartmentsPanel(workloads);
    renderStudioFooterSummary(workloads);
    const modal = document.getElementById('token-modal');
    if (modal && modal.classList.contains('open')) {
      renderTokenModalTable(workloads);
    }
  }

  async function openShowcase() {
    const overlay = document.getElementById('showcase-overlay');
    const list = document.getElementById('showcase-list');
    const frame = document.getElementById('showcase-frame');
    const meta = document.getElementById('showcase-meta');
    if (!overlay || !list || !frame || !meta) return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    list.replaceChildren();
    meta.textContent = 'Đang tải danh sách sản phẩm…';
    try {
      const response = await fetch('/atelierx-products/catalog.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('catalog unavailable');
      const catalog = await response.json();
      const products = Array.isArray(catalog.products) ? [...catalog.products].sort((a, b) => {
        const rank = product => product?.status === 'complete' ? 0 : 1;
        return rank(a) - rank(b) || (Number(String(b?.id || '').match(/ATEL-(\d+)/)?.[1] || 0) - Number(String(a?.id || '').match(/ATEL-(\d+)/)?.[1] || 0));
      }) : [];
      if (!products.length) { meta.textContent = 'Chưa có sản phẩm trong Sàn trưng bày.'; frame.removeAttribute('src'); return; }
      let first = null;
      for (const product of products) {
        const viewerPath = String(product?.viewer || '');
        if (!/^products\/ATEL-\d+\/[a-zA-Z0-9._-]+\/index\.html$/.test(viewerPath) || viewerPath.includes('..')) continue;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'showcase-product';
        const name = document.createElement('strong');
        name.textContent = String(product.name || product.id || 'Sản phẩm');
        const info = document.createElement('span');
        info.textContent = `${product.id || ''} · ${product.revision || ''} · ${product.statusLabel || product.status || ''}`;
        button.append(name, info);
        button.addEventListener('click', () => {
          list.querySelectorAll('.showcase-product').forEach((el) => el.classList.remove('active'));
          button.classList.add('active');
          meta.textContent = `${product.name || product.id} · ${product.statusLabel || product.status || ''}. ${product.description || ''}`;
          frame.src = `/atelierx-products/${product.viewer}?revision=${encodeURIComponent(product.revision || '')}&theme=light`;
        });
        list.append(button);
        if (!first) first = button;
      }
      if (first) first.click();
      else meta.textContent = 'Catalog chưa có sản phẩm xem được.';
    } catch {
      meta.textContent = 'Chưa tải được catalog sản phẩm. Kiểm tra thư mục AtelierX/showcase.';
    }
  }

  const showcaseOverlay = document.getElementById('showcase-overlay');
  const showcaseClose = document.getElementById('showcase-close');
  function closeShowcase() {
    if (!showcaseOverlay) return;
    showcaseOverlay.classList.remove('open');
    showcaseOverlay.setAttribute('aria-hidden', 'true');
    const frame = document.getElementById('showcase-frame');
    if (frame) frame.removeAttribute('src');
  }
  if (showcaseClose) showcaseClose.addEventListener('click', closeShowcase);
  if (showcaseOverlay) showcaseOverlay.addEventListener('click', (e) => { if (e.target === showcaseOverlay) closeShowcase(); });

  function selectDepartment(index, focusCamera = false) {
    if (index < 0 || index > 6) return;
    hasAutoSelected = true;
    selected = index;
    if (deptFilter !== 'all') {
      const workloads = getWorkloads();
      const d = workloads.departments[index];
      if (
        index === 6 ||
        (deptFilter === 'active' && d?.activeCount === 0) ||
        (deptFilter === 'queued' && (d?.queuedCount || 0) + (d?.reviewCount || 0) === 0) ||
        (deptFilter === 'done' && d?.doneCount === 0)
      ) {
        deptFilter = 'all';
      }
    }
    if (focusCamera) {
      const z = STUDIO_ZONES[index];
      [cx, cy] = iso(z.x, z.y, z.h + 12);
      scale = 1.52;
      camera();
    }
    renderAll();
    if (index === 6) openShowcase();

    const targetCard = nav.querySelector(`[data-dept-index="${index}"]`);
    if (targetCard && typeof targetCard.scrollIntoView === 'function') {
      targetCard.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  async function readTaskFlow(headers, team) {
    const candidateProjectId =
      (Array.isArray(team?.projectIds) && team.projectIds[0]) || activeProjectId || DEFAULT_PROJECT_ID;
    activeProjectId = candidateProjectId;

    const [ticketResponse, taskResponse] = await Promise.all([
      fetch('/api/project-tickets/' + encodeURIComponent(activeProjectId), { cache: 'no-store', headers }),
      fetch('/api/in-progress-tasks', { cache: 'no-store', headers }),
    ]);

    if (!ticketResponse.ok && !taskResponse.ok) {
      throw new Error('Không đọc được Task Flow AtelierX');
    }

    const previousIds = new Set(studioTasks.map((t) => t.id));
    if (ticketResponse.ok) {
      const ticketData = await ticketResponse.json();
      studioTickets = ticketData.data?.tickets || [];
    }
    if (taskResponse.ok) {
      const taskData = await taskResponse.json();
      const allTasks = Array.isArray(taskData.tasks) ? taskData.tasks : [];
      studioTasks = filterStudioTasks(allTasks, {
        activeProjectId,
        teamId: team?.id || DEFAULT_TEAM_ID,
        members: team?.members || members,
        tickets: studioTickets,
      });
    }

    studioTasks.forEach((task) => {
      if (
        previousIds.has(task.id) ||
        !['active', 'assigned', 'queued', 'pending_assignment', 'in_progress', 'running'].includes(task.status)
      ) {
        return;
      }
      const idx = resolveWorkItemDepartment(task, team?.members || members);
      if (idx > 0) {
        assignments.set(idx, { start: Date.now(), brief: task.taskName, taskId: task.id });
      }
    });
  }

  async function runSync() {
    if (destroyed) return;
    const syncBadge = document.getElementById('sync-badge');
    try {
      let token = null;
      try {
        token = localStorage.getItem('crewly_api_token');
      } catch {
        token = null;
      }
      const headers = token ? { Authorization: 'Bearer ' + token } : {};

      const resp = await fetch('/api/teams', { cache: 'no-store', headers });
      if (!resp.ok) throw new Error('teams');
      const j = await resp.json();
      if (destroyed) return;
      const teamsList = Array.isArray(j.data) ? j.data : j.data?.teams || [];
      const team = teamsList.find(
        (t) => t.id === DEFAULT_TEAM_ID || String(t.name || '').includes('AtelierX'),
      );

      if (team) {
        members = Array.isArray(team.members) ? team.members : [];
        try {
          await readTaskFlow(headers, team);
        } catch {
          studioTickets = [];
          studioTasks = [];
        }
        if (destroyed) return;
        online = true;
        const activeAgents = members.filter((m) => m.agentStatus === 'active' || m.agentStatus === 'started').length;
        const statusEl = document.querySelector('#status');
        if (statusEl) {
          statusEl.textContent = `🤖 ${activeAgents}/${members.length} Agent trực tuyến`;
        }
        if (syncBadge) {
          const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
          syncBadge.textContent = `● Trực tuyến · ${nowStr}`;
          syncBadge.style.color = '#059669';
        }

        // Auto-select first department with active work ONCE on initial load (never hijacks manual selection)
        const workloads = getWorkloads();
        if (!hasAutoSelected && workloads.totals.total > 0) {
          hasAutoSelected = true;
          if (workloads.activeSpotlightItems.length > 0 && selected === 0 && workloads.departments[0].activeCount === 0) {
            selected = workloads.activeSpotlightItems[0].deptIndex;
          }
        }
      }

      const [usageResult, fallbackResult, identityResult] = await Promise.allSettled([
        fetch('/api/system/usage/caps?days=1', { cache: 'no-store', headers }),
        fetch('/api/system/runtime-fallback', { cache: 'no-store', headers }),
        fetch('/atelierx-products/codex-account.json', { cache: 'no-store' }),
      ]);
      if (identityResult.status === 'fulfilled' && identityResult.value?.ok) codexIdentity = await identityResult.value.json();

      if (usageResult.status === 'fulfilled' && usageResult.value?.ok) {
        const usageData = await usageResult.value.json();
        if (!destroyed) {
          liveTokenUsage = usageData.data || null;
        }
      }
      if (fallbackResult.status === 'fulfilled' && fallbackResult.value?.ok) {
        const fbData = await fallbackResult.value.json();
        if (!destroyed) {
          liveRuntimeFallback = fbData.data || fbData || null;
        }
      }
    } catch {
      if (destroyed) return;
      online = false;
      const statusEl = document.querySelector('#status');
      if (statusEl) {
        statusEl.textContent = 'Chế độ độc lập (Chưa kết nối Crewly)';
      }
      if (syncBadge) {
        syncBadge.textContent = '○ Chế độ độc lập';
        syncBadge.style.color = 'var(--text-3)';
      }
    }

    if (!destroyed) {
      renderAll();
    }
  }

  function sync() {
    if (destroyed) return Promise.resolve();
    if (!syncPromise) {
      syncPromise = runSync().finally(() => {
        syncPromise = null;
      });
    }
    return syncPromise;
  }

  // ================= EVENT WIRING (100% CSP-SAFE) =================

  svg.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      scale = Math.max(0.55, Math.min(2.8, scale * Math.exp(-e.deltaY * 0.0014)));
      camera();
    },
    { passive: false },
  );

  let drag = null;
  let dragged = false;
  svg.addEventListener('pointerdown', (e) => {
    drag = [e.clientX, e.clientY, cx, cy];
    dragged = false;
  });
  svg.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag[0];
    const dy = e.clientY - drag[1];
    if (Math.abs(dx) + Math.abs(dy) < 5 && !dragged) return;
    dragged = true;
    if (typeof svg.setPointerCapture === 'function') {
      try {
        svg.setPointerCapture(e.pointerId);
      } catch {
        // ignore synthetic pointer events
      }
    }
    const ctm = typeof svg.getScreenCTM === 'function' ? svg.getScreenCTM() : null;
    const unit = ctm && ctm.a ? 1 / ctm.a : 1 / scale;
    cx = drag[2] - dx * unit;
    cy = drag[3] - dy * unit;
    camera();
  });
  for (const ev of ['pointerup', 'pointercancel']) {
    svg.addEventListener(ev, () => {
      drag = null;
    });
  }
  svg.addEventListener(
    'click',
    (e) => {
      if (dragged) {
        e.stopPropagation();
        dragged = false;
      }
    },
    true,
  );

  world.addEventListener('click', (e) => {
    const g = e.target.closest('.room');
    if (g && g.dataset.index != null) {
      selectDepartment(Number(g.dataset.index), true);
    }
  });
  world.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const g = e.target.closest('.room');
      if (g && g.dataset.index != null) {
        e.preventDefault();
        selectDepartment(Number(g.dataset.index), true);
      }
    }
  });

  const plusBtn = document.getElementById('plus');
  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      scale = Math.max(0.6, Math.min(2.8, scale * 1.22));
      camera();
    });
  }
  const minusBtn = document.getElementById('minus');
  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      scale = Math.max(0.6, Math.min(2.8, scale * 0.82));
      camera();
    });
  }
  const resetBtn = document.getElementById('reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      cx = DEFAULT_CX;
      cy = DEFAULT_CY;
      scale = 1;
      camera();
      selectDepartment(6, false);
    });
  }

  const focusActiveBtn = document.getElementById('btn-focus-active');
  if (focusActiveBtn) {
    focusActiveBtn.addEventListener('click', () => {
      const workloads = getWorkloads();
      const activeDepts = workloads.departments.filter((d) => d.activeCount > 0);
      if (activeDepts.length > 0) {
        const target = activeDepts[activeFocusCursor % activeDepts.length];
        activeFocusCursor += 1;
        selectDepartment(target.deptIndex, true);
      } else {
        selectDepartment(0, true);
      }
    });
  }

  const wideBtn = document.getElementById('btn-wide-sidebar');
  if (wideBtn) {
    wideBtn.addEventListener('click', () => {
      const wide = document.body.classList.toggle('sidebar-wide');
      wideBtn.classList.toggle('dock-primary', wide);
      wideBtn.textContent = wide ? '⇔ Chuẩn' : '⇔ Rộng';
    });
  }

  const toggleLinksBtn = document.getElementById('btn-toggle-links');
  if (toggleLinksBtn) {
    toggleLinksBtn.addEventListener('click', () => {
      showLinks = !showLinks;
      toggleLinksBtn.classList.toggle('active', showLinks);
      renderWorld(getWorkloads());
    });
  }

  const toggleCalloutsBtn = document.getElementById('btn-toggle-callouts');
  if (toggleCalloutsBtn) {
    toggleCalloutsBtn.addEventListener('click', () => {
      showCallouts = !showCallouts;
      toggleCalloutsBtn.classList.toggle('active', showCallouts);
      renderWorld(getWorkloads());
    });
  }

  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      studioTheme = studioTheme === 'day' ? 'night' : 'day';
      try {
        localStorage.setItem('atelierx_studio_theme', studioTheme);
      } catch {
        // ignore
      }
      applyTheme();
      renderWorld(getWorkloads());
    });
  }

  const syncBtn = document.getElementById('btn-sync-now');
  if (syncBtn) {
    syncBtn.addEventListener('click', () => {
      sync();
    });
  }

  const sortModeBtn = document.getElementById('btn-sort-mode');
  if (sortModeBtn) {
    sortModeBtn.addEventListener('click', () => {
      sortByActive = !sortByActive;
      sortModeBtn.classList.toggle('is-active', sortByActive);
      sortModeBtn.textContent = sortByActive ? '⚡ Ưu tiên việc' : '🏛️ Thứ tự ban';
      renderDepartmentsPanel(getWorkloads());
    });
  }

  const expandAllBtn = document.getElementById('btn-expand-all');
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      expandAllDepts = !expandAllDepts;
      expandAllBtn.classList.toggle('is-active', expandAllDepts);
      expandAllBtn.textContent = expandAllDepts ? 'Thu gọn' : 'Mở chi tiết';
      renderDepartmentsPanel(getWorkloads());
    });
  }

  document.querySelectorAll('[data-dept-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      deptFilter = btn.dataset.deptFilter || 'all';
      renderAll();
    });
  });

  // Token Modal Controls
  const modal = document.getElementById('token-modal');
  const openModalBtn = document.getElementById('token-summary-btn');
  const openModalBtn2 = document.getElementById('btn-open-token-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');

  function openModal() {
    if (!modal) return;
    renderTokenModalTable(getWorkloads());
    modal.classList.add('open');
  }
  function closeModal() {
    if (modal) modal.classList.remove('open');
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (openModalBtn2) openModalBtn2.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  const onDocKeyDown = (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) {
      closeModal();
    }
  };
  document.addEventListener('keydown', onDocKeyDown);

  document.querySelectorAll('.modal-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeModalFilter = btn.dataset.filter || 'all';
      renderTokenModalTable(getWorkloads());
    });
  });

  // Initial Paint & Periodic Live Sync
  camera();
  renderAll();
  sync();
  const timer = setInterval(sync, 10000);

  return {
    sync,
    selectDepartment,
    destroy: () => {
      destroyed = true;
      clearInterval(timer);
      document.removeEventListener('keydown', onDocKeyDown);
    },
  };
}

if (typeof document !== 'undefined' && document.querySelector('#scene') && !globalThis.__ATELIERX_MANUAL_BOOT__) {
  initAtelierXStudio();
}
