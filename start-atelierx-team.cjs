const fs = require('node:fs');
const token = fs.readFileSync('/home/node/.crewly/api-token','utf8').trim();
const teamId = 'af30c001-2789-4f20-b917-000000000010';
const projectId = 'af30c001-2789-4f20-b917-000000000020';
async function main() {
  const response = await fetch(`http://127.0.0.1:8787/api/teams/${teamId}/start`,{
    method:'POST',
    headers:{'content-type':'application/json',authorization:`Bearer ${token}`},
    body:JSON.stringify({projectId})
  });
  const body = await response.json();
  console.log(JSON.stringify({status:response.status,success:body.success,message:body.message,data:body.data},null,2));
  if (!response.ok || !body.success) process.exitCode = 1;
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
