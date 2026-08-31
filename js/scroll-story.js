// js/scroll-story.js
function initScrollStory() {
    const container = document.querySelector('.scroll-story-container');
    if (!container) return;

    // Registrar plugin ScrollTrigger de GSAP
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // 1. Animar el trazado del camino SVG
        const path = document.querySelector('.scroll-story-path path');
        if (path) {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;

            gsap.to(path, {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.scroll-story-container',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true
                }
            });
        }

        // 2. Revelar tarjetas de nivel y actualizar medallas y progreso
        const cards = document.querySelectorAll('.level-card');
        const badges = document.querySelectorAll('.level-badge');
        const progressBar = document.querySelector('.scroll-progress-bar');
        const progressText = document.querySelector('.scroll-progress-text');
        
        const isMobile = window.matchMedia('(hover: none)').matches || window.innerWidth < 768;
        
        const colors = {
            bronze: '#cd7f32',
            silver: '#c0c0c0',
            gold: '#ffd700',
            diamond: '#b9f2ff'
        };

        cards.forEach((card, index) => {
            // Animar entrada de tarjeta desde lados alternos, o desde abajo en móvil
            let xOffset = index % 2 === 0 ? -100 : 100;
            let yOffset = 0;
            if (isMobile) {
                xOffset = 0;
                yOffset = 50;
            }
            
            gsap.fromTo(card, 
                { x: xOffset, y: yOffset, opacity: 0 },
                {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            // Cambiar medalla cuando se alcanza
            ScrollTrigger.create({
                trigger: card,
                start: 'top center',
                onEnter: () => activateBadge(index),
                onEnterBack: () => activateBadge(index)
            });
        });

        function activateBadge(index) {
            badges.forEach((b, i) => {
                if (i <= index) {
                    b.classList.add('active');
                    gsap.to(b, { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 });
                    
                    // Aplicar color metálico correspondiente
                    const level = b.dataset.level;
                    if(level && colors[level]) {
                        b.style.boxShadow = `0 0 20px ${colors[level]}`;
                        b.style.borderColor = colors[level];
                        if(level === 'diamond') {
                            b.classList.add('sparkle-effect');
                        }
                    }
                } else {
                    b.classList.remove('active');
                    b.style.boxShadow = 'none';
                    b.style.borderColor = 'transparent';
                    b.classList.remove('sparkle-effect');
                }
            });
        }

        // 4. Actualizar indicador de porcentaje
        ScrollTrigger.create({
            trigger: '.scroll-story-container',
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                const progress = Math.round(self.progress * 100);
                if (progressBar) progressBar.style.width = `${progress}%`;
                if (progressText) progressText.textContent = `${progress}%`;
            }
        });
    }
}
