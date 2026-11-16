const fs=require('node:fs');
const token=fs.readFileSync('/home/node/.crewly/api-token','utf8').trim();
const team='af30c001-2789-4f20-b917-000000000010';
async function api(route,body){const r=await fetch('http://127.0.0.1:8787/api/'+route,{method:body?'POST':'GET',headers:{'content-type':'application/json','X-Crewly-Token':token},body:body&&JSON.stringify(body),signal:AbortSignal.timeout(20000)});const d=await r.json();if(!r.ok||d.success===false)throw Error(route+': '+JSON.stringify(d));return d.data}
(async()=>{
 const note='Chủ dự án đã DỪNG ATEL-23. Không tiếp tục, retry, tạo bản thay thế hoặc đánh dấu hoàn thành đơn này. Giữ mọi artifact để tham khảo. Chỉ bắt đầu khi chủ dự án gửi đề tài mới cho Lead, dùng ID mới. Quy trình mới: PLAN_STANDALONE.md và skill v8 vừa cài thay yêu cầu mannequin cũ. Áo độc lập; kiểm phom xám trước trang trí; một sửa rồi đổi hướng nếu vẫn sai; content ngắn có chất liệu/kiểu dáng/thông số. Chờ brief, không tự tạo task dọn dẹp hay báo cáo.';
 for(const id of ['ATEL-23','ATEL-34'])await api('project-tickets/AtelierX/'+id+'/update',{status:'cancelled',note});
 const config=JSON.parse(fs.readFileSync('/home/node/.crewly/teams/'+team+'/config.json'));
 for(const member of config.members){const session=member.sessionName;if((await api('terminal/'+session+'/exists'))?.exists)await api('terminal/'+session+'/deliver',{message:note,queueIfBusy:true});}
 const lock='/home/node/.crewly/atelierx-watchdog.json.pid';
 if(fs.existsSync(lock)){const pid=Number(fs.readFileSync(lock));try{const cmd=fs.readFileSync('/proc/'+pid+'/cmdline','utf8');if(cmd.includes('atelierx-watchdog.cjs'))process.kill(pid,'SIGTERM');}catch(e){if(e.code!=='ENOENT'&&e.code!=='ESRCH')throw e}}
 const open=(await api('task-pool/items')).filter(i=>i.metadata?.teamId===team&&!['done','verified','cancelled','rejected','done_by_worker'].includes(i.status));
 console.log('Open AtelierX WorkItems:',JSON.stringify(open.map(i=>({id:i.id,title:i.title,status:i.status}))));
})().catch(e=>{console.error(e.message);process.exitCode=1});
