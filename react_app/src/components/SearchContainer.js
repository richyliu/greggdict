import React, { useEffect, useState, useMemo, useRef } from 'react';

import Fuse from 'fuse.js';

import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';
import { dictRoot } from '../settings';

const SEARCH_LIMIT = 50;

const SearchContainer = ({
  onSelectWord,
  seriesList,
  curSeries,
  setSeries,
}) => {
  // list of words with the corresponding page number
  const [words, setWords] = useState([]);

  // cache reference dictionary to prevent unnecessary requests
  const cached = useRef({});

  // get the reference dictionary for the series
  useEffect(() => {
    if (cached.current[curSeries]) {
      setWords(cached.current[curSeries]);
    }

    const xhr = new XMLHttpRequest();

    // Setup our listener to process compeleted requests
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;

      if (xhr.status === 200) {
        const reference = JSON.parse(xhr.responseText);
        let response = (reference || []).flatMap(p =>
          p.words.map(w => ({ ...w, page: p.page }))
        );
        cached.current[curSeries] = response;
        setWords(response);
      } else {
        // status of 0 if request was aborted
        if (xhr.status === 0) return;

        alert(
          `Could not get the dictionary for ${curSeries}. This error has been automatically reported`
        );
        throw new Error(
          `Could not get reference json for dictRoot: ${dictRoot} and series: ${curSeries}`
        );
      }
    };
    xhr.open('GET', `${dictRoot}/${curSeries}/reference.json`);
    xhr.send();

    return () => xhr.abort();
  }, [curSeries]);

  const [str, setStr] = useState('');

  const fuse = useMemo(
    () =>
      new Fuse(words, {
        keys: ['t'],
        threshold: 0.2,
        useExtendedSearch: true,
      }),
    [words]
  );

  const [sugs, setSugs] = useState(null);

  useEffect(() => {
    let canceled = false;

    // no search string is different from no results
    if (str.length === 0) {
      setSugs(null);
      return;
    }

    // set a delay to prevent searching while user is typing quickly
    setTimeout(() => {
      if (canceled) return;

      setSugs(
        fuse
          .search(str)
          .map(a => a.item)
      );
    }, 200);

    return () => (canceled = true);
  }, [str]);

  // the suggestion item that is currently selected (on desktop)
  const [sel, setSel] = useState(0);
  // reset selection back to 0 when the search string changes
  useEffect(() => setSel(0), [str]);

  function selectWord(word) {
    setStr('');
    onSelectWord(word);
  }

  function changeSeries(s) {
    setSeries(s);
    // reset word when changing series to get different suggestions
    setStr('')
  }

  return (
    <div className="my-4 text-lg relative">
      <SearchInput
        value={str}
        onChange={setStr}
        onEnter={() => sugs && sugs[sel] && selectWord(sugs[sel])}
        onArrowDown={() => sugs && sel < sugs.length - 1 && setSel(sel + 1)}
        onArrowUp={() => sel > 0 && setSel(sel - 1)}
        series={seriesList}
        curSeries={curSeries}
        onChooseSeries={changeSeries}
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
