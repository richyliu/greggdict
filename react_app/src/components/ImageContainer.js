import React, { useState } from 'react';

import images from '../assets/pages/*.png';

const DISPLAY_SIZE_SMALL = { x: 365, y: 120, offset: 5 };
const DISPLAY_SIZE_LARGE = { x: 450, y: 180, offset: 10 };

const ImageDisplay = ({ word, isExpanded }) => {
  let displaySize = isExpanded ? DISPLAY_SIZE_LARGE : DISPLAY_SIZE_SMALL;

  return (
    <div
      className="relative overflow-hidden border border-black"
      style={{
        width: `${displaySize.x}px`,
        height: `${displaySize.y}px`,
      }}
    >
      <img
        style={{
          top: `-${word.y - displaySize.y / 2}px`,
          left: `-${word.x - displaySize.offset}px`,
        }}
        className="absolute max-w-none"
        src={images[word.page]}
        alt=""
      />
      <div
        style={{
          width: `${displaySize.x}px`,
          height: `${displaySize.y}px`,
        }}
        className="absolute"
      ></div>
    </div>
  );
};

const ImageContainer = ({ word }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="m-3">
      {word ? (
        <div>
          <ImageDisplay word={word} isExpanded={isExpanded} />
          <div>
            <button
              className="px-2 py-1 m-2 rounded-lg bg-gray-300"
              onClick={() => setIsExpanded(s => !s)}
            >
              {isExpanded ? 'shrink' : 'expand'}
            </button>
            <a
              className="px-2 py-1 m-2 inline-block rounded-lg bg-gray-300"
              href={images[word.page]}
            >
              open full image
            </a>
          </div>
        </div>
      ) : (
        <div>Search a word to get started</div>
      )}
    </div>
  );
};

export default ImageContainer;
