/* ============================================================
   AQOON TECH — Newsletter / Mailchimp Integration
   ============================================================ */
function handleNewsletter(form) {
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn  = form.querySelector('button[type="submit"]');
  const email      = emailInput ? emailInput.value.trim() : '';

  if (!email) return;

  /* Send to Mailchimp */
  const formEl = document.createElement('form');
  formEl.action  = 'https://gmail.us14.list-manage.com/subscribe/post?u=6dde8e895252daeaff20a55bf&id=321921169aa926cdf9f420002';
  formEl.method  = 'POST';
  formEl.target  = 'mc_iframe';
  formEl.style.display = 'none';

  const e = document.createElement('input');
  e.type = 'hidden'; e.name = 'EMAIL'; e.value = email;
  formEl.appendChild(e);
  document.body.appendChild(formEl);

  let f = document.getElementById('mc_iframe');
  if (!f) {
    f = document.createElement('iframe');
    f.name = 'mc_iframe';
    f.id   = 'mc_iframe';
    f.style.display = 'none';
    document.body.appendChild(f);
  }

  formEl.submit();
  document.body.removeChild(formEl);
  localStorage.setItem('aqoon-subscribed', '1');

  /* Show success message */
  emailInput.value       = '';
  submitBtn.textContent  = '✅ Waad ku guuleysatay!';
  submitBtn.style.background = 'var(--green)';
  submitBtn.disabled     = false;
  emailInput.placeholder = 'Mahadsanid — toddobaadkii waxaad heli doontaa maqaallada!';
}
