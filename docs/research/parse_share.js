const fs = require('fs');

try {
  const html = fs.readFileSync('e:/ekoitaibol/chatgpt_share.html', 'utf8');
  console.log('HTML size:', html.length);
  
  // Look for JSON or title
  const titleMatch = html.match(/<title>(.*?)<\/title>/);
  if (titleMatch) console.log('Title:', titleMatch[1]);

  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
  if (match) {
    const data = JSON.parse(match[1]);
    fs.writeFileSync('e:/ekoitaibol/share_data.json', JSON.stringify(data, null, 2));
    console.log('Saved share_data.json');
  } else {
    // Check for remix or other embedded state
    console.log('No __NEXT_DATA__, scanning for window.__remixContext or other data...');
    const remixMatch = html.match(/window\.__remixContext\s*=\s*(.*?);<\/script>/s);
    if (remixMatch) {
      fs.writeFileSync('e:/ekoitaibol/remix_data.js', remixMatch[1]);
      console.log('Found remix context');
    } else {
      // Find script tags with JSON
      const scriptMatches = [...html.matchAll(/<script[^>]*>(.*?)<\/script>/gs)];
      console.log(`Found ${scriptMatches.length} script tags.`);
      for (let i = 0; i < scriptMatches.length; i++) {
        const content = scriptMatches[i][1];
        if (content.includes('serverResponse') || content.includes('linearConversation') || content.includes('mapping') || content.includes('message')) {
          console.log(`Script ${i} has keywords, length: ${content.length}`);
          fs.writeFileSync(`e:/ekoitaibol/script_${i}.txt`, content.slice(0, 100000));
        }
      }
    }
  }
} catch (err) {
  console.error('Error:', err);
}
