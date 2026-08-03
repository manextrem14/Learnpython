
(function() {
    'use strict';

    
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('role', 'status');
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);

    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        const iconMap = {
            success: '✓',
            error: '✕',
            info: 'ℹ'
        };
        toast.insertAdjacentHTML('afterbegin', `<span style="margin-right:8px;font-weight:bold;">${iconMap[type] || 'ℹ'}</span>`);

        toastContainer.appendChild(toast);

        const remove = () => {
            toast.style.animation = 'toastSlideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        };

        if (duration > 0) {
            setTimeout(remove, duration);
        }

        return { dismiss: remove };
    }

    window.App = { toast: showToast };

    /* ─── Utility Helpers ─── */
    window.Utils = {
        debounce(fn, wait = 300) {
            let t;
            return (...args) => {
                clearTimeout(t);
                t = setTimeout(() => fn.apply(this, args), wait);
            };
        },

        throttle(fn, limit = 100) {
            let inThrottle;
            return (...args) => {
                if (!inThrottle) {
                    fn.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        },

        copyToClipboard(text) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(text);
            }
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            return Promise.resolve();
        },

        formatDate(isoString) {
            if (!isoString) return '';
            const d = new Date(isoString);
            return d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        },

        parseQueryParams() {
            const params = new URLSearchParams(window.location.search);
            const result = {};
            for (const [key, value] of params) {
                result[key] = value;
            }
            return result;
        },

        slugify(text) {
            return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        },

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    };

   
    window.ProgressBar = {
        render(container, current, total) {
            if (!container) return;
            const pct = total > 0 ? Math.round((current / total) * 100) : 0;
            container.innerHTML = `
                <div class="progress-track" style="
                    width:100%;
                    height:6px;
                    background:var(--bg-elevated);
                    border-radius:var(--radius-full);
                    overflow:hidden;
                ">
                    <div class="progress-fill" style="
                        width:${pct}%;
                        height:100%;
                        background:var(--gradient-primary);
                        border-radius:var(--radius-full);
                        transition:width 0.5s ease;
                    "></div>
                </div>
                <div class="progress-text" style="
                    display:flex;
                    justify-content:space-between;
                    margin-top:var(--space-2);
                    font-size:var(--text-xs);
                    color:var(--text-tertiary);
                ">
                    <span>${current} of ${total} completed</span>
                    <span>${pct}%</span>
                </div>
            `;
        }
    };

    
    window.Modal = {
        create({ title, content, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) {
            const overlay = document.createElement('div');
            overlay.className = 'modal-overlay';
            overlay.style.cssText = `
                position:fixed;inset:0;z-index:var(--z-modal,300);
                background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);
                display:flex;align-items:center;justify-content:center;
                padding:var(--space-4);opacity:0;transition:opacity 0.3s ease;
            `;

            const panel = document.createElement('div');
            panel.className = 'glass-card';
            panel.style.cssText = `
                max-width:480px;width:100%;padding:var(--space-6);
                transform:scale(0.95);transition:transform 0.3s ease;
            `;
            panel.innerHTML = `
                <h3 style="font-size:var(--text-xl);font-weight:var(--font-bold);margin-bottom:var(--space-4);">${Utils.escapeHtml(title)}</h3>
                <div style="color:var(--text-secondary);line-height:var(--leading-relaxed);margin-bottom:var(--space-6);">${content}</div>
                <div style="display:flex;gap:var(--space-3);justify-content:flex-end;">
                    <button class="btn btn-ghost modal-cancel">${Utils.escapeHtml(cancelText)}</button>
                    <button class="btn btn-primary modal-confirm">${Utils.escapeHtml(confirmText)}</button>
                </div>
            `;

            overlay.appendChild(panel);
            document.body.appendChild(overlay);
            document.body.style.overflow = 'hidden';

            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                panel.style.transform = 'scale(1)';
            });

            const close = () => {
                overlay.style.opacity = '0';
                panel.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    overlay.remove();
                    document.body.style.overflow = '';
                }, 300);
            };

            panel.querySelector('.modal-cancel').addEventListener('click', () => {
                if (onCancel) onCancel();
                close();
            });

            panel.querySelector('.modal-confirm').addEventListener('click', () => {
                if (onConfirm) onConfirm();
                close();
            });

            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close();
            });

            const onKey = (e) => { if (e.key === 'Escape') close(); };
            document.addEventListener('keydown', onKey, { once: true });

            return { close };
        }
    };

    /* ─── Keyboard Shortcuts ─── */
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'k':
                    e.preventDefault();
                    const searchInput = document.querySelector('[data-search]');
                    if (searchInput) searchInput.focus();
                    break;
            }
        }
    });

    /* ─── External Link Security ─── */
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        if (!link.getAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    /* ─── Console Branding ─── */
    console.log(
        '%c PythonLearn %c Master Python Interactively ',
        'background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
        'background: #16161f; color: #a0a0b0; padding: 4px 8px; border-radius: 4px;'
    );

    /* ─── Page Bootstrap ─── */
    function bootstrap() {
        const path = window.location.pathname;

        if (path.includes('learn.html')) {
            if (typeof LearnPage !== 'undefined') LearnPage.init();
        } else if (path.includes('editor.html')) {
            if (typeof EditorPage !== 'undefined') EditorPage.init();
        } else if (path.includes('challenge.html')) {
            if (typeof ChallengePage !== 'undefined') ChallengePage.init();
        } else if (path.includes('quiz.html')) {
            if (typeof QuizPage !== 'undefined') QuizPage.init();
        } else if (path.includes('finish.html')) {
            if (typeof FinishPage !== 'undefined') FinishPage.init();
        }

        if (Storage.isFirstVisit()) {
            setTimeout(() => {
                showToast('Welcome to PythonLearn! Your progress is saved automatically.', 'info', 5000);
            }, 1500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap);
    } else {
        bootstrap();
    }
})();