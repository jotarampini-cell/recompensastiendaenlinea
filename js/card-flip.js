// js/card-flip.js
function initCardFlip(isMobile) {
    const cards = document.querySelectorAll('.flip-card');
    const resetBtn = document.querySelector('#reset-flips-btn');
    const counterDisplay = document.querySelector('#flip-counter');
    if (cards.length === 0) return;

    let flipsAllowed = 3;
    let flipsUsed = 0;
    const confettiCount = isMobile ? 15 : 30;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    
    function playPopSound() {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    function createConfetti(x, y) {
        const colors = ['var(--accent-cyan)', 'var(--accent-magenta)', 'var(--accent-gold)'];
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.position = 'fixed';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            
            confetti.style.left = `${x}px`;
            confetti.style.top = `${y}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(confetti);

            const tx = (Math.random() - 0.5) * 200;
            const ty = (Math.random() - 1) * 200;
            
            gsap.to(confetti, {
                x: tx,
                y: ty,
                rotation: Math.random() * 360,
                opacity: 0,
                duration: 1 + Math.random(),
                ease: 'power1.out',
                onComplete: () => confetti.remove()
            });
        }
    }

    function updateCounter() {
        if (counterDisplay) {
            counterDisplay.textContent = flipsAllowed - flipsUsed;
        }
    }

    cards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: card,
            opacity: 0,
            y: 50,
            duration: 0.6,
            delay: index * 0.1
        });

        // Usar click que soporta taps en móvil nativamente de manera adecuada
        card.addEventListener('click', (e) => {
            e.preventDefault();
            if (flipsUsed >= flipsAllowed || card.classList.contains('flipped') || card.classList.contains('disabled')) return;

            card.classList.add('flipped');
            playPopSound();
            
            const rect = card.getBoundingClientRect();
            createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

            flipsUsed++;
            updateCounter();

            if (flipsUsed >= flipsAllowed) {
                cards.forEach(c => {
                    if (!c.classList.contains('flipped')) {
                        c.classList.add('disabled');
                    }
                });
            }
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            flipsUsed = 0;
            updateCounter();
            cards.forEach(c => {
                c.classList.remove('flipped');
                c.classList.remove('disabled');
            });
        });
    }

    updateCounter();
}
