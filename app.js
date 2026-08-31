(function() {
  'use strict';

  // Detección de dispositivo móvil
  const isMobile = 'ontouchstart' in window || window.innerWidth < 734;

  // ==========================================
  // ESTADO GLOBAL / DATOS DE PRUEBA
  // ==========================================
  const AppState = {
    user: {
      name: 'María García',
      email: 'maria@ejemplo.com',
      points: 2450,
      level: 'Oro',
      levelIndex: 2, // 0=Bronce, 1=Plata, 2=Oro, 3=Diamante
      totalSpent: 847.50,
      totalPurchases: 12,
      referrals: 3,
      cashbackRate: 8,
      cashbackEarned: 67.80,
      joinDate: '2025-03-15',
      dailySpinUsed: false,
      dailyRewardClaimed: [true, true, true, false, false, false, false], // Lun-Dom
      coupons: [
        { code: 'REWARD-2026', discount: '30%', active: true },
        { code: 'BIENVENIDA2026', discount: 'Envío Gratis', active: true },
      ]
    },
    activity: [
      { description: 'Compra en Electrónicos', points: 150, date: 'Hace 2 días', type: 'purchase' },
      { description: 'Referido: Juan P.', points: 200, date: 'Hace 5 días', type: 'referral' },
      { description: 'Compra en Moda', points: 85, date: 'Hace 1 semana', type: 'purchase' },
      { description: 'Bonus de cumpleaños', points: 500, date: 'Hace 2 semanas', type: 'bonus' },
    ],
    levels: [
      { name: 'Bronce', icon: '🥉', minPoints: 0, maxPoints: 499, discount: '5%', benefits: ['5% descuento en toda la tienda'] },
      { name: 'Plata', icon: '🥈', minPoints: 500, maxPoints: 1499, discount: '10%', benefits: ['10% descuento', 'Envío gratis'] },
      { name: 'Oro', icon: '🥇', minPoints: 1500, maxPoints: 2999, discount: '20%', benefits: ['20% descuento', 'Acceso anticipado', 'Envío express'] },
      { name: 'Diamante', icon: '💎', minPoints: 3000, maxPoints: Infinity, discount: '30%', benefits: ['30% descuento', 'Regalos exclusivos', 'Soporte VIP', 'Eventos exclusivos'] },
    ],
    leaderboard: [
      { name: 'Ana G.', avatar: '👩💼', referrals: 47, bonus: 470 },
      { name: 'Carlos M.', avatar: '👨💻', referrals: 38, bonus: 380 },
      { name: 'María L.', avatar: '👩🎨', referrals: 35, bonus: 350 },
      { name: 'Pedro R.', avatar: '🧑🔬', referrals: 29, bonus: 290 },
      { name: 'Sofía T.', avatar: '👩🚀', referrals: 24, bonus: 240 },
      { name: 'Diego H.', avatar: '👨🍳', referrals: 21, bonus: 210 },
      { name: 'Laura P.', avatar: '👩⚕️', referrals: 18, bonus: 180 },
      { name: 'Andrés V.', avatar: '👨🎤', referrals: 15, bonus: 150 },
      { name: 'Carmen S.', avatar: '👩🏫', referrals: 12, bonus: 120 },
      { name: 'Roberto F.', avatar: '👨✈️', referrals: 8, bonus: 80 },
    ],
    dailyRewards: [
      { day: 'Lun', reward: '50 Puntos', icon: '⭐' },
      { day: 'Mar', reward: '10% Dcto', icon: '🏷️' },
      { day: 'Mié', reward: 'Envío Gratis', icon: '🚀' },
      { day: 'Jue', reward: '100 Puntos', icon: '💫' },
      { day: 'Vie', reward: '15% Dcto', icon: '🎁' },
      { day: 'Sáb', reward: '2x Puntos', icon: '✨' },
      { day: 'Dom', reward: 'Regalo Sorpresa', icon: '🎉' },
    ],
    wheelPrizes: [
      { label: '5% Dcto', color: '#3b82f6' },
      { label: '10% Dcto', color: '#8b5cf6' },
      { label: 'Envío Gratis', color: '#06b6d4' },
      { label: '15% Dcto', color: '#ec4899' },
      { label: '2x Puntos', color: '#f59e0b' },
      { label: '20% Dcto', color: '#10b981' },
      { label: '$50 Gift Card', color: '#ef4444' },
      { label: '¡50% Dcto!', color: '#7c3aed' },
    ],
    cashbackTiers: [
      { threshold: 100, rate: 2, position: 10 },
      { threshold: 250, rate: 5, position: 25 },
      { threshold: 500, rate: 8, position: 50 },
      { threshold: 1000, rate: 12, position: 75 },
      { threshold: 2000, rate: 20, position: 100 },
    ],
  };

  // ==========================================
  // UTILIDADES
  // ==========================================

  // Sistema de Notificaciones Toast
  function showToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animar entrada
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        toast.classList.add('visible');
      });
    });

    // Remover
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  // Animación de contador suave
  function animateCounter(element, target, duration = 1500, isCurrency = false) {
    if (!element) return;
    
    let startTimestamp = null;
    const startValue = parseFloat(element.innerText.replace(/[^0-9.-]+/g,"")) || 0;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Función de aceleración easeOutQuart
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (target - startValue) * easeOut;
      
      if (isCurrency) {
        element.textContent = '$' + current.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
        element.textContent = Math.floor(current).toLocaleString('en-US');
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Asegurar valor final exacto
        if (isCurrency) {
          element.textContent = '$' + target.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
          element.textContent = target.toLocaleString('en-US');
        }
      }
    };
    
    window.requestAnimationFrame(step);
  }

  // Actualizar estadísticas globales en la interfaz
  function updateGlobalStatsUI() {
    const pointsEl = document.querySelector('#dashboard-points');
    const spentEl = document.querySelector('#dashboard-spent');
    const couponsEl = document.querySelector('#dashboard-coupons');
    
    if (pointsEl) animateCounter(pointsEl, AppState.user.points);
    if (spentEl) animateCounter(spentEl, AppState.user.totalSpent, 1500, true);
    if (couponsEl) animateCounter(couponsEl, AppState.user.coupons.length);
  }

  // ==========================================
  // MÓDULOS
  // ==========================================

  // 1. Animaciones de Scroll (GSAP)
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const elementsToAnimate = document.querySelectorAll('.fade-up, .stat-card, tr, .benefit-card, .level-card, .day-card');
    
    elementsToAnimate.forEach((el, index) => {
      // Estilos iniciales si no están definidos
      if (!el.classList.contains('revealed')) {
        gsap.set(el, { y: 30, opacity: 0 });
      }
      
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            delay: (index % 5) * 0.1, // Stagger ligero basado en el índice
            onComplete: () => el.classList.add('revealed')
          });
        },
        once: true
      });
    });
  }

  // 2. Navegación
  function initNavbar() {
    const nav = document.querySelector('.navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        nav.style.backdropFilter = 'blur(10px)';
        nav.style.boxShadow = '0 1px 0 rgba(0,0,0,0.05)';
      } else {
        nav.classList.remove('scrolled');
        nav.style.backgroundColor = 'transparent';
        nav.style.backdropFilter = 'none';
        nav.style.boxShadow = 'none';
      }
    }, { passive: true });

    // Smooth scroll para anclas
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // 3. Dashboard
  function initDashboard() {
    const dashboard = document.querySelector('#dashboard');
    if (!dashboard) return;

    const userName = document.querySelector('#dashboard-name');
    const userLevel = document.querySelector('#dashboard-level');
    const activityTable = document.querySelector('#activity-table tbody');

    if (userName) userName.textContent = AppState.user.name;
    if (userLevel) userLevel.textContent = `Nivel: ${AppState.user.level}`;

    updateGlobalStatsUI();

    // Rellenar tabla de actividad
    if (activityTable) {
      activityTable.innerHTML = '';
      AppState.activity.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="padding: 16px; border-bottom: 1px solid #f5f5f7;">${item.description}</td>
          <td style="padding: 16px; border-bottom: 1px solid #f5f5f7;">${item.date}</td>
          <td style="padding: 16px; border-bottom: 1px solid #f5f5f7; color: #0071e3; font-weight: 500;">+${item.points}</td>
        `;
        activityTable.appendChild(tr);
      });
    }
  }

  // 4. Volteo de Tarjetas
  function initCardFlip() {
    const cardGrid = document.querySelector('#card-flip-grid');
    const counterEl = document.querySelector('#flip-counter');
    const resetBtn = document.querySelector('#flip-reset-btn');
    if (!cardGrid) return;

    let flipsLeft = 3;
    const discounts = [5, 10, 15, 20, 25, 30, 40, 50, 'GRATIS'];
    let cards = [];
    
    function initCards() {
      cardGrid.innerHTML = '';
      flipsLeft = 3;
      if (counterEl) counterEl.textContent = flipsLeft;
      
      // Barajar descuentos
      const shuffledDiscounts = [...discounts].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < 9; i++) {
        const card = document.createElement('div');
        card.className = 'flip-card';

        const front = document.createElement('div');
        front.className = 'flip-face flip-front';
        front.textContent = '?';

        const back = document.createElement('div');
        back.className = 'flip-face flip-back';
        
        const val = shuffledDiscounts[i];
        const valText = typeof val === 'number' ? `${val}%` : val;
        
        back.innerHTML = `
          <div class="flip-back-value">${valText}</div>
          <div style="font-size: 14px; text-align: center;">de descuento</div>
        `;

        card.appendChild(front);
        card.appendChild(back);

        // Interacción
        card.addEventListener('click', () => {
          if (flipsLeft > 0 && !card.classList.contains('flipped')) {
            card.classList.add('flipped');
            flipsLeft--;
            if (counterEl) counterEl.textContent = flipsLeft;
            
            // Añadir recompensa
            AppState.user.coupons.push({
              code: `MISTERY-${Math.floor(Math.random() * 10000)}`,
              discount: valText,
              active: true
            });
            showToast(`¡Revelaste un descuento de ${valText}!`);
            updateGlobalStatsUI();

            // Deshabilitar restantes si no quedan intentos
            if (flipsLeft === 0) {
              const allCards = cardGrid.querySelectorAll('.flip-card:not(.flipped)');
              allCards.forEach(c => {
                c.style.opacity = '0.5';
                c.style.pointerEvents = 'none';
              });
            }
          }
        });

        cardGrid.appendChild(card);
        cards.push(card);
      }
    }

    initCards();

    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        initCards();
      });
    }
  }

  // 5. Ruleta
  function initSpinWheel() {
    const canvas = document.querySelector('#wheel-canvas');
    const spinBtn = document.querySelector('#spin-btn');
    const resultEl = document.querySelector('#wheel-result');
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    const prizes = AppState.wheelPrizes;
    const numSegments = prizes.length;
    let currentRotation = 0;
    
    // Configurar tamaño
    const size = Math.min(canvas.parentElement.clientWidth, 380);
    canvas.width = size;
    canvas.height = size;
    const radius = size / 2;

    function drawWheel() {
      ctx.clearRect(0, 0, size, size);
      const anglePerSegment = (Math.PI * 2) / numSegments;

      for (let i = 0; i < numSegments; i++) {
        const startAngle = i * anglePerSegment;
        const endAngle = startAngle + anglePerSegment;

        // Dibujar segmento
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, startAngle, endAngle);
        ctx.fillStyle = prizes[i].color;
        ctx.fill();

        // Dibujar borde
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        // Dibujar texto
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px -apple-system, system-ui, sans-serif';
        ctx.fillText(prizes[i].label, radius - 20, 5);
        ctx.restore();
      }

      // Círculo central
      ctx.beginPath();
      ctx.arc(radius, radius, radius * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#1d1d1f';
      ctx.stroke();
    }

    drawWheel();

    // Triángulo indicador (por css o dibujado arriba)
    const indicator = document.createElement('div');
    Object.assign(indicator.style, {
      position: 'absolute',
      top: '-10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '0',
      height: '0',
      borderLeft: '15px solid transparent',
      borderRight: '15px solid transparent',
      borderTop: '20px solid #1d1d1f',
      zIndex: '10'
    });
    canvas.parentElement.style.position = 'relative';
    canvas.parentElement.appendChild(indicator);

    // Contenedor animable
    const wheelContainer = document.createElement('div');
    canvas.parentNode.insertBefore(wheelContainer, canvas);
    wheelContainer.appendChild(canvas);
    Object.assign(wheelContainer.style, {
      width: size + 'px',
      height: size + 'px',
      margin: '0 auto',
      borderRadius: '50%',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    });

    if (spinBtn) {
      spinBtn.addEventListener('click', () => {
        if (AppState.user.dailySpinUsed) {
          showToast('Ya usaste tu giro de hoy.');
          return;
        }

        spinBtn.disabled = true;
        spinBtn.style.opacity = '0.5';

        // Determinar ganador
        const winningIndex = Math.floor(Math.random() * numSegments);
        const segmentAngle = 360 / numSegments;
        
        // Calcular rotación objetivo para que el ganador quede arriba (0 grados o 270 según dibujo)
        // El segmento i empieza en i*segmentAngle. El centro del segmento es i*segmentAngle + segmentAngle/2
        // El indicador está arriba (270 grados en canvas).
        const offset = 90; // Para compensar el origen del canvas (0 está a la derecha)
        const targetAngle = 360 - (winningIndex * segmentAngle + segmentAngle / 2) - offset;
        
        // Añadir vueltas extra (5-8 vueltas)
        const extraSpins = (5 + Math.floor(Math.random() * 4)) * 360;
        const totalRotation = currentRotation + extraSpins + (targetAngle - (currentRotation % 360) + 360) % 360;

        if (typeof gsap !== 'undefined') {
          gsap.to(wheelContainer, {
            rotation: totalRotation,
            duration: 4,
            ease: 'power4.out',
            onComplete: () => {
              currentRotation = totalRotation;
              AppState.user.dailySpinUsed = true;
              const prize = prizes[winningIndex].label;
              
              if (resultEl) {
                resultEl.innerHTML = `<div style="padding:16px; background:#fbfbfd; border-radius:12px; margin-top:16px; font-weight:bold; color:#0071e3;">🎉 ¡Ganaste: ${prize}!</div>`;
              }
              showToast(`Ganaste ${prize}`);
              
              // Añadir recompensa
              if (prize.includes('Puntos')) {
                AppState.user.points += 100;
              } else {
                AppState.user.coupons.push({ code: 'RULETA-WIN', discount: prize, active: true });
              }
              updateGlobalStatsUI();
            }
          });
        }
      });
    }

    // Redibujar en resize
    window.addEventListener('resize', () => {
      const newSize = Math.min(canvas.parentElement.clientWidth, 380);
      if (newSize !== canvas.width) {
        canvas.width = newSize;
        canvas.height = newSize;
        wheelContainer.style.width = newSize + 'px';
        wheelContainer.style.height = newSize + 'px';
        drawWheel();
      }
    }, { passive: true });
  }

  // 6. Tarjeta Rasca y Gana
  function initScratchCard() {
    const container = document.querySelector('#scratch-container');
    const canvas = document.querySelector('#scratch-canvas');
    const resetBtn = document.querySelector('#scratch-reset-btn');
    const prizeEl = document.querySelector('#scratch-prize');
    
    if (!container || !canvas || !canvas.getContext) return;
    
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let isRevealed = false;
    
    const width = container.clientWidth || 300;
    const height = 150;
    
    // Configurar contenedor
    Object.assign(container.style, {
      position: 'relative',
      width: width + 'px',
      height: height + 'px',
      margin: '0 auto',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
    });
    
    // Fondo premio
    if (prizeEl) {
      Object.assign(prizeEl.style, {
        position: 'absolute',
        top: '0', left: '0', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff',
        zIndex: '1',
        fontSize: '24px', fontWeight: 'bold', color: '#0071e3'
      });
      prizeEl.innerHTML = `<span>15% Dcto</span><span style="font-size:14px; color:#86868b; font-weight:normal;">Código: RASCA15</span>`;
    }
    
    // Canvas capa superior
    Object.assign(canvas.style, {
      position: 'absolute',
      top: '0', left: '0',
      zIndex: '2',
      cursor: 'crosshair',
      transition: 'opacity 0.5s ease'
    });
    
    function initCanvas() {
      canvas.width = width;
      canvas.height = height;
      canvas.style.opacity = '1';
      isRevealed = false;
      
      // Rellenar gris
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#2d2d2d';
      ctx.fillRect(0, 0, width, height);
      
      // Texto "RASPA AQUÍ"
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('RASPA AQUÍ', width / 2, height / 2);
    }
    
    initCanvas();
    
    function getPointerPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }
    
    function scratch(e) {
      if (!isDrawing || isRevealed) return;
      if (e.cancelable) e.preventDefault(); // Prevenir scroll en móviles
      
      const pos = getPointerPos(e);
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2, false);
      ctx.fill();
      
      checkProgress();
    }
    
    function checkProgress() {
      // Chequear píxeles transparentes cada cierto tiempo para rendimiento
      if (Math.random() > 0.1) return;
      
      const imageData = ctx.getImageData(0, 0, width, height).data;
      let clearPixels = 0;
      const totalPixels = imageData.length / 4;
      
      // Tomamos muestras saltando para ser más rápidos
      for (let i = 0; i < imageData.length; i += 16) {
        if (imageData[i + 3] === 0) clearPixels++;
      }
      
      const percent = (clearPixels / (totalPixels / 4)) * 100;
      
      if (percent > 55 && !isRevealed) {
        isRevealed = true;
        canvas.style.opacity = '0';
        showToast('¡Cupón revelado! Se ha añadido a tu cuenta.');
        AppState.user.coupons.push({ code: 'RASCA15', discount: '15%', active: true });
        updateGlobalStatsUI();
      }
    }
    
    // Eventos Mouse
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', () => { isDrawing = false; });
    
    // Eventos Touch
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    window.addEventListener('touchend', () => { isDrawing = false; });
    
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        initCanvas();
      });
    }
  }

  // 7. Caja de Regalo
  function initGiftBox() {
    const giftBox = document.querySelector('#gift-box');
    const openBtn = document.querySelector('#open-gift-btn');
    const resultEl = document.querySelector('#gift-result');
    if (!giftBox || !openBtn) return;

    // Animación idle
    let idleAnim;
    if (typeof gsap !== 'undefined') {
      idleAnim = gsap.to(giftBox, {
        rotation: 2,
        yoyo: true,
        repeat: -1,
        duration: 1.5,
        ease: 'sine.inOut'
      });
    }

    const openGift = () => {
      if (openBtn.disabled) return;
      openBtn.disabled = true;
      if (idleAnim) idleAnim.kill();

      if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline();
        
        // Agitar
        tl.to(giftBox, { x: 3, duration: 0.05, yoyo: true, repeat: 7 })
          .to(giftBox, { x: 0, duration: 0.05 })
          // Volar tapa
          .add(() => {
            giftBox.classList.add('opened');
          })
          // Esperar y Mostrar resultado
          .to({}, { duration: 0.6 })
          .add(() => {
            if (resultEl) {
              resultEl.style.display = 'block';
              resultEl.innerHTML = `<div style="font-size:18px; color:#1d1d1f; font-weight:500;">🎉 ¡Envío Gratis en tu primer pedido!<br><span style="color:#86868b; font-size:14px;">Código: BIENVENIDA2026</span></div>`;
              gsap.fromTo(resultEl, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5 }
              );
            }
            showToast('¡Regalo abierto!');
            openBtn.textContent = 'Regalo Abierto ✓';
            AppState.user.coupons.push({ code: 'BIENVENIDA2026', discount: 'Envío Gratis', active: true });
            updateGlobalStatsUI();
          });
      }
    };

    openBtn.addEventListener('click', openGift);
    giftBox.addEventListener('click', openGift);
  }

  // 8. Niveles de Usuario
  function initLevels() {
    const container = document.querySelector('#levels-container');
    const progressFill = document.querySelector('#level-progress-fill');
    const progressText = document.querySelector('#level-progress-text');
    
    if (!container) return;

    const currentLevelIdx = AppState.user.levelIndex;
    const currentPoints = AppState.user.points;
    const currentLevelData = AppState.levels[currentLevelIdx];
    const nextLevelData = AppState.levels[currentLevelIdx + 1];

    // Renderizar tarjetas de nivel
    container.innerHTML = '';
    Object.assign(container.style, {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
      gap: '16px',
      marginTop: '32px'
    });

    AppState.levels.forEach((level, idx) => {
      const card = document.createElement('div');
      card.className = 'level-card';
      
      let statusStyle = '';
      if (idx < currentLevelIdx) {
        // Pasado
        statusStyle = 'background: #fbfbfd; opacity: 0.8; border: 1px solid #d2d2d7;';
      } else if (idx === currentLevelIdx) {
        // Actual
        statusStyle = 'background: #fff; border: 2px solid #0071e3; box-shadow: 0 8px 24px rgba(0,113,227,0.15); transform: translateY(-4px);';
      } else {
        // Futuro
        statusStyle = 'background: #fbfbfd; opacity: 0.5; filter: grayscale(100%); border: 1px dashed #d2d2d7;';
      }

      Object.assign(card.style, {
        padding: '24px',
        borderRadius: '20px',
        textAlign: 'center',
        transition: 'all 0.3s',
        ...statusStyle.split(';').reduce((acc, curr) => {
          const [key, val] = curr.split(':');
          if (key && val) acc[key.trim()] = val.trim();
          return acc;
        }, {})
      });

      card.innerHTML = `
        <div style="font-size: 32px; margin-bottom: 12px;">${level.icon}</div>
        <h4 style="margin: 0 0 8px 0; font-size: 19px; color: #1d1d1f;">${level.name}</h4>
        <div style="font-size: 14px; color: #86868b; margin-bottom: 16px;">${idx === AppState.levels.length - 1 ? '3000+ pts' : `${level.minPoints}-${level.maxPoints} pts`}</div>
        <div style="font-size: 13px; color: #424245; text-align: left;">
          <ul style="padding-left: 16px; margin: 0;">
            ${level.benefits.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      `;
      container.appendChild(card);
    });

    // Calcular progreso
    if (progressFill && progressText && nextLevelData) {
      const min = currentLevelData.minPoints;
      const max = currentLevelData.maxPoints;
      const progress = ((currentPoints - min) / (nextLevelData.minPoints - min)) * 100;
      
      progressText.textContent = `Te faltan ${nextLevelData.minPoints - currentPoints} puntos para ${nextLevelData.name} ${nextLevelData.icon}`;
      
      // Animar barra cuando sea visible
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
          trigger: progressFill.parentElement,
          start: 'top 90%',
          onEnter: () => {
            gsap.to(progressFill, { width: `${progress}%`, duration: 1.5, ease: 'power2.out' });
          },
          once: true
        });
      } else {
        progressFill.style.width = `${progress}%`;
      }
    }
  }

  // 9. Cashback
  function initCashback() {
    const bar = document.querySelector('#cashback-progress-bar');
    const simulateBtn = document.querySelector('#simulate-purchase-btn');
    const nodesContainer = document.querySelector('#cashback-nodes');
    if (!bar || !nodesContainer) return;

    function renderCashback() {
      const spent = AppState.user.totalSpent;
      const tiers = AppState.cashbackTiers;
      
      // Encontrar posición
      let currentTier = tiers[0];
      let nextTier = tiers[tiers.length - 1];
      let percent = 0;

      for (let i = 0; i < tiers.length; i++) {
        if (spent >= tiers[i].threshold) {
          currentTier = tiers[i];
          AppState.user.cashbackRate = currentTier.rate;
        } else {
          nextTier = tiers[i];
          break;
        }
      }

      if (spent >= tiers[tiers.length - 1].threshold) {
        percent = 100;
      } else {
        // Interpolar
        const prevThresh = currentTier.threshold;
        const prevPos = currentTier.position;
        const nextThresh = nextTier.threshold;
        const nextPos = nextTier.position;
        
        percent = prevPos + ((spent - prevThresh) / (nextThresh - prevThresh)) * (nextPos - prevPos);
      }

      // Animar barra
      if (typeof gsap !== 'undefined') {
        gsap.to(bar, { width: `${Math.min(100, percent)}%`, duration: 1, ease: 'power2.out' });
      } else {
        bar.style.width = `${Math.min(100, percent)}%`;
      }

      // Renderizar nodos
      nodesContainer.innerHTML = '';
      tiers.forEach(tier => {
        const node = document.createElement('div');
        const isPassed = spent >= tier.threshold;
        
        Object.assign(node.style, {
          position: 'absolute',
          left: `${tier.position}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: isPassed ? '#0071e3' : '#fff',
          border: `3px solid ${isPassed ? '#0071e3' : '#d2d2d7'}`,
          transition: 'all 0.3s',
          zIndex: '2'
        });

        const label = document.createElement('div');
        Object.assign(label.style, {
          position: 'absolute',
          top: '25px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '12px',
          color: isPassed ? '#1d1d1f' : '#86868b',
          fontWeight: isPassed ? 'bold' : 'normal',
          whiteSpace: 'nowrap'
        });
        label.innerHTML = `$${tier.threshold}<br>${tier.rate}%`;

        node.appendChild(label);
        nodesContainer.appendChild(node);
      });
    }

    // Inicializar visualización retrasada para la animación
    setTimeout(renderCashback, 500);

    if (simulateBtn) {
      simulateBtn.addEventListener('click', () => {
        const amount = Math.floor(Math.random() * 150) + 50; // $50-$200
        AppState.user.totalSpent += amount;
        AppState.user.points += Math.floor(amount);
        
        renderCashback();
        updateGlobalStatsUI();
        showToast(`Compra de $${amount.toLocaleString('en-US', {minimumFractionDigits: 2})} simulada. Cashback actual: ${AppState.user.cashbackRate}%`);
      });
    }
  }

  // 10. Rompecabezas (Puzzle)
  function initPuzzle() {
    const board = document.querySelector('#puzzle-board');
    const tray = document.querySelector('#puzzle-tray');
    if (!board || !tray) return;

    const pieces = Array.from({ length: 12 }, (_, i) => i + 1);
    let correctCount = 0;

    // Configurar Tablero
    board.innerHTML = '';
    Object.assign(board.style, {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '4px',
      width: '100%',
      maxWidth: '400px',
      aspectRatio: '4/3',
      margin: '0 auto',
      backgroundColor: '#f5f5f7',
      padding: '4px',
      borderRadius: '12px'
    });

    for (let i = 1; i <= 12; i++) {
      const cell = document.createElement('div');
      cell.dataset.target = i;
      Object.assign(cell.style, {
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '2px dashed #d2d2d7',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#d2d2d7',
        fontSize: '12px'
      });
      cell.textContent = i;
      
      // Desktop Drop
      cell.addEventListener('dragover', e => e.preventDefault());
      cell.addEventListener('drop', handleDrop);
      
      board.appendChild(cell);
    }

    // Configurar Bandeja
    function setupTray() {
      tray.innerHTML = '';
      Object.assign(tray.style, {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
        marginTop: '24px',
        minHeight: '80px'
      });

      const shuffled = [...pieces].sort(() => Math.random() - 0.5);
      
      shuffled.forEach(num => {
        const piece = document.createElement('div');
        piece.dataset.id = num;
        piece.draggable = true;
        
        Object.assign(piece.style, {
          width: '60px',
          height: '45px',
          background: `linear-gradient(135deg, hsl(${num * 30}, 70%, 60%), hsl(${num * 30 + 30}, 70%, 50%))`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold',
          cursor: 'grab',
          userSelect: 'none',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          touchAction: 'none' // Importante para touch drag
        });
        piece.textContent = num;

        // Eventos Drag Desktop
        piece.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', num);
          setTimeout(() => piece.style.opacity = '0.5', 0);
        });
        piece.addEventListener('dragend', () => {
          piece.style.opacity = '1';
        });

        // Eventos Touch Mobile
        let ghost = null;
        piece.addEventListener('touchstart', (e) => {
          e.preventDefault();
          piece.style.opacity = '0.5';
          
          ghost = piece.cloneNode(true);
          Object.assign(ghost.style, {
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 1000,
            opacity: 0.8,
            margin: 0
          });
          document.body.appendChild(ghost);
          
          moveGhost(e.touches[0]);
        }, { passive: false });

        piece.addEventListener('touchmove', (e) => {
          e.preventDefault();
          if (ghost) moveGhost(e.touches[0]);
        }, { passive: false });

        piece.addEventListener('touchend', (e) => {
          piece.style.opacity = '1';
          if (ghost) {
            const touch = e.changedTouches[0];
            ghost.remove();
            ghost = null;
            
            // Encontrar elemento debajo
            const targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
            if (targetEl && targetEl.dataset.target) {
              processPlacement(piece, targetEl, num);
            }
          }
        });

        function moveGhost(touch) {
          ghost.style.left = touch.clientX - 30 + 'px';
          ghost.style.top = touch.clientY - 22 + 'px';
        }

        tray.appendChild(piece);
      });
    }

    setupTray();

    function handleDrop(e) {
      e.preventDefault();
      const num = e.dataTransfer.getData('text/plain');
      const piece = document.querySelector(`[data-id="${num}"]`);
      if (piece) {
        processPlacement(piece, e.target, num);
      }
    }

    function processPlacement(piece, targetCell, num) {
      // Si la celda es la correcta
      if (targetCell.dataset.target === String(num)) {
        targetCell.innerHTML = '';
        targetCell.style.border = '2px solid #34c759';
        
        piece.style.width = '100%';
        piece.style.height = '100%';
        piece.style.margin = '0';
        piece.style.boxShadow = 'none';
        piece.draggable = false;
        
        // Remover eventos touch
        const clone = piece.cloneNode(true);
        targetCell.appendChild(clone);
        piece.remove();
        
        correctCount++;
        AppState.user.points += 10;
        updateGlobalStatsUI();
        
        if (correctCount === 12) {
          showToast('¡Puzzle Completo! +120 puntos ganados', 4000);
          AppState.user.points += 120; // Bonus
          updateGlobalStatsUI();
        }
      } else {
        // Error visual
        if (typeof gsap !== 'undefined') {
          gsap.to(piece, { x: [-5, 5, -5, 5, 0], duration: 0.3 });
          gsap.to(targetCell, { backgroundColor: '#ff3b30', duration: 0.1, yoyo: true, repeat: 1, clearProps: 'backgroundColor' });
        }
      }
    }
  }

  // 11. Recompensa Diaria
  function initDailyReward() {
    const container = document.querySelector('#daily-rewards-container');
    if (!container) return;

    container.innerHTML = '';
    Object.assign(container.style, {
      display: 'flex',
      gap: '12px',
      overflowX: 'auto',
      padding: '10px 0',
      scrollSnapType: 'x mandatory'
    });

    const todayIndex = 3; // Simulado: Jueves

    AppState.dailyRewards.forEach((reward, idx) => {
      const card = document.createElement('div');
      const isClaimed = AppState.user.dailyRewardClaimed[idx];
      const isToday = idx === todayIndex;
      const isLocked = idx > todayIndex;

      let cardStyle = {
        minWidth: '80px',
        flex: '0 0 auto',
        padding: '16px 8px',
        borderRadius: '16px',
        textAlign: 'center',
        scrollSnapAlign: 'center',
        transition: 'all 0.3s'
      };

      if (isClaimed) {
        Object.assign(cardStyle, { background: '#f5f5f7', color: '#86868b', border: '1px solid #d2d2d7' });
      } else if (isToday) {
        Object.assign(cardStyle, { background: '#fff', color: '#1d1d1f', border: '2px solid #0071e3', boxShadow: '0 4px 12px rgba(0,113,227,0.2)', transform: 'scale(1.05)' });
      } else {
        Object.assign(cardStyle, { background: '#fbfbfd', color: '#a1a1a6', border: '1px dashed #d2d2d7' });
      }

      Object.assign(card.style, cardStyle);

      card.innerHTML = `
        <div style="font-size:12px; font-weight:bold; margin-bottom:8px;">${reward.day}</div>
        <div style="font-size:24px; margin-bottom:8px;">${isClaimed ? '✅' : (isLocked ? '🔒' : reward.icon)}</div>
        <div style="font-size:11px; font-weight:500;">${reward.reward}</div>
      `;

      if (isToday && !isClaimed) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function claimReward() {
          AppState.user.dailyRewardClaimed[idx] = true;
          AppState.user.points += 100; // Asumiendo que Jueves era 100 puntos
          showToast(`¡Reclamaste ${reward.reward}!`);
          updateGlobalStatsUI();
          
          // Actualizar visual
          card.style.transform = 'scale(1)';
          card.style.background = '#f5f5f7';
          card.style.color = '#86868b';
          card.style.border = '1px solid #d2d2d7';
          card.style.boxShadow = 'none';
          card.innerHTML = card.innerHTML.replace(reward.icon, '✅');
          card.removeEventListener('click', claimReward);
        });
      }

      container.appendChild(card);
    });
  }

  // 12. Cuenta Regresiva
  function initCountdown() {
    const hoursEl = document.querySelector('#cd-hours');
    const minsEl = document.querySelector('#cd-mins');
    const secsEl = document.querySelector('#cd-secs');
    const revealBtn = document.querySelector('#reveal-offer-btn');
    const offerCard = document.querySelector('#secret-offer-card');
    
    if (!hoursEl || !minsEl || !secsEl) return;

    // 2 horas y 30 minutos desde ahora
    let timeRemaining = 2 * 3600 + 30 * 60; 

    let timerInterval;
    const updateTimer = () => {
      if (timeRemaining <= 0) {
        if (timerInterval) clearInterval(timerInterval);
        if (revealBtn && !revealBtn.disabled) revealBtn.click();
        return;
      }

      timeRemaining--;
      
      const h = Math.floor(timeRemaining / 3600);
      const m = Math.floor((timeRemaining % 3600) / 60);
      const s = timeRemaining % 60;

      hoursEl.textContent = h.toString().padStart(2, '0');
      minsEl.textContent = m.toString().padStart(2, '0');
      secsEl.textContent = s.toString().padStart(2, '0');

      if (timeRemaining < 600) { // Menos de 10 minutos
        [hoursEl, minsEl, secsEl].forEach(el => el.style.color = '#ff3b30');
      }
    };

    timerInterval = setInterval(updateTimer, 1000);
    updateTimer(); // Initial call

    if (revealBtn && offerCard) {
      // Setup blur inicial
      Object.assign(offerCard.style, {
        filter: 'blur(10px)',
        transform: 'scale(0.95)',
        transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      });

      revealBtn.addEventListener('click', () => {
        revealBtn.disabled = true;
        revealBtn.textContent = 'Oferta Revelada';
        
        offerCard.style.filter = 'blur(0)';
        offerCard.style.transform = 'scale(1)';
        
        offerCard.innerHTML = `
          <div style="background: linear-gradient(135deg, #0071e3, #3b82f6); color: white; padding: 24px; border-radius: 16px; text-align: center;">
            <h3 style="margin:0 0 8px 0; font-size:24px;">70% Dcto en Electrónicos</h3>
            <p style="margin:0 0 16px 0; opacity:0.9;">Solo por las próximas 2 horas</p>
            <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 8px; font-family: monospace; font-size: 18px; letter-spacing: 2px;">
              FLASH70
            </div>
          </div>
        `;
        
        AppState.user.coupons.push({ code: 'FLASH70', discount: '70%', active: true });
        showToast('Cupón añadido a tu cuenta');
      });
    }
  }

  // 13. Tabla de Posiciones (Leaderboard)
  function initLeaderboard() {
    const podiumContainer = document.querySelector('#podium-container');
    const tableBody = document.querySelector('#leaderboard-table tbody');
    const inviteBtn = document.querySelector('#invite-friend-btn');
    
    if (!podiumContainer && !tableBody) return;

    const data = AppState.leaderboard;

    // Podio (Top 3)
    if (podiumContainer) {
      podiumContainer.innerHTML = '';
      Object.assign(podiumContainer.style, {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '8px',
        height: '250px',
        paddingTop: '40px'
      });

      // Orden: 2, 1, 3
      const podiumOrder = [
        { rank: 2, data: data[1], height: '60%', color: '#d2d2d7' }, // Plata
        { rank: 1, data: data[0], height: '85%', color: '#f59e0b' }, // Oro
        { rank: 3, data: data[2], height: '40%', color: '#b45309' }  // Bronce
      ];

      podiumOrder.forEach(item => {
        const bar = document.createElement('div');
        Object.assign(bar.style, {
          width: '30%',
          maxWidth: '100px',
          height: '0%', // Inicial para animación
          backgroundColor: '#fbfbfd',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: `2px solid ${item.color}`,
          borderBottom: 'none'
        });

        bar.innerHTML = `
          <div style="position: absolute; top: -50px; text-align: center; width: 100%;">
            <div style="font-size: 28px; margin-bottom: 4px;">${item.data.avatar}</div>
            <div style="font-size: 12px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 4px;">${item.data.name}</div>
          </div>
          <div style="margin-top: 16px; font-size: 24px; font-weight: bold; color: ${item.color};">${item.rank}</div>
          <div style="margin-top: auto; padding-bottom: 12px; font-size: 14px; color: #86868b;">
            <span class="ref-count" data-val="${item.data.referrals}">0</span> ref
          </div>
        `;

        podiumContainer.appendChild(bar);

        // Animar barra
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.create({
            trigger: podiumContainer,
            start: 'top 80%',
            onEnter: () => {
              gsap.to(bar, { height: item.height, duration: 1.2, ease: 'power3.out' });
              const countEl = bar.querySelector('.ref-count');
              animateCounter(countEl, item.data.referrals, 1500);
            },
            once: true
          });
        } else {
          bar.style.height = item.height;
        }
      });
    }

    // Tabla
    if (tableBody) {
      tableBody.innerHTML = '';
      data.forEach((user, idx) => {
        const tr = document.createElement('tr');
        // Tu usuario simulado está en posición 4 para el ejemplo
        const isMe = idx === 3; 
        
        if (isMe) {
          tr.style.backgroundColor = '#f0f8ff';
          user.name = AppState.user.name + ' (Tú)';
          user.avatar = '👤';
          user.referrals = AppState.user.referrals;
          user.bonus = user.referrals * 10;
        }

        tr.innerHTML = `
          <td style="padding: 12px 16px; border-bottom: 1px solid #f5f5f7; font-weight: 500;">${idx + 1}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f5f5f7; display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 20px;">${user.avatar}</span>
            <span>${user.name}</span>
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f5f5f7; text-align: right;">${user.referrals}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f5f5f7; text-align: right; color: #0071e3; font-weight: 500;">+${user.bonus} pts</td>
        `;
        tableBody.appendChild(tr);
      });
    }

    if (inviteBtn) {
      inviteBtn.addEventListener('click', () => {
        showToast('Link copiado: rewardshow.com/ref/maria-g', 4000);
      });
    }
  }

  // 14. Grid de Beneficios (Interacciones)
  function initBenefitsGrid() {
    const cards = document.querySelectorAll('.benefit-card');
    
    cards.forEach(card => {
      // Estilos base por si acaso
      card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s';
      
      const content = card.querySelector('.benefit-desc');
      if (content) {
        content.style.maxHeight = isMobile ? '0' : 'none';
        content.style.overflow = 'hidden';
        content.style.opacity = isMobile ? '0' : '1';
        content.style.transition = 'all 0.4s ease';
      }

      if (isMobile) {
        card.addEventListener('click', () => {
          const isExpanded = card.classList.contains('expanded');
          
          // Cerrar otros
          cards.forEach(c => {
            c.classList.remove('expanded');
            c.style.transform = 'scale(1)';
            const desc = c.querySelector('.benefit-desc');
            if (desc) {
              desc.style.maxHeight = '0';
              desc.style.opacity = '0';
            }
          });

          if (!isExpanded) {
            card.classList.add('expanded');
            card.style.transform = 'scale(1.02)';
            if (content) {
              content.style.maxHeight = '100px';
              content.style.opacity = '1';
              content.style.marginTop = '12px';
            }
          }
        });
      } else {
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-8px)';
          card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = 'none';
        });
      }
    });
  }

  // ==========================================
  // INICIALIZACIÓN PRINCIPAL
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    // Inicializar todos los módulos
    initScrollAnimations();
    initNavbar();
    initDashboard();
    initCardFlip();
    initSpinWheel();
    initScratchCard();
    initGiftBox();
    initLevels();
    initCashback();
    initPuzzle();
    initDailyReward();
    initCountdown();
    initLeaderboard();
    initBenefitsGrid();
  });

})();
