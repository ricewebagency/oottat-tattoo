// Black & Grey Carousel
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('[data-carousel-track]');
  const prevBtn = document.querySelector('[data-carousel-prev]');
  const nextBtn = document.querySelector('[data-carousel-next]');
  const indicators = document.querySelectorAll('.carousel-indicator');
  const carouselContainer = track?.parentElement;

  if (!track) return; // Exit if carousel doesn't exist on this page

  let currentIndex = 0;
  const totalSlides = track.querySelectorAll('.carousel-item').length;
  let touchStartX = 0;
  let touchEndX = 0;

  function updateCarousel() {
    const offset = -currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;

    // Update indicators
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.remove('bg-white/40');
        indicator.classList.add('bg-white');
        indicator.setAttribute('aria-current', 'true');
      } else {
        indicator.classList.remove('bg-white');
        indicator.classList.add('bg-white/40');
        indicator.removeAttribute('aria-current');
      }
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  // Event listeners for buttons
  nextBtn?.addEventListener('click', nextSlide);
  prevBtn?.addEventListener('click', prevSlide);

  // Indicator clicks
  indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => {
      currentIndex = parseInt(indicator.dataset.index);
      updateCarousel();
    });
  });

  // Touch/Swipe support
  carouselContainer?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  carouselContainer?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left, go to next slide
        nextSlide();
      } else {
        // Swiped right, go to previous slide
        prevSlide();
      }
    }
  }

  // Optional: Auto-play
  // let autoPlayInterval = setInterval(nextSlide, 5000);
  // track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  // track.addEventListener('mouseleave', () => {
  //   autoPlayInterval = setInterval(nextSlide, 5000);
  // });
});
