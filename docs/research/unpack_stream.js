const fs = require('fs');

const s8 = fs.readFileSync('e:/ekoitaibol/script8_full.txt', 'utf8');

// The line is: window.__reactRouterContext.streamController.enqueue("...");
// Let's extract the argument to enqueue(...)
const match = s8.match(/window\.__reactRouterContext\.streamController\.enqueue\((.*?)\);/s);
if (match) {
  const arg = match[1];
  try {
    const rawData = JSON.parse(arg);
    console.log('Unquoted rawData string length:', rawData.length);
    // rawData itself is a JSON string of turbo-stream array!
    const streamArray = JSON.parse(rawData);
    console.log('Stream array length:', streamArray.length);
    fs.writeFileSync('e:/ekoitaibol/streamArray.json', JSON.stringify(streamArray, null, 2));

    // Let's filter all strings in streamArray that look like conversation messages or parts
    const textPieces = [];
    for (let item of streamArray) {
      if (typeof item === 'string' && item.length > 20) {
        textPieces.push(item);
      }
    }
    console.log(`Found ${textPieces.length} text pieces.`);
    fs.writeFileSync('e:/ekoitaibol/extracted_texts.json', JSON.stringify(textPieces, null, 2));
  } catch (e) {
    console.log('Error parsing enqueue argument:', e.message);
  }
} else {
  console.log('Match failed');
}
