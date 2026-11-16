const fs=require('node:fs');
const token=fs.readFileSync('/home/node/.crewly/api-token','utf8').trim();
const headers={'X-Crewly-Token':token};
async function get(route){const r=await fetch('http://127.0.0.1:8787/api/'+route,{headers});const d=await r.json();return d.data||d}
(async()=>{const items=await get('task-pool/items');console.log('ATEL35',JSON.stringify(items.filter(i=>i.projectTaskId==='ATEL-35'||/ATEL-35/.test(i.title||'')).map(i=>({id:i.id,status:i.status,target:i.target,title:i.title,changed:i.statusChangedAt,blockedReason:i.blockedReason})),null,2));for(const session of ['atelierx-team-leader-0001','atelierx-designer-0003','atelierx-qa-0004']){const e=await get('terminal/'+session+'/exists');const o=await get('terminal/'+session+'/output?lines=12');console.log(session,JSON.stringify({exists:e.exists,output:JSON.stringify(o).slice(-1600)}));}})().catch(e=>{console.error(e.message);process.exitCode=1});
