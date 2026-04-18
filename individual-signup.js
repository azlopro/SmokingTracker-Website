const APP_API_URL = 'https://app.smokingtracker.com';

function showError(msg) {
    const el = document.getElementById('signup-error');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
}

function hideError() {
    document.getElementById('signup-error')?.classList.remove('visible');
}

function showSuccess() {
    document.getElementById('signup-form-wrap').style.display = 'none';
    const successEl = document.getElementById('signup-success');
    successEl.style.display = '';
    successEl.classList.add('visible');
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('individual-signup-form');
    if (!form) return;

    let _submitting = false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (_submitting) return;
        _submitting = true;
        hideError();

        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('admin-email').value.trim();
        const password = document.getElementById('password').value;
        const btn = document.getElementById('signup-submit');

        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = '...';

        try {
            const res = await fetch(`${APP_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    display_name: name,
                    email,
                    password,
                }),
            });

            if (res.status === 201) {
                showSuccess();
                return;
            }

            let errMsg = 'Something went wrong. Please try again.';
            try {
                const body = await res.json();
                if (body?.error) errMsg = body.error;
            } catch (_) { /* ignore */ }

            showError(errMsg);
        } catch (_) {
            showError('Could not reach the server. Please check your connection and try again.');
        } finally {
            _submitting = false;
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }
});
