import React, { useState } from 'react';

import images from '../assets/pages/*.png';

import ImageDisplay from './ImageDisplay';
import ImageControls from './ImageControls';

const ImageContainer = ({ word }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
