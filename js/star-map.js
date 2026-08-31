// js/star-map.js
function initStarMap() {
    const canvas = document.getElementById('star-map-canvas');
    const container = document.querySelector('.star-map-container');
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    const isMobile = window.matchMedia('(hover: none)').matches || window.innerWidth < 768;
    const starCount = isMobile ? 100 : 200;
    const stars = [];
    
    function resize() {
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }
    
    function initStars() {
        stars.length = 0;
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random(),
                twinkleSpeed: Math.random() * 0.05 + 0.01,
                color: Math.random() > 0.8 ? '#b9f2ff' : '#ffffff'
            });
        }
    }
    
    let mouseX = 0, mouseY = 0;
    
    // Parallax suave en mousemove
    window.addEventListener('mousemove', (e) => {
        if (isMobile) return;
        const rect = container.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right && 
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
            mouseX = (e.clientX - rect.left - width / 2) * 0.05;
            mouseY = (e.clientY - rect.top - height / 2) * 0.05;
        }
    }, { passive: true });
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        stars.forEach(star => {
            // Parpadeo
            star.opacity += star.twinkleSpeed;
            if (star.opacity > 1 || star.opacity < 0.2) {
                star.twinkleSpeed = -star.twinkleSpeed;
            }
            
            // Dibujar
            ctx.beginPath();
            ctx.arc(star.x - mouseX * star.radius, star.y - mouseY * star.radius, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = star.opacity;
            ctx.fill();
        });
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    
    // Manejo de nodos (HTML/CSS)
    const nodes = document.querySelectorAll('.benefit-node');
    nodes.forEach(node => {
        // Toggle para móviles en lugar de hover
        const toggleNode = (e) => {
            if (isMobile) {
                e.preventDefault();
                // Cerrar otros
                nodes.forEach(n => {
                    if (n !== node) n.classList.remove('expanded');
                });
                node.classList.toggle('expanded');
            } else {
                node.classList.toggle('expanded');
            }
        };
        
        node.addEventListener('click', toggleNode);
        node.addEventListener('touchstart', toggleNode, { passive: false });
    });
    
    // Conectar nodos con líneas SVG si existen
    const svgOverlay = document.querySelector('.constellation-lines');
    if (svgOverlay && nodes.length > 0 && !isMobile) {
        // Lógica simplificada para dibujar líneas entre nodos cercanos
        svgOverlay.style.opacity = 1;
    }
    
    window.addEventListener('resize', resize);
    resize();
    animate();
}
