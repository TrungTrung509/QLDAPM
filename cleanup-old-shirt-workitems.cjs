const fs=require('node:fs');
const token=fs.readFileSync('/home/node/.crewly/api-token','utf8').trim();
const headers={'content-type':'application/json','X-Crewly-Token':token};
async function api(route,method='GET'){const r=await fetch('http://127.0.0.1:8787/api/'+route,{method,headers});const d=await r.json();if(!r.ok||d.success===false)throw Error(route+': '+JSON.stringify(d));return d.data}
(async()=>{const ids=new Set(Array.from({length:12},(_,k)=>'ATEL-'+(k+23)));const items=await api('task-pool/items');const old=items.filter(i=>ids.has(i.projectTaskId)||/ATEL-23/.test(i.title||''));if(old.some(i=>!['done','verified','cancelled','rejected','done_by_worker'].includes(i.status)))throw Error('Old order still active');for(const i of old)await api('task-pool/'+i.id,'DELETE');console.log('Deleted old terminal WorkItems:',old.length);})().catch(e=>{console.error(e.message);process.exitCode=1});
