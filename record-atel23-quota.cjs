const fs=require('node:fs');
const token=fs.readFileSync('/home/node/.crewly/api-token','utf8').trim();
const base='http://127.0.0.1:8787/api/project-tickets/AtelierX/';
const note='2026-11-15: Codex CLI probe gpt-6-luna trả usage_limit, báo thử lại lúc 05:12. Researcher ATEL-33 và Designer ATEL-34 đã claim WorkItem nhưng runtime không thể tiếp tục. Giữ nguyên artifact/claim; không retry hoặc restart team. Sau mốc reset, probe lại trước khi tiếp tục. ATEL-23 chưa qua G1/QA, không publish.';
(async()=>{for(const id of ['ATEL-23','ATEL-33','ATEL-34']){const r=await fetch(base+id+'/log',{method:'POST',headers:{'content-type':'application/json','X-Crewly-Token':token},body:JSON.stringify({note})});const b=await r.json();console.log(id,r.status,b.success);if(!r.ok||!b.success)process.exitCode=1}})().catch(e=>{console.error(e.message);process.exitCode=1});
