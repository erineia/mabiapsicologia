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

const form = document.getElementById('contatoForm');
const formMessage = document.getElementById('formMessage');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    formMessage.textContent = 'Enviando mensagem...';
    formMessage.className = 'form-message';

    const formData = new FormData(form);

    try {
      const res = await fetch('/', {
        method: 'POST',
        body: formData,
      });

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
