const https = require('https');
['直', '敎', '教', '校'].forEach(char => {
  https.get(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(char)}.json`, (res) => {
    console.log(char, res.statusCode);
  });
});
