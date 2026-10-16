const projects = {
  barber: {
    label: 'PROJECT / 01 · ANGULAR + LARAVEL',
    title: 'King of Barber',
    description: 'A web application for running a barber shop, with separate workflows for clients, barbers, and the owner.',
    details: ['Clients can book a specific barber or join the live queue.', 'Barbers can see their reservations and manage services.', 'Owners can manage the team, services, working hours, and shop content.', 'Account holders can rate barbers and haircuts.']
  },
  store: {
    label: 'PROJECT / 02 · ANGULAR + LARAVEL',
    title: 'Online store & admin',
    description: 'A shop built for a family business, paired with an admin workspace that brings day-to-day operations together.',
    details: ['Manage products, images, customers, and orders.', 'Store product images locally through the Laravel application.', 'Review statistics and notifications in the admin panel.', 'Support Arabic content and customer information, including birthdays.']
  }
};

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-navigation');
if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    document.body.classList.toggle('menu-open', !isOpen);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
}

const projectTabs = document.querySelector('.project-tabs');
const projectPanels = [...document.querySelectorAll('[data-project-panel]')];
if (projectTabs && projectPanels.length) {
  const selectProject = key => {
    projectPanels.forEach(panel => {
      const isActive = panel.dataset.projectPanel === key;
      panel.hidden = !isActive;
    });
    projectTabs.querySelectorAll('[role="tab"]').forEach(tab => {
      const isActive = tab.dataset.projectTab === key;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
  };
  projectPanels.forEach((panel, index) => {
    const key = panel.dataset.projectPanel;
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'project-tab';
    tab.dataset.projectTab = key;
    tab.id = `project-tab-${key}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `project-panel-${key}`);
    tab.setAttribute('aria-selected', String(index === 0));
    tab.tabIndex = index === 0 ? 0 : -1;
    tab.textContent = panel.querySelector('.project-info h3')?.textContent || projects[key].title;
    panel.id = `project-panel-${key}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    tab.addEventListener('click', () => selectProject(key));
    tab.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const nextIndex = (index + (event.key === 'ArrowRight' ? 1 : -1) + projectPanels.length) % projectPanels.length;
      const nextKey = projectPanels[nextIndex].dataset.projectPanel;
      selectProject(nextKey);
      projectTabs.querySelector(`[data-project-tab="${nextKey}"]`).focus();
    });
    projectTabs.append(tab);
  });
  selectProject(projectPanels[0].dataset.projectPanel);
}

const carousel = document.querySelector('.screenshot-grid');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.screenshot')];
  let currentSlide = 0;
  const updateCarousel = () => {
    slides.forEach((slide, index) => slide.classList.toggle('is-active', index === currentSlide));
  };
  const moveSlide = direction => {
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    updateCarousel();
  };
  const createArrow = (direction, label) => {
    const button = document.createElement('button');
    button.className = `carousel-arrow carousel-arrow-${direction}`;
    button.type = 'button';
    button.setAttribute('aria-label', label);
    button.textContent = direction === 'previous' ? '←' : '→';
    button.addEventListener('click', () => moveSlide(direction === 'previous' ? -1 : 1));
    return button;
  };
  carousel.classList.add('screenshot-carousel');
  carousel.parentElement.append(createArrow('previous', 'Previous King of Barber screenshot'), createArrow('next', 'Next King of Barber screenshot'));
  updateCarousel();
  carousel.parentElement.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') moveSlide(-1);
    if (event.key === 'ArrowRight') moveSlide(1);
  });
  carousel.parentElement.tabIndex = 0;
}

const storeVisual = document.querySelector('.store-visual');
if (storeVisual) {
  const storeGallery = document.createElement('div');
  storeGallery.className = 'store-carousel screenshot-carousel';
  [
    ['Fanuna storefront', 'images/fanuna-storefront.png'],
    ['Fanuna admin dashboard', 'images/fanuna-admin-dashboard.png']
  ].forEach(([alt, src], index) => {
    const figure = document.createElement('figure');
    figure.className = `screenshot${index === 0 ? ' is-active' : ''}`;
    const image = document.createElement('img');
    image.src = src;
    image.alt = alt;
    figure.append(image);
    storeGallery.append(figure);
  });
  let currentStoreSlide = 0;
  const storeSlides = [...storeGallery.querySelectorAll('.screenshot')];
  const updateStoreCarousel = () => storeSlides.forEach((slide, index) => slide.classList.toggle('is-active', index === currentStoreSlide));
  const moveStoreSlide = direction => {
    currentStoreSlide = (currentStoreSlide + direction + storeSlides.length) % storeSlides.length;
    updateStoreCarousel();
  };
  const previousStore = document.createElement('button');
  previousStore.className = 'carousel-arrow carousel-arrow-previous';
  previousStore.type = 'button';
  previousStore.setAttribute('aria-label', 'Previous Fanuna screenshot');
  previousStore.textContent = '←';
  previousStore.addEventListener('click', () => moveStoreSlide(-1));
  const nextStore = document.createElement('button');
  nextStore.className = 'carousel-arrow carousel-arrow-next';
  nextStore.type = 'button';
  nextStore.setAttribute('aria-label', 'Next Fanuna screenshot');
  nextStore.textContent = '→';
  nextStore.addEventListener('click', () => moveStoreSlide(1));
  storeVisual.replaceChildren(
    storeGallery,
    previousStore,
    nextStore
  );
}

const dialog = document.querySelector('#project-dialog');
let previousFocus;

const lightbox = document.querySelector('#image-lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrevious = document.querySelector('.lightbox-previous');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxCounter = document.querySelector('.lightbox-counter');
const lightboxImages = [...document.querySelectorAll('.screenshot img')];
let lightboxTrigger;
let lightboxIndex = 0;

const updateLightbox = () => {
  const image = lightboxImages[lightboxIndex];
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
};

const closeLightbox = () => {
  lightbox.hidden = true;
  document.body.classList.remove('lightbox-open');
  lightboxImage.removeAttribute('src');
  lightboxTrigger?.focus();
};

const moveLightbox = direction => {
  lightboxIndex = (lightboxIndex + direction + lightboxImages.length) % lightboxImages.length;
  updateLightbox();
};

lightboxImages.forEach((image, index) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `View ${image.alt} full size`);
  const openLightbox = () => {
    lightboxTrigger = image;
    lightboxIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
  };
  image.addEventListener('click', openLightbox);
  image.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openLightbox();
    }
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrevious.addEventListener('click', () => moveLightbox(-1));
lightboxNext.addEventListener('click', () => moveLightbox(1));
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  if (event.key === 'ArrowLeft' && !lightbox.hidden) moveLightbox(-1);
  if (event.key === 'ArrowRight' && !lightbox.hidden) moveLightbox(1);
});

document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    previousFocus = button;
    document.querySelector('#dialog-label').textContent = project.label;
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-description').textContent = project.description;
    const list = document.createElement('ul');
    project.details.forEach(detail => { const item = document.createElement('li'); item.textContent = detail; list.append(item); });
    document.querySelector('#dialog-details').replaceChildren(list);
    dialog.setAttribute('aria-labelledby', 'dialog-title');
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); previousFocus?.focus(); });
document.querySelector('#year').textContent = new Date().getFullYear();

const revealItems = document.querySelectorAll('.hero, .stack-strip, .section, .project');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => {
    item.classList.add('reveal');
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}
