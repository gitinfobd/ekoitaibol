const fs = require('fs');

const html = fs.readFileSync('e:/ekoitaibol/chatgpt_share.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script[^>]*>(.*?)<\/script>/gs)];

// Let's check Script 3
const s3 = scriptMatches[3][1];
fs.writeFileSync('e:/ekoitaibol/script3_full.js', s3);

// Search for JSON or text inside s3
console.log('Script 3 start:', s3.slice(0, 300));

// Let's also search for all occurrences of Bangla text or message text in HTML
// Let's find JSON blocks
