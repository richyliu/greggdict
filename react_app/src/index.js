import React from 'react';
import ReactDOM from 'react-dom';

import * as Sentry from '@sentry/browser';
import AppContainer from './components/AppContainer';

Sentry.init({
  dsn:
    'https://18e5ed0b3fa54e358dc1c51edf9a78ed@o400827.ingest.sentry.io/5259603',
});

ReactDOM.render(<AppContainer />, document.getElementById('root'));
