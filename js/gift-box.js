// js/gift-box.js
function initGiftBox(isMobile) {
    const giftBox = document.getElementById('gift-box');
    const lid = document.getElementById('gift-lid');
    const content = document.getElementById('gift-content');
    const resetBtn = document.getElementById('reset-gift-btn');
    if (!giftBox || !lid || !content) return;

    let isOpened = false;
    const confettiCount = isMobile ? 25 : 50;
    const animScale = isMobile ? 0.8 : 1;

    const idleTween = gsap.to(giftBox, {
        rotation: 5,
        yoyo: true,
        repeat: -1,
        duration: 1.5,
        ease: "sine.inOut"
    });

    function createExplosion(x, y) {
        const colors = ['#00f5d4', '#f72585', '#ffd60a', '#7b2ff7', '#3a86ff'];
        
        for (let i = 0; i < confettiCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            
            Object.assign(particle.style, {
                position: 'fixed',
                width: '10px',
                height: '10px',
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                left: `${x}px`,
                top: `${y}px`,
                pointerEvents: 'none',
                zIndex: '2000'
            });
            
            document.body.appendChild(particle);

            const angle = Math.random() * Math.PI * 2;
            const velocity = (50 + Math.random() * 150) * animScale;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 100 * animScale;
            
            gsap.to(particle, {
                x: tx,
                y: ty + 200 * animScale,
                rotation: Math.random() * 720 - 360,
                opacity: 0,
                duration: 1 + Math.random() * 1.5,
                ease: 'power1.out',
                onComplete: () => particle.remove()
            });
        }
    }

    function openGift(e) {
        if(e) e.preventDefault();
        if (isOpened) return;
        isOpened = true;
        idleTween.pause();

        const rect = giftBox.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const tl = gsap.timeline();

        tl.to(giftBox, { x: -5, duration: 0.1, yoyo: true, repeat: 5 })
          .to(giftBox, { x: 0, duration: 0.1 })
          
          .to(lid, { rotationX: -120, duration: 0.8, ease: 'back.out' }, "+=0.2")
          
          .call(() => {
              createExplosion(centerX, centerY);
              
              const light = document.createElement('div');
              light.className = 'gift-light';
              Object.assign(light.style, {
                  position: 'fixed',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)',
                  left: `${centerX - 25}px`,
                  top: `${centerY - 25}px`,
                  pointerEvents: 'none',
                  zIndex: '1500'
              });
              
              document.body.appendChild(light);
              
              gsap.fromTo(light, 
                  { scale: 0, opacity: 1 }, 
                  { scale: 10 * animScale, opacity: 0, duration: 0.8, onComplete: () => light.remove() }
              );
          })
          
          .fromTo(content, 
              { y: 50 * animScale, opacity: 0, display: 'block' },
              { y: -80 * animScale, opacity: 1, duration: 0.8, ease: 'bounce.out' }
          );
        
        content.innerHTML = "<h3>🎉 ¡Envío Gratis!</h3><p>Para tu próxima compra</p>";
    }

    giftBox.addEventListener('pointerdown', openGift);

    if (resetBtn) {
        resetBtn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            if (!isOpened) return;
            isOpened = false;
            
            gsap.to(content, { opacity: 0, y: 50 * animScale, duration: 0.3, display: 'none' });
            gsap.to(lid, { rotationX: 0, duration: 0.5, onComplete: () => {
                idleTween.restart();
            }});
        });
    }
}
