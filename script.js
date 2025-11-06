document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    const toTopButton = document.getElementById('to-top-btn');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinksContainer = document.querySelector('.nav-links-container');

    // --- HAMBURGER-VALIKON TOIMINNALLISUUS ---
    if (hamburgerMenu && navLinksContainer) {
        hamburgerMenu.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            hamburgerMenu.classList.toggle('active');
        });

        // Sulje valikko, jos klikataan linkkiä mobiilinäkymässä
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinksContainer.classList.remove('active');
                    hamburgerMenu.classList.remove('active');
                }
            });
        });
    }

    // --- SIVUN VAIHTOLOGIIKKA ---
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const targetPageId = link.dataset.page;
            const targetPage = document.getElementById(targetPageId);

            if (!targetPage || targetPage.classList.contains('active')) {
                return;
            }

            // Pysäytä kaikki videot ennen sivun vaihtoa
            stopAllVideos();

            const currentPage = document.querySelector('.page-content.active');
            const currentLink = document.querySelector('.nav-link.active');
            
            const transitionDuration = 400; // Vastaa CSS:n transition kestoa

            if (currentPage) {
                currentPage.classList.add('exiting'); 
                if (currentLink) {
                    currentLink.classList.remove('active'); 
                }
                
                const handleTransitionEnd = () => {
                    currentPage.removeEventListener('transitionend', handleTransitionEnd);
                    currentPage.classList.remove('active', 'exiting');
                    currentPage.style.display = 'none'; 
                    showAndActivateNewPage(); 
                };

                setTimeout(() => {
                    if (currentPage.classList.contains('exiting')) { 
                        handleTransitionEnd();
                    }
                }, transitionDuration + 50); 

            } else { 
                showAndActivateNewPage();
            }

            function showAndActivateNewPage() {
                pages.forEach(p => p.style.display = 'none');
                targetPage.style.display = 'block'; 
                
                setTimeout(() => {
                    targetPage.classList.add('active'); 
                    link.classList.add('active'); 
                    
                    window.scrollTo({ top: 0, behavior: 'auto' }); 
                    resetAndInitializeScrollObserver(targetPage); 
                }, 10);
            }
        });
    });

    // --- VIDEODEN HALLINTA ---
    function stopAllVideos() {
        document.querySelectorAll('video').forEach(video => {
            if (!video.paused) {
                video.pause();
                video.currentTime = 0; // Kelaa alkuun
            }
        });
    }

    // --- SKROLLAUSANIMAATIOIDEN ALUSTUS & RESETOINTI ---
    let currentObserver = null;

    function resetAndInitializeScrollObserver(container) {
        if (currentObserver) {
            currentObserver.disconnect();
        }

        const allAnimatableElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right');
        allAnimatableElements.forEach(el => {
            el.classList.remove('visible');
            if (el.classList.contains('counter-section')) {
                el.querySelectorAll('.counter').forEach(counterEl => {
                    counterEl.classList.remove('animated');
                    counterEl.innerText = '0';
                });
            }
        });

        const elementsToAnimate = container.querySelectorAll(
            '.animate-on-scroll, .animate-slide-left, .animate-slide-right'
        );

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5 
        };

        currentObserver = new IntersectionObserver((entries, observer) => {
            
            const intersectingEntries = entries.filter(e => e.isIntersecting);

            intersectingEntries.forEach((entry, index) => {
                if (!entry.target.classList.contains('visible')) {
                    
                    // --- AUTOMAATTINEN PORRASTUS ---
                    const staggerDelay = 100; // Viive elementtien välillä (ms)
                    const delay = index * staggerDelay;
                    // --- LOPPU ---
                    
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        
                        if (entry.target.classList.contains('counter-section')) {
                            const counters = entry.target.querySelectorAll('.counter');
                            counters.forEach(counter => {
                                if (!counter.classList.contains('animated')) {
                                    counter.classList.add('animated');
                                    animateCounter(counter);
                                }
                            });
                        }
                    }, delay); 
                }
            });
        }, observerOptions);

        elementsToAnimate.forEach(el => currentObserver.observe(el));
    }

    // --- LASKURIEN ANIMOINTIFUNKTIO ---
    function animateCounter(counterElement) {
        const target = +counterElement.dataset.target;
        const duration = 4500;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;

            if (current >= target) {
                clearInterval(timer);
                if (target % 1 !== 0) {
                    counterElement.innerText = target.toFixed(1);
                } else {
                    counterElement.innerText = target;
                }
            } else {
                if (target % 1 !== 0) {
                    counterElement.innerText = current.toFixed(1);
                } else {
                    counterElement.innerText = Math.floor(current);
                }
            }
        }, stepTime);
    }

    // Alustetaan animaatiot ja laskurit aloitussivulle latauksen yhteydessä
    const initialPage = document.getElementById('alku');
    if (initialPage) {
        if (!initialPage.classList.contains('active')) {
            initialPage.classList.add('active');
        }
        initialPage.style.display = 'block';
        resetAndInitializeScrollObserver(initialPage);
    }

    // --- "TAKAISIN YLÖS" -NAPPI ---
    window.addEventListener('scroll', () => {
        if (toTopButton) {
            if (window.scrollY > 300) {
                toTopButton.classList.add('visible');
            } else {
                toTopButton.classList.remove('visible');
            }
        }
    });

    if (toTopButton) {
        toTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
