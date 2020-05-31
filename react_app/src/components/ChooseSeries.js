import React, { useState, useEffect, useRef } from 'react';

const ChooseSeries = ({ series, curSeries, onChoose }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // close the dropdown if the user clicks anywhere outside of it, except for the button
  const dropdown = useRef(null);
  const button = useRef(null);
  useEffect(() => {
    if (!dropdown.current || !button.current) return;

    function onClick(e) {
      if (
        !dropdown.current.contains(e.target) &&
        !button.current.contains(e.target)
      )
        setShowDropdown(false);
    }
    document.addEventListener('click', onClick);

    return () => document.removeEventListener('click', onClick);
  }, [dropdown.current, button.current]);

  return (
    <div className="relative inline-block flex-initial">
      <button
        className="inline-flex justify-center w-full rounded-md border-2 border-gray-900 pl-2 pr-1 py-2 bg-white text-sm"
        onClick={() => setShowDropdown(s => !s)}
        ref={button}
      >
        <span>{curSeries}</span>
        <svg
          fill="currentColor"
          viewBox="0 0 20 20"
          className="h-5 w-5"
          style={{ marginLeft: '-0.125rem' }}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <div
        className={
          'origin-top-right absolute right-0 mt-1 w-56 rounded-md shadow-lg bg-white z-50 transition ease-in-out duration-100 ' +
          (showDropdown
            ? 'transform opacity-100 scale-100'
            : 'transform opacity-0 scale-95 pointer-events-none')
        }
        ref={dropdown}
      >
        <div className="rounded-md bg-white shadow-xs">
          <div className="py-1">
            {series.map(s => (
              <button
                href="#"
                className="block px-3 py-2 w-full text-left leading-6 text-gray-900 hover:bg-gray-100"
                onClick={() => {
                  onChoose(s);
                  setShowDropdown(false);
                }}
                key={s}
              >
                {s}
              </button>
            ))}
            <div
              href="#"
              className="block px-3 py-2 w-full text-left leading-6 text-gray-600  text-sm"
            >
              Don't see your series? See FAQ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseSeries;
