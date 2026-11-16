const fs = require('node:fs');
const token = fs.readFileSync('/home/node/.crewly/api-token', 'utf8').trim();
const root = '/home/node/project/AtelierX';
const source = `${root}/quality/candidates/user-supplied/shirt.glb`;
const expected = '1de5a29649bd5520bc5163660c40e58799f514c8cbb36cbbcd18611cc3c497d3';
const hash = require('node:crypto').createHash('sha256').update(fs.readFileSync(source)).digest('hex');
if (hash !== expected) throw Error('Owner shirt source hash changed');
const api = async (route, body) => {
  const response = await fetch(`http://127.0.0.1:8787/api/${route}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', 'X-Crewly-Token': token },
    body: body && JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok || payload.success === false) throw Error(`${route}: ${response.status} ${payload.error || payload.message || ''}`);
  return payload.data;
};
async function main() {
  const flow = JSON.parse(fs.readFileSync(`${root}/orders/ATEL-53/studio-flow.json`, 'utf8'));
  if (flow.requestId !== '445ea941-034d-4479-b633-fbdc1646bc4c') throw Error('Unexpected ATEL-53 request');
  const instructions = [
    {
      role: 'lead',
      message: 'Chủ dự án đã cấp shirt.glb làm phom cơ sở cho ATEL-53. Đọc orders/ATEL-53/OWNER_SHIRT_BASE.md và xem sáu ảnh tại quality/evidence/shirt-owner/browser/. Bỏ nhánh Marvelous Designer và yêu cầu owner cấp nguồn; giao Vy dùng file quality/candidates/user-supplied/shirt.glb (SHA-256 1de5a296...) trên chính WorkItem ATEL-62. Giữ cổ, tay, nếp vải và khuy gắn bề mặt; đổi caro nguồn thành xanh da trời sáng và sọc dọc trắng mảnh ở bước Material. QA duyệt phom xám rồi mới trang trí. Không tạo retry/verify hoặc báo hoàn thành trước gate. Ghi nguồn eigenscene/Sketchfab CC BY 4.0 theo metadata file.',
    },
    {
      role: 'designer',
      message: 'ATEL-53 đã có nguồn mới do chủ dự án cung cấp: quality/candidates/user-supplied/shirt.glb, SHA-256 1de5a29649bd5520bc5163660c40e58799f514c8cbb36cbbcd18611cc3c497d3. Đọc orders/ATEL-53/OWNER_SHIRT_BASE.md và ảnh sáu góc. Tiếp tục đúng WorkItem ATEL-62: giữ geometry vải, collar, sleeve, cuff và hàng khuy từ nguồn; tạo bản xám không texture caro, render đủ sáu góc và closeup cổ/nẹp/cổ tay, handoff shape cho QA qua studio-flow. Không dùng Marvelous Designer, không tự dựng lại phom đặc khối. Nếu cần chỉnh, ghi derivedFrom/hash. QA vẫn quyết định pass/return.',
    },
  ];
  for (const { role, message } of instructions) {
    const task = flow.tasks[role];
    if (!task?.workItemId) throw Error(`No ${role} WorkItem`);
    const item = await api(`task-pool/items/${task.workItemId}`);
    if (item.target !== task.target || item.status !== 'blocked') throw Error(`${role} WorkItem changed: ${item.status}`);
    await api(`task-pool/items/${task.workItemId}/notes`, { author: 'owner:shirt-source', note: message });
    await api(`task-pool/release/${task.workItemId}`, { reason: 'Owner supplied qualified shirt GLB candidate; resume same WorkItem' });
    await api(`terminal/${task.target}/deliver`, { message, queueIfBusy: true });
    console.log(`${role}: released ${task.workItemId}`);
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
