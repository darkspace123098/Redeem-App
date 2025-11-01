import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Note: we intentionally avoid importing App.css here to prevent PostCSS processing in this dev container.
// Styling is provided by the Tailwind CDN included in `public/index.html`.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);