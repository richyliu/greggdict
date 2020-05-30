import React, { useState } from 'react';

import SearchContainer from './SearchContainer';
import ImageContainer from './ImageContainer';

const App = () => {
  // current word the user has selected to look up in the dictionary
  const [word, setWord] = useState({t: "San Bernardino", x: 37.5, y: 572.5, page: "318"});
  console.log(word);

  return (
    <div>
      <SearchContainer onSelectWord={setWord} />
      <ImageContainer word={word} />
    </div>
  );
};

export default App;
