import React from 'react';

const SearchInput = ({ value, onChange, onEnter }) => {
  return (
    <div>
      <input
        className="px-1 border border-gray-700 rounded"
        type="text"
        placeholder="Search..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onEnter()}
      />
    </div>
  );
};

export default SearchInput;
