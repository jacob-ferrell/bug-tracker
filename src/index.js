import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain="dev-5sz6elwgn4q3yfd8.us.auth0.com"
    clientId="IIGlT8LBlACTnnnoEDZdHnetsDd6yS0P"
    redirectUri={'http://localhost:3000/home'}
  >
    <App />
  </Auth0Provider>,
);


