import React, { useRef, useState, useCallback, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { menuPages } from './menuData';
import { MenuPageContent } from './MenuPageRenderer';
import './MenuBook.css';

/* ─── Types ─── */
interface FlipEvent {
  data: number;
}

interface FlipBookApi {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
  };
}

/* ─── Cover Page ─── */
const CoverPage = React.forwardRef<HTMLDivElement, { side: 'front' | 'back' }>(
  ({ side }, ref) => {
    const logoBase = import.meta.env.BASE_URL;
    const logoRoot = logoBase.endsWith('/') ? logoBase : `${logoBase}/`;

    return (
      <div className={`menu-cover ${side}`} ref={ref} data-density="hard">
        <div className="cover-wood-texture" />
        {side === 'front' ? (
          <div className="cover-front-content">
            <div className="cover-gold-line" />
            <img src={`${logoRoot}bemata-logo.svg`} alt="Bemata" className="cover-logo-img" draggable={false} />
            <span className="cover-label">M E N I</span>
            <div className="cover-gold-line" />
          </div>
        ) : (
          <div className="cover-back-content">
            <img src={`${logoRoot}bemata-logo.svg`} alt="Bemata" className="cover-back-logo" draggable={false} />
            <span className="cover-back-label">bemata restoran</span>
          </div>
        )}
        <div className="cover-vignette-overlay" />
        <div className="cover-edge-border" />
      </div>
    );
  }
);
CoverPage.displayName = 'CoverPage';

/* ─── Main Book Component ─── */
export function MenuBook() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bookRef = useRef<FlipBookApi | null>(null);
  const keyboardEnabledRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = menuPages.length + 2; // +2 for front/back cover
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 420, height: 630 });

  /* ─── Calculate page dimensions — maintains 1.5:1 aspect ratio ─── */
  useEffect(() => {
    function calcDimensions() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const ratio = 1.5;

      let pageWidth: number;
      let pageHeight: number;

      if (vw >= 1200) {
        // Desktop — maximize for readability
        pageHeight = Math.min(vh * 0.86, 820);
        pageWidth = pageHeight / ratio;
        if (pageWidth * 2 > vw * 0.88) {
          pageWidth = (vw * 0.88) / 2;
          pageHeight = pageWidth * ratio;
        }
      } else if (vw >= 768) {
        // Tablet
        pageHeight = Math.min(vh * 0.8, 720);
        pageWidth = pageHeight / ratio;
        if (pageWidth * 2 > vw * 0.94) {
          pageWidth = (vw * 0.94) / 2;
          pageHeight = pageWidth * ratio;
        }
      } else {
        // Mobile — single page portrait
        pageWidth = vw * 0.94;
        pageHeight = pageWidth * ratio;
        if (pageHeight > vh * 0.78) {
          pageHeight = vh * 0.78;
          pageWidth = pageHeight / ratio;
        }
      }

      setDimensions({
        width: Math.round(pageWidth),
        height: Math.round(pageHeight),
      });
    }

    calcDimensions();
    window.addEventListener('resize', calcDimensions);
    return () => window.removeEventListener('resize', calcDimensions);
  }, []);

  /* ─── Handlers ─── */
  const onFlip = useCallback((e: FlipEvent) => {
    setCurrentPage(e.data);
    setIsBookOpen(e.data > 0 && e.data < totalPages - 1);
  }, [totalPages]);

  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext();
  }, []);

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev();
  }, []);

  /* ─── Keyboard ─── */
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const targetNode = e.target as Node | null;
      keyboardEnabledRef.current = Boolean(targetNode && containerRef.current?.contains(targetNode));
    };
    const onFocusIn = (e: FocusEvent) => {
      const targetNode = e.target as Node | null;
      keyboardEnabledRef.current = Boolean(targetNode && containerRef.current?.contains(targetNode));
    };
    const onKey = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName ?? '';
      const isTypingTarget =
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        Boolean(target?.isContentEditable);
      if (isTypingTarget) return;
      if (!keyboardEnabledRef.current && !containerRef.current?.contains(active)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); flipNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); flipPrev(); }
    };
    window.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('focusin', onFocusIn);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('focusin', onFocusIn);
      window.removeEventListener('keydown', onKey);
    };
  }, [flipNext, flipPrev]);

  const spreadIndex = Math.floor(currentPage / 2);
  const totalSpreads = Math.ceil(totalPages / 2);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // When closed, the cover sits on the right half of 2x width.
  // Shift left by half a page so the cover appears centered.
  const closedOffset = isMobile ? 0 : -(dimensions.width / 2);
  const stageTranslateX = isBookOpen ? 0 : closedOffset;

  return (
    <div
      ref={containerRef}
      className="gm-book-container"
      data-open={isBookOpen}
      aria-label="Interaktivna knjiga menija"
    >
      {/* Ambient glow */}
      <div className="gm-ambient" />

      {/* Book stage — centers when closed, expands when open */}
      <div
        className="gm-stage"
        style={{ transform: `translateX(${stageTranslateX}px)` }}
      >
        <div className="gm-shadow" />

        <div className="gm-book-wrap" data-open={isBookOpen}>
          <HTMLFlipBook
            ref={bookRef}
            width={dimensions.width}
            height={dimensions.height}
            size="fixed"
            minWidth={200}
            maxWidth={dimensions.width}
            minHeight={300}
            maxHeight={dimensions.height}
            showCover={true}
            mobileScrollSupport={false}
            usePortrait={isMobile}
            startPage={0}
            drawShadow={true}
            flippingTime={1400}
            maxShadowOpacity={0.55}
            useMouseEvents={true}
            swipeDistance={20}
            clickEventForward={false}
            showPageCorners={true}
            disableFlipByClick={false}
            onFlip={onFlip}
            className="bemata-flipbook"
            style={{}}
            startZIndex={0}
            autoSize={false}
          >
            {/* Front Cover */}
            <CoverPage side="front" />

            {/* HTML Menu Pages */}
            {menuPages.map((pageData, i) => (
              <MenuPageContent
                key={i}
                data={pageData}
                pageIndex={i}
              />
            ))}

            {/* Back Cover */}
            <CoverPage side="back" />
          </HTMLFlipBook>
        </div>
      </div>

      {/* Navigation */}
      <div className="gm-nav">
        <button className="gm-nav-btn" onClick={flipPrev} disabled={currentPage <= 0} aria-label="Prethodna">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        <div className="gm-dots">
          {Array.from({ length: totalSpreads }, (_, i) => (
            <div key={i} className={`gm-dot ${i === spreadIndex ? 'active' : ''}`} />
          ))}
        </div>

        <button className="gm-nav-btn" onClick={flipNext} disabled={currentPage >= totalPages - 1} aria-label="Sledeća">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <p className="gm-hint">
        {isMobile ? 'Prevuci prstom ili tapni na ivicu za listanje ← →' : 'Prevuci stranu ili klikni · Strelice ← →'}
      </p>
    </div>
  );
}
