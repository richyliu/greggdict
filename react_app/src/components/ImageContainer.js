import React, { useState } from 'react';

import images from '../assets/pages/*.png';

const DISPLAY_SIZE = { x: 380, y: 140 };
const DISPLAY_X_OFFSET = 5;

const ImageDisplay = ({ word }) => (
  <div
    className="relative overflow-hidden border border-black"
    style={{
      width: `${DISPLAY_SIZE.x}px`,
      height: `${DISPLAY_SIZE.y}px`,
    }}
  >
    <img
      style={{
        top: `-${word.y - DISPLAY_SIZE.y / 2}px`,
        left: `-${word.x - DISPLAY_X_OFFSET}px`,
      }}
      className="absolute max-w-none"
      src={images[word.page]}
      alt=""
    />
    <div
      style={{
        width: `${DISPLAY_SIZE.x}px`,
        height: `${DISPLAY_SIZE.y}px`,
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0), rgba(0, 0, 0, 0.1))',
      }}
      className="absolute"
    ></div>
  </div>
);

const ImageContainer = ({ word }) => {
  return <div className="m-3">{word && <ImageDisplay word={word} />}</div>;
};

export default ImageContainer;
