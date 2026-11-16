const test=require('node:test'),assert=require('node:assert/strict'),{normalize}=require('./atelierx-task-title.cjs');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
test('verbose goals stay in description, AtelierX title shortens, other teams remain untouched',()=>{
 const input={target:'atelierx-qa-0004',title:'ATEL-41 GOAL: '+ 'x'.repeat(200),description:'Full goal',metadata:{productName:'Áo thun kem'}};
 const out=normalize(input);assert.equal(out.title,'ATEL-41 · Kiểm tra phom và sản phẩm · Áo thun kem');assert.equal(out.description,'Full goal');assert.equal(out.metadata.requiresVerification,false);
 assert.equal(normalize({...input,target:'other'}).title,input.title);
});
test('exact flow ticket title routes a Visual task away from Designer',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'atelierx-role-'));
 try{
  const dir=path.join(root,'orders','ATEL-53');fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'studio-flow.json'),JSON.stringify({tasks:{visual:{ticketId:'ATEL-57',title:'ATEL-53 · Visual · Shirt',target:'atelierx-frontend-developer-0006'}}}));
  const out=normalize({target:'atelierx-designer-0003',title:'ATEL-57: ATEL-53 · Visual · Shirt',metadata:{}},root);
  assert.equal(out.target,'atelierx-frontend-developer-0006');
  assert.equal(out.metadata.studioRoleCorrectedFrom,'atelierx-designer-0003');
 }finally{fs.rmSync(root,{recursive:true,force:true})}
});
