const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),apply=require('./apply-atelierx-runtime.cjs');
test('runtime policies patch only expected entry points and can be reapplied',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'atel-policy-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const files={
 'services/task-pool/task-pool.service.js':'requiresVerification(wi) {\nconst flag=true;}',
 'controllers/task-pool/task-pool.controller.js':'const body = req.body;\nexport async function addItem(req,res){\nconst body = req.body;\n}',
 'services/v3/ticket-review.service.js':"if (t.status !== 'waiting_confirmation' || !ticketNeedsReview(t) || !t.submittedAt) continue;",
 'services/v3/request.service.js':'const previousStatus = request.status;',
 };
 for(const [p,s]of Object.entries(files)){fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),s)}
 apply(root);apply(root);
 const controller=fs.readFileSync(path.join(root,'controllers/task-pool/task-pool.controller.js'),'utf8');
 assert.equal(controller.split('atelierx-task-title.cjs').length-1,1);assert(controller.startsWith('const body = req.body;\nexport'));
 assert.equal(fs.readFileSync(path.join(root,'services/task-pool/task-pool.service.js'),'utf8').split("wi.target?.startsWith('atelierx-')").length-1,1);
});
