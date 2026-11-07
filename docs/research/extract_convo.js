const fs = require('fs');

const s8 = fs.readFileSync('e:/ekoitaibol/script8_full.txt', 'utf8');
const match = s8.match(/window\.__reactRouterContext\.streamController\.enqueue\(([\s\S]*)\);?\s*$/);
let str = match[1].trim();
if (str.endsWith(');')) str = str.slice(0, -2);
else if (str.endsWith(')')) str = str.slice(0, -1);

const rawData = JSON.parse(str);
console.log('Unescaped string length:', rawData.length);

// Now parse rawData as JSON
const streamArray = JSON.parse(rawData);
console.log('Stream array length:', streamArray.length);

// Save full stream array
fs.writeFileSync('e:/ekoitaibol/streamArray.json', JSON.stringify(streamArray, null, 2));

// In turbo-stream format, array elements reference each other by index.
// Let's find objects that have 'author', 'content', 'create_time', 'parts', or search for role / text
const messages = [];

// Search streamArray for text that has author role or parts
for (let i = 0; i < streamArray.length; i++) {
  const item = streamArray[i];
  if (item && typeof item === 'object') {
    if (item.author !== undefined || (item.role !== undefined && item.content !== undefined)) {
      messages.push({ index: i, item });
    }
  }
}
console.log('Found potential message objects:', messages.length);

// Let's also look for strings that are markdown or conversation turns
const allStrings = [];
for (let i = 0; i < streamArray.length; i++) {
  const it = streamArray[i];
  if (typeof it === 'string' && it.length > 50) {
    allStrings.push({ index: i, text: it });
  }
}
console.log('Found long strings:', allStrings.length);
fs.writeFileSync('e:/ekoitaibol/long_strings.json', JSON.stringify(allStrings, null, 2));

