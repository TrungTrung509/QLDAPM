const rooms=[
 ['Điều phối','Studio Lead',0,0,55,'#c99761','desk'],
 ['Nghiên cứu','Market & Trend Researcher',-122,135,28,'#729f9e','board'],
 ['Vật liệu','Merchandiser / Material Specialist',150,-105,18,'#8b9c78','fabric'],
 ['Thiết kế','Fashion Designer',-40,285,14,'#b68c89','sketch'],
 ['Kỹ thuật','Technical Designer / QA',300,-20,2,'#899aaa','cut'],
 ['Studio hình ảnh','Brand & Commerce / Visual Studio',278,245,4,'#a08ca8','photo'],
 ['Sàn trưng bày','',130,130,15,'#567e71','runway']
];

let liveTokenUsage=null;
let activeModalFilter='all';
function getAgentTokenInfo(agentName){
 const mem=members.find(m=>m.name===agentName),view=liveTokenUsage;
 const team=view?.teams?.find(t=>t.teamId==='af30c001-2789-4f20-b917-000000000010');
 const row=view?.agents?.find(a=>mem&&([mem.sessionName,mem.agentId].filter(Boolean).includes(a.session)||(a.teamId===team?.teamId&&a.name===mem.name)));
 const limits=[[row?.capTokens,row?.todayTokens],[team?.capTokens,team?.todayTokens],[view?.totalCapTodayTokens,view?.todayTokens]].filter(([cap,used])=>typeof cap==='number'&&Number.isFinite(used));
 const remaining=limits.length?Math.max(0,Math.min(...limits.map(([cap,used])=>cap-used))):null;
 const budget=limits.length?Math.min(...limits.map(([cap])=>cap)):null;
 const status=!row?'unknown':row.stopped||team?.stopped||view.totalStopped||remaining===0?'out':!limits.length?'unlimited':'ok';
 const pct=budget&&remaining!==null?Math.round(remaining/budget*100):null;
 return {name:agentName,role:mem?.role||'',model:mem?.modelId||'Unknown',budget,used:row?.todayTokens,remaining,pctRemaining:pct,status,
 hasToken:status==='ok'||status==='unlimited',isLow:status==='ok'&&pct<=20,
 statusLabel:status==='out'?'HET HAN MUC':status==='unlimited'?'KHONG GIOI HAN':status==='unknown'?'CHUA CO DU LIEU':pct<=20?'SAP HET':'CON HAN MUC',
 statusColor:status==='out'?'#b91c1c':status==='unknown'?'#64748b':'#237a4c',pillClass:status==='out'?'out':status==='ok'?'ok':'warn'};
}
const svg=document.querySelector('#scene'),world=document.querySelector('#world'),nav=document.querySelector('nav'),info=document.querySelector('#info');
const iso=(x,y,z)=>[(x-y)*.92,(x+y)*.45-z];
const shade=(hex,f)=>'#'+hex.slice(1).match(/../g).map(v=>Math.min(255,Math.round(parseInt(v,16)*f)).toString(16).padStart(2,'0')).join('');
const poly=(p,c)=>'<polygon points="'+p.map(t=>t.join(',')).join(' ')+'" fill="'+c+'"/>';
const face=(p,c)=>poly(p.map(v=>iso(...v)),c);
function box(x,y,z,w,d,h,c){const a=x+w,b=y+d,t=z+h;return face([[x,b,z],[a,b,z],[a,b,t],[x,b,t]],shade(c,.78))+face([[a,y,z],[a,b,z],[a,b,t],[a,y,t]],shade(c,.63))+face([[x,y,t],[a,y,t],[a,b,t],[x,b,t]],c)}
function oval(x,y,z,rx,ry,c){const [a,b]=iso(x,y,z);return '<ellipse cx="'+a+'" cy="'+b+'" rx="'+rx+'" ry="'+ry+'" fill="'+c+'"/>'}
function person(x,y,z,c,hasToken=true){
  const bodyColor = hasToken ? c : '#718096';
  const headColor = hasToken ? '#bc896d' : '#a0aec0';
  let aura = '';
  if (!hasToken) {
    const [pa, pb] = iso(x+4, y+2, z);
    aura = `<ellipse cx="${pa}" cy="${pb}" rx="16" ry="8" fill="none" stroke="#ef4444" stroke-width="2" class="pulse-out"/>`;
  }
  return aura + box(x,y,z,3,4,13,'#374750')+box(x+5,y,z,3,4,13,'#374750')+box(x-1,y-1,z+13,11,6,14,bodyColor)+oval(x+4,y+2,z+33,5,6,headColor)+oval(x+4,y+2,z+36,5,3,'#403331')
}
function desk(x,y,z){return box(x,y,z,4,4,14,'#765d47')+box(x+40,y+18,z,4,4,14,'#765d47')+box(x,y,z+14,46,25,3,'#d4b998')+box(x+6,y+4,z+17,15,10,1,'#fff9ed')}
function dress(x,y,z,c){let [a,b]=iso(x,y,z);return box(x-2,y-2,z,4,4,40,'#9c805f')+oval(x,y,z,10,4,'#697774')+'<g transform="translate('+a+' '+b+')"><path d="M-4 -52 L-12 -48 -10 -40 -6 -36 -13 -16 Q0 -11 13 -16 L6 -36 10 -40 12 -48 4 -52 Q0 -46 -4 -52Z" fill="'+c+'"/><path d="M0 -46L2 -36 -1 -15" fill="none" stroke="#ffffff" opacity=".48"/></g>'}
const dyes=['#ce7468','#efcb87','#648e91','#9398ae','#f5eee0'];

const layouts=[[-140,-140,38,'#D9A76A'],[-175,34,22,'#5FB3C6'],[34,-175,22,'#A6C08A'],[-12,195,12,'#E3A3A0'],[195,-12,12,'#8FA6D6'],[170,170,6,'#B7A3D6'],[0,0,15,'#5FB89A']];
rooms.forEach((r,i)=>r.splice(2,4,...layouts[i]));
function figure(x,y,z,index,pose){
 const [u,v]=iso(x,y,z),skin=['#e5ab85','#ab7454','#f2cbb0','#915f48'][index%4],shirt=['#344867','#f3cb76','#df7769','#368d92','#f8eee0','#564d76','#638b67','#a25952'][index%8];
 const seated=pose===1,arm=pose===2?'M1 -23l8 4 9 -8':pose===3?'M1 -23l5 4 3 -6':'M1 -23l4 7 5 1';
 return '<g transform="translate('+u+' '+v+')"><ellipse rx="8" ry="3" fill="#20344c" opacity=".14"/><g transform="scale('+(index%2?-1:1)+' 1)"><path d="'+(seated?'M-3 -15l8 4 -1 10 M2 -15l9 4 -1 9':'M-3 -15l-1 14 M2 -15l3 13')+'" fill="none" stroke="#30405b" stroke-width="4" stroke-linecap="round"/><path d="M-5 -27Q0 -30 5 -25L5 -14Q0 -12 -6 -15Z" fill="'+shirt+'"/><path d="'+arm+'" fill="none" stroke="'+skin+'" stroke-width="3" stroke-linecap="round"/><ellipse cy="-33" rx="4.4" ry="5.5" fill="'+skin+'"/><path d="M-4 -32Q-6 -40 1 -39Q6 -39 5 -34L0 -35Z" fill="#49392f"/>'+(index%3===0?'<circle cx="-4" cy="-36" r="3" fill="#49392f"/>':'')+'</g></g>';
}
const props={
 plant(x,y,z){return box(x,y,z,6,6,7,'#47596a')+oval(x+3,y+3,z+12,7,7,'#369877')+oval(x+2,y+2,z+18,5,6,'#66bb80')},
 stool(x,y,z){return box(x,y,z,2,2,9,'#637686')+box(x-3,y-3,z+9,9,8,2,'#365775')},
 roll(x,y,z,k){return box(x,y,z,6,6,12,dyes[k%5])+oval(x+3,y+3,z+12,5,2.5,dyes[k%5])+oval(x+3,y+3,z+12,1.6,.9,'#8d785d')},
 screen(x,y,z){return box(x,y,z,2,2,4,'#607280')+box(x-8,y,z+4,19,2,12,'#324d64')+box(x-6,y+2,z+7,11,.5,1,'#8bcebd')+box(x-6,y+2,z+10,7,.5,1,'#e8bf80')},
 cup(x,y,z){return box(x,y,z,3,3,4,'#ffedce')+oval(x+1.5,y+1.5,z+4,2,1,'#906c51')}
};
const staffNames=['Minh','An','Linh','Vy','Khoa','Nhi'];
const duties=['Điều phối và duyệt mẫu','Nghiên cứu ý tưởng','Chọn vải và phối màu','Thiết kế và đặt họa tiết','Kiểm tra phom và hình in','Chuẩn bị góc chụp và lookbook'];
const assignments=new Map();
const PROJECT_ID='af30c001-2789-4f20-b917-000000000020';
let studioTickets=[],studioTasks=[];
let channelId=null,lastSequence=null;
function tasksFor(i){
 const member=members.find(m=>m.name===rooms[i][1]);
 if(!member)return [];
 return studioTasks.filter(t=>[member.sessionName,member.agentId].filter(Boolean).includes(t.assignedSessionName)||t.assignedTeamMemberId===member.id);
}
function ticketsFor(i){
 const member=members.find(m=>m.name===rooms[i][1]);
 return member?studioTickets.filter(t=>[member.sessionName,member.agentId,member.id].filter(Boolean).includes(t.assignee)):[];
}
function flowLabel(status){return ({ready:'Sẵn sàng',backlog:'Chờ phân công',in_progress:'Đang thực hiện',active:'Đang thực hiện',assigned:'Đã giao',queued:'Đang chờ',to_review:'Chờ kiểm tra',done:'Hoàn thành',completed:'Hoàn thành',failed:'Lỗi',blocked:'Bị chặn'})[status]||status||'Chưa rõ';}
function staffAction(i){
 const job=assignments.get(i),tasks=tasksFor(i),tickets=ticketsFor(i);
 if(job && Date.now()-job.start<20000)return 'Đang nhận bàn giao từ Studio Lead';
 const active=tasks.find(t=>['active','in_progress','assigned','queued'].includes(t.status));
 if(active)return flowLabel(active.status)+' · '+active.taskName;
 const ticket=tickets.find(t=>['in_progress','ready','to_review'].includes(t.status));
 return ticket?flowLabel(ticket.status)+' · '+ticket.id+' '+ticket.title:'Chưa có việc được giao trong AtelierX';
}
async function readTaskFlow(headers,team){
 const [ticketResponse,taskResponse]=await Promise.all([
  fetch('/api/project-tickets/'+PROJECT_ID,{cache:'no-store',headers}),
  fetch('/api/in-progress-tasks',{cache:'no-store',headers})
 ]);
 if(!ticketResponse.ok||!taskResponse.ok)throw Error('Không đọc được Task Flow AtelierX');
 const [ticketData,taskData]=await Promise.all([ticketResponse.json(),taskResponse.json()]);
 studioTickets=ticketData.data?.tickets||[];
 const previous=new Set(studioTasks.map(t=>t.id));
 studioTasks=(taskData.tasks||[]).filter(t=>t.projectId===PROJECT_ID);
 studioTasks.forEach(task=>{
  if(previous.has(task.id)||!['active','assigned','queued','in_progress'].includes(task.status))return;
  const index=rooms.findIndex(r=>team.members.some(m=>m.name===r[1]&&[m.sessionName,m.agentId].includes(task.assignedSessionName)));
  if(index>0)assignments.set(index,{start:Date.now(),brief:task.taskName,taskId:task.id});
 });
}
function renderTaskFlow(){
 const panel=document.getElementById('task-flow');if(!panel)return;
 panel.replaceChildren();
 const title=document.createElement('h2');title.textContent='Task Flow · AtelierX';panel.append(title);
 const ordered=studioTickets.slice().sort((a,b)=>Date.parse(b.updatedAt||0)-Date.parse(a.updatedAt||0));
 if(!ordered.length){const p=document.createElement('p');p.textContent=online?'Chưa có ticket trong dự án.':'Chưa kết nối dữ liệu Task Flow. Tải lại dashboard để xác thực.';panel.append(p);return}
 for(const ticket of ordered.slice(0,8)){
  const p=document.createElement('p');p.style.cssText='border-top:1px solid #d5d9ce;padding-top:8px;font-size:12px;line-height:1.4';
  const owner=members.find(m=>[m.sessionName,m.agentId,m.id].includes(ticket.assignee));
  p.textContent=ticket.id+' · '+flowLabel(ticket.status)+' · '+(owner?.name||'Chưa giao')+' — '+ticket.title;
  panel.append(p);
 }
}
function renderStaff(){
 const ns='http://www.w3.org/2000/svg';
 rooms.slice(0,6).forEach((r,i)=>{
 const [x,y]=iso(r[2]+24,r[3]+22,r[4]+8), [hx,hy]=iso(0,0,24);
 const [lx,ly]=iso(rooms[0][2]+38+(i%3)*6,rooms[0][3]+20+i*3,rooms[0][4]+8);
 const node=document.createElementNS(ns,'g');node.setAttribute('class','room staff');node.dataset.index=i;
 node.setAttribute('role','button');node.setAttribute('tabindex','0');node.setAttribute('aria-label',staffNames[i]+' · '+r[1]+' · '+staffAction(i));
 node.innerHTML='<g transform="scale(1.23)">'+figure(0,0,0,i,i%4)+'</g><rect x="-21" y="-64" width="42" height="14" rx="6" fill="#163e4a"/><text y="-54" text-anchor="middle" fill="white" font-size="9">'+staffNames[i]+'</text>';
 node.setAttribute('transform','translate('+x+' '+y+')');world.append(node);
 const elapsed=Date.now()-(assignments.get(i)?.start||0);
 if(elapsed<20000){
 const d='M0 0 L'+(hx-x)+' '+(hy-y)+' L'+(lx-x)+' '+(ly-y)+' L'+(lx-x)+' '+(ly-y)+' L'+(hx-x)+' '+(hy-y)+' L0 0';
 const motion=document.createElementNS(ns,'animateMotion');motion.setAttribute('path',d);motion.setAttribute('dur','20s');motion.setAttribute('calcMode','linear');motion.setAttribute('keyTimes','0;.18;.32;.68;.82;1');motion.setAttribute('begin','indefinite');node.append(motion);
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)motion.beginElementAt(-elapsed/1000);
 }
 });}
function atelierFixtures(i,z){
 let art='';
 // Rear gallery rail and repeated woven floor border.
 for(let k=0;k<13;k++)art+=box(-70+k*11,53,z,8,2,.4,k%2?'#f3e1ba':'#fff4db');
 art+=box(-67,-55,z,125,2,3,'#9e805f');
 for(let k=0;k<4;k++)art+=box(-65+k*32,-54,z,2,2,19,'#a5947f');
 art+=box(-67,-54,z+19,103,1,1,'#eee1c7');
 if(i===3||i===2){for(let k=0;k<6;k++)art+=box(-59+k*13,-52,z+5,8,2,14,dyes[k%5])}
 if(i===6){art+=box(-50,23,z,94,7,2,'#f9dfbc');for(let k=0;k<7;k++)art+=oval(-45+k*14,26,z+3,1.6,1,'#fffaf1')}
 if(i===0||i===1||i===4){art+=box(43,-46,z,20,13,12,'#ac8565');for(let k=0;k<3;k++)art+=box(45+k*4,-43,z+12,3,8,7,dyes[k])}
 return art;
}

function detailLayer(i,z){
 let objects=[];const put=(x,y,asset)=>objects.push([x+y,asset]);
 for(const [x,y] of [[42,-36],[-45,34]])put(x,y,props.plant(x,y,z));
 for(let k=0;k<3;k++){let x=-39+13*k,y=33;put(x,y,props.stool(x,y,z))}
 if(i===6){for(let k=0;k<3;k++)put(-36+k*28,-29,dress(-36+k*28,-29,z,dyes[k]))}
 else if(i===2||i===3){for(let k=0;k<6;k++)put(-40+k*9,-20,props.roll(-40+k*9,-20,z,k))}
 if([0,1,3,4].includes(i)){put(-10,0,props.screen(-10,0,z+17));put(6,6,props.cup(6,6,z+17))}
 if(i===5){for(let x of [-38,38])put(x,8,box(x,8,z,2,2,28,'#586d80')+box(x-5,8,z+27,12,4,8,'#ffedce'))}
 return objects.sort((a,b)=>a[0]-b[0]).map(o=>o[1]).join('');
}

function room(r,i){
  const [label,agentName,x,y,h,c,kind]=r;
  const tok = getAgentTokenInfo(agentName);
  const hasToken = tok ? tok.status !== 'out' : true;

  let a=box(-74,-60,0,148,120,h+8,c);let z=h+8;
  for(let k=0;k<4;k++)a+=box(13,48+k*5,z-5-k*4,25,5,4,shade(c,.96));
  a+=box(-50,-40,z,9,9,9,'#a37f5d')+oval(-46,-36,z+18,9,12,'#739672')+oval(-47,-39,z+24,7,8,'#93ac7e');
  
  if(kind==='runway'){
    a+=box(-41,-16,z,83,28,4,'#eee5cf')+dress(-18,-3,z+4,'#d28c78')+dress(21,-3,z+4,'#293f4b');
  } else {
    if(['board','sketch','desk'].includes(kind)){
      a+=box(-24,-38,z,56,3,36,'#d9c9ab');
      for(let k=0;k<5;k++)a+=box(-20+k*10,-34,z+13+(k%2)*4,8,1,13,dyes[k]);
      a+=desk(-26,-5,z);
    }
    if(kind==='cut'){a+=desk(-32,-12,z)+dress(26,-22,z,'#ecddbd')+box(-23,-4,z+18,22,2,1,'#bc884f')}
    if(kind==='fabric'){for(let k=0;k<5;k++)a+=box(-30+k*11,-30,z,9,15,26,dyes[k]);a+=desk(-22,2,z)}
    if(kind==='photo'){a+=box(-25,-32,z,53,3,48,'#eee5d9')+dress(0,-10,z,'#c17a69')+box(28,4,z,3,3,34,'#47575a')+box(21,3,z+30,16,4,12,'#fff7e0')}
    
  }

  a+=atelierFixtures(i,z)+detailLayer(i,z);
  const [u,v]=iso(x,y,0);

  // Badge Token nổi bật trên trần phòng
  let tokenBadgeSvg = '';
  if (tok) {
    const bg = tok.status === "unknown" ? "#f1f5f9" : tok.hasToken ? (tok.isLow ? '#fffbeb' : '#f0fdf4') : '#fef2f2';
    const border = tok.status === "unknown" ? "#94a3b8" : tok.hasToken ? (tok.isLow ? '#f59e0b' : '#22c55e') : '#ef4444';
    const labelTxt = tok.hasToken ? `⚡ Còn ${tok.pctRemaining ?? "--"}%` : '🔴 HẾT TOKEN';
    const pulseClass = tok.status === "out" ? 'pulse-out' : '';

    tokenBadgeSvg = `
      <g class="token-badge-svg" transform="translate(0, ${(52-h)+22})">
        <rect x="-52" y="-9" width="104" height="18" rx="9" fill="${bg}" stroke="${border}" stroke-width="1.5"/>
        <circle cx="-40" cy="0" r="4" fill="${tok.statusColor}" class="${pulseClass}"/>
        <text text-anchor="middle" x="6" y="3.5" fill="${tok.statusColor}" font-size="9" font-weight="bold">${labelTxt}</text>
      </g>
    `;
  }

  return '<g class="room" data-index="'+i+'" tabindex="0" role="button" aria-label="'+label+'" transform="translate('+u+' '+v+')">'
    + oval(0,0,-10,89,32,'#48635b').replace('<ellipse','<ellipse opacity=".14" filter="url(#shadow)"')
    + a
    + '<g transform="translate(0,'+(52-h)+')">'
    + '<rect x="-55" y="-8" width="110" height="19" rx="8" fill="#fcfaf1" stroke="#ccd5c7" stroke-width="1"/>'
    + '<text text-anchor="middle" y="5" fill="#304640" font-size="10.5" font-weight="700">'+label+'</text>'
    + '</g>'
    + tokenBadgeSvg
    + '</g>';
}

let cx=0,cy=-5,scale=1,selected=3,members=[],online=false;
function camera(){const w=720/scale,h=540/scale;svg.setAttribute('viewBox',[cx-w/2,cy-h/2,w,h].join(' '))}

function renderNavButtons() {
  nav.replaceChildren();
  rooms.forEach((r, i) => {
    const b = document.createElement('button');
    const tok = getAgentTokenInfo(r[1]);
    
    let tokenPill = '';
    if (tok) {
      if (tok.status === "unknown") {tokenPill = `<span>Chưa có dữ liệu token</span>`;} else if (tok.status === "unlimited") {tokenPill = `<span>Chưa đặt hạn mức</span>`;} else if (tok.hasToken) {
        tokenPill = `<span style="font-size:10.5px;padding:3px 8px;border-radius:10px;font-weight:700;background:#e7f5e8;color:#1e7e34;border:1px solid #a7dfb2">🟢 Còn ${tok.pctRemaining ?? "--"}%</span>`;
      } else {
        tokenPill = `<span style="font-size:10.5px;padding:3px 8px;border-radius:10px;font-weight:800;background:#fde8e8;color:#d32f2f;border:1px solid #f8b4b4;animation:blink 1.4s infinite">🔴 HẾT TOKEN</span>`;
      }
    } else {
      tokenPill = `<span style="font-size:10px;color:#718096;font-style:italic">Khu trưng bày</span>`;
    }

    b.innerHTML = `<span style="font-weight:600">${r[0]}</span> ${tokenPill}`;
    if(i<6){const work=document.createElement('small');work.style.cssText='display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;letter-spacing:0;text-transform:none';work.textContent=staffAction(i);b.append(work)}
    b.onclick = () => show(i, true);
    nav.append(b);
  });
}

function updateTokenHeaderSummary() {
  const allAgents = rooms.filter(r => r[1]).map(r => getAgentTokenInfo(r[1])).filter(Boolean);
  const okCount = allAgents.filter(a => a.status === "ok").length;
  const unlimitedCount = allAgents.filter(a => a.status === "unlimited").length;
  const outCount = allAgents.filter(a => a.status === "out").length;
  const unknownCount = allAgents.filter(a => a.status === "unknown").length;

  const summaryEl = document.querySelector('#token-summary-indicator');
  if (summaryEl) {
    if (unlimitedCount > 0 && !outCount && !unknownCount) {summaryEl.textContent = `${unlimitedCount} agent chưa đặt hạn mức`; } else if (unknownCount > 0) {summaryEl.textContent = `${okCount} còn · ${outCount} hết · ${unknownCount} chưa có dữ liệu`;} else if (outCount > 0) {
      summaryEl.innerHTML = `<span style="color:#2e7d32">🟢 ${okCount} Còn</span> · <span style="color:#d32f2f">🔴 ${outCount} Hết token</span>`;
    } else {
      summaryEl.innerHTML = `<span style="color:#2e7d32">🟢 6/6 Còn token</span>`;
    }
  }
}

function show(i,focus){
  selected=i;
  const r=rooms[i];
  const m=members.find(a=>a.name===r[1]);
  const tok=getAgentTokenInfo(r[1]);

  info.replaceChildren();

  // Tiêu đề phòng
  const h = document.createElement('div');
  h.className = 'info-title';
  h.textContent = r[0];
  info.append(h);

  if (r[1]) {
    const roleEl = document.createElement('div');
    roleEl.className = 'info-role';
    roleEl.textContent = staffNames[i] + " · " + r[1];
    info.append(roleEl);const action=document.createElement("p");action.textContent=staffAction(i);info.append(action);
    const assigned=tasksFor(i);for(const task of assigned.slice(0,3)){const note=document.createElement('p');note.textContent='Task Flow · '+flowLabel(task.status)+' · '+task.taskName;info.append(note)}
  }

  // Trạng thái hoạt động
  const statusEl = document.createElement('p');
  statusEl.style.margin = '4px 0 6px';
  statusEl.style.fontSize = '12.5px';
  statusEl.textContent = m 
    ? 'Trạng thái agent: ' + m.agentStatus + ' · ' + m.workingStatus 
    : (i === 6 ? 'Sàn catwalk trưng bày mẫu 3D & ma-nơ-canh.' : (online ? 'Đang cập nhật dữ liệu agent…' : 'Chưa kết nối dữ liệu Crewly.'));
  info.append(statusEl);

  // Task hiện tại
  if (m?.currentTask && !tasksFor(i).length) {
    const taskEl = document.createElement('p');
    taskEl.style.fontSize = '12px';
    taskEl.style.color = '#385046';
    taskEl.style.background = '#edf3ea';
    taskEl.style.padding = '6px 10px';
    taskEl.style.borderRadius = '6px';
    taskEl.textContent = 'Trạng thái agent: ' + (typeof m.currentTask === 'string' ? m.currentTask : m.currentTask.description);
    info.append(taskEl);
  }

  // Khung TRẠNG THÁI TOKEN nếu là phòng có Agent
  if (tok && tok.status !== "unknown" && tok.status !== "unlimited") {
    const card = document.createElement('div');
    card.className = 'token-card';
    card.innerHTML = `
      <div class="token-card-header">
        <span class="token-card-title">⚡ Hạn mức Token & Quota</span>
        <span class="token-pill ${tok.pillClass}">
          ${tok.hasToken ? (tok.isLow ? '⚠️ SẮP HẾT ('+tok.pctRemaining+'%)' : '🟢 CÒN TOKEN ('+tok.pctRemaining+'%)') : '🔴 HẾT TOKEN (0%)'}
        </span>
      </div>
      <div class="token-bar-bg">
        <div class="token-bar-fill ${tok.pillClass}" style="width: ${tok.pctRemaining ?? "--"}%;"></div>
      </div>
      <div class="token-stats">
        <div class="token-stat-item">
          <div class="token-stat-label">Quota còn lại</div>
          <div class="token-stat-val" style="color:${tok.statusColor}">${tok.remaining?.toLocaleString() ?? "--"} (${tok.pctRemaining ?? "--"}%)</div>
        </div>
        <div class="token-stat-item">
          <div class="token-stat-label">Tokens đã dùng</div>
          <div class="token-stat-val">${tok.used?.toLocaleString() ?? "--"} / ${tok.budget?.toLocaleString() ?? "--"}</div>
        </div>
        <div class="token-stat-item">
          <div class="token-stat-label">Model AI</div>
          <div class="token-stat-val" style="font-size:11px;">${tok.model}</div>
        </div>
        <div class="token-stat-item">
          <div class="token-stat-label">Khả năng chạy</div>
          <div class="token-stat-val">${tok.hasToken ? `~${Math.floor((tok.remaining || 0)/1800)} lượt task` : '0 lượt (Blocked)'}</div>
        </div>
      </div>
      <div class="token-alert ${tok.hasToken ? 'ok' : 'out'}">
        ${tok.hasToken 
          ? (tok.isLow 
              ? '⚠️ <strong>Cảnh báo:</strong> Quota sắp cạn dưới 20%. Hãy cân nhắc chuyển sang Gemini Flash để tối ưu chi phí.' 
              : '✅ Agent còn đầy đủ token để nhận và triển khai thiết kế trong xưởng.')
          : '⛔ <strong>ĐÃ HẾT TOKEN:</strong> Agent bị dừng (Out of usage / Quota cạn). Không thể nhận thêm việc cho tới khi chuyển model hoặc nạp thêm quota.'}
      </div>
    `;
    info.append(card);
  }

  [...nav.children].forEach((b,k)=>b.setAttribute('aria-pressed',i===k));
  if(focus){[cx,cy]=iso(r[2],r[3],r[4]);scale=1.65;camera()}
}

// Cầu nối bậc thang
function bridge(r) {
 const hub=rooms[6], dx=r[2]-hub[2], dy=r[3]-hub[3], length=Math.hypot(dx,dy);
 const edge=Math.min(74/Math.abs(dx||.001),60/Math.abs(dy||.001));
 const nx=-dy/length*10, ny=dx/length*10;
 let parts='';
 for(let k=0;k<10;k++){
  const start=edge+(1-2*edge)*k/10,end=edge+(1-2*edge)*(k+1)/10;
  const x=hub[2]+dx*start,y=hub[3]+dy*start,b=hub[2]+dx*end,d=hub[3]+dy*end,z=hub[4]+8+(r[4]-hub[4])*k/9;
  parts+=face([[x-nx,y-ny,z],[b-nx,d-ny,z],[b+nx,d+ny,z],[x+nx,y+ny,z]],k%2?'#c4cbb8':'#d8dec9');
 }
 for(const side of [-1,1]){
  const at=(t,z)=>iso(hub[2]+dx*t+side*nx,hub[3]+dy*t+side*ny,z);
  const a=at(edge,hub[4]+18), b=at(1-edge,r[4]+18);
  parts+='<path d="M'+a+'L'+b+'" stroke="#7896a3" stroke-width="2" fill="none"/>';
  for(let k=0;k<=4;k++){let t=k/4,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t;parts+='<path d="M'+x+' '+y+'v10" stroke="#8299a2" stroke-width="1.3"/>'}
 }
 return parts;
}

function renderWorld() {
  world.innerHTML=rooms.slice(0,6).map(bridge).join('')+rooms.map((r,i)=>[r,i]).sort((a,b)=>a[0][2]+a[0][3]-b[0][2]-b[0][3]).map(([r,i])=>room(r,i)).join('');
  const labels=document.createElementNS('http://www.w3.org/2000/svg','g');
  world.querySelectorAll('.room').forEach(group=>{
    const layer=group.cloneNode(false);
    layer.removeAttribute('tabindex');layer.removeAttribute('role');
    layer.setAttribute('aria-hidden','true');
    const last=group.lastElementChild, name=last.classList.contains('token-badge-svg')?last.previousElementSibling:last;
    layer.append(name);if(last!==name)layer.append(last);
    labels.append(layer);
  });
  world.append(labels);renderStaff();
}

renderWorld();
renderNavButtons();
updateTokenHeaderSummary();

svg.addEventListener('wheel',e=>{e.preventDefault();scale=Math.max(.5,Math.min(2.5,scale*Math.exp(-e.deltaY*.0015)));camera()},{passive:false});
let drag=null,dragged=false;
svg.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY,cx,cy];dragged=false});
svg.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag[0],dy=e.clientY-drag[1];if(Math.abs(dx)+Math.abs(dy)<5&&!dragged)return;dragged=true;svg.setPointerCapture(e.pointerId);const unit=1/svg.getScreenCTM().a;cx=drag[2]-dx*unit;cy=drag[3]-dy*unit;camera()});
for(const event of ['pointerup','pointercancel'])svg.addEventListener(event,()=>drag=null);
svg.addEventListener('click',e=>{if(dragged){e.stopPropagation();dragged=false}},true);
world.onclick=e=>{const g=e.target.closest('.room');if(g)show(+g.dataset.index,true)};
world.onkeydown=e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();e.target.closest('.room')?.dispatchEvent(new MouseEvent('click',{bubbles:true}))}};

for(const [id,f] of [['plus',1.25],['minus',.8]]) {
  const el = document.getElementById(id);
  if (el) el.onclick=()=>{scale=Math.max(.8,Math.min(3,scale*f));camera()};
}

const resetBtn = document.querySelector('#reset');
if (resetBtn) {
  resetBtn.onclick=()=>{cx=0;cy=-5;scale=1;camera();show(6,false)};
}

camera();
show(3,false); // Focus sẵn vào Fashion Designer để thấy ngay trạng thái Hết token

// Modal Token 6 Agents
const modal = document.getElementById('token-modal');
const openModalBtn = document.getElementById('token-summary-btn');
const openModalBtn2 = document.getElementById('btn-open-token-modal');
const closeModalBtn = document.getElementById('modal-close-btn');

function renderTokenModalTable(){
 const tbody=document.getElementById('token-table-body');if(!tbody)return;
 const list=rooms.filter(r=>r[1]).map(r=>getAgentTokenInfo(r[1])).filter(a=>activeModalFilter==='all'||(activeModalFilter==='ok'?a.hasToken:a.status==='out'));
 tbody.replaceChildren();
 for(const a of list){const tr=tbody.insertRow();const values=[a.name+' / '+a.role,a.model,a.statusLabel,a.used==null?'--':a.used.toLocaleString('vi-VN'),a.remaining==null?'--':a.remaining.toLocaleString('vi-VN')];values.forEach((value,i)=>{const td=tr.insertCell();td.textContent=value;if(i===2)td.style.color=a.statusColor})}
 if(!list.length){const td=tbody.insertRow().insertCell();td.colSpan=5;td.textContent='No agents match this filter.'}
}
function openModal() {
  if (modal) {
    renderTokenModalTable();
    modal.classList.add('open');
  }
}
function closeModal() {
  if (modal) modal.classList.remove('open');
}

if (openModalBtn) openModalBtn.onclick = openModal;
if (openModalBtn2) openModalBtn2.onclick = openModal;
if (closeModalBtn) closeModalBtn.onclick = closeModal;
if (modal) {
  modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}

// Filter tabs in modal
document.querySelectorAll('.modal-tab-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeModalFilter = btn.dataset.filter;
    renderTokenModalTable();
  };
});

async function sync(){
  liveTokenUsage=null;
  try{
    const token=localStorage.getItem('crewly_api_token');
    const headers = token ? { Authorization: 'Bearer ' + token } : {};

    // 1. Fetch Teams
    const resp = await fetch('/api/teams', { cache: 'no-store', headers });
    if(!resp.ok)throw Error('teams');
    if(resp.ok) {
      const j = await resp.json();
      const team = (Array.isArray(j.data) ? j.data : j.data.teams).find(t => 
        t.id === 'af30c001-2789-4f20-b917-000000000010' || t.name.includes('AtelierX')
      );
      if(team) {
        members = team.members;
        try{await readTaskFlow(headers,team)}catch{studioTickets=[];studioTasks=[]}
        online = true;
        document.querySelector('#status').textContent = 
          members.filter(m => m.agentStatus === 'active').length + ' / ' + members.length + ' agent hoạt động';
      }
    }

    // 2. Fetch Token Usage
    try {
      const respUsage = await fetch('/api/system/usage/caps?days=1', { cache: 'no-store', headers });
      if(respUsage.ok) {
        const usageData = await respUsage.json();
        liveTokenUsage = usageData.data || null;
      }
    } catch(errUsage) {
      // Bỏ qua nếu endpoint chưa sẵn sàng
    }

  }catch(err){
    online = false;
    document.querySelector('#status').textContent = 'Chế độ độc lập (Chưa kết nối Crewly)';
  }

  renderWorld();
  renderNavButtons();
  updateTokenHeaderSummary();
  renderTaskFlow();
  show(selected, false);
}

sync();
setInterval(sync, 10000);
