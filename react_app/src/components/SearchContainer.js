import React, { useEffect, useState, useMemo } from 'react';

import reference from '../assets/reference.json';

import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';

// list of words with the corresponding page number
const words = reference.flatMap(p =>
  p.words.map(w => ({ ...w, page: p.page }))
);

const SearchContainer = ({ onSelectWord }) => {
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
