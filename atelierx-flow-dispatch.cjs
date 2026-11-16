const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
/** Consume artifact events, wake only the next existing WorkItem, no retry tasks. */
async function dispatchArtifacts({home,root,api,now=Date.now(),routing}){
  const control=JSON.parse(fs.readFileSync(path.join(root,'quality/studio-control.json'),'utf8'));
  if(control.awaitingBrief)return;
  const stateFile=path.join(home,'atelierx-artifact-dispatch.json');
  const state=fs.existsSync(stateFile)?JSON.parse(fs.readFileSync(stateFile,'utf8')):{};
  const {destinations}=routing||await import(pathToFileURL(path.join(root,'tools/studio-flow.mjs')).href);
  const {inside,sha}=routing||await import(pathToFileURL(path.join(root,'tools/studio-base.mjs')).href);
  const orders=path.join(root,'orders');
  for(const order of fs.readdirSync(orders).filter(x=>/^ATEL-\d+$/.test(x))){
    if(control.stoppedOrders?.includes(order))continue;
    const file=path.join(orders,order,'studio-flow.json');if(!fs.existsSync(file))continue;
    const flow=JSON.parse(fs.readFileSync(file,'utf8'));
    for(const event of flow.events||[]){
      const manifestFile=inside(event.file,root);if(!event.id.endsWith(':'+sha(manifestFile))){
        const key=order+':'+event.id+':invalid';
        if(!state[key]){state[key]={invalidAt:new Date(now).toISOString(),reason:'manifest changed after handoff'};save();console.error('[AtelierX dispatch] stale handoff ignored:',event.file)}
        continue;
      }
      const manifest=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
      if(manifest.orderId!==order||manifest.revision!==event.revision)throw Error('Artifact order/revision mismatch');
      for(const role of destinations(event,manifest)){
        const key=order+':'+event.id+':'+role;
        if(state[key]?.sentAt||state[key]?.attemptAt&&now-state[key].attemptAt<60000)continue;
        const task=flow.tasks[role];if(!task?.workItemId)continue;
        const item=await api('task-pool/items/'+encodeURIComponent(task.workItemId));
        if(!item||['done','verified','done_by_worker','cancelled','rejected'].includes(item.status))continue;
        // Do not clear quota/auth blocks just because a file arrived.
        if(item.status==='blocked'&&!/studio-wait:/i.test(item.blockedReason||''))continue;
        state[key]={attemptAt:now};save();
        if(item.status==='blocked')await api('task-pool/release/'+encodeURIComponent(item.id),{reason:`Artifact ready: ${order}/${event.revision} ${event.stage}`});
        const action=event.stage==='qa-final'&&manifest.decision==='pass'&&role!=='lead'?
          'QA cuối đã đạt. Đối chiếu artifact của bạn đã được tích hợp, rồi hoàn tất chính WorkItem này bằng session của bạn; không tạo việc mới.':
          'Tiếp tục công đoạn của bạn trên artifact mới.';
        await api('terminal/'+task.target+'/deliver',{message:`${task.title}\nĐầu vào mới: ${event.stage}, revision ${event.revision}, manifest ${event.file}. ${action} WorkItem ${item.id}; không chờ Lead chuyển lời, không tạo task Verify/Retry mới. Đọc manifest và artifact được trỏ tới.`,queueIfBusy:true});
        state[key]={sentAt:new Date(now).toISOString()};save();
      }
    }
  }
  function save(){fs.writeFileSync(stateFile+'.tmp',JSON.stringify(state,null,2));fs.renameSync(stateFile+'.tmp',stateFile)}
}
module.exports={dispatchArtifacts};
