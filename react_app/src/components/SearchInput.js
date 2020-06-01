import React from 'react';

import ChooseSeries from './ChooseSeries';

const SearchInput = ({
  value,
  onChange,
  onEnter,
  onArrowUp,
  onArrowDown,
  series,
  onChooseSeries,
  curSeries,
}) => {
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

  return (
    <div className="flex flex-row items-stretch w-full">
      <div className="flex-auto relative z-30 mr-1 sm:mr-2">
        <input
          className="p-1 sm:px-2 bg-gray-200 focus:bg-white rounded w-full h-full"
          type="text"
          placeholder="Search..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          autoFocus
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={keyDown}
        />
        {value.length > 0 && (
          <button
            className="absolute h-full px-2 mr-1 right-0 top-0 z-40"
            onClick={() => onChange('')}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-4 h-4 text-gray-600"
            >
              <path
                fill="currentColor"
                d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
              ></path>
            </svg>
          </button>
        )}
      </div>
      <ChooseSeries
        series={series}
        onChoose={onChooseSeries}
        curSeries={curSeries}
      />
    </div>
  );
};

export default SearchInput;
