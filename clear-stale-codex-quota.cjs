// Run only after a successful live Codex model call with the refreshed login.
const fs = require('node:fs');
const path = require('node:path');
const file = '/home/node/.crewly/runtime-fallback.json';
const state = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!state.exhausted || !state.exhausted['codex-cli']) {
  console.log('No stale Codex quota flag');
  process.exit(0);
}
const backup = `${file}.before-codex-login-refresh`;
if (!fs.existsSync(backup)) fs.copyFileSync(file, backup);
delete state.exhausted['codex-cli'];
const temporary = `${file}.${process.pid}.tmp`;
try {
  fs.writeFileSync(temporary, JSON.stringify(state, null, 2) + '\n');
  fs.renameSync(temporary, file);
} finally {
  if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
}
console.log('Cleared stale codex-cli quota flag; preserved other runtimes and usage ledger');
