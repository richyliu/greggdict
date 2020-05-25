const LOCALSTORAGE_KEY = 'format2';

/**
 * The current version of format2 JSON is stored in local storage. Occasionaly
 * it is backed up. This function would load format2 from the filesystem and
 * overwrite whatever is in local storage.
 */
function overwriteLocalStorage() {
  if (confirm('Are you sure you want to overwrite local storage?')) {
    console.log('overwriting...');
    fetch('./format3/format.json')
      .then(res => res.json())
      .then(pages => {
        savePages(pages);
        console.log('overwritten');
        window.location.reload();
      });
  }
}

function savePages(pages) {
  const compressed = LZString.compressToUTF16(JSON.stringify(pages));
  localStorage.setItem(LOCALSTORAGE_KEY, compressed);
}

function main(pageNum) {
  const rawData = localStorage.getItem(LOCALSTORAGE_KEY);
  const pages = JSON.parse(LZString.decompressFromUTF16(rawData));

  // curried function to update the page
  const pageChanger = newPage => {
    pages[pageNum] = newPage;
  };

  // save the changes and go to the next page
  document.getElementById('save-and-next').onclick = () => {
    // assume all errors are fixed
    pages[pageNum].errs = [];
    savePages(pages);
    window.location.search = '?n=' + (pageNum + 1);
  };

  document.getElementById('prev').onclick = () => {
    window.location.search = '?n=' + (pageNum - 1);
  };
  document.getElementById('next').onclick = () => {
    window.location.search = '?n=' + (pageNum + 1);
  };

  // download the file
  document.getElementById('download').onclick = () => {
    const text = JSON.stringify(pages);
    const blob = new Blob([text], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `format2.json`;

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // keyboard shortcuts
  document.onkeyup = e => {
    switch (e.key) {
      case 't':
        document.getElementById('save-and-next').click();
        break;
      case 'ArrowLeft':
        document.getElementById('prev').click();
        break;
      case 'ArrowRight':
      case 'a':
        document.getElementById('next').click();
        break;
    }
  };

  showPage(pages[pageNum], pageChanger);
}

function showPage(thePage, pageChanger) {
  // be careful, we need to keep the pointer to the page
  const page = thePage;

  // since the words are sorted, get the position of the columns from the
  // middle of each column
  const numWords = page.words.length;
  const colSize = Math.floor(numWords / 3);
  const halfColSize = Math.floor(numWords / 6);
  const columnsPos = [
    page.words[halfColSize].x,
    page.words[halfColSize + colSize].x,
    page.words[halfColSize + colSize * 2].x,
  ];

  const errs = page.errs;
  const imgFile = `./pages/${(Number(page.file) - 1 + '').padStart(
    3,
    '0'
  )}.png`;
  document.getElementById('img').src = imgFile;

  document.getElementById('file').innerHTML = `File: ${page.file}`;
  document.getElementById('errors').innerHTML = errs.filter(
    e => !e.fixed
  ).length;
  document.getElementById('fixed').innerHTML = errs.filter(e => e.fixed).length;
  page.cols.forEach((col, i) => {
    document.getElementById(`col-${i}`).innerHTML = col;
    if (col !== 31) document.getElementById(`col-${i}`).style.color = 'red';
    else document.getElementById(`col-${i}`).style.color = 'blue';
  });

  const overlay = document.getElementById('overlay');
  page.words.forEach((word, i) => {
    const err = errs.filter(e =>
      e.fixed ? e.fixed === word.t : e.original === word.t
    );
    const isError = err.length === 1;
    const isFixed = isError && err[0].fixed;

    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (isError) dot.classList.add(isFixed ? 'green' : 'red');
    dot.style.top = word.y;
    dot.style.left = word.x;
    overlay.appendChild(dot);

    const text = document.createElement('button');
    text.classList.add('text');
    if (!isError) text.classList.add('text-normal');
    text.style.top = word.y;
    text.style.left = word.x;
    if (isError) text.style.color = isFixed ? 'green' : 'red';
    text.innerHTML = word.t;
    text.onclick = () => {
      // prompt user to fix the word
      const newText = prompt('New text', word.t);
      if (newText === null) return;
      if (newText.length === 0) {
        // remove the text
        page.words.splice(i, 1);
        let col = -1;
        if (word.x === columnsPos[0]) col = 0;
        else if (word.x === columnsPos[1]) col = 1;
        else if (word.x === columnsPos[2]) col = 2;
        page.cols[col]--;

        text.innerHTML = 'REMOVED';
        // propagate changes
        pageChanger(page);
      } else {
        if (newText.split('').some(c => c.charCodeAt(0) > 125)) {
          alert('not ascii, rejected');
          return;
        }
        // update it locally
        page.words[i].t = newText;
        // update the text on screen
        text.innerHTML = newText;
        // propagate changes to local storage
        pageChanger(page);
      }
    };
    overlay.appendChild(text);
  });
}

if (window.location.search.indexOf('?n=') < 0) window.location.search = '?n=0';
main(Number(window.location.search.slice(3)));

document.onclick = e => {
  console.log(e.pageY);
};
