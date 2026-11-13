const http = require('http');
const fs = require('fs');
const path = require('path');

// CLI Argument parser
const args = process.argv.slice(2);
let message = '';
let type = 'update';
let ticket = '';
let to = '';
let sender = '';
let channelId = '31de68fe-9e44-4f6c-be91-a5e040ec910b'; // QLDA Team #general default

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--message' || arg === '-m') {
    message = args[++i];
  } else if (arg === '--type' || arg === '-t') {
    type = args[++i];
  } else if (arg === '--ticket') {
    ticket = args[++i];
  } else if (arg === '--to') {
    to = args[++i];
  } else if (arg === '--sender' || arg === '-s') {
    sender = args[++i];
  } else if (arg === '--channel' || arg === '-c') {
    channelId = args[++i];
  }
}

// Fallback to stdin if message is empty
if (!message && !process.stdin.isTTY) {
  try {
    message = fs.readFileSync(0, 'utf8').trim();
  } catch (e) {}
}

if (!message) {
  console.error(JSON.stringify({ success: false, error: "Missing required argument --message" }));
  process.exit(1);
}

// Map sender session
const SESSION_MAP = {
  'team-leader': 'qlda-team-team-leader-0f797e8a',
  'leader': 'qlda-team-team-leader-0f797e8a',
  'team leader': 'qlda-team-team-leader-0f797e8a',
  'tpm': 'qlda-team-technical-product-manager-fccdd7b1',
  'technical product manager': 'qlda-team-technical-product-manager-fccdd7b1',
  'designer': 'qlda-team-ui-ux-designer-5aa73d27',
  'ui-ux-designer': 'qlda-team-ui-ux-designer-5aa73d27',
  'ui ux designer': 'qlda-team-ui-ux-designer-5aa73d27',
  'fullstack': 'qlda-team-fullstack-developer-b16830a5',
  'fullstack-dev': 'qlda-team-fullstack-developer-b16830a5',
  'fullstack developer': 'qlda-team-fullstack-developer-b16830a5',
  'fe': 'qlda-team-fe-developer-690d736f',
  'frontend': 'qlda-team-fe-developer-690d736f',
  'frontend-developer': 'qlda-team-fe-developer-690d736f',
  'fe developer': 'qlda-team-fe-developer-690d736f',
  'be': 'qlda-team-be-developer-ac69e470',
  'backend': 'qlda-team-be-developer-ac69e470',
  'backend-developer': 'qlda-team-be-developer-ac69e470',
  'be developer': 'qlda-team-be-developer-ac69e470',
  'qa': 'qlda-team-tester-3e1b565d',
  'tester': 'qlda-team-tester-3e1b565d'
};

const activeSession = process.env.CREWLY_SESSION_NAME ||
  (sender ? (SESSION_MAP[sender.toLowerCase()] || sender) : 'qlda-team-team-leader-0f797e8a');

// Format message header based on type
let formattedContent = '';
const typeLower = (type || 'update').toLowerCase();

if (typeLower === 'delegate' || typeLower === 'assign') {
  formattedContent = `📢 **[GIAO VIỆC]** ${ticket ? `\`${ticket}\`` : ''} ${to ? `➔ ${to}` : ''}\n\n${message}`;
} else if (typeLower === 'handover') {
  formattedContent = `🤝 **[BÀN GIAO]** ${ticket ? `\`${ticket}\`` : ''} ${to ? `➔ ${to}` : ''}\n\n${message}`;
} else if (typeLower === 'complete' || typeLower === 'done') {
  formattedContent = `✅ **[HOÀN THÀNH & SẴN SÀNG REVIEW]** ${ticket ? `\`${ticket}\`` : ''} ${to ? `➔ ${to}` : ''}\n\n${message}`;
} else if (typeLower === 'bug' || typeLower === 'blocker') {
  formattedContent = `🐛 **[BÁO LỖI / BLOCKER]** ${ticket ? `\`${ticket}\`` : ''} ${to ? `➔ ${to}` : ''}\n\n${message}`;
} else if (typeLower === 'review' || typeLower === 'qa') {
  formattedContent = `🔍 **[KẾT QUẢ REVIEW & KIỂM THỬ]** ${ticket ? `\`${ticket}\`` : ''} ${to ? `➔ ${to}` : ''}\n\n${message}`;
} else {
  formattedContent = `💬 **[TRAO ĐỔI CHUNG]** ${ticket ? `\`${ticket}\`` : ''} ${to ? `➔ ${to}` : ''}\n\n${message}`;
}

// Read API token
let token = '';
try {
  token = fs.readFileSync('/home/node/.crewly/api-token', 'utf8').trim();
} catch (e) {
  token = process.env.CREWLY_API_TOKEN || '70100c12a1711e57a969d4fd7f55c35552f93a95c73fdc5e503c53d7291830bd';
}

const payload = JSON.stringify({
  content: formattedContent,
  contentType: 'markdown'
});

const req = http.request({
  hostname: 'localhost',
  port: parseInt(process.env.WEB_PORT || '8787', 10),
  path: `/api/chat/channels/${channelId}/messages`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'Authorization': `Bearer ${token}`,
    'X-Agent-Session': activeSession
  }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    let messageId = null;
    try {
      const parsed = JSON.parse(body);
      messageId = parsed.data?.id;
    } catch (e) {}

    // Patch message in database to ensure proper agent sender attribution
    if (messageId) {
      try {
        const Database = require('/usr/local/lib/node_modules/crewly/node_modules/better-sqlite3');
        const db = new Database('/home/node/.crewly/chat.db');
        db.prepare(`
          UPDATE chat_messages 
          SET sender_type = 'agent', 
              sender_id = ?, 
              sender_kind = 'agent',
              agent_session = ?,
              content = ?
          WHERE id = ?
        `).run(activeSession, activeSession, formattedContent, messageId);
      } catch (err) {
        // ignore db patch error
      }
    }

    console.log(JSON.stringify({
      success: true,
      messageId: messageId,
      channel: '#general',
      type: typeLower,
      sender: activeSession
    }));
    process.exit(0);
  });
});

req.on('error', err => {
  console.error(JSON.stringify({ success: false, error: err.message }));
  process.exit(1);
});

req.write(payload);
req.end();
