const fs = require('node:fs');
const file = '/home/node/.crewly/settings.json';
if (!fs.existsSync(file)) {
  console.log('Settings not created yet; first boot has no sessions to resume');
  process.exit(0);
}
const settings = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!settings.general || typeof settings.general.autoResumeOnRestart !== 'boolean') {
  throw new Error('Unexpected Crewly settings schema');
}
console.log('autoResumeOnRestart before:', settings.general.autoResumeOnRestart);
settings.general.autoResumeOnRestart = false;
const temp = `${file}.codex-fresh-${process.pid}`;
fs.writeFileSync(temp, JSON.stringify(settings, null, 2));
fs.renameSync(temp, file);
console.log('autoResumeOnRestart after:', settings.general.autoResumeOnRestart);
