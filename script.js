const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
if (burger) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        nav.classList.toggle('open');
    });
    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('open');
            nav.classList.remove('open');
        });
    });
}

document.querySelectorAll('.faq-item__question').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.parentElement;
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

const form = document.getElementById('bookingForm');
if (form) {
    const message = document.getElementById('message');
    const msgCount = document.getElementById('msgCount');
    if (message && msgCount) {
        message.addEventListener('input', () => {
            msgCount.textContent = message.value.length;
        });
    }

    const phone = document.getElementById('phone');
    if (phone) {
        phone.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.startsWith('8')) val = '7' + val.slice(1);
            if (!val.startsWith('7') && val.length > 0) val = '7' + val;
            let formatted = '+7';
            if (val.length > 1) formatted += ' (' + val.slice(1, 4);
            if (val.length >= 5) formatted += ') ' + val.slice(4, 7);
            if (val.length >= 8) formatted += '-' + val.slice(7, 9);
            if (val.length >= 10) formatted += '-' + val.slice(9, 11);
            e.target.value = formatted;
        });
    }

    const validators = {
        name: (v) => v.trim().length >= 2 ? '' : 'Введите имя (минимум 2 символа)',
        email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Введите корректный email',
        phone: (v) => v.replace(/\D/g, '').length === 11 ? '' : 'Введите корректный телефон',
        format: () => form.querySelector('input[name="format"]:checked') ? '' : 'Выберите формат работы',
        channel: (v) => v ? '' : 'Выберите способ связи',
        consent: () => document.getElementById('consent').checked ? '' : 'Необходимо согласие'
    };

    const showError = (name, msg) => {
        const el = form.querySelector(`[data-error-for="${name}"]`);
        if (el) el.textContent = msg;
        const input = form.querySelector(`[name="${name}"]`);
        if (input) {
            input.classList.toggle('invalid', !!msg);
            input.classList.toggle('valid', !msg && input.value);
        }
    };

    ['name', 'email', 'phone', 'channel'].forEach(name => {
        const input = form.querySelector(`[name="${name}"]`);
        if (input) {
            input.addEventListener('blur', () => showError(name, validators[name](input.value)));
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) showError(name, validators[name](input.value));
            });
        }
    });
    form.querySelectorAll('input[name="format"]').forEach(r => {
        r.addEventListener('change', () => showError('format', validators.format()));
    });
    document.getElementById('consent').addEventListener('change', () => showError('consent', validators.consent()));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let isValid = true;
        Object.keys(validators).forEach(name => {
            const input = form.querySelector(`[name="${name}"]`) || (name === 'consent' ? document.getElementById('consent') : null);
            const val = input ? (input.type === 'checkbox' ? input.checked : input.value) : '';
            const err = validators[name](val);
            showError(name, err);
            if (err) isValid = false;
        });

        const honeypot = form.querySelector('[name="website"]');
        if (honeypot && honeypot.value) {
            console.warn('Bot detected');
            return;
        }

        if (!isValid) {
            const firstInvalid = form.querySelector('.invalid');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn__text');
        const btnLoader = btn.querySelector('.btn__loader');
        btn.disabled = true;
        btnText.hidden = true;
        btnLoader.hidden = false;

        const data = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            format: form.querySelector('input[name="format"]:checked').value,
            channel: form.channel.value,
            message: form.message.value,
            timestamp: new Date().toISOString()
        };
        console.log('Заявка:', data);

        setTimeout(() => {
            form.hidden = true;
            document.getElementById('bookingSuccess').hidden = false;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1200);
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});