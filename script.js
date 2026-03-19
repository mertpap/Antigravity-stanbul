document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    // Check if device supports hover
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    if (!isTouchDevice()) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let followerX = mouseX;
        let followerY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediate update for dot
            cursor.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
        });

        // Smooth follow for the ring
        const followerLoop = () => {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(followerLoop);
        };
        followerLoop();

        // Hover effects for links and interactive elements
        const interactables = document.querySelectorAll('a, .case, .service-item, .footer-title');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('hover-active');
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('hover-active');
            });
        });
    }

    // 2. Wrap Nav Text for Hover
    document.querySelectorAll('.nav-link').forEach(link => {
        link.innerHTML = `<span>${link.textContent}</span>`;
    });

    // 3. Intersection Observer for Reveal Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Optional: remove visible class if you want elements to hide again when out of view
                // We keep it so they reappear for zero gravity feeling
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    // Initial trigger for load elements
    document.querySelectorAll('.reveal-text, .massive-text, .sub-massive-text, .floating-element').forEach(el => {
        revealObserver.observe(el);
    });

    // 4. "Zero Gravity" Parallax Scrolling
    const floatElements = document.querySelectorAll('.floating-element');
    
    // Parallax loop
    const floatScrollLoop = () => {
        const scrolled = window.scrollY;
        
        floatElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-speed')) || 1;
            
            // Limit floating calculations to elements currently in the DOM context realistically
            const rect = el.getBoundingClientRect();
            const elCenter = rect.top + rect.height / 2;
            const windowCenter = window.innerHeight / 2;
            const distanceFromCenter = elCenter - windowCenter;
            
            // The "Zero gravity" effect -> gentle floating offset
            const maxFloat = 100; // max px to float
            const floatOffset = (distanceFromCenter * (1 - speed) * 0.3);
            
            // Apply slight rotation based on float amount for more "formless" feel
            const rotationOffset = (distanceFromCenter / window.innerHeight) * (1 - speed) * 2;

            if (el.classList.contains('visible')) {
                // We add the offset onto the original translation
                el.style.transform = `translate3d(0, ${floatOffset}px, 0) rotate(${rotationOffset}deg)`;
            } else {
                el.style.transform = `translate3d(0, 60px, 0)`; 
            }
        });
        
        requestAnimationFrame(floatScrollLoop);
    };
    
    // Only run parallax on non-touch devices for performance, or run everywhere if performant
    if (!isTouchDevice()) {
        floatScrollLoop();
    }
});
