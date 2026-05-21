import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Router } from 'wouter';
import { initDB } from '@/db/indexedDB';
import App from './App.jsx';
import './index.css';

// Initialise IndexedDB avant le premier rendu
initDB().catch((err) => {
  console.error('Erreur initialisation IndexedDB :', err);
});

// Enregistrement du Service Worker (PWA — offline)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(import.meta.env.BASE_URL + 'sw.js')
      .catch((err) => console.warn('SW non enregistré :', err));
  });
}

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router base={base}>
      <App />
    </Router>
  </StrictMode>
);
