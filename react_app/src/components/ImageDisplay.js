import React from 'react';

const DISPLAY_SIZE_SMALL = { x: 365, y: 100, offset: 5 };
const DISPLAY_SIZE_LARGE = { x: 450, y: 180, offset: 10 };

const ImageDisplay = ({ word, isExpanded, image }) => {
  let displaySize = isExpanded ? DISPLAY_SIZE_LARGE : DISPLAY_SIZE_SMALL;

  return (
    <div className="max-w-screen overflow-x-scroll">
      <div
        className="relative overflow-hidden border border-black"
        style={{
          width: `${displaySize.x}px`,
          height: `${displaySize.y}px`,
        }}
      >
        {word ? (
          <img
            style={{
              top: `-${word.y - displaySize.y / 2}px`,
              left: `-${word.x - displaySize.offset}px`,
            }}
            className="absolute max-w-none"
            src={image}
            alt=""
          />
        ) : (
          <div className="p-1">Search for a word to get started</div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
