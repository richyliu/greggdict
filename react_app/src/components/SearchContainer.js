import React, { useEffect, useState, useMemo } from 'react';

import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';
import { assetsRoot } from '../settings';

const SearchContainer = ({
  onSelectWord,
  seriesList,
  curSeries,
  setSeries,
}) => {
  // list of words with the corresponding page number
  const [words, setWords] = useState([]);

  // get the reference dictionary for the series
  useEffect(() => {
    let canceled = false;

    fetch(`${assetsRoot}/${curSeries}/reference.json`)
      .then(res => {
        if (res.ok) return res.json();
        else {
          alert('Could not get the dictionary. Please report this error');
          throw new Error(
            `Could not get reference json for assetsRoot: ${assetsRoot} and series: ${curSeries}. Error: ${res.statusText}`
          );
        }
      })
      .then(reference => {
        if (!canceled)
          setWords(
            reference.flatMap(p => p.words.map(w => ({ ...w, page: p.page })))
          );
      })
      .catch(e => {
        alert('Network error. Are you offline?');
        throw new Error(e);
      });

    return () => (canceled = true);
  }, [curSeries]);

  const [str, setStr] = useState('');

  // find suggestions by matching start of search string with the words
  const sugs =
    str.length === 0
      ? null
      : words.filter(w => w.t.toLowerCase().startsWith(str.toLowerCase()));

  // the suggestion item that is currently selected (on desktop)
  const [sel, setSel] = useState(0);
  // reset selection back to 0 when the search string changes
  useEffect(() => setSel(0), [str]);

  function selectWord(word) {
    setStr('');
    onSelectWord(word);
  }

  return (
    <div className="my-4 text-lg relative">
      <SearchInput
        value={str}
        onChange={setStr}
        onEnter={() => sugs && sugs[sel] && selectWord(sugs[sel])}
        onArrowDown={() => sel < sugs.length - 1 && setSel(sel + 1)}
        onArrowUp={() => sel > 0 && setSel(sel - 1)}
        series={seriesList}
        curSeries={curSeries}
        onChooseSeries={setSeries}
      />
      <SearchSuggestions
        suggestions={sugs}
        onClick={selectWord}
        selected={sel}
      />
    </div>
  );
};

export default SearchContainer;
