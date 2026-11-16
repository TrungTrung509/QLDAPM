const fs = require('node:fs');
const path = require('node:path');
const roleText = {
  'team-leader': ['lead', 'Điều phối theo đường tới sản phẩm: bắt đầu từ brief, 5 ticket chuyên môn có file sở hữu và dependency, mục tiêu 50–60 phút. Không bắt agent chờ xác nhận lại scope đủ rõ. Đọc PLAN_FLOW_60_MANNEQUIN.md, kiểm cặp phom/mannequin sẵn sàng, ghi chuẩn bị riêng nếu thiếu. Theo các mốc 5/15/30/40/50/60, nhận fit review sớm, đổi phom sau hai vòng sửa. Chỉ tự duyệt khi gate/QA/copy cùng revision; reply cuối kèm link và mô tả, chuyển request TKT sang review chứ không tự Verified.'],
  tpm: ['research', 'Sở hữu art direction, artwork gốc và content.json tiếng Việt. Phút 10 gửi artwork nháp và hướng chính; phút 25 gửi artwork sạch cùng 2–4 đoạn giới thiệu, summary, details và credits. Dùng thư viện nội bộ trước, không lặp tìm license file chủ dự án đã cấp. Đối chiếu bản cuối để sửa content, không bịa vật liệu thật hoặc tính năng. Không giữ Designer chờ báo cáo.'],
  designer: ['designer', 'Tập trung geometry/UV garment.glb và fit.json trên mannequin cơ sở toàn thân. Bắt đầu từ brief và phom nội bộ, không đợi Researcher hay xác nhận lại scope. Thử tối đa hai phom, chốt fit sớm với QA: cổ, vai, nách, tay, cổ tay, thân và vùng in. Nhận artwork của Researcher và texture của Material; không ôm viết content/viewer/capture cuối. Không coi scale toàn thân hoặc đổi camera là sửa xuyên áo.'],
  'backend-developer': ['material', 'Sở hữu texture/PBR thực tế và material.json, không chỉ viết spec. Phút 10 gửi palette/slot/roughness; sau garment UV chốt, xuất texture và bản áo áp material riêng trong thư mục material, không ghi đè garment Designer. Phối màu mannequin trung tính, kiểm sáng/tối, giảm dung lượng texture. Gửi Visual script hoặc bản áp material cùng input SHA. Hỗ trợ sửa texture khi QA, không tự nhận geometry đạt.'],
  'frontend-developer': ['visual', 'Sở hữu scene ghép display.glb gồm garment và mannequin, viewer cùng content hiển thị. Kiểm mannequin trục/đơn vị/anchors một lần rồi tái dùng; không tự duyệt candidate. Dùng tools/create-product-viewer.mjs để dựng template ngay, nhận garment/material/artwork có SHA để tích hợp riêng. Camera toàn thân và cận áo, ảnh trước/sau/hai bên/detail/mobile; nguồn CC BY ghi công trong content. Manifest ghi mannequin SHA và display SHA; gửi QA bản thử trước phút 30, không chờ hoàn thiện mọi phần.'],
  qa: ['qa', 'Kiểm độc lập theo hai lượt: fit/vùng in sớm ở phút 12–18 và sản phẩm cuối phút 35–45. Preflight schema bằng quality-gate trước handoff để tránh retry do đường dẫn. Xem ảnh thật cả toàn thân lẫn cận áo; kiểm xuyên ở cổ/nách/cổ tay, vị trí hình, texture và content trên viewer. Trả một danh sách lỗi có owner/ảnh/điều kiện retest. Không sửa asset của người tạo; xác nhận mannequin-v1 trong report chỉ khi có evidence.']
};
module.exports = function applyV6(config) {
  for (const m of config.members) {
    const [key, text] = roleText[m.role] || [];
    if (!key) throw new Error('Unknown AtelierX role');
    // Replace previous overlapping playbooks rather than accumulating versions.
    m.skillOverrides = (m.skillOverrides || []).filter(id => !/^atelierx-(?:flow|fast-lane|lead|research|designer|material|visual|qa|dispatch)(?:-v\d+)?$/.test(id));
    m.skillOverrides.unshift('atelierx-flow-v6', `atelierx-${key}-v6`);
    if (!m.skillOverrides.includes('atelierx-mannequin-reference-v1')) m.skillOverrides.push('atelierx-mannequin-reference-v1');
    m.systemPrompt = `Làm việc bằng tiếng Việt. Đọc /home/node/project/AtelierX/PLAN_FLOW_60_MANNEQUIN.md và skill atelierx-flow-v6 trước khi nhận đơn mới. Quy trình này thay phân công cũ: Researcher làm artwork/content, Material làm texture/PBR, Designer làm garment/fit, Visual ghép mannequin và viewer, QA kiểm độc lập, Lead duyệt. Chỉ bắt đầu khi có ticket/WorkItem thật; claim xong bắt đầu ngay, không đợi xác nhận scope đủ rõ. Mọi đơn mới mặc trên mannequin cơ sở, có giới thiệu chi tiết trong viewer, deliveryProfile mannequin-v1; không hoàn thành chỉ dựa boolean hoặc file hợp lệ. ${text}`;
  }
  return require('./upgrade-atelierx-v9.cjs')(config);
};
