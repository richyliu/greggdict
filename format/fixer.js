const LOCALSTORAGE_KEY = 'format4';
const LOCALSTORAGE_SPELL_KEY = 'format4_spell';

/**
 * The current version of format4 JSON is stored in local storage. Occasionaly
 * it is backed up. This function would load format4 from the filesystem and
 * overwrite whatever is in local storage.
 */
function overwriteLocalStorage() {
  if (confirm('Are you sure you want to overwrite local storage?')) {
    console.log('overwriting...');
    fetch('./format4/format.json')
      .then(res => res.json())
      .then(pages => {
        savePages(pages);

        return fetch('./format4/need_to_be_fixed');
      })
      .then(res => res.text())
      .then(spell => {
        localStorage.setItem(LOCALSTORAGE_SPELL_KEY, spell);
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

  let isChanged = false;

  // curried function to update the page
  const pageChanger = newPage => {
    isChanged = true;
    pages[pageNum] = newPage;
  };

  // save the changes if necessary and go to the next page
  document.getElementById('save-and-next').onclick = () => {
    if (isChanged) savePages(pages);
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
    a.download = `format4.json`;

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // keyboard shortcuts
  document.onkeyup = e => {
    switch (e.key) {
      case 'Enter':
        document.getElementById('save-and-next').click();
        break;
      case 'ArrowLeft':
        document.getElementById('prev').click();
        break;
      case 'ArrowRight':
        document.getElementById('next').click();
        break;
    }
  };

  showPage(pages[pageNum], pageChanger);
}

function showPage(thePage, pageChanger) {
  // be careful, we need to keep the pointer to the page
  const page = thePage;

  const imgFile = `./pages/${(Number(page.file) - 1 + '').padStart(
    3,
    '0'
  )}.png`;
  document.getElementById('img').src = imgFile;

  document.getElementById('file').innerHTML = `File: ${page.file}`;

  // spelling errors relevant to this file
  const allSpell = localStorage.getItem(LOCALSTORAGE_SPELL_KEY).split('\n');
  const spell = allSpell.filter(
    s => page.words.filter(w => w.t === s).length === 1
  );
  document.getElementById('errors').innerHTML =
    spell.length === 0 ? '' : spell.length;

  const overlay = document.getElementById('overlay');
  page.words.forEach((word, i) => {
    const isError = spell.includes(word.t);

    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (isError) dot.classList.add('red');
    dot.style.top = word.y;
    dot.style.left = word.x;
    overlay.appendChild(dot);

    if (isError) {
      const text = document.createElement('button');
      text.classList.add('text');
      text.style.top = word.y + 10;
      text.style.left = word.x;
      text.innerHTML = word.t;
      text.onclick = () => {
        // prompt user to fix the word
        const newText = prompt('New text', word.t);
        if (newText === null || newText.length === 0) return;

        // update it locally
        page.words[i].t = newText;
        // update the text on screen
        text.innerHTML = newText;
        // propagate changes to local storage
        pageChanger(page);
      };
      overlay.appendChild(text);
      text.scrollIntoView();
    }
  });
}

if (window.location.search.indexOf('?n=') < 0) window.location.search = '?n=0';
main(Number(window.location.search.slice(3)));
