const fs = require('fs');

const s8 = fs.readFileSync('e:/ekoitaibol/script8_full.txt', 'utf8');
const match = s8.match(/window\.__reactRouterContext\.streamController\.enqueue\(([\s\S]*)\);?\s*$/);
if (match) {
  let str = match[1].trim();
  if (str.endsWith(');')) str = str.slice(0, -2);
  else if (str.endsWith(')')) str = str.slice(0, -1);
  
  console.log('Total length:', str.length);
  console.log('Ends with:', str.slice(-100));

  // Let's inspect around position 30670
  try {
    JSON.parse(str);
    console.log('Parsed successfully!');
  } catch (e) {
    console.log('Error:', e.message);
    const pos = parseInt(e.message.match(/position (\d+)/)?.[1] || '0');
    console.log('Around error pos (' + pos + '):');
    console.log(JSON.stringify(str.slice(Math.max(0, pos - 50), pos + 50)));
  }
}
