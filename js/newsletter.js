/* ============================================================
   AQOON TECH — Newsletter / Mailchimp Integration
   ============================================================ */

const MAILCHIMP_URL = 'https://gmail.us14.list-manage.com/subscribe/post?u=6dde8e895252daeaff20a55bf&id=321921169aa926cdf9f420002';

function handleNewsletter(form) {
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn  = form.querySelector('button[type="submit"]');
  const email      = emailInput ? emailInput.value.trim() : '';

  if (!email) return;

  submitBtn.textContent = '...';
  submitBtn.disabled = true;
  emailInput.disabled = true;

  const formEl = document.createElement('form');
  formEl.action  = MAILCHIMP_URL;
  formEl.method  = 'POST';
  formEl.target  = 'mailchimp-iframe';
  formEl.style.display = 'none';

  const emailField   = document.createElement('input');
  emailField.type    = 'hidden';
  emailField.name    = 'EMAIL';
  emailField.value   = email;

  const honeypot     = document.createElement('input');
  honeypot.type      = 'hidden';
  honeypot.name      = 'b_6dde8e895252daeaff20a55bf_321921169aa926cdf9f420002';
  honeypot.value     = '';

  formEl.appendChild(emailField);
  formEl.appendChild(honeypot);
  document.body.appendChild(formEl);

  let iframe = document.getElementById('mailchimp-iframe');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.name  = 'mailchimp-iframe';
    iframe.id    = 'mailchimp-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  formEl.submit();
  document.body.removeChild(formEl);

  setTimeout(() => {
    const lang = localStorage.getItem('aqoon-lang') || 'so';
    const successMsg = document.createElement('div');
    successMsg.style.cssText = 'display:flex;align-items:center;gap:12px;background:rgba(34,197,94,.12);border:1.5px solid rgba(34,197,94,.3);border-radius:12px;padding:16px 20px;font-size:14px;color:#16a34a;margin-top:8px;';
    successMsg.innerHTML = '<span style="font-size:22px;">✅</span><div><div style="font-weight:700;margin-bottom:3px;">' +
      (lang === 'so' ? 'Waad ku guuleysatay!' : 'You\'re subscribed!') +
      '</div><div style="opacity:.8;font-size:12.5px;">' +
      (lang === 'so' ? 'Mahadsanid — waxaad heli doontaa maqaallada Aqoon Tech toddobaadkii.' : 'Thank you — you\'ll receive Aqoon Tech articles every week.') +
      '</div></div>';
    form.parentNode.insertBefore(successMsg, form);
    form.style.display = 'none';
    localStorage.setItem('aqoon-subscribed', '1');
  }, 1200);
}

document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('aqoon-subscribed') === '1') {
    document.querySelectorAll('.newsletter-form').forEach(form => {
      const lang = localStorage.getItem('aqoon-lang') || 'so';
      const msg  = document.createElement('p');
      msg.style.cssText = 'font-size:13px;color:green;text-align:center;padding:8px 0;';
      msg.textContent = lang === 'so' ? '✅ Waxaad horay u diiwaan gelisay — mahadsanid!' : '✅ You\'re already subscribed — thank you!';
      form.parentNode.insertBefore(msg, form);
      form.style.display = 'none';
    });
  }
});
