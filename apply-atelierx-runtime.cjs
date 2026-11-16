const fs=require('node:fs'),path=require('node:path');
function apply(root='/usr/local/lib/node_modules/crewly/dist/backend/backend/src'){
function patch(relative,marker,replacement){const file=path.join(root,relative),s=fs.readFileSync(file,'utf8');if(s.includes(replacement))return;if(!s.includes(marker))throw Error('Runtime patch target changed: '+relative);fs.writeFileSync(file,s.replace(marker,replacement));}
const verify='requiresVerification(wi) {',verifyReplacement=verify+"\n        if (wi.target?.startsWith('atelierx-') || wi.metadata?.teamId === 'af30c001-2789-4f20-b917-000000000010') return false;";
patch('services/task-pool/task-pool.service.js',verify,verifyReplacement);
const body='const body = req.body;',replacement=body+"\n        if (body && typeof body === 'object') Object.assign(body, (await import('file:///home/node/project/crewly-docker/atelierx-task-title.cjs')).default.normalize(body));";
// Scope insertion to addItem; other controllers may use the same local name.
const controller=path.join(root,'controllers/task-pool/task-pool.controller.js'),s=fs.readFileSync(controller,'utf8');
if(!s.includes(replacement)){const index=s.indexOf('export async function addItem(');if(index<0||!s.slice(index).includes(body))throw Error('addItem runtime target changed');fs.writeFileSync(controller,s.slice(0,index)+s.slice(index).replace(body,replacement));}
const requestFile=path.join(root,'services/v3/request.service.js'),request=fs.readFileSync(requestFile,'utf8');
const requestMarker='const previousStatus = request.status;';
if(!request.includes('// AtelierX v9 final review gate')){
 if(!request.includes(requestMarker))throw Error('Request review target changed');
 const guard=`${requestMarker}
        // AtelierX v9 final review gate
        if (/PLAN_STANDALONE\\.md/.test(request.description ?? '') && (updates.status === 'waiting_confirmation' || (updates.status === 'done' && updates.accepted !== true))) {
            let ready = false;
            try {
                const fs = await import('node:fs/promises');
                const base = '/home/node/project/AtelierX/';
                const answer = String(updates.result ?? updates.reply ?? request.result ?? request.reply ?? '');
                const id = answer.match(/ATEL-\\d+/)?.[0];
                const catalog = JSON.parse(await fs.readFile(base + 'showcase/catalog.json', 'utf8'));
                const product = catalog.products?.find(p => p.id === id && p.status === 'complete');
                if (product) {
                    const report = JSON.parse(await fs.readFile(base + 'quality/reports/' + id + '/' + product.revision + '.json', 'utf8'));
                    const library = JSON.parse(await fs.readFile(base + 'quality/base-meshes.json', 'utf8'));
                    const {assessProduct} = await import('file:///home/node/project/AtelierX/tools/quality-gate.mjs');
                    ready = report.decision === 'pass' && report.leadApproved === true && assessProduct(product, report, library).length === 0;
                }
            } catch {}
            updates = {...updates, status: ready ? 'waiting_confirmation' : 'running', accepted: false};
        }`;
 fs.writeFileSync(requestFile,request.replace(requestMarker,guard));
}
const reviewFile=path.join(root,'services/v3/ticket-review.service.js'),review=fs.readFileSync(reviewFile,'utf8');
const marker="if (t.status !== 'waiting_confirmation' || !ticketNeedsReview(t) || !t.submittedAt)";
if(!review.includes("if (/PLAN_STANDALONE\\.md/.test(t.description ?? '')) continue;")){
 if(!review.includes(marker))throw Error('Review auto-accept target changed');
 fs.writeFileSync(reviewFile,review.replace(marker,"if (/PLAN_STANDALONE\\.md/.test(t.description ?? '')) continue;\n                "+marker));
}
console.log('AtelierX runtime policies installed (reload backend to activate)');
}
module.exports=apply;if(require.main===module)apply();
