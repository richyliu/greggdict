import React from 'react';

const SearchInput = ({value, onChange}) => {

  return (
    <div>
      <input
        className="px-1 border border-blue-700 rounded"
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
