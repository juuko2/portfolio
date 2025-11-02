document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    const toTopButton = document.getElementById('to-top-btn');

    // --- SIVUN VAIHTOLOGIIKKA ---
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

            if (currentPage) {
                currentPage.classList.remove('active');
                currentPage.classList.add('exiting');
            }
            if (currentLink) {
                currentLink.classList.remove('active');
            }

            targetPage.classList.add('active');
            link.classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'auto' });

            initializeScrollObserver(targetPage);

            setTimeout(() => {
                if (currentPage) {
                    currentPage.classList.remove('exiting');
                }
            }, 400); 
        });
    });

    // --- SKROLLAUSANIMAATIOIDEN ALUSTUS ---
    function initializeScrollObserver(container) {
        
        const elementsToAnimate = container.querySelectorAll(
            '.animate-on-scroll, .animate-slide-left, .animate-slide-right'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    const counters = entry.target.querySelectorAll('.counter');
                    if (counters.length > 0) {
                        counters.forEach(counter => {
                            if (counter.classList.contains('animated')) return;
                            counter.classList.add('animated');
                            
                            const target = +counter.dataset.target; // Muuttaa "5" numeroksi 5
                            
                            // ***** KORJAUS 1: KESTO *****
                            const duration = 4500; // Sinun asettamasi 4.5 sekuntia
                            const stepTime = 20; 
                            
                            const steps = duration / stepTime;
                            const increment = target / steps;
                            let current = 0;

                            const timer = setInterval(() => {
                                current += increment;

                                if (current >= target) {
                                    clearInterval(timer);
                                    // ***** KORJAUS 2: DESIMAALIN NÄYTTÖ *****
                                    // Tarkista onko luku desimaali vai kokonaisluku
                                    if (target % 1 !== 0) {
                                        counter.innerText = target.toFixed(1); // Näyttäisi 1.5
                                    } else {
                                        counter.innerText = target; // Näyttää 4, 5 tai 200
                                    }
                                } else {
                                    // Päivitys animaation aikana
                                    if (target % 1 !== 0) {
                                        counter.innerText = current.toFixed(1);
                                    } else {
                                        counter.innerText = Math.floor(current);
                                    }
                                }
                            }, stepTime);
                        });
                    }
                } else {
                    // entry.target.classList.remove('visible'); 
                }
            });
        }, { threshold: 0.1 });

        elementsToAnimate.forEach(el => observer.observe(el));
    }

    initializeScrollObserver(document.getElementById('alku'));


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
