/**
 * Checks a file for words that are not a English phrase and prints them
 */

const https = require('https');
const fs = require('fs');

// Checks if the list of phrases are valid phrases by using the PhraseFinder
// API to see if the phrase returns any results
function checkPhrases(phrases, callback) {
  const postData = JSON.stringify({
    corpus: 'eng-us',
    topk: 1,
    batch: phrases.map(p => ({ query: p })),
  });

  const options = {
    hostname: 'api.phrasefinder.io',
    port: 443,
    path: '/batch',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length,
      'X-API-Key': '72d6c141ee8e16f4e6a24c6c5d72e40aa239b515',
    },
  };

  const req = https.request(options, res => {
    let result = '';

    // the results are guaranteed to be received in order (from the API)
    // multiple results may be bundled together
    res.on('data', buffer => {
      result += buffer.toString('utf-8');
    });

    res.on('end', () => {
      // we only care about lines that start with 'OK'
      const isPhrases = result
        .split('\n')
        // the response starts with 'OK 0 ...' or 'OK 1 ...'
        .filter(line => line.startsWith('OK '))
        // if the 4th character is 1, that means it was a phrase
        .map(line => line.slice(3, 4) === '1');

      callback(isPhrases);
    });
  });
  req.on('error', e => {
    console.error(e);
  });
  req.write(postData);
  req.end();
}

function main(file) {
  fs.readFile(file, 'utf-8', (err, raw) => {
    if (err) {
      console.error(err);
      return;
    }

    const ascii = /^[ -~]+$/;
    const words = raw.split('\n').filter(w => ascii.test(w));
    const nonAscii = raw
      .split('\n')
      .filter(w => !ascii.test(w) && w.length > 1);

    const chunkSize = 100;
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize);
      checkPhrases(chunk, isPhrases =>
        // filter out the words that are not phrases
        isPhrases
          .map((p, idx) => ({ p, word: chunk[idx] }))
          .filter(({ p }) => !p)
          .map(({ word }) => word)
          .forEach(word => console.log(word))
      );
    }
    nonAscii.forEach(word => console.log(word));
  });
}

if (process.argv.length !== 3)
  console.log('Usage: node phrasechecker.js PHRASE_FILE');
else main(process.argv[2]);
