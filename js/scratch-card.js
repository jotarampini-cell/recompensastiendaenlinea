// js/scratch-card.js
function initScratchCard(isMobile) {
    const canvas = document.getElementById('scratch-canvas');
    const container = document.getElementById('scratch-container');
    const resetBtn = document.getElementById('reset-scratch-btn');
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let isRevealed = false;
    const scratchRadius = isMobile ? 35 : 25;

    function resizeCanvas() {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        fillCanvas();
    }

    function fillCanvas() {
        ctx.globalCompositeOperation = 'source-over';
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#e0e0e0');
        gradient.addColorStop(0.5, '#9e9e9e');
        gradient.addColorStop(1, '#616161');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#333';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('RASPA AQUÍ', canvas.width / 2, canvas.height / 2);
    }

    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = (e.touches && e.touches.length > 0) ? e.touches[0].clientX : e.clientX;
        const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'scratch-sparkle';
        sparkle.style.position = 'absolute';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.backgroundColor = '#fff';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.boxShadow = '0 0 4px #fff';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        
        container.appendChild(sparkle);

        gsap.to(sparkle, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            onComplete: () => sparkle.remove()
        });
    }

    function scratch(e) {
        if (!isDrawing || isRevealed) return;
        if (e.cancelable) e.preventDefault(); // Previene scroll al raspar
        
        const pos = getMousePos(e);
        
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, scratchRadius, 0, 2 * Math.PI);
        ctx.fill();

        if (!isMobile && Math.random() > 0.8) {
            createSparkle(pos.x, pos.y);
        } else if (isMobile && Math.random() > 0.95) { // Menos chispas en móvil
            createSparkle(pos.x, pos.y);
        }

        checkPercentage();
    }

    let checkTimeout;
    function checkPercentage() {
        if (checkTimeout) return;
        // Throttle para mejor rendimiento
        checkTimeout = setTimeout(() => {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            let transparent = 0;
            
            // Chequear en saltos más grandes en móvil
            const step = isMobile ? 16 : 4; 
            
            for (let i = 0; i < pixels.length; i += step) {
                if (pixels[i + 3] === 0) transparent++;
            }
            
            const totalPixelsChecked = pixels.length / step;
            const percent = (transparent / totalPixelsChecked) * 100;
            
            if (percent > 60 && !isRevealed) {
                isRevealed = true;
                gsap.to(canvas, {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: () => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }
                });
            }
            checkTimeout = null;
        }, 100);
    }

    canvas.addEventListener('pointerdown', (e) => { 
        isDrawing = true; 
        scratch(e);
    });
    
    window.addEventListener('pointerup', () => { 
        isDrawing = false; 
    });
    
    canvas.addEventListener('pointermove', (e) => {
        if(isDrawing) scratch(e);
    }, { passive: false }); // Debe ser falso para usar preventDefault()

    // Eventos específicos touch para máxima compatibilidad
    canvas.addEventListener('touchstart', (e) => { 
        isDrawing = true; 
        scratch(e);
    }, { passive: false });
    
    window.addEventListener('touchend', () => { isDrawing = false; });
    
    canvas.addEventListener('touchmove', (e) => {
        if(isDrawing) scratch(e);
    }, { passive: false });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            isRevealed = false;
            canvas.style.opacity = 1;
            fillCanvas();
        });
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}
