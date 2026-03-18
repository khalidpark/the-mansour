// ============================================
// THE MANSOUR — Main Application
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initI18n();
  initHeader();
  initLangSwitcher();
  initMobileMenu();
  initScrollAnimations();
  initForms();
});

// --- Header Scroll ---
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    header.classList.toggle('header--scrolled', scrollY > 40);
    lastScroll = scrollY;
  }, { passive: true });
}

// --- Language Switcher ---
function initLangSwitcher() {
  const btn = document.querySelector('.lang-switcher__btn');
  const dropdown = document.querySelector('.lang-switcher__dropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  document.querySelectorAll('.lang-switcher__option').forEach(opt => {
    opt.addEventListener('click', () => {
      setLanguage(opt.dataset.lang);
      dropdown.classList.remove('open');
    });
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('open');
  });
}

// --- Mobile Menu ---
function initMobileMenu() {
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
    burger.classList.toggle('active');
  });

  // Close on nav link click
  nav.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.classList.remove('active');
    });
  });
}

// --- Scroll Animations ---
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-in, .stagger').forEach(el => {
    observer.observe(el);
  });
}

// --- Form Handling ---
function initForms() {
  // Newsletter subscription form
  const subscribeForm = document.getElementById('subscribe-form');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', handleSubscribe);
  }

  // Consulting inquiry form
  const inquiryForm = document.getElementById('inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', handleInquiry);
  }

  // Marketing inquiry form
  const mktInquiryForm = document.getElementById('mkt-inquiry-form');
  if (mktInquiryForm) {
    mktInquiryForm.addEventListener('submit', handleMktInquiry);
  }
}

async function handleSubscribe(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('input[type="email"]').value;
  const btn = form.querySelector('button[type="submit"]');

  if (!email) return;

  btn.disabled = true;
  btn.textContent = '...';

  try {
    // ============================================
    // WEBHOOK INTEGRATION POINT — Newsletter
    // ============================================
    // Replace the URL below with your actual webhook endpoint.
    // Options:
    //   1. Make.com (Integromat) webhook URL
    //   2. Google Apps Script web app URL
    //   3. Zapier webhook URL
    //   4. Direct Mailchimp API endpoint
    //
    // Example with Make.com:
    //   const WEBHOOK_URL = 'https://hook.us1.make.com/YOUR_WEBHOOK_ID';
    //
    // Example with Google Apps Script:
    //   const WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    //
    // The payload sent:
    //   { email: 'user@example.com', source: 'newsletter', lang: 'ko', timestamp: '...' }
    // ============================================

    const WEBHOOK_URL = null; // ← INSERT YOUR WEBHOOK URL HERE

    const payload = {
      email: email,
      source: 'newsletter',
      lang: currentLang,
      timestamp: new Date().toISOString()
    };

    if (WEBHOOK_URL) {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
    } else {
      console.log('[Newsletter] Webhook not configured. Payload:', payload);
    }

    // Success state
    btn.textContent = '✓';
    btn.style.background = '#2d6a4f';
    form.querySelector('input[type="email"]').value = '';
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = t('subscribe_btn');
      btn.style.background = '';
    }, 3000);

  } catch (error) {
    console.error('Subscribe error:', error);
    btn.disabled = false;
    btn.textContent = t('subscribe_btn');
  }
}

async function handleInquiry(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');

  btn.disabled = true;
  btn.textContent = '...';

  try {
    // ============================================
    // WEBHOOK INTEGRATION POINT — Consulting Inquiry
    // ============================================
    // Replace with your webhook URL (Make.com / GAS / Zapier).
    //
    // Example payload:
    //   {
    //     company: '...',
    //     name: '...',
    //     email: '...',
    //     country: '...',
    //     services: ['market_research', 'partner_matching'],
    //     budget: '...',
    //     details: '...',
    //     source: 'consulting_inquiry',
    //     lang: 'ko',
    //     timestamp: '...'
    //   }
    // ============================================

    const WEBHOOK_URL = null; // ← INSERT YOUR WEBHOOK URL HERE

    const formData = new FormData(form);
    const services = [];
    form.querySelectorAll('input[name="service"]:checked').forEach(cb => {
      services.push(cb.value);
    });

    const payload = {
      company: formData.get('company'),
      name: formData.get('name'),
      email: formData.get('email'),
      country: formData.get('country'),
      services: services,
      budget: formData.get('budget'),
      details: formData.get('details'),
      source: 'consulting_inquiry',
      lang: currentLang,
      timestamp: new Date().toISOString()
    };

    if (WEBHOOK_URL) {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
    } else {
      console.log('[Inquiry] Webhook not configured. Payload:', payload);
    }

    btn.textContent = '✓ 접수 완료';
    btn.style.background = '#2d6a4f';
    form.reset();
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = t('inquiry_submit');
      btn.style.background = '';
    }, 4000);

  } catch (error) {
    console.error('Inquiry error:', error);
    btn.disabled = false;
    btn.textContent = t('inquiry_submit');
  }
}

async function handleMktInquiry(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');

  btn.disabled = true;
  btn.textContent = '...';

  try {
    // ============================================
    // WEBHOOK INTEGRATION POINT — Marketing Inquiry
    // ============================================
    // Same structure as consulting inquiry.
    // Replace WEBHOOK_URL below.
    // ============================================

    const WEBHOOK_URL = null; // ← INSERT YOUR WEBHOOK URL HERE

    const formData = new FormData(form);
    const interests = [];
    form.querySelectorAll('input[name="interest"]:checked').forEach(cb => {
      interests.push(cb.value);
    });

    const payload = {
      company: formData.get('company'),
      name: formData.get('name'),
      email: formData.get('email'),
      interests: interests,
      details: formData.get('details'),
      source: 'marketing_inquiry',
      lang: currentLang,
      timestamp: new Date().toISOString()
    };

    if (WEBHOOK_URL) {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors'
      });
    } else {
      console.log('[Marketing Inquiry] Webhook not configured. Payload:', payload);
    }

    btn.textContent = '✓ 접수 완료';
    btn.style.background = '#2d6a4f';
    form.reset();
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = t('mkt_inquiry_submit');
      btn.style.background = '';
    }, 4000);

  } catch (error) {
    console.error('Marketing inquiry error:', error);
    btn.disabled = false;
    btn.textContent = t('mkt_inquiry_submit');
  }
}

// --- Smooth scroll for anchor links ---
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  e.preventDefault();
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
