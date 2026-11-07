const fs = require('fs');

const streamArray = JSON.parse(fs.readFileSync('e:/ekoitaibol/streamArray.json', 'utf8'));

function resolve(idx, seen = new Map()) {
  if (seen.has(idx)) return '[Circular to ' + idx + ']';
  const val = streamArray[idx];
  if (val === undefined || val === null || typeof val !== 'object') {
    return val;
  }
  if (Array.isArray(val)) {
    const arr = [];
    seen.set(idx, arr);
    for (let el of val) {
      if (typeof el === 'number' && el >= 0 && el < streamArray.length) {
        arr.push(resolve(el, seen));
      } else {
        arr.push(el);
      }
    }
    return arr;
  }
  const obj = {};
  seen.set(idx, obj);
  for (let [k, v] of Object.entries(val)) {
    let resolvedKey = k;
    let resolvedVal = v;
    if (k.startsWith('_')) {
      const keyIdx = parseInt(k.slice(1));
      resolvedKey = streamArray[keyIdx];
    }
    if (typeof v === 'number' && v >= 0 && v < streamArray.length) {
      resolvedVal = resolve(v, seen);
    }
    obj[resolvedKey] = resolvedVal;
  }
  return obj;
}

const root = resolve(0);
console.log('Root keys:', Object.keys(root));

// Find sharedConversation or serverResponse
function findKey(obj, targetKey, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 10) return null;
  if (obj[targetKey]) return obj[targetKey];
  for (let k of Object.keys(obj)) {
    const res = findKey(obj[k], targetKey, depth + 1);
    if (res) return res;
  }
  return null;
}

const serverResponse = findKey(root, 'serverResponse');
if (serverResponse) {
  console.log('Found serverResponse keys:', Object.keys(serverResponse));
  fs.writeFileSync('e:/ekoitaibol/serverResponse.json', JSON.stringify(serverResponse, null, 2));
} else {
  console.log('serverResponse not found directly, dumping root keys depth 2:');
  for (let k of Object.keys(root)) {
    console.log(k, typeof root[k], root[k] && typeof root[k] === 'object' ? Object.keys(root[k]) : '');
  }
}
