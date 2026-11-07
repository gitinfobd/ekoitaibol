const fs = require('fs');

const html = fs.readFileSync('e:/ekoitaibol/chatgpt_share.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script[^>]*>(.*?)<\/script>/gs)];
const s8 = scriptMatches[8][1];
fs.writeFileSync('e:/ekoitaibol/script8_full.txt', s8);

console.log('Script 8 length:', s8.length);
console.log('Script 8 preview:', s8.slice(0, 500));
