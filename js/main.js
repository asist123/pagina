
document.addEventListener('DOMContentLoaded', () => {
  const backTop = document.getElementById('backTop');
  const menuLinks = document.querySelectorAll('.menu__link');
  const menuCollapseEl = document.getElementById('mainMenu');
  const sectionIds = ['home', 'about', 'services', 'team', 'contact'];


  const toggleBackTop = () => {
    backTop.classList.toggle('back-top--visible', window.scrollY > 200);
  };


  const setActiveLink = (id) => {
    menuLinks.forEach((link) => link.classList.remove('menu__link--active'));
    let target = document.querySelector(`.menu__link[href="#${id}"]`);
    if (id === 'team') {
      target = document.querySelector('.menu__link.dropdown-toggle');
    }
    if (target) target.classList.add('menu__link--active');
  };

  const updateScrollSpy = () => {
    const position = window.scrollY + 160;
    let current = 'home';
    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      const top = id === 'home' ? 0 : section.offsetTop;
      if (position >= top) current = id;
    });
    setActiveLink(current);
  };

  window.addEventListener('scroll', () => {
    toggleBackTop();
    updateScrollSpy();
  });
  toggleBackTop();
  updateScrollSpy();


  document.querySelectorAll('.menu__link:not(.dropdown-toggle), .dropdown-item').forEach((link) => {
    link.addEventListener('click', () => {
      if (menuCollapseEl.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(menuCollapseEl).hide();
      }
    });
  });


  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });

  const carouselElement = document.getElementById('heroCarousel');
  if (carouselElement) {
    new bootstrap.Carousel(carouselElement, { interval: 5000, ride: 'carousel' });
  }

  const counters = document.querySelectorAll('.stat__number');
  const animateCounter = (element) => {
    const target = Number(element.dataset.target);
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      element.textContent = Math.floor(progress * target).toLocaleString('es-CO');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((counter) => observer.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  // 7. Formulario de contacto: validación y envío (Netlify Forms)
  const form = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');

  const showAlert = (type, message) => {
    formAlert.className = `alert alert-${type} form__alert`;
    formAlert.textContent = message;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      showAlert('danger', 'Revisa los campos marcados en rojo.');
      return;
    }

    const data = new URLSearchParams(new FormData(form)).toString();
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
      });
      if (!response.ok) throw new Error('Respuesta no válida');
      showAlert('success', '¡Mensaje enviado! Te responderemos pronto.');
    } catch (error) {
      // En local (sin Netlify) no hay servidor que reciba el formulario
      showAlert('success', '¡Mensaje recibido! (modo demo: el envío real funciona al publicar en Netlify)');
    }
    form.reset();
    form.classList.remove('was-validated');
  });
});
