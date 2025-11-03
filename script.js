document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    const toTopButton = document.getElementById('to-top-btn');

    // --- SIVUN VAIHTOLOGIIKKA (KORJATTU) ---
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 

            const targetPageId = link.dataset.page; 
            const targetPage = document.getElementById(targetPageId);

            if (!targetPage || targetPage.classList.contains('active')) {
                return; 
            }

            const currentPage = document.querySelector('.page-content.active');
            const currentLink = document.querySelector('.nav-link.active');
            
            const transitionDuration = 400; // Vastaa CSS:n transition kestoa .page-content.exiting

            // 1. Piilota nykyinen sivu
            if (currentPage) {
                currentPage.classList.add('exiting');
                currentLink.classList.remove('active');

                setTimeout(() => {
                    currentPage.classList.remove('active', 'exiting');
                    currentPage.style.display = 'none'; 
                }, transitionDuration);
            }
            
            // 2. Näytä uusi sivu heti ja odota sen aktivointia
            targetPage.style.display = 'block'; 

            setTimeout(() => {
                targetPage.classList.add('active'); 
                link.classList.add('active'); 
                
                window.scrollTo({ top: 0, behavior: 'auto' }); 
                resetAndInitializeScrollObserver(targetPage); 
            }, 10); 
        });
    });

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
            threshold: 0.1 
        };

        currentObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
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
