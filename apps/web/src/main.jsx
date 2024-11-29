import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';  // Alterado para o nome correto do componente

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
