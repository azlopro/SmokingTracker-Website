import { i18n } from './i18n.js';

// Apollo.io website tracker
(function initApollo() {
    var n = Math.random().toString(36).substring(7);
    var o = document.createElement('script');
    o.src = 'https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=' + n;
    o.async = true;
    o.defer = true;
    o.onload = function () { window.trackingFunctions.onLoad({ appId: '69d065a06cfa3d000d673689' }); };
    document.head.appendChild(o);
}());

// Setup Translation Management
function setupTranslations() {
    document.documentElement.setAttribute('lang', 'en');
    applyTranslations('en');
}

function applyTranslations(lang) {
    const dictionary = i18n[lang];
    if (!dictionary) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const translation = getNestedValue(dictionary, el.getAttribute('data-i18n'));
        if (translation !== undefined) {
            el.innerHTML = translation; // Using innerHTML to allow things like colored spans
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const translation = getNestedValue(dictionary, el.getAttribute('data-i18n-placeholder'));
        if (translation !== undefined) {
            el.placeholder = translation;
        }
    });
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}



// Setup scroll effects (Navbar background)
function setupScrollEffects() {
    const navbar = document.querySelector('.site-nav, .navbar');
    if (!navbar) return;
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
    const navLinks = navbar.querySelectorAll('.nav-links a');

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
    const navbar = document.querySelector('.site-nav, .navbar');
    const navLinks = navbar?.querySelector('.nav-links');

    if (!menuBtn || !navbar || !navLinks) return;

    const closeMenu = () => {
        navbar.classList.remove('menu-open');
        menuBtn.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
    };

    menuBtn.setAttribute('aria-expanded', 'false');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navbar.classList.toggle('menu-open');
        menuBtn.classList.toggle('is-open', isOpen);
        menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on nav link click (e.g. anchor links to sections)
    navLinks.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
            closeMenu();
        }
    });

    // Close when clicking outside the navbar
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

// Setup pricing toggle logic
function setupPricingToggle() {
    const checkbox = document.getElementById('billing-checkbox');
    if (!checkbox) return;

    const labelMonthly = document.getElementById('label-monthly');
    const labelAnnually = document.getElementById('label-annually');
    
    checkbox.addEventListener('change', () => {
        const isAnnual = checkbox.checked;
        
        // Update labels active state
        labelMonthly.classList.toggle('active', !isAnnual);
        labelAnnually.classList.toggle('active', isAnnual);
        
        // Update prices
        const dictionary = i18n['en'];
        if (!dictionary || !dictionary.pricing) return;

        const priceTier1 = document.getElementById('price-tier1');
        const periodTier1 = document.getElementById('period-tier1');
        const priceTier2 = document.getElementById('price-tier2');
        const periodTier2 = document.getElementById('period-tier2');

        if (isAnnual) {
            if (priceTier1) priceTier1.innerHTML = dictionary.pricing.tier1_price_annually;
            if (periodTier1) periodTier1.innerHTML = dictionary.pricing.tier1_period_annually;
            if (priceTier2) priceTier2.innerHTML = dictionary.pricing.tier2_price_annually;
            if (periodTier2) periodTier2.innerHTML = dictionary.pricing.tier2_period_annually;
        } else {
            if (priceTier1) priceTier1.innerHTML = dictionary.pricing.tier1_price_monthly;
            if (periodTier1) periodTier1.innerHTML = dictionary.pricing.tier1_period_monthly;
            if (priceTier2) priceTier2.innerHTML = dictionary.pricing.tier2_price_monthly;
            if (periodTier2) periodTier2.innerHTML = dictionary.pricing.tier2_period_monthly;
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupTranslations();
    setupScrollEffects();
    setupMobileMenu();
    setupPricingToggle();
});

// setupAnimations calls getBoundingClientRect(), which forces layout.
// Defer to window.load so stylesheets are fully applied first.
window.addEventListener('load', () => {
    setupAnimations();
});
