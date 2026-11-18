// AtelierX Cyber-Couture Neon 3D — Expanded Isometric Studio & Minimalist Department Engine

export const PAVILION_SCALE = 1.25;

export const STUDIO_ZONES = [
  {
    index: 0,
    label: 'Điều phối',
    staffName: 'Studio Lead',
    roleShort: 'Lead',
    memberName: 'Studio Lead',
    agentId: 'atelierx-team-leader-0001',
    memberId: 'af30c001-2789-4f20-b917-000000000001',
    roleKey: 'team-leader',
    icon: '👑',
    duty: 'Điều phối đơn hàng, phân việc song song & duyệt bàn giao cuối',
    x: -232,
    y: -232,
    h: 34,
    color: '#C98A4B',
    neon: '#fbbf24',
    kind: 'desk',
  },
  {
    index: 1,
    label: 'Nghiên cứu',
    staffName: 'Trend Researcher',
    roleShort: 'Researcher',
    memberName: 'Market & Trend Researcher',
    agentId: 'atelierx-tpm-0002',
    memberId: 'af30c001-2789-4f20-b917-000000000002',
    roleKey: 'tpm',
    icon: '🔍',
    duty: 'Nghiên cứu thị trường, chủ thể minh họa, bố cục & bảng màu',
    x: -378,
    y: 62,
    h: 26,
    color: '#1E8FA5',
    neon: '#22d3ee',
    kind: 'board',
  },
  {
    index: 2,
    label: 'Vật liệu',
    staffName: 'Material Specialist',
    roleShort: 'Material',
    memberName: 'Merchandiser / Material Specialist',
    agentId: 'atelierx-backend-developer-0005',
    memberId: 'af30c001-2789-4f20-b917-000000000005',
    roleKey: 'backend-developer',
    icon: '🧵',
    duty: 'Đặc tả chất liệu số PBR, màu vải, độ nhám & vùng in',
    x: 62,
    y: -378,
    h: 26,
    color: '#2F8F6B',
    neon: '#34d399',
    kind: 'fabric',
  },
  {
    index: 3,
    label: 'Thiết kế',
    staffName: 'Fashion Designer',
    roleShort: 'Designer',
    memberName: 'Fashion Designer',
    agentId: 'atelierx-designer-0003',
    memberId: 'af30c001-2789-4f20-b917-000000000003',
    roleKey: 'designer',
    icon: '🎨',
    duty: 'Dựng phom áo 3D, thiết kế artwork, UV placement & xuất GLB',
    x: -62,
    y: 378,
    h: 18,
    color: '#C84B73',
    neon: '#f472b6',
    kind: 'sketch',
  },
  {
    index: 4,
    label: 'Kỹ thuật',
    staffName: 'Technical QA',
    roleShort: 'Tech QA',
    memberName: 'Technical Designer / QA',
    agentId: 'atelierx-qa-0004',
    memberId: 'af30c001-2789-4f20-b917-000000000004',
    roleKey: 'qa',
    icon: '📐',
    duty: 'Kiểm định hình học GLB, mặt in, hướng artwork & QA Viewer thực tế',
    x: 378,
    y: -62,
    h: 18,
    color: '#4368C9',
    neon: '#60a5fa',
    kind: 'cut',
  },
  {
    index: 5,
    label: 'Studio hình ảnh',
    staffName: 'Visual Studio',
    roleShort: 'Visual',
    memberName: 'Brand & Commerce / Visual Studio',
    agentId: 'atelierx-frontend-developer-0006',
    memberId: 'af30c001-2789-4f20-b917-000000000006',
    roleKey: 'frontend-developer',
    icon: '📸',
    duty: 'Tích hợp Web Viewer xoay 360°, camera orbit, ánh sáng & trình diễn',
    x: 264,
    y: 264,
    h: 12,
    color: '#7C5CE0',
    neon: '#c084fc',
    kind: 'photo',
  },
  {
    index: 6,
    label: 'Sàn trưng bày',
    staffName: 'Runway',
    roleShort: 'Runway',
    memberName: '',
    agentId: null,
    memberId: null,
    roleKey: 'runway',
    icon: '✨',
    duty: 'Sàn Catwalk trung tâm trưng bày mẫu 3D & theo dõi dây chuyền 6 chặng',
    x: 0,
    y: 0,
    h: 20,
    color: '#1F8A82',
    neon: '#22d3ee',
    kind: 'runway',
  },
];

const DEFAULT_TEAM_ID = 'af30c001-2789-4f20-b917-000000000010';
const DEFAULT_PROJECT_ID = 'af30c001-2789-4f20-b917-000000000020';
const DEFAULT_VIEW_W = 1320;
const DEFAULT_VIEW_H = 884;
const DEFAULT_CX = 0;
const DEFAULT_CY = -28;
const DYES = ['#d96b62', '#efc66b', '#4d9299', '#8a82b5', '#f3ede0', '#63a375'];

// Dedicated open-floor standing & patrol waypoints per specialist pavilion (clear of all furniture)
const STAFF_AISLE_OFFSETS = [
  [-8, 22],  // 0 Điều phối: open carpet in front of executive desk, clear of stools & holo-table
  [-46, 22], // 1 Nghiên cứu: open left aisle clear of desk (y<=8) and collaboration stools (x>=-22)
  [-6, 38],  // 2 Vật liệu: open front promenade in front of PBR scanner (y<=27) & fabric rolls
  [24, 26],  // 3 Thiết kế: open studio floor between front table, hoodie turntable, and dress form
  [24, 24],  // 4 Kỹ thuật: open QA floor between workstations and laser turntable
  [-28, 26], // 5 Studio hình ảnh: open director aisle left of camera tripod (-2,14) & monitor desk
];

const STAFF_PATROL_WAYPOINTS = [
  [[-8, 22], [10, 32], [-14, 38]],    // 0 Điều phối
  [[-46, 22], [-48, 38], [-34, 20]],  // 1 Nghiên cứu
  [[-6, 38], [-30, 40], [22, 38]],    // 2 Vật liệu
  [[24, 26], [16, 12], [36, 36]],     // 3 Thiết kế
  [[24, 24], [14, 10], [38, 34]],     // 4 Kỹ thuật
  [[-28, 26], [-40, 36], [-20, 16]],  // 5 Studio hình ảnh
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
      zone.roleShort,
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
  const at = raw.indexOf('@');
  const base = at > 0 ? raw.slice(0, at) : raw;
  const account = at > 0 ? raw.slice(at + 1) : '';
  const lower = base.toLowerCase();
  let label = base.replace(/-cli$/i, '');
  if (lower.includes('antigravity')) label = 'Antigravity';
  else if (lower.includes('codex')) label = 'Codex';
  else if (lower.includes('claude')) label = 'Claude';
  else if (lower.includes('gemini')) label = 'Gemini';
  else if (lower.includes('crewly-agent')) label = 'Crewly Agent';
  return account ? `${label} (${account})` : label;
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

  // Inspect RuntimeFallbackService state (`/api/system/runtime-fallback`) for provider quota exhaustion & account pool!
  const overrides = Array.isArray(liveRuntimeFallback?.overrides) ? liveRuntimeFallback.overrides : [];
  const exhaustedArr = Array.isArray(liveRuntimeFallback?.exhausted) ? liveRuntimeFallback.exhausted : [];
  const exhaustedSet = new Set(exhaustedArr.map((e) => String(e?.runtime || '').toLowerCase()).filter(Boolean));
  const poolAssignments =
    liveRuntimeFallback?.poolAssignments && typeof liveRuntimeFallback.poolAssignments === 'object'
      ? liveRuntimeFallback.poolAssignments
      : {};

  const sessionCandidates = [mem?.sessionName, mem?.agentId, zone.agentId].filter(Boolean);
  const activeOverride = overrides.find((o) => sessionCandidates.includes(o?.sessionName)) || null;
  const pooledTarget = sessionCandidates.map((s) => poolAssignments[s]).find(Boolean) || null;
  const baseRuntime = String(mem?.runtimeType || '');
  const effectiveRuntime = String(activeOverride?.runtime || pooledTarget || baseRuntime || '');
  const effRuntimeShort = shortRuntimeName(effectiveRuntime);
  const baseRuntimeShort = shortRuntimeName(baseRuntime);

  const isEffectiveRuntimeExhausted = Boolean(
    effectiveRuntime && exhaustedSet.has(effectiveRuntime.toLowerCase()),
  );
  const isRunningOnFallback = Boolean(
    activeOverride && effectiveRuntime && effectiveRuntime.toLowerCase() !== baseRuntime.toLowerCase(),
  );
  const isPooledAccount = Boolean(
    !isRunningOnFallback && pooledTarget && String(pooledTarget).includes('@'),
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
      : isPooledAccount
        ? `Chia tải pool: ${effRuntimeShort}`
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
  cyberMonolith(x, y, z, accent = '#22d3ee', isNight = true) {
    const body = isNight ? '#111936' : '#334155';
    return (
      oval(x, y, z + 0.5, 13, 6, accent, isNight ? 'opacity="0.24" filter="url(#neon-halo)"' : 'opacity="0.14"') +
      box(x - 6, y - 6, z, 12, 12, 5, isNight ? '#1e293b' : '#cbd5e1', accent) +
      box(x - 4, y - 4, z + 5, 8, 8, 30, body, accent) +
      box(x - 2.2, y - 2.2, z + 35, 4.4, 4.4, 9, accent, '#ffffff') +
      oval(x, y, z + 46, 5.5, 3, '#ffffff', `stroke="${accent}" stroke-width="1.2" opacity="${isNight ? 0.95 : 0.78}"`)
    );
  },
  stool(x, y, z, cushion = '#334e68') {
    return (
      oval(x + 1, y + 1, z + 0.5, 5, 2.3, '#0f172a', 'opacity="0.18"') +
      box(x, y, z, 2.2, 2.2, 10, '#64748b') +
      box(x - 3.2, y - 3.2, z + 10, 8.6, 8.6, 2.6, cushion)
    );
  },
  execDesk(x, y, z, accent = '#22d3ee') {
    return (
      box(x, y, z, 5, 5, 15, '#334155') +
      box(x + 47, y + 20, z, 5, 5, 15, '#334155') +
      box(x, y + 20, z, 5, 5, 15, '#334155') +
      box(x - 2, y - 2, z + 15, 56, 28, 3.2, '#1e293b', accent) +
      box(x + 12, y + 3, z + 18, 2.5, 2.5, 4, '#475569') +
      box(x + 4, y + 2, z + 22, 20, 2, 13, '#0f172a', accent) +
      box(x + 6, y + 4.1, z + 25, 15, 0.5, 8, accent) +
      box(x + 33, y + 5, z + 18, 2.5, 2.5, 4, '#475569') +
      box(x + 26, y + 4, z + 22, 18, 2, 12, '#0f172a', '#a855f7') +
      box(x + 28, y + 6.1, z + 25, 13, 0.5, 7, '#a7f3d0') +
      box(x + 14, y + 12, z + 18.2, 14, 6, 0.8, '#94a3b8') +
      box(x + 44, y + 15, z + 18.2, 3.2, 3.2, 4.2, '#fef08a')
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
  softboxLight(x, y, z, glow = '#fef9c3') {
    return (
      oval(x, y, z + 0.5, 7, 3.4, '#1e293b', 'opacity="0.32"') +
      box(x - 1, y - 1, z, 2.2, 2.2, 32, '#475569') +
      box(x - 7, y - 3, z + 30, 15, 6, 12, '#1e293b', '#c084fc') +
      box(x - 5.8, y + 3.1, z + 31.2, 12.6, 0.8, 9.6, glow)
    );
  },
};

function extrudedPolygonDeck(pts3d, depthZ, topFill, sideTint, strokeCol = '') {
  const top = pts3d.map(([x, y, z]) => iso(x, y, z));
  const bot = pts3d.map(([x, y, z]) => iso(x, y, z - depthZ));
  let svg = '';
  for (let i = 0; i < pts3d.length; i++) {
    const n = (i + 1) % pts3d.length;
    const isVisibleFront = top[i][1] + top[n][1] > -40 || Math.abs(top[i][0] - top[n][0]) > 15;
    if (!isVisibleFront) continue;
    const factor = i % 2 === 0 ? 0.72 : 0.56;
    const st = strokeCol ? `stroke="${strokeCol}" stroke-width="0.7" stroke-opacity="0.45"` : '';
    svg += poly([top[i], top[n], bot[n], bot[i]], shade(sideTint, factor), st);
  }
  const topStroke = strokeCol ? `stroke="${strokeCol}" stroke-width="2"` : '';
  svg += poly(top, topFill, topStroke);
  return svg;
}

function renderCampusPlaza(isNight) {
  let svg = '';
  const upperFill = isNight ? 'url(#plazaTopNight)' : 'url(#plazaTopDay)';
  const neonCyan = isNight ? '#22d3ee' : '#3b82f6';
  const neonPink = isNight ? '#f472b6' : '#8b5cf6';
  const sideAlloy = isNight ? '#111a3a' : '#94a3b8';

  // Extruded Octagonal Cyber-Couture Citadel Terrace (fits strictly within [-636..636, -380..354])
  svg += oval(0, 0, -26, 628, 336, '#020617', `opacity="${isNight ? 0.58 : 0.22}" filter="url(#shadow)"`);

  const outerOctagon = [
    [-255, -505, -8],
    [169, -505, -8],
    [505, -169, -8],
    [505, 255, -8],
    [255, 505, -8],
    [-169, 505, -8],
    [-505, 169, -8],
    [-505, -255, -8],
  ];
  svg += extrudedPolygonDeck(outerOctagon, 14, isNight ? '#0d1530' : '#cad9ee', sideAlloy, neonCyan);

  const innerOctagon = [
    [-245, -488, -2],
    [162, -488, -2],
    [488, -162, -2],
    [488, 245, -2],
    [245, 488, -2],
    [-162, 488, -2],
    [-488, 162, -2],
    [-488, -245, -2],
  ];
  svg += extrudedPolygonDeck(innerOctagon, 6, upperFill, isNight ? '#17234d' : '#dbe7f7', neonPink);

  // Perspective Cyber Laser Grid clipped smoothly inside inner deck
  const gridStroke = isNight ? 'rgba(56, 189, 248, 0.14)' : 'rgba(59, 130, 246, 0.14)';
  for (let g = -360; g <= 360; g += 90) {
    const maxSpan = Math.min(480, 725 - Math.abs(g));
    const [x1, y1] = iso(g, -maxSpan, -1.8);
    const [x2, y2] = iso(g, maxSpan, -1.8);
    const [x3, y3] = iso(-maxSpan, g, -1.8);
    const [x4, y4] = iso(maxSpan, g, -1.8);
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${gridStroke}" stroke-width="1"/>`;
    svg += `<line x1="${x3}" y1="${y3}" x2="${x4}" y2="${y4}" stroke="${gridStroke}" stroke-width="1"/>`;
  }

  // Three Concentric Glowing Neon Orbital Rings centered on Catwalk Hub
  svg += oval(0, 0, -1.6, 536, 256, 'none', `stroke="${neonCyan}" stroke-width="1.3" opacity="${isNight ? 0.34 : 0.24}" class="orbital-ring"`);
  svg += oval(0, 0, -1.6, 404, 192, 'none', `stroke="${neonPink}" stroke-width="1.2" opacity="${isNight ? 0.32 : 0.2}" stroke-dasharray="10 8"`);
  svg += oval(0, 0, -1.5, 184, 88, 'none', `stroke="${neonCyan}" stroke-width="2.1" opacity="${isNight ? 0.72 : 0.45}" filter="url(#neon-bloom)"`);
  svg += oval(0, 0, -1.5, 152, 72, 'none', `stroke="#fbbf24" stroke-width="1.2" stroke-dasharray="6 4" opacity="0.65"`);

  // Twin East/West Bioluminescent Reflecting Pools in open courtyard wings
  const poolCoords = [
    [-254, 196, 62, 54],
    [192, -250, 62, 54],
  ];
  for (const [px, py, pw, pd] of poolCoords) {
    svg += box(px, py, -2.5, pw, pd, 2.2, isNight ? '#0e7490' : '#93c5fd', neonCyan);
    svg += face(
      [
        [px + 3, py + 3, -0.2],
        [px + pw - 3, py + 3, -0.2],
        [px + pw - 3, py + pd - 3, -0.2],
        [px + 3, py + pd - 3, -0.2],
      ],
      'url(#waterPool)',
    );
    const cx = px + pw / 2;
    const cy = py + pd / 2;
    svg += oval(cx, cy, 0.2, 10, 4.8, '#a5f3fc', 'opacity="0.82"');
    svg += oval(cx, cy, 8, 3.6, 9, neonCyan, 'opacity="0.65" filter="url(#neon-bloom)"');
  }

  // Four Cyber-Crystal Neon Monolith Pylons framing open diagonals
  svg += props.cyberMonolith(-265, -48, -2, '#22d3ee', isNight);
  svg += props.cyberMonolith(-48, -265, -2, '#34d399', isNight);
  svg += props.cyberMonolith(265, 48, -2, '#f472b6', isNight);
  svg += props.cyberMonolith(48, 265, -2, '#a855f7', isNight);

  // Depth-sorted Neon Garden Cypress & Cyber Street Lamps on Outer Promenade
  const plazaProps = [
    { kind: 'lamp', x: -395, y: -195 },
    { kind: 'lamp', x: -195, y: -395 },
    { kind: 'tree', x: -455, y: -155 },
    { kind: 'tree', x: -155, y: -455 },
    { kind: 'lamp', x: 395, y: -195 },
    { kind: 'lamp', x: -195, y: 395 },
    { kind: 'tree', x: -455, y: 120 },
    { kind: 'tree', x: 120, y: -455 },
    { kind: 'lamp', x: 395, y: 195 },
    { kind: 'lamp', x: 195, y: 395 },
  ].sort((a, b) => a.x + a.y - (b.x + b.y));

  for (const item of plazaProps) {
    svg += item.kind === 'tree' ? props.cypressTree(item.x, item.y, -2) : props.streetLamp(item.x, item.y, -2, isNight);
  }

  return svg;
}

function renderSkybridge(fromZone, toZone, statusMode, showLinks, isOuterRing = false, isNight = false) {
  const dx = toZone.x - fromZone.x;
  const dy = toZone.y - fromZone.y;
  const length = Math.hypot(dx, dy) || 1;
  const halfW = 86 * PAVILION_SCALE;
  const halfD = 70 * PAVILION_SCALE;
  const tBox = 1 / Math.max(Math.abs(dx || 0.001) / halfW, Math.abs(dy || 0.001) / halfD);
  const edgeStart = tBox * 0.94;
  const edgeEnd = 1 - edgeStart;
  if (edgeEnd <= edgeStart) return '';

  const widthHalf = isOuterRing ? 9 : 13.5;
  const nx = (-dy / length) * widthHalf;
  const ny = (dx / length) * widthHalf;

  let parts = '';
  const steps = isOuterRing ? 9 : 12;
  const zStart = (fromZone.h + 10) * PAVILION_SCALE;
  const zEnd = (toZone.h + 10) * PAVILION_SCALE;

  // Mid-span architectural support pier
  const midX = fromZone.x + dx * 0.5;
  const midY = fromZone.y + dy * 0.5;
  const midZ = (zStart + zEnd) * 0.5;
  parts += box(midX - 5, midY - 5, -2, 10, 10, Math.max(8, midZ + 1), isNight ? '#1e293b' : '#94a3b8', fromZone.neon || '#22d3ee');

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
          ? '#162144'
          : '#1e2d59'
        : k % 2
          ? '#1a274f'
          : '#25386e'
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

  // Tempered glass balustrades + glowing neon laser handrails
  const railColor = isNight
    ? statusMode === 'active'
      ? '#22d3ee'
      : isOuterRing
        ? '#818cf8'
        : '#38bdf8'
    : '#3b82f6';
  for (const side of [-1, 1]) {
    const aBot = iso(fromZone.x + dx * edgeStart + side * nx, fromZone.y + dy * edgeStart + side * ny, zStart);
    const bBot = iso(fromZone.x + dx * edgeEnd + side * nx, fromZone.y + dy * edgeEnd + side * ny, zEnd);
    const aTop = iso(fromZone.x + dx * edgeStart + side * nx, fromZone.y + dy * edgeStart + side * ny, zStart + 11);
    const bTop = iso(fromZone.x + dx * edgeEnd + side * nx, fromZone.y + dy * edgeEnd + side * ny, zEnd + 11);

    parts += poly([aBot, bBot, bTop, aTop], '#38bdf8', isNight ? 'fill-opacity="0.16"' : 'fill-opacity="0.22"');
    parts += `<path d="M${aTop.join(' ')} L${bTop.join(' ')}" stroke="${railColor}" stroke-width="1.8" stroke-opacity="${isNight ? 0.85 : 0.72}" fill="none"/>`;
  }

  // Animated workflow neon plasma stream along skybridge
  if (showLinks) {
    const pStart = iso(fromZone.x + dx * edgeStart, fromZone.y + dy * edgeStart, zStart + 2.5);
    const pEnd = iso(fromZone.x + dx * edgeEnd, fromZone.y + dy * edgeEnd, zEnd + 2.5);
    if (statusMode === 'active') {
      const pulseCol = fromZone.neon || '#22d3ee';
      parts += `<path d="M${pStart.join(' ')} L${pEnd.join(' ')}" stroke="${pulseCol}" stroke-width="6" stroke-opacity="0.32" fill="none" filter="url(#neon-bloom)"/>`;
      parts += `<path d="M${pStart.join(' ')} L${pEnd.join(' ')}" stroke="#ffffff" stroke-width="2.4" fill="none" class="bridge-energy-active"/>`;
    } else if (statusMode === 'queued') {
      parts += `<path d="M${pStart.join(' ')} L${pEnd.join(' ')}" stroke="#f59e0b" stroke-width="2.4" fill="none" class="bridge-energy-queued"/>`;
    } else if (statusMode === 'done') {
      parts += `<path d="M${pStart.join(' ')} L${pEnd.join(' ')}" stroke="#10b981" stroke-width="1.8" stroke-opacity="0.65" fill="none"/>`;
    } else if (isNight) {
      parts += `<path d="M${pStart.join(' ')} L${pEnd.join(' ')}" stroke="#38bdf8" stroke-width="1.2" stroke-opacity="0.26" stroke-dasharray="4 6" fill="none"/>`;
    }
  }

  return parts;
}

function buildPavilionInterior(zone, z, isNight) {
  let art = '';
  const i = zone.index;
  const neon = zone.neon || '#22d3ee';
  const mullionCol = isNight ? '#334155' : '#475569';

  // Architectural rear glass curtain wall & neon mullions
  art += box(-84, -69, z, 168, 3.8, 4.5, '#334155', neon);
  art += glassPanel(-82, -68.5, z + 4.5, 164, 2.5, 42, neon, isNight ? 0.18 : 0.28);
  for (let m = 0; m <= 4; m++) {
    art += box(-82 + m * 40.5, -69, z + 4.5, 2.2, 3.2, 43, mullionCol, neon);
  }

  // Cantilevered Neon Skylight Pergola Ribs
  art += box(-83, -69.5, z + 46.5, 166, 4, 3, '#1e293b', neon);
  for (let rib = 0; rib < 4; rib++) {
    art += box(-72 + rib * 46, -68, z + 47, 3.2, 34, 2, isNight ? '#334155' : '#64748b', neon);
  }
  art += glassPanel(-76, -67, z + 48.5, 152, 30, 1, '#e0f2fe', isNight ? 0.14 : 0.24);

  // Left glass gallery wall
  art += box(-84, -69, z, 3.8, 122, 4.5, '#334155', neon);
  art += glassPanel(-83.5, -66, z + 4.5, 2.5, 112, 36, '#bae6fd', isNight ? 0.15 : 0.24);

  // Neon Light-Strip Floor Trim along front edge
  for (let k = 0; k < 15; k++) {
    art += box(-78 + k * 10.8, 62, z, 7.6, 2.4, 0.8, k % 2 ? neon : '#e2e8f0');
  }

  // Bespoke Cyber-Couture Equipment per Department
  if (i === 0) {
    // 👑 Điều phối — Executive Cyber Command Penthouse
    art += box(-60, -54, z, 120, 52, 3, shade(zone.color, 0.72), neon);
    art += box(-54, -63, z + 8, 102, 2.5, 31, '#0f172a', neon);
    for (let col = 0; col < 4; col++) {
      art += box(-49 + col * 24, -60.2, z + 32, 19, 0.8, 4.2, DYES[col]);
      for (let row = 0; row < 2; row++) {
        art += box(-49 + col * 24, -60.2, z + 13 + row * 8.5, 18, 0.8, 6.2, col === 0 ? neon : '#38bdf8');
      }
    }
    art += props.execDesk(-44, -30, z + 3, neon);
    art += box(24, 14, z, 38, 28, 12, '#0f172a', '#22d3ee');
    art += oval(43, 28, z + 12.5, 15, 7.2, '#22d3ee', 'opacity="0.56"');
    const [hx, hy] = iso(43, 28, z + 13);
    art += `<polygon points="${hx - 13},${hy} ${hx + 13},${hy} ${hx + 22},${hy - 32} ${hx - 22},${hy - 32}" fill="url(#holoCone)"/>`;
    art += hoodieShowcase(43, 28, z + 12, '#0f172a', '#67e8f9', false);
    art += props.stool(-54, 28, z, '#92400e') + props.stool(-36, 36, z, '#92400e');
    art += props.lushPlant(62, -52, z) + props.lushPlant(-74, 46, z);
  } else if (i === 1) {
    // 🔍 Nghiên cứu — Neon Trend & Holographic Moodboard Lab
    for (let p = 0; p < 3; p++) {
      art += box(-66 + p * 44, -63, z + 7, 38, 2.5, 31, '#0f172a', neon);
      for (let sw = 0; sw < 4; sw++) {
        art += box(-62 + p * 44 + sw * 8.2, -60.2, z + 12 + (sw % 2) * 7, 6.8, 0.8, 12, DYES[(p + sw) % DYES.length]);
      }
    }
    art += props.execDesk(-44, -18, z, '#22d3ee');
    art += box(22, -32, z, 42, 20, 14, '#1e293b', neon);
    for (let b = 0; b < 6; b++) {
      art += box(26 + b * 6, -28, z + 14, 4.2, 12, 6, DYES[b % DYES.length]);
    }
    art += box(2, 32, z, 4, 4, 12, '#475569') + oval(4, 34, z + 13, 20, 9.5, '#0f172a', `stroke="${neon}" stroke-width="1.3"`);
    art += props.stool(-18, 32, z, '#0e7490') + props.stool(24, 34, z, '#0e7490');
    art += props.lushPlant(62, 42, z) + props.lushPlant(-74, 44, z);
  } else if (i === 2) {
    // 🧵 Vật liệu — Digital Textile Vault & Laser PBR Scanner
    for (let bay = 0; bay < 3; bay++) {
      const bx = -64 + bay * 42;
      art += box(bx, -61, z, 36, 14, 36, '#334155', neon);
      for (let shelf = 0; shelf < 2; shelf++) {
        for (let r = 0; r < 4; r++) {
          art += box(bx + 3 + r * 8, -58, z + 4 + shelf * 16, 6.2, 10, 11, DYES[(bay + shelf + r) % DYES.length]);
        }
      }
    }
    art += box(-58, 2, z, 50, 25, 15, '#1e293b', neon);
    art += box(-52, 6, z + 15, 25, 17, 2.2, '#020617');
    art += face([[-50, 8, z + 17.4], [-29, 8, z + 17.4], [-29, 21, z + 17.4], [-50, 21, z + 17.4]], '#34d399', 'fill-opacity="0.68"');
    art += box(-21, 5, z + 15, 11, 2, 11, '#0f172a') + box(-19, 7.2, z + 17, 7.5, 0.5, 7, '#6ee7b7');
    for (let k = 0; k < 6; k++) {
      art += props.fabricRoll(18 + (k % 3) * 14, 4 + Math.floor(k / 3) * 16, z, k);
    }
    art += props.lushPlant(62, 44, z) + props.lushPlant(-74, 44, z);
  } else if (i === 3) {
    // 🎨 Thiết kế — 3D Neon Couture & CAD Sculpting Atelier
    art += box(-60, -63, z + 8, 116, 2.5, 30, '#0f172a', neon);
    for (let k = 0; k < 5; k++) {
      art += box(-54 + k * 22, -60.2, z + 13, 17, 0.8, 20, k === 2 ? '#f472b6' : DYES[k]);
    }
    art += props.execDesk(-54, -18, z, '#f472b6');
    art += hoodieShowcase(36, -22, z, '#181c24', '#f472b6', true);
    art += dressForm(58, 4, z, '#ec4899');
    art += box(-42, 24, z, 46, 24, 14, '#1e293b', neon);
    art += box(-34, 28, z + 14.2, 24, 15, 1.4, '#22d3ee');
    art += props.lushPlant(60, 44, z) + props.lushPlant(-74, 46, z);
  } else if (i === 4) {
    // 📐 Kỹ thuật — Laser QA & glTF Validation Lab
    art += box(-58, -63, z + 8, 112, 2.5, 29, '#020617', neon);
    for (let bar = 0; bar < 4; bar++) {
      art += box(-50 + bar * 26, -60, z + 14, 20, 0.8, 17, bar === 3 ? '#f59e0b' : '#22d3ee');
    }
    art += oval(40, -18, z + 1.5, 25, 12, 'none', `stroke="${neon}" stroke-width="1.6" stroke-dasharray="4 3"`);
    art += hoodieShowcase(40, -18, z, '#0f172a', '#60a5fa', true);
    art += box(-58, -12, z, 56, 26, 15, '#1e293b', neon);
    art += box(-54, -8, z + 15, 48, 18, 1.8, '#0f172a', '#60a5fa');
    art += box(-44, -3, z + 17, 26, 10, 0.8, '#22d3ee');
    art += box(-50, 26, z, 46, 20, 14, '#0f172a', neon);
    art += box(-44, 28, z + 14, 18, 2, 11, '#020617') + box(-22, 28, z + 14, 18, 2, 11, '#020617');
    art += props.lushPlant(60, 44, z) + props.lushPlant(-74, 44, z);
  } else if (i === 5) {
    // 📸 Studio hình ảnh — 360° Neon Cyclorama & WebGL Visual Stage
    art += box(-60, -61, z, 116, 42, 2.5, '#1e293b', neon);
    art += box(-60, -61, z + 2.5, 116, 5, 40, '#e2e8f0', neon);
    art += box(-60, -61, z + 2.5, 5, 42, 40, '#cbd5e1', neon);
    art += oval(-2, -36, z + 3, 26, 12.5, '#0f172a', 'stroke="#c084fc" stroke-width="1.8"');
    art += hoodieShowcase(-2, -36, z + 2.5, '#141821', '#c084fc', true);
    art += props.softboxLight(-54, 2, z, '#e0f2fe');
    art += props.softboxLight(46, -4, z, '#fae8ff');
    art += box(-2, 14, z, 3.5, 3.5, 24, '#334155') + box(-7, 10, z + 24, 13, 11, 8, '#0f172a', neon) + box(-3, 6, z + 26, 5, 5, 5, '#22d3ee');
    art += box(22, 24, z, 38, 20, 14, '#0f172a', neon);
    art += box(28, 27, z + 14, 24, 2, 14, '#020617') + box(30, 29.2, z + 16, 20, 0.6, 10, '#c084fc');
    art += props.lushPlant(-74, 44, z) + props.lushPlant(62, 44, z);
  } else if (i === 6) {
    // ✨ Sàn trưng bày — Cyber-Couture Catwalk Rotunda & Triple Neon Spotlights
    art += box(-70, -50, z, 140, 100, 5, isNight ? '#0f172a' : '#f8fafc', '#22d3ee');
    art += box(-58, -26, z + 5, 116, 52, 4.8, isNight ? '#050814' : '#fffbeb', '#f472b6');

    // Panoramic Runway Neon Backdrop Screen at rear of Catwalk
    art += box(-54, -56, z + 5, 108, 4, 38, '#020617', '#22d3ee');
    art += box(-48, -51.8, z + 10, 96, 0.8, 28, '#0f172a', '#a855f7');
    art += box(-20, -51, z + 13, 40, 0.8, 22, '#22d3ee');

    for (let led = 0; led < 7; led++) {
      const ledCol = led % 2 ? '#f472b6' : '#22d3ee';
      art += oval(-46 + led * 15.2, -21, z + 10.2, 2.4, 1.2, ledCol);
      art += oval(-46 + led * 15.2, 21, z + 10.2, 2.4, 1.2, ledCol);
    }
    art += hoodieShowcase(0, 0, z + 9.8, '#0b1020', '#22d3ee', true);
    art += dressForm(-38, -2, z + 9.8, '#ec4899');
    art += dressForm(38, -2, z + 9.8, '#38bdf8');
    art += dressForm(-22, -34, z + 5, '#fbbf24');
    art += dressForm(22, -34, z + 5, '#a855f7');

    art += box(-50, 33, z + 5, 44, 10, 5.5, '#7f1d1d', '#f472b6') + box(6, 33, z + 5, 44, 10, 5.5, '#7f1d1d', '#22d3ee');

    // Overhead Architectural Spotlight Truss & Triple-Color Volumetric Light Cones
    art += box(-62, -28, z + 9.8, 3.2, 3.2, 54, '#334155', '#22d3ee') + box(58.8, -28, z + 9.8, 3.2, 3.2, 54, '#334155', '#f472b6');
    art += box(-62, 24, z + 9.8, 3.2, 3.2, 54, '#334155', '#22d3ee') + box(58.8, 24, z + 9.8, 3.2, 3.2, 54, '#334155', '#f472b6');
    art += box(-63, -29, z + 63, 126, 3.2, 3.2, '#1e293b', '#22d3ee') + box(-63, 24, z + 63, 126, 3.2, 3.2, '#1e293b', '#f472b6');
    art += box(-63, -29, z + 63, 3.2, 56, 3.2, '#1e293b') + box(59.8, -29, z + 63, 3.2, 56, 3.2, '#1e293b');

    for (const [sx, grad] of [[-36, 'url(#spotlightCyan)'], [0, 'url(#spotlightBeam)'], [36, 'url(#spotlightMagenta)']]) {
      const [topX, topY] = iso(sx, 0, z + 63);
      const [botX, botY] = iso(sx, 0, z + 10);
      art += `<polygon points="${topX - 4},${topY} ${topX + 4},${topY} ${botX + 22},${botY} ${botX - 22},${botY}" fill="${grad}" pointer-events="none"/>`;
    }
    art += props.lushPlant(-78, 50, z) + props.lushPlant(68, 50, z);
  }

  return art;
}

function renderCharacterFigure(index, isWorking, hasToken) {
  const skinPalette = ['#eab38f', '#d49a76', '#f3c8ad', '#c58b68', '#e8b494', '#f0c4a8'];
  const outfitPalette = ['#f59e0b', '#06b6d4', '#10b981', '#ec4899', '#3b82f6', '#a855f7'];
  const pantsPalette = ['#1e293b', '#0f172a', '#27272a', '#1e1b4b', '#172554', '#2e1065'];
  const skin = hasToken ? skinPalette[index % 6] : '#cbd5e1';
  const outfit = hasToken ? outfitPalette[index % 6] : '#64748b';
  const outfitShade = shade(outfit, 0.78);
  const pants = hasToken ? pantsPalette[index % 6] : '#334155';
  const hair = ['#1e293b', '#3b2820', '#27272a', '#451a03', '#0f172a', '#312e81'][index % 6];

  let ring = '';
  if (!hasToken) {
    ring = `<ellipse cx="0" cy="2" rx="16" ry="7.5" fill="none" stroke="#ef4444" stroke-width="2.2" class="pulse-out"/>`;
  } else if (isWorking) {
    ring = `<ellipse cx="0" cy="2" rx="17" ry="8" fill="rgba(34,211,238,0.22)" stroke="#22d3ee" stroke-width="2.2" class="pulse-out"/>`;
  }

  const idleArmAngle = isWorking ? -28 : 6;
  const facingDir = index % 2 ? -1 : 1;
  return `${ring}
    <ellipse class="char-shadow" cx="0" cy="1.5" rx="9" ry="3.8" fill="#0f172a" opacity="0.26"/>
    <g class="char-facing" transform="scale(${facingDir * 1.22} 1.22)">
      <g class="char-body" transform="translate(0 0)">
        <g class="char-arm-b" transform="translate(-4.4 -24.5) rotate(${-idleArmAngle * 0.4})">
          <path d="M0 0 L-1.2 10.5" fill="none" stroke="${outfitShade}" stroke-width="2.8" stroke-linecap="round"/>
          <circle cx="-1.3" cy="11.5" r="1.5" fill="${skin}"/>
        </g>
        <g class="char-leg-b" transform="translate(-2.2 -13.5) rotate(0)">
          <path d="M0 0 L-0.4 12" fill="none" stroke="${pants}" stroke-width="3.4" stroke-linecap="round"/>
          <ellipse cx="0.6" cy="12.6" rx="2.3" ry="1.2" fill="#020617"/>
        </g>
        <g class="char-leg-f" transform="translate(2.2 -13.5) rotate(0)">
          <path d="M0 0 L0.4 12" fill="none" stroke="${pants}" stroke-width="3.4" stroke-linecap="round"/>
          <ellipse cx="1.4" cy="12.6" rx="2.3" ry="1.2" fill="#0f172a"/>
        </g>
        <path d="M-5.2 -26.8 Q0 -29.5 5.2 -26.2 L4.6 -13 Q0 -11.5 -5.4 -13.5 Z" fill="${outfit}"/>
        <path d="M-2 -27 L0 -23.5 L2 -27" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="0.9"/>
        <ellipse cx="0" cy="-33.2" rx="4.4" ry="5.1" fill="${skin}"/>
        <path d="M-4.4 -32.8 Q-5.6 -39.6 0.8 -39.2 Q6.1 -39.2 4.6 -33.6 L0 -34.8 Z" fill="${hair}"/>
        <g class="char-arm-f" transform="translate(4.4 -24.5) rotate(${idleArmAngle})">
          <path d="M0 0 L1.8 10" fill="none" stroke="${outfit}" stroke-width="2.9" stroke-linecap="round"/>
          <circle cx="2" cy="11.2" r="1.6" fill="${skin}"/>
        </g>
      </g>
    </g>`;
}

function buildPavilionPillSpecs(zone, deptSummary, tok, showCallouts) {
  const i = zone.index;
  const h = zone.h;
  const [u, v] = iso(zone.x, zone.y, 0);
  const labelY = Math.round((56 - h) * PAVILION_SCALE);
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
    const catTxt = '✦ CATWALK TRUNG TÂM';
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
    const topY = i === 5 ? Math.round((-88 - h) * PAVILION_SCALE) : Math.round((-94 - h) * PAVILION_SCALE);
    if (deptSummary.activeCount > 0) {
      const active = deptSummary.activeItems[0];
      const snippet = cleanOneLine(`${active.id} · ${active.title}`, 24);
      const callEst = estimateSvgTextWidth(snippet, 9.5);
      const callW = Math.max(166, callEst + 38);
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
      const snippet = cleanOneLine(`⏳ ${nextItem.id} · ${nextItem.title}`, 24);
      const callEst = estimateSvgTextWidth(snippet, 9.2);
      const callW = Math.max(156, callEst + 26);
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
      const doneTxt = `✓ ${deptSummary.doneCount} xong`;
      const callEst = estimateSvgTextWidth(doneTxt, 9);
      const callW = Math.max(92, callEst + 22);
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

  // Include Octagonal Cyber-Plaza outer corners + tallest scaled Pavilion roof spire
  const zone0U = iso(STUDIO_ZONES[0].x, STUDIO_ZONES[0].y, 0);
  const zone0Spire = iso(-84, -69.5, STUDIO_ZONES[0].h + 59.5);
  const structuralPoints = [
    iso(-505, 169, -22),
    iso(505, -169, -22),
    iso(-255, -505, -8),
    iso(255, 505, -22),
    [zone0U[0] + zone0Spire[0] * PAVILION_SCALE, zone0U[1] + zone0Spire[1] * PAVILION_SCALE],
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
  const neon = zone.neon || '#22d3ee';
  const [u, v] = iso(zone.x, zone.y, 0);

  let slab = '';
  // Neon underglow aura beneath the pavilion plinth
  slab += oval(0, 0, -1, 118, 52, neon, `opacity="${isNight ? (deptSummary?.activeCount > 0 ? 0.34 : 0.2) : 0.11}" filter="url(#neon-halo)"`);

  // Monumental Support Columns with Neon Plinths rising from Citadel Deck
  for (const [cx, cy] of [[-76, -58], [0, -58], [66, -58], [-76, 54], [66, 54]]) {
    slab += box(cx - 2, cy - 2, -2, 14, 14, 4, isNight ? '#1e293b' : '#cbd5e1', neon);
    slab += box(cx, cy, 2, 10, 10, h, isNight ? '#1e293b' : '#94a3b8', neon);
  }

  // Stepped Lower Architectural Podium + Main Pavilion Deck + Neon Cornice
  const deckColor = isSelected ? shade(zone.color, 1.1) : zone.color;
  slab += oval(0, 0, -2, 114, 49, '#020617', 'opacity="0.24" filter="url(#shadow)"');
  slab += box(-92, -73, Math.max(0, h - 6), 184, 146, 6, shade(deckColor, 0.8), neon);
  slab += box(-88, -70, Math.max(0, h), 176, 140, 10, deckColor, neon);
  if (h > 6) {
    slab += box(-84, -66, 0, 168, 132, h - 6, shade(deckColor, 0.72), neon);
  }

  // Subtle Neon Perimeter Trim + Active Execution / Selection Rim Light + Beacon Spire
  const isActiveDept = Boolean(deptSummary && deptSummary.activeCount > 0);
  const rimStroke = isActiveDept ? '#22d3ee' : isSelected ? '#f472b6' : neon;
  const rimWidth = isActiveDept ? 3 : isSelected ? 2.5 : 1.3;
  const rimExtra = isActiveDept ? `stroke="${rimStroke}" stroke-width="${rimWidth}" filter="url(#neon-bloom)"` : `stroke="${rimStroke}" stroke-width="${rimWidth}" stroke-opacity="${isNight ? 0.88 : 0.55}"`;
  slab += face(
    [
      [-89, -71, z + 0.4],
      [89, -71, z + 0.4],
      [89, 71, z + 0.4],
      [-89, 71, z + 0.4],
    ],
    'none',
    rimExtra,
  );
  if (isActiveDept) {
    slab += `<polygon points="-10,${-52 - h} 10,${-52 - h} 24,${-94 - h} -24,${-94 - h}" fill="url(#beaconSpire)" pointer-events="none"/>`;
  }

  // Front Entrance Steps on Pavilion
  for (let k = 0; k < 4; k++) {
    slab += box(16, 62 + k * 4.5, z - 4 - k * 3.5, 28, 4.5, 3.5, shade(zone.color, 0.94), neon);
  }

  slab += buildPavilionInterior(zone, z, isNight);

  // Render stationary specialist character IN PROPER DEPTH ORDER inside their open pavilion aisle!
  if (i < 6) {
    const [offX, offY] = STAFF_AISLE_OFFSETS[i] || [8, 18];
    const [sx, sy] = iso(offX, offY, z);
    const isWorking = isActiveDept;
    const hasToken = tok ? tok.hasToken : true;
    const summaryAction = deptSummary?.primaryItem
      ? `${deptSummary.primaryItem.statusLabel}: ${deptSummary.primaryItem.id} ${deptSummary.primaryItem.title}`
      : 'Sẵn sàng nhận việc';

    const roleTag = zone.roleShort || zone.staffName;
    const staffTagW = Math.round(Math.max(48, estimateSvgTextWidth(roleTag, 8.6) + 14));

    slab += `<g class="room staff" data-index="${i}" role="button" tabindex="0" aria-label="${esc(`${zone.staffName} · ${zone.label} · ${summaryAction}`)}" transform="translate(${sx} ${sy})">
      ${renderCharacterFigure(i, isWorking, hasToken)}
      <rect x="${-staffTagW / 2}" y="-68" width="${staffTagW}" height="15" rx="7.5" fill="${isWorking ? '#0e7490' : '#0b132b'}" stroke="${isWorking ? '#22d3ee' : neon}" stroke-width="1"/>
      <text y="-57.8" text-anchor="middle" fill="#ffffff" font-size="8.6" font-weight="800">${esc(roleTag)}</text>
    </g>`;
  }

  // Build collision-free dynamic-width HUD pills
  const pillSpecs = buildPavilionPillSpecs(zone, deptSummary, tok, showCallouts);
  const nameplateSpec = pillSpecs.find((p) => p.kind === 'nameplate');
  const subSpec = pillSpecs.find((p) => p.kind === 'subbadge');
  const calloutSpec = pillSpecs.find((p) => p.kind.startsWith('callout-'));

  const nameplateFill = isSelected ? (isNight ? '#0c2348' : '#1e3a8a') : isNight ? '#091128' : '#ffffff';
  const nameplateText = isSelected || isNight ? '#f8fafc' : '#13203b';
  const nameplateBorder = isSelected ? '#22d3ee' : isActiveDept ? '#38bdf8' : isNight ? neon : '#cbd5e1';

  let subBadgeSvg = '';
  if (subSpec) {
    if (i === 6) {
      subBadgeSvg = `
        <g class="token-badge-svg" transform="translate(0, ${subSpec.centerY})">
          <rect x="${subSpec.localX}" y="-9" width="${subSpec.width}" height="18" rx="9" fill="${isNight ? '#071c2c' : '#ecfdf5'}" stroke="#22d3ee" stroke-width="1.3"/>
          <text text-anchor="middle" y="3.5" fill="${isNight ? '#67e8f9' : '#047857'}" font-size="9.2" font-weight="800">${esc(subSpec.text)}</text>
        </g>`;
    } else if (tok) {
      const bg = isNight
        ? tok.status === 'out'
          ? '#3b0b18'
          : tok.isLow
            ? '#332006'
            : tok.status === 'ok'
              ? '#062c22'
              : '#0b132b'
        : tok.status === 'out'
          ? '#fef2f2'
          : tok.isLow
            ? '#fffbeb'
            : tok.status === 'ok'
              ? '#ecfdf5'
              : '#f8fafc';
      const border =
        tok.status === 'out'
          ? '#fb7185'
          : tok.isLow
            ? '#fbbf24'
            : tok.status === 'ok'
              ? '#34d399'
              : isNight
                ? '#475569'
                : '#94a3b8';
      const textCol = isNight
        ? tok.status === 'out'
          ? '#fda4af'
          : tok.isLow
            ? '#fde68a'
            : tok.status === 'ok'
              ? '#6ee7b7'
              : '#cbd5e1'
        : tok.status === 'out'
          ? '#b91c1c'
          : tok.isLow
            ? '#b45309'
            : tok.status === 'ok'
              ? '#15803d'
              : '#334155';

      subBadgeSvg = `
        <g class="token-badge-svg" transform="translate(0, ${subSpec.centerY})">
          <rect x="${subSpec.localX}" y="-9" width="${subSpec.width}" height="18" rx="9" fill="${bg}" stroke="${border}" stroke-width="1.2"/>
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
          <rect x="${calloutSpec.localX}" y="-12" width="${calloutSpec.width}" height="24" rx="12" fill="#0f295c" stroke="#22d3ee" stroke-width="1.5"/>
          <circle cx="${dotX}" cy="0" r="4" fill="#22d3ee" class="live-beacon"/>
          <text text-anchor="middle" x="7" y="3.5" fill="#ffffff" font-size="9.5" font-weight="800">${esc(calloutSpec.text)}</text>
        </g>`;
    } else if (calloutSpec.kind === 'callout-queued') {
      taskCalloutSvg = `
        <g class="task-callout-svg" transform="translate(0, ${calloutSpec.centerY})">
          <rect x="${calloutSpec.localX}" y="-11" width="${calloutSpec.width}" height="22" rx="11" fill="${isNight ? '#2b1c07' : '#fffbeb'}" stroke="#f59e0b" stroke-width="1.3"/>
          <text text-anchor="middle" y="3" fill="${isNight ? '#fde68a' : '#b45309'}" font-size="9.2" font-weight="800">${esc(calloutSpec.text)}</text>
        </g>`;
    } else {
      taskCalloutSvg = `
        <g class="task-callout-svg" transform="translate(0, ${calloutSpec.centerY})">
          <rect x="${calloutSpec.localX}" y="-9.5" width="${calloutSpec.width}" height="19" rx="9.5" fill="${isNight ? '#062620' : '#ecfdf5'}" stroke="#34d399" stroke-width="1.2"/>
          <text text-anchor="middle" y="3" fill="${isNight ? '#6ee7b7' : '#047857'}" font-size="9" font-weight="800">${esc(calloutSpec.text)}</text>
        </g>`;
    }
  }

  const labelOverlay = `
    <g class="pavilion-hud-overlay">
      ${taskCalloutSvg}
      <g transform="translate(0, ${nameplateSpec.centerY})">
        <rect x="${nameplateSpec.localX}" y="-11" width="${nameplateSpec.width}" height="22" rx="11" fill="${nameplateFill}" stroke="${nameplateBorder}" stroke-width="1.4"/>
        <text text-anchor="middle" y="4" fill="${nameplateText}" font-size="10.5" font-weight="800">${esc(nameplateSpec.text)}</text>
      </g>
      ${subBadgeSvg}
    </g>`;

  return {
    pavilionSvg: `<g class="room room-arch" data-index="${i}" tabindex="0" role="button" aria-label="${esc(zone.label)}" transform="translate(${u} ${v})"><g class="pavilion-arch" transform="scale(${PAVILION_SCALE})">${slab}</g></g>`,
    overlaySvg: `<g class="room room-hud" data-index="${i}" aria-hidden="true" transform="translate(${u} ${v})">${labelOverlay}</g>`,
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
  let activeShowcaseFilter = 'all';
  let cachedCatalogProducts = [];
  let activeShowcaseKey = '';
  let activeShowcaseUrl = '';
  let motionRafId = null;
  let lastMotionTs = 0;
  const assignments = new Map();

  // Persistent articulated walking states across sync() re-renders (strictly 6 unique staff, zero clones)
  const staffStates = [0, 1, 2, 3, 4, 5].map((i) => {
    const start = STAFF_PATROL_WAYPOINTS[i]?.[0] || STAFF_AISLE_OFFSETS[i] || [0, 20];
    return {
      index: i,
      x: start[0],
      y: start[1],
      fromX: start[0],
      fromY: start[1],
      toX: start[0],
      toY: start[1],
      wpIdx: 0,
      phase: 'pause',
      timer: 0,
      duration: 3.5 + i * 0.9,
      facing: i % 2 ? -1 : 1,
      stridePhase: i * 1.1,
      gesturePhase: i * 0.9,
      isWorking: false,
      rootEl: null,
      parts: null,
    };
  });

  // Initialize Cyber-Neon ('night') / Light Pearl ('day') theme — Neon 3D by default
  let studioTheme = 'night';
  try {
    const saved = localStorage.getItem('atelierx_studio_theme');
    if (saved === 'night' || saved === 'day') {
      studioTheme = saved;
    }
  } catch {
    // ignore storage errors
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-studio-theme', studioTheme);
    const btn = document.getElementById('btn-theme-toggle');
    if (btn) {
      btn.textContent = studioTheme === 'night' ? '☀️ Sáng' : '🌙 Neon';
    }
    const frame = document.getElementById('showcase-frame');
    if (frame?.contentWindow && typeof frame.contentWindow.postMessage === 'function') {
      try {
        const targetOrigin =
          typeof window !== 'undefined' && window.location?.origin && window.location.origin !== 'null'
            ? window.location.origin
            : '*';
        frame.contentWindow.postMessage({ type: 'atelierx-theme', theme: studioTheme }, targetOrigin);
      } catch {
        // ignore cross-frame messaging errors
      }
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

    // Corridor walker layer kept empty (zero duplicate clones of the 6 unique staff)
    world.innerHTML =
      sceneHtml +
      `<g class="corridor-walkers"></g>` +
      `<g class="hud-overlays">${overlays.join('')}</g>`;

    bindHumanActors(byDept);
  }

  function extractCharacterParts(root) {
    if (!root || typeof root.querySelector !== 'function') return null;
    return {
      facing: root.querySelector('.char-facing'),
      body: root.querySelector('.char-body'),
      legF: root.querySelector('.char-leg-f'),
      legB: root.querySelector('.char-leg-b'),
      armF: root.querySelector('.char-arm-f'),
      armB: root.querySelector('.char-arm-b'),
    };
  }

  function applyHumanPose(parts, { facing = 1, stridePhase = 0, walkBlend = 0, gesturePhase = 0, isWorking = false }) {
    if (!parts) return;
    if (parts.facing) {
      parts.facing.setAttribute('transform', `scale(${(facing >= 0 ? 1.22 : -1.22).toFixed(2)} 1.22)`);
    }
    const s = walkBlend > 0.01 ? Math.sin(stridePhase) * walkBlend : 0;
    const legAngle = s * 24;
    const armWalk = -s * 19;
    const idleArmF = isWorking ? -28 + Math.sin(gesturePhase * 3.1) * 9 : 6 + Math.sin(gesturePhase * 1.4) * 2.5;
    const idleArmB = isWorking ? 12 - Math.sin(gesturePhase * 3.1) * 5 : -3 - Math.sin(gesturePhase * 1.4) * 2;
    const armFAngle = walkBlend > 0.01 ? armWalk * walkBlend + idleArmF * (1 - walkBlend) : idleArmF;
    const armBAngle = walkBlend > 0.01 ? -armWalk * walkBlend + idleArmB * (1 - walkBlend) : idleArmB;
    const bobY =
      walkBlend > 0.01
        ? -Math.abs(Math.sin(stridePhase)) * 1.45 * walkBlend
        : Math.sin(gesturePhase * 1.8) * 0.35;
    const leanDeg = walkBlend * 3.5;

    if (parts.body) {
      parts.body.setAttribute('transform', `translate(0 ${bobY.toFixed(2)}) rotate(${leanDeg.toFixed(1)} 0 -16)`);
    }
    if (parts.legF) parts.legF.setAttribute('transform', `translate(2.2 -13.5) rotate(${legAngle.toFixed(1)})`);
    if (parts.legB) parts.legB.setAttribute('transform', `translate(-2.2 -13.5) rotate(${(-legAngle).toFixed(1)})`);
    if (parts.armF) parts.armF.setAttribute('transform', `translate(4.4 -24.5) rotate(${armFAngle.toFixed(1)})`);
    if (parts.armB) parts.armB.setAttribute('transform', `translate(-4.4 -24.5) rotate(${armBAngle.toFixed(1)})`);
  }

  function bindHumanActors(byDept) {
    const staffEls = world.querySelectorAll('.staff');
    for (const el of staffEls) {
      const idx = Number(el.dataset?.index);
      if (!Number.isInteger(idx) || idx < 0 || idx > 5) continue;
      const st = staffStates[idx];
      st.rootEl = el;
      st.isWorking = (byDept?.[idx]?.activeCount || 0) > 0;
      st.parts = extractCharacterParts(el);
      const z = STUDIO_ZONES[idx].h + 10;
      const [sx, sy] = iso(st.x, st.y, z);
      el.setAttribute('transform', `translate(${sx} ${sy})`);
      applyHumanPose(st.parts, {
        facing: st.facing,
        stridePhase: st.stridePhase,
        walkBlend: st.phase === 'walk' ? Math.sin(Math.min(1, st.timer / st.duration) * Math.PI) : 0,
        gesturePhase: st.gesturePhase,
        isWorking: st.isWorking,
      });
    }
  }

  function tickHumanMotion(ts) {
    if (destroyed) return;
    if (!lastMotionTs) lastMotionTs = ts;
    const dt = Math.min(0.08, Math.max(0, (ts - lastMotionTs) / 1000));
    lastMotionTs = ts;

    // Update calm, natural movement inside each department pavilion (zero skybridge clones)
    for (const st of staffStates) {
      const pts = STAFF_PATROL_WAYPOINTS[st.index];
      const z = STUDIO_ZONES[st.index].h + 10;
      st.gesturePhase += dt;

      if (st.phase === 'pause') {
        if (st.isWorking) {
          const home = pts?.[0];
          const distHome = home ? Math.hypot(home[0] - st.x, home[1] - st.y) : 0;
          if (distHome > 1.5 && home) {
            st.wpIdx = 0;
            st.fromX = st.x;
            st.fromY = st.y;
            st.toX = home[0];
            st.toY = home[1];
            st.duration = Math.max(1.2, distHome / 20);
            const screenDx = st.toX - st.fromX - (st.toY - st.fromY);
            if (Math.abs(screenDx) > 1) st.facing = screenDx >= 0 ? 1 : -1;
            st.phase = 'walk';
            st.timer = 0;
          } else {
            st.timer = 0;
          }
        } else {
          st.timer += dt;
          if (st.timer >= st.duration && pts && pts.length > 1) {
            st.wpIdx = (st.wpIdx + 1) % pts.length;
            st.fromX = st.x;
            st.fromY = st.y;
            st.toX = pts[st.wpIdx][0];
            st.toY = pts[st.wpIdx][1];
            const dist = Math.hypot(st.toX - st.fromX, st.toY - st.fromY) || 20;
            st.duration = Math.max(1.6, dist / 17);
            const screenDx = st.toX - st.fromX - (st.toY - st.fromY);
            if (Math.abs(screenDx) > 1) st.facing = screenDx >= 0 ? 1 : -1;
            st.phase = 'walk';
            st.timer = 0;
          }
        }
        applyHumanPose(st.parts, {
          facing: st.facing,
          stridePhase: st.stridePhase,
          walkBlend: 0,
          gesturePhase: st.gesturePhase,
          isWorking: st.isWorking,
        });
      } else {
        st.timer += dt;
        const raw = Math.min(1, st.timer / Math.max(0.1, st.duration));
        const smooth = raw * raw * (3 - 2 * raw);
        st.x = st.fromX + (st.toX - st.fromX) * smooth;
        st.y = st.fromY + (st.toY - st.fromY) * smooth;
        st.stridePhase += dt * 7.6;
        const walkBlend = Math.sin(raw * Math.PI);

        if (st.rootEl) {
          const [sx, sy] = iso(st.x, st.y, z);
          st.rootEl.setAttribute('transform', `translate(${sx} ${sy})`);
        }
        applyHumanPose(st.parts, {
          facing: st.facing,
          stridePhase: st.stridePhase,
          walkBlend,
          gesturePhase: st.gesturePhase,
          isWorking: st.isWorking,
        });

        if (raw >= 1) {
          st.x = st.toX;
          st.y = st.toY;
          st.phase = 'pause';
          st.timer = 0;
          st.duration = 5.0 + ((st.index * 7 + st.wpIdx * 3) % 5) * 0.85;
        }
      }
    }

    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      motionRafId = window.requestAnimationFrame(tickHumanMotion);
    }
  }

  function startHumanMotionLoop() {
    if (
      typeof window === 'undefined' ||
      typeof window.requestAnimationFrame !== 'function' ||
      (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)
    ) {
      return;
    }
    if (!motionRafId) {
      motionRafId = window.requestAnimationFrame(tickHumanMotion);
    }
  }

  function updateHeaderTelemetry(workloads) {
    const { totals } = workloads;

    const kpiActive = document.getElementById('kpi-active-work');
    if (kpiActive) {
      kpiActive.innerHTML = `<span class="kpi-dot ${totals.active > 0 ? 'live-beacon' : ''}" style="background:#22d3ee"></span><span>Đang làm: <strong>${totals.active}</strong></span>`;
      kpiActive.classList.toggle('is-filter-on', deptFilter === 'active');
    }
    const kpiQueued = document.getElementById('kpi-queued-work');
    if (kpiQueued) {
      kpiQueued.innerHTML = `<span class="kpi-dot" style="background:#f59e0b"></span><span>Chờ: <strong>${totals.pendingAttention}</strong></span>`;
      kpiQueued.classList.toggle('is-filter-on', deptFilter === 'queued');
    }
    const kpiDone = document.getElementById('kpi-done-work');
    if (kpiDone) {
      kpiDone.innerHTML = `<span class="kpi-dot" style="background:#10b981"></span><span>Xong: <strong>${totals.done}/${totals.total}</strong></span>`;
      kpiDone.classList.toggle('is-filter-on', deptFilter === 'done');
    }

    // Update compact filter tab counts
    const activeDeptCount = workloads.departments.filter((d) => d.activeCount > 0).length;
    const queuedDeptCount = workloads.departments.filter((d) => d.queuedCount + d.reviewCount > 0).length;
    const doneDeptCount = workloads.departments.filter((d) => d.doneCount > 0).length;

    document.querySelectorAll('[data-dept-filter]').forEach((btn) => {
      const f = btn.dataset.deptFilter;
      if (f === 'all') btn.textContent = 'Tất cả (7)';
      else if (f === 'active') btn.textContent = `⚡ Làm (${activeDeptCount})`;
      else if (f === 'queued') btn.textContent = `⏳ Chờ (${queuedDeptCount})`;
      else if (f === 'done') btn.textContent = `✓ Xong (${doneDeptCount})`;
      btn.classList.toggle('active', f === deptFilter);
    });

    // Compact Token & Runtime Fallback Header Summary
    const allAgents = [0, 1, 2, 3, 4, 5]
      .map((idx) => computeAgentTokenInfo(idx, members, liveTokenUsage, liveRuntimeFallback))
      .filter(Boolean);
    const okCount = allAgents.filter((a) => a.status === 'ok').length;
    const fallbackCount = allAgents.filter((a) => a.status !== 'out' && a.isRunningOnFallback).length;
    const outCount = allAgents.filter((a) => a.status === 'out').length;

    const summaryEl = document.querySelector('#token-summary-indicator');
    if (summaryEl) {
      if (outCount > 0) {
        summaryEl.innerHTML = `<span style="color:#fb7185">🔴 ${outCount} hết quota</span>`;
      } else if (fallbackCount > 0) {
        summaryEl.innerHTML = `<span style="color:#fbbf24">🟠 ${fallbackCount} dự phòng</span>`;
      } else if (okCount > 0) {
        summaryEl.innerHTML = `<span style="color:#34d399">🟢 ${okCount}/6 còn quota</span>`;
      } else {
        summaryEl.textContent = '⚡ Quota 6 ban';
      }
    }
  }

  function renderActiveSpotlight(workloads) {
    if (!spotlightEl) return;
    spotlightEl.replaceChildren();

    const activeItems = workloads.activeSpotlightItems;
    if (activeItems.length === 0) {
      spotlightEl.setAttribute('hidden', '');
      spotlightEl.hidden = true;
      return;
    }

    spotlightEl.removeAttribute?.('hidden');
    spotlightEl.hidden = false;

    const head = document.createElement('div');
    head.className = 'spotlight-header';
    head.innerHTML = `
      <span class="spotlight-title">
        <span class="kpi-dot live-beacon" style="background:#22d3ee"></span>
        ĐANG CHẠY (${activeItems.length})
      </span>
    `;
    spotlightEl.append(head);

    const list = document.createElement('div');
    list.className = 'spotlight-list';

    for (const item of activeItems) {
      const zone = STUDIO_ZONES[item.deptIndex];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'spotlight-item';
      btn.innerHTML = `
        <div class="spotlight-item-top">
          <span>${esc(zone.icon)} ${esc(zone.label)} · ${esc(zone.staffName)}</span>
          <span>${item.hasBlocker ? '⚠️ Nghẽn' : '⚡'}</span>
        </div>
        <div class="spotlight-item-main" title="${esc(`${item.id}: ${item.title}`)}">
          <span class="task-id-badge" style="margin-right:4px">${esc(item.id)}</span>${esc(cleanOneLine(item.title, 44))}
        </div>
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

    const tagText =
      item.bucket === 'active'
        ? '⚡ Đang làm'
        : item.bucket === 'review'
          ? '⚠️ Duyệt'
          : item.bucket === 'queued'
            ? '⏳ Chờ'
            : '✓';

    const line = document.createElement('div');
    line.className = 'task-card-line';
    line.innerHTML = `
      <span class="task-card-main">
        <span class="task-id-badge">${esc(item.id)}</span>
        <span class="task-title-text ${isDetailed ? 'is-expanded' : ''}" title="${esc(item.title)}">${esc(item.title)}</span>
      </span>
      <span class="task-status-tag ${tagClass}">${tagText}</span>
    `;
    card.append(line);

    if (item.hasBlocker && (item.blockerNote || item.liveStatusLabel)) {
      const blk = document.createElement('div');
      blk.className = 'task-blocker-note';
      const note = item.blockerNote || item.liveStatusLabel;
      blk.title = note;
      blk.textContent = `⚠️ ${cleanOneLine(note, isDetailed ? 140 : 64)}`;
      card.append(blk);
    }

    if (isDetailed && (item.brief.goal || item.brief.summary || item.criteriaTotal > 0)) {
      const briefBox = document.createElement('div');
      briefBox.className = 'task-brief-box';
      const goalTxt = item.brief.goal || item.brief.summary || '';
      const criteriaTxt = item.criteriaTotal > 0 ? `${item.criteriaDone}/${item.criteriaTotal} ✓` : '';
      briefBox.innerHTML = `<span>${esc(cleanOneLine(goalTxt, 95))}</span>${criteriaTxt ? `<span style="flex-shrink:0;font-weight:800">${esc(criteriaTxt)}</span>` : ''}`;
      card.append(briefBox);
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
      empty.innerHTML = `<div style="font-size:11.5px;color:var(--text-3)">Không có ban nào.</div>`;
      nav.append(empty);
      return;
    }

    for (const i of visibleIndices) {
      const zone = STUDIO_ZONES[i];
      const isSelected = selected === i;

      if (i === 6) {
        // ✨ Sàn trưng bày — Compact Catwalk & 6-Stage Switcher
        const runwayCard = document.createElement('article');
        runwayCard.className = `dept-card ${isSelected ? 'is-selected' : ''}`;
        runwayCard.style.setProperty('--dept-color', zone.neon || zone.color);
        runwayCard.dataset.deptIndex = '6';
        runwayCard.setAttribute('aria-current', isSelected ? 'true' : 'false');

        const header = document.createElement('div');
        header.className = 'dept-card-header';
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.innerHTML = `
          <div class="dept-identity">
            <span class="dept-emblem">${zone.icon}</span>
            <div class="dept-name-row">
              <span class="dept-name">${esc(zone.label)}</span>
            </div>
          </div>
          <div class="dept-badges">
            <span class="mini-pill work-done">${workloads.totals.completionPct}%</span>
          </div>
        `;
        header.addEventListener('click', () => selectDepartment(6, true, false));
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectDepartment(6, true, false);
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
              ? '⚡'
              : sd.reviewCount + sd.queuedCount > 0
                ? '⏳'
                : sd.doneCount > 0
                  ? '✓'
                  : '○';
          const step = document.createElement('button');
          step.type = 'button';
          step.className = 'pipeline-step';
          step.dataset.stageDept = String(sIdx);
          step.innerHTML = `<span>${esc(sz.icon)} ${esc(sz.label)}</span><span style="font-size:10px;color:var(--text-2)">${badge}</span>`;
          step.addEventListener('click', () => selectDepartment(sIdx, true));
          pipeGrid.append(step);
        }
        runwayCard.append(pipeGrid);

        const galleryButton = document.createElement('button');
        galleryButton.type = 'button';
        galleryButton.className = 'showcase-cta-btn';
        galleryButton.textContent = '✦ Mở Sàn 3D';
        galleryButton.addEventListener('click', (e) => {
          e.stopPropagation();
          openShowcase();
        });
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
      card.style.setProperty('--dept-color', zone.neon || zone.color);
      card.dataset.deptIndex = String(i);
      card.setAttribute('aria-current', isSelected ? 'true' : 'false');

      let workSummaryPill = `<span class="mini-pill tok-unlimited">Rảnh</span>`;
      if (d.activeCount > 0) {
        workSummaryPill = `<span class="mini-pill work-active">⚡ ${d.activeCount}</span>`;
      } else if (d.reviewCount + d.queuedCount > 0) {
        workSummaryPill = `<span class="mini-pill work-queued">⏳ ${d.reviewCount + d.queuedCount}</span>`;
      } else if (d.doneCount > 0) {
        workSummaryPill = `<span class="mini-pill work-done">✓ ${d.doneCount}</span>`;
      }

      const showTokenPill = tok && (tok.status === 'out' || tok.isLow || tok.status === 'ok');
      const tokenPillHtml = showTokenPill
        ? `<span class="mini-pill ${tok.pillClass}">${esc(tok.status === 'out' ? '🔴 Hết' : `${tok.pctRemaining ?? '--'}%`)}</span>`
        : '';

      const header = document.createElement('div');
      header.className = 'dept-card-header';
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-expanded', expandAllDepts ? 'true' : 'false');
      header.innerHTML = `
        <div class="dept-identity">
          <span class="dept-emblem">${zone.icon}</span>
          <div class="dept-name-row">
            <span class="dept-name">${esc(zone.label)}</span>
            <span class="agent-state-dot ${runtime.online ? 'online' : ''}" title="${esc(zone.memberName || zone.staffName)}">${esc(zone.roleShort || zone.staffName)}</span>
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
        const progTrack = document.createElement('div');
        progTrack.className = 'dept-progress-track';
        progTrack.setAttribute('aria-hidden', 'true');
        progTrack.innerHTML = `
          <div class="dept-progress-seg" style="width:${activePct}%;background:#22d3ee"></div>
          <div class="dept-progress-seg" style="width:${pendingPct}%;background:#f59e0b"></div>
          <div class="dept-progress-seg" style="width:${donePct}%;background:#10b981"></div>
        `;
        card.append(progTrack);
      }

      if (d.items.length > 0) {
        const taskGroup = document.createElement('div');
        taskGroup.className = 'dept-tasks-group';

        const nonDone = d.items.filter((it) => it.bucket !== 'done');
        const doneList = d.items.filter((it) => it.bucket === 'done');

        for (const item of nonDone) {
          taskGroup.append(createTaskCardElement(item, expandAllDepts));
        }

        const showAllDone = expandAllDepts || expandedDoneDepts.has(i);
        const visibleDone = showAllDone ? doneList : doneList.slice(0, nonDone.length > 0 ? 1 : 2);

        for (const item of visibleDone) {
          taskGroup.append(createTaskCardElement(item, expandAllDepts));
        }

        if (!showAllDone && doneList.length > visibleDone.length) {
          const moreBtn = document.createElement('button');
          moreBtn.type = 'button';
          moreBtn.className = 'more-done-btn';
          moreBtn.textContent = `+${doneList.length - visibleDone.length} việc xong`;
          moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            expandedDoneDepts.add(i);
            renderDepartmentsPanel(workloads);
          });
          taskGroup.append(moreBtn);
        }

        card.append(taskGroup);
      }

      if (isSelected && expandAllDepts) {
        const extra = document.createElement('div');
        extra.className = 'dept-inspector-extra';
        extra.innerHTML = `<span>${esc(runtime.text)}</span><span>${esc(tok?.model || 'gpt-6-luna')}</span>`;
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
    taskFlowFooter.textContent = `${totals.done}/${totals.total}`;
  }

  function renderTokenModalTable(workloads) {
    const banner = document.getElementById('modal-runtime-banner');
    if (banner) {
      const runtimeAccounts = Array.isArray(liveRuntimeFallback?.runtimeAccounts) ? liveRuntimeFallback.runtimeAccounts : [];
      const readyAccounts = runtimeAccounts.filter((a) => a && a.signedIn);
      const poolSummary =
        readyAccounts.length > 0
          ? `Pool tài khoản: ${readyAccounts.length}/${runtimeAccounts.length} account sẵn sàng (${readyAccounts.map((a) => a.target).slice(0, 4).join(', ')}${readyAccounts.length > 4 ? '…' : ''})`
          : '';
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
        banner.textContent = `Codex: ${codexIdentity.email} · ${quotaLabel} · ${codexIdentity.sessionsFresh ? 'Phiên agent đã làm mới' : 'Đang chờ làm mới phiên agent'} · ${syncLabel} · đo ${timeLabel}${poolSummary ? ` · ${poolSummary}` : ''}`;
      }
      const exhausted = Array.isArray(liveRuntimeFallback?.exhausted) ? liveRuntimeFallback.exhausted : [];
      const overrides = Array.isArray(liveRuntimeFallback?.overrides) ? liveRuntimeFallback.overrides : [];
      if (!codexIdentity?.email && (exhausted.length > 0 || overrides.length > 0 || poolSummary)) {
        const exNames = exhausted.map((e) => shortRuntimeName(e.runtime)).filter(Boolean);
        banner.removeAttribute?.('hidden');
        banner.hidden = false;
        const warnText =
          exNames.length > 0
            ? `⚠️ Cảnh báo Runtime Crewly: ${exNames.join(', ')} đã chạm giới hạn quota${overrides.length > 0 ? ` · ${overrides.length} Agent đã chuyển sang Runtime dự phòng.` : '.'}`
            : overrides.length > 0
              ? `ℹ️ Có ${overrides.length} Agent đang chạy trên Runtime dự phòng.`
              : '';
        banner.textContent = [warnText, poolSummary].filter(Boolean).join(' · ');
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

  function renderShowcaseCards() {
    const list = document.getElementById('showcase-list');
    const frame = document.getElementById('showcase-frame');
    const meta = document.getElementById('showcase-meta');
    const countPill = document.getElementById('showcase-count');
    const openTabBtn = document.getElementById('showcase-open-tab');
    if (!list || !frame || !meta) return;

    list.replaceChildren();
    const completeCount = cachedCatalogProducts.filter((p) => p?.status === 'complete').length;
    if (countPill) {
      countPill.textContent = `${completeCount} hoàn thiện · ${cachedCatalogProducts.length} mẫu`;
    }

    document.querySelectorAll('[data-showcase-filter]').forEach((btn) => {
      const f = btn.dataset.showcaseFilter || 'all';
      btn.classList.toggle('active', f === activeShowcaseFilter);
    });

    const visibleProducts = cachedCatalogProducts.filter((product) => {
      const viewerPath = String(product?.viewer || '');
      if (!/^products\/ATEL-\d+\/[a-zA-Z0-9._-]+\/index\.html$/.test(viewerPath) || viewerPath.includes('..')) {
        return false;
      }
      if (activeShowcaseFilter === 'complete') return product?.status === 'complete';
      if (activeShowcaseFilter === 'preview') return product?.status !== 'complete';
      return true;
    });

    if (!visibleProducts.length) {
      activeShowcaseUrl = '';
      if (openTabBtn) openTabBtn.disabled = true;
      frame.removeAttribute('src');
      const emptyBox = document.createElement('div');
      emptyBox.className = 'showcase-empty';
      emptyBox.textContent = 'Không có sản phẩm nào trong bộ lọc này.';
      list.append(emptyBox);
      meta.textContent = 'Chưa có sản phẩm phù hợp để hiển thị.';
      return;
    }

    const selectProduct = (product, button) => {
      list.querySelectorAll('.showcase-product').forEach((el) => el.classList.remove('active'));
      button.classList.add('active');

      const title = repairBrokenVietnamese(String(product.name || product.id || 'Sản phẩm'));
      const category = repairBrokenVietnamese(String(product.category || 'Trang phục 3D'));
      const revision = String(product.revision || '');
      const statusText = repairBrokenVietnamese(
        String(product.statusLabel || (product.status === 'complete' ? 'Hoàn thiện' : 'Xem thử · Đang tinh chỉnh phom')),
      );
      const tagline = repairBrokenVietnamese(String(product.tagline || product.description || ''));
      const swatch = /^#[0-9a-fA-F]{3,8}$/.test(String(product.swatchHex || '')) ? product.swatchHex : '#22d3ee';

      meta.replaceChildren();
      const mainWrap = document.createElement('div');
      mainWrap.className = 'sm-main';
      const swatchDot = document.createElement('span');
      swatchDot.className = 'sm-swatch';
      swatchDot.style.background = swatch;
      const textWrap = document.createElement('div');
      textWrap.className = 'sm-text';
      const titleStrong = document.createElement('strong');
      titleStrong.textContent = title;
      const subSpan = document.createElement('span');
      subSpan.className = 'sm-sub';
      subSpan.textContent = [product.id, revision, category, product.collection].filter(Boolean).join(' · ');
      textWrap.append(titleStrong, subSpan);
      mainWrap.append(swatchDot, textWrap);

      const statusBadge = document.createElement('span');
      statusBadge.className = `sp-status ${product.status === 'complete' ? 'is-complete' : 'is-preview'}`;
      statusBadge.textContent = statusText;

      const rightWrap = document.createElement('div');
      rightWrap.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;';
      rightWrap.append(statusBadge);
      if (tagline) {
        const descP = document.createElement('p');
        descP.className = 'sm-desc';
        descP.textContent = tagline;
        rightWrap.append(descP);
      }

      meta.append(mainWrap, rightWrap);

      const url = `/atelierx-products/${product.viewer}?revision=${encodeURIComponent(revision)}&theme=${encodeURIComponent(studioTheme)}`;
      activeShowcaseKey = `${product.id || ''}/${revision}`;
      activeShowcaseUrl = url;
      if (openTabBtn) openTabBtn.disabled = false;
      frame.src = url;
    };

    let selectedButton = null;
    let firstButton = null;

    for (const product of visibleProducts) {
      const revision = String(product.revision || '');
      const key = `${product.id || ''}/${revision}`;
      const isComplete = product.status === 'complete';
      const title = repairBrokenVietnamese(String(product.name || product.id || 'Sản phẩm'));
      const category = repairBrokenVietnamese(String(product.category || 'Trang phục'));
      const statusText = repairBrokenVietnamese(
        String(product.statusLabel || (isComplete ? 'Hoàn thiện' : 'Xem thử')),
      );
      const tagline = repairBrokenVietnamese(String(product.tagline || product.description || ''));
      const materialBadge = repairBrokenVietnamese(String(product.materialBadge || 'Mô phỏng 3D'));
      const swatch = /^#[0-9a-fA-F]{3,8}$/.test(String(product.swatchHex || '')) ? product.swatchHex : '#22d3ee';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'showcase-product';

      const topRow = document.createElement('div');
      topRow.className = 'sp-top';
      const catEl = document.createElement('span');
      catEl.className = 'sp-category';
      catEl.textContent = category;
      const statusEl = document.createElement('span');
      statusEl.className = `sp-status ${isComplete ? 'is-complete' : 'is-preview'}`;
      statusEl.textContent = isComplete ? '✓ Hoàn thiện' : '✦ Xem thử';
      topRow.append(catEl, statusEl);

      const titleRow = document.createElement('div');
      titleRow.className = 'sp-title-row';
      const sw = document.createElement('span');
      sw.className = 'sp-swatch';
      sw.style.background = swatch;
      const nameEl = document.createElement('strong');
      nameEl.className = 'sp-name';
      nameEl.textContent = title;
      titleRow.append(sw, nameEl);

      const taglineEl = document.createElement('p');
      taglineEl.className = 'sp-tagline';
      taglineEl.textContent = tagline || statusText;

      const footRow = document.createElement('div');
      footRow.className = 'sp-foot';
      const codeEl = document.createElement('span');
      codeEl.textContent = `${product.id || ''} · ${revision}`;
      const matEl = document.createElement('span');
      matEl.textContent = materialBadge;
      footRow.append(codeEl, matEl);

      button.append(topRow, titleRow, taglineEl, footRow);
      button.addEventListener('click', () => selectProduct(product, button));
      list.append(button);

      if (!firstButton) firstButton = { product, button };
      if (key === activeShowcaseKey) selectedButton = { product, button };
    }

    const initial = selectedButton || firstButton;
    if (initial) {
      selectProduct(initial.product, initial.button);
    }
  }

  async function openShowcase() {
    const overlay = document.getElementById('showcase-overlay');
    const list = document.getElementById('showcase-list');
    const frame = document.getElementById('showcase-frame');
    const meta = document.getElementById('showcase-meta');
    const countPill = document.getElementById('showcase-count');
    const openTabBtn = document.getElementById('showcase-open-tab');
    if (!overlay || !list || !frame || !meta) return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    list.replaceChildren();
    meta.textContent = 'Đang tải danh sách sản phẩm…';
    if (countPill) countPill.textContent = 'Đang tải…';
    if (openTabBtn) openTabBtn.disabled = true;
    try {
      const response = await fetch('/atelierx-products/catalog.json', { cache: 'no-store' });
      if (!response.ok) throw new Error('catalog unavailable');
      const catalog = await response.json();
      cachedCatalogProducts = Array.isArray(catalog.products)
        ? [...catalog.products].sort((a, b) => {
            const rank = (product) => (product?.status === 'complete' ? 0 : 1);
            return (
              rank(a) - rank(b) ||
              Number(String(b?.id || '').match(/ATEL-(\d+)/)?.[1] || 0) -
                Number(String(a?.id || '').match(/ATEL-(\d+)/)?.[1] || 0)
            );
          })
        : [];
      if (!cachedCatalogProducts.length) {
        if (countPill) countPill.textContent = '0 mẫu';
        meta.textContent = 'Chưa có sản phẩm trong Sàn trưng bày.';
        frame.removeAttribute('src');
        return;
      }
      renderShowcaseCards();
    } catch {
      if (countPill) countPill.textContent = 'Lỗi tải';
      meta.textContent = 'Chưa tải được catalog sản phẩm. Kiểm tra thư mục AtelierX/showcase.';
    }
  }

  const showcaseOverlay = document.getElementById('showcase-overlay');
  const showcaseClose = document.getElementById('showcase-close');
  const showcaseFilters = document.getElementById('showcase-filters');
  const showcaseOpenTab = document.getElementById('showcase-open-tab');
  function closeShowcase() {
    if (!showcaseOverlay) return;
    showcaseOverlay.classList.remove('open');
    showcaseOverlay.setAttribute('aria-hidden', 'true');
    const frame = document.getElementById('showcase-frame');
    if (frame) frame.removeAttribute('src');
    activeShowcaseUrl = '';
    if (showcaseOpenTab) showcaseOpenTab.disabled = true;
  }
  if (showcaseClose) showcaseClose.addEventListener('click', closeShowcase);
  if (showcaseOverlay) showcaseOverlay.addEventListener('click', (e) => { if (e.target === showcaseOverlay) closeShowcase(); });
  if (showcaseFilters) {
    showcaseFilters.querySelectorAll('[data-showcase-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeShowcaseFilter = btn.dataset.showcaseFilter || 'all';
        renderShowcaseCards();
      });
    });
  }
  if (showcaseOpenTab) {
    showcaseOpenTab.addEventListener('click', () => {
      if (!activeShowcaseUrl) return;
      if (typeof window !== 'undefined' && typeof window.open === 'function') {
        window.open(activeShowcaseUrl, '_blank', 'noopener,noreferrer');
      }
    });
  }

  function selectDepartment(index, focusCamera = false, shouldOpenShowcase = false) {
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
      [cx, cy] = iso(z.x, z.y, (z.h + 12) * PAVILION_SCALE);
      scale = 1.48;
      camera();
    }
    renderAll();
    if (index === 6 && shouldOpenShowcase) openShowcase();

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
          syncBadge.textContent = `● ${nowStr}`;
          syncBadge.style.color = 'var(--done-text)';
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
        syncBadge.textContent = '○ Offline';
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
      const idx = Number(g.dataset.index);
      selectDepartment(idx, true, idx === 6);
    }
  });
  world.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const g = e.target.closest('.room');
      if (g && g.dataset.index != null) {
        e.preventDefault();
        const idx = Number(g.dataset.index);
        selectDepartment(idx, true, idx === 6);
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
      closeModal();
      closeShowcase();
      selected = 6;
      renderAll();
    });
  }

  const showcaseHudBtn = document.getElementById('btn-showcase-hud');
  if (showcaseHudBtn) {
    showcaseHudBtn.addEventListener('click', () => {
      openShowcase();
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
  const collapseBtn = document.getElementById('btn-collapse-sidebar');

  function syncSidebarButtonsState() {
    const collapsed = document.body.classList.contains('sidebar-collapsed');
    const wide = document.body.classList.contains('sidebar-wide');
    if (collapseBtn) {
      collapseBtn.classList.toggle('dock-primary', collapsed);
      collapseBtn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      collapseBtn.textContent = collapsed ? '⇤ Hiện tab' : '⇥ Ẩn tab';
    }
    if (wideBtn) {
      wideBtn.classList.toggle('dock-primary', wide && !collapsed);
      wideBtn.textContent = wide && !collapsed ? '⇔ Gọn' : '⇔ Rộng';
    }
  }

  if (wideBtn) {
    wideBtn.addEventListener('click', () => {
      document.body.classList.remove('sidebar-collapsed');
      document.body.classList.toggle('sidebar-wide');
      syncSidebarButtonsState();
    });
  }

  if (collapseBtn) {
    collapseBtn.addEventListener('click', () => {
      const collapsed = document.body.classList.toggle('sidebar-collapsed');
      if (collapsed) document.body.classList.remove('sidebar-wide');
      syncSidebarButtonsState();
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
      syncBtn.classList.add('is-syncing');
      syncBtn.disabled = true;
      syncBtn.textContent = '↻ Đang tải…';
      Promise.resolve(sync()).finally(() => {
        if (!destroyed) {
          syncBtn.classList.remove('is-syncing');
          syncBtn.disabled = false;
          syncBtn.textContent = '↻ Đồng bộ';
        }
      });
    });
  }

  const sortModeBtn = document.getElementById('btn-sort-mode');
  if (sortModeBtn) {
    sortModeBtn.addEventListener('click', () => {
      sortByActive = !sortByActive;
      sortModeBtn.classList.toggle('is-active', sortByActive);
      sortModeBtn.textContent = sortByActive ? '⚡ Ưu tiên' : '🏛️ Thứ tự';
      renderDepartmentsPanel(getWorkloads());
    });
  }

  const expandAllBtn = document.getElementById('btn-expand-all');
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => {
      expandAllDepts = !expandAllDepts;
      expandAllBtn.classList.toggle('is-active', expandAllDepts);
      expandAllBtn.textContent = expandAllDepts ? 'Gọn' : 'Chi tiết';
      renderDepartmentsPanel(getWorkloads());
    });
  }

  document.querySelectorAll('[data-dept-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      deptFilter = btn.dataset.deptFilter || 'all';
      renderAll();
    });
  });

  const kpiBindings = [
    ['kpi-active-work', 'active'],
    ['kpi-queued-work', 'queued'],
    ['kpi-done-work', 'done'],
  ];
  for (const [id, targetFilter] of kpiBindings) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        deptFilter = deptFilter === targetFilter ? 'all' : targetFilter;
        renderAll();
      });
    }
  }

  // Token Modal Controls
  const modal = document.getElementById('token-modal');
  const openModalBtn = document.getElementById('token-summary-btn');
  const openModalBtn2 = document.getElementById('btn-open-token-modal');
  const closeModalBtn = document.getElementById('modal-close-btn');
  const manageAccountsBtn = document.getElementById('btn-manage-accounts');

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
  if (manageAccountsBtn) {
    manageAccountsBtn.addEventListener('click', () => {
      try {
        if (typeof window !== 'undefined' && window.top && window.top.location) {
          window.top.location.href = '/settings?tab=runtimes';
        } else if (typeof window !== 'undefined' && window.location) {
          window.location.href = '/settings?tab=runtimes';
        }
      } catch {
        if (typeof window !== 'undefined' && window.open) {
          window.open('/settings?tab=runtimes', '_blank', 'noopener,noreferrer');
        }
      }
    });
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
  const onDocKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (modal?.classList.contains('open')) closeModal();
      if (showcaseOverlay?.classList.contains('open')) closeShowcase();
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

  // Full-screen & Return-to-Tickets topbar controls
  const backTicketsBtn = document.getElementById('btn-back-tickets');
  if (backTicketsBtn) {
    backTicketsBtn.addEventListener('click', () => {
      try {
        if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'atelierx-close-studio' }, window.location?.origin || '*');
          return;
        }
      } catch {
        // fallback below
      }
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/tickets';
      }
    });
  }

  let isEmbeddedFull = true;
  const fullscreenStudioBtn = document.getElementById('btn-fullscreen-studio');
  if (fullscreenStudioBtn) {
    fullscreenStudioBtn.addEventListener('click', () => {
      try {
        if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
          isEmbeddedFull = !isEmbeddedFull;
          fullscreenStudioBtn.textContent = isEmbeddedFull ? '⛶ Thu nhỏ' : '⛶ Toàn màn';
          window.parent.postMessage({ type: 'atelierx-toggle-fullscreen', full: isEmbeddedFull }, window.location?.origin || '*');
          return;
        }
      } catch {
        // fallback below
      }
      if (typeof document !== 'undefined') {
        if (!document.fullscreenElement && typeof document.documentElement?.requestFullscreen === 'function') {
          void document.documentElement.requestFullscreen().catch(() => {});
        } else if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
          void document.exitFullscreen().catch(() => {});
        }
      }
    });
  }

  // Initial Paint & Periodic Live Sync
  camera();
  renderAll();
  startHumanMotionLoop();
  sync();
  const timer = setInterval(sync, 10000);

  return {
    sync,
    selectDepartment,
    destroy: () => {
      destroyed = true;
      clearInterval(timer);
      if (motionRafId && typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function') {
        window.cancelAnimationFrame(motionRafId);
      }
      document.removeEventListener('keydown', onDocKeyDown);
    },
  };
}

if (typeof document !== 'undefined' && document.querySelector('#scene') && !globalThis.__ATELIERX_MANUAL_BOOT__) {
  initAtelierXStudio();
}
