import React from 'react';

const SearchInput = ({ value, onChange, onEnter, onArrowUp, onArrowDown }) => {
  function keyDown(e) {
    if (e.key === 'Enter') {
      onEnter();
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      onArrowUp();
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      onArrowDown();
      e.preventDefault();
    }
  }

  // TODO: add clear input button (also make `esc` key press that button)
  return (
    <div className="flex w-full">
      <input
        className="p-1 sm:px-2 bg-gray-200 focus:bg-white rounded flex-auto z-30"
        type="text"
        placeholder="Search..."
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={keyDown}
      />
      <button
        className="p-2 ml-1 sm:ml-2 rounded-lg border border-transparent focus:border-blue-400 bg-blue-500 text-white flex-none active:bg-blue-600"
        onClick={() => onEnter()}
      >
        <svg
          aria-hidden="true"
          focusable="false"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="h-6 w-6"
        >
          <path
            fill="currentColor"
            d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default SearchInput;
