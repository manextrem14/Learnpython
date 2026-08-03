

(function() {
    'use strict';

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    let scrollTicking = false;
    let menuOpen = false;

    /* ─── Scroll State ─── */
    function updateNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        scrollTicking = false;
    }

    function onScroll() {
        if (!scrollTicking) {
            window.requestAnimationFrame(updateNavbarScroll);
            scrollTicking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateNavbarScroll();

    /* ─── Mobile Menu ─── */
    function toggleMenu(forceState) {
        if (!navToggle || !navMenu) return;
        menuOpen = typeof forceState === 'boolean' ? forceState : !menuOpen;
        navToggle.setAttribute('aria-expanded', menuOpen);
        navMenu.classList.toggle('open', menuOpen);
        document.body.style.overflow = menuOpen ? 'hidden' : '';
    }

    function closeMenu() {
        if (menuOpen) toggleMenu(false);
    }

    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    /* ─── Close on link click ─── */
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeMenu();
        });
    });

    /* ─── Close on outside click ─── */
    document.addEventListener('click', (e) => {
        if (menuOpen && navMenu && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    /* ─── Keyboard: Escape to close ─── */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) closeMenu();
    });

    /* ─── Active Link Highlighting ─── */
    function setActiveLink() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        const pageName = currentPath.split('/').pop() || 'index.html';

        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');

            const href = link.getAttribute('href');
            if (!href) return;

            const isIndex = pageName === '' || pageName === 'index.html';
            const linkPage = href.split('?')[0].split('#')[0];

            if (isIndex && (linkPage === 'index.html' || linkPage === './' || linkPage === '/')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else if (!isIndex && currentPath.includes(linkPage.replace('pages/', ''))) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else if (href === currentPath + currentHash) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    setActiveLink();

    /* ─── Smooth Scroll for Anchors ─── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                if (menuOpen) closeMenu();

                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        });
    });

    /* ─── Page Transition Helper ─── */
    function handlePageTransition() {
        window.scrollTo({ top: 0, behavior: 'instant' });
        setActiveLink();
        updateNavbarScroll();
        closeMenu();
    }

    window.addEventListener('pageshow', handlePageTransition);

    /* ─── Resize Handler ─── */
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768 && menuOpen) {
                closeMenu();
            }
        }, 150);
    });

    /* ─── Focus Trap for Mobile Menu ─── */
    if (navMenu) {
        navMenu.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab' || !menuOpen) return;

            const focusable = navMenu.querySelectorAll('a[href], button');
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        });
    }

    /* ─── Public API ─── */
    window.Navigation = {
        closeMenu,
        setActiveLink,
        refresh: handlePageTransition
    };
})();