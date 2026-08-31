// js/carousel.js
function initCarousel(isMobile) {
    const container = document.querySelector('.carousel-container');
    if (!container) return;

    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentIndex = 0;
    let autoPlayInterval;
    let isAnimating = false;

    if (slides.length > 0) {
        gsap.set(slides[0], { opacity: 1, scale: 1 });
        slides[0].classList.add('active');
    }

    function goToSlide(index) {
        if (isAnimating || index === currentIndex) return;
        isAnimating = true;

        const currentSlide = slides[currentIndex];
        const nextSlide = slides[index];

        gsap.to(currentSlide, { 
            opacity: 0, 
            scale: 0.9, 
            duration: 0.6,
            onComplete: () => {
                currentSlide.classList.remove('active');
            }
        });

        nextSlide.classList.add('active');
        gsap.fromTo(nextSlide, 
            { opacity: 0, scale: 1.1 }, 
            { opacity: 1, scale: 1, duration: 0.8, onComplete: () => {
                isAnimating = false;
            }}
        );

        if (dots[currentIndex]) dots[currentIndex].classList.remove('active');
        if (dots[index]) dots[index].classList.add('active');

        currentIndex = index;
    }

    function nextSlide() {
        let index = (currentIndex + 1) % slides.length;
        goToSlide(index);
    }

    function prevSlide() {
        let index = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(index);
    }

    // Pointer events para botones (soporta mouse y touch)
    if (nextBtn) nextBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); nextSlide(); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); prevSlide(); resetAutoPlay(); });

    dots.forEach((dot, index) => {
        dot.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            goToSlide(index);
            resetAutoPlay();
        });
    });

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    container.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    container.addEventListener('mouseleave', startAutoPlay);

    // Swipe para móvil y escritorio
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoPlayInterval);
    }, { passive: true });

    container.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextSlide();
        if (touchEndX > touchStartX + 50) prevSlide();
    }

    // Parallax solo en escritorio
    if (!isMobile) {
        container.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            gsap.to('.carousel-slide.active .slide-content', { x: x, y: y, duration: 0.5 });
        });
    }

    startAutoPlay();
}
