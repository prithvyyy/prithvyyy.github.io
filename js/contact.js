

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const formMsg = document.getElementById('form-msg');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    formMsg.className = 'form-msg';
    formMsg.style.display = 'none';

    if (!name || !email || !message) {
      formMsg.textContent = 'Please fill in all required fields.';
      formMsg.className = 'form-msg error';
      return;
    }

    if (!emailRegex.test(email)) {
      formMsg.textContent = 'Please enter a valid email address.';
      formMsg.className = 'form-msg error';
      return;
    }

    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    setTimeout(() => {
      formMsg.textContent = `Thank you, ${name}! Your message has been received. I'll be in touch soon.`;
      formMsg.className = 'form-msg success';
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Send Message';
    }, 1000);
  });
});
