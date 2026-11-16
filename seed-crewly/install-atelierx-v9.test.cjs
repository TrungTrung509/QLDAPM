const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const install=require('./install-atelierx-v9.cjs'),apply=require('./upgrade-atelierx-v9.cjs');
test('migration archives unreferenced conflicts, preserves another team and live account configuration',t=>{
 const home=fs.mkdtempSync(path.join(os.tmpdir(),'atel-install-'));t.after(()=>fs.rmSync(home,{recursive:true,force:true}));
 const id='af30c001-2789-4f20-b917-000000000010',dir=path.join(home,'teams',id);fs.mkdirSync(dir,{recursive:true});
 const members=Object.keys(apply.roles).map(role=>({role,modelId:'gpt-6-luna',runtimeType:'codex-cli',sessionName:role}));
 fs.writeFileSync(path.join(dir,'config.json'),JSON.stringify({id,members}));
 fs.mkdirSync(path.join(home,'skills/atelierx-approve-v3'),{recursive:true});fs.mkdirSync(path.join(home,'skills/atelierx-shared'),{recursive:true});
 fs.mkdirSync(path.join(home,'teams/other'),{recursive:true});fs.writeFileSync(path.join(home,'teams/other/config.json'),JSON.stringify({members:[{skillOverrides:['atelierx-shared']}]}));
 install(home);install(home);
 assert(!fs.existsSync(path.join(home,'skills/atelierx-approve-v3')));assert(fs.existsSync(path.join(home,'atelierx-retired-skills/atelierx-approve-v3')));assert(fs.existsSync(path.join(home,'skills/atelierx-shared')));
 assert.equal(JSON.parse(fs.readFileSync(path.join(dir,'config.json'))).members[0].modelId,'gpt-6-luna');
});
