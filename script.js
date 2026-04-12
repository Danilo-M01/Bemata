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
    /* Lenis + ScrollTrigger na touch-first uređajima pravi skokove; hover+miš = desktop. (Na nekim Windows touch laptopovima `pointer: coarse` i `fine` mogu oba biti true — zato hover.) */
    const preferLenisPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const useLenis = !reduceMotion && typeof Lenis !== 'undefined' && preferLenisPointer;

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
        const mx = finePointer ? parallaxX * 16 : 0;
        const my = finePointer ? parallaxY * 12 : 0;
        if (atmo) atmo.style.transform = `translate3d(${mx}px,${my + sy}px,0)`;
        if (mol) {
            if (finePointer) mol.style.transform = `translate3d(${parallaxX * -10}px,${parallaxY * -8}px,0)`;
            else mol.style.transform = '';
        }
        if (trustGrid && finePointer) {
            trustGrid.style.transform = `translate3d(${parallaxX * 5}px,${parallaxY * 4}px,0)`;
        } else if (trustGrid) trustGrid.style.transform = '';
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

    if (finePointer && !reduceMotion && cursorDot && cursorRing) {
        document.documentElement.classList.add('immersive-cursor');
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });
        const renderCursor = () => {
            ringX += (mouseX - ringX) * 0.14;
            ringY += (mouseY - ringY) * 0.14;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
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
                if (heroVideo && heroVideo.play) heroVideo.play().catch(() => {});
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
    $$('.mobile-link').forEach(l => l.addEventListener('click', closeMobile));

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

    // ═══════ MENU TABS + DIET FILTER + VERTICAL SCROLL (2 kolone) ═══════
    const menuTabs = $$('.menu-tab');
    const menuCards = $$('#menuGrid .menu-card');
    const menuDietBar = $('menuDietBar');
    const menuDietBtns = $$('.menu-diet-btn');
    const menuGridWrap = $('menuGridWrap');
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

    if (menuGridWrap && typeof ResizeObserver !== 'undefined') {
        new ResizeObserver(updateMenuScrollHint).observe(menuGridWrap);
    }
    window.addEventListener('resize', updateMenuScrollHint);

    if (menuGridWrap && lenis) {
        menuGridWrap.addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });
    }

    applyMenuVisibility();

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

    // ═══════ TRUST IMMERSIVE PARALLAX & VINE BLOOM ═══════
    const trustSection = document.querySelector('.trust-immersive');
    const trustParallaxImg = document.querySelector('.trust-parallax-img');
    const trustVines = $$('.trust-vine');

    if (trustSection && !reduceMotion) {
        // Parallax background via GSAP ScrollTrigger
        if (
            trustParallaxImg &&
            typeof gsap !== 'undefined' &&
            typeof ScrollTrigger !== 'undefined' &&
            finePointer
        ) {
            gsap.to(trustParallaxImg, {
                yPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: trustSection,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.5,
                }
            });
        }

        // Vine drawing setup — same system as existing vine-deco
        const trustVineData = new Map();
        trustVines.forEach(vine => {
            const trunks = vine.querySelectorAll('.tv-trunk');
            const branches = vine.querySelectorAll('.tv-branch');
            const trunkLens = [];
            const branchLens = [];
            trunks.forEach((p) => {
                const len = typeof p.getTotalLength === 'function' ? p.getTotalLength() : 2000;
                trunkLens.push(len);
                p.style.strokeDasharray = len;
                p.style.strokeDashoffset = len;
            });
            branches.forEach((p) => {
                const len = typeof p.getTotalLength === 'function' ? p.getTotalLength() : 400;
                branchLens.push(len);
                p.style.strokeDasharray = len;
                p.style.strokeDashoffset = len;
            });
            trustVineData.set(vine, { trunks, branches, trunkLens, branchLens });
        });

        // Vine visibility + scroll-driven drawing
        const trustVineObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                e.target.classList.toggle('vine-visible', e.isIntersecting);
            });
        }, { threshold: 0.02 });
        trustVines.forEach(v => trustVineObs.observe(v));

        // Scroll-driven vine drawing in the existing scroll loop
        const drawTrustVines = () => {
            const viewH = window.innerHeight;
            trustVineData.forEach((data, vine) => {
                if (!vine.classList.contains('vine-visible')) return;
                const rect = trustSection.getBoundingClientRect();
                const rawProgress = (viewH - rect.top) / (viewH + rect.height);
                const progress = Math.max(0, Math.min(1, rawProgress));
                data.trunks.forEach((p, i) => { p.style.strokeDashoffset = data.trunkLens[i] * (1 - progress); });
                const branchDraw = Math.max(0, Math.min(1, (progress - 0.15) / 0.6));
                data.branches.forEach((p, i) => { p.style.strokeDashoffset = data.branchLens[i] * (1 - branchDraw); });
                vine.style.transform = vine.classList.contains('trust-vine--right')
                    ? `scaleX(-1) translate3d(0,${(progress - 0.5) * 20}px,0)`
                    : `translate3d(0,${(progress - 0.5) * 20}px,0)`;
            });
        };
        if (lenis) lenis.on('scroll', drawTrustVines);
        else window.addEventListener('scroll', drawTrustVines, { passive: true });
        requestAnimationFrame(drawTrustVines);
    }

    // ═══════ ORGANIC FINALE CONNECTOR VINES ═══════
    const finaleEl = document.getElementById('organicFinale');
    const finaleVines = $$('.finale-vine');
    if (finaleEl && !reduceMotion) {
        const finaleVineData = new Map();
        finaleVines.forEach(vine => {
            const trunks = vine.querySelectorAll('.fv-trunk');
            const branches = vine.querySelectorAll('.fv-branch');
            const trunkLens = [], branchLens = [];
            trunks.forEach(p => { const len = p.getTotalLength(); trunkLens.push(len); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
            branches.forEach(p => { const len = p.getTotalLength(); branchLens.push(len); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
            finaleVineData.set(vine, { trunks, branches, trunkLens, branchLens });
        });

        const finaleVineObs = new IntersectionObserver(entries => {
            entries.forEach(e => e.target.classList.toggle('vine-visible', e.isIntersecting));
        }, { threshold: 0.02 });
        finaleVines.forEach(v => finaleVineObs.observe(v));

        const drawFinaleVines = () => {
            const viewH = window.innerHeight;
            finaleVineData.forEach((data, vine) => {
                if (!vine.classList.contains('vine-visible')) return;
                const rect = finaleEl.getBoundingClientRect();
                const rawProgress = (viewH - rect.top) / (viewH + rect.height);
                const progress = Math.max(0, Math.min(1, rawProgress));
                data.trunks.forEach((p, i) => { p.style.strokeDashoffset = data.trunkLens[i] * (1 - progress); });
                const branchDraw = Math.max(0, Math.min(1, (progress - 0.2) / 0.5));
                data.branches.forEach((p, i) => { p.style.strokeDashoffset = data.branchLens[i] * (1 - branchDraw); });
            });
        };
        if (lenis) lenis.on('scroll', drawFinaleVines);
        else window.addEventListener('scroll', drawFinaleVines, { passive: true });
        requestAnimationFrame(drawFinaleVines);
    }

    // ═══════ RESERVATION PARALLAX & VINE BLOOM ═══════
    const resSection = document.querySelector('.reservation--parallax');
    const resParallaxImg = document.querySelector('.reservation-parallax-img');
    const resVines = $$('.res-vine');

    if (resSection && !reduceMotion) {
        // Parallax background via GSAP
        if (
            resParallaxImg &&
            typeof gsap !== 'undefined' &&
            typeof ScrollTrigger !== 'undefined' &&
            finePointer
        ) {
            gsap.to(resParallaxImg, {
                yPercent: 12,
                ease: 'none',
                scrollTrigger: {
                    trigger: resSection,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.6,
                }
            });
        }

        // Reservation vine drawing
        const resVineData = new Map();
        resVines.forEach(vine => {
            const trunks = vine.querySelectorAll('.rv-trunk');
            const branches = vine.querySelectorAll('.rv-branch');
            const trunkLens = [], branchLens = [];
            trunks.forEach(p => { const len = p.getTotalLength(); trunkLens.push(len); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
            branches.forEach(p => { const len = p.getTotalLength(); branchLens.push(len); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
            resVineData.set(vine, { trunks, branches, trunkLens, branchLens });
        });

        const resVineObs = new IntersectionObserver(entries => {
            entries.forEach(e => e.target.classList.toggle('vine-visible', e.isIntersecting));
        }, { threshold: 0.02 });
        resVines.forEach(v => resVineObs.observe(v));

        const drawResVines = () => {
            const viewH = window.innerHeight;
            resVineData.forEach((data, vine) => {
                if (!vine.classList.contains('vine-visible')) return;
                const rect = resSection.getBoundingClientRect();
                const rawProgress = (viewH - rect.top) / (viewH + rect.height);
                const progress = Math.max(0, Math.min(1, rawProgress));
                data.trunks.forEach((p, i) => { p.style.strokeDashoffset = data.trunkLens[i] * (1 - progress); });
                const branchDraw = Math.max(0, Math.min(1, (progress - 0.12) / 0.55));
                data.branches.forEach((p, i) => { p.style.strokeDashoffset = data.branchLens[i] * (1 - branchDraw); });
                vine.style.transform = vine.classList.contains('res-vine--right')
                    ? `scaleX(-1) translate3d(0,${(progress - 0.5) * 18}px,0)`
                    : `translate3d(0,${(progress - 0.5) * 18}px,0)`;
            });
        };
        if (lenis) lenis.on('scroll', drawResVines);
        else window.addEventListener('scroll', drawResVines, { passive: true });
        requestAnimationFrame(drawResVines);
    }

    // ═══════ FOOTER VINE DRAWING ═══════
    const footerEl = document.querySelector('.footer--organic');
    const footerVines = $$('.footer-vine');
    if (footerEl && !reduceMotion) {
        const footerVineData = new Map();
        footerVines.forEach(vine => {
            const trunks = vine.querySelectorAll('.ftv-trunk');
            const branches = vine.querySelectorAll('.ftv-branch');
            const trunkLens = [], branchLens = [];
            trunks.forEach(p => { const len = p.getTotalLength(); trunkLens.push(len); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
            branches.forEach(p => { const len = p.getTotalLength(); branchLens.push(len); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
            footerVineData.set(vine, { trunks, branches, trunkLens, branchLens });
        });

        const footerVineObs = new IntersectionObserver(entries => {
            entries.forEach(e => e.target.classList.toggle('vine-visible', e.isIntersecting));
        }, { threshold: 0.02 });
        footerVines.forEach(v => footerVineObs.observe(v));

        const drawFooterVines = () => {
            const viewH = window.innerHeight;
            footerVineData.forEach((data, vine) => {
                if (!vine.classList.contains('vine-visible')) return;
                const rect = footerEl.getBoundingClientRect();
                const rawProgress = (viewH - rect.top) / (viewH + rect.height);
                const progress = Math.max(0, Math.min(1, rawProgress));
                data.trunks.forEach((p, i) => { p.style.strokeDashoffset = data.trunkLens[i] * (1 - progress); });
                const branchDraw = Math.max(0, Math.min(1, (progress - 0.2) / 0.5));
                data.branches.forEach((p, i) => { p.style.strokeDashoffset = data.branchLens[i] * (1 - branchDraw); });
            });
        };
        if (lenis) lenis.on('scroll', drawFooterVines);
        else window.addEventListener('scroll', drawFooterVines, { passive: true });
        requestAnimationFrame(drawFooterVines);
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

    // ═══════ RESERVATION AMBIENCE — ista logika kao ImagePlayer (prompt): samo setInterval + menjanje src ═══════
    const ambiencePlayer = $('reservationAmbiencePlayer');
    const ambienceImg = $('reservationAmbienceImg');
    if (ambiencePlayer && ambienceImg) {
        const images = (ambiencePlayer.dataset.images || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
        const intervalMs = Math.max(200, parseInt(ambiencePlayer.dataset.interval || '500', 10) || 500);
        const loop = ambiencePlayer.dataset.loop !== 'false';

        if (images.length === 0) {
            ambienceImg.removeAttribute('src');
            ambienceImg.alt = '';
        } else {
            images.forEach(src => {
                const im = new Image();
                im.src = src;
            });
            ambienceImg.src = images[0];
            let idx = 0;

            if (images.length > 1 && !reduceMotion) {
                const timer = setInterval(() => {
                    let next = idx + 1;
                    if (next >= images.length) {
                        if (!loop) {
                            clearInterval(timer);
                            return;
                        }
                        next = 0;
                    }
                    idx = next;
                    ambienceImg.src = images[idx];
                }, intervalMs);
            }
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