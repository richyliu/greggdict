const fs = require('fs/promises');
const parseData = require('./index.js');
const ignorePages = require('./ignorePages.js');

const JSON_DIR = './output';

async function main() {
  let jsonFileNames = await fs.readdir(JSON_DIR);
  let all = {};

  for (let jsonFile of jsonFileNames) {
    let rawJson = await fs.readFile(`${JSON_DIR}/${jsonFile}`);
    let result = parseData(JSON.parse(rawJson));
    console.log(jsonFile, result.length);
    all[jsonFile] = result;
  }

  await fs.writeFile('parsed.json', JSON.stringify(all));
}

main()
  .then(() => console.log('Done.'))
  .catch(e => console.log('Error in main:', e));
