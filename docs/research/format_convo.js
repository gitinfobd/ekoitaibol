const fs = require('fs');

const data = JSON.parse(fs.readFileSync('e:/ekoitaibol/serverResponse.json', 'utf8')).data;
let md = `# ${data.title}\n\n`;
md += `**Shared Conversation ID**: ${data.conversation_id}\n\n---\n\n`;

for (let item of data.linear_conversation) {
  const msg = item.message;
  if (!msg) continue;
  const role = msg.author?.role || 'unknown';
  let text = '';
  if (msg.content?.parts) {
    text = msg.content.parts.map(p => typeof p === 'string' ? p : JSON.stringify(p)).join('\n');
  } else if (typeof msg.content === 'string') {
    text = msg.content;
  }
  
  if (!text.trim()) continue;
  
  const roleTitle = role === 'user' ? '👤 User' : role === 'assistant' ? '🤖 Assistant' : `⚙️ ${role}`;
  md += `### ${roleTitle}\n\n${text}\n\n---\n\n`;
}

fs.writeFileSync('e:/ekoitaibol/FULL_CHATGPT_CONVERSATION.md', md, 'utf8');
console.log('Saved FULL_CHATGPT_CONVERSATION.md, size:', md.length);
