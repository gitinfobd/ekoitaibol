const fs = require('fs');

const s3 = fs.readFileSync('e:/ekoitaibol/script3_full.js', 'utf8');
try {
  const data = JSON.parse(s3);
  console.log('Parsed successfully! Keys:', Object.keys(data));
  fs.writeFileSync('e:/ekoitaibol/parsed_s3.json', JSON.stringify(data, null, 2));
} catch (e) {
  console.log('Parse error:', e.message);
  // It might be window.__INITIAL_STATE__ or something or trailing semicolon
}
