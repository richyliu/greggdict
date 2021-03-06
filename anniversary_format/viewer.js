const INITIAL_IMG = 182;
const DISPLAY_WIDTH = 800;

const parseData = require('./index.js');

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

// switch between pages with arrow keys
let curImg = INITIAL_IMG;
function loadPage() {
  loadImage(`images/p${('' + curImg).padStart(3, '0')}.png`);
}
document.body.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') {
    curImg++;
    loadPage();
  } else if (e.key === 'ArrowLeft') {
    if (curImg > 0) curImg--;
    loadPage();
  }
});
loadPage();

function loadImage(img) {
  let pageName = img.slice(-7, -4);
  let dataUrl = `output/p${pageName}.json`;

  // clear text and canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  document.querySelectorAll('.text-overlay').forEach(el => el.remove());
  document.querySelectorAll('.page-info').forEach(el => el.remove());

  // load the image
  let imageEl = document.querySelector('#img');
  imageEl.src = img;
  imageEl.onload = e => {
    // resize the canvas accordingly
    let scale = DISPLAY_WIDTH / imageEl.naturalWidth;
    canvas.width = DISPLAY_WIDTH;
    canvas.height = imageEl.naturalHeight * scale;
    imageEl.style.width = DISPLAY_WIDTH + 'px';

    fetch(dataUrl)
      .then(r => r.json())
      .then(d => parseData(d))
      .then(d => {
        main(d, scale);

        // draw page number info
        let s = document.createElement('span');
        s.classList.add('page-info');
        s.innerHTML = `Page: ${pageName}; total: ${d.length}`;
        s.style.position = 'absolute';
        s.style.font = 70 * scale + 'px Arial';
        s.style.top = 150 * scale + 'px';
        s.style.left = 200 * scale + 'px';
        s.style.zIndex = 20;
        document.body.appendChild(s);
      })
      .catch(e => {
        console.error('Fetch or parse image error', e);
      });
  };
}

function main(data, scale) {
  data.forEach(({ text }) =>
    text.split('').forEach(c => {
      if (c.charCodeAt(0) > 127)
        console.log(
          `[viewer.js]: non ascii: "${c}" in "${text}", code: 0x${c
            .charCodeAt(0)
            .toString(16)
            .padStart(4, '0')}`
        );
    })
  );

  // multiply all vertices by scale
  data = data.map(d => ({
    ...d,
    vertices: d.vertices.map(v => ({ x: v.x * scale, y: v.y * scale })),
  }));

  function draw() {
    let i = 0;
    for (let d of data) {
      // draw yellow rectangle to cover word
      ctx.fillStyle = 'hsla(60, 90%, 80%, 0.9)';
      if (
        // make the rectangle blue if there are nonascii characters
        d.text.split('').some(c => c.charCodeAt(0) > 127)
      ) {
        ctx.fillStyle = 'hsla(180, 90%, 70%, 0.9)';
      }
      linePoly(ctx, d.vertices);
      ctx.fill();

      // put pink dots at the corners of the bounding box
      for (let v of d.vertices) {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = 'green';
        ctx.fill();
      }

      // draw a blue number for each text
      ctx.fillStyle = 'blue';
      ctx.font = 40 * scale + 'px Georgia';
      ctx.fillText(i, d.vertices[0].x, d.vertices[0].y - 10 * scale);

      // make a dark red span overlay for the scanned text itself
      let s = document.createElement('span');
      s.classList.add('text-overlay');
      s.innerHTML = ' ' + d.text;
      s.style.position = 'absolute';
      s.style.font = 66 * scale + 'px Georgia';
      s.style.color = 'maroon';
      // center the text in the scanned bounding box
      s.style.top =
        Math.floor((d.vertices[0].y + d.vertices[3].y) / 2 - (66 * scale) / 2) +
        'px';
      s.style.left = d.vertices[0].x + 'px';
      s.style.zIndex = 20;
      document.body.appendChild(s);

      i++;
    }
  }

  draw();

  // remove overlay when pressing q key
  document.body.onkeydown = e => {
    if (e.key !== 'q') return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    document.querySelectorAll('.text-overlay').forEach(el => el.remove());
  };
  // redraw it on key up
  document.body.onkeyup = e => {
    if (e.key !== 'q') return;
    draw();
  };
}

// Draws a polygon to ctx with vertices in the list
function linePoly(ctx, vertices) {
  if (vertices.length < 3) {
    throw new Error('At least 3 vertices needed for linePoly');
  }

  let start = vertices[0];
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  for (let v of vertices) {
    ctx.lineTo(v.x, v.y);
  }
  ctx.closePath();
}
