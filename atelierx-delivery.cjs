const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const SUCCESS=new Set(['done','verified','done_by_worker']);
const TERMINAL=new Set([...SUCCESS,'cancelled','rejected']);
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
function atomic(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(value,null,2)+'\n');fs.renameSync(file+'.tmp',file)}
function ticketSource(text){return text.match(/^source:\s*request:TKT-0*(\d+)\s*$/m)?.[1]}
function deliveryTasks(request,flow,receipt){return [...new Set([...(request.workItemIds||[]),...(receipt?.workItemIds||[]),...Object.values(flow?.tasks||{}).map(t=>t.workItemId).filter(Boolean)])]}
/** Reconcile only exact registered links; never infer membership from title text. */
async function reconcileDeliveries({home,root,api,gate,now=()=>new Date().toISOString()}){
  const dir=path.join(home,'requests'),ticketDir=path.join(root,'.crewly/tickets');
  if(!fs.existsSync(dir)||!fs.existsSync(ticketDir))return;
  const products=read(path.join(root,'showcase/catalog.json')).products||[];
  const tickets=fs.readdirSync(ticketDir).filter(f=>/^ATEL-\d+-.*\.md$/.test(f)).map(name=>({name,text:fs.readFileSync(path.join(ticketDir,name),'utf8')}));
  if(!gate){const {assessProduct}=await import(pathToFileURL(path.join(root,'tools/quality-gate.mjs')).href);const library=read(path.join(root,'quality/base-meshes.json'));gate=(p,q)=>assessProduct(p,q,library)}
  for(const name of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){
    const file=path.join(dir,name);let request;try{request=read(file)}catch{continue}
    if(!['running','waiting_confirmation'].includes(request.status))continue;
    const matches=tickets.filter(t=>{
      const linkedNumber=Number(ticketSource(t.text));
      if(Number.isFinite(linkedNumber)&&linkedNumber!==request.ticketNumber)return false;
      const order=t.name.match(/^(ATEL-\d+)-/)?.[1];
      const flowFile=path.join(root,'orders',order||'_','studio-flow.json');
      if(!fs.existsSync(flowFile))return false;
      const flow=read(flowFile);
      return flow.requestId===request.id&&flow.tasks?.lead?.ticketId===order;
    });
    if(matches.length!==1)continue;
    const parent=matches[0];
    if(!parent)continue;
    const id=parent.name.match(/^(ATEL-\d+)-/)[1],product=products.find(p=>p.id===id&&p.status==='complete');
    if(request.status==='running'&&/^status: review$/m.test(parent.text)&&(!product||product.requestId!==request.id)){
      const ticketFile=path.join(ticketDir,parent.name);
      const currentTicket=fs.readFileSync(ticketFile,'utf8');
      if(/^status: review$/m.test(currentTicket)){
        const flow=read(path.join(root,'orders',id,'studio-flow.json'));
        const leadWorkId=flow.tasks?.lead?.workItemId;
        const leadWork=leadWorkId?await api('task-pool/items/'+encodeURIComponent(leadWorkId)):null;
        let next=currentTicket.replace(/^status: review$/m,'status: in_progress').replace(/^updatedAt: .*$/m,'updatedAt: '+now());
        if(leadWorkId&&TERMINAL.has(leadWork?.status)&&next.match(/^workItemId: (.*)$/m)?.[1]===leadWorkId)
          next=next.replace(/^workItemId: .*$/m,'workItemId: null');
        fs.writeFileSync(ticketFile+'.tmp',next);
        fs.renameSync(ticketFile+'.tmp',ticketFile);
        console.log('[AtelierX delivery] premature parent ticket review reverted',id);
      }
    }
    if(!product||product.requestId!==request.id){
      // Crewly may submit a new owner request as soon as Lead accepts it.
      // There is no reviewable deliverable until catalog and QA are complete.
      if(request.status==='waiting_confirmation'){
        const current=read(file);
        if(current.status===request.status&&current.updatedAt===request.updatedAt){
          current.status='running';delete current.submittedAt;current.updatedAt=now();
          atomic(file,current);console.log('[AtelierX delivery] premature review reverted',id);
        }
      }
      continue;
    }
    const receiptFile=path.join(home,'atelierx-deliveries',request.id+'.json');
    const receipt=fs.existsSync(receiptFile)?read(receiptFile):{};
    // Sending back requires a new product revision; never resubmit the rejected one.
    if(receipt.revision===product.revision&&(request.rejectCount||0)>(receipt.rejectCount||0))continue;
    const reportFile=path.join(root,'quality/reports',id,product.revision+'.json');
    if(!fs.existsSync(reportFile))continue;
    const report=read(reportFile);
    if(report.orderId!==id||report.revision!==product.revision||report.decision!=='pass'||report.leadApproved!==true)continue;
    const errors=await gate(product,report);if(errors.length){console.error('[AtelierX delivery] gate failed',id,errors);continue}
    const flowFile=path.join(root,'orders',id,'studio-flow.json');
    const flow=fs.existsSync(flowFile)?read(flowFile):null;
    if(!flow||flow.requestId!==request.id)throw Error('Flow/request mismatch: '+id);
    const workItemIds=deliveryTasks(request,flow,receipt),items=[];
    for(const workItemId of workItemIds){const item=await api('task-pool/items/'+encodeURIComponent(workItemId));if(!item)throw Error('Missing delivery WorkItem '+workItemId);items.push(item)}
    const itemById=new Map(items.map(item=>[item.id,item]));
    for(const item of items){
      const sourceId=item.id.split(':review:')[0];
      const source=itemById.get(sourceId);
      const obsoleteReview=item.id!==sourceId&&/^(:review:(blocked|idle_holder))+$/i.test(item.id.slice(sourceId.length))&&
        source&&TERMINAL.has(source.status)&&['atelierx-team-leader-0001','crewly-orc'].includes(item.target);
      // Only explicit superseded work and auto-generated Verify may be cancelled.
      if(['queued','blocked','scheduled'].includes(item.status)&&
        (item.metadata?.verifyOf||item.metadata?.studioSuperseded===true||obsoleteReview)){
        await api('task-pool/items/'+encodeURIComponent(item.id)+'/cancel',{reason:`${id}/${product.revision}: bước phụ đã được QA sản phẩm cuối thay thế`});item.status='cancelled';
      }
    }
    const pending=items.filter(i=>!TERMINAL.has(i.status));
    if(pending.length){
      const signature=pending.map(i=>i.id+':'+i.status).join('|');
      if(receipt.pending!==signature){
        await api('terminal/atelierx-team-leader-0001/deliver',{message:`${id}: sản phẩm đã QA đạt nhưng chưa thể bàn giao vì WorkItem còn mở: ${pending.map(i=>i.id+' ('+i.status+')').join(', ')}. Hoàn tất bằng chứng hoặc đánh dấu công việc thay thế; không tự ghi done cho việc chưa làm.`,queueIfBusy:true});
        atomic(receiptFile,{...receipt,workItemIds,pending:signature,revision:product.revision,rejectCount:request.rejectCount||0});
      }
      continue;
    }
    const current=read(file);
    if(current.status!==request.status||current.updatedAt!==request.updatedAt)continue;
    const byId=new Map(items.map(i=>[i.id,i]));
    const linkedTickets=new Set([parent.name,...Object.values(flow?.tasks||{}).map(t=>tickets.find(x=>x.text.match(/^id:\s*(ATEL-\d+)$/m)?.[1]===t.ticketId)?.name).filter(Boolean)]);
    for(const t of tickets){const wi=t.text.match(/^workItemId:\s*(.+)$/m)?.[1];if(wi&&byId.has(wi))linkedTickets.add(t.name)}
    for(const ticketName of linkedTickets){
      const ticketFile=path.join(ticketDir,ticketName),text=fs.readFileSync(ticketFile,'utf8');
      if(!/^status: (backlog|ready|in_progress|blocked|review)$/m.test(text))continue;
      const wi=text.match(/^workItemId:\s*(.+)$/m)?.[1],item=byId.get(wi);
      const status=ticketName===parent.name||SUCCESS.has(item?.status)?'done':'cancelled';
      if(ticketName!==parent.name&&!item)continue;
      const next=text.replace(/^status: \w+$/m,'status: '+status).replace(/^updatedAt: .*$/m,'updatedAt: '+now())+
        `\n- ${now()} · system:atelierx-delivery · ${id}/${product.revision}: ${status}; owner review is separate.\n`;
      fs.writeFileSync(ticketFile+'.tmp',next);fs.renameSync(ticketFile+'.tmp',ticketFile);
    }
    // Preserve the complete linkage in a receipt; terminal children must not
    // override Crewly's owner-review column (done_by_worker is not counted there).
    atomic(receiptFile,{orderId:id,revision:product.revision,requestId:request.id,workItemIds,rejectCount:request.rejectCount||0,completedAt:receipt.completedAt||now()});
    const viewer='/atelierx-products/'+product.viewer.replace(/^\/atelierx-products\//,'').replace(/^\//,'');
    const prior=typeof request.reply==='string'?request.reply:typeof request.result==='string'?request.result:'';
    const result=prior.includes('ATELIERX_DELIVERY_VERIFIED')&&prior.includes(`${id}/${product.revision}`)?prior:
      `ATELIERX_DELIVERY_VERIFIED — ${id}/${product.revision}. ${product.name}. ${product.description||''} Xem sản phẩm: ${viewer}. QA đạt, chờ bạn nghiệm thu.`;
    if(request.status==='waiting_confirmation'&&!request.workItemIds?.length&&request.result===result)continue;
    Object.assign(current,{status:'waiting_confirmation',requiresConfirmation:true,result,reply:result,workItemIds:[],submittedAt:now(),updatedAt:now(),submitCount:request.submitCount||1});
    atomic(file,current);
    console.log('[AtelierX delivery] To review',id,product.revision,'TKT-'+String(request.ticketNumber).padStart(3,'0'));
  }
}
module.exports={reconcileDeliveries,ticketSource,deliveryTasks};
