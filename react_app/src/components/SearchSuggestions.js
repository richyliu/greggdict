import React from 'react';

const SEARCH_LIMIT = 50;

const SuggestionItem = ({ text, onClick, selected }) => (
  <div
    className="px-2 py-1 hover:bg-gray-100 cursor-pointer sm:py-2"
    onClick={onClick}
  >
    {selected ? <strong>{text}</strong> : text}
  </div>
);

const SearchSuggestions = ({ suggestions, onClick, selected }) =>
  suggestions === null ? (
    <div></div>
  ) : (
    <div className="bg-white absolute w-full z-20 shadow-lg rounded">
      {suggestions.length === 0 ? (
        <div className="py-1">
          <SuggestionItem
            text={<i>No results found</i>}
            onClick={() => {}}
            selected={false}
          />
        </div>
      ) : (
        <div className="overflow-y-scroll" style={{maxHeight: '10rem'}}>
          {suggestions.slice(0, SEARCH_LIMIT).map((sug, i) => (
            <SuggestionItem
              selected={i === selected}
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
