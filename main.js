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

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
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
                // Add a class that triggers the animation defined in CSS
                entry.target.style.animationPlayState = 'running';
                // Optional: stop observing once animated
                // observer.unobserve(entry.target);
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupTranslations();
    setupScrollEffects();
    setupAnimations();
});
