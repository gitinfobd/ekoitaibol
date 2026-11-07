const fs = require('fs');

const html = fs.readFileSync('e:/ekoitaibol/chatgpt_share.html', 'utf8');
const scriptMatches = [...html.matchAll(/<script[^>]*>(.*?)<\/script>/gs)];

for (let i = 0; i < scriptMatches.length; i++) {
  const content = scriptMatches[i][1];
  // check if it has Bangla or specific phrases
  if (content.includes('ekoitaibol') || content.includes('মডেল') || content.includes('আইডিয়া') || content.includes('message') || content.includes('conversation')) {
    console.log(`Script ${i}: length ${content.length}`);
    // Check if JSON
    try {
      const parsed = JSON.parse(content);
      console.log(`Script ${i} is valid JSON! Top keys:`, Object.keys(parsed));
      fs.writeFileSync(`e:/ekoitaibol/script_${i}_parsed.json`, JSON.stringify(parsed, null, 2));
    } catch (e) {
      // Find where "আইডিয়া" or Bangla appears
      const idx = content.indexOf('আইডিয়া');
      if (idx !== -1) {
        console.log(`Script ${i} contains Bangla at ${idx}:`, content.slice(Math.max(0, idx - 100), idx + 200));
      }
    }
  }
}
