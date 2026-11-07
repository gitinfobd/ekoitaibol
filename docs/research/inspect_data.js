const fs = require('fs');

const serverResponse = JSON.parse(fs.readFileSync('e:/ekoitaibol/serverResponse.json', 'utf8'));
const data = serverResponse.data;
console.log('data keys:', Object.keys(data));
console.log('title:', data.title);

// Let's inspect linearConversation or mapping
if (data.linear_conversation) {
  console.log('linear_conversation length:', data.linear_conversation.length);
  const conv = data.linear_conversation.map(item => {
    return {
      id: item.id,
      role: item.message?.author?.role || item.role,
      content: item.message?.content?.parts || item.content
    };
  });
  fs.writeFileSync('e:/ekoitaibol/conversation.json', JSON.stringify(conv, null, 2));
} else {
  // Let's inspect data
  fs.writeFileSync('e:/ekoitaibol/data_summary.json', JSON.stringify(data, null, 2));
}
