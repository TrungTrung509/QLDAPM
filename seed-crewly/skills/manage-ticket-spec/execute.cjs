const fs = require('fs');
const path = require('path');
const { parseTicketFile } = require('/usr/local/lib/node_modules/crewly/dist/cli/backend/src/services/project-tickets/ticket-file.js');

const args = process.argv.slice(2);
const command = args[0] || 'list';

const projectPath = process.env.CREWLY_PROJECT_PATH || '/home/node/project/Barbershop-Booking-System';
const ticketsDir = path.join(projectPath, '.crewly', 'tickets');

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
}

if (command === 'list') {
  if (!fs.existsSync(ticketsDir)) {
    console.log(JSON.stringify({ success: true, count: 0, tickets: [] }));
    process.exit(0);
  }
  const files = fs.readdirSync(ticketsDir).filter(f => f.startsWith('BBS-') && f.endsWith('.md'));
  const list = files.map(f => {
    const raw = fs.readFileSync(path.join(ticketsDir, f), 'utf8');
    const parsed = parseTicketFile(raw);
    return {
      file: f,
      id: parsed.file?.fields?.id,
      title: parsed.file?.fields?.title,
      status: parsed.file?.fields?.status,
      priority: parsed.file?.fields?.priority,
      assignee: parsed.file?.fields?.assignee,
      hasDescription: (parsed.file?.description?.length || 0) > 0,
      descriptionLength: parsed.file?.description?.length || 0,
      acceptanceCount: parsed.file?.acceptance?.length || 0
    };
  });
  console.log(JSON.stringify({ success: true, count: list.length, tickets: list }, null, 2));
  process.exit(0);
}

const id = getArg('--id');
if (!id) {
  console.error(JSON.stringify({ success: false, error: "Missing --id" }));
  process.exit(1);
}

// Find ticket file
const files = fs.readdirSync(ticketsDir).filter(f => f.startsWith(`${id}-`) && f.endsWith('.md'));
if (files.length === 0) {
  console.error(JSON.stringify({ success: false, error: `Ticket ${id} not found` }));
  process.exit(1);
}

const ticketFile = path.join(ticketsDir, files[0]);
let content = fs.readFileSync(ticketFile, 'utf8');

// If updating description fields
const context = getArg('--context');
const scope = getArg('--scope');
const contracts = getArg('--contracts');
const edgeCases = getArg('--edge-cases');
const deliverables = getArg('--deliverables');
const fullDesc = getArg('--description');

if (context || scope || contracts || edgeCases || deliverables || fullDesc) {
  let newDesc = fullDesc || '';
  if (!newDesc) {
    newDesc = [
      context ? `### 1. Bối cảnh & Mục tiêu (Context & Goal)\n${context}` : '',
      scope ? `### 2. Phạm vi kỹ thuật & Kiến trúc (Technical Scope)\n${scope}` : '',
      contracts ? `### 3. Hợp đồng dữ liệu & I/O (Data Contracts)\n${contracts}` : '',
      edgeCases ? `### 4. Xử lý ngoại lệ & Trường hợp biên (Edge Cases)\n${edgeCases}` : '',
      deliverables ? `### 5. Tiêu chuẩn bàn giao & Nghiệm thu (Deliverables)\n${deliverables}` : ''
    ].filter(Boolean).join('\n\n');
  }

  // Sanitize: ensure no top-level # or ## headings exist in description
  newDesc = newDesc.replace(/^#\s+/gm, '### ').replace(/^##\s+/gm, '### ');

  const descIdx = content.indexOf('## Description');
  const acceptIdx = content.indexOf('## Acceptance criteria');

  if (descIdx !== -1 && acceptIdx !== -1) {
    content = content.substring(0, descIdx + '## Description'.length) +
      '\n\n' + newDesc.trim() + '\n\n' +
      content.substring(acceptIdx);
    fs.writeFileSync(ticketFile, content, 'utf8');
    console.log(JSON.stringify({ success: true, id, updated: 'description', length: newDesc.length }));
    process.exit(0);
  }
}

console.log(JSON.stringify({ success: true, id, note: "Ticket inspected, no fields changed" }));

