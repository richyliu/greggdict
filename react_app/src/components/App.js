import React, { useState } from 'react';

import SearchContainer from './SearchContainer';
import ImageContainer from './ImageContainer';
import Header from './Header';
import Divider from './Divider';
import FAQ from './FAQ';
import Footer from './Footer';
import GithubCorner from './GithubCorner';
import { series } from '../settings';

const App = () => {
  // current word the user has selected to look up in the dictionary
  const [word, setWord] = useState(null);
  const [curSeries, setSeries] = useState(series[0]);

  return (
    <div className="font-sans max-w-lg mx-auto pt-1 px-2 sm:px-3">
      <GithubCorner />
      <Header />
      <SearchContainer
        onSelectWord={setWord}
        seriesList={series}
        curSeries={curSeries}
        setSeries={setSeries}
      />
      <ImageContainer word={word} series={curSeries} />
      <Divider />
      <FAQ />
      <Footer />
    </div>
  );
};

export default App;
