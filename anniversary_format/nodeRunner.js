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
    result = result.map(toSingleCoordinate);
    all[jsonFile] = result;
  }

  await fs.writeFile('parsed.json', JSON.stringify(all));
}

// average the left bounding side from the left 2 vertices and floor the result
function toSingleCoordinate({ text, vertices }) {
  let x = Math.floor((vertices[0].x + vertices[3].x) / 2);
  let y = Math.floor((vertices[0].y + vertices[3].y) / 2);
  return { text, x, y };
}

main()
  .then(() => console.log('Done.'))
  .catch(e => console.log('Error in main:', e));
