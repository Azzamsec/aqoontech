/* ============================================================
   AQOON TECH — Newsletter
   Calls Netlify function which safely talks to Brevo
   No API keys here — all handled server-side
   ============================================================ */

function handleNewsletter(form) {
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn  = form.querySelector('button[type="submit"]');
  const email      = emailInput ? emailInput.value.trim() : '';
  const lang       = localStorage.getItem('aqoon-lang') || 'so';

  if (!email) return;

  submitBtn.textContent = '...';
  submitBtn.disabled    = true;
  emailInput.disabled   = true;

  fetch('/.netlify/functions/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      submitBtn.textContent       = '✅ ' + (lang === 'so' ? 'Waad ku guuleysatay!' : 'Subscribed!');
      submitBtn.style.background  = '#16a34a';
      submitBtn.style.borderColor = '#16a34a';
      submitBtn.style.color       = '#fff';
      emailInput.value            = '';
      emailInput.placeholder      = lang === 'so'
        ? 'Mahadsanid — toddobaadkii waxaad heli doontaa maqaallada!'
        : 'Thank you — weekly articles coming your way!';
      localStorage.setItem('aqoon-subscribed', '1');
    } else {
      submitBtn.textContent = lang === 'so' ? 'Isku day mar kale' : 'Try again';
      submitBtn.disabled    = false;
      emailInput.disabled   = false;
    }
  })
  .catch(() => {
    submitBtn.textContent = lang === 'so' ? 'Isku day mar kale' : 'Try again';
    submitBtn.disabled    = false;
    emailInput.disabled   = false;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('aqoon-subscribed') === '1') {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      const lang = localStorage.getItem('aqoon-lang') || 'so';
      const msg  = document.createElement('p');
      msg.style.cssText = 'font-size:13px;color:green;text-align:center;padding:8px 0;';
      msg.textContent   = lang === 'so'
        ? '✅ Waxaad horay u diiwaan gelisay — mahadsanid!'
        : '✅ You\'re already subscribed — thank you!';
      form.parentNode.insertBefore(msg, form);
      form.style.display = 'none';
    });
  }
});
