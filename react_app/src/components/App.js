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
    <>
      <NewDomainBanner />
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
    </>
  );
};

const NewDomainBanner = () => (
  <>
    <div className="fixed w-full z-50 bg-red-600">
      <div className="max-w-lg mx-auto py-3 sm:py-5 px-3 sm:text-lg md:text-xl font-light text-white">
        Notice: I have changed the domain to https://greggdict.rliu.dev/ (as of
        2021-03-10).
      </div>
    </div>
    <div className="h-16"></div>
  </>
);

export default App;
