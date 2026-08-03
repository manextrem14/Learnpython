

(function() {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    /* ─── Intersection Observer Factory ─── */
    function createObserver(selector, callback, options = {}) {
        const defaultOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        const opts = { ...defaultOptions, ...options };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    if (!entry.target.dataset.repeat) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, opts);

        document.querySelectorAll(selector).forEach(el => observer.observe(el));
        return observer;
    }

    /* ─── Fade Up Reveal ─── */
    function initFadeUp() {
        if (prefersReducedMotion) {
            document.querySelectorAll('[data-animate]').forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        const style = document.createElement('style');
        style.textContent = `
            [data-animate="fade-up"] {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
                            transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
            }
            [data-animate="fade-up"].is-visible {
                opacity: 1;
                transform: translateY(0);
            }
            [data-animate="fade-in"] {
                opacity: 0;
                transition: opacity 0.6s ease;
            }
            [data-animate="fade-in"].is-visible {
                opacity: 1;
            }
            [data-animate="scale-in"] {
                opacity: 0;
                transform: scale(0.95);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            [data-animate="scale-in"].is-visible {
                opacity: 1;
                transform: scale(1);
            }
        `;
        document.head.appendChild(style);

        createObserver('[data-animate]', (el) => {
            const delay = el.dataset.delay;
            if (delay) el.style.transitionDelay = `${delay}ms`;
            el.classList.add('is-visible');
        });
    }

    /* ─── Stagger Children ─── */
    function initStagger() {
        if (prefersReducedMotion) return;

        document.querySelectorAll('[data-stagger]').forEach(parent => {
            const children = parent.children;
            const baseDelay = parseInt(parent.dataset.stagger) || 100;

            Array.from(children).forEach((child, i) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(20px)';
                child.style.transition = `opacity 0.5s ease ${i * baseDelay}ms, transform 0.5s ease ${i * baseDelay}ms`;
            });

            createObserver('[data-stagger]', (el) => {
                Array.from(el.children).forEach(child => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                });
            }, { threshold: 0.05 });
        });
    }

    /* ─── Stat Counter ─── */
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        if (!counters.length) return;

        const duration = prefersReducedMotion ? 0 : 2000;

        function animateCounter(el) {
            const target = parseInt(el.dataset.count, 10);
            const startTime = performance.now();
            const startValue = 0;

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(startValue + (target - startValue) * eased);

                el.textContent = current.toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target.toLocaleString();
                    el.classList.add('is-done');
                }
            }

            if (duration === 0) {
                el.textContent = target.toLocaleString();
            } else {
                requestAnimationFrame(update);
            }
        }

        createObserver('[data-count]', animateCounter, { threshold: 0.5 });
    }

    /* ─── Parallax Elements ─── */
    function initParallax() {
        if (prefersReducedMotion || isTouchDevice) return;

        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (!parallaxElements.length) return;

        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.1;
                const rect = el.getBoundingClientRect();
                const centerOffset = (rect.top + rect.height / 2) - window.innerHeight / 2;
                el.style.transform = `translateY(${centerOffset * speed}px)`;
            });
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    /* ─── Roadmap Line Draw ─── */
    function initRoadmapLine() {
        const line = document.querySelector('.roadmap-line');
        if (!line) return;

        function updateLine() {
            const cards = document.querySelectorAll('.roadmap-card');
            if (!cards.length) return;

            const first = cards[0].getBoundingClientRect();
            const last = cards[cards.length - 1].getBoundingClientRect();
            const container = line.parentElement.getBoundingClientRect();

            const top = first.top - container.top + first.height / 2;
            const bottom = last.top - container.top + last.height / 2;

            line.style.top = `${top}px`;
            line.style.height = `${bottom - top}px`;
        }

        window.addEventListener('load', updateLine);
        window.addEventListener('resize', updateLine);
        setTimeout(updateLine, 100);
    }

    /* ─── Challenge Card Hover Tilt ─── */
    function initTilt() {
        if (prefersReducedMotion || isTouchDevice) return;

        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.4s ease';
                setTimeout(() => { card.style.transition = ''; }, 400);
            });
        });
    }

    /* ─── Page Load Sequence ─── */
    function initLoadSequence() {
        if (prefersReducedMotion) return;

        const hero = document.querySelector('.hero');
        if (!hero) return;

        const elements = hero.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-actions, .hero-stats');
        elements.forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.6s ease ${i * 120}ms, transform 0.6s ease ${i * 120}ms`;
        });

        requestAnimationFrame(() => {
            setTimeout(() => {
                elements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                });
            }, 100);
        });
    }

    /* ─── Scroll Progress Indicator ─── */
    function initScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;

        function update() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = `${progress}%`;
        }

        window.addEventListener('scroll', update, { passive: true });
        update();
    }

    /* ─── Reveal on Scroll (Generic) ─── */
    function initReveal() {
        if (prefersReducedMotion) {
            document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
            return;
        }

        const style = document.createElement('style');
        style.textContent = `
            .reveal {
                opacity: 0;
                transform: translateY(24px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            .reveal.is-visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);

        createObserver('.reveal', (el) => el.classList.add('is-visible'));
    }

    /* ─── Initialize All ─── */
    function init() {
        initFadeUp();
        initStagger();
        initCounters();
        initParallax();
        initRoadmapLine();
        initTilt();
        initLoadSequence();
        initScrollProgress();
        initReveal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* ─── Public API ─── */
    window.Animation = {
        refresh() {
            init();
        },
        observe: createObserver,
        prefersReducedMotion
    };
})();