// Targeted, idempotent AtelierX team migration. Preserve live sessions and status.
const fs = require('node:fs');
const path = require('node:path');

const teamId = 'af30c001-2789-4f20-b917-000000000010';
const seed = path.join(__dirname, 'teams', teamId, 'config.json');
const live = process.argv[2] || seed;
const config = JSON.parse(fs.readFileSync(live, 'utf8'));
if (config.id !== teamId || config.members.length !== 6) throw new Error('Unexpected AtelierX team config');

const common = 'Làm việc bằng tiếng Việt có dấu. Đọc /home/node/project/AtelierX/.crewly/knowledge/operating-model.md, PLAN_CHAT_LUONG_SAN_PHAM.md, skill atelierx-flow và atelierx-quality trước khi làm. Sản phẩm là trang phục số 3D xem trong Sàn trưng bày của web Crewly; không deploy bên ngoài. Bản nháp ghi preview trong showcase/catalog.json, chỉ ghi complete sau QA browser thật, phiếu điểm và quality gate đạt. Chỉ làm thông số sản xuất thật khi người dùng yêu cầu. Mỗi đơn có thread điều phối riêng của team trên #general AtelierX, tách với chat người dùng; sau khi nhận WorkItem thật hãy đăng NHẬN VIỆC bằng atelierx-channel, khi có kết quả đăng BÀN GIAO và lưu messageId vào ticket. Ghi mã ticket, revision, đường dẫn nội bộ, bằng chứng kiểm tra, việc còn thiếu và người nhận. Tin chat không thay việc giao ticket thật. Không tự nhận hoàn tất nếu chưa có bằng chứng.';
const roleRules = {
  'team-leader': 'Bạn là Studio Lead. Tự chốt chi tiết brief còn mở. Trong 2 phút tạo ticket cha do chính Lead sở hữu và các ticket con; chỉ giao WorkItem của ticket con cho Researcher, Material Specialist, Designer, Visual Studio cùng lúc, QA chuẩn bị checklist. Không giao ticket cha cho phòng chuyên môn. Kiểm assignee và WorkItem. Phân quyền file rõ ràng, chỉ phần phụ thuộc mới chờ. Khi WorkItem done hoặc blocked, đối chiếu và cập nhật ticket, giao lại việc cần thiết. Sở hữu showcase/catalog.json; bản nháp ghi preview, chỉ duyệt khi GLB, viewer, catalog và QA cùng revision, sản phẩm mở và xoay được trong Sàn trưng bày Crewly. Bàn giao kết quả hoàn chỉnh cho người dùng.',
  tpm: 'Bạn là Market & Trend Researcher. Bắt đầu từ brief. Sở hữu hướng minh họa: chủ thể, bố cục, bảng màu, ràng buộc và nguồn tham khảo. Bàn giao ngắn cho Designer và Lead; không đợi model hoặc material spec.',
  designer: 'Bạn là Fashion Designer. Bắt đầu dựng phom và artwork từ brief; sở hữu file nguồn, texture, GLB và ảnh trước/sau. Tích hợp art direction và material spec khi có. Bàn giao đúng revision cho Visual Studio, QA và Lead. Không sửa viewer hoặc phiếu QA.',
  qa: 'Bạn là Technical Designer / QA. Chuẩn bị checklist từ brief ngay. Khi có GLB nháp, kiểm độc lập màu, phom, mặt in, vị trí, hướng và tính toàn vẹn model; kiểm viewer thực khi có URL. Ghi rõ revision, bằng chứng, lỗi và chủ file cần sửa. Không tự sửa file của Designer hoặc Visual Studio.',
  'backend-developer': 'Bạn là Merchandiser / Material Specialist. Bắt đầu từ brief và loại áo. Sở hữu material spec số: màu, material slot, roughness, normal, vùng in và fallback. Bàn giao sớm cho Designer và Visual Studio. Thiếu thông số may thật không chặn mockup số; không sửa GLB hoặc viewer.',
  'frontend-developer': 'Bạn là Brand & Commerce / Visual Studio. Bắt đầu viewer từ brief với GLB mẫu. Sở hữu file web, trạng thái tải/lỗi, điều khiển xoay và zoom. Khi có GLB cuối, thay nguồn cùng revision, chép viewer và asset vào showcase/products/ATEL-n/vN/, kiểm đường dẫn nội bộ Crewly và gửi QA. Không deploy bên ngoài, không sửa model hoặc material spec.'
};
const upgradedSkills = new Map([
  ['atelierx-flow','atelierx-flow-v4'],
  ['atelierx-flow-v3','atelierx-flow-v4'],
  ['atelierx-channel','atelierx-channel-v3'],
  ['atelierx-dispatch','atelierx-dispatch-v3'],
  ['atelierx-approve','atelierx-approve-v3'],
  ['atelierx-base','atelierx-base-v3'],
  ['atelierx-base-v2','atelierx-base-v3'],
  ['atelierx-artwork','atelierx-artwork-v2'],
  ['atelierx-viewer-qa','atelierx-viewer-qa-v3'],
  ['atelierx-research-v2','atelierx-research-v3'],
  ['atelierx-research-v3','atelierx-research-v4'],
  ['atelierx-designer-v3','atelierx-designer-v4'],
  ['atelierx-lead-v3','atelierx-lead-v4'],
  ['atelierx-dispatch-v3','atelierx-dispatch-v4']
]);
const suppliedBasePolicy = '29 GLB trong phom cơ sở do chủ dự án cung cấp được phép dùng cho AtelierX theo quality/USER_SUPPLIED_BASE_POLICY.md. Tra thư viện phom nội bộ trước khi tìm nguồn trên mạng; với hoodie ATEL-1 kiểm hai phom user-classic-black-flame-hoodie và user-green-and-white-hoodie. Áp dụng atelierx-fast-lane-v1: Designer không chờ Researcher khi có phom, QA nhận bản thử sớm, phiên Researcher bị khóa không chặn cả đơn. Không chặn công việc để xin lại URL hay giấy phép từng file. Ưu tiên lấy phom làm tham khảo rồi tạo kiểu dáng, màu, vật liệu và họa tiết riêng; nếu sửa mesh gốc, ghi derivedFrom và checksum, nếu dựng độc lập, ghi referenceBaseId. Quyền dùng trong project không thay thế kiểm chất lượng G1 và QA browser trước khi approved.';
const rolePlaybook = {
  'team-leader': 'atelierx-lead-v4',
  tpm: 'atelierx-research-v4',
  designer: 'atelierx-designer-v4',
  qa: 'atelierx-qa-v2',
  'backend-developer': 'atelierx-material-v2',
  'frontend-developer': 'atelierx-visual-v2'
};

for (const member of config.members) {
  if (!roleRules[member.role]) throw new Error(`Unknown role ${member.role}`);
  member.systemPrompt = `${common}\n${suppliedBasePolicy}\n${roleRules[member.role]}`.replaceAll('atelierx-flow', 'atelierx-flow-v4').replaceAll('atelierx-channel', 'atelierx-channel-v3');
  member.skillOverrides = [...new Set((member.skillOverrides || []).map(id => upgradedSkills.get(id) || id))];
  member.excludedRoleSkills ||= [];
  member.skillOverrides = member.skillOverrides.filter(id => id !== 'atelierx-flow-v3' && id !== 'atelierx-lead-v2');
  if (!member.skillOverrides.includes('atelierx-flow-v4')) member.skillOverrides.unshift('atelierx-flow-v4');
  if (!member.skillOverrides.includes('atelierx-quality')) member.skillOverrides.push('atelierx-quality');
  if (!member.skillOverrides.includes('atelierx-fast-lane-v1')) member.skillOverrides.push('atelierx-fast-lane-v1');
  if (!member.skillOverrides.includes('atelierx-channel-v3')) member.skillOverrides.push('atelierx-channel-v3');
  if (!member.skillOverrides.includes(rolePlaybook[member.role])) member.skillOverrides.push(rolePlaybook[member.role]);
  if (member.role === 'team-leader' && !member.skillOverrides.includes('skill-assign-ticket')) member.skillOverrides.push('skill-assign-ticket');
}
require('./upgrade-atelierx-v6.cjs')(config);
const tmp = `${live}.flow-${process.pid}.tmp`;
fs.writeFileSync(tmp, JSON.stringify(config, null, 2) + '\n', 'utf8');
fs.renameSync(tmp, live);
console.log('AtelierX flow upgraded:', live, config.members.length, 'members');
