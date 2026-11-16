const test=require('node:test'),assert=require('node:assert/strict'),apply=require('./upgrade-atelierx-v8.cjs');
test('v8 is idempotent, removes conflicting mannequin instructions and preserves identities/runtime',()=>{
 const c={members:Object.keys(apply.roles).map(role=>({role,model:'gpt-6-luna',sessionName:role,runtimeType:'codex-cli',skillOverrides:['atelierx-flow-v7','atelierx-mannequin-reference-v1','atelierx-quality','atelierx-channel-v3']}))};
 apply(c);apply(c);
 for(const m of c.members){assert.equal(m.model,'gpt-6-luna');assert.equal(m.sessionName,m.role);assert.equal(m.runtimeType,'codex-cli');assert.equal(m.skillOverrides.filter(s=>s==='atelierx-flow-v8').length,1);assert(!m.skillOverrides.includes('atelierx-mannequin-reference-v1'));assert(!m.skillOverrides.includes('atelierx-quality'));assert(m.skillOverrides.includes('atelierx-channel-v3'));assert(m.systemPrompt.includes('PLAN_STANDALONE.md'));}
});
