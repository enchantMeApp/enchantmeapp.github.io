// Smooth scroll behavior for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animated card columns
    initializeCardColumns();
    
    function initializeCardColumns() {
        // All available tarot cards
        const allCards = [
            'thefool.jpg', 'themagician.jpg', 'thehighpriestess.jpg', 'themoon.jpg',
            'thestar.jpg', 'thesun.jpg', 'death.jpg', 'thelovers.jpg', 'strength.jpg',
            'justice.jpg', 'temperance.jpg', 'thedevil.jpg', 'thetower.jpg',
            'theworld.jpg', 'wheeloffortune.jpg'
        ];
        
        const columns = document.querySelectorAll('.card-column');
        const cardsPerColumn = 10;
        const scrollSpeed = 0.5; // pixels per frame
        
        // Create a master shuffled deck for all columns
        const masterDeck = [];
        const totalCardsNeeded = columns.length * cardsPerColumn;
        while (masterDeck.length < totalCardsNeeded) {
            const shuffled = [...allCards].sort(() => Math.random() - 0.5);
            masterDeck.push(...shuffled);
        }
        
        let cardIndex = 0;
        
        columns.forEach((column, index) => {
            const isUpColumn = column.classList.contains('column-up');
            
            // Assign unique cards from master deck to this column
            
            for (let i = 0; i < cardsPerColumn; i++) {
                const card = document.createElement('img');
                card.src = `assets/cards/${masterDeck[cardIndex % masterDeck.length]}`;
                card.alt = 'Tarot Card';
                card.className = 'floating-card';
                column.appendChild(card);
                cardIndex++;
            }
            
            // Initialize position
            let currentOffset = 0;
            
            // Animate continuously
            function animate() {
                const cards = Array.from(column.children);
                const cardHeight = cards[0]?.offsetHeight || 0;
                const gap = 48; // 3rem in pixels (approximation)
                const totalCardHeight = cardHeight + gap;
                
                if (isUpColumn) {
                    currentOffset -= scrollSpeed;
                    
                    // When first card goes completely out of view at top, move it to bottom
                    if (Math.abs(currentOffset) >= totalCardHeight) {
                        const firstCard = column.firstElementChild;
                        column.appendChild(firstCard);
                        currentOffset += totalCardHeight;
                    }
                } else {
                    currentOffset += scrollSpeed;
                    
                    // When last card goes out of view at bottom, move it to top
                    if (currentOffset >= totalCardHeight) {
                        const lastCard = column.lastElementChild;
                        column.insertBefore(lastCard, column.firstElementChild);
                        currentOffset -= totalCardHeight;
                    }
                }
                
                column.style.transform = `rotate(-15deg) translateY(${currentOffset}px)`;
                requestAnimationFrame(animate);
            }
            
            animate();
        });
    }
    
    // Add scroll reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections except hero
    const sections = document.querySelectorAll('section:not(.hero)');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(section);
    });

    // Enhance floating background animation with mouse parallax
    const hero = document.querySelector('.hero');
    const floatingBg = document.querySelector('.floating-background');
    
    if (hero && floatingBg) {
        hero.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 20;
            
            floatingBg.style.transform = `translate(${-40 + moveX}px, ${-40 + moveY}px)`;
        });
    }

    // Track CTA button clicks for analytics (placeholder)
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add analytics tracking here if needed
            console.log('CTA button clicked');
        });
    });

    // Add gentle fade-in for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        const cardObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 });
        
        cardObserver.observe(card);
    });

    // Lazy load screenshots
    const screenshots = document.querySelectorAll('.screenshot-item img');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    screenshots.forEach(img => {
        imageObserver.observe(img);
    });
});
