const fs=require('node:fs'),path=require('node:path');
const apply=require('./seed-crewly/upgrade-atelierx-v7.cjs');
const home='/home/node/.crewly',team='af30c001-2789-4f20-b917-000000000010',file=path.join(home,'teams',team,'config.json');
const token=fs.readFileSync(path.join(home,'api-token'),'utf8').trim();
const config=JSON.parse(fs.readFileSync(file));
if(config.members.length!==6)throw Error('Unexpected team');
const backup=path.join(home,'teams',team,'config.before-showcase-v7.json');
if(!fs.existsSync(backup))fs.copyFileSync(file,backup);
apply(config);
for(const id of new Set(config.members.flatMap(m=>m.skillOverrides).filter(id=>id.endsWith('-v7'))))fs.cpSync(path.join(__dirname,'seed-crewly/skills',id),path.join(home,'skills',id),{recursive:true});
const tmp=file+'.showcase.tmp';fs.writeFileSync(tmp,JSON.stringify(config,null,2)+'\n');fs.renameSync(tmp,file);
async function api(route,body){const r=await fetch('http://127.0.0.1:8787/api/'+route,{method:'POST',headers:{'content-type':'application/json','X-Crewly-Token':token},body:JSON.stringify(body)});const d=await r.json();if(!r.ok||d.success===false)throw Error(`${route}: ${r.status} ${d.error||''}`);console.log(route,r.status);return d}
const note='Chủ dự án đổi chuẩn sang showcase-basic-v1: áo phủ mannequin dễ nhìn, đúng brief, có nếp gấp và khuy phù hợp; content ngắn có chất liệu, kiểu dáng và số đo mẫu 3D có nguồn. PLAN_SHOWCASE_BASIC.md và skill v7 thay yêu cầu G1/approved-base/clearance-zero và bài dài. Không bỏ lỗi nhìn thấy. Dùng script ghép một draft và một final, QA 4 góc, một lượt sửa tập trung. Không tự đánh dấu hoàn tất khi chưa QA.';
const criteria={
  'ATEL-23':['Sơ mi sáng màu đúng brief trên mannequin, có nếp gấp và khuy, không hở/xuyên rõ','Viewer Crewly mở/xoay/zoom/mobile; mô tả ngắn, chất liệu/kiểu dáng và >=4 thông số có nguồn','QA showcase-basic-v1 đúng revision và gate đạt trước khi bàn giao'],
  'ATEL-25':['QA bốn góc bản chốt; kiểm brief, phủ mannequin, nếp gấp và khuy','Kiểm content và thông số đúng mẫu, thử viewer/mobile; tối đa ba lỗi lớn','Report showcase-basic-v1 cùng revision, kiểm lại đúng phần sửa'],
  'ATEL-26':['Script ghép một draft và một final, ngoại lệ mask đúng loại áo','Bốn góc render cố định và tương tác/mobile hoạt động','Viewer hiển thị mô tả ngắn, chất liệu/kiểu dáng và thông số, cùng revision'],
  'ATEL-34':['Phom sơ mi phủ mannequin hợp lý, khớp vai/nách/cổ, giữ nếp gấp và khuy','Bàn giao garment GLB và đường dẫn; script tạo số đo, không yêu cầu zero-intersection','Đánh dấu một draft và một final; sửa tập trung lỗi nhìn thấy để QA/Visual nhận ngay']
};
(async()=>{
  for(const [id,acceptance]of Object.entries(criteria)){
    const get=await fetch(`http://127.0.0.1:8787/api/project-tickets/AtelierX/${id}`),d=await get.json();if(!get.ok||!d.data)throw Error('Missing ticket '+id);
    const old=d.data.description||'';
    await api(`project-tickets/AtelierX/${id}/update`,{description:note+'\n\nYêu cầu sản phẩm gốc:\n'+old.replace(/^Chủ dự án đổi chuẩn sang showcase-basic-v1:[\s\S]*?Yêu cầu sản phẩm gốc:\n/,''),acceptance,note});
  }
  const sessions=['atelierx-team-leader-0001','atelierx-designer-0003','atelierx-frontend-developer-0006','atelierx-qa-0004'];
  for(const session of sessions)await api(`terminal/${session}/deliver`,{message:note+' Đọc skill vai trò v7 vừa cài. Tiếp tục đúng WorkItem hiện có; Lead giao cập nhật content ngắn và mở Visual cho bản nháp, QA nhận khi final có đủ bằng chứng. Không restart team hoặc tạo retry xác nhận.',queueIfBusy:true});
  console.log('Showcase v7 applied to 6 agents; current order scope updated.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
