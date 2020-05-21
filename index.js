// put the page num in search like so: ?n=23
const num = Number(window.location.search.slice(3));
// good tests: 120 (missing "grounded"), 180, 270, 289
// letter pages should have 81, the rest have 93

const PAGE_WIDTH = 1250;

const canvas = document.getElementById('main');
const context = canvas.getContext('2d');

const image = new Image();
image.onload = function() {
  context.drawImage(image, 0, 0);
  loadOverlay();
};
image.src = `./pages_bkup/${(num - 1 + '').padStart(3, '0')}.jpg`;

function loadOverlay() {
  fetch(`./simplified_final/${(num + '').padStart(3, '0')}.json`)
    .then(r => r.json())
    .then(data => {
      res = data.responses[0];

      // drawFullTextAnnotations(res.fullTextAnnotation);
      const filtered = histFilter(
        // remove the first entry and remove the page number
        res.textAnnotations
          .slice(1)
          .filter(a => !/^\d{2,3}$/.test(a.description))
      );
      // console.log('total', filtered.length);
      drawTextAnnotations(filtered);
      // drawTextAnnotations(res.textAnnotations.slice(1));
    });
}

function drawBoundingBox(v) {
  line(v[0].x, v[0].y, v[1].x, v[1].y);
  line(v[2].x, v[2].y, v[1].x, v[1].y);
  line(v[2].x, v[2].y, v[3].x, v[3].y);
  line(v[0].x, v[0].y, v[3].x, v[3].y);
}

function line(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

function drawTextAnnotations(textAnnotations) {
  context.save();
  context.fillStyle = 'white';
  context.strokeStyle = 'purple';
  textAnnotations.forEach(
    ({ boundingPoly: { vertices: v }, description: text }) => {
      context.font = '30px Arial';
      context.fillText(text, v[3].x, v[3].y);
      drawBoundingBox(v);
    }
  );
  context.restore();
}

function drawFullTextAnnotations(fullTextAnnotation) {
  context.save();
  context.fillStyle = 'blue';
  context.strokeStyle = 'blue';
  fullTextAnnotation.pages.forEach(page =>
    page.blocks.forEach(block =>
      block.paragraphs.forEach(paragraph =>
        paragraph.words.forEach(word =>
          word.symbols.forEach(({ boundingBox, description: text }) => {
            if (!boundingBox) return;
            const v = boundingBox.vertices;
            // context.fillText(text, v[3].x, v[3].y);
            drawBoundingBox(v);
          })
        )
      )
    )
  );
  context.restore();
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

  context.save();
  topThree.forEach(t => {
    context.strokeStyle = 'green';
    line(t.pos, 0, t.pos, 1947);
    line(t.pos + PAGE_WIDTH / BUCKETS, 0, t.pos + PAGE_WIDTH / BUCKETS, 1947);
    context.strokeStyle = 'blue';
    line(t.pos - RIGHT_OFFSET, 0, t.pos - RIGHT_OFFSET, 1947);
    line(t.pos + RIGHT_OFFSET, 0, t.pos + RIGHT_OFFSET, 1947);
  });
  context.restore();

  /**
   * Filter all the text for ones that have a lower line (made up of the bottom
   * 2 corners of the bounding box) that intersects one of the 3 lines.
   * The 3 lines are the 3 columns of the text.
   * RIGHT_OFFSET is added to the x position to shift it left slightly.
   */
  return topThree.flatMap(({ pos }, i) => {
    const filtered = textAnnotations.filter(
      ({ boundingPoly: { vertices: v } }) =>
        v[2].x > pos + RIGHT_OFFSET && v[3].x < pos + RIGHT_OFFSET
    );
    // log words that surpass the RIGHT_OFFSET to the left (most likely erroneous)
    filtered.forEach(({ boundingPoly: { vertices: v }, description: text }) => {
      if (v[2].x > pos - RIGHT_OFFSET && v[3].x < pos - RIGHT_OFFSET) {
        console.warn(text);
        console.count('left_erroneous');
      }
    });
    return filtered;
  });
}
