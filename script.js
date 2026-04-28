// Video early-init — počni učitavanje što ranije, ne čekaj loading screen
(function () {
    const v = document.getElementById('heroVideo');
    if (!v) return;
    // preload=auto je već na elementu; ovo osigurava play čim browser dozvoli
    v.load();
    const tryPlay = () => v.play().catch(() => {});
    v.addEventListener('canplay', tryPlay, { once: true });
    // Fallback za slučaj da canplay ne okine (npr. iOS Low Data Mode)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && v.paused) tryPlay();
    });
})();

document.addEventListener('DOMContentLoaded', () => {

    const $ = id => document.getElementById(id);
    const $$ = sel => document.querySelectorAll(sel);

    const loadingScreen    = $('loadingScreen');
    const header           = $('header');
    const searchBtn        = $('searchBtn');
    const searchOverlay    = $('searchOverlay');
    const searchClose      = $('searchClose');
    const searchInput      = $('searchInput');
    const menuBtn          = $('menuBtn');
    const mobileMenu       = $('mobileMenu');
    const mobileClose      = $('mobileClose');
    const mobileMenuBg     = $('mobileMenuBg');
    const floatingReserve  = $('floatingReserve');
    const reservationModal = $('reservationModal');
    const modalClose       = $('modalClose');
    const reservationForm  = $('reservationForm');
    const modalForm        = $('modalForm');
    const notification     = $('notification');
    const heroScroll       = $('heroScroll');
    const scrollTopBtn     = $('scrollTop');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const anyCoarsePointer = window.matchMedia('(any-pointer: coarse)').matches;
    const saveDataEnabled = Boolean(navigator.connection && navigator.connection.saveData);
    const lowCpuDevice = (navigator.hardwareConcurrency || 8) <= 4;
    /* Lenis + ScrollTrigger na touch-first uređajima pravi skokove; hover+miš = desktop. (Na nekim Windows touch laptopovima `pointer: coarse` i `fine` mogu oba biti true — zato hover.) */
    const preferLenisPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const useLenis = !reduceMotion && typeof Lenis !== 'undefined' && preferLenisPointer;
    if (!reduceMotion && (saveDataEnabled || lowCpuDevice)) {
        document.documentElement.classList.add('lite-animations');
    }

    let lenis = null;
    let lastScrollY = 0;
    let parallaxX = 0;
    let parallaxY = 0;

    const updateAmbientParallax = () => {
        if (reduceMotion) return;
        const sy = lastScrollY * 0.028;
        const atmo = $('heroAtmosphere');
        const mol = $('moleculeField');
        const trustGrid = $('trustGrid');
        const pScale = anyCoarsePointer ? 0.5 : 1;
        const px = parallaxX * pScale;
        const py = parallaxY * pScale;
        const mx = px * 16;
        const my = py * 12;
        if (atmo) atmo.style.transform = `translate3d(${mx}px,${my + sy}px,0)`;
        if (mol) mol.style.transform = `translate3d(${px * -10}px,${py * -8}px,0)`;
        if (trustGrid) trustGrid.style.transform = `translate3d(${px * 5}px,${py * 4}px,0)`;
    };

    const syncLenisScrollLock = () => {
        if (!lenis) return;
        document.body.classList.contains('no-scroll') ? lenis.stop() : lenis.start();
    };

    if (useLenis) {
        lenis = new Lenis({
            duration: 1.55,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
            mouseMultiplier: 0.85,
        });
        const lenisRaf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(lenisRaf);
        };
        requestAnimationFrame(lenisRaf);

        lenis.on('scroll', ({ scroll }) => {
            const y = scroll;
            lastScrollY = y;
            if (header) header.classList.toggle('scrolled', y > 60);
            if (floatingReserve) floatingReserve.classList.toggle('visible', y > window.innerHeight * 0.5);
            updateAmbientParallax();
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
        });

        new MutationObserver(syncLenisScrollLock).observe(document.body, {
            attributes: true,
            attributeFilter: ['class'],
        });
        syncLenisScrollLock();
    } else {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            lastScrollY = y;
            if (header) header.classList.toggle('scrolled', y > 60);
            if (floatingReserve) floatingReserve.classList.toggle('visible', y > window.innerHeight * 0.5);
            updateAmbientParallax();
            if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
        });
    }

    if (!reduceMotion && finePointer) {
        window.addEventListener(
            'mousemove',
            (e) => {
                parallaxX = e.clientX / window.innerWidth - 0.5;
                parallaxY = e.clientY / window.innerHeight - 0.5;
                updateAmbientParallax();
            },
            { passive: true }
        );
    }

    if (!reduceMotion && anyCoarsePointer) {
        document.documentElement.classList.add('immersive-touch');
        const applyTouchParallax = (e) => {
            const t = e.touches && e.touches[0];
            if (!t) return;
            parallaxX = t.clientX / window.innerWidth - 0.5;
            parallaxY = t.clientY / window.innerHeight - 0.5;
            updateAmbientParallax();
        };
        window.addEventListener('touchstart', applyTouchParallax, { passive: true });
        window.addEventListener('touchmove', applyTouchParallax, { passive: true });
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.config({ ignoreMobileResize: true });
        if (lenis) {
            ScrollTrigger.scrollerProxy(document.documentElement, {
                scrollTop(value) {
                    if (arguments.length) lenis.scrollTo(value, { immediate: true });
                    return lenis.scroll;
                },
                getBoundingClientRect() {
                    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
                },
            });
        }
        requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    requestAnimationFrame(() => updateAmbientParallax());

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let cursorRunning = true;

    const cursorDarkBgSel = '.hero, .trust-immersive';

    if (finePointer && !reduceMotion && cursorDot && cursorRing) {
        document.documentElement.classList.add('immersive-cursor');
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
            const t = e.target;
            const onDark = t && t.closest && t.closest(cursorDarkBgSel);
            document.documentElement.classList.toggle('cursor-on-dark', Boolean(onDark));
        });
        document.addEventListener('visibilitychange', () => { cursorRunning = !document.hidden; });
        const renderCursor = () => {
            if (cursorRunning) {
                ringX += (mouseX - ringX) * 0.14;
                ringY += (mouseY - ringY) * 0.14;
                cursorRing.style.left = `${ringX}px`;
                cursorRing.style.top = `${ringY}px`;
            }
            requestAnimationFrame(renderCursor);
        };
        renderCursor();

        const cursorHoverSel =
            'a, button, input, textarea, select, .btn, .service-card, .menu-card, .hero-scroll, .menu-tab, .menu-diet-btn, .nav-search, .scroll-top, .floating-reserve, .mobile-link, .collage-item, .modal-close, .search-close, .social-link, .nav-home, .nav-logo-wrap';
        document.addEventListener(
            'mouseover',
            (e) => {
                const t = e.target;
                if (t && t.closest && t.closest(cursorHoverSel)) document.body.classList.add('cursor-hover');
            },
            true
        );
        document.addEventListener(
            'mouseout',
            (e) => {
                const rel = e.relatedTarget;
                const t = e.target;
                if (!t || !t.closest) return;
                if (t.closest(cursorHoverSel) && (!rel || !rel.closest || !rel.closest(cursorHoverSel))) {
                    document.body.classList.remove('cursor-hover');
                }
            },
            true
        );

        $$('.btn:not(.btn-ghost)').forEach((btn) => {
            btn.classList.add('magnetic-btn');
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const x = e.clientX - rect.left - cx;
                const y = e.clientY - rect.top - cy;
                btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // ═══════ LOADING ═══════
    document.body.classList.add('no-scroll');
    const start = Date.now();
    const MIN_SPLASH_MS = 3600;
    const LOAD_FAILSAFE_MS = 12000;

    const finishSplash = () => {
        if (!loadingScreen || loadingScreen.dataset.splashDone === '1') return;
        loadingScreen.dataset.splashDone = '1';
        const wait = Math.max(0, MIN_SPLASH_MS - (Date.now() - start));
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            document.body.classList.remove('no-scroll');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                const heroVideo = document.querySelector('.hero-video');
                if (heroVideo) heroVideo.play().catch(() => {});
                requestAnimationFrame(() => {
                    document.querySelector('.hero-reveal')?.classList.add('visible');
                });
                syncLenisScrollLock();
            }, 800);
        }, wait);
    };

    window.addEventListener('load', finishSplash);
    setTimeout(finishSplash, LOAD_FAILSAFE_MS);

    // ═══════ SCROLL EVENTS ═══════
    /* Header / floating — Lenis lenis.on('scroll') ili fallback window scroll iznad */

    // ═══════ SEARCH ═══════
    const openSearch = () => {
        if (!searchOverlay) return;
        searchOverlay.classList.add('active');
        document.body.classList.add('no-scroll');
        setTimeout(() => searchInput?.focus(), 300);
    };
    const closeSearch = () => {
        if (!searchOverlay) return;
        searchOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
        if (searchInput) searchInput.value = '';
    };
    if (searchBtn) searchBtn.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);
    if (searchOverlay) searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
    $$('.search-suggestions a').forEach(a => a.addEventListener('click', closeSearch));

    // ═══════ MOBILE MENU ═══════
    const openMobile = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.add('active');
        document.body.classList.add('no-scroll');
    };
    const closeMobile = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };
    if (menuBtn) menuBtn.addEventListener('click', openMobile);
    if (mobileClose) mobileClose.addEventListener('click', closeMobile);
    if (mobileMenuBg) mobileMenuBg.addEventListener('click', closeMobile);
    $$('#mobileMenu a').forEach(l => l.addEventListener('click', closeMobile));

    // ═══════ MODAL ═══════
    const openModal = () => {
        if (!reservationModal) return;
        reservationModal.classList.add('active');
        document.body.classList.add('no-scroll');
    };
    const closeModal = () => {
        if (!reservationModal) return;
        reservationModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };
    if (floatingReserve) floatingReserve.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (reservationModal) reservationModal.addEventListener('click', e => { if (e.target === reservationModal) closeModal(); });

    // ═══════ FORMS ═══════
    const showNotif = () => {
        if (!notification) return;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 4000);
    };
    const handleSubmit = e => { e.preventDefault(); showNotif(); e.target.reset(); };
    if (reservationForm) reservationForm.addEventListener('submit', handleSubmit);
    if (modalForm) modalForm.addEventListener('submit', e => { handleSubmit(e); closeModal(); });

    // ═══════ MENU TABS + DIET FILTER (legacy grid — preskoči ako je 3D meni) ═══════
    const menuGridWrap = $('menuGridWrap');
    const menuCards = $$('#menuGrid .menu-card');
    if (menuGridWrap && menuCards.length) {
        const menuTabs = $$('.menu-tab');
        const menuDietBar = $('menuDietBar');
        const menuDietBtns = $$('.menu-diet-btn');
        const menuScrollHint = $('menuScrollHint');

        let activeCategory = 'starters';
        let activeDiet = 'all';

        const getCardKinds = card =>
            (card.dataset.kinds || '').trim().split(/\s+/).filter(Boolean);

        const updateMenuScrollHint = () => {
            const el = menuGridWrap;
            if (!el) return;
            const canScroll = el.scrollHeight > el.clientHeight + 4;
            if (menuScrollHint) menuScrollHint.style.display = canScroll ? '' : 'none';
        };

        const applyMenuVisibility = () => {
            let idx = 0;
            menuCards.forEach(card => {
                const cat = card.dataset.category;
                const inCat = cat === activeCategory;
                let passDiet = true;
                if (inCat && (activeCategory === 'starters' || activeCategory === 'mains')) {
                    const isGroup = card.classList.contains('menu-card--group');
                    if (activeDiet === 'all') passDiet = true;
                    else if (isGroup) passDiet = false;
                    else {
                        const kinds = getCardKinds(card);
                        passDiet = kinds.includes(activeDiet);
                    }
                }
                const show = inCat && passDiet;
                if (show) {
                    card.style.display = '';
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = `fadeUp .45s ${idx * .06}s both`;
                    idx++;
                } else {
                    card.style.display = 'none';
                }
            });
            if (menuGridWrap) menuGridWrap.scrollTop = 0;
            requestAnimationFrame(updateMenuScrollHint);
        };

        menuTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const cat = tab.dataset.category;
                menuTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                activeCategory = cat;
                if (cat === 'starters' || cat === 'mains') {
                    menuDietBar?.classList.add('is-visible');
                    if (cat === 'mains') {
                        menuDietBar?.classList.add('mains-tab');
                        if (activeDiet === 'dodaci') {
                            activeDiet = 'all';
                            menuDietBtns.forEach(b => b.classList.toggle('active', b.dataset.diet === 'all'));
                        }
                    } else {
                        menuDietBar?.classList.remove('mains-tab');
                    }
                } else {
                    menuDietBar?.classList.remove('is-visible');
                    menuDietBar?.classList.remove('mains-tab');
                    activeDiet = 'all';
                    menuDietBtns.forEach(b => b.classList.toggle('active', b.dataset.diet === 'all'));
                }
                applyMenuVisibility();
            });
        });

        menuDietBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const d = btn.dataset.diet;
                activeDiet = d;
                menuDietBtns.forEach(b => b.classList.toggle('active', b.dataset.diet === d));
                applyMenuVisibility();
            });
        });

        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(updateMenuScrollHint).observe(menuGridWrap);
        }
        window.addEventListener('resize', updateMenuScrollHint);

        if (lenis) {
            menuGridWrap.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
        }

        applyMenuVisibility();
    }

    // ═══════ PARALLAX DIVIDERS + VINE ROOTS ═══════
    const parallaxDividers = $$('.parallax-divider');
    const vineDecos = $$('.vine-deco');

    if (!reduceMotion) {
        // --- Parallax image dividers ---
        const activeParallax = new Set();
        if (parallaxDividers.length) {
            const parallaxObs = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) activeParallax.add(e.target);
                    else activeParallax.delete(e.target);
                });
            }, { rootMargin: '200px 0px 200px 0px' });
            parallaxDividers.forEach(d => parallaxObs.observe(d));
        }

        // --- Vine / root drawing on scroll ---
        const vineData = new Map();
        if (vineDecos.length) {
            vineDecos.forEach(vine => {
                const trunks = vine.querySelectorAll('.vine-trunk');
                const branches = vine.querySelectorAll('.vine-branch');
                const trunkLens = [];
                const branchLens = [];
                trunks.forEach(p => {
                    const len = p.getTotalLength ? p.getTotalLength() : 2000;
                    p.style.strokeDasharray = len;
                    p.style.strokeDashoffset = len;
                    trunkLens.push(len);
                });
                branches.forEach(p => {
                    const len = p.getTotalLength ? p.getTotalLength() : 400;
                    p.style.strokeDasharray = len;
                    p.style.strokeDashoffset = len;
                    branchLens.push(len);
                });
                vineData.set(vine, { trunks, branches, trunkLens, branchLens });
            });

            const vineObs = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) e.target.classList.add('vine-visible');
                });
            }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });
            vineDecos.forEach(v => vineObs.observe(v));
        }

        // --- Combined scroll update (parallax + vines) ---
        let scrollTicking = false;
        const updateScrollEffects = () => {
            const viewH = window.innerHeight;

            // Parallax dividers
            activeParallax.forEach(divider => {
                const img = divider.querySelector('.parallax-img');
                if (!img) return;
                const speed = parseFloat(divider.dataset.speed) || 0.5;
                const rect = divider.getBoundingClientRect();
                const progress = (viewH - rect.top) / (viewH + rect.height);
                const translate = (progress - 0.5) * speed * 80;
                img.style.transform = `translate3d(0,${translate}%,0)`;
            });

            // Vine drawing
            vineData.forEach((data, vine) => {
                if (!vine.classList.contains('vine-visible')) return;
                const section = vine.closest('section');
                if (!section) return;
                const rect = section.getBoundingClientRect();
                // Progress 0→1 as section scrolls through viewport
                const rawProgress = (viewH - rect.top) / (viewH + rect.height);
                const progress = Math.max(0, Math.min(1, rawProgress));
                // Draw trunk: 0→100% over full scroll
                const trunkDraw = progress;
                data.trunks.forEach((p, i) => {
                    const len = data.trunkLens[i];
                    p.style.strokeDashoffset = len * (1 - trunkDraw);
                });
                // Draw branches: start at 20%, finish at 80%
                const branchDraw = Math.max(0, Math.min(1, (progress - 0.15) / 0.6));
                data.branches.forEach((p, i) => {
                    const len = data.branchLens[i];
                    p.style.strokeDashoffset = len * (1 - branchDraw);
                });

                // Subtle vine parallax shift
                const vineShift = (progress - 0.5) * 20;
                vine.style.transform = `translate3d(0,${vineShift}px,0)`;
            });

            scrollTicking = false;
        };

        const requestScrollUpdate = () => {
            if (!scrollTicking) {
                scrollTicking = true;
                requestAnimationFrame(updateScrollEffects);
            }
        };

        if (lenis) lenis.on('scroll', requestScrollUpdate);
        else window.addEventListener('scroll', requestScrollUpdate, { passive: true });
        requestAnimationFrame(updateScrollEffects);
    }

    // ═══════ SCROLL REVEAL ═══════
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
        });
    }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => revealObs.observe(el));

    // ═══════ TRUST RATINGS — mobilni trak: početak na Facebook (srednji), levo/desno ostale ═══════
    const trustRatingsRail = document.querySelector('.trust-ratings');
    const mqTrustRatingsMobile = window.matchMedia('(max-width: 600px)');
    const centerTrustRatingsOnFacebook = () => {
        if (!mqTrustRatingsMobile.matches || !trustRatingsRail) return;
        const fb = trustRatingsRail.querySelector('[data-trust-rail-center]');
        if (!fb) return;
        if (trustRatingsRail.scrollWidth <= trustRatingsRail.clientWidth + 2) return;
        const railRect = trustRatingsRail.getBoundingClientRect();
        const fbRect = fb.getBoundingClientRect();
        const fbLeftInRail = fbRect.left - railRect.left + trustRatingsRail.scrollLeft;
        const target = fbLeftInRail - (trustRatingsRail.clientWidth - fb.offsetWidth) / 2;
        const maxScroll = trustRatingsRail.scrollWidth - trustRatingsRail.clientWidth;
        trustRatingsRail.scrollLeft = Math.max(0, Math.min(target, maxScroll));
    };
    let trustRatingsResizeTimer;
    if (trustRatingsRail) {
        const scheduleCenter = () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(centerTrustRatingsOnFacebook);
            });
        };
        const railIo = new IntersectionObserver(
            (entries) => {
                entries.forEach((en) => {
                    if (en.isIntersecting && mqTrustRatingsMobile.matches) scheduleCenter();
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        );
        railIo.observe(trustRatingsRail);
        window.addEventListener('resize', () => {
            clearTimeout(trustRatingsResizeTimer);
            trustRatingsResizeTimer = setTimeout(() => {
                if (mqTrustRatingsMobile.matches) scheduleCenter();
            }, 150);
        });
    }

    // ═══════ UNIFIED VINE + PARALLAX SYSTEM ═══════
    // All vine groups are registered here and drawn in ONE scroll handler
    const vineGroups = [];  // { section, vineData, trunkSel, branchSel, branchStart, branchRange, applyTransform }

    const initVineGroup = (cfg) => {
        const { section, vines, trunkSel, branchSel, branchStart, branchRange, applyTransform, rightClass } = cfg;
        if (!section || !vines.length || reduceMotion) return;
        const vineData = new Map();
        vines.forEach(vine => {
            const trunks = vine.querySelectorAll(trunkSel);
            const branches = vine.querySelectorAll(branchSel);
            const trunkLens = [], branchLens = [];
            trunks.forEach(p => { const len = typeof p.getTotalLength === 'function' ? p.getTotalLength() : 2000; trunkLens.push(len); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
            branches.forEach(p => { const len = typeof p.getTotalLength === 'function' ? p.getTotalLength() : 400; branchLens.push(len); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
            vineData.set(vine, { trunks, branches, trunkLens, branchLens });
        });
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => e.target.classList.toggle('vine-visible', e.isIntersecting));
        }, { threshold: 0.02 });
        vines.forEach(v => obs.observe(v));
        vineGroups.push({ section, vineData, branchStart: branchStart || 0.15, branchRange: branchRange || 0.6, applyTransform: applyTransform || false, rightClass: rightClass || '', shiftAmount: cfg.shiftAmount || 20 });
    };

    // Trust
    const trustSection = document.querySelector('.trust-immersive');
    const trustParallaxImg = document.querySelector('.trust-parallax-img');
    if (trustSection && trustParallaxImg && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
        gsap.to(trustParallaxImg, { yPercent: 15, ease: 'none', scrollTrigger: { trigger: trustSection, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
    }
    initVineGroup({ section: trustSection, vines: [...$$('.trust-vine')], trunkSel: '.tv-trunk', branchSel: '.tv-branch', branchStart: 0.15, branchRange: 0.6, applyTransform: true, rightClass: 'trust-vine--right', shiftAmount: 20 });

    // Finale
    initVineGroup({ section: document.getElementById('organicFinale'), vines: [...$$('.finale-vine')], trunkSel: '.fv-trunk', branchSel: '.fv-branch', branchStart: 0.2, branchRange: 0.5 });

    // Reservation
    const resSection = document.querySelector('.reservation--parallax');
    const resParallaxImg = document.querySelector('.reservation-parallax-img');
    if (resSection && resParallaxImg && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduceMotion) {
        gsap.to(resParallaxImg, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: resSection, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    }
    initVineGroup({ section: resSection, vines: [...$$('.res-vine')], trunkSel: '.rv-trunk', branchSel: '.rv-branch', branchStart: 0.12, branchRange: 0.55, applyTransform: true, rightClass: 'res-vine--right', shiftAmount: 18 });

    // Footer
    initVineGroup({ section: document.querySelector('.footer--organic'), vines: [...$$('.footer-vine')], trunkSel: '.ftv-trunk', branchSel: '.ftv-branch', branchStart: 0.2, branchRange: 0.5 });

    // ONE unified scroll handler for ALL vine groups
    if (vineGroups.length && !reduceMotion) {
        let vineTicking = false;
        const drawAllVines = () => {
            const viewH = window.innerHeight;
            for (let g = 0; g < vineGroups.length; g++) {
                const { section, vineData, branchStart, branchRange, applyTransform, rightClass, shiftAmount } = vineGroups[g];
                const sRect = section.getBoundingClientRect();
                // Skip sections far off-screen
                if (sRect.bottom < -200 || sRect.top > viewH + 200) continue;
                const rawP = (viewH - sRect.top) / (viewH + sRect.height);
                const progress = rawP < 0 ? 0 : rawP > 1 ? 1 : rawP;
                vineData.forEach((data, vine) => {
                    if (!vine.classList.contains('vine-visible')) return;
                    for (let i = 0; i < data.trunks.length; i++) data.trunks[i].style.strokeDashoffset = data.trunkLens[i] * (1 - progress);
                    const bd = (progress - branchStart) / branchRange;
                    const branchDraw = bd < 0 ? 0 : bd > 1 ? 1 : bd;
                    for (let i = 0; i < data.branches.length; i++) data.branches[i].style.strokeDashoffset = data.branchLens[i] * (1 - branchDraw);
                    if (applyTransform) {
                        const shift = (progress - 0.5) * shiftAmount;
                        vine.style.transform = (rightClass && vine.classList.contains(rightClass))
                            ? `scaleX(-1) translate3d(0,${shift}px,0)` : `translate3d(0,${shift}px,0)`;
                    }
                });
            }
            vineTicking = false;
        };
        const requestVineUpdate = () => { if (!vineTicking) { vineTicking = true; requestAnimationFrame(drawAllVines); } };
        if (lenis) lenis.on('scroll', requestVineUpdate);
        else window.addEventListener('scroll', requestVineUpdate, { passive: true });
        requestAnimationFrame(drawAllVines);
    }

    // Add trust cards to cursor hover selector
    if (finePointer && !reduceMotion) {
        const cursorHoverTrust = '.trust-card, .trust-rating-badge';
        document.addEventListener('mouseover', (e) => {
            if (e.target && e.target.closest && e.target.closest(cursorHoverTrust))
                document.body.classList.add('cursor-hover');
        }, true);
        document.addEventListener('mouseout', (e) => {
            const rel = e.relatedTarget;
            const t = e.target;
            if (!t || !t.closest) return;
            if (t.closest(cursorHoverTrust) && (!rel || !rel.closest || !rel.closest(cursorHoverTrust)))
                document.body.classList.remove('cursor-hover');
        }, true);
    }

    // ═══════ STAT COUNTERS ═══════
    const countObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const el = e.target;
                const target = Number.parseInt(el.dataset.count, 10);
                if (!Number.isFinite(target) || target < 0) {
                    countObs.unobserve(el);
                    return;
                }
                let cur = 0;
                const inc = target / 50;
                const plus = target > 1 ? '+' : '';
                const timer = setInterval(() => {
                    cur += inc;
                    if (cur >= target) {
                        cur = target;
                        clearInterval(timer);
                    }
                    el.textContent = Math.floor(cur) + plus;
                }, 35);
                countObs.unobserve(el);
            }
        });
    }, { threshold: .5 });
    $$('.mini-stat-num').forEach(el => countObs.observe(el));

    // ═══════ RESERVATION AMBIENCE — pauses when not visible ═══════
    const ambiencePlayer = $('reservationAmbiencePlayer');
    const ambienceImg = $('reservationAmbienceImg');
    if (ambiencePlayer && ambienceImg) {
        const images = (ambiencePlayer.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);
        const intervalMs = Math.max(200, parseInt(ambiencePlayer.dataset.interval || '500', 10) || 500);
        const loop = ambiencePlayer.dataset.loop !== 'false';
        if (images.length === 0) { ambienceImg.removeAttribute('src'); ambienceImg.alt = ''; }
        else {
            images.forEach(src => { const im = new Image(); im.src = src; });
            ambienceImg.src = images[0];
            let idx = 0, ambienceTimer = null, ambienceVisible = false;
            const startAmbience = () => { if (ambienceTimer || images.length < 2 || reduceMotion) return; ambienceTimer = setInterval(() => { let next = idx + 1; if (next >= images.length) { if (!loop) { clearInterval(ambienceTimer); ambienceTimer = null; return; } next = 0; } idx = next; ambienceImg.src = images[idx]; }, intervalMs); };
            const stopAmbience = () => { if (ambienceTimer) { clearInterval(ambienceTimer); ambienceTimer = null; } };
            const ambienceObs = new IntersectionObserver(entries => { entries.forEach(e => { ambienceVisible = e.isIntersecting; if (ambienceVisible) startAmbience(); else stopAmbience(); }); }, { rootMargin: '100px' });
            ambienceObs.observe(ambiencePlayer);
        }
    }

    const scrollToTarget = (el, offsetExtra = 0) => {
        if (!el || !header) return;
        const off = header.offsetHeight + offsetExtra;
        if (lenis) {
            lenis.scrollTo(el, { offset: -off, duration: 1.25 });
        } else {
            const top = el.getBoundingClientRect().top + window.scrollY - off;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
    };

    // ═══════ SCROLL ACTIONS ═══════
    if (heroScroll) {
        heroScroll.addEventListener('click', () => {
            const t = document.getElementById('about');
            scrollToTarget(t);
        });
    }
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            if (lenis) lenis.scrollTo(0, { duration: 1.2 });
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ═══════ SMOOTH ANCHORS ═══════
    $$('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const id = this.getAttribute('href');
            if (id === '#') return;
            const t = document.querySelector(id);
            if (t) {
                e.preventDefault();
                scrollToTarget(t);
            }
        });
    });

    // ═══════ KEYBOARD ═══════
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeSearch(); closeMobile(); closeModal(); }
    });

    // ═══════ MIN DATE ═══════
    const today = new Date().toISOString().split('T')[0];
    $$('input[type="date"]').forEach(i => i.setAttribute('min', today));
});