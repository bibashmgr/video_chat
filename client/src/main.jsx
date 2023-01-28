import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

// helper
import { SocketProvider } from './helpers/socketHelper';

import App from './App';
import store from './app/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <SocketProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </SocketProvider>
);
