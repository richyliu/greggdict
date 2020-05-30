import React, { useEffect, useState } from 'react';

import Fuse from 'fuse.js';

import reference from '../assets/reference.json';

import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';

// list of words with the corresponding page number
const words = reference.flatMap(p =>
  p.words.map(w => ({ ...w, page: p.page }))
);

const fuse = new Fuse(words, {
  location: 0,
  distance: 0,
  threshold: 0.2,
  // includeScore: true,
  keys: ['t'],
});

const SearchContainer = ({ onSelectWord }) => {
  const [str, setStr] = useState('');

  const suggestions = str.length > 0 ? fuse.search(str).map(a => a.item) : null;

  function selectWord(word) {
    setStr('');
    onSelectWord(word);
  }

  return (
    <div className="m-2 inline-block text-lg">
      <SearchInput
        value={str}
        onChange={setStr}
        onEnter={() => selectWord(suggestions[0])}
      />
      <SearchSuggestions suggestions={suggestions} onClick={selectWord} />
    </div>
  );
};

export default SearchContainer;
