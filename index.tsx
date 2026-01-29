import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Cache Invalidation: Force unregister any existing service workers that might be serving stale content
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
    if (registrations.length > 0) {
      // If we found and killed a service worker, refresh once to ensure clean state
      window.location.reload();
    }
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);