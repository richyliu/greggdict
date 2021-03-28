import React, { useState, useEffect } from 'react';

const HIDE_NEW_BANNER_KEY = 'gregg_dict01_hide_new_banner';

const NewReleaseBanner = () => {
  // hide the banner if the user closed it
  const hideBanner = localStorage.getItem(HIDE_NEW_BANNER_KEY) !== null;
  const [closed, setClosed] = useState(hideBanner);
  const [fadeOut, setFadeOut] = useState(false);

  // completely remove the banner after the fade out effect is over
  useEffect(() => {
    let canceled = false;
    if (fadeOut && !closed) {
      setTimeout(() => {
        if (canceled) return;
        setClosed(true);
        localStorage.setItem(HIDE_NEW_BANNER_KEY, '1');
      }, 1000);
    }

    return () => (canceled = true);
  }, [fadeOut]);

  if (closed) return null;

  return (
    <>
      <div
        className={
          'transition duration-500 ' + (fadeOut ? 'opacity-0' : 'opacity-100')
        }
      >
        <div className="fixed left-0 bottom-0 w-full px-2 sm:px-0 pb-2 sm:pb-4 md:pb-6">
          <div className="max-w-lg mx-auto py-3 px-4 bg-black text-white rounded-lg shadow-lg">
            <div className="flex">
              <div className="flex-auto">
                <p className="leading-snug">
                  Anniversary edition dictionary has been added! Click on the
                  "Simplified" dropdown and select "Anniversary". I also added
                  support for fuzzy searching. See the full{' '}
                  <a
                    href="https://github.com/richyliu/greggdict/releases"
                    className="font-bold border-b border-transparent hover:border-current"
                  >
                    release notes
                  </a>{' '}
                  here.
                </p>
              </div>
              <button
                className="inline flex-auto p-1 text-gray-400 rounded-full"
                onClick={() => setFadeOut(true)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6L18 18"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-36" />
    </>
  );
};

export default NewReleaseBanner;
