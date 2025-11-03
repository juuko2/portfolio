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
                // Lisätään "exiting" luokka animaatiota varten
                currentPage.classList.add('exiting');
                // Poistetaan "active" luokka vasta animaation jälkeen
                setTimeout(() => {
                    currentPage.classList.remove('active', 'exiting');
                }, 400); // Tämän tulee vastata CSS:n transition kestoa
            }
            if (currentLink) {
                currentLink.classList.remove('active');
            }

            // Varmistetaan, että uusi sivu on piilotettu ennen aktivointia, jotta animaatio näkyy
            targetPage.style.display = 'block'; // Tehdään näkyväksi transition alussa
            targetPage.style.opacity = '0';
            targetPage.style.transform = 'translateY(15px)';

            // Pieni viive varmistamaan, että display: block on asetettu ennen active-luokan lisäystä
            setTimeout(() => {
                targetPage.classList.add('active');
                link.classList.add('active');
                
                // Skrollataan ylös heti uuden sivun aktivoituessa
                window.scrollTo({ top: 0, behavior: 'auto' });

                // ***** KORJAUS: ALUSTA SCROLL OBSERVER UUDELLE SIVULLE *****
                // Poistetaan edellisen sivun animaatioluokat ja alustetaan uuden sivun animaatiot
                resetAndInitializeScrollObserver(targetPage);

            }, 50); // Lyhyt viive
        });
    });

    // --- SKROLLAUSANIMAATIOIDEN ALUSTUS & RESETOINTI SIVUNVAIHDOSSA ---
    let currentObserver = null; // Tallennetaan nykyinen IntersectionObserver

    function resetAndInitializeScrollObserver(container) {
        // Jos observer on jo olemassa, pysäytetään se
        if (currentObserver) {
            currentObserver.disconnect();
        }

        // Resetooidaan kaikki animoitavat elementit piiloon uudelleen
        const allAnimatableElements = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right');
        allAnimatableElements.forEach(el => {
            el.classList.remove('visible'); // Poista visible-luokka, jotta animaatio toistuu
            // Resetoidaan counterit, jotta ne animoituvat uudelleen
            if (el.classList.contains('counter-section')) {
                el.querySelectorAll('.counter').forEach(counterEl => {
                    counterEl.classList.remove('animated');
                    counterEl.innerText = '0'; // Aseta alkuperäiseen arvoon
                });
            }
        });


        // Alustetaan uusi observer vain aktiivisen containerin elementeille
        const elementsToAnimate = container.querySelectorAll(
            '.animate-on-scroll, .animate-slide-left, .animate-slide-right'
        );

        // Asetukset, joilla animaatio käynnistyy, kun 10% elementistä on näkyvissä
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 
        };

        currentObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Jos elementti on counter-osio, käynnistä laskurit
                    if (entry.target.classList.contains('counter-section')) {
                        const counters = entry.target.querySelectorAll('.counter');
                        counters.forEach(counter => {
                            // Tarkista, ettei laskuria ole jo animoitu (estää useita käynnistyksiä)
                            if (!counter.classList.contains('animated')) {
                                counter.classList.add('animated'); // Merkitään animoiduksi
                                animateCounter(counter);
                            }
                        });
                    }
                    // Yleensä haluamme pysäyttää havainnoinnin, kun elementti on kerran animoitu
                    // observer.unobserve(entry.target); // Voit ottaa tämän käyttöön, jos haluat animaation vain kerran
                } else {
                    // Jos haluat animaatioiden toistuvan, kun elementti skrollaa pois näkyvistä
                    // entry.target.classList.remove('visible');
                    // Jos haluat counterien resetoituvan, kun ne rullaavat pois
                    // if (entry.target.classList.contains('counter-section')) {
                    //     entry.target.querySelectorAll('.counter').forEach(counterEl => {
                    //         counterEl.classList.remove('animated');
                    //         counterEl.innerText = '0';
                    //     });
                    // }
                }
            });
        }, observerOptions);

        elementsToAnimate.forEach(el => currentObserver.observe(el));
    }

    // --- LASKURIEN ANIMOINTIFUNKTIO ---
    function animateCounter(counterElement) {
        const target = +counterElement.dataset.target; // Muuttaa "5" numeroksi 5
        const duration = 4500; // Animaation kesto millisekunteina (4.5 sekuntia)
        const stepTime = 20;   // Päivitysväli millisekunteina
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;

            if (current >= target) {
                clearInterval(timer);
                // Varmistetaan, että lopullinen arvo on täsmällinen
                if (target % 1 !== 0) { // Onko desimaaliluku?
                    counterElement.innerText = target.toFixed(1); // Näyttäisi esim. "1.5"
                } else {
                    counterElement.innerText = target; // Näyttää kokonaisluvun, esim. "4", "5", "200"
                }
            } else {
                // Päivitys animaation aikana
                if (target % 1 !== 0) {
                    counterElement.innerText = current.toFixed(1);
                } else {
                    counterElement.innerText = Math.floor(current);
                }
            }
        }, stepTime);
    }


    // Alustetaan animaatiot ja laskurit aloitussivulle latauksen yhteydessä
    resetAndInitializeScrollObserver(document.getElementById('alku'));


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
