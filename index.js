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

      const { filtered, errors } = histFilter(res.textAnnotations, context);
      drawTextAnnotations(filtered);
      // drawFullTextAnnotations(res.fullTextAnnotation);
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
  context.font = '30px Arial';
  textAnnotations.forEach(
    ({ boundingPoly: { vertices: v }, description: text }) => {
      context.fillText(text, v[3].x, v[3].y);
      drawBoundingBox(v);
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
