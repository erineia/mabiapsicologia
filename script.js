// Scroll Reveal Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(
        () => entry.target.classList.add('reveal-active'),
        index * 100,
      );
    }
  });
}, observerOptions);

document.querySelectorAll('.card').forEach((el) => observer.observe(el));

// Parallax effect for hero
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.style.backgroundPosition = `center ${window.scrollY * 0.5}px`;
});

// Carousel Data with Tabs
const tabsData = [
  {
    name: 'Cuidado Emocional',
    slides: [
      'Cuidar da saúde mental é um ato de coragem.',
      'Você não precisa enfrentar tudo sozinha.',
      'Seu sofrimento merece ser ouvido.',
      'Sentir também é uma forma de existir.',
    ],
  },
  {
    name: 'Acolhimento',
    slides: [
      'Aqui você encontra escuta, respeito e acolhimento.',
      'Sem julgamentos. Sem pressa. Com cuidado.',
      'Cada história importa. Cada pessoa é única.',
      'Um espaço seguro para ser quem você é.',
    ],
  },
  {
    name: 'Processo Terapêutico',
    slides: [
      'A terapia é um caminho de autoconhecimento e transformação.',
      'Pequenos passos também são progresso.',
      'Cuidar de si é um gesto de amor.',
      'Não é fraqueza buscar ajuda. É responsabilidade consigo.',
    ],
  },
  {
    name: 'Tratamento Humanizado',
    slides: [
      'Atendimento humanizado: escuta, empatia e respeito à sua história.',
      'O tratamento começa com acolhimento.',
      'Aqui você não é um caso, é uma pessoa.',
      'A cura acontece quando você se sente realmente compreendido.',
    ],
  },
];

let currentTabIndex = 0;
let currentCarouselIndex = 0;
let carouselInterval;
let slideCountInTab = 0;

function updateCarousel() {
  const titleElement = document.getElementById('carousel-title');
  const dots = document.querySelectorAll('.dot');
  const carouselSection = document.querySelector('.carousel-section');
  const currentSlides = tabsData[currentTabIndex].slides;

  if (titleElement)
    titleElement.textContent = currentSlides[currentCarouselIndex];

  if (carouselSection) {
    carouselSection.classList.remove('tab-0', 'tab-1', 'tab-2', 'tab-3');
    carouselSection.classList.add(`tab-${currentTabIndex}`);
  }

  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentCarouselIndex);
  });
}

function switchTab(tabIndex) {
  currentTabIndex = tabIndex;
  currentCarouselIndex = 0;
  slideCountInTab = 0;

  document.querySelectorAll('.tab-button').forEach((btn, index) => {
    btn.classList.toggle('active', index === tabIndex);
  });

  updateCarousel();
  clearInterval(carouselInterval);
  startCarouselAutoplayWithTabs();
}

function currentSlide(n) {
  currentCarouselIndex = n;
  slideCountInTab = n;
  updateCarousel();
  clearInterval(carouselInterval);
  startCarouselAutoplayWithTabs();
}

function nextSlideWithTabSwitch() {
  const currentSlides = tabsData[currentTabIndex].slides;
  slideCountInTab++;

  if (slideCountInTab >= currentSlides.length) {
    slideCountInTab = 0;
    const nextTab = (currentTabIndex + 1) % tabsData.length;
    switchTab(nextTab);
  } else {
    currentCarouselIndex = (currentCarouselIndex + 1) % currentSlides.length;
    updateCarousel();
  }
}

function startCarouselAutoplayWithTabs() {
  carouselInterval = setInterval(nextSlideWithTabSwitch, 5000);
}

// Eventos: tabs e dots (sem onclick no HTML)
document.querySelectorAll('.tab-button').forEach((btn) => {
  btn.addEventListener('click', () => switchTab(Number(btn.dataset.tab)));
});

document.querySelectorAll('.dot').forEach((dot) => {
  dot.addEventListener('click', () => currentSlide(Number(dot.dataset.slide)));
});

// Pause on hover
const carouselSection = document.querySelector('.carousel-section');
if (carouselSection) {
  carouselSection.addEventListener('mouseenter', () =>
    clearInterval(carouselInterval),
  );
  carouselSection.addEventListener('mouseleave', () =>
    startCarouselAutoplayWithTabs(),
  );
}

updateCarousel();
startCarouselAutoplayWithTabs();

// Loading screen (somente em páginas que têm #loadingScreen)
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');

  // Se não houver tela de loading (páginas legais, por exemplo), não faz nada
  if (!loadingScreen) return;

  document.body.classList.add('loading');

  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  }, 2000);
});

// WhatsApp Float Tooltip
const whatsappFloat = document.getElementById('whatsappFloat');
const whatsTooltip = document.getElementById('whatsTooltip');

if (whatsappFloat && whatsTooltip) {
  whatsappFloat.addEventListener('mouseenter', () =>
    whatsTooltip.classList.add('show'),
  );
  whatsappFloat.addEventListener('mouseleave', () =>
    whatsTooltip.classList.remove('show'),
  );
}

// Form Submission (Netlify Forms)
const form = document.getElementById('contatoForm');
const formMessage = document.getElementById('formMessage');

if (form && formMessage) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    formMessage.textContent = 'Enviando mensagem...';
    formMessage.className = 'form-message';

    const formData = new FormData(form);

    try {
      const res = await fetch('/', { method: 'POST', body: formData });

      if (res.ok) {
        formMessage.textContent = 'Mensagem enviada com sucesso! 😊';
        formMessage.className = 'form-message success';
        form.reset();
      } else {
        formMessage.textContent = 'Não foi possível enviar. Tente novamente.';
        formMessage.className = 'form-message error';
      }
    } catch (err) {
      formMessage.textContent = 'Erro de conexão. Tente novamente.';
      formMessage.className = 'form-message error';
    }
  });
}

// Remove background color from marked images (simple chroma-key)
function removeBackgroundFromImage(img, options) {
  if (!img || img.dataset.bgRemoved === 'true') return;
  if (!(img instanceof HTMLImageElement)) return;

  const threshold = options?.threshold ?? 35;
  const softThreshold = options?.softThreshold ?? 70;

  const apply = () => {
    try {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      if (!width || !height) return;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      const br = data[0];
      const bg = data[1];
      const bb = data[2];

      const t2 = threshold * threshold;
      const s2 = softThreshold * softThreshold;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const dr = r - br;
        const dg = g - bg;
        const db = b - bb;
        const dist2 = dr * dr + dg * dg + db * db;

        if (dist2 <= t2) {
          data[i + 3] = 0;
        } else if (dist2 < s2) {
          const alpha = (dist2 - t2) / (s2 - t2);
          data[i + 3] = Math.round(data[i + 3] * alpha);
        }
      }

      // Estimate dominant color from remaining pixels (ignore transparent/near-white)
      const accent = estimateAccentColorFromImageData(imageData);
      if (accent) setBrandAccentFromRgb(accent);

      ctx.putImageData(imageData, 0, 0);
      img.src = canvas.toDataURL('image/png');
      img.dataset.bgRemoved = 'true';
    } catch {
      // If anything fails, keep original image
    }
  };

  if (img.complete && img.naturalWidth) apply();
  else img.addEventListener('load', apply, { once: true });
}

function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
}

function hslToRgb(h, s, l) {
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  let r;
  let g;
  let b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function estimateAccentColorFromImageData(imageData) {
  const data = imageData.data;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let count = 0;

  // Sample every N pixels for speed
  const step = 4 * 6;

  for (let i = 0; i < data.length; i += step) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 200) continue;

    // Skip near-white pixels
    if (r > 240 && g > 240 && b > 240) continue;
    // Skip near-black pixels
    if (r < 12 && g < 12 && b < 12) continue;

    sumR += r;
    sumG += g;
    sumB += b;
    count++;
  }

  if (count < 20) return null;
  return {
    r: Math.round(sumR / count),
    g: Math.round(sumG / count),
    b: Math.round(sumB / count),
  };
}

function setBrandAccentFromRgb(rgb) {
  const root = document.documentElement;
  if (!root) return;

  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  // Ensure it looks like an "accent" button color (not too gray)
  const tunedS = Math.max(s, 0.35);
  const tunedL = clamp01(Math.min(Math.max(l, 0.35), 0.55));
  const tuned = hslToRgb(h, tunedS, tunedL);
  const hover = hslToRgb(h, tunedS, clamp01(tunedL - 0.08));

  root.style.setProperty(
    '--brand-accent',
    `rgb(${tuned.r} ${tuned.g} ${tuned.b})`,
  );
  root.style.setProperty(
    '--brand-accent-hover',
    `rgb(${hover.r} ${hover.g} ${hover.b})`,
  );
}

document.querySelectorAll('img[data-remove-bg="true"]').forEach((img) => {
  removeBackgroundFromImage(img, { threshold: 30, softThreshold: 70 });
});

// Header height vars (fixed-header offset on mobile + anchor offset on all sizes)
function updateHeaderHeights() {
  const root = document.documentElement;
  const header = document.querySelector('.header');
  if (!root || !header) return;

  const rect = header.getBoundingClientRect();
  if (!rect.height) return;

  const headerHeight = `${Math.ceil(rect.height)}px`;
  root.style.setProperty('--header-height', headerHeight);

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) {
    root.style.setProperty('--mobile-header-height', headerHeight);
  } else {
    root.style.removeProperty('--mobile-header-height');
  }
}

window.addEventListener('load', () => {
  updateHeaderHeights();
  requestAnimationFrame(updateHeaderHeights);
  setTimeout(updateHeaderHeights, 300);
});

window.addEventListener('resize', updateHeaderHeights);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', updateHeaderHeights);
}

// ============================ Proteção WhatsApp (reCAPTCHA) ============================
let pendingWhatsAppUrl = null;
let whatsappHumanVerified = false;

function openWhatsAppVerification(url) {
  const overlay = document.getElementById('whatsappVerificationOverlay');
  const continueBtn = document.getElementById('whatsappContinue');

  if (!overlay || !continueBtn) {
    // Se por algum motivo o modal não existir, abre direto
    window.open(url, '_blank');
    return;
  }

  pendingWhatsAppUrl = url;
  whatsappHumanVerified = false;
  continueBtn.disabled = true;

  overlay.classList.add('show');
  overlay.setAttribute('aria-hidden', 'false');

  if (typeof grecaptcha !== 'undefined') {
    try {
      grecaptcha.reset();
    } catch {
      // ignora falha no reset
    }
  }
}

function closeWhatsAppVerification() {
  const overlay = document.getElementById('whatsappVerificationOverlay');
  if (!overlay) return;
  overlay.classList.remove('show');
  overlay.setAttribute('aria-hidden', 'true');
  pendingWhatsAppUrl = null;
}

// Callback chamado pelo reCAPTCHA (definido em data-callback)
function onWhatsAppCaptchaSuccess() {
  whatsappHumanVerified = true;
  const continueBtn = document.getElementById('whatsappContinue');
  if (continueBtn) continueBtn.disabled = false;
}

// Torna a função acessível no escopo global para o reCAPTCHA
// eslint-disable-next-line no-undef
window.onWhatsAppCaptchaSuccess = onWhatsAppCaptchaSuccess;

// Ligações de eventos após o DOM estar pronto
window.addEventListener('load', () => {
  // Intercepta todos os links que apontam para o WhatsApp
  const whatsappLinks = document.querySelectorAll('a[href^="https://wa.me/"]');

  whatsappLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const url = link.href;
      if (!url) return;
      openWhatsAppVerification(url);
    });
  });

  const continueBtn = document.getElementById('whatsappContinue');
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      if (!whatsappHumanVerified || !pendingWhatsAppUrl) return;
      window.open(pendingWhatsAppUrl, '_blank');
      closeWhatsAppVerification();
    });
  }

  const closeBtn = document.querySelector('.whatsapp-verification-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeWhatsAppVerification();
    });
  }

  const overlay = document.getElementById('whatsappVerificationOverlay');
  if (overlay) {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        closeWhatsAppVerification();
      }
    });
  }
});
