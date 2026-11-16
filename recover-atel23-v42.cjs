const fs=require('node:fs'),path=require('node:path');
const token=fs.readFileSync('/home/node/.crewly/api-token','utf8').trim();
const base='http://127.0.0.1:8787/api/';
const wi={lead:'083ef786-18bf-40dc-a863-62b919064a86',designer:'03387d63-e12e-47a6-8356-6d427e787d72'};
const note='QA v4.2 trả hai lỗi nhìn thấy: mannequin lộ ở vai/nách side/oblique và khuy trước chưa đọc rõ. Chủ dự án yêu cầu xử lý nghẽn; hủy hold "chờ owner" do giới hạn một correction tự đặt. Lead mở đúng một lượt repair v4.3 trên WorkItem Designer hiện có, tối đa 15 phút và chỉ hai vùng lỗi; không dựng lại toàn bộ phom. Visual chạy stage repair và chụp bốn góc; QA kiểm đúng hai lỗi rồi Lead quyết định. Không publish nếu QA chưa đạt. Nếu sửa hẹp không giải quyết được, Lead chọn phom khác hoặc báo owner lý do cụ thể.';
async function api(route,body,method='POST'){const r=await fetch(base+route,{method,headers:{'content-type':'application/json','X-Crewly-Token':token},body:body&&JSON.stringify(body)});const d=await r.json();if(!r.ok||d.success===false)throw Error(`${route} ${r.status}: ${d.error||''}`);console.log(route,r.status);return d}
(async()=>{
  const skills=['atelierx-flow-v7','atelierx-lead-v7','atelierx-designer-v7','atelierx-visual-v7','atelierx-qa-v7'];
  for(const id of skills)fs.cpSync(path.join(__dirname,'seed-crewly/skills',id),path.join('/home/node/.crewly/skills',id),{recursive:true});
  const configFile='/home/node/.crewly/teams/af30c001-2789-4f20-b917-000000000010/config.json',config=JSON.parse(fs.readFileSync(configFile));
  require('./seed-crewly/upgrade-atelierx-v7.cjs')(config);fs.writeFileSync(configFile,JSON.stringify(config,null,2)+'\n');
  for(const id of ['ATEL-23','ATEL-34'])await api(`project-tickets/AtelierX/${id}/update`,{note});
  for(const [name,id]of Object.entries(wi)){const current=await api(`task-pool/items/${id}`,null,'GET');if(current.data.status==='blocked')await api(`task-pool/release/${id}`,{reason:'QA v4.2 targeted repair authorized by owner; clear stale wait-for-owner hold'});}
  for(const session of ['atelierx-team-leader-0001','atelierx-designer-0003','atelierx-frontend-developer-0006','atelierx-qa-0004'])await api(`terminal/${session}/deliver`,{message:note+' Đọc PLAN_SHOWCASE_BASIC.md và skill vai trò v7 mới. Giữ revision cũ nguyên trạng.',queueIfBusy:true});
  console.log('ATEL-23 targeted repair dispatched');
})().catch(e=>{console.error(e.message);process.exitCode=1});
