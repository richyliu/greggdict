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
    <>
    <NewDomainBanner />
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
    </>
  );
};

const NewDomainBanner = () => (
  <>
    <div className="fixed w-full z-50 bg-red-600">
      <div className="max-w-lg mx-auto py-5 rounded-md shadow-md text-xl font-light text-white">
        Notice: I have changed the domain to https://greggdict.rliu.dev/ (as of 2021-03-10).
      </div>
    </div>
    <div className="h-12"></div>
  </>
);

export default App;
