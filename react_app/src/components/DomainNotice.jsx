import React from 'react';

const LEGACY_HOSTNAME = 'greggdict.rliu.dev';

const DomainNotice = () => {
  const onLegacyDomain = window.location.hostname === LEGACY_HOSTNAME;
  const arrivedFromLegacyDomain =
    new URLSearchParams(window.location.search).get('from') === LEGACY_HOSTNAME;

  if (!onLegacyDomain && !arrivedFromLegacyDomain) return null;

  return (
    <aside className="mt-4 rounded bg-blue-50 px-3 py-2 text-center text-md text-blue-900">
      As of October 2026, Gregg Shorthand Dictionary has moved to{' '}
      <a className="font-bold underline" href="https://greggdict.com">
        greggdict.com
      </a>
      . Please update your bookmarks.
    </aside>
  );
};

export default DomainNotice;
