import React from 'react';

const SEARCH_LIMIT = 10;

const SuggestionItem = ({ text, onClick }) => (
  <div
    className="px-2 border-b-2 border-gray-400 hover:bg-gray-300 cursor-pointer"
    onClick={onClick}
  >
    {text}
  </div>
);

const SearchSuggestions = ({ suggestions, onClick }) => (
  <div>
    {suggestions.slice(0, SEARCH_LIMIT).map((sug, i) => (
      <SuggestionItem text={sug.t} onClick={() => onClick(sug)} key={i} />
    ))}
    {suggestions.length > SEARCH_LIMIT && (
      <SuggestionItem text="..." onClick={() => {}} />
    )}
  </div>
);

export default SearchSuggestions;
