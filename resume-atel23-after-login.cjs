const fs = require('fs');
const token = fs.readFileSync('/home/node/.crewly/api-token', 'utf8').trim();
const base = 'http://127.0.0.1:8787/api/task-pool/';
const ids = [
  '2e7ea55b-bc71-4a4f-ab28-be00900aecea',
  '03387d63-e12e-47a6-8356-6d427e787d72',
];
async function call(path, body) {
  const r = await fetch(base + path, {method:'POST', headers:{'content-type':'application/json','X-Crewly-Token':token}, body:JSON.stringify(body)});
  const data = await r.json();
  if (!r.ok || !data.success) throw new Error(`${path}: ${r.status} ${data.error ?? ''}`);
}
(async () => {
  for (const id of ids) {
    await call(`items/${id}/notes`, {author:'owner', note:'Chủ dự án đã đổi tài khoản Codex. Probe độc lập lúc 04:18 UTC trả OK. Hủy chỉ thị chờ reset 05:12 UTC của tài khoản cũ; nhận lại đúng WorkItem này và tiếp tục ngay. Chỉ block lại nếu probe mới thất bại và có bằng chứng lỗi mới.'});
    await call(`release/${id}`, {reason:'New Codex account probe succeeded; cancel old quota reset hold'});
    console.log(id, 'released');
  }
})().catch(e => {console.error(e.message); process.exitCode = 1});
