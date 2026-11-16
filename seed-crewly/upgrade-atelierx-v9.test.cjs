const test=require('node:test'),assert=require('node:assert/strict'),apply=require('./upgrade-atelierx-v9.cjs');
test('remove conflicting old workflows, preserve runtime/identity/communication and stay idempotent',()=>{
 const config={members:Object.keys(apply.roles).map(role=>({role,modelId:'gpt-6-luna',runtimeType:'codex-cli',sessionName:role,skillOverrides:['atelierx-base-v3','atelierx-approve-v3','atelierx-flow-v8','atelierx-showcase','skill-send-message','skill-verify-output']}))};
 apply(config);const before=JSON.stringify(config);apply(config);assert.equal(JSON.stringify(config),before);
 for(const m of config.members){assert.equal(m.modelId,'gpt-6-luna');assert.equal(m.runtimeType,'codex-cli');assert.equal(m.sessionName,m.role);assert(m.skillOverrides.includes('atelierx-channel-v3'));assert(m.skillOverrides.includes('skill-send-message'));assert(!m.skillOverrides.includes('skill-verify-output'));assert(!m.skillOverrides.includes('atelierx-base-v3'));assert(m.excludedRoleSkills.includes('tl-verify-output'));}
});
