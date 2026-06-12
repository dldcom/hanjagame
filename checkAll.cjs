const fs = require('fs');
const https = require('https');
const data = fs.readFileSync('src/data/hanjaData.js', 'utf8');
const matches = data.match(/char: '([^']+)'/g).map(m => m.split("'")[1]);
matches.forEach(char => {
  https.get('https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/' + encodeURIComponent(char) + '.json', res => {
    if (res.statusCode !== 200) console.log(char, res.statusCode);
  });
});
