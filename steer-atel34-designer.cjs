const fs = require('fs');
const token = fs.readFileSync('/home/node/.crewly/api-token', 'utf8').trim();
const note = 'Cập nhật quy trình ATEL-34/v3.1: đọc skill atelierx-designer-v6 mới. Sửa theo vòng ngắn từng junction vai/nách; sau mỗi lượt đo giao cắt và lưu artifact/checkpoint. Trong 10 phút ghi revision, vùng sửa, số đo mới; nếu 15 phút không có artifact/số đo thì báo Lead nút kẹt. Tối đa hai lượt cùng topology; không giữ WorkItem running khi phiên idle. Bàn giao GLB + fit.json + clearance + SHA + ảnh browser cho QA ngay khi đủ, ghi rõ lỗi còn lại.';
(async()=>{
  const r=await fetch('http://127.0.0.1:8787/api/project-tickets/AtelierX/ATEL-34/log',{method:'POST',headers:{'content-type':'application/json','X-Crewly-Token':token},body:JSON.stringify({note})});
  const body=await r.json();
  console.log(r.status,body.success);
  if(!r.ok||!body.success)process.exitCode=1;
})().catch(e=>{console.error(e.message);process.exitCode=1});
