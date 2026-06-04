/* ============================================================
   AQOON TECH — Newsletter / Brevo Integration
   ============================================================ */

function handleNewsletter(form) {
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn  = form.querySelector('button[type="submit"]');
  const email      = emailInput ? emailInput.value.trim() : '';

  if (!email) return;

  submitBtn.textContent = '...';
  submitBtn.disabled = true;
  emailInput.disabled = true;

  fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': '';
    },
    body: JSON.stringify({
      email: email,
      listIds: [2],
      updateEnabled: true
    })
  })
  .then(() => {
    const lang = localStorage.getItem('aqoon-lang') || 'so';
    submitBtn.textContent  = '✅ ' + (lang === 'so' ? 'Waad ku guuleysatay!' : 'Subscribed!');
    submitBtn.style.background = '#16a34a';
    submitBtn.style.borderColor = '#16a34a';
    emailInput.placeholder = lang === 'so'
      ? 'Mahadsanid — toddobaadkii waxaad heli doontaa maqaallada!'
      : 'Thank you — you will receive articles every week!';
    emailInput.value = '';
    localStorage.setItem('aqoon-subscribed', '1');
  })
  .catch(() => {
    submitBtn.textContent = '❌ ' + (localStorage.getItem('aqoon-lang') === 'en' ? 'Try again' : 'Isku day mar kale');
    submitBtn.disabled = false;
    emailInput.disabled = false;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('aqoon-subscribed') === '1') {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      const lang = localStorage.getItem('aqoon-lang') || 'so';
      const msg  = document.createElement('p');
      msg.style.cssText = 'font-size:13px;color:green;text-align:center;padding:8px 0;';
      msg.textContent = lang === 'so'
        ? '✅ Waxaad horay u diiwaan gelisay — mahadsanid!'
        : '✅ You\'re already subscribed — thank you!';
      form.parentNode.insertBefore(msg, form);
      form.style.display = 'none';
    });
  }
});
