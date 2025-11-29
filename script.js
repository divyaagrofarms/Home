/**
 * Divya Agro Farms - Main Logic
 * Handles Navigation, Counters, Gallery Filtering, and Lightbox
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. GLOBAL NAVIGATION LOGIC
    // ==========================================
    initMobileMenu();
    initSmoothScroll();
    initStickyHeader();

    // ==========================================
    // 2. HOME PAGE LOGIC (Only runs if elements exist)
    // ==========================================
    if (document.querySelector('.stats-banner')) {
        initStatCounters();
    }

    // ==========================================
    // 3. GALLERY PAGE LOGIC (Only runs if elements exist)
    // ==========================================
    if (document.querySelector('.gallery-controls')) {
        initGalleryFilters();
        initLightbox();
        populateGalleryImages(); // Helper to fill empty src tags
    }
});

/* -----------------------------------------------------------
   FUNCTIONS
----------------------------------------------------------- */

/**
 * Mobile Hamburger Menu Toggle
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate hamburger icon (Optional: switch icon)
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Sticky Header Effect on Scroll
 */
function initStickyHeader() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Stats Counter Animation (Home Page)
 * Counts numbers up when scrolled into view
 */
function initStatCounters() {
    const statsSection = document.querySelector('.stats-banner');
    const counters = document.querySelectorAll('.stat-item h2');
    let started = false; // Ensure it runs only once

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !started) {
            started = true;
            counters.forEach(counter => {
                const targetText = counter.innerText;
                const targetValue = parseInt(targetText.replace(/\D/g, '')); // Remove non-digits like '+'
                const suffix = targetText.replace(/[0-9]/g, ''); // Keep suffixes like '+' or '%'
                
                let startValue = 0;
                const duration = 2000; // 2 seconds
                const increment = targetValue / (duration / 16); // 60FPS

                const updateCounter = () => {
                    startValue += increment;
                    if (startValue < targetValue) {
                        counter.innerText = Math.ceil(startValue) + suffix;
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = targetValue + suffix;
                    }
                };
                updateCounter();
            });
        }
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

/**
 * Gallery Filtering Logic (Inventory Page)
 */
function initGalleryFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.inv-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            buttons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            items.forEach(item => {
                const category = item.getAttribute('data-category');
                
                // Reset animation
                item.style.animation = 'none';
                item.offsetHeight; /* trigger reflow */
                item.style.animation = 'fadeIn 0.5s ease forwards';

                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Lightbox Logic (Inventory Page)
 */
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const triggers = document.querySelectorAll('.lightbox-trigger');
    const closeBtn = document.querySelector('.close-btn');

    if (!lightbox) return;

    // Open Lightbox
    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default button behavior
            const fullImgUrl = btn.getAttribute('data-full-img');
            
            if (fullImgUrl) {
                lightboxImg.src = fullImgUrl;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Disable scroll
            }
        });
    });

    // Close Lightbox Function
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Enable scroll
        setTimeout(() => { lightboxImg.src = ''; }, 300); // Clear src after fade out
    };

    // Event Listeners for Closing
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close on clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/**
 * Helper: Populate Empty Images (Inventory Page)
 * Since the HTML has src="", this fills them with the data-full-img
 * so they are visible immediately.
 */
function populateGalleryImages() {
    const cards = document.querySelectorAll('.inv-card');
    cards.forEach(card => {
        const img = card.querySelector('img');
        const trigger = card.querySelector('.lightbox-trigger');
        
        if (img && trigger && (!img.src || img.src.endsWith('html'))) {
            // Use the high-res image as the thumbnail for now
            img.src = trigger.getAttribute('data-full-img');
        }
    });
}


function openDetails(data) {
    document.getElementById("detailsPopup").style.display = "flex";

    let table = document.getElementById("detailsTableBody");
    table.innerHTML = ""; // Clear previous data

    // Insert rows dynamically
    for (let key in data) {
        table.innerHTML += `
            <tr>
                <td>${key}</td>
                <td>${data[key]}</td>
            </tr>
        `;
    }
}

function closeDetails() {
    document.getElementById("detailsPopup").style.display = "none";
    window.location.href = "gallery.html";
}


