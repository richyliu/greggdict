import React from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/latin-300.css';
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-700.css';
import './index.css';

import AppContainer from './components/AppContainer';

createRoot(document.getElementById('root')).render(<AppContainer />);
