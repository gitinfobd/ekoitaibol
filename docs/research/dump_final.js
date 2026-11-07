const fs = require('fs');

const data = JSON.parse(fs.readFileSync('e:/ekoitaibol/serverResponse.json', 'utf8')).data;
let finalResponses = '';
for (let i = 155; i < data.linear_conversation.length; i++) {
  const item = data.linear_conversation[i];
  const msg = item.message;
  if (!msg) continue;
  const role = msg.author?.role;
  let text = '';
  if (msg.content?.parts) {
    text = msg.content.parts.map(p => typeof p === 'string' ? p : JSON.stringify(p)).join('\n');
  } else if (typeof msg.content === 'string') {
    text = msg.content;
  }
  finalResponses += `\n\n=== TURN ${i} (${role}) ===\n\n` + text;
}
fs.writeFileSync('e:/ekoitaibol/final_turns.md', finalResponses, 'utf8');
console.log('Saved final_turns.md, length:', finalResponses.length);
