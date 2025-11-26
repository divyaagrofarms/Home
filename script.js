document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. MOBILE NAVIGATION & HEADER LOGIC
    // =========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const header = document.querySelector('header');

    // Toggle Menu
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent click from bubbling to document
            navLinks.classList.toggle('open');
            // Animate hamburger icon (optional simple rotation)
            hamburger.style.transform = navLinks.classList.contains('open') ? 'rotate(90deg)' : 'rotate(0deg)';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.style.transform = 'rotate(0deg)';
            });
        });

        // Close menu when clicking anywhere outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('open');
                hamburger.style.transform = 'rotate(0deg)';
            }
        });
    }

    // Header Scroll Effect (Adds shadow on scroll)
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
            header.style.paddingTop = "0px"; // Optional: Shrink header slightly
        } else {
            header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
        }
    });

    // =========================================
    // 2. SMOOTH SCROLLING FOR ANCHOR LINKS
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header height (approx 80px)
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // =========================================
    // 3. GALLERY FILTERING (Inventory Page)
    // =========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const inventoryCards = document.querySelectorAll('.inv-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update Active State
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // Filter Cards with Animation
                inventoryCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        // Small timeout to allow display:flex to apply before opacity
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300); // Wait for transition to finish
                    }
                });
            });
        });
    }

    // =========================================
    // 4. LIGHTBOX FUNCTIONALITY
    // =========================================
    const lightbox = document.getElementById('lightbox');
    
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.close-btn');
        const triggers = document.querySelectorAll('.lightbox-trigger');

        // Open Lightbox
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop bubbling
                // Find the button (in case icon is clicked)
                const btn = e.target.closest('.lightbox-trigger');
                const highResSrc = btn.getAttribute('data-full-img');
                
                lightboxImg.src = highResSrc;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        });

        // Close Function
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto'; // Re-enable background scrolling
            // Clear src after animation to prevent ghosting
            setTimeout(() => { lightboxImg.src = ''; }, 300);
        };

        // Event Listeners for closing
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

    // =========================================
    // 5. DYNAMIC FOOTER YEAR
    // =========================================
    const copyrightYear = document.querySelector('.copyright');
    if (copyrightYear) {
        const currentYear = new Date().getFullYear();
        // Uses Regex to replace the year number, or appends if not found
        if (copyrightYear.innerHTML.includes('2023')) {
            copyrightYear.innerHTML = copyrightYear.innerHTML.replace('2023', currentYear);
        } else {
            // Fallback if user changed text manually
            copyrightYear.innerHTML += ` (Updated ${currentYear})`;
        }
    }
});
