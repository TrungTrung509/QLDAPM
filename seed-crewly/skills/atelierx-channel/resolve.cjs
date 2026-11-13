const fs = require('node:fs');
const teamId = 'af30c001-2789-4f20-b917-000000000010';
async function resolve() {
  const token = process.env.CREWLY_API_TOKEN || fs.readFileSync('/home/node/.crewly/api-token', 'utf8').trim();
  const res = await fetch('http://127.0.0.1:' + (process.env.WEB_PORT || 8787) + '/api/chat/channels/team/ensure', {
    method: 'POST', headers: {'content-type':'application/json', authorization:'Bearer ' + token},
    body: JSON.stringify({teamId, name:'AtelierX Fashion Studio'})
  });
  const {data} = await res.json();
  if (!res.ok || data?.teamId !== teamId || !data.id) throw new Error('Cannot resolve AtelierX channel: HTTP ' + res.status);
  console.log(data.id);
}
resolve().catch(err => { console.error(err.message); process.exitCode = 1; });
