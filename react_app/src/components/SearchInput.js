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
      <button
        className="p-2 ml-1 sm:ml-2 rounded-lg border border-transparent bg-gray-900 text-white flex-none active:bg-gray-600"
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
