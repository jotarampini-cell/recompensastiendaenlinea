// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth < 768;

    // Inicializar cursor personalizado (solo escritorio)
    if (!isMobile) {
        initCustomCursor();
    }

    // Inicializar partículas de fondo
    initParticlesBg(isMobile);

    // Inicializar scroll suave
    initSmoothScroll();

    // Inicializar revelado por scroll
    initScrollReveals();

    // Comportamiento del scroll en la barra de navegación
    initNavbarScroll();

    // Inicializar módulos de componentes si existen
    if(typeof initCarousel === 'function') initCarousel(isMobile);
    if(typeof initCardFlip === 'function') initCardFlip(isMobile);
    if(typeof initSpinWheel === 'function') initSpinWheel(isMobile);
    if(typeof initScratchCard === 'function') initScratchCard(isMobile);
    if(typeof initGiftBox === 'function') initGiftBox(isMobile);
    
    // Módulos adicionales
    if(typeof initScrollStory === 'function') initScrollStory(isMobile);
    if(typeof initPuzzle === 'function') initPuzzle(isMobile);
    if(typeof initProgressBar === 'function') initProgressBar(isMobile);
    if(typeof initStarMap === 'function') initStarMap(isMobile);
    if(typeof initGumball === 'function') initGumball(isMobile);
    if(typeof initCountdown === 'function') initCountdown(isMobile);
    if(typeof initLeaderboard === 'function') initLeaderboard(isMobile);
});

// Cursor personalizado
function initCustomCursor() {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const interactives = document.querySelectorAll('a, button, .interactive');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });

    function render() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

// Partículas de fondo
function initParticlesBg(isMobile) {
    const container = document.getElementById('particles-bg');
    if (!container) return;

    const particleCount = isMobile ? 20 : 50;

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        
        const size = Math.random() * 4 + 2;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        
        p.style.opacity = Math.random() * 0.3 + 0.1;
        p.style.animation = `float ${Math.random() * 25 + 15}s linear infinite`;
        
        container.appendChild(p);
    }

    if (!isMobile) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            container.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// Scroll suave para navegación
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Revelar elementos al hacer scroll
function initScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section, .reveal-item').forEach(el => {
        observer.observe(el);
    });
}

// Comportamiento del scroll en la barra de navegación
function initNavbarScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        let current = '';
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-dot').forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href') === `#${current}`) {
                dot.classList.add('active');
            }
        });
    }, { passive: true });
}
