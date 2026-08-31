// js/countdown.js
function initCountdown() {
    const isMobile = window.matchMedia('(hover: none)').matches || window.innerWidth < 768;
    
    const hoursEl = document.getElementById('cd-hours');
    const minutesEl = document.getElementById('cd-minutes');
    const secondsEl = document.getElementById('cd-seconds');
    const revealBtn = document.querySelector('.countdown-reveal-btn');
    const offerCard = document.querySelector('.countdown-offer-card');
    
    if (!hoursEl || !minutesEl || !secondsEl) return;
    
    // Target: 2 horas, 30 minutos desde ahora
    const targetTime = new Date().getTime() + (2 * 60 * 60 * 1000) + (30 * 60 * 1000);
    let timerInterval;
    let isRevealed = false;
    
    const state = { h: -1, m: -1, s: -1 };
    
    function updateTimer() {
        if (isRevealed) return;
        
        const now = new Date().getTime();
        const distance = targetTime - now;
        
        if (distance <= 0) {
            clearInterval(timerInterval);
            revealOffer();
            return;
        }
        
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (state.h !== h) flipNumber(hoursEl, h);
        if (state.m !== m) flipNumber(minutesEl, m);
        if (state.s !== s) flipNumber(secondsEl, s);
        
        state.h = h;
        state.m = m;
        state.s = s;
        
        const timerContainer = document.querySelector('.countdown-timer');
        if (distance < 10 * 60 * 1000 && timerContainer && !timerContainer.classList.contains('urgent')) {
            timerContainer.classList.add('urgent');
            if (typeof gsap !== 'undefined') {
                gsap.to(timerContainer, { scale: 1.05, duration: 0.5, yoyo: true, repeat: -1 });
            }
        }
    }
    
    function flipNumber(element, newValue) {
        const valueStr = newValue < 10 ? '0' + newValue : String(newValue);
        
        if (element.children.length === 0) {
            element.textContent = valueStr;
            return;
        }
        
        const top = element.querySelector('.flip-top');
        const bottom = element.querySelector('.flip-bottom');
        if (!top || !bottom) {
            element.textContent = valueStr;
            return;
        }
        
        if (top.textContent === valueStr) return;
        
        const flipCard = document.createElement('div');
        flipCard.className = 'flip-card';
        flipCard.textContent = top.textContent;
        element.appendChild(flipCard);
        
        bottom.textContent = valueStr;
        
        if (typeof gsap !== 'undefined') {
            gsap.to(flipCard, {
                rotationX: -90,
                duration: 0.25,
                ease: 'power1.in',
                onComplete: () => {
                    top.textContent = valueStr;
                    flipCard.textContent = valueStr;
                    gsap.fromTo(flipCard, 
                        { rotationX: 90 }, 
                        { rotationX: 0, duration: 0.25, ease: 'power1.out', onComplete: () => flipCard.remove() }
                    );
                }
            });
        } else {
            top.textContent = valueStr;
            flipCard.remove();
        }
    }
    
    function revealOffer() {
        if (isRevealed || !offerCard) return;
        isRevealed = true;
        clearInterval(timerInterval);
        
        if (typeof gsap !== 'undefined') {
            gsap.to(offerCard, { filter: 'blur(0px)', duration: 1 });
            gsap.from(offerCard, { scale: 0.9, opacity: 0, duration: 0.5 });
        } else {
            offerCard.style.filter = 'none';
        }
        
        offerCard.innerHTML = `
            <h3>🎉 ¡70% de Descuento en Electrónicos!</h3>
            <p>Usa el código <strong>ELECTRO70</strong> al finalizar tu compra.</p>
        `;
        
        const confettiCount = isMobile ? 20 : 50;
        for (let i = 0; i < confettiCount; i++) {
            const conf = document.createElement('div');
            conf.className = 'confetti';
            conf.style.position = 'absolute';
            conf.style.width = '8px';
            conf.style.height = '8px';
            conf.style.left = Math.random() * 100 + '%';
            conf.style.top = '0';
            conf.style.backgroundColor = ['#00f5d4', '#f72585', '#ffd60a', '#7b2ff7'][Math.floor(Math.random() * 4)];
            offerCard.appendChild(conf);
            
            if (typeof gsap !== 'undefined') {
                gsap.to(conf, {
                    y: 200 + Math.random() * 100,
                    x: (Math.random() - 0.5) * 100,
                    rotation: Math.random() * 360,
                    duration: 1 + Math.random(),
                    ease: 'power1.out',
                    onComplete: () => conf.remove()
                });
            }
        }
    }
    
    if (revealBtn) {
        revealBtn.addEventListener('click', revealOffer);
        revealBtn.addEventListener('touchstart', (e) => { e.preventDefault(); revealOffer(); }, { passive: false });
    }
    
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); 
}
