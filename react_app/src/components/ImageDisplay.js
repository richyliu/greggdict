import React, { useEffect, useState } from 'react';

/* sytles for the spinner is in index.css */
const LoadingSpinner = () => (
  <div className="spinner">
    <div className="bounce1"></div>
    <div className="bounce2"></div>
    <div className="bounce3"></div>
  </div>
);

const DISPLAY_SIZE_SMALL = { x: 365, y: 100, offset: 5 };
const DISPLAY_SIZE_LARGE = { x: 450, y: 180, offset: 10 };

const ImageDisplay = ({ word, isExpanded, image }) => {
  const [loading, setLoading] = useState(true);

  // reset loading once there is a new word
  useEffect(() => setLoading(true), [word]);

  let displaySize = isExpanded ? DISPLAY_SIZE_LARGE : DISPLAY_SIZE_SMALL;

  return (
    <div className="max-w-screen overflow-x-auto">
      <div
        className="relative overflow-hidden border border-black"
        style={{
          width: `${displaySize.x}px`,
          height: `${displaySize.y}px`,
        }}
      >
        {word ? (
          <>
            <img
              style={{
                top: `-${word.y - displaySize.y / 2}px`,
                left: `-${word.x - displaySize.offset}px`,
              }}
              className={'absolute max-w-none ' + (loading ? 'invisible' : '')}
              src={image + '?cachebreaker=' + word.t}
              onLoad={() => setTimeout(() => setLoading(false), 300)}
              alt={'Gregg shorthand for word: ' + word.t}
            />
            {loading && <LoadingSpinner />}
          </>
        ) : (
          <div className="p-1">Type a word above to get started</div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
