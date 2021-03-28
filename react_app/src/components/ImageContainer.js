import React, { useState } from 'react';

import ImageDisplay from './ImageDisplay';
import ImageControls from './ImageControls';
import { imageRoot } from '../settings';

const IS_EXPANDED_KEY = 'gregg_dict01_default_is_expanded';

const ImageContainer = ({ word, series }) => {
  // load settings for user convenience
  let stored = localStorage.getItem(IS_EXPANDED_KEY);
  const [isExpanded, setIsExpanded] = useState(stored === '1');

  function updateIsExpanded(toggler) {
    setIsExpanded(s => {
      let newExpanded = toggler(s);
      localStorage.setItem(IS_EXPANDED_KEY, newExpanded ? '1' : '0');
      return newExpanded;
    });
  }

  const image = word && `${imageRoot}/${series}/pages/${word.page}.png`;

  return (
    <div className="my-3">
      <ImageDisplay word={word} isExpanded={isExpanded} image={image} />
      {word && (
        <ImageControls
          isExpanded={isExpanded}
          setIsExpanded={updateIsExpanded}
          fullImageUrl={image}
        />
      )}
    </div>
  );
};

export default ImageContainer;
