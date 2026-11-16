async function main() {
  const response = await fetch('http://127.0.0.1:8787/api/orchestrator/runtime', {
    method: 'PUT', headers: {'content-type':'application/json'},
    body: JSON.stringify({runtimeType:'codex-cli',modelId:'gpt-6-luna',reasoningEffort:'low'})
  });
  const body = await response.json();
  console.log(JSON.stringify({status:response.status,success:body.success,error:body.error,message:body.message}));
  if (!response.ok || !body.success) process.exitCode=1;
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
