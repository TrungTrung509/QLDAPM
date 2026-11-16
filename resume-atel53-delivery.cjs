const fs = require('node:fs');
const token = fs.readFileSync('/home/node/.crewly/api-token', 'utf8').trim();
const workItemId = '051ab175-6f92-42b2-9b39-c912582fd424';
const target = 'atelierx-team-leader-0001';
const message = 'ATEL-53: Quy tắc owner là không publish trước QA và quality gate, không phải cấm đưa sản phẩm đã đạt QA vào Sàn trưng bày Crewly. QA cuối v1.2-surface-v1 đã pass; Lead đã xem artifact. Hãy tạo/cập nhật catalog entry đúng revision ở trạng thái preview, ghi leadApproved=true chỉ sau khi đối chiếu ảnh và nội dung, chạy node tools/quality-gate.mjs --product ATEL-53; nếu pass, chạy lại với --publish để hiện trong Crewly rồi hoàn tất chính WorkItem Lead. Công cụ bàn giao sẽ chuyển TKT-009 sang To review khi các WorkItem liên kết đã kết thúc. Không deploy ra ngoài, không tự Verified thay owner, không tạo thêm Verify/Retry. Nếu gate fail, sửa đúng lỗi gate rồi kiểm lại.';
async function api(route, body) {
  const response = await fetch(`http://127.0.0.1:8787/api/${route}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', 'X-Crewly-Token': token },
    body: body && JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok || payload.success === false) throw Error(`${route}: ${response.status} ${payload.error || payload.message || ''}`);
  return payload.data;
}
(async () => {
  const item = await api(`task-pool/items/${workItemId}`);
  if (item.target !== target || item.status !== 'blocked' || !item.blockedReason?.includes('not to self-publish')) throw Error('Lead blocker changed; no action taken');
  await api(`task-pool/items/${workItemId}/notes`, { author: 'system:atelierx-delivery-clarification', note: message });
  await api(`task-pool/release/${workItemId}`, { reason: 'QA final passed; internal Crewly showcase publication is authorized after quality gate' });
  await api(`terminal/${target}/deliver`, { message, queueIfBusy: true });
  console.log('Lead delivery WorkItem released with internal publication clarification');
})().catch(error => { console.error(error.message); process.exitCode = 1; });
