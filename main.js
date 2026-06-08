/**
 * VECTERON SOLUTIONS - MAIN JAVASCRIPT
 * Handles: Navigation, Scroll Animations, Forms, Toast Notifications, Mobile Menu
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        // Replace these with your actual Formspree IDs after signing up at formspree.io
        FORMSPREE_CONTACT: 'https://formspree.io/f/YOUR_CONTACT_FORM_ID',
        FORMSPREE_PROJECT: 'https://formspree.io/f/YOUR_PROJECT_FORM_ID',

        // Animation settings
        REVEAL_OFFSET: 100,
        SCROLL_THRESHOLD: 50,

        // WhatsApp number (replace with your real number)
        WHATSAPP_NUMBER: '15551234567'
    };

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const DOM = {
        navbar: document.getElementById('navbar'),
        navLinks: document.getElementById('navLinks'),
        navToggle: document.getElementById('navToggle'),
        toastContainer: document.getElementById('toastContainer'),
        contactForm: document.getElementById('contactForm'),
        projectForm: document.getElementById('projectForm'),
        contactBtn: document.getElementById('contactSubmitBtn'),
        projectBtn: document.getElementById('projectSubmitBtn'),
        revealElements: document.querySelectorAll('.reveal'),
        scrollLinks: document.querySelectorAll('a[href^="#"]')
    };

    // ============================================
    // TOAST NOTIFICATION SYSTEM
    // ============================================
    const Toast = {
        show(message, type = 'success') {
            if (!DOM.toastContainer) return;

            const toast = document.createElement('div');
            toast.className = `toast toast--${type}`;

            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                info: 'fa-info-circle'
            };

            toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> <span>${message}</span>`;
            DOM.toastContainer.appendChild(toast);

            // Trigger animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    toast.classList.add('show');
                });
            });

            // Auto-remove
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 500);
            }, 4000);
        }
    };

    // ============================================
    // FORM HANDLING
    // ============================================
    const Forms = {
        validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        clearErrors(form) {
            form.querySelectorAll('.form__group').forEach(group => {
                group.classList.remove('error');
            });
        },

        showError(groupId) {
            const group = document.getElementById(groupId);
            if (group) group.classList.add('error');
        },

        setLoading(btn, loading) {
            btn.disabled = loading;
            btn.classList.toggle('loading', loading);
        },

        async submit(endpoint, data, btn) {
            this.setLoading(btn, true);

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    Toast.show('Message sent successfully! We\'ll get back to you soon.', 'success');
                    return true;
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    Toast.show(errorData.error || 'Something went wrong. Please try again.', 'error');
                    return false;
                }
            } catch (error) {
                console.error('Form submission error:', error);
                Toast.show('Network error. Please check your connection and try again.', 'error');
                return false;
            } finally {
                this.setLoading(btn, false);
            }
        }
    };

    // ============================================
    // CONTACT FORM
    // ============================================
    function initContactForm() {
        if (!DOM.contactForm) return;

        DOM.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            Forms.clearErrors(DOM.contactForm);

            const formData = new FormData(DOM.contactForm);
            const data = Object.fromEntries(formData);
            let hasError = false;

            if (!data.name || data.name.trim() === '') {
                Forms.showError('cg-name');
                hasError = true;
            }
            if (!data.email || !Forms.validateEmail(data.email)) {
                Forms.showError('cg-email');
                hasError = true;
            }
            if (!data.subject || data.subject.trim() === '') {
                Forms.showError('cg-subject');
                hasError = true;
            }
            if (!data.message || data.message.trim() === '') {
                Forms.showError('cg-message');
                hasError = true;
            }

            if (hasError) {
                Toast.show('Please fix the errors above.', 'error');
                return;
            }

            // Check if Formspree is configured
            if (CONFIG.FORMSPREE_CONTACT.includes('YOUR_')) {
                Toast.show('Formspree not configured yet. Please set up your form endpoint.', 'info');
                console.log('Form data (not sent):', data);
                return;
            }

            const success = await Forms.submit(CONFIG.FORMSPREE_CONTACT, data, DOM.contactBtn);
            if (success) DOM.contactForm.reset();
        });
    }

    // ============================================
    // PROJECT REQUEST FORM
    // ============================================
    function initProjectForm() {
        if (!DOM.projectForm) return;

        DOM.projectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            Forms.clearErrors(DOM.projectForm);

            const formData = new FormData(DOM.projectForm);
            const data = Object.fromEntries(formData);
            let hasError = false;

            if (!data.name || data.name.trim() === '') {
                Forms.showError('pg-name');
                hasError = true;
            }
            if (!data.email || !Forms.validateEmail(data.email)) {
                Forms.showError('pg-email');
                hasError = true;
            }
            if (!data.projectType) {
                Forms.showError('pg-type');
                hasError = true;
            }
            if (!data.description || data.description.trim() === '') {
                Forms.showError('pg-desc');
                hasError = true;
            }

            if (hasError) {
                Toast.show('Please fix the errors above.', 'error');
                return;
            }

            // Check if Formspree is configured
            if (CONFIG.FORMSPREE_PROJECT.includes('YOUR_')) {
                Toast.show('Formspree not configured yet. Please set up your form endpoint.', 'info');
                console.log('Project data (not sent):', data);
                return;
            }

            const success = await Forms.submit(CONFIG.FORMSPREE_PROJECT, data, DOM.projectBtn);
            if (success) DOM.projectForm.reset();
        });
    }

    // ============================================
    // NAVIGATION
    // ============================================
    function initNavigation() {
        // Mobile menu toggle
        if (DOM.navToggle && DOM.navLinks) {
            DOM.navToggle.addEventListener('click', () => {
                DOM.navLinks.classList.toggle('active');
                const icon = DOM.navToggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                }
            });

            // Close menu when clicking a link
            DOM.navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    DOM.navLinks.classList.remove('active');
                    const icon = DOM.navToggle.querySelector('i');
                    if (icon) {
                        icon.classList.add('fa-bars');
                        icon.classList.remove('fa-times');
                    }
                });
            });
        }

        // Navbar background on scroll
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (DOM.navbar) {
                if (currentScroll > CONFIG.SCROLL_THRESHOLD) {
                    DOM.navbar.classList.add('scrolled');
                } else {
                    DOM.navbar.classList.remove('scrolled');
                }
            }

            lastScroll = currentScroll;
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    function initSmoothScroll() {
        DOM.scrollLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    const navHeight = DOM.navbar ? DOM.navbar.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================
    function initScrollReveal() {
        if (!DOM.revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: `0px 0px -${CONFIG.REVEAL_OFFSET}px 0px`
        });

        DOM.revealElements.forEach(el => observer.observe(el));
    }

    // ============================================
    // STATS COUNTER ANIMATION
    // ============================================
    function initStatsCounter() {
        const stats = document.querySelectorAll('.stat__number');
        if (!stats.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const text = el.textContent;
                    const num = parseInt(text.replace(/\D/g, ''));
                    const suffix = text.replace(/[0-9]/g, '');

                    if (!isNaN(num)) {
                        animateCounter(el, 0, num, 1500, suffix);
                    }

                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => observer.observe(stat));
    }

    function animateCounter(el, start, end, duration, suffix) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * easeOut);

            el.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // ============================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ============================================
    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav__link');

        if (!sections.length || !navLinks.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(section => observer.observe(section));
    }

    // ============================================
    // PARALLAX EFFECT (Hero shapes)
    // ============================================
    function initParallax() {
        const shapes = document.querySelectorAll('.hero__shape');
        if (!shapes.length) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    shapes.forEach((shape, index) => {
                        const speed = 0.1 + (index * 0.05);
                        shape.style.transform = `translateY(${scrollY * speed}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ============================================
    // CAREER APPLY BUTTONS
    // ============================================
    function initCareerButtons() {
        document.querySelectorAll('.career__apply').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const jobTitle = btn.closest('.career').querySelector('.career__title').textContent;
                Toast.show(`Application for "${jobTitle}" coming soon!`, 'info');
            });
        });
    }

    // ============================================
    // INITIALIZE EVERYTHING
    // ============================================
    function init() {
        initNavigation();
        initSmoothScroll();
        initScrollReveal();
        initStatsCounter();
        initActiveNavLink();
        initParallax();
        initContactForm();
        initProjectForm();
        initCareerButtons();

        console.log('%c Vecteron Solutions ', 'background: linear-gradient(135deg, #2563EB, #06B6D4); color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold;');
        console.log('Website loaded successfully!');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
