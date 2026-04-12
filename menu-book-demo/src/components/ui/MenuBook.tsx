import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface MenuBookProps {
  className?: string;
  pages: string[];
  stageClassName?: string;
}

/** Drvenaste korice — topli orah / hrast u tonu Bemata sajta */
const woodCoverTexture = [
  'linear-gradient(180deg, rgba(255,245,230,.09) 0%, transparent 32%, rgba(20,12,8,.28) 100%)',
  'repeating-linear-gradient(91deg, rgba(0,0,0,.028) 0px, transparent 1px, transparent 5px, rgba(0,0,0,.02) 6px, transparent 11px)',
  'repeating-linear-gradient(-8deg, transparent 0px, rgba(35,22,14,.1) 1px, transparent 4px, transparent 28px)',
  'linear-gradient(102deg, #4d3a2f 0%, #5e4538 14%, #453228 32%, #5a4336 48%, #3d2c24 66%, #524038 84%, #463329 100%)',
].join(', ');

const woodEdgeHighlight =
  'linear-gradient(90deg, rgba(255,255,255,.06) 0%, transparent 8%, transparent 92%, rgba(0,0,0,.15) 100%)';

const paperNoise =
  'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.04%22/%3E%3C/svg%3E")';

const faceHidden = {
  backfaceVisibility: 'hidden' as const,
  WebkitBackfaceVisibility: 'hidden' as const,
};

function bemataLogoSrc(): string {
  const base = import.meta.env.BASE_URL;
  const root = base.endsWith('/') ? base : `${base}/`;
  return `${root}bemata-logo.svg`;
}

function CoverLogo() {
  return (
    <div className="pointer-events-none flex w-full flex-col items-center justify-center px-6 py-8">
      <img
        src={bemataLogoSrc()}
        alt="Bemata"
        className="w-[min(78%,320px)] max-w-full select-none drop-shadow-[0_3px_14px_rgba(0,0,0,.5)]"
        style={{
          filter:
            'brightness(1.08) contrast(1.05) drop-shadow(0 1px 0 rgba(255,255,255,.12))',
        }}
        draggable={false}
      />
    </div>
  );
}

function BlankPage() {
  return (
    <div
      className="h-full w-full min-h-[40%] opacity-95"
      style={{
        background: `linear-gradient(180deg, #faf8f4 0%, #f5f2eb 100%), ${paperNoise}`,
      }}
    />
  );
}

/** Jedna strana menija — vertikalno „dugačak“ prikaz (kao štampani meni) */
function MenuPageImage({ src }: { src: string }) {
  if (!src) return <BlankPage />;
  return (
    <img
      src={src}
      alt=""
      className="h-full w-full min-h-0 max-h-full object-contain object-top shadow-[0_2px_14px_rgba(0,0,0,.1)]"
      draggable={false}
    />
  );
}

function spreadPairAt(pages: string[], spreadIndex: number) {
  const li = spreadIndex * 2;
  return {
    leftSrc: pages[li] ?? '',
    rightSrc: (pages[li + 1] ?? null) as string | null,
  };
}

interface OpenSpread3DProps {
  pages: string[];
  spread: number;
  maxSpread: number;
  reduceMotion: boolean | null;
  isFlipping: boolean;
  pageTilt: boolean;
  rightPageControls: ReturnType<typeof useAnimationControls>;
  leftPageControls: ReturnType<typeof useAnimationControls>;
  onLeft: () => void;
  onRight: () => void;
}

function OpenSpread3D({
  pages,
  spread,
  maxSpread,
  reduceMotion,
  isFlipping,
  pageTilt,
  rightPageControls,
  leftPageControls,
  onLeft,
  onRight,
}: OpenSpread3DProps) {
  const cur = spreadPairAt(pages, spread);
  const prevSpread = spreadPairAt(pages, spread - 1);
  const nextSpread = spreadPairAt(pages, spread + 1);

  const spring = pageTilt
    ? {
        type: 'spring' as const,
        stiffness: 26,
        damping: 32,
        mass: 1.12,
      }
    : { duration: 0 };

  const canFlipNext = spread < maxSpread;

  const colPerspective = reduceMotion ? 'none' : 'min(1400px, 200vw)';

  return (
    <>
      {/* Levi list */}
      <div
        className={cn(
          'relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#fcf9f2] p-2 sm:p-3 md:p-4 outline-none',
          !isFlipping &&
            (spread === 0
              ? 'cursor-w-resize hover:bg-[#faf7f0]'
              : 'cursor-w-resize hover:bg-[#faf7f0]'),
          'focus-within:ring-2 focus-within:ring-white/30'
        )}
        style={{ perspective: colPerspective, transformStyle: 'preserve-3d' }}
        role="button"
        tabIndex={0}
        aria-label={
          spread === 0
            ? 'Klik da zatvoriš knjigu'
            : 'Klik za prethodni list (3D okret)'
        }
        onClick={(e) => {
          e.stopPropagation();
          onLeft();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onLeft();
          }
        }}
      >
        {reduceMotion || spread === 0 ? (
          <motion.div
            className="relative flex min-h-0 flex-1 w-full items-start justify-center overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
            animate={
              pageTilt ? { rotateY: 5.5, z: 2 } : { rotateY: 0, z: 0 }
            }
            transition={spring}
          >
            <MenuPageImage src={cur.leftSrc} />
          </motion.div>
        ) : (
          <div className="relative min-h-0 flex-1">
            <div
              className="pointer-events-none absolute inset-0 z-0 flex items-start justify-center overflow-hidden"
              aria-hidden
            >
              <MenuPageImage src={prevSpread.leftSrc} />
            </div>
            <motion.div
              className="absolute inset-0 z-[1]"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'right center',
              }}
              animate={leftPageControls}
              initial={{ rotateY: 0 }}
            >
              <div
                className="absolute inset-0 flex items-start justify-center overflow-hidden bg-[#fcf9f2]"
                style={{ ...faceHidden, transform: 'translateZ(1px)' }}
              >
                <motion.div
                  className="h-full w-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={
                    pageTilt && !isFlipping
                      ? { rotateY: 5.5, z: 2 }
                      : { rotateY: 0, z: 0 }
                  }
                  transition={spring}
                >
                  <MenuPageImage src={cur.leftSrc} />
                </motion.div>
              </div>
              <div
                className="absolute inset-0 flex items-start justify-center overflow-hidden bg-[#fcf9f2]"
                style={{ transform: 'rotateY(180deg)', ...faceHidden }}
              >
                <MenuPageImage src={prevSpread.rightSrc ?? ''} />
              </div>
            </motion.div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-y-4 left-2 hidden w-6 rounded-full bg-gradient-to-r from-black/[0.06] to-transparent sm:block" />
        <span className="pointer-events-none absolute bottom-2 left-2 font-sans text-[0.55rem] uppercase tracking-[0.2em] text-black/25 sm:bottom-3 sm:left-3">
          ◀
        </span>
      </div>

      <div
        className="relative z-10 w-px shrink-0 self-stretch bg-gradient-to-b from-transparent via-black/20 to-transparent shadow-[1px_0_0_rgba(255,255,255,.4)]"
        aria-hidden
      />

      {/* Desni list */}
      <div
        className={cn(
          'relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#fcf9f2] p-2 sm:p-3 md:p-4 outline-none',
          !isFlipping &&
            (canFlipNext
              ? 'cursor-e-resize hover:bg-[#faf7f0]'
              : 'cursor-default'),
          'focus-within:ring-2 focus-within:ring-white/30'
        )}
        style={{ perspective: colPerspective, transformStyle: 'preserve-3d' }}
        role="button"
        tabIndex={0}
        aria-label={
          canFlipNext ? 'Klik za sledeći list (3D okret)' : 'Poslednji list'
        }
        onClick={(e) => {
          e.stopPropagation();
          onRight();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onRight();
          }
        }}
      >
        {reduceMotion || !canFlipNext ? (
          <motion.div
            className="relative flex min-h-0 flex-1 w-full items-start justify-center overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
            animate={
              pageTilt ? { rotateY: -5.5, z: 2 } : { rotateY: 0, z: 0 }
            }
            transition={spring}
          >
            {cur.rightSrc ? (
              <MenuPageImage src={cur.rightSrc} />
            ) : (
              <BlankPage />
            )}
          </motion.div>
        ) : (
          <div className="relative min-h-0 flex-1">
            <div
              className="pointer-events-none absolute inset-0 z-0 flex items-start justify-center overflow-hidden"
              aria-hidden
            >
              {nextSpread.rightSrc ? (
                <MenuPageImage src={nextSpread.rightSrc} />
              ) : (
                <BlankPage />
              )}
            </div>
            <motion.div
              className="absolute inset-0 z-[1] shadow-[inset_0_0_24px_rgba(0,0,0,.04)]"
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'left center',
              }}
              animate={rightPageControls}
              initial={{ rotateY: 0 }}
            >
              <div
                className="absolute inset-0 flex items-start justify-center overflow-hidden bg-[#fcf9f2]"
                style={{ ...faceHidden, transform: 'translateZ(1px)' }}
              >
                <motion.div
                  className="h-full w-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={
                    pageTilt && !isFlipping
                      ? { rotateY: -5.5, z: 2 }
                      : { rotateY: 0, z: 0 }
                  }
                  transition={spring}
                >
                  {cur.rightSrc ? (
                    <MenuPageImage src={cur.rightSrc} />
                  ) : (
                    <BlankPage />
                  )}
                </motion.div>
              </div>
              <div
                className="absolute inset-0 flex items-start justify-center overflow-hidden bg-[#fcf9f2]"
                style={{ transform: 'rotateY(180deg)', ...faceHidden }}
              >
                <MenuPageImage src={nextSpread.leftSrc} />
              </div>
            </motion.div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-y-4 right-2 hidden w-6 rounded-full bg-gradient-to-l from-black/[0.06] to-transparent sm:block" />
        {canFlipNext && (
          <span className="pointer-events-none absolute bottom-2 right-2 font-sans text-[0.55rem] uppercase tracking-[0.2em] text-black/25 sm:bottom-3 sm:right-3">
            ▶
          </span>
        )}
      </div>
    </>
  );
}

export function MenuBook({ className, pages, stageClassName }: MenuBookProps) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [spread, setSpread] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const rightPageControls = useAnimationControls();
  const leftPageControls = useAnimationControls();

  const spreadCount = Math.ceil(pages.length / 2);
  const maxSpread = Math.max(0, spreadCount - 1);

  const peek = !open && hover;
  const spring = reduceMotion
    ? { duration: 0.22 }
    : {
        type: 'spring' as const,
        stiffness: 26,
        damping: 32,
        mass: 1.12,
        restDelta: 0.0008,
        restSpeed: 0.08,
      };

  const coverRotateY = open ? -118 : peek ? -12 : 0;
  const coverRotateX = peek && !open ? 2.5 : open ? 0.8 : 0;
  const liftZ = peek && !open ? 10 : open ? 24 : 0;

  const flipEase = [0.36, 0.02, 0.2, 1] as const;
  const flipDuration = 0.92;

  const openBook = useCallback(() => setOpen(true), []);
  const closeBook = useCallback(() => {
    setOpen(false);
    setSpread(0);
  }, []);

  const goNext = useCallback(() => {
    setSpread((s) => Math.min(maxSpread, s + 1));
  }, [maxSpread]);

  const goPrev = useCallback(() => {
    setSpread((s) => Math.max(0, s - 1));
  }, []);

  const flipNext = useCallback(async () => {
    if (spread >= maxSpread || isFlipping) return;
    if (reduceMotion) {
      goNext();
      return;
    }
    setIsFlipping(true);
    await rightPageControls.start({
      rotateY: -180,
      transition: { duration: flipDuration, ease: flipEase },
    });
    setSpread((s) => Math.min(maxSpread, s + 1));
    await rightPageControls.set({ rotateY: 0 });
    setIsFlipping(false);
  }, [
    spread,
    maxSpread,
    isFlipping,
    reduceMotion,
    goNext,
    rightPageControls,
    flipEase,
  ]);

  const flipPrev = useCallback(async () => {
    if (spread <= 0 || isFlipping) return;
    if (reduceMotion) {
      goPrev();
      return;
    }
    setIsFlipping(true);
    await leftPageControls.start({
      rotateY: 180,
      transition: { duration: flipDuration, ease: flipEase },
    });
    setSpread((s) => Math.max(0, s - 1));
    await leftPageControls.set({ rotateY: 0 });
    setIsFlipping(false);
  }, [spread, isFlipping, reduceMotion, goPrev, leftPageControls, flipEase]);

  const onClickLeftPage = useCallback(() => {
    if (!open || isFlipping) return;
    if (spread > 0) void flipPrev();
    else closeBook();
  }, [open, isFlipping, spread, flipPrev, closeBook]);

  const onClickRightPage = useCallback(() => {
    if (!open || isFlipping) return;
    if (spread < maxSpread) void flipNext();
  }, [open, isFlipping, spread, maxSpread, flipNext]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (spread < maxSpread && !isFlipping) void flipNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (isFlipping) return;
        if (spread > 0) void flipPrev();
        else closeBook();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, spread, maxSpread, isFlipping, flipNext, flipPrev, closeBook]);

  const pageTilt = Boolean(open && !isFlipping && !reduceMotion);

  return (
    <div
      className={cn('flex flex-col items-center gap-6', className)}
      data-state={open ? 'open' : peek ? 'peek' : 'closed'}
    >
      <p className="sr-only" aria-live="polite">
        {open
          ? `Otvorena knjiga, list ${spread + 1} od ${spreadCount}.${isFlipping ? ' Okretanje lista…' : ''} Klik levo — nazad, klik desno — napred.`
          : 'Zatvoreno. Klik na korice da otvoriš.'}
      </p>

      <div
        className={cn(
          'relative mx-auto w-full max-w-[min(100%,920px)] px-2 sm:px-4',
          stageClassName
        )}
        style={{ perspective: reduceMotion ? 'none' : '2200px' }}
      >
        <div
          className="pointer-events-none absolute -inset-x-12 bottom-0 top-1/5 rounded-[50%] opacity-75 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(48,42,38,.48) 0%, transparent 70%)',
          }}
        />

        <motion.div
          className="relative mx-auto"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{
            rotateX: reduceMotion ? 0 : open ? 8 : peek ? 2 : 0,
            rotateZ: reduceMotion ? 0 : open ? -0.65 : 0,
            z: liftZ,
          }}
          transition={spring}
        >
          <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
            <div
              className="absolute inset-y-0 left-0 right-0 -z-10 rounded-r-xl rounded-l-md shadow-2xl"
              style={{
                transform: 'translateZ(-32px) scale(1.015)',
                background: `${woodEdgeHighlight}, ${woodCoverTexture}`,
              }}
            />

            <div
              className="relative mx-auto w-full max-w-[880px] rounded-r-xl rounded-l-md shadow-book"
              style={{
                transformStyle: 'preserve-3d',
                height: 'min(82vh, 720px)',
                minHeight: '440px',
              }}
            >
              <div
                className="absolute bottom-2 left-0 top-2 z-0 w-[14px] rounded-l-md shadow-[inset_-2px_0_4px_rgba(0,0,0,.45)]"
                style={{
                  transform: 'translateZ(-6px)',
                  background:
                    'linear-gradient(90deg, rgba(0,0,0,.2) 0%, transparent 40%), linear-gradient(180deg, #3a2820 0%, #2a1c15 50%, #1f1410 100%)',
                }}
              />

              <div
                className="absolute bottom-2 left-[12px] top-2 z-0 w-[10px] rounded-sm shadow-[inset_-2px_0_5px_rgba(0,0,0,.5)]"
                style={{
                  transform: 'translateZ(-3px)',
                  background:
                    'linear-gradient(90deg, rgba(255,220,190,.08) 0%, transparent 35%), linear-gradient(180deg, #4d382c 0%, #35241c 45%, #261a14 100%)',
                }}
              />
              <div
                className="absolute bottom-3 left-[20px] top-3 z-0 w-[5px] rounded-sm bg-gradient-to-b from-[#e8e4dc] via-[#d8d3c8] to-[#c9c3b8] opacity-95 shadow-inner"
                style={{ transform: 'translateZ(-5px)' }}
              />

              <motion.div
                className="absolute inset-y-2 left-[22px] right-2 z-[1] flex overflow-hidden rounded-r-lg border border-black/[0.06] bg-[#e8e4dc] shadow-[inset_0_1px_0_rgba(255,255,255,.35)]"
                style={{
                  transformStyle: 'preserve-3d',
                  pointerEvents: open ? 'auto' : 'none',
                }}
                animate={{
                  opacity: open ? 1 : 0,
                  z: open ? 14 : 0,
                }}
                transition={spring}
                aria-busy={isFlipping}
              >
                <OpenSpread3D
                  pages={pages}
                  spread={spread}
                  maxSpread={maxSpread}
                  reduceMotion={reduceMotion}
                  isFlipping={isFlipping}
                  pageTilt={pageTilt}
                  rightPageControls={rightPageControls}
                  leftPageControls={leftPageControls}
                  onLeft={onClickLeftPage}
                  onRight={onClickRightPage}
                />
              </motion.div>

              <motion.div
                className={cn(
                  'absolute inset-y-2 left-[22px] right-2 overflow-hidden rounded-r-lg shadow-book-soft',
                  !open && 'cursor-pointer',
                  open && 'pointer-events-none'
                )}
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'left center',
                  background: `${woodEdgeHighlight}, ${woodCoverTexture}`,
                  zIndex: open ? 5 : 16,
                }}
                animate={{
                  rotateY: reduceMotion ? 0 : coverRotateY,
                  rotateX: reduceMotion ? 0 : coverRotateX,
                  z: open ? -16 : 2.5,
                }}
                transition={spring}
                onHoverStart={() => setHover(true)}
                onHoverEnd={() => setHover(false)}
                onClick={() => {
                  if (!open) openBook();
                }}
                role="button"
                tabIndex={0}
                aria-expanded={open}
                aria-label="Otvori meni knjigu"
                onKeyDown={(e) => {
                  if (!open && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    openBook();
                  }
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay"
                  style={{
                    background:
                      'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.65%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")',
                  }}
                />
                <div className="flex h-full flex-col items-center justify-center">
                  <CoverLogo />
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-r-lg ring-1 ring-inset ring-amber-950/35 shadow-[inset_0_1px_0_rgba(255,255,255,.1)]" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="max-w-lg px-4 text-center font-sans text-xs font-light leading-relaxed text-white/42">
        {open ? (
          <>
            <span className="text-white/65">Leva strana</span> — prethodni list (3D okret oko šava). Na
            prvom listu zatvara knjigu.{' '}
            <span className="text-white/65">Desna strana</span> — sledeći list. Strelice na tastaturi
            isto.
          </>
        ) : (
          <>Klik na korice da otvoriš. Dve strane menija — po jedna visoka slika.</>
        )}
      </p>
    </div>
  );
}
