
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Cache Invalidation: Safely unregister any existing service workers that might be serving stale content
const cleanupServiceWorkers = async () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length > 0) {
        for (const registration of registrations) {
          await registration.unregister();
        }
        // If we found and killed a service worker, refresh once to ensure clean state
        window.location.reload();
      }
    } catch (error) {
      console.warn('Service worker unregistration failed:', error);
    }
  }
};

// Execute cleanup only after the window has fully loaded to avoid 'invalid state' errors
if (typeof window !== 'undefined') {
  window.addEventListener('load', cleanupServiceWorkers);
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
