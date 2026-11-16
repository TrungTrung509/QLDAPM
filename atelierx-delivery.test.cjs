const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {reconcileDeliveries,ticketSource}=require('./atelierx-delivery.cjs');
function setup(t){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'atel-delivery-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const root=path.join(dir,'project'),home=path.join(dir,'home');
  function write(p,v){fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'?v:JSON.stringify(v))}
  const requestFile=path.join(home,'requests/r.json'),receiptFile=path.join(home,'atelierx-deliveries/r.json');
  write(requestFile,{id:'r',ticketNumber:7,status:'running',updatedAt:'old',description:'PLAN_STANDALONE.md',workItemIds:['worker','verify']});
  write(path.join(root,'showcase/catalog.json'),{products:[{id:'ATEL-35',revision:'v1',status:'complete',requestId:'r',viewer:'products/ATEL-35/v1/index.html'}]});
  write(path.join(root,'orders/ATEL-35/studio-flow.json'),{requestId:'r',tasks:{lead:{ticketId:'ATEL-35'}}});
  write(path.join(root,'quality/reports/ATEL-35/v1.json'),{orderId:'ATEL-35',revision:'v1',decision:'pass',leadApproved:true});
  write(path.join(root,'.crewly/tickets/ATEL-35-parent.md'),'id: ATEL-35\nsource: request:TKT-007\nstatus: in_progress\nupdatedAt: old\n');
  write(path.join(root,'.crewly/tickets/ATEL-36-child.md'),'id: ATEL-36\nworkItemId: worker\nstatus: in_progress\nupdatedAt: old\n');
  write(path.join(root,'.crewly/tickets/ATEL-99-other.md'),'id: ATEL-99\nstatus: in_progress\n## Description\nReference ATEL-35 only\n');
  const items={worker:{id:'worker',status:'done_by_worker'},verify:{id:'verify',status:'queued',metadata:{verifyOf:'worker'}}},calls=[];
  const api=async(route,body)=>{calls.push({route,body});if(route.endsWith('/cancel')){items[decodeURIComponent(route.slice('task-pool/items/'.length,-'/cancel'.length))].status='cancelled';return {}}if(route.startsWith('terminal/'))return {};return items[decodeURIComponent(route.slice('task-pool/items/'.length))]};
  return {root,home,write,requestFile,receiptFile,items,calls,options:{root,home,api,gate:()=>[],now:()=> '2026-11-15T12:00:00Z'}};
}
test('padded TKT link, terminal worker, retired Verify -> To review; unrelated ticket untouched; idempotent',async t=>{
  const f=setup(t);assert.equal(ticketSource('source: request:TKT-007\n'),'7');
  await reconcileDeliveries(f.options);
  const request=JSON.parse(fs.readFileSync(f.requestFile));assert.equal(request.status,'waiting_confirmation');assert.deepEqual(request.workItemIds,[]);
  assert.equal(JSON.parse(fs.readFileSync(f.receiptFile)).workItemIds.length,2);
  assert.match(fs.readFileSync(path.join(f.root,'.crewly/tickets/ATEL-36-child.md'),'utf8'),/status: done/);
  assert.match(fs.readFileSync(path.join(f.root,'.crewly/tickets/ATEL-99-other.md'),'utf8'),/status: in_progress/);
  await reconcileDeliveries(f.options);assert.equal(JSON.parse(fs.readFileSync(f.requestFile)).submittedAt,request.submittedAt);
  assert.equal(f.calls.filter(c=>c.route.endsWith('/cancel')).length,1);
});
test('running actual work blocks delivery and is never cancelled or labelled done',async t=>{
  const f=setup(t);f.items.worker.status='running';await reconcileDeliveries(f.options);
  assert.equal(JSON.parse(fs.readFileSync(f.requestFile)).status,'running');
  assert(!f.calls.some(c=>c.route==='task-pool/items/worker/cancel'));
  await reconcileDeliveries(f.options);assert.equal(f.calls.filter(c=>c.route.startsWith('terminal/')).length,1);
});
test('failed gate and owner send-back cannot silently resubmit',async t=>{
  const f=setup(t);await reconcileDeliveries({...f.options,gate:()=>['hash mismatch']});assert.equal(JSON.parse(fs.readFileSync(f.requestFile)).status,'running');
  await reconcileDeliveries(f.options);const request=JSON.parse(fs.readFileSync(f.requestFile));f.write(f.requestFile,{...request,status:'running',rejectCount:1});
  await reconcileDeliveries(f.options);assert.equal(JSON.parse(fs.readFileSync(f.requestFile)).status,'running');
});
test('terminal source retires generated nested review and structured prior reply',async t=>{
 const f=setup(t),nested='worker:review:blocked:review:blocked';
 f.write(f.requestFile,{...JSON.parse(fs.readFileSync(f.requestFile)),reply:{text:'old'},workItemIds:['worker',nested]});
 f.items[nested]={id:nested,status:'queued',target:'atelierx-team-leader-0001'};
 await reconcileDeliveries(f.options);
 assert.equal(f.items[nested].status,'cancelled');
 assert.equal(JSON.parse(fs.readFileSync(f.requestFile)).status,'waiting_confirmation');
});
test('agent-created parent review is reverted while production request is running',async t=>{
 const f=setup(t);
 f.write(path.join(f.root,'showcase/catalog.json'),{products:[]});
 f.write(path.join(f.root,'.crewly/tickets/ATEL-35-parent.md'),'id: ATEL-35\nsource: agent:atelierx-team-leader-0001\nstatus: review\nupdatedAt: old\n');
 await reconcileDeliveries(f.options);
 assert.match(fs.readFileSync(path.join(f.root,'.crewly/tickets/ATEL-35-parent.md'),'utf8'),/status: in_progress/);
 assert.equal(JSON.parse(fs.readFileSync(f.requestFile)).status,'running');
});
