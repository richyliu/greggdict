const fs = require('fs');
const { histFilter } = require('./main');
const confusables = require('./confusables.json');

const FROM = 13;
// const FROM = 74;
// const TOTAL = 292;
const TOTAL = 323;
// const TOTAL = 3;

const rawFiles = Array(TOTAL)
  .fill(0)
  .map((_, i) => i + FROM)
  .filter(i => i !== 305 && i !== 306)
  .map(a => (a + '').padStart(3, '0'))
  .map(n => `./simplified_final/${n}.json`);

/* MAIN */
// parseFiles(rawFiles);
moveToFormat2(rawFiles);

function parseFiles(files) {
  let all = [];

  files.forEach(file =>
    fs.readFile(file, 'utf-8', (err, raw) => {
      data = JSON.parse(raw);
      res = data.responses[0];
      const { filtered, errors } = histFilter(
        res.textAnnotations,
        undefined,
        confusables
      );
      all.push({
        file,
        total: filtered.length,
        desc:
          res.textAnnotations[0].description
            .slice(0, 10)
            .replace(/\n/g, ' ')
            .slice(0, 5) + '...',
        errors,
        words: filtered.map(a => a.description),
      });
      if (all.length == files.length) logAll();
    })
  );

  function logAll() {
    all
      .sort((a, b) => a.file.localeCompare(b.file))
      .forEach(({ file, total, desc, errors }) =>
        console.log(
          file.slice(-8),
          total,
          (total === 93 || total === 81) &&
            errors.filter(e => e.fixed === undefined).length === 0
            ? 'P'
            : ' ',
          // `'${desc}'`,
          errors.filter(e => e.fixed !== undefined).length,
          errors.filter(e => e.fixed === undefined).length
        )
      );
    console.log(
      'FIXED ERRORS:',
      all
        .map(a => a.errors.filter(e => e.fixed !== undefined).length)
        .reduce((a, b) => a + b, 0)
    );
    console.log(
      'UNFIXED DUE TO FIRST/LAST ERRORS:',
      all
        .map(
          a =>
            a.errors.filter(
              e => e.fixed === undefined && e.unfixed === 'first or last word'
            ).length
        )
        .reduce((a, b) => a + b, 0)
    );
    console.log(
      'UNFIXED DUE TO UNABLE TO BE FIXED:',
      all
        .map(
          a =>
            a.errors.filter(
              e => e.fixed === undefined && e.unfixed === 'unable to fix'
            ).length
        )
        .reduce((a, b) => a + b, 0)
    );
    console.log(
      'PERFECTS 93',
      all
        .map(a =>
          a.total === 93 &&
          a.errors.filter(e => e.fixed === undefined).length === 0
            ? 1
            : 0
        )
        .reduce((a, b) => a + b, 0)
    );
    console.log(
      'PERFECTS 81',
      all
        .map(a =>
          a.total === 81 &&
          a.errors.filter(e => e.fixed === undefined).length === 0
            ? 1
            : 0
        )
        .reduce((a, b) => a + b, 0)
    );
    console.log(
      'PERFECTS 94',
      all
        .map(a =>
          a.total === 94 &&
          a.errors.filter(e => e.fixed === undefined).length === 0
            ? 1
            : 0
        )
        .reduce((a, b) => a + b, 0)
    );
    console.log(
      'NUMBER COUNT ERROR (NOT 93, 94, OR 81)',
      all
        .map(a => (a.total !== 93 && a.total !== 94 && a.total !== 81 ? 1 : 0))
        .reduce((a, b) => a + b, 0)
    );
    console.log(
      'HAVE UNFIXED ERRORS',
      all
        .map(a =>
          a.errors.filter(e => e.fixed === undefined).length > 0 ? 1 : 0
        )
        .reduce((a, b) => a + b, 0)
    );
    // all
    //   .sort((a, b) => a.file.localeCompare(b.file))
    //   .map(a => a.words.sort())
    //   .flat()
    //   .forEach(w => console.log(w));
  }
}

// change the JSON to a new one with most of the things fixed
function moveToFormat2(files) {
  let all = [];

  files.forEach(file =>
    fs.readFile(file, 'utf-8', (err, raw) => {
      data = JSON.parse(raw);
      res = data.responses[0];
      const { filtered, errors, columns } = histFilter(
        res.textAnnotations,
        undefined,
        confusables
      );
      all.push({
        file: file.slice(-8, -5),
        cols: columns,
        errs: errors,
        words: filtered
          .map(f => f.processed)
          .map(a => ({ t: a.text, x: a.x, y: a.y })),
      });
      if (all.length == files.length) writeAll();
    })
  );

  function writeAll() {
    // sort files by file name
    const sorted = all.sort((a, b) => a.file.localeCompare(b.file));
    // truncate float to 3 decimal places
    let data = JSON.stringify(sorted, (key, val) =>
      val.toFixed ? Number(val.toFixed(1)) : val
    );

    fs.writeFileSync(`./format2_${new Date().toISOString()}.json`, data);
  }
}
