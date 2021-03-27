import React, { useState, useEffect } from 'react';

import SearchContainer from './SearchContainer';
import ImageContainer from './ImageContainer';
import Header from './Header';
import Divider from './Divider';
import FAQ from './FAQ';
import Footer from './Footer';
import GithubCorner from './GithubCorner';
import { series } from '../settings';

const DEFAULT_SERIES_KEY = 'gregg_dict01_default_series';

const App = () => {
  // current word the user has selected to look up in the dictionary
  const [word, setWord] = useState(null);

  // load stored series for user convenience
  let stored = localStorage.getItem(DEFAULT_SERIES_KEY);
  let defaultSeries = '';
  if (stored && series.includes(stored)) {
    defaultSeries = stored;
  } else {
    defaultSeries = series[0];
  }
  const [curSeries, setSeries] = useState(defaultSeries);

  function changeSeries(s) {
    // reset word when the series changes
    setSeries(s);
    setWord(null);

    // also save it to localStorage for convenience
    localStorage.setItem(DEFAULT_SERIES_KEY, s);
  }

  return (
    <div className="font-sans max-w-lg mx-auto pt-1 px-2 sm:px-3">
      <GithubCorner />
      <Header />
      <SearchContainer
        onSelectWord={setWord}
        seriesList={series}
        curSeries={curSeries}
        setSeries={changeSeries}
      />
      <ImageContainer word={word} series={curSeries} />
      <Divider />
      <FAQ />
      <Footer />
    </div>
  );
};

export default App;
