const fs = require('fs');

const PAGE_WIDTH = 1250;

const FROM = 13;
const TOTAL = 292;
// const TOTAL = 3;

parseFiles(
  Array(TOTAL)
    .fill(0)
    .map((_, i) => i + FROM)
    .map(a => (a + '').padStart(3, '0'))
    .map(n => `./simplified_final/${n}.json`)
);

function parseFiles(files) {
  let all = [];

  files.forEach(file =>
    fs.readFile(file, 'utf-8', (err, raw) => {
      data = JSON.parse(raw);
      res = data.responses[0];

      const { filtered, errors } = histFilter(
        // remove the first entry and remove the page number
        res.textAnnotations
          .slice(1)
          .filter(a => !/^\d{2,3}$/.test(a.description))
      );
      all.push({
        file,
        total: filtered.length,
        desc: res.textAnnotations[0].description
          .slice(0, 20)
          .replace(/\n/g, ' ')
          .slice(0, 10),
        errors,
        words: filtered.map(a => a.description),
      });
      if (all.length == TOTAL) logAll();
    })
  );

  function logAll() {
    // all
    //   .sort((a, b) => a.file.localeCompare(b.file))
    //   .forEach(({ file, total, desc, errors }) =>
    //     console.log(file, total, desc, errors)
    //   );
    all
      .sort((a, b) => a.file.localeCompare(b.file))
      .map(a => a.words.sort())
      .flat()
      .forEach(w => console.log(w));
  }
}

function histFilter(textAnnotations) {
  // get list of x coordinates of bottom left corners
  const vals = textAnnotations.map(t => t.boundingPoly.vertices[3].x);

  // number of histogram subdivisions
  const BUCKETS = 100;
  const hist = Array(BUCKETS).fill(0);

  // calculate the histogram
  vals.forEach(v => hist[Math.floor((v / PAGE_WIDTH) * BUCKETS)]++);

  // get the top three and their x positions
  const topThree = hist
    .map((a, i) => ({ pos: (i * PAGE_WIDTH) / BUCKETS, n: a }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 3);

  const RIGHT_OFFSET = 30;

  /**
   * Filter all the text for ones that have a lower line (made up of the bottom
   * 2 corners of the bounding box) that intersects one of the 3 lines.
   * The 3 lines are the 3 columns of the text.
   * RIGHT_OFFSET is added to the x position to shift it left slightly.
   */
  let errors = [];
  const filtered = topThree.flatMap(({ pos }, i) => {
    const done = textAnnotations.filter(
      ({ boundingPoly: { vertices: v } }) =>
        v[2].x > pos + RIGHT_OFFSET && v[3].x < pos + RIGHT_OFFSET
    );
    // log words that surpass the RIGHT_OFFSET to the left (most likely erroneous)
    done.forEach(({ boundingPoly: { vertices: v }, description: text }) => {
      if (v[2].x > pos - RIGHT_OFFSET && v[3].x < pos - RIGHT_OFFSET) {
        errors.push(text);
      }
    });
    return done;
  });

  return { filtered, errors };
}
