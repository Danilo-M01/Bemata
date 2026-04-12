import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { MenuBookDemo } from './components/ui/MenuBookDemo';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MenuBookDemo />
  </StrictMode>
);
