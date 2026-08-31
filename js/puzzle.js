// js/puzzle.js
function initPuzzle() {
    const puzzleContainer = document.querySelector('.puzzle-container');
    if (!puzzleContainer) return;

    const tray = document.querySelector('.puzzle-tray');
    const board = document.querySelector('.puzzle-board');
    const pointsDisplay = document.querySelector('.puzzle-points');
    const resetButton = document.querySelector('.puzzle-reset-btn');
    
    let points = 0;
    let placedPieces = 0;
    const totalPieces = 12;

    // Inicializar celdas del tablero
    for (let i = 1; i <= totalPieces; i++) {
        const cell = document.createElement('div');
        cell.className = 'puzzle-cell';
        cell.dataset.id = i;
        
        // Eventos de arrastre para zona de caída
        cell.addEventListener('dragover', (e) => {
            e.preventDefault(); // Permitir drop
            if (!cell.hasChildNodes()) {
                cell.classList.add('drag-over');
            }
        });
        
        cell.addEventListener('dragleave', () => {
            cell.classList.remove('drag-over');
        });
        
        cell.addEventListener('drop', (e) => {
            e.preventDefault();
            cell.classList.remove('drag-over');
            
            const pieceId = e.dataTransfer.getData('text/plain');
            const piece = document.getElementById(`piece-${pieceId}`);
            
            if (piece && !cell.hasChildNodes() && !piece.classList.contains('locked')) {
                cell.appendChild(piece);
                checkPiecePlacement(piece, cell);
            }
        });
        
        if (board) board.appendChild(cell);
    }

    function createPieces() {
        if (!tray) return;
        tray.innerHTML = '';
        
        // Crear arreglo y mezclar
        const pieceIds = Array.from({length: totalPieces}, (_, i) => i + 1);
        pieceIds.sort(() => Math.random() - 0.5);
        
        pieceIds.forEach(id => {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.id = `piece-${id}`;
            piece.dataset.id = id;
            piece.textContent = id;
            piece.draggable = true;
            
            // Fondo degradado basado en ID
            const hue = (id / totalPieces) * 360;
            piece.style.background = `linear-gradient(135deg, hsl(${hue}, 80%, 50%), hsl(${(hue + 40) % 360}, 80%, 50%))`;
            
            // Eventos de arrastre nativos
            piece.addEventListener('dragstart', (e) => {
                if (piece.classList.contains('locked')) {
                    e.preventDefault();
                    return;
                }
                e.dataTransfer.setData('text/plain', id);
                setTimeout(() => piece.classList.add('dragging'), 0);
            });
            
            piece.addEventListener('dragend', () => {
                piece.classList.remove('dragging');
            });
            
            // Soporte táctil básico
            piece.addEventListener('touchstart', handleTouchStart, {passive: false});
            piece.addEventListener('touchmove', handleTouchMove, {passive: false});
            piece.addEventListener('touchend', handleTouchEnd);
            
            tray.appendChild(piece);
        });
    }

    // Variables para drag táctil
    let activeTouchPiece = null;
    let ghostPiece = null;

    function handleTouchStart(e) {
        if (this.classList.contains('locked')) return;
        e.preventDefault(); // Prevenir scroll
        activeTouchPiece = this;
        this.classList.add('dragging');
        
        // Crear elemento fantasma
        ghostPiece = this.cloneNode(true);
        ghostPiece.classList.add('ghost-piece');
        ghostPiece.style.position = 'fixed';
        ghostPiece.style.zIndex = '9999';
        ghostPiece.style.pointerEvents = 'none';
        
        // El tamaño puede ser más grande en móvil, ajustarlo para el arrastre
        const rect = this.getBoundingClientRect();
        ghostPiece.style.width = `${rect.width}px`;
        ghostPiece.style.height = `${rect.height}px`;
        
        document.body.appendChild(ghostPiece);
        
        const touch = e.touches[0];
        updateGhostPosition(touch.clientX, touch.clientY, rect.width, rect.height);
    }
    
    function handleTouchMove(e) {
        if (!activeTouchPiece || !ghostPiece) return;
        e.preventDefault();
        const touch = e.touches[0];
        const rect = activeTouchPiece.getBoundingClientRect();
        updateGhostPosition(touch.clientX, touch.clientY, rect.width, rect.height);
    }
    
    function handleTouchEnd(e) {
        if (!activeTouchPiece) return;
        
        const touch = e.changedTouches[0];
        if (ghostPiece) {
            ghostPiece.remove();
            ghostPiece = null;
        }
        
        activeTouchPiece.classList.remove('dragging');
        
        // Determinar zona de caída
        const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
        const cell = dropTarget?.closest('.puzzle-cell');
        
        if (cell && !cell.hasChildNodes()) {
            cell.appendChild(activeTouchPiece);
            checkPiecePlacement(activeTouchPiece, cell);
        }
        
        activeTouchPiece = null;
    }
    
    function updateGhostPosition(x, y, width, height) {
        if (ghostPiece) {
            ghostPiece.style.left = `${x - width/2}px`;
            ghostPiece.style.top = `${y - height/2}px`;
        }
    }

    function checkPiecePlacement(piece, cell) {
        if (piece.dataset.id === cell.dataset.id) {
            // Posición correcta
            piece.classList.add('locked');
            piece.draggable = false;
            piece.style.boxShadow = '0 0 15px var(--accent-cyan)';
            
            points += 10;
            updatePoints();
            placedPieces++;
            
            if (placedPieces === totalPieces) {
                completePuzzle();
            }
        } else {
            // Posición incorrecta, devolver al tray
            setTimeout(() => {
                if (tray) tray.appendChild(piece);
            }, 500);
        }
    }

    function updatePoints() {
        if (pointsDisplay) {
            pointsDisplay.textContent = points;
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(pointsDisplay, {scale: 1.5, color: 'var(--accent-cyan)'}, {scale: 1, color: 'var(--text-primary)', duration: 0.5});
            }
        }
    }

    function completePuzzle() {
        const message = document.querySelector('.puzzle-message');
        if (message) {
            message.textContent = '¡Puzzle Completo! +120 puntos ganados';
            message.style.display = 'block';
            if (typeof gsap !== 'undefined') {
                gsap.from(message, {y: -20, opacity: 0, duration: 0.5});
            }
        }
        
        // Animación final
        const pieces = document.querySelectorAll('.puzzle-piece');
        if (typeof gsap !== 'undefined') {
            gsap.to(pieces, {
                opacity: 0,
                duration: 0.5,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    if (board) board.classList.add('completed-image');
                    triggerConfetti();
                }
            });
        }
    }

    function triggerConfetti() {
        // Simple confetti simulado
        for (let i = 0; i < 50; i++) {
            const conf = document.createElement('div');
            conf.className = 'confetti';
            conf.style.position = 'fixed';
            conf.style.width = '10px';
            conf.style.height = '10px';
            conf.style.top = '-10px';
            conf.style.zIndex = '9999';
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.backgroundColor = ['#00f5d4', '#f72585', '#ffd60a'][Math.floor(Math.random() * 3)];
            document.body.appendChild(conf);
            
            if (typeof gsap !== 'undefined') {
                gsap.to(conf, {
                    y: window.innerHeight + 20,
                    x: `+=${(Math.random() - 0.5) * 200}`,
                    rotation: Math.random() * 360,
                    duration: Math.random() * 2 + 2,
                    ease: "power1.out",
                    onComplete: () => conf.remove()
                });
            }
        }
    }

    if (resetButton) {
        resetButton.addEventListener('click', () => {
            points = 0;
            placedPieces = 0;
            if (pointsDisplay) pointsDisplay.textContent = '0';
            const message = document.querySelector('.puzzle-message');
            if (message) message.style.display = 'none';
            if (board) board.classList.remove('completed-image');
            
            // Vaciar tablero
            document.querySelectorAll('.puzzle-cell').forEach(cell => {
                cell.innerHTML = '';
            });
            
            createPieces();
        });
    }

    // Inicializar juego
    createPieces();
}
