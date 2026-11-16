const fs=require('node:fs'),path=require('node:path'),apply=require('./upgrade-atelierx-v9.cjs');
function install(home='/home/node/.crewly'){
 const id='af30c001-2789-4f20-b917-000000000010',file=path.join(home,'teams',id,'config.json');
 const config=JSON.parse(fs.readFileSync(file,'utf8'));if(config.id!==id||config.members.length!==6)throw Error('Unexpected team');
 const before=fs.readFileSync(file,'utf8');if(!fs.existsSync(file+'.pre-v9'))fs.writeFileSync(file+'.pre-v9',before);
 apply(config);fs.writeFileSync(file+'.tmp',JSON.stringify(config,null,2)+'\n');fs.renameSync(file+'.tmp',file);
 const active=new Set(config.members.flatMap(m=>m.skillOverrides).filter(s=>s.startsWith('atelierx-')));
 for(const id of active){const source=path.join(__dirname,'skills',id),dest=path.join(home,'skills',id);fs.cpSync(source,dest,{recursive:true});for(const name of fs.readdirSync(dest)){if(!name.endsWith('.sh'))continue;const f=path.join(dest,name);fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace(/\r\n/g,'\n'));fs.chmodSync(f,0o755)}}
 // Archive unreferenced AtelierX skills, after checking every other team's config.
 const referenced=new Set(active);
 for(const team of fs.readdirSync(path.join(home,'teams'))){const f=path.join(home,'teams',team,'config.json');if(!fs.existsSync(f))continue;for(const m of JSON.parse(fs.readFileSync(f,'utf8')).members||[])for(const s of m.skillOverrides||[])referenced.add(s)}
 const archive=path.join(home,'atelierx-retired-skills');fs.mkdirSync(archive,{recursive:true});
 for(const skill of fs.readdirSync(path.join(home,'skills'))){
  if(!skill.startsWith('atelierx-')||referenced.has(skill))continue;
  const source=path.resolve(home,'skills',skill);if(!source.startsWith(path.resolve(home,'skills')+path.sep))throw Error('Invalid skill path');
  let dest=path.join(archive,skill);if(fs.existsSync(dest))dest+='-'+Date.now();fs.renameSync(source,dest);
 }
 console.log('AtelierX v9 installed:',config.members.length,'agents;',active.size,'active studio skills');
}
module.exports=install;if(require.main===module)install(process.argv[2]);
