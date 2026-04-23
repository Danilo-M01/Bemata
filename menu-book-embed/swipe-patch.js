/**
 * Bemata Menu Book — Swipe Patch
 * Fixes: right-swipe (back) not working on mobile.
 *
 * Root cause: the window-level touchend handler relies on g.current which
 * can be nulled before touchend fires in certain scroll/cancel scenarios.
 * This patch adds a container-level listener that takes over swipe routing
 * for BOTH directions, dispatching PointerEvents on the nav buttons so the
 * React handlers (which directly call flipPrev / flipNext) fire cleanly.
 */
(function () {
    'use strict';

    function waitFor(sel, cb) {
        var el = document.querySelector(sel);
        if (el) { cb(el); return; }
        var obs = new MutationObserver(function () {
            var found = document.querySelector(sel);
            if (found) { obs.disconnect(); cb(found); }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }

    waitFor('.gm-book-container', function (container) {

        var startX = 0, startY = 0, startTime = 0, tracking = false;

        /* ── touch start: record finger position ── */
        container.addEventListener('touchstart', function (e) {
            if (e.touches.length !== 1) { tracking = false; return; }
            /* ignore taps on nav buttons — they have their own handlers */
            if (e.target.closest('.gm-nav-btn')) { tracking = false; return; }
            startX    = e.touches[0].clientX;
            startY    = e.touches[0].clientY;
            startTime = Date.now();
            tracking  = true;
        }, { passive: true });

        /* ── touch end: decide direction and route to the right button ── */
        container.addEventListener('touchend', function (e) {
            if (!tracking || e.changedTouches.length !== 1) {
                tracking = false;
                return;
            }
            tracking = false;

            var endX = e.changedTouches[0].clientX;
            var endY = e.changedTouches[0].clientY;
            var dx   = endX - startX;
            var dy   = endY - startY;
            var dt   = Date.now() - startTime;

            /* Qualifiers for a valid horizontal swipe:
               - at least 35px horizontal travel
               - more horizontal than vertical (not a scroll)
               - completed within 600ms                          */
            if (Math.abs(dx) < 35 || Math.abs(dy) > Math.abs(dx) || dt > 600) return;

            /* Stop the event from reaching the window-level handler,
               which would otherwise call flipPrev/flipNext a second time. */
            e.stopPropagation();

            /* Route to the correct nav button via PointerEvent —
               the button's onPointerUp handler (React) calls flipPrev/flipNext. */
            var label = dx > 0 ? 'Prethodna' : 'Sledeća';
            var btn   = container.querySelector('[aria-label="' + label + '"]');
            if (btn && !btn.disabled) {
                btn.dispatchEvent(new PointerEvent('pointerup', {
                    bubbles: true, cancelable: true, pointerType: 'touch'
                }));
            }
        }, { passive: true });

        /* ── touch cancel: clean reset, no action ── */
        container.addEventListener('touchcancel', function () {
            tracking = false;
        }, { passive: true });
    });

}());
