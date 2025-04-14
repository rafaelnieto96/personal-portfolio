document.addEventListener('DOMContentLoaded', function () {
    // Terminal functionality
    const redButton = document.querySelector('.red');
    const yellowButton = document.querySelector('.yellow');
    const terminalBody = document.getElementById('terminalBody');

    // Toggle terminal visibility 
    function toggleTerminal() {
        terminalBody.classList.toggle('minimized');
    }
    
    // Add event listeners for terminal buttons
    redButton.addEventListener('click', toggleTerminal);
    yellowButton.addEventListener('click', toggleTerminal);

    // Card animation functions
    const projectCards = document.querySelectorAll('.project-card');
    const skillCards = document.querySelectorAll('.skill-card');
    const allCards = [...projectCards, ...skillCards];
    
    // Initial animation for cards
    allCards.forEach((card, index) => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = 1;
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Add hover and click effects to cards
    allCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });

        card.addEventListener('click', function () {
            // Efecto visual al hacer clic
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px)';
            }, 150);
        });
    });
});
