// js/leaderboard.js
function initLeaderboard() {
    const isMobile = window.matchMedia('(hover: none)').matches || window.innerWidth < 768;
    
    const users = [
      { name: 'Ana G.', avatar: '👩‍💼', referrals: 47, bonus: '$470' },
      { name: 'Carlos M.', avatar: '👨‍💻', referrals: 38, bonus: '$380' },
      { name: 'María L.', avatar: '👩‍🎨', referrals: 35, bonus: '$350' },
      { name: 'Pedro R.', avatar: '🧑‍🔬', referrals: 29, bonus: '$290' },
      { name: 'Sofía T.', avatar: '👩‍🚀', referrals: 24, bonus: '$240' },
      { name: 'Diego H.', avatar: '👨‍🍳', referrals: 21, bonus: '$210' },
      { name: 'Laura P.', avatar: '👩‍⚕️', referrals: 18, bonus: '$180' },
      { name: 'Andrés V.', avatar: '👨‍🎤', referrals: 15, bonus: '$150' },
      { name: 'Carmen S.', avatar: '👩‍🏫', referrals: 12, bonus: '$120' },
      { name: 'Roberto F.', avatar: '👨‍✈️', referrals: 8, bonus: '$80' },
    ];
    
    const podiumContainer = document.querySelector('.podium-container');
    const tableBody = document.querySelector('.leaderboard-table tbody');
    const tableContainer = document.querySelector('.leaderboard-list'); 
    const inviteBtn = document.querySelector('.invite-btn');
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    if (podiumContainer && users.length >= 3) {
        const top3 = [users[1], users[0], users[2]]; 
        const places = [2, 1, 3];
        const heights = isMobile ? [80, 120, 60] : [120, 180, 90];
        
        top3.forEach((user, i) => {
            const bar = document.createElement('div');
            bar.className = `podium-bar place-${places[i]}`;
            bar.innerHTML = `
                <div class="podium-avatar">${user.avatar}</div>
                <div class="podium-name">${user.name}</div>
                <div class="podium-rank">${places[i]}</div>
            `;
            podiumContainer.appendChild(bar);
            
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(bar, 
                    { height: 0, opacity: 0 },
                    { 
                        height: heights[i], 
                        opacity: 1, 
                        duration: 1,
                        delay: i === 1 ? 0.6 : (i === 0 ? 0.3 : 0),
                        scrollTrigger: {
                            trigger: podiumContainer,
                            start: 'top 80%'
                        }
                    }
                );
                
                const avatar = bar.querySelector('.podium-avatar');
                gsap.from(avatar, {
                    y: -50,
                    opacity: 0,
                    rotation: 360,
                    duration: 0.8,
                    delay: 1 + (i === 1 ? 0.6 : (i === 0 ? 0.3 : 0)),
                    ease: 'bounce.out',
                    scrollTrigger: {
                        trigger: podiumContainer,
                        start: 'top 80%'
                    }
                });
            }
        });
    }
    
    if (tableBody || tableContainer) {
        const container = tableBody || tableContainer;
        
        users.forEach((user, index) => {
            let row;
            if (isMobile && !tableBody) {
                row = document.createElement('div');
                row.className = 'leaderboard-card';
                if (index < 3) row.classList.add(`top-${index + 1}`);
                
                row.innerHTML = `
                    <div class="rank">#${index + 1}</div>
                    <div class="avatar">${user.avatar}</div>
                    <div class="info">
                        <div class="name">${user.name}</div>
                        <div class="referrals-mobile"><span class="counter" data-val="${user.referrals}">0</span> refs</div>
                    </div>
                    <div class="bonus">${user.bonus}</div>
                `;
            } else {
                // Modo tabla
                row = document.createElement('tr');
                if (index < 3) row.classList.add(`top-${index + 1}`);
                
                row.innerHTML = `
                    <td>#${index + 1}</td>
                    <td>${user.avatar} ${user.name}</td>
                    <td><span class="counter" data-val="${user.referrals}">0</span></td>
                    <td>${user.bonus}</td>
                `;
            }
            container.appendChild(row);
            
            if (typeof gsap !== 'undefined') {
                gsap.from(row, {
                    y: 30,
                    opacity: 0,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 90%'
                    }
                });
            }
        });
        
        if (typeof gsap !== 'undefined') {
            const counters = document.querySelectorAll('.counter');
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.val);
                const obj = { val: 0 };
                
                ScrollTrigger.create({
                    trigger: counter,
                    start: 'top 90%',
                    onEnter: () => {
                        gsap.to(obj, {
                            val: target,
                            duration: isMobile ? 1 : 2,
                            onUpdate: () => {
                                counter.textContent = Math.round(obj.val);
                            }
                        });
                    }
                });
            });
        }
    }
    
    if (inviteBtn) {
        const handleInvite = (e) => {
            e.preventDefault();
            
            const envelope = document.createElement('div');
            envelope.textContent = '✉️';
            envelope.style.position = 'fixed';
            const rect = inviteBtn.getBoundingClientRect();
            envelope.style.left = `${rect.left + rect.width / 2}px`;
            envelope.style.top = `${rect.top}px`;
            envelope.style.fontSize = '24px';
            envelope.style.zIndex = '1000';
            envelope.style.pointerEvents = 'none';
            document.body.appendChild(envelope);
            
            if (typeof gsap !== 'undefined') {
                gsap.to(envelope, {
                    y: -window.innerHeight,
                    x: `+=${(Math.random() - 0.5) * 200}`,
                    rotation: 360,
                    opacity: 0,
                    duration: 1.5,
                    ease: 'power2.in',
                    onComplete: () => envelope.remove()
                });
            } else {
                envelope.remove();
            }
            
            inviteBtn.textContent = '¡Enlace Copiado!';
            setTimeout(() => inviteBtn.textContent = 'Invitar Amigos', 2000);
        };
        
        inviteBtn.addEventListener('click', handleInvite);
        inviteBtn.addEventListener('touchstart', handleInvite, { passive: false });
    }
}
