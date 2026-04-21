import { i18n } from './i18n.js';

const DEFAULT_LANG = 'en';
const APOLLO_APP_ID = '69d065a06cfa3d000d673689';
const APOLLO_SCRIPT_SRC = 'https://assets.apollo.io/micro/website-tracker/tracker.iife.js';
const MOBILE_MENU_BREAKPOINT = 768;

let apolloInitialized = false;

function queryAll(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

function initApollo() {
  if (apolloInitialized || document.querySelector('script[data-apollo-tracker]')) {
    apolloInitialized = true;
    return;
  }

  const script = document.createElement('script');
  script.src = `${APOLLO_SCRIPT_SRC}?nocache=${Math.random().toString(36).slice(2)}`;
  script.async = true;
  script.defer = true;
  script.dataset.apolloTracker = 'true';
  script.onload = () => {
    window.trackingFunctions?.onLoad?.({ appId: APOLLO_APP_ID });
  };

  document.head.appendChild(script);
  apolloInitialized = true;
}

function applyTranslations(lang = DEFAULT_LANG) {
  const dictionary = i18n[lang];
  if (!dictionary) return;

  const translationNodes = queryAll('[data-i18n]');
  const placeholderNodes = queryAll('[data-i18n-placeholder]');

  if (!translationNodes.length && !placeholderNodes.length) return;

  document.documentElement.lang = lang;

  for (const node of translationNodes) {
    const key = node.getAttribute('data-i18n');
    if (!key) continue;

    const translation = getNestedValue(dictionary, key);
    if (translation === undefined) continue;

    node.innerHTML = translation;
  }

  for (const node of placeholderNodes) {
    const key = node.getAttribute('data-i18n-placeholder');
    if (!key) continue;

    const translation = getNestedValue(dictionary, key);
    if (translation === undefined) continue;

    if ('placeholder' in node) {
      node.placeholder = translation;
    }
  }
}

function setupScrollEffects() {
  const navbar = document.querySelector('.site-nav, .navbar');
  if (!navbar) return;

  let isTicking = false;

  const syncScrolledState = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    isTicking = false;
  };

  syncScrolledState();

  window.addEventListener(
    'scroll',
    () => {
      if (isTicking) return;

      isTicking = true;
      window.requestAnimationFrame(syncScrolledState);
    },
    { passive: true }
  );
}

function setupAnimations() {
  const animatedNodes = queryAll('.fade-in-up, .fade-in');
  if (!animatedNodes.length || typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    }
  );

  for (const node of animatedNodes) {
    const rect = node.getBoundingClientRect();
    if (rect.top <= window.innerHeight) continue;

    node.style.animationPlayState = 'paused';
    observer.observe(node);
  }
}

function setupMobileMenu() {
  const navbar = document.querySelector('.site-nav, .navbar');
  const menuButton = document.querySelector('.mobile-menu-btn');
  const navLinks = navbar?.querySelector('.nav-links');

  if (!navbar || !menuButton || !navLinks) return;

  const closeMenu = () => {
    navbar.classList.remove('menu-open');
    menuButton.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };

  const toggleMenu = () => {
    const isOpen = navbar.classList.toggle('menu-open');
    menuButton.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
  };

  menuButton.setAttribute('aria-expanded', 'false');

  menuButton.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMenu();
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) {
      closeMenu();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !navbar.contains(event.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_MENU_BREAKPOINT) {
      closeMenu();
    }
  });
}

function setupPricingToggle() {
  const checkbox = document.getElementById('billing-checkbox');
  if (!(checkbox instanceof HTMLInputElement)) return;

  const dictionary = i18n[DEFAULT_LANG]?.pricing;
  if (!dictionary) return;

  const labelMonthly = document.getElementById('label-monthly');
  const labelAnnually = document.getElementById('label-annually');
  const priceTier1 = document.getElementById('price-tier1');
  const periodTier1 = document.getElementById('period-tier1');
  const priceTier2 = document.getElementById('price-tier2');
  const periodTier2 = document.getElementById('period-tier2');

  const render = () => {
    const isAnnual = checkbox.checked;

    labelMonthly?.classList.toggle('active', !isAnnual);
    labelAnnually?.classList.toggle('active', isAnnual);

    if (isAnnual) {
      if (priceTier1) priceTier1.innerHTML = dictionary.tier1_price_annually;
      if (periodTier1) periodTier1.innerHTML = dictionary.tier1_period_annually;
      if (priceTier2) priceTier2.innerHTML = dictionary.tier2_price_annually;
      if (periodTier2) periodTier2.innerHTML = dictionary.tier2_period_annually;
      return;
    }

    if (priceTier1) priceTier1.innerHTML = dictionary.tier1_price_monthly;
    if (periodTier1) periodTier1.innerHTML = dictionary.tier1_period_monthly;
    if (priceTier2) priceTier2.innerHTML = dictionary.tier2_price_monthly;
    if (periodTier2) periodTier2.innerHTML = dictionary.tier2_period_monthly;
  };

  checkbox.addEventListener('change', render);
  render();
}

function initPageChrome() {
  applyTranslations(DEFAULT_LANG);
  setupScrollEffects();
  setupMobileMenu();
  setupPricingToggle();
}

initApollo();

document.addEventListener('DOMContentLoaded', initPageChrome, { once: true });
window.addEventListener('load', setupAnimations, { once: true });
