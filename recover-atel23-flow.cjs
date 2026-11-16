const base = 'http://127.0.0.1:8787/api/project-tickets/AtelierX';
const fs = require('node:fs');
const token = fs.readFileSync('/home/node/.crewly/api-token','utf8').trim();
async function call(path, method='GET', payload) {
  const response = await fetch(base + path, {method, headers:{'content-type':'application/json','X-Crewly-Token':token},body:payload && JSON.stringify(payload)});
  const body = await response.json();
  if (!response.ok || !body.success) throw Error(`${method} ${path}: ${response.status} ${body.error}`);
  return body.data;
}
async function main() {
  const definitions = [
    {
      title:'ATEL-23: Rà hai nguồn phom sơ mi mới cho mannequin',
      assignee:'atelierx-tpm-0002',
      description:'Nhánh phục hồi sau ATEL-32: ứng viên outfit white shirt/skirt đã bị Lead loại vì 4.600 giao cắt, sâu 24,05 mm. Tìm tối đa hai phom sơ mi khác có nguồn và quyền dùng rõ, độc lập với Designer. Đối chiếu silhouette, UV, collar/shoulder/armhole và bounds với mannequin 1,80 m; nộp bảng so sánh, ảnh thực và SHA nếu có file. Không dùng lại candidate bị bác và không tự approved. Nếu không có ứng viên khả thi trong 20 phút, bàn giao kết luận có bằng chứng để Lead chọn hướng dựng mới.',
      acceptance:['Tối đa hai ứng viên có nguồn/quyền dùng, hình và đánh giá fit cụ thể hoặc kết luận không tìm được có bằng chứng','Mọi file ứng viên giữ candidate, có SHA/provenance; không thay registry approved','Bàn giao Lead trong thread ATEL-23 cùng đường dẫn artifact và khuyến nghị rõ'],
    },
    {
      title:'ATEL-23: Prototype phom sơ mi mới từ số đo mannequin',
      assignee:'atelierx-designer-0003',
      description:'Nhánh hình học mới sau khi v2.4 cổ răng cưa, v2.5 SDF/clip và ATEL-32 outfit source bị loại. Dựng prototype phom sơ mi riêng từ lát cắt/anchors trong quality/mannequin-fit.json; cổ/vai/nách/tay phải là bề mặt liên tục có clearance đo được, tránh SDF/clip và không biến đổi candidate cũ rồi đổi tên. Kiểm sớm silhouette và penetration bằng browser front/back/sides/cận cổ. Giữ nguyên bản v2.x, không áp artwork/material trước khi fit prototype. Giao QA prototype và bảng đo để quyết định tiếp.',
      acceptance:['Prototype GLB và fit.json có revision/SHA, topology/UV hoặc kế hoạch UV, nguồn phom rõ','Ảnh browser front/back/sides/cận cổ và số liệu penetration/clearance ở cổ/vai/nách/tay','QA nhận bằng chứng fit sớm; Lead chỉ duyệt hướng sau verdict QA, không tự publish'],
    }
  ];
  const listed = await call('');
  const tickets = listed.tickets ?? listed;
  for (const definition of definitions) {
    let ticket = tickets.find(t=>t.title===definition.title && t.status!=='cancelled');
    if (!ticket) ticket = await call('', 'POST', {title:definition.title,description:definition.description,acceptance:definition.acceptance,priority:'P1',labels:['ATEL-23','recovery','mannequin-v1'],status:'ready',source:'owner-recovery'});
    console.log('ticket',ticket.id,ticket.status);
    if (!ticket.assignee && ticket.status==='ready') {
      const assigned=await call('/'+ticket.id+'/assign','POST',{assignee:definition.assignee,start:true});
      console.log('assigned',ticket.id,definition.assignee,assigned?.workItemId ?? '');
    }
  }
  await call('/ATEL-23/log','POST',{note:'Owner-authorized recovery: ATEL-32 source candidate rejected; opened parallel Researcher source audit and Designer new measured-mannequin shirt prototype. Lead must choose only after early QA evidence, keep QA/Visual blocked on G1 and update parent status/ETA. No retry of rejected SDF/clip or outfit source.'});
  console.log('parent ATEL-23 recovery logged');
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
