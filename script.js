document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const themeToggler = document.getElementById('themeToggler');
  const bodyElement = document.documentElement;
  const currentYearSpan = document.getElementById('currentYear');

  // Hamburger Menu Toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach((n) =>
      n.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
        }
      })
    );
  }

  // Theme Toggler Logic
  const applyTheme = (theme) => {
    if (theme === 'light') {
      bodyElement.classList.add('light-mode');
      if (themeToggler) themeToggler.innerHTML = '🌙 Dark Mode';
    } else {
      bodyElement.classList.remove('light-mode');
      if (themeToggler) themeToggler.innerHTML = '☀️ Light Mode';
    }
  };

  const toggleTheme = () => {
    let currentTheme = bodyElement.classList.contains('light-mode') ? 'light' : 'dark';
    let newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('portfolioTheme', newTheme);
  };

  if (themeToggler) {
    themeToggler.addEventListener('click', toggleTheme);
  }

  const savedTheme = localStorage.getItem('portfolioTheme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme('dark');
  }

  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // === INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ===
  const scrollElements = document.querySelectorAll('.js-scroll-trigger');

  if (scrollElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
    scrollElements.forEach((el) => scrollObserver.observe(el));
  }

  // === MODAL LOGIC ===
  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = projectModal ? projectModal.querySelector('.modal-close-btn') : null;
  const viewDetailsBtns = document.querySelectorAll('.view-details-btn');

  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalProjectImage = document.getElementById('modalProjectImage');
  const modalProjectGallery = document.getElementById('modalProjectGallery');
  const modalProjectChallenge = document.getElementById('modalProjectChallenge');
  const modalProjectRole = document.getElementById('modalProjectRole');
  const modalProjectTools = document.getElementById('modalProjectTools');
  const modalProjectOutcome = document.getElementById('modalProjectOutcome');

  function openModal() {
    if (!projectModal) return;
    projectModal.classList.add('is-visible');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    if (!projectModal) return;
    projectModal.classList.remove('is-visible');
    document.body.classList.remove('modal-open');
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (event) => {
      if (event.target === projectModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && projectModal && projectModal.classList.contains('is-visible')) {
      closeModal();
    }
  });

  viewDetailsBtns.forEach((button) => {
    button.addEventListener('click', (event) => {
      const card = event.target.closest('.project-card');
      if (
        !card ||
        !projectModal ||
        !modalProjectTitle ||
        !modalProjectImage ||
        !modalProjectGallery ||
        !modalProjectChallenge ||
        !modalProjectRole ||
        !modalProjectTools ||
        !modalProjectOutcome
      ) {
        console.error('Modal or card or one of its sub-elements not found!');
        return;
      }

      modalProjectTitle.textContent = card.dataset.projectTitle || 'Project Details';

      const galleryImagesData = card.dataset.projectGalleryImages;
      modalProjectGallery.innerHTML = '';

      if (galleryImagesData && galleryImagesData.trim() !== '[]' && galleryImagesData.trim() !== '') {
        try {
          const galleryImages = JSON.parse(galleryImagesData);
          if (Array.isArray(galleryImages) && galleryImages.length > 0) {
            galleryImages.forEach((imgSrc) => {
              const imgElement = document.createElement('img');
              imgElement.src = imgSrc;
              imgElement.alt = (card.dataset.projectTitle || 'Project') + ' gallery image';
              modalProjectGallery.appendChild(imgElement);
            });
            modalProjectGallery.style.display = 'flex';
            modalProjectImage.style.display = 'none';
          } else {
            modalProjectImage.src = card.dataset.projectImage || 'placeholder-large.jpg';
            modalProjectImage.alt = card.dataset.projectTitle || 'Project Image';
            modalProjectImage.style.display = 'block';
            modalProjectGallery.style.display = 'none';
          }
        } catch (e) {
          console.error('Error parsing gallery images data:', e, 'Raw data:', galleryImagesData);
          modalProjectImage.src = card.dataset.projectImage || 'placeholder-large.jpg';
          modalProjectImage.alt = card.dataset.projectTitle || 'Project Image';
          modalProjectImage.style.display = 'block';
          modalProjectGallery.style.display = 'none';
        }
      } else {
        modalProjectImage.src = card.dataset.projectImage || 'placeholder-large.jpg';
        modalProjectImage.alt = card.dataset.projectTitle || 'Project Image';
        modalProjectImage.style.display = 'block';
        modalProjectGallery.style.display = 'none';
      }

      modalProjectChallenge.textContent = card.dataset.projectChallenge || '';
      modalProjectRole.textContent = card.dataset.projectRole || '';
      modalProjectTools.textContent = card.dataset.projectTools || '';
      modalProjectOutcome.textContent = card.dataset.projectOutcome || '';

      openModal();
    });
  });
}); // End of DOMContentLoaded
