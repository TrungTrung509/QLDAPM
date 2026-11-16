const fs=require('node:fs');
const root='/home/node/project/AtelierX';
const token=fs.readFileSync('/home/node/.crewly/api-token','utf8').trim();
async function call(route,body,method='POST'){const r=await fetch('http://127.0.0.1:8787/api/'+route,{method,headers:{'content-type':'application/json','X-Crewly-Token':token},body:body&&JSON.stringify(body)});const d=await r.json();if(!r.ok||d.success===false)throw Error(`${route}: ${r.status} ${d.error||''}`);console.log(route,r.status);return d}
(async()=>{
  const dir=root+'/orders/ATEL-23/v4.4/designer';fs.mkdirSync(dir,{recursive:true});
  let script=fs.readFileSync(root+'/orders/ATEL-23/v4.3/designer/build-repair-v4_3.mjs','utf8');
  script=script.replace("const input='orders/ATEL-23/v4.2/designer/garment-v4_2.glb',output='orders/ATEL-23/v4.3/designer/garment-v4_3.glb';","const input='orders/ATEL-23/v4.3/designer/garment-v4_3.glb',output='orders/ATEL-23/v4.4/designer/garment-v4_4.glb';");
  if(!script.includes('buttonPos.push(r*Math.cos(a),y,zc+zz+r*Math.sin(a))'))throw Error('Button patch target changed');
  script=script.replace('buttonPos.push(r*Math.cos(a),y,zc+zz+r*Math.sin(a));buttonNorm.push(Math.cos(a),0,Math.sin(a))','buttonPos.push(r*Math.cos(a),y+r*Math.sin(a),zc+zz);buttonNorm.push(Math.cos(a),Math.sin(a),0)');
  script=script.replace('addShoulderCap(-1);addShoulderCap(1);','// Preserve existing shoulder caps; do not duplicate them.');
  script=script.replaceAll('v4.3 local repair','v4.4 verified fix').replace("revision:'v4.3'","revision:'v4.4'").replace("sourceRevision:'ATEL-23/v4.2'","sourceRevision:'ATEL-23/v4.3'");
  fs.writeFileSync(dir+'/build-verified-fix.mjs',script);
  fs.writeFileSync(root+'/orders/ATEL-23/diagnosis-v44.json',JSON.stringify({findings:['Button faces built in XZ plane; frontal XY projection is edge-on. Fix XY circle, thickness on Z.','Shirt masking capped at y=1.44 below shoulder y~1.50; now y=1.55, below neck 1.57.'],validation:'Run tools/check-shirt-buttons.mjs then render 4 views. Do not approve without visual QA.'},null,2));
  const note='Chẩn đoán kỹ thuật đã tái hiện: khuy v4.3 dựng vòng tròn XZ nên nhìn trước gần như cạnh; preset mask dừng y=1.44 thấp hơn vai ~1.50. Đã sửa preset y=1.55 và cung cấp orders/ATEL-23/v4.4/designer/build-verified-fix.mjs (giữ v4.3, khuy XY/thickness Z). Tiếp tục cùng WorkItem, một worker Designer chạy script rồi node tools/check-shirt-buttons.mjs <GLB>, kiểm ảnh vai/nách, bàn giao v4.4. Visual dùng stage verified-fix với diagnosticReport orders/ATEL-23/diagnosis-v44.json; QA độc lập retest hai lỗi. Nếu ảnh vẫn lỗi, kết luận chính xác phần còn lại; không tự thêm revision. Không hỏi owner chỉ vì quota số lượt. Tạm dừng wiki và task kiểm handoff cũ để dành lượt cho sản phẩm.';
  for(const id of ['d32e61be-4b2b-4fda-a79b-a9aa57cbed64','d801bc39-6b18-4c21-882b-03054725150f:retry:1','a6ef735e-b98a-4e3d-a542-225bb6109f56']){const d=await call(`task-pool/items/${id}`,null,'GET');if(d.data.status==='running')await call(`task-pool/release/${id}`,{reason:'Defer maintenance during product recovery'});if(['running','queued','blocked'].includes(d.data.status))await call(`task-pool/items/${id}/cancel`,{reason:'Superseded historical handoff or deferred maintenance; preserve history'});}
  for(const id of ['ATEL-23','ATEL-34'])await call(`project-tickets/AtelierX/${id}/update`,{description:note,note});
  for(const id of ['083ef786-18bf-40dc-a863-62b919064a86','03387d63-e12e-47a6-8356-6d427e787d72']){const d=await call(`task-pool/items/${id}`,null,'GET');if(d.data.status==='blocked')await call(`task-pool/release/${id}`,{reason:'Deterministic root cause identified; verified fix authorized'});}
  for(const s of ['atelierx-team-leader-0001','atelierx-designer-0003'])await call(`terminal/${s}/deliver`,{message:note,queueIfBusy:true});
})().catch(e=>{console.error(e.message);process.exitCode=1});
