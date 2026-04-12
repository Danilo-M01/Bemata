import { useMemo } from 'react';
import { MenuBook } from './MenuBook';

function menuPageUrl(index1Based: number): string {
  const n = String(index1Based).padStart(2, '0');
  const base = import.meta.env.BASE_URL;
  const root = base.endsWith('/') ? base : `${base}/`;
  return `${root}menu/${n}.png`;
}

const PAGE_COUNT = 11;

export function MenuBookDemo() {
  const pages = useMemo(
    () => Array.from({ length: PAGE_COUNT }, (_, i) => menuPageUrl(i + 1)),
    []
  );

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#252320] via-[#1c1b19] to-[#141312] py-10 md:py-14">
      <header className="mb-6 px-4 text-center">
        <p className="mb-2 font-sans text-[0.65rem] uppercase tracking-[0.35em] text-white/35">
          Bemata · lab
        </p>
        <h1 className="font-editorial text-3xl font-medium text-white/90 md:text-4xl">
          3D meni knjiga
        </h1>
        <p className="mx-auto mt-3 max-w-xl font-sans text-sm font-light text-white/50">
          Slike:{' '}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.75rem] text-white/70">
            public/menu/01.png … 11.png
          </code>
        </p>
      </header>

      <MenuBook pages={pages} className="pb-12" />
    </div>
  );
}
