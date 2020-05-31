import React, { useState } from 'react';

import SearchContainer from './SearchContainer';
import ImageContainer from './ImageContainer';
import Header from './Header';
import FAQ from './FAQ';
import Divider from './Divider';

const App = () => {
  // current word the user has selected to look up in the dictionary
  // TODO: for testing
  const [word, setWord] = useState(null);
  // const [word, setWord] = useState({ t: 'boa', x: 437.5, y: 235.5, page: '027' });

  return (
    <div className="font-sans max-w-lg mx-auto pt-1 px-2 sm:px-3">
      <Header />
      <SearchContainer onSelectWord={setWord} />
      <ImageContainer word={word} />
      <Divider />
      <FAQ />
    </div>
  );
};

export default App;
