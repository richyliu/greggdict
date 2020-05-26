const LOCALSTORAGE_KEY = 'format2';

function main() {
  fetch('./format3/format.json')
    .then(res => res.json())
    .then(pages => {
      document.getElementById('search').onkeydown = e => {
        if (e.key === 'Enter') {
          const search = e.target.value;
          for (page of pages) {
            for (word of page.words) {
              if (word.t.toLowerCase() === search.toLowerCase()) {
                document.getElementById('search').value = '';
                showPage(page, word.t);
                return;
              }
            }
          }
          alert('Word not found')
        }
      };
      showPage(pages[0]);
    });
}

function showPage(page, search) {
  const imgFile = `./pages/${(Number(page.file) - 1 + '').padStart(
    3,
    '0'
  )}.png`;
  document.getElementById('img').src = imgFile;

  document.getElementById('file').innerHTML = `File: ${page.file}`;

  const overlay = document.getElementById('overlay');
  overlay.innerHTML = '';
  page.words.forEach((word, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.style.top = word.y;
    dot.style.left = word.x;
    overlay.appendChild(dot);
    if (search === word.t) dot.scrollIntoView();

    const text = document.createElement('div');
    text.classList.add('text');
    text.style.top = word.y + 10;
    text.style.left = word.x;
    if (search === word.t) text.style.background = 'rgba(255, 0, 0, 0.4)';
    text.innerHTML = word.t;
    overlay.appendChild(text);
  });
}

main();

document.onclick = e => {
  document.getElementById('search').value = '';
  document.getElementById('search').focus();
};
