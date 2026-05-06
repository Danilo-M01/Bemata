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

interface TouchSwipeState {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  nearLeftEdge: boolean;
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
  const touchSwipeRef = useRef<TouchSwipeState | null>(null);
  const lastFlipAtRef = useRef(0);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = menuPages.length + 2; // +2 for front/back cover
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 420, height: 630 });
  const [isMobile, setIsMobile] = useState(() =>
    globalThis.window === undefined ? false : globalThis.window.innerWidth < 768
  );

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

      setIsMobile(vw < 768);
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

  const runFlipPrev = useCallback(() => {
    const now = Date.now();
    if (now - lastFlipAtRef.current < 120) return;
    lastFlipAtRef.current = now;
    flipPrev();
  }, [flipPrev]);

  const runFlipNext = useCallback(() => {
    const now = Date.now();
    if (now - lastFlipAtRef.current < 120) return;
    lastFlipAtRef.current = now;
    flipNext();
  }, [flipNext]);

  const onBookTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1) {
      touchSwipeRef.current = null;
      return;
    }
    const touch = e.touches[0];
    touchSwipeRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      lastX: touch.clientX,
      lastY: touch.clientY,
      nearLeftEdge: false,
    };
  }, []);

  const onBookTouchMove = useCallback((e: TouchEvent) => {
    const start = touchSwipeRef.current;
    if (!start || e.touches.length !== 1) return;

    const touch = e.touches[0];
    start.lastX = touch.clientX;
    start.lastY = touch.clientY;

    const absX = Math.abs(touch.clientX - start.x);
    if (absX > 4) {
      if (e.cancelable) e.preventDefault();
    }
  }, []);

  const commitSwipe = useCallback((start: TouchSwipeState, endX: number) => {
    const deltaX = endX - start.x;
    const absX = Math.abs(deltaX);
    const minSwipeDistance = 8;
    if (absX < minSwipeDistance) return;
    if (deltaX > 0) {
      runFlipPrev();
      return;
    }
    runFlipNext();
  }, [runFlipNext, runFlipPrev]);

  const onBookTouchEnd = useCallback((e: TouchEvent) => {
    const start = touchSwipeRef.current;
    if (!start || e.changedTouches.length !== 1) return;

    const touch = e.changedTouches[0];
    commitSwipe(start, touch.clientX);
    touchSwipeRef.current = null;
  }, [commitSwipe]);

  const onBookTouchCancel = useCallback(() => {
    const start = touchSwipeRef.current;
    if (!start) return;
    // On mobile browsers, edge swipe may fire touchcancel before touchend.
    if (start.nearLeftEdge) {
      runFlipPrev();
      touchSwipeRef.current = null;
      return;
    }
    commitSwipe(start, start.lastX);
    touchSwipeRef.current = null;
  }, [commitSwipe, runFlipPrev]);

  useEffect(() => {
    if (!isMobile) return;
    const container = containerRef.current;
    if (!container) return;
    const edgeAllowance = 26;
    const viewportEdgeGuard = 24;
    const isInsideBookArea = (x: number, y: number) => {
      const rect = container.getBoundingClientRect();
      return (
        x >= rect.left - edgeAllowance &&
        x <= rect.right + edgeAllowance &&
        y >= rect.top - edgeAllowance &&
        y <= rect.bottom + edgeAllowance
      );
    };
    const isNearViewportEdge = (x: number) =>
      x <= viewportEdgeGuard || x >= globalThis.window.innerWidth - viewportEdgeGuard;
    const isNavButtonTarget = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest('.gm-nav-btn'));

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        touchSwipeRef.current = null;
        return;
      }
      const touch = e.touches[0];
      if (isNavButtonTarget(e.target) || !isInsideBookArea(touch.clientX, touch.clientY)) {
        touchSwipeRef.current = null;
        return;
      }
      // iOS/Android browsers can steal edge swipes for history navigation.
      if (isNearViewportEdge(touch.clientX) && e.cancelable) {
        e.preventDefault();
      }
      onBookTouchStart(e);
      if (touchSwipeRef.current) {
        touchSwipeRef.current.nearLeftEdge = touch.clientX <= viewportEdgeGuard + 2;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchSwipeRef.current) return;
      onBookTouchMove(e);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchSwipeRef.current) return;
      onBookTouchEnd(e);
    };
    const handleTouchCancel = () => {
      if (!touchSwipeRef.current) return;
      onBookTouchCancel();
    };

    globalThis.window.addEventListener('touchstart', handleTouchStart, { passive: false });
    globalThis.window.addEventListener('touchmove', handleTouchMove, { passive: false });
    globalThis.window.addEventListener('touchend', handleTouchEnd, { passive: true });
    globalThis.window.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    return () => {
      globalThis.window.removeEventListener('touchstart', handleTouchStart);
      globalThis.window.removeEventListener('touchmove', handleTouchMove);
      globalThis.window.removeEventListener('touchend', handleTouchEnd);
      globalThis.window.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [isMobile, onBookTouchCancel, onBookTouchEnd, onBookTouchMove, onBookTouchStart]);

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
    globalThis.window.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('focusin', onFocusIn);
    globalThis.window.addEventListener('keydown', onKey);
    return () => {
      globalThis.window.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('focusin', onFocusIn);
      globalThis.window.removeEventListener('keydown', onKey);
    };
  }, [flipNext, flipPrev]);

  const spreadIndex = Math.floor(currentPage / 2);
  const totalSpreads = Math.ceil(totalPages / 2);
  const spreadMarkers = Array.from({ length: totalSpreads }, (_, idx) => `spread-${idx}`);
  const onPrevTouchEnd = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    if (!isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    touchSwipeRef.current = null;
    flipPrev();
  }, [flipPrev, isMobile]);
  const onNextTouchEnd = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    if (!isMobile) return;
    e.preventDefault();
    e.stopPropagation();
    touchSwipeRef.current = null;
    flipNext();
  }, [flipNext, isMobile]);
  const onNavTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    if (!isMobile) return;
    e.stopPropagation();
    touchSwipeRef.current = null;
  }, [isMobile]);
  const onPrevPointerUp = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isMobile || e.pointerType !== 'touch') return;
    e.preventDefault();
    e.stopPropagation();
    touchSwipeRef.current = null;
    flipPrev();
  }, [flipPrev, isMobile]);
  const onNextPointerUp = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isMobile || e.pointerType !== 'touch') return;
    e.preventDefault();
    e.stopPropagation();
    touchSwipeRef.current = null;
    flipNext();
  }, [flipNext, isMobile]);
  const onPrevClick = useCallback(() => {
    if (isMobile) return;
    flipPrev();
  }, [flipPrev, isMobile]);
  const onNextClick = useCallback(() => {
    if (isMobile) return;
    flipNext();
  }, [flipNext, isMobile]);

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
            mobileScrollSupport={isMobile}
            usePortrait={isMobile}
            startPage={0}
            drawShadow={true}
            flippingTime={isMobile ? 950 : 1400}
            maxShadowOpacity={0.55}
            useMouseEvents={!isMobile}
            swipeDistance={isMobile ? 24 : 40}
            clickEventForward={false}
            showPageCorners={true}
            disableFlipByClick={isMobile}
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
                key={pageData.title || `page-${pageData.sections.length}-${pageData.footnote ?? 'no-footnote'}`}
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
        <button type="button" className="gm-nav-btn" onClick={onPrevClick} onTouchStart={onNavTouchStart} onTouchEnd={onPrevTouchEnd} onPointerUp={onPrevPointerUp} disabled={currentPage <= 0} aria-label="Prethodna">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4L6 9l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>

        <div className="gm-dots">
          {spreadMarkers.map((marker, i) => (
            <div key={marker} className={`gm-dot ${i === spreadIndex ? 'active' : ''}`} />
          ))}
        </div>

        <button type="button" className="gm-nav-btn" onClick={onNextClick} onTouchStart={onNavTouchStart} onTouchEnd={onNextTouchEnd} onPointerUp={onNextPointerUp} disabled={currentPage >= totalPages - 1} aria-label="Sledeća">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <p className="gm-hint">
        {isMobile
          ? 'Prevuci levo/desno za listanje · Skroluj vertikalno kroz sadržaj'
          : 'Prevuci stranu ili klikni · Strelice ← →'}
      </p>
    </div>
  );
}
