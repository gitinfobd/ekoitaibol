const fs = require('fs');

const s8 = fs.readFileSync('e:/ekoitaibol/script8_full.txt', 'utf8');

// Find all enqueue calls
const parts = s8.split('window.__reactRouterContext.streamController.enqueue(');
console.log('Number of enqueue parts:', parts.length);

for (let i = 1; i < parts.length; i++) {
  // Find matching closing paren
  console.log(`Part ${i} starts with:`, parts[i].slice(0, 100));
}
