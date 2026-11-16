const fs=require('node:fs'),path=require('node:path');
const token=fs.readFileSync('/home/node/.crewly/api-token','utf8').trim();
const headers={'content-type':'application/json','X-Crewly-Token':token};
async function call(route,method='GET',body){const r=await fetch('http://127.0.0.1:8787/api/'+route,{method,headers,body:body&&JSON.stringify(body)});const d=await r.json();if(!r.ok||d.success===false)throw Error(route+': '+JSON.stringify(d));return d.data}
(async()=>{
 const ids=new Set(Array.from({length:12},(_,k)=>'ATEL-'+(k+23)));
 const dir='/home/node/project/AtelierX/.crewly/tickets';
 const files=fs.readdirSync(dir).filter(f=>/^(ATEL-\d+)-/.test(f)&&ids.has(f.match(/^(ATEL-\d+)-/)[1]));
 if(files.length!==12)throw Error('Expected exactly 12 old shirt ticket files, found '+files.length);
 const items=await call('task-pool/items');
 const old=items.filter(i=>ids.has(i.projectTaskId)||/ATEL-23/.test(i.title||''));
 const active=old.filter(i=>!['done','verified','cancelled','rejected','done_by_worker'].includes(i.status));
 if(active.length)throw Error('Old order has active WorkItems: '+active.map(i=>i.id));
 const request=await call('tickets/TKT-006');
 if(!/mannequin-v1/.test(JSON.stringify(request)))throw Error('TKT-006 no longer matches old mannequin request');
 await call('tickets/TKT-006/dismiss','POST',{});
 for(const f of files)fs.unlinkSync(path.join(dir,f));
 console.log(JSON.stringify({dismissed:'TKT-006',deletedProjectTickets:files.length,oldWorkItems:old.length,activeWorkItems:0}));
})().catch(e=>{console.error(e.message);process.exitCode=1});
