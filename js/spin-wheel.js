// js/spin-wheel.js
function initSpinWheel(isMobile) {
    const canvas = document.getElementById('spin-wheel');
    const container = document.getElementById('spin-container');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spin-btn');
    
    const segments = [
        { text: "5% Dcto", color: "var(--accent-cyan)" },
        { text: "10% Dcto", color: "var(--accent-magenta)" },
        { text: "Envío Gratis", color: "var(--accent-gold)" },
        { text: "15% Dcto", color: "var(--accent-purple)" },
        { text: "2x Puntos", color: "var(--accent-blue)" },
        { text: "20% Dcto", color: "#2a9d8f" },
        { text: "Gift Card $50", color: "#ff6b35" },
        { text: "¡50% Dcto!", color: "#ef233c" }
    ];
    
    let wheelRotation = { value: 0 };
    let isSpinning = false;
    
    const tempEl = document.createElement('div');
    document.body.appendChild(tempEl);
    const parsedSegments = segments.map(seg => {
        tempEl.style.color = seg.color;
        const compStyle = getComputedStyle(tempEl).color;
        return { text: seg.text, color: compStyle !== '' ? compStyle : seg.color };
    });
    document.body.removeChild(tempEl);

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function playTick() {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    }

    function resizeCanvas() {
        if (!container) return;
        const width = container.clientWidth;
        const size = isMobile ? Math.min(width, 300) : 400;
        canvas.width = size;
        canvas.height = size;
        redrawWheel();
    }

    function redrawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        const arc = 2 * Math.PI / parsedSegments.length;

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(wheelRotation.value);

        for (let i = 0; i < parsedSegments.length; i++) {
            const angle = i * arc;
            
            ctx.beginPath();
            ctx.fillStyle = parsedSegments[i].color;
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, angle, angle + arc);
            ctx.lineTo(0, 0);
            ctx.fill();
            
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#fff';
            ctx.stroke();

            ctx.save();
            ctx.translate(Math.cos(angle + arc / 2) * (radius * 0.65), Math.sin(angle + arc / 2) * (radius * 0.65));
            ctx.rotate(angle + arc / 2);
            ctx.fillStyle = '#fff';
            const fontSize = radius > 150 ? 16 : 12;
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(parsedSegments[i].text, 0, 0);
            ctx.restore();
        }
        
        ctx.restore();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius > 150 ? 40 : 30, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.fillStyle = '#333';
        ctx.font = `bold ${radius > 150 ? 18 : 14}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('GIRA', centerX, centerY);
    }

    let lastTickAngle = 0;
    
    function spin() {
        if (isSpinning) return;
        isSpinning = true;
        if (spinBtn) spinBtn.disabled = true;
        
        const randomSegment = Math.floor(Math.random() * parsedSegments.length);
        const extraRotations = (Math.floor(Math.random() * 3) + 4) * Math.PI * 2;
        
        const arc = 2 * Math.PI / parsedSegments.length;
        const targetAngle = wheelRotation.value + extraRotations + (Math.PI * 2) - (randomSegment * arc) - (arc / 2) - (Math.PI / 2);

        gsap.to(wheelRotation, {
            value: targetAngle,
            duration: 4,
            ease: 'power4.out',
            onUpdate: () => {
                redrawWheel();
                
                const currentMod = wheelRotation.value % (Math.PI * 2);
                if (Math.abs(currentMod - lastTickAngle) > (Math.PI * 2 / parsedSegments.length)) {
                    playTick();
                    lastTickAngle = currentMod;
                }
            },
            onComplete: () => {
                showResult(parsedSegments[randomSegment].text);
                setTimeout(() => {
                    isSpinning = false;
                    if (spinBtn) spinBtn.disabled = false;
                }, 2000);
            }
        });
    }

    function showResult(prizeText) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'spin-result';
        resultDiv.textContent = `¡Ganaste: ${prizeText}!`;
        
        Object.assign(resultDiv.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0.5)',
            background: 'var(--bg-card)',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            color: '#fff',
            fontWeight: 'bold',
            zIndex: '100',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            opacity: '0'
        });
        
        canvas.parentElement.style.position = 'relative';
        canvas.parentElement.appendChild(resultDiv);
        
        gsap.to(resultDiv, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out' });
        
        setTimeout(() => {
            gsap.to(resultDiv, { opacity: 0, scale: 0.5, duration: 0.5, onComplete: () => resultDiv.remove() });
        }, 3000);
    }

    if (spinBtn) {
        spinBtn.addEventListener('click', spin);
    }
    
    // Swipe para girar
    let touchStartY = 0;
    canvas.addEventListener('touchstart', e => {
        touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });
    
    canvas.addEventListener('touchend', e => {
        const touchEndY = e.changedTouches[0].clientY;
        if (touchEndY > touchStartY + 30) {
            spin();
        }
    }, { passive: true });

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
}
