import React, { useState } from 'react';

import simplifiedImages from '../assets/Simplified/pages/*.png';

import ImageDisplay from './ImageDisplay';
import ImageControls from './ImageControls';

const ImageContainer = ({ word, series }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  let images = null;

  // we have to do it in this convoluted way because it's the only way for
  // Parcel to recognize the file
  if (series === 'Simplified') images = simplifiedImages;
  else {
    alert(`Images not found for series: ${series}`);
    throw new Error(
      `Images not found for series: ${series}. Please report this error.`
    );
  }

  return (
    <div className="my-3">
      <ImageDisplay
        word={word}
        isExpanded={isExpanded}
        image={word && images[word.page]}
      />
      <ImageControls
        isDisabled={word === null}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        fullImageUrl={word && images[word.page]}
      />
    </div>
  );
};

export default ImageContainer;
