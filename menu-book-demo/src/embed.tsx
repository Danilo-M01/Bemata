import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MenuBook } from './components/ui/MenuBook';

function mountMenuBook(target: HTMLElement | string | null | undefined) {
  const el =
    typeof target === 'string'
      ? (document.querySelector(target) as HTMLElement | null)
      : target;
  if (!el) return;
  try {
    createRoot(el).render(
      <StrictMode>
        <MenuBook />
      </StrictMode>
    );
  } catch (err) {
    console.error('[BemataMenuBook] Mount error:', err);
  }
}

// Expose globally FIRST, before auto-mount
(window as any).BemataMenuBookMount = mountMenuBook;

// Auto-mount if #menu-book-root exists
try {
  const root = document.getElementById('menu-book-root');
  if (root) {
    mountMenuBook(root);
  }
} catch (err) {
  console.error('[BemataMenuBook] Auto-mount error:', err);
}
