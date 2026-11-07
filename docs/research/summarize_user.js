const fs = require('fs');

const data = JSON.parse(fs.readFileSync('e:/ekoitaibol/serverResponse.json', 'utf8')).data;
const userTurns = [];

data.linear_conversation.forEach((item, index) => {
  const msg = item.message;
  if (!msg) return;
  const role = msg.author?.role;
  let text = '';
  if (msg.content?.parts) {
    text = msg.content.parts.map(p => typeof p === 'string' ? p : JSON.stringify(p)).join('\n');
  } else if (typeof msg.content === 'string') {
    text = msg.content;
  }
  if (role === 'user') {
    userTurns.push({ index, text: text.slice(0, 300) });
  }
});

console.log(`Total user turns: ${userTurns.length}`);
console.log(JSON.stringify(userTurns, null, 2));
