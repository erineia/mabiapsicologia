// Abrir WhatsApp
function abrirWhats() {
  window.open('https://wa.me/5561998603162', '_blank', 'noopener,noreferrer');
}

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

// Accordion dos temas
const temaCards = document.querySelectorAll('.tema-card');

temaCards.forEach((card) => {
  card.addEventListener('click', () => {
    const isActive = card.classList.contains('active');

    temaCards.forEach((c) => c.classList.remove('active'));

    if (!isActive) {
      card.classList.add('active');
    }
  });
});

// Formulário → WhatsApp
const form = document.getElementById('contatoForm');
const formMessage = document.getElementById('formMessage');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem').value;

    const texto = `Olá!%0A*Nome:* ${nome}%0A*E-mail:* ${email}%0A*Mensagem:* ${mensagem}`;

    window.open(
      `https://wa.me/5561998603162?text=${encodeURIComponent(texto)}`,
      '_blank',
      'noopener,noreferrer',
    );

    formMessage.textContent = 'Redirecionando para o WhatsApp...';
    formMessage.className = 'form-message success';
  });
}
