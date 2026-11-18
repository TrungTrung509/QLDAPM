const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const TEAM='af30c001-2789-4f20-b917-000000000010';
const TERMINAL=new Set(['verified','done','cancelled','rejected','done_by_worker']);
/** Pure decision: one existing WorkItem, never manufacture retry/review tasks. */
function decide(items,report,now=Date.now()){
  const open=items.filter(i=>!TERMINAL.has(i.status));
  if(!open.length)return null;
  if(open.some(i=>i.status==='running'))return null;
  const queued=open.filter(i=>i.status==='queued');
  if(queued.length){const stale=queued.find(i=>now-Date.parse(i.statusChangedAt||i.createdAt||new Date(now).toISOString())>10*60000);return stale?{kind:'redeliver',item:stale}:null}
  const parent=open.find(i=>i.target==='atelierx-team-leader-0001');
  if(!parent)return null;
  const reasons=open.map(i=>i.blockedReason||'').join(' ');
  if(/usage_limit|hết quota|sign.?in|unauthorized/i.test(reasons))return {kind:'runtime',item:parent};
  const worker=open.find(i=>i.target==='atelierx-designer-0003');
  const qa=open.find(i=>i.target==='atelierx-qa-0004');
  if(worker&&report?._fileMtime&&Date.parse(worker.statusChangedAt||'')>report._fileMtime&&/handoff|bàn giao/i.test(worker.blockedReason||''))return {kind:'plan',item:parent};
  if(report&&/^return|reject|fail/i.test(report.decision||''))return {kind:'alternate',item:worker||parent};
  if(report&&/^(approve|pass|accept)/i.test(report.decision||''))return {kind:'integrate',item:open.find(i=>i.target==='atelierx-frontend-developer-0006')||parent};
  if(qa&&worker&&/handoff|bàn giao/i.test(worker.blockedReason||''))return {kind:'qa',item:qa};
  if(now-Date.parse(parent.statusChangedAt||parent.createdAt||new Date(now).toISOString())<180000)return null;
  return {kind:'plan',item:parent};
}
function recoveryNote(order,action,report){return `TỰ PHỤC HỒI ${order}: tiếp tục bước ${action.kind} trên WorkItem ${action.item.id}. Đọc PLAN_STANDALONE.md và studio-control.json; không phục hồi đơn đã dừng. Mặc định áo độc lập, không mannequin. ${action.kind==='alternate'?'QA trả lại: không tiếp tục cùng cách dựng phom đã thất bại. Lead chọn phom/công cụ khác sau một sửa; chưa qua kiểm phom thì chưa trang trí.':''} Ghi checkpoint có file/ảnh trong 10 phút. Không tạo task retry/verify/self-ping, không tự publish. QA mới nhất: ${report?.revision||'chưa có'}.`;}
function accountRotationPlan(previousAccountId,currentAccountId,items,sessions){
  if(!currentAccountId||previousAccountId===currentAccountId)return null;
  return items.filter(i=>sessions.has(i.target)&&(i.status==='running'||(i.status==='blocked'&&/usage_limit|quota|sign.?in|unauthorized|token.*refresh/i.test(i.blockedReason||''))));
}
async function executeAccountRotation(api,config,inFlight){
  for(const member of config.members){
    if((await api(`terminal/${member.sessionName}/exists`))?.exists)await api(`teams/${TEAM}/members/${member.id}/stop`,{},60000);
  }
  for(const item of inFlight){
    const current=await api(`task-pool/items/${item.id}`);
    if(!['running','blocked'].includes(current?.status))continue;
    await api(`task-pool/items/${item.id}/notes`,{author:'system:account-rotation',note:'Owner changed Codex account. Old session stopped; resume the same WorkItem on the new account from saved artifacts and ticket context. Do not create a retry ticket.'});
    await api(`task-pool/release/${item.id}`,{reason:'Codex account changed; same WorkItem resumes on fresh session'});
  }
  await api(`teams/${TEAM}/start`,{projectId:'af30c001-2789-4f20-b917-000000000020'},180000);
}
module.exports={decide,recoveryNote,accountRotationPlan,executeAccountRotation};
async function main(){
  const home=process.env.CREWLY_HOME||'/home/node/.crewly',root=process.env.ATELIERX_ROOT||'/home/node/project/AtelierX';
  const stateFile=path.join(home,'atelierx-watchdog.json'),token=fs.readFileSync(path.join(home,'api-token'),'utf8').trim();
  const lock=stateFile+'.pid';
  if(fs.existsSync(lock)){const pid=Number(fs.readFileSync(lock));try{process.kill(pid,0);throw Error('Watchdog already running')}catch(e){if(e.code!=='ESRCH')throw e}}
  fs.writeFileSync(lock,String(process.pid));
  process.on('exit',()=>{try{if(Number(fs.readFileSync(lock))===process.pid)fs.unlinkSync(lock)}catch{}});
  const api=async(route,body,timeoutMs=20000)=>{const r=await fetch('http://127.0.0.1:8787/api/'+route,{method:body?'POST':'GET',headers:{'content-type':'application/json','X-Crewly-Token':token},body:body&&JSON.stringify(body),signal:AbortSignal.timeout(timeoutMs)});const d=await r.json();if(!r.ok||d.success===false)throw Error(`${route}: ${r.status} ${d.error||''}`);return d.data};
  let busy=false;
  let lastIdentityAt=0;
  async function publishCodexIdentity(){try{
    const poolDir=path.join(home,'codex-accounts');
    const poolEmails=[];
    try{for(const d of fs.readdirSync(poolDir,{withFileTypes:true})){if(!d.isDirectory())continue;const af=path.join(poolDir,d.name,'auth.json');if(!fs.existsSync(af))continue;try{const a=JSON.parse(fs.readFileSync(af,'utf8'));const c=a.tokens?.id_token?JSON.parse(Buffer.from(a.tokens.id_token.split('.')[1],'base64url')):null;poolEmails.push({name:d.name,email:c?.email||(a.OPENAI_API_KEY?'API key':'ChatGPT')});}catch{}}}catch{}
    const authFile='/home/node/.codex/auth.json';
    let email=null,authMode=null,sessionsFresh=false,quota=null,quotaError=null;
    if(fs.existsSync(authFile)){
      const auth=JSON.parse(fs.readFileSync(authFile,'utf8'));
      const claims=auth.tokens?.id_token?JSON.parse(Buffer.from(auth.tokens.id_token.split('.')[1],'base64url')):null;
      const rotationFile=path.join(home,'atelierx-codex-account-rotation.json');
      const rotation=fs.existsSync(rotationFile)?JSON.parse(fs.readFileSync(rotationFile,'utf8')):{};
      sessionsFresh=rotation.accountId===auth.tokens?.account_id;
      email=claims?.email||null;authMode=auth.auth_mode||null;
      try {
        const limits=await require('./codex-rate-limits.cjs').readCodexRateLimits();
        if(limits.accountId&&auth.tokens?.account_id&&limits.accountId!==auth.tokens.account_id)throw Error('Codex quota account does not match signed-in account');
        const rate=limits.rateLimitsByLimitId?.codex||limits.rateLimits;
        if(!rate?.primary||!Number.isFinite(rate.primary.usedPercent))throw Error('Codex quota response has no primary window');
        quota={fiveHourRemaining:Math.max(0,Math.round(100-rate.primary.usedPercent)),weeklyRemaining:Number.isFinite(rate.secondary?.usedPercent)?Math.max(0,Math.round(100-rate.secondary.usedPercent)):null,measuredAt:new Date().toISOString(),source:'codex-app-server',ordinaryUsageAllowed:limits.ordinaryUsageAllowed};
      } catch(e) {quotaError=e.message;}
    } else if (poolEmails.length > 0) {
      email=poolEmails.map(p=>`${p.name}: ${p.email}`).join(' · ');
      authMode='pool';sessionsFresh=true;
    } else { return; }
    const value={email,authMode,checkedAt:new Date().toISOString(),sessionsFresh,quota,quotaError,poolAccounts:poolEmails,poolCount:poolEmails.length+(fs.existsSync(authFile)?1:0)};
    const file=path.join(root,'showcase/codex-account.json');fs.writeFileSync(file+'.tmp',JSON.stringify(value));fs.renameSync(file+'.tmp',file);
  }catch(e){console.error('[AtelierX watchdog] Codex identity unavailable:',e.message)}}
  async function rotateCodexSessions(items){
    const auth=JSON.parse(fs.readFileSync('/home/node/.codex/auth.json','utf8'));
    const accountId=auth.tokens?.account_id;if(!accountId)return;
    const file=path.join(home,'atelierx-codex-account-rotation.json');
    const previous=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
    if(previous.pendingAccountId===accountId&&Date.now()-Date.parse(previous.lastAttemptAt||0)<30000)return;
    const config=JSON.parse(fs.readFileSync(path.join(home,'teams',TEAM,'config.json')));
    const sessions=new Set(config.members.map(m=>m.sessionName));
    const inFlight=accountRotationPlan(previous.accountId,accountId,items,sessions);
    if(!inFlight)return;
    fs.writeFileSync(file,JSON.stringify({...previous,pendingAccountId:accountId,lastAttemptAt:new Date().toISOString()}));
    const {execFileSync}=require('node:child_process');
    execFileSync('codex',['exec','--model','gpt-6-luna','--skip-git-repo-check','--sandbox','read-only','Reply with exactly OK'],{cwd:root,encoding:'utf8',timeout:60000,stdio:['ignore','pipe','pipe']});
    // Stop old interpreters before releasing work: no concurrent old/new owner.
    await executeAccountRotation(api,config,inFlight);
    fs.writeFileSync(file,JSON.stringify({accountId,rotatedAt:new Date().toISOString(),interruptedWorkItems:inFlight.map(i=>i.id)}));
    await publishCodexIdentity();lastIdentityAt=Date.now();
    console.log('[AtelierX watchdog] Codex sessions rotated for account change');
  }
  async function pruneIntermediateVerifies(items){
    const byId=new Map(items.map(i=>[i.id,i]));
    for(const item of items){
      if(item.status!=='queued'||!item.id.includes(':verify:'))continue;
      const source=byId.get(item.metadata?.verifyOf||item.id.split(':verify:')[0]);
      if(!source?.target?.startsWith('atelierx-')||source.status!=='done_by_worker')continue;
      await api(`task-pool/items/${item.id}/cancel`,{reason:'AtelierX uses product-level QA; intermediate handoff verification retired'});
      console.log('[AtelierX watchdog] retired intermediate verify',item.id);
    }
  }
  async function pruneStudioMaintenance(items){
    for(const item of items){
      if(item.target!=='atelierx-team-leader-0001'||item.status!=='queued'||item.metadata?.autoCreated!==true)continue;
      if(!['standing-refresh','wiki_quality_cleanup','wiki_legacy_migrate'].includes(item.metadata.kind))continue;
      await api(`task-pool/items/${item.id}/cancel`,{reason:'AtelierX Lead is reserved for product coordination; auto-created maintenance is excluded from studio workflow'});
      console.log('[AtelierX watchdog] retired studio maintenance',item.id);
    }
  }
  async function tick(){if(busy)return;busy=true;
    try{
      if(Date.now()-lastIdentityAt>60000){await publishCodexIdentity();lastIdentityAt=Date.now()}
      await require('./atelierx-delivery.cjs').reconcileDeliveries({home,root,api});
      await require('./atelierx-flow-dispatch.cjs').dispatchArtifacts({home,root,api});
      const state=fs.existsSync(stateFile)?JSON.parse(fs.readFileSync(stateFile)):{};
      const controlFile=path.join(root,'quality/studio-control.json');
      const control=fs.existsSync(controlFile)?JSON.parse(fs.readFileSync(controlFile)):{};
      const all=await api('task-pool/items');
      await rotateCodexSessions(all);
      await pruneIntermediateVerifies(all);
      await pruneStudioMaintenance(all);
      if(control.awaitingBrief===true){state.checkedAt=new Date().toISOString();state.status='awaiting-owner-brief';fs.writeFileSync(stateFile,JSON.stringify(state,null,2));return}
      state.checkedAt=new Date().toISOString();state.orders||={};
      const groups=new Map();
      for(const i of all){const id=i.projectTaskId||i.metadata?.projectTicket?.id;if(!/^ATEL-\d+$/.test(id||'')||i.type!=='project_task'||i.metadata?.teamId!==TEAM)continue;const parent=i.title?.match(/ATEL-\d+: (ATEL-\d+):/),order=parent?.[1]||id;if(!groups.has(order))groups.set(order,[]);groups.get(order).push(i)}
      for(const [order,items]of groups){
        if(control.stoppedOrders?.includes(order))continue;
        // Only recover an explicitly open parent, never resurrect old deliveries.
        if(!items.some(i=>i.projectTaskId===order&&i.target==='atelierx-team-leader-0001'&&!TERMINAL.has(i.status)))continue;
        const reportDir=path.join(root,'quality/reports',order);let report=null;
        if(fs.existsSync(reportDir)){const files=fs.readdirSync(reportDir).filter(f=>f.endsWith('.json')).map(f=>({f,t:fs.statSync(path.join(reportDir,f)).mtimeMs})).sort((a,b)=>b.t-a.t);if(files[0])report={...JSON.parse(fs.readFileSync(path.join(reportDir,files[0].f))),_fileMtime:files[0].t}}
        const action=decide(items,report),record=state.orders[order]||{};state.orders[order]=record;
        if(!action){record.status='working-or-no-action';continue}
        const signature=crypto.createHash('sha256').update(JSON.stringify([action.kind,report?.revision,report?.decision])).digest('hex');
        if(action.kind==='runtime'){record.status='runtime-needs-recheck';continue}
        if(record.signature===signature&&record.attempts>=2){record.status='stopped-no-progress';continue}
        if(record.day===new Date().toISOString().slice(0,10)&&record.dailyAttempts>=4){record.status='stopped-recovery-budget';continue}
        if(record.lastSentAt&&Date.now()-Date.parse(record.lastSentAt)<15*60000){record.status='cooldown';continue}
        const changed=signature!==record.signature;
        const note=recoveryNote(order,action,report);
        await api(`task-pool/items/${action.item.id}/notes`,{author:'system:atelierx-watchdog',note});
        const session=await api(`terminal/${action.item.target}/exists`);
        if(session?.exists===false){
          const config=JSON.parse(fs.readFileSync(path.join(home,'teams',TEAM,'config.json'))),member=config.members.find(m=>m.sessionName===action.item.target);
          if(!member)throw Error('Unknown recovery agent');
          await api(`teams/${TEAM}/members/${member.id}/start`,{projectId:'af30c001-2789-4f20-b917-000000000020'});
        }
        if(action.item.status==='blocked')await api(`task-pool/release/${action.item.id}`,{reason:`Autonomous recovery: ${action.kind}, QA ${report?.revision||'none'}`});
        // Persist before delivery: timeout must not flood duplicate instructions.
        const day=new Date().toISOString().slice(0,10);
        Object.assign(record,{signature,attempts:changed?1:(record.attempts||0)+1,day,dailyAttempts:record.day===day?(record.dailyAttempts||0)+1:1,lastSentAt:new Date().toISOString(),status:'released',itemId:action.item.id,kind:action.kind});
        fs.writeFileSync(stateFile,JSON.stringify(state,null,2));
        await api(`terminal/${action.item.target}/deliver`,{message:note,queueIfBusy:true});record.status='delivered';
        console.log('[AtelierX watchdog]',order,action.kind,action.item.id);
      }
      fs.writeFileSync(stateFile,JSON.stringify(state,null,2));
    }catch(e){console.error('[AtelierX watchdog]',e.message)}finally{busy=false}
  }
  await tick();if(!process.argv.includes('--once'))setInterval(tick,15000);
}
if(require.main===module)main().catch(e=>{console.error(e.message);process.exitCode=1});
