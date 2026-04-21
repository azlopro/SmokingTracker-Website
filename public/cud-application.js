import { i18n } from './i18n.js';

// ─── i18n helpers ────────────────────────────────────────────────────────

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
    // Check if we have a language preference in URL or localStorage
    const params = new URLSearchParams(window.location.search);
    let lang = params.get('lang') || localStorage.getItem('lang');
    
    // Default to 'en' if not set or not supported
    if (!lang || !i18n[lang]) {
        lang = 'en';
    }

    document.documentElement.setAttribute('lang', lang);
    applyTranslations(lang);
}

// ─── Form handling ────────────────────────────────────────────────────────

function showError(msg) {
    const el = document.getElementById('application-error');
    if (!el) return;
    if (msg) el.textContent = msg;
    el.classList.add('visible');
}

function hideError() {
    document.getElementById('application-error')?.classList.remove('visible');
}

function showSuccess() {
    const wrap = document.getElementById('application-form-wrap');
    const success = document.getElementById('application-success');
    if (!wrap || !success) return;
    wrap.style.display = 'none';
    success.classList.add('visible');
}

function setupForm() {
    const form = document.getElementById('application-form');
    if (!form) return;

    let _submitting = false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (_submitting) return;
        _submitting = true;
        hideError();

        const lang = document.documentElement.getAttribute('lang') || 'en';
        const dict = i18n[lang];

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const story = document.getElementById('story').value.trim();

        const submitBtn = document.getElementById('application-submit');
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '...';

        try {
            const response = await fetch('https://formspree.io/f/xpqonopl', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    story,
                    lang
                })
            });

            if (response.ok) {
                showSuccess();
                return;
            }

            let errMsg = getNestedValue(dict, 'cud.errorGeneric');
            try {
                const body = await response.json();
                if (body?.error) errMsg = body.error;
                if (body?.errors && Array.isArray(body.errors)) {
                    errMsg = body.errors.map(err => err.message).join(', ');
                }
            } catch (_) { /* ignore */ }

            showError(errMsg);
        } catch (_) {
            showError(getNestedValue(dict, 'cud.errorGeneric'));
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
    setupForm();
});
