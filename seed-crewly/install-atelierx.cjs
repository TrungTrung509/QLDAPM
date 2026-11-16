// Install only missing AtelierX records into an existing Crewly volume.
const fs = require('node:fs');
const path = require('node:path');
const seed = __dirname;
const home = '/home/node/.crewly';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const project = read(path.join(seed, 'projects.json')).find(p => p.name === 'AtelierX');
const team = project.teams.core[0];
const source = path.join(seed, 'teams', team);
require('./upgrade-atelierx-flow.cjs');
const config = read(path.join(source, 'config.json'));
const ids = new Set(config.members.flatMap(m => m.skillOverrides).filter(id => id.startsWith('atelierx-')));
for (const id of ids) {
  const src = path.join(seed, 'skills', id);
  const dest = path.join(home, 'skills', id);
  fs.accessSync(path.join(src, 'SKILL.md'));
  if (!fs.existsSync(dest)) fs.cpSync(src, dest, {recursive: true});
}
const dest = path.join(home, 'teams', team);
fs.mkdirSync(dest, {recursive: true});
if (!fs.existsSync(path.join(dest, 'config.json'))) fs.copyFileSync(path.join(source, 'config.json'), path.join(dest, 'config.json'));
const liveConfig = path.join(dest, 'config.json');
const current = read(liveConfig);
const byId = new Map(config.members.map(m => [m.id, m]));
for (const member of current.members) {
  const seedMember = byId.get(member.id);
  if (!seedMember) continue;
  member.systemPrompt = seedMember.systemPrompt;
  member.skillOverrides = seedMember.skillOverrides;
  member.excludedRoleSkills = seedMember.excludedRoleSkills;
}
const liveTmp = liveConfig + '.flow-' + process.pid;
fs.writeFileSync(liveTmp, JSON.stringify(current, null, 2) + '\n');
fs.renameSync(liveTmp, liveConfig);
const file = path.join(home, 'projects.json');
const projects = read(file);
if (!projects.some(p => p.id === project.id)) {
  const tmp = file + '.atelierx-' + process.pid;
  fs.writeFileSync(tmp, JSON.stringify([...projects, project], null, 2));
  fs.renameSync(tmp, file);
}
console.log('AtelierX installed:', config.members.length, 'members,', ids.size, 'studio skills');
require('./install-atelierx-v9.cjs')(home);
