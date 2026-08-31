// js/progress-bar.js
function initProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const simulateBtn = document.querySelector('.simulate-btn');
    const resetBtn = document.querySelector('.progress-reset-btn');
    const amountDisplay = document.querySelector('.progress-amount');
    
    if (!progressFill || !simulateBtn || !amountDisplay) return;

    let currentAmount = 0;
    const maxAmount = 2000;
    
    const milestones = [
        { amount: 100, position: 10, cashback: '2%', node: document.querySelector('.node-100') },
        { amount: 250, position: 25, cashback: '5%', node: document.querySelector('.node-250') },
        { amount: 500, position: 50, cashback: '8%', node: document.querySelector('.node-500') },
        { amount: 1000, position: 75, cashback: '12%', node: document.querySelector('.node-1000') },
        { amount: 2000, position: 100, cashback: '20%', node: document.querySelector('.node-2000') }
    ];

    // Mobile: Mostrar tooltip al tocar
    milestones.forEach(m => {
        if (m.node) {
            m.node.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Prevenir scroll si el tap es sobre el nodo
                const tooltip = m.node.querySelector('.progress-tooltip');
                if (tooltip) {
                    // Cerrar otros tooltips
                    document.querySelectorAll('.progress-tooltip.show').forEach(t => {
                        if (t !== tooltip) t.classList.remove('show');
                    });
                    tooltip.classList.toggle('show');
                }
            }, { passive: false });
        }
    });

    simulateBtn.addEventListener('click', () => {
        // Añadir valor aleatorio entre $50 y $200
        const addAmount = Math.floor(Math.random() * 151) + 50;
        const newAmount = Math.min(currentAmount + addAmount, maxAmount);
        
        updateProgress(newAmount);
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            updateProgress(0);
        });
    }

    function updateProgress(newAmount) {
        if (typeof gsap === 'undefined') return;

        // Animar contador numérico
        const counterObj = { val: currentAmount };
        gsap.to(counterObj, {
            val: newAmount,
            duration: 1,
            onUpdate: function() {
                amountDisplay.textContent = `$${Math.round(counterObj.val)}`;
            }
        });

        // Calcular porcentaje visual
        let percentage = (newAmount / maxAmount) * 100;
        
        // Animar barra
        gsap.to(progressFill, {
            width: `${percentage}%`,
            duration: 1,
            ease: "power2.out"
        });

        // Verificar hitos cruzados
        milestones.forEach(m => {
            if (m.node && currentAmount < m.amount && newAmount >= m.amount) {
                setTimeout(() => activateMilestone(m), 500); // Retrasar ligeramente la activación
            } else if (m.node && newAmount < m.amount) {
                deactivateMilestone(m);
            }
        });

        currentAmount = newAmount;
    }

    function activateMilestone(milestone) {
        const node = milestone.node;
        if (!node) return;
        node.classList.add('active');
        
        if (typeof gsap !== 'undefined') {
            // Animación de pulso y brillo
            gsap.to(node, {
                scale: 1.3,
                boxShadow: '0 0 20px var(--accent-magenta)',
                duration: 0.3,
                yoyo: true,
                repeat: 1
            });
        }

        // Mostrar tooltip
        const tooltip = node.querySelector('.progress-tooltip');
        if (tooltip) {
            tooltip.textContent = `¡Desbloqueado ${milestone.cashback} Cashback!`;
            tooltip.classList.add('show');
            setTimeout(() => tooltip.classList.remove('show'), 3000);
        }

        // Pequeña ráfaga de partículas (simulada)
        createParticles(node);
    }
    
    function deactivateMilestone(milestone) {
        const node = milestone.node;
        if (!node) return;
        node.classList.remove('active');
        if (typeof gsap !== 'undefined') {
            gsap.set(node, { scale: 1, boxShadow: 'none' });
        }
    }

    function createParticles(element) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const p = document.createElement('div');
            p.className = 'progress-particle';
            p.style.position = 'fixed';
            p.style.width = '6px';
            p.style.height = '6px';
            p.style.borderRadius = '50%';
            p.style.left = `${x}px`;
            p.style.top = `${y}px`;
            p.style.backgroundColor = 'var(--accent-magenta)';
            p.style.zIndex = '1000';
            p.style.pointerEvents = 'none';
            document.body.appendChild(p);
            
            if (typeof gsap !== 'undefined') {
                gsap.to(p, {
                    x: `+=${(Math.random() - 0.5) * 100}`,
                    y: `+=${(Math.random() - 0.5) * 100}`,
                    opacity: 0,
                    duration: 0.5 + Math.random() * 0.5,
                    onComplete: () => p.remove()
                });
            }
        }
    }
}
