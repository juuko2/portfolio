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

            // Käynnistä animaatiot uudella sivulla
            initializeScrollObserver(targetPage);

            setTimeout(() => {
                if (currentPage) {
                    currentPage.classList.remove('exiting');
                }
            }, 400); 
        });
    });

    // --- SKROLLAUSANIMAATIOIDEN ALUSTUS (PÄIVITETTY) ---
    function initializeScrollObserver(container) {
        
        // Etsii KAIKKI animoitavat elementit (Juju 1, 2 ja 3)
        const elementsToAnimate = container.querySelectorAll(
            '.animate-on-scroll, .animate-slide-left, .animate-slide-right'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 1. Lisää perus 'visible'-luokka animaatiota varten
                    entry.target.classList.add('visible');
                    
                    // 2. TARKISTA, ONKO TÄMÄ LASKURILOHKO (Juju 1)
                    const counters = entry.target.querySelectorAll('.counter');
                    if (counters.length > 0) {
                        counters.forEach(counter => {
                            // Varmista, ettei laskuria ajeta montaa kertaa
                            if (counter.classList.contains('animated')) return;
                            counter.classList.add('animated');
                            
                            const target = +counter.dataset.target;
                            const duration = 4500; // 4.5 sekuntia
                            const stepTime = 20; // Päivitä 50 krt/sek
                            const steps = duration / stepTime;
                            const increment = target / steps;
                            let current = 0;

                            const timer = setInterval(() => {
                                current += increment;
                                if (current >= target) {
                                    clearInterval(timer);
                                    counter.innerText = target;
                                } else {
                                    counter.innerText = Math.floor(current);
                                }
                            }, stepTime);
                        });
                    }
                } else {
                    // Tämän voi poistaa, jos et halua animaation toistuvan
                    // entry.target.classList.remove('visible'); 
                }
            });
        }, { threshold: 0.1 });

        elementsToAnimate.forEach(el => observer.observe(el));
    }

    // Käynnistä animaatiot oletuksena näkyvälle "alku"-sivulle heti alussa
    initializeScrollObserver(document.getElementById('alku'));


    // --- "TAKAISIN YLÖS" -NAPPI (KORJATTU) ---
    window.addEventListener('scroll', () => {
        if (toTopButton) {
            if (window.scrollY > 300) {
                toTopButton.classList.add('visible');
            } else {
                // TÄMÄ ON KORJATTU: Piti olla 'remove'
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
