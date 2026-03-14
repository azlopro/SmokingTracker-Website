import { i18n } from './i18n.js';

// Setup Translation Management
function setupTranslations() {
    const langToggle = document.getElementById('lang-toggle');
    const storedLang = localStorage.getItem('lang') || 'da'; // Default to Danish for B2B

    document.documentElement.setAttribute('lang', storedLang);
    if (langToggle) {
        langToggle.checked = storedLang === 'en';
    }

    applyTranslations(storedLang);

    if (langToggle) {
        langToggle.addEventListener('change', (e) => {
            const newLang = e.target.checked ? 'en' : 'da';
            document.documentElement.setAttribute('lang', newLang);
            localStorage.setItem('lang', newLang);
            applyTranslations(newLang);
        });
    }
}

function applyTranslations(lang) {
    const dictionary = i18n[lang];
    if (!dictionary) return;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const keyPath = el.getAttribute('data-i18n');
        const translation = getNestedValue(dictionary, keyPath);
        if (translation) {
            if (el.tagName === 'INPUT' && el.type === 'placeholder') {
                el.placeholder = translation;
            } else {
                el.innerHTML = translation; // Using innerHTML to allow things like colored spans
            }
        }
    });
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}



// Setup scroll effects (Navbar background)
function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let _scrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!_scrollTicking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
                _scrollTicking = false;
            });
            _scrollTicking = true;
        }
    });

    // Highlight active link based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath || (currentPath === '/' && link.getAttribute('href') === '/index.html')) {
            // Handled manually in HTML, but logic is here for dynamic routing if needed
        }
    });
}

// Intersection Observer for scroll animations (fade-in)
function setupAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target); // Stop observing once animated — prevents memory leak
            }
        });
    }, observerOptions);

    // The CSS animations are set to forwards, but paused initially if we wanted to control them
    // For now, the CSS animations trigger on load. If we want scroll-triggered, we'd adjust the CSS 
    // to be paused, or toggle a class here.

    // Example for elements that should animate on scroll:
    const animateElements = document.querySelectorAll('.fade-in-up, .fade-in');

    // Quick fix: pause animations in JS initially if they aren't in viewport
    animateElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top > window.innerHeight) {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        }
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');

    if (!menuBtn || !navbar || !navLinks) return;

    menuBtn.setAttribute('aria-expanded', 'false');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navbar.classList.toggle('menu-open');
        menuBtn.classList.toggle('is-open', isOpen);
        menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on nav link click (e.g. anchor links to sections)
    navLinks.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            navbar.classList.remove('menu-open');
            menuBtn.classList.remove('is-open');
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Close when clicking outside the navbar
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            navbar.classList.remove('menu-open');
            menuBtn.classList.remove('is-open');
            menuBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupTranslations();
    setupScrollEffects();
    setupAnimations();
    setupMobileMenu();
});
