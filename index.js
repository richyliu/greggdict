// go to page 13 by default
if (window.location.search.indexOf('?n=') < 0) window.location.search = '?n=13';

document.getElementById('pageNum').innerHTML = window.location.search.slice(3);

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

      const { filtered, errors, columns } = histFilter(res.textAnnotations)//, context);
      const processed = filtered.map(f => f.processed);
      drawDone(processed, columns, errors);
      // drawTextAnnotations(filtered);
      // drawFullTextAnnotations(res.fullTextAnnotation);
    });
}

function drawBoundingBox(v) {
  context.beginPath();
  context.moveTo(v[0].x, v[0].y);
  context.lineTo(v[1].x, v[1].y);
  context.lineTo(v[2].x, v[2].y);
  context.lineTo(v[3].x, v[3].y);
  context.closePath();
  // TODO: not a todo, but this can be changed to stroke for just an outline
  context.fill();
  // context.stroke();
}

function drawTextAnnotations(textAnnotations) {
  context.save();
  context.strokeStyle = 'purple';
  context.font = '30px Arial';
  textAnnotations.forEach(
    ({ boundingPoly: { vertices: v }, description: text }) => {
      context.fillStyle = 'rgba(0, 0, 0, 0.5)';
      drawBoundingBox(v);
      context.fillStyle = 'white';
      context.fillText(text, v[3].x, v[3].y);
    }
  );
  context.restore();
}

function drawFullTextAnnotations(fullTextAnnotation) {
  context.save();
  context.fillStyle = 'white';
  context.strokeStyle = 'blue';
  context.font = '30px Arial';
  fullTextAnnotation.pages.forEach(page =>
    page.blocks.forEach(block =>
      block.paragraphs.forEach(paragraph =>
        paragraph.words.forEach(word =>
          word.symbols.forEach(({ boundingBox, text }) => {
            if (!boundingBox) return;
            const v = boundingBox.vertices;
            context.fillText(text, v[3].x, v[3].y);
            drawBoundingBox(v);
          })
        )
      )
    )
  );
  context.restore();
}

function drawDone(processed, columns, errors) {
  context.save();
  context.font = '30px Helvetica';

  if (columns[0] === 27) context.fillStyle = 'orange';
  else if (columns[0] === 31) context.fillStyle = 'gray';
  else context.fillStyle = 'red';
  context.fillText(columns[0], 150, 100);

  if (columns[1] === 27) context.fillStyle = 'orange';
  else if (columns[1] === 31) context.fillStyle = 'gray';
  else context.fillStyle = 'red';
  context.fillText(columns[1], 500, 100);

  if (columns[2] === 27) context.fillStyle = 'orange';
  else if (columns[2] === 31) context.fillStyle = 'gray';
  else context.fillStyle = 'red';
  context.fillText(columns[2], 900, 100);

  let numFixed = errors.filter(e => e.fixed).length;
  let numUnfixed = errors.filter(e => !e.fixed).length;
  context.fillStyle = numFixed === 0 ? 'gray' : 'green';
  context.fillText('Fixed: ' + numFixed, 150, 50);
  context.fillStyle = numUnfixed === 0 ? 'gray' : 'red';
  context.fillText('Unfixed: ' + numUnfixed, 300, 50);

  if (
    columns[0] === columns[1] &&
    columns[1] === columns[2] &&
    columns[2] === 31 &&
    errors.length === 0
  ) {
    context.fillStyle = 'blue';
    context.fillText('Perfect', 30, 50);
  }

  processed.forEach(p => {
    context.beginPath();
    if (p.error) {
      context.fillStyle = p.error.fixed ? 'green' : 'red';
      context.arc(p.x, p.y, 8, 0, 2 * Math.PI);
    } else {
      context.fillStyle = 'purple';
      context.arc(p.x, p.y, 5, 0, 2 * Math.PI);
    }

    context.fill();
    context.fillStyle = p.error ? 'blue' : 'gray';
    context.fillText(p.text, p.x, p.y + 35);
  });

  context.restore();
}
