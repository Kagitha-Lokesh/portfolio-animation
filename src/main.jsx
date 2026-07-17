import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/design-system/tokens.css'
import './styles/global.css'
import Shell from './shell/Shell.jsx'

// Clear stale service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('[ServiceWorker] Unregistered stale worker successfully.');
          window.location.reload();
        }
      });
    }
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Shell />
  </StrictMode>,
)
