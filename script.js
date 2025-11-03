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
                return; // Estä navigointi, jos kohdesivu on jo aktiivinen
            }

            const currentPage = document.querySelector('.page-content.active');
            const currentLink = document.querySelector('.nav-link.active');

            // 1. Piilota nykyinen sivu ja sen aktiivinen linkki
            if (currentPage) {
                currentPage.classList.add('exiting'); // Aloita poistumisanimaatio
                currentLink.classList.remove('active'); // Poista aktiivinen tila linkistä
            }
            
            // 2. Odota vanhan sivun poistumisanimaation loppumista
            // tai käsittele uuden sivun näyttäminen, jos vanhaa ei ole
            const transitionDuration = 400; // Vastaa CSS:n transition kestoa .page-content.exiting -luokalle

            setTimeout(() => {
                if (currentPage) {
                    currentPage.classList.remove('active', 'exiting'); // Poista kaikki aktiiviluokat vanhalta sivulta
                    currentPage.style.display = 'none'; // Piilota vanha sivu kokonaan animaation jälkeen
                }

                // 3. Näytä uusi sivu
                targetPage.style.display = 'block'; // Tee uusi sivu näkyväksi ensin
                // Pieni viive, jotta selain rekisteröi display:blockin ennen opacity/transform muutoksia
                setTimeout(() => {
                    targetPage.classList.add('active'); // Aktivoi uusi sivu ja käynnistä sisääntuloanimaatio
                    link.classList.add('active'); // Aktivoi uusi linkki navigaatiossa
                    
                    window.scrollTo({ top: 0, behavior: 'auto' }); // Skrollaa ylös
                    resetAndInitializeScrollObserver(targetPage); // Alusta animaatiot uudelle sivulle
                }, 10); // Todella lyhyt viive, vain varmistamaan renderöinnin
                
            }, transitionDuration); // Odota vanhan sivun animaation loppumista
        });
    });

    // --- SKROLLAUSANIMAATIOIDEN ALUSTUS & RESETOINTI SIVUNVAIHDOSSA ---
    let currentObserver = null; 

    function resetAndInitializeScrollObserver(container) {
        if (currentObserver) {
            currentObserver.disconnect();
        }

        // Resetooidaan kaikki animoitavat elementit piiloon uudelleen
        const allAnimatableElements = container.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right');
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
                    // observer.unobserve(entry.target); // Jos haluat animaation vain kerran
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
    // Varmistetaan, että aktiivinen sivu on "alku" heti latauksessa
    const initialPage = document.getElementById('alku');
    if (initialPage) {
        initialPage.classList.add('active'); // Varmista, että alkuperäinen sivu on aktiivinen
        initialPage.style.display = 'block'; // Ja näkyvissä
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
