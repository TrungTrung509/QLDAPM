const fs=require('node:fs');
const TEAM='af30c001-2789-4f20-b917-000000000010';
const token=fs.readFileSync('/home/node/.crewly/api-token','utf8').trim();
async function api(route,body){const r=await fetch('http://127.0.0.1:8787/api/'+route,{method:body?'POST':'GET',headers:{'content-type':'application/json','X-Crewly-Token':token},body:body&&JSON.stringify(body),signal:AbortSignal.timeout(20000)});const d=await r.json();if(!r.ok||d.success===false)throw Error(route+': '+JSON.stringify(d));return d.data}
(async()=>{
  const before=await api('task-pool/items');
  const belongs=i=>i.metadata?.teamId===TEAM&&(i.projectTaskId==='ATEL-23'||/\bATEL-23\b/.test(i.title||''));
  const active=before.filter(i=>belongs(i)&&!['done','verified','cancelled','rejected','done_by_worker'].includes(i.status));
  console.log('Active before stop',active.map(i=>({id:i.id,status:i.status,title:i.title})));
  if(process.argv.includes('--inspect'))return;
  const config=JSON.parse(fs.readFileSync('/home/node/.crewly/teams/'+TEAM+'/config.json'));
  for(const target of new Set(active.filter(i=>i.status==='running').map(i=>i.target))){
    if(before.some(i=>i.target===target&&i.status==='running'&&!belongs(i)))throw Error('Agent has unrelated running work: '+target);
    const member=config.members.find(m=>m.sessionName===target);
    if(member)await api('teams/'+TEAM+'/members/'+member.id+'/stop',{});
  }
  for(const i of await api('task-pool/items')){
    if(!belongs(i)||['done','verified','cancelled','rejected','done_by_worker'].includes(i.status))continue;
    if(i.status==='running')await api('task-pool/release/'+i.id,{reason:'Owner stopped current order; do not retry'});
    await api('task-pool/items/'+i.id+'/cancel',{reason:'Chủ dự án dừng đơn hiện tại và chuẩn bị brief mới. Giữ artifact, không retry hay tạo task thay thế.'});
    console.log('Cancelled',i.id);
  }
  console.log('Remaining active for ATEL-23', (await api('task-pool/items')).filter(i=>belongs(i)&&!['done','verified','cancelled','rejected','done_by_worker'].includes(i.status)).length);
})().catch(e=>{console.error(e.message);process.exitCode=1});
