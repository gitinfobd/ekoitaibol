const fs = require('fs');

const streamArray = JSON.parse(fs.readFileSync('e:/ekoitaibol/streamArray.json', 'utf8'));

// Let's decode turbo-stream:
// References can be numbers or objects with keys like _idx
function resolve(idx, seen = new Map()) {
  if (seen.has(idx)) return seen.get(idx);
  const val = streamArray[idx];
  if (val === undefined || val === null || typeof val !== 'object') {
    return val;
  }
  if (Array.isArray(val)) {
    const arr = [];
    seen.set(idx, arr);
    for (let el of val) {
      if (typeof el === 'number') {
        arr.push(resolve(el, seen));
      } else {
        arr.push(el);
      }
    }
    return arr;
  }
  // Object: entries are either normal keys or _keyNum: valNum
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

try {
  const root = resolve(0);
  fs.writeFileSync('e:/ekoitaibol/resolved_root.json', JSON.stringify(root, null, 2));
  console.log('Resolved root successfully! Top keys:', Object.keys(root));
} catch (e) {
  console.error('Resolve error:', e);
}
