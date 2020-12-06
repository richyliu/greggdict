import React, { useState } from 'react';

import ImageDisplay from './ImageDisplay';
import ImageControls from './ImageControls';
import { imageRoot } from '../settings';

const ImageContainer = ({ word, series }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const image = word && `${imageRoot}/${series}/pages/${word.page}.png`;

  return (
    <div className="my-3">
      <ImageDisplay word={word} isExpanded={isExpanded} image={image} />
      {word && (
        <ImageControls
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          fullImageUrl={image}
        />
      )}
    </div>
  );
};

export default ImageContainer;
