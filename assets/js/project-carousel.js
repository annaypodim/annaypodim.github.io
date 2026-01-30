// Project carousel logic: builds slides from data, rotates them, and wires up controls.
(() => {
  const AUTOPLAY_DELAY = 6000;

  const onReady = (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  };

  const createSlide = (project, index, total, fallbackImage) => {
    const slide = document.createElement('article');
    slide.className = 'carousel-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${total}`);

    const backgroundImage = project.image || fallbackImage;
    slide.style.setProperty('--slide-image', `url('${backgroundImage}')`);

    const content = document.createElement('div');
    content.className = 'carousel-slide__content';

    if (project.languages) {
      const stack = document.createElement('p');
      stack.className = 'carousel-slide__stack';
      stack.textContent = project.languages;
      content.appendChild(stack);
    }

    const title = document.createElement('h3');
    title.className = 'carousel-slide__title';
    title.textContent = project.title || 'Untitled project';
    content.appendChild(title);

    if (project.description) {
      const description = document.createElement('p');
      description.className = 'carousel-slide__description';
      description.textContent = project.description;
      content.appendChild(description);
    }

    slide.appendChild(content);
    return slide;
  };

  onReady(() => {
    const track = document.querySelector('[data-carousel-track]');
    if (!track) return;

    const carouselSection = track.closest('.project-carousel');
    const slideData = Array.isArray(window.projectCarouselData) ? window.projectCarouselData : [];

    if (!carouselSection || !slideData.length) return;

    const dotsContainer = carouselSection.querySelector('[data-carousel-dots]');
    const prevButton = carouselSection.querySelector('[data-carousel-prev]');
    const nextButton = carouselSection.querySelector('[data-carousel-next]');
    const hoverTarget = carouselSection.querySelector('.project-carousel__viewport') || carouselSection;
    const fallbackImage = carouselSection.getAttribute('data-fallback-image') || '/assets/images/photo-placeholder.jpeg';

    const slides = [];
    const dots = [];
    const totalSlides = slideData.length;

    slideData.forEach((project, index) => {
      const slide = createSlide(project, index, totalSlides, fallbackImage);
      track.appendChild(slide);
      slides.push(slide);

      if (dotsContainer) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Show project ${index + 1}`);
        dot.addEventListener('click', () => {
          setActiveSlide(index);
          restartAutoplay();
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      }
    });

    if (!slides.length) return;

    let activeIndex = 0;
    let autoplayTimer = null;
    let allowAutoplay = true;

    const prefersReducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    if (prefersReducedMotion && prefersReducedMotion.matches) {
      allowAutoplay = false;
    }

    const setActiveSlide = (index) => {
      const total = slides.length;
      if (!total) return;
      const normalizedIndex = ((index % total) + total) % total;

      slides.forEach((slide, idx) => {
        slide.classList.toggle('is-active', idx === normalizedIndex);
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === normalizedIndex);
      });

      activeIndex = normalizedIndex;
    };

    const showNext = () => setActiveSlide(activeIndex + 1);
    const showPrevious = () => setActiveSlide(activeIndex - 1);

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const startAutoplay = () => {
      if (!allowAutoplay || slides.length < 2) return;
      stopAutoplay();
      autoplayTimer = window.setInterval(showNext, AUTOPLAY_DELAY);
    };

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    if (prefersReducedMotion) {
      const handleMotionChange = (event) => {
        allowAutoplay = !event.matches;
        if (allowAutoplay) {
          startAutoplay();
        } else {
          stopAutoplay();
        }
      };

      if (typeof prefersReducedMotion.addEventListener === 'function') {
        prefersReducedMotion.addEventListener('change', handleMotionChange);
      } else if (typeof prefersReducedMotion.addListener === 'function') {
        prefersReducedMotion.addListener(handleMotionChange);
      }
    }

    nextButton?.addEventListener('click', () => {
      showNext();
      restartAutoplay();
    });

    prevButton?.addEventListener('click', () => {
      showPrevious();
      restartAutoplay();
    });

    if (hoverTarget && slides.length > 1) {
      hoverTarget.addEventListener('mouseenter', stopAutoplay);
      hoverTarget.addEventListener('mouseleave', startAutoplay);
    }

    setActiveSlide(0);
    startAutoplay();
  });
})();
