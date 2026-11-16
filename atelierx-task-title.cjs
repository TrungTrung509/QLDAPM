const fs=require('node:fs'),path=require('node:path');
const stages={
 'atelierx-team-leader-0001':['lead','Điều phối và bàn giao'],
 'atelierx-tpm-0002':['research','Nghiên cứu phom, họa tiết và nội dung'],
 'atelierx-designer-0003':['designer','Thiết kế phom áo'],
 'atelierx-backend-developer-0005':['material','Hoàn thiện màu và chất liệu'],
 'atelierx-frontend-developer-0006':['visual','Dựng sản phẩm trong Sàn trưng bày'],
 'atelierx-qa-0004':['qa','Kiểm tra phom và sản phẩm'],
};
function normalize(input,root='/home/node/project/AtelierX'){
 const stage=stages[input.target];if(!stage)return input;
 const ids=String(input.title||'').match(/ATEL-\d+/g)||[];
 const order=input.metadata?.studioOrderId||(ids.length>1?ids[1]:ids[0]);
 const next={...input,metadata:{...input.metadata,requiresVerification:false}};
 if(!/^ATEL-\d+$/.test(order||''))return next;
 const flowFile=path.join(root,'orders',order,'studio-flow.json');
 const flow=fs.existsSync(flowFile)?JSON.parse(fs.readFileSync(flowFile,'utf8')):null;
 const exactRole=Object.values(flow?.tasks||{}).find(task=>task.title===input.title||`${task.ticketId}: ${task.title}`===input.title);
 const roleByTicket=Object.values(flow?.tasks||{}).find(task=>task.ticketId&&input.metadata?.projectTicket?.id===task.ticketId);
 const expectedRole=exactRole||roleByTicket;
 if(expectedRole?.target&&expectedRole.target!==input.target){
   next.target=expectedRole.target;
   next.metadata={...next.metadata,studioRoleCorrectedFrom:input.target};
   return next;
 }
 if(flow?.tasks?.[stage[0]]?.title)next.title=flow.tasks[stage[0]].title;
 else if(String(input.title||'').length>110||/GOAL|EXPECTED OUTCOME|##|Retry|Verify:/i.test(input.title||''))
   next.title=`${order} · ${stage[1]}${input.metadata?.productName?' · '+String(input.metadata.productName).slice(0,60):''}`;
 return next;
}
module.exports={normalize};
