import { i18n } from './i18n.js';

const API_URL = import.meta.env.VITE_API_URL || '';

// Currency derived from UI language
function currencyForLang(lang) {
    if (lang === 'de') return 'EUR';
    return 'USD'; // en and fallback
}

// ─── i18n helpers (shared pattern from main.js) ───────────────────────────

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function applyTranslations(lang) {
    const dictionary = i18n[lang];
    if (!dictionary) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = getNestedValue(dictionary, key);
        if (val !== undefined) el.innerHTML = val;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const val = getNestedValue(dictionary, key);
        if (val !== undefined) el.placeholder = val;
    });
}

function setupTranslations() {
    const langSelect = document.getElementById('lang-toggle');
    const raw = localStorage.getItem('lang');
    const storedLang = (raw === 'en' || raw === 'de') ? raw : 'en'; // DA phased out — fall back to EN

    document.documentElement.setAttribute('lang', storedLang);
    if (langSelect) {
        langSelect.value = storedLang;
    }

    applyTranslations(storedLang);
    updateDynamicLabels(storedLang, document.querySelector('input[name="tier"]:checked')?.value || 'solo');

    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            document.documentElement.setAttribute('lang', newLang);
            localStorage.setItem('lang', newLang);
            applyTranslations(newLang);
            updateDynamicLabels(newLang, document.querySelector('input[name="tier"]:checked')?.value || 'solo');
        });
    }
}

// ─── Scroll effects (navbar) ──────────────────────────────────────────────

function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ─── Tier selection ───────────────────────────────────────────────────────

function updateDynamicLabels(lang, tier) {
    const dict = i18n[lang];
    if (!dict) return;

    const submitBtn = document.getElementById('trial-submit');
    if (submitBtn) {
        // Map new API tier names to existing i18n button keys
        let btnKey = 'trial.btnSmall';
        if (tier === 'group') btnKey = 'trial.btnMedium';
        else if (tier === 'enterprise') btnKey = 'trial.btnLarge';
        submitBtn.textContent = getNestedValue(dict, btnKey);
    }
}

function setupTierSelection() {
    const radios = document.querySelectorAll('input[name="tier"]');
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const raw = localStorage.getItem('lang');
            const lang = (raw === 'en' || raw === 'de') ? raw : 'en';
            updateDynamicLabels(lang, radio.value);
        });
    });
}

// ─── Form submission ──────────────────────────────────────────────────────

function showError(msg) {
    const el = document.getElementById('trial-error');
    if (!el) return;
    if (msg) el.textContent = msg;
    el.classList.add('visible');
}

function hideError() {
    document.getElementById('trial-error')?.classList.remove('visible');
}

function showSuccess() {
    const wrap = document.getElementById('trial-form-wrap');
    const success = document.getElementById('trial-success');
    if (!wrap || !success) return;
    wrap.style.display = 'none';
    success.classList.add('visible');
}

function setupForm() {
    const form = document.getElementById('trial-form');
    if (!form) return;

    let _submitting = false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (_submitting) return;
        _submitting = true;
        hideError();

        const rawLang = localStorage.getItem('lang');
        const lang = (rawLang === 'en' || rawLang === 'de') ? rawLang : 'en';
        const dict = i18n[lang];

        const tier = document.querySelector('input[name="tier"]:checked')?.value || 'solo';
        const currency = currencyForLang(lang);
        const contactName = document.getElementById('contact-name').value.trim();
        const adminEmail = document.getElementById('admin-email').value.trim();
        const orgName = document.getElementById('org-name').value.trim();
        const centerName = document.getElementById('center-name').value.trim();
        const contactPhone = document.getElementById('contact-phone').value.trim();
        const cvrNumber = document.getElementById('cvr-number').value.trim();
        const municipality = document.getElementById('municipality').value.trim();

        const submitBtn = document.getElementById('trial-submit');
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '...';

        try {
            const res = await fetch(`${API_URL}/api/trial/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier,
                    currency,
                    org_name: orgName,
                    center_name: centerName,
                    contact_name: contactName,
                    admin_email: adminEmail,
                    contact_phone: contactPhone,
                    cvr_number: cvrNumber,
                    municipality,
                }),
            });

            if (res.ok || res.status === 201) {
                const stripeLinks = {
                    solo:       'https://buy.stripe.com/dRm28t5K4bVt1Qz29b0RG01',
                    group:      'https://buy.stripe.com/5kQ7sN2xS8JhfHpeVX0RG03',
                    enterprise: null,
                };
                const stripeBase = stripeLinks[tier];
                if (stripeBase && adminEmail) {
                    window.location.href = `${stripeBase}?prefilled_email=${encodeURIComponent(adminEmail)}`;
                } else {
                    showSuccess();
                }
                return;
            }

            // Try to parse error message from backend
            let errMsg = getNestedValue(dict, 'trial.errorGeneric');
            try {
                const body = await res.json();
                if (body?.error) errMsg = body.error;
            } catch (_) { /* ignore */ }

            showError(errMsg);
        } catch (_) {
            showError(getNestedValue(dict, 'trial.errorGeneric'));
        } finally {
            _submitting = false;
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// ─── Init ─────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    setupTranslations();
    setupScrollEffects();
    setupTierSelection();
    setupForm();
});
