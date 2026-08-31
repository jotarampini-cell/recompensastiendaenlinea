// js/gumball.js
function initGumball() {
    const dome = document.querySelector('.gumball-dome');
    const lever = document.querySelector('.gumball-lever');
    const leverBtn = document.querySelector('.gumball-lever-btn'); // Botón alternativo móvil
    const resultArea = document.querySelector('.gumball-result');
    const machine = document.querySelector('.gumball-machine');
    
    if (!dome || (!lever && !leverBtn)) return;
    
    const isMobile = window.matchMedia('(hover: none)').matches || window.innerWidth < 768;
    
    const colors = ['#00f5d4', '#f72585', '#ffd60a', '#7b2ff7', '#3a86ff', '#06d6a0', '#ff6b35', '#ef233c'];
    const rewards = ['5% Descuento', '10% Descuento', 'Envío Gratis', '50 Puntos', '100 Puntos', 'Sticker Digital', 'Cupón Sorpresa', '2x Puntos Hoy'];
    
    const numBalls = isMobile ? 20 : 40;
    const balls = [];
    let isDispensing = false;
    
    let audioCtx = null;
    function playPopSound() {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            console.log('Audio no soportado o bloqueado');
        }
    }

    for (let i = 0; i < numBalls; i++) {
        createBall();
    }
    
    function createBall() {
        const ball = document.createElement('div');
        ball.className = 'gumball';
        
        const size = Math.random() * 13 + 22; // 22-35px
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        ball.style.backgroundColor = color;
        ball.style.boxShadow = `inset -5px -5px 10px rgba(0,0,0,0.3), inset 5px 5px 10px rgba(255,255,255,0.5)`;
        
        const radius = 45; // porcentaje
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * radius;
        
        ball.style.left = `calc(50% + ${Math.cos(angle) * r}% - ${size/2}px)`;
        ball.style.top = `calc(50% + ${Math.sin(angle) * r}% - ${size/2}px)`;
        
        dome.appendChild(ball);
        balls.push(ball);
        
        if (typeof gsap !== 'undefined') {
            gsap.to(ball, {
                y: `+=${Math.random() * 10 - 5}`,
                x: `+=${Math.random() * 10 - 5}`,
                duration: Math.random() * 2 + 1,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
                delay: Math.random() * 2
            });
        }
    }
    
    function dispense() {
        if (isDispensing || balls.length === 0) return;
        isDispensing = true;
        
        if (resultArea) resultArea.innerHTML = '';
        
        if (typeof gsap !== 'undefined' && lever) {
            gsap.to(lever, { rotation: 45, duration: 0.3, yoyo: true, repeat: 1 });
        }
        
        if (typeof gsap !== 'undefined') {
            gsap.to(machine, { x: 5, duration: 0.1, yoyo: true, repeat: 5 }); 
            
            balls.forEach(ball => {
                gsap.to(ball, {
                    x: `+=${Math.random() * 20 - 10}`,
                    y: `+=${Math.random() * 20 - 10}`,
                    duration: 0.1,
                    yoyo: true,
                    repeat: isMobile ? 4 : 8
                });
            });
        }
        
        setTimeout(() => {
            const index = Math.floor(Math.random() * balls.length);
            const selectedBall = balls.splice(index, 1)[0];
            const reward = rewards[Math.floor(Math.random() * rewards.length)];
            
            if (typeof gsap !== 'undefined') {
                gsap.killTweensOf(selectedBall); 
                
                gsap.to(selectedBall, {
                    left: '50%',
                    top: '90%',
                    duration: 0.5,
                    ease: 'power2.in',
                    onComplete: () => {
                        playPopSound();
                        selectedBall.remove();
                        
                        if (resultArea) {
                            const resultBall = selectedBall.cloneNode(true);
                            resultBall.style.position = 'relative';
                            resultBall.style.left = 'auto';
                            resultBall.style.top = 'auto';
                            
                            const rewardText = document.createElement('div');
                            rewardText.className = 'gumball-reward-text';
                            rewardText.textContent = reward;
                            
                            resultArea.appendChild(resultBall);
                            resultArea.appendChild(rewardText);
                            
                            gsap.from(resultBall, { y: -50, opacity: 0, bounce: true, duration: 1 });
                            gsap.from(rewardText, { scale: 0, opacity: 0, delay: 0.5, duration: 0.5 });
                        }
                        
                        isDispensing = false;
                        
                        setTimeout(createBall, 2000);
                    }
                });
            } else {
                isDispensing = false;
            }
        }, 1000);
    }
    
    const handleTrigger = (e) => {
        e.preventDefault();
        dispense();
    };
    
    if (lever) {
        lever.addEventListener('click', handleTrigger);
        lever.addEventListener('touchstart', handleTrigger, { passive: false });
    }
    if (leverBtn) {
        leverBtn.addEventListener('click', handleTrigger);
        leverBtn.addEventListener('touchstart', handleTrigger, { passive: false });
    }
}
