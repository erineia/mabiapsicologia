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

// Loading screen
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
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
