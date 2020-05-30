import React from 'react';

const SEARCH_LIMIT = 5;

const SuggestionItem = ({ text, onClick, selected }) => (
  <div
    className="px-2 pt-1 border-b-2 border-gray-400 hover:bg-gray-300 cursor-pointer"
    onClick={onClick}
  >
    {selected ? <strong>{text}</strong> : text}
  </div>
);

const SearchSuggestions = ({ suggestions, onClick }) =>
  suggestions === null ? (
    <div></div>
  ) : (
    <div className="mt-1">
      {suggestions.length === 0 ? (
        <div>
          {' '}
          <div
            className="p-2 border-b-2 border-gray-400 hover:bg-gray-300 cursor-pointer"
            onClick={onClick}
          >
            <i>No results found</i>
          </div>
        </div>
      ) : (
        <div>
          {suggestions.slice(0, SEARCH_LIMIT).map((sug, i) => (
            <SuggestionItem
              selected={i === 0}
              text={sug.t}
              onClick={() => onClick(sug)}
              key={i}
            />
          ))}
          {suggestions.length > SEARCH_LIMIT && (
            <SuggestionItem text="..." onClick={() => {}} />
          )}
        </div>
      )}
    </div>
  );

export default SearchSuggestions;
