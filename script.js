document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Navigation Logic (Same as before) ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // =========================================
    // GALLERY FUNCTIONALITY
    // =========================================

    // --- Filter Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const inventoryCards = document.querySelectorAll('.inv-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 1. Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // 2. Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // 3. Show/Hide cards based on category match
                inventoryCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex'; // Use flex to maintain card layout
                        // Optional: Add a fade-in animation class here
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }


    // --- Lightbox Logic (Updated for professional cards) ---
    const lightbox = document.getElementById('lightbox');
    
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.close-btn');
        // * CHANGE: Select the buttons, not the images directly *
        const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

        // Add click event to the triggers
        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                // * CHANGE: Get URL from the data-attribute on the button *
                // We use .closest('.lightbox-trigger') in case they click the icon inside the button
                const btn = e.target.closest('.lightbox-trigger');
                const highResSrc = btn.getAttribute('data-full-img');
                
                lightboxImg.src = highResSrc;
                lightbox.classList.add('active');
            });
        });

        // Close lightbox function
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            setTimeout(() => { lightboxImg.src = ''; }, 300);
        };

        closeBtn.addEventListener('click', closeLightbox);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
});
