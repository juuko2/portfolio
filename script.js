document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content'); // Tämä ei välttämättä tarvita tässä, mutta ok jättää
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

    // --- SIVUN VAIHTOLOGIIKKA (KORJATTU JA SELVENNETTY) ---
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); 

            const targetPageId = link.dataset.page; 
            const targetPage = document.getElementById(targetPageId);

            // Jos kohdesivua ei löydy tai se on jo aktiivinen, ei tehdä mitään.
            if (!targetPage || targetPage.classList.contains('active')) {
                return; 
            }

            const currentPage = document.querySelector('.page-content.active');
            const currentLink = document.querySelector('.nav-link.active');
            
            const transitionDuration = 400; // Vastaa CSS:n transition kestoa

            // Vaihe 1: Aloita nykyisen sivun poistumisanimaatio
            if (currentPage) {
                currentPage.classList.add('exiting'); // Aloita poistumisanimaatio
                if (currentLink) {
                    currentLink.classList.remove('active'); // Poista aktiivinen tila navilinkistä
                }
                
                // Odotetaan, että poistumisanimaatio on valmis, ENNEN KUIN sivu piilotetaan.
                // Käytetään 'transitionend' -tapahtumaa, jos se on käytettävissä, muuten setTimeout.
                const handleTransitionEnd = () => {
                    currentPage.removeEventListener('transitionend', handleTransitionEnd);
                    currentPage.classList.remove('active', 'exiting');
                    currentPage.style.display = 'none'; // Piilota vanha sivu kokonaan
                    showAndActivateNewPage(); // Kutsu uuden sivun näyttämistä
                };

                // Jos sivulla on CSS-animaatioita, odota niiden päättymistä
                // Jos ei, tai jos selain ei tue transitionend-tapahtumaa luotettavasti, käytä setTimeoutia.
                // Tämä on robustimpi ratkaisu.
                setTimeout(() => {
                    if (currentPage.classList.contains('exiting')) { // Tarkista onko luokka vielä päällä
                         handleTransitionEnd();
                    }
                }, transitionDuration + 50); // Pieni lisäviive varmuuden vuoksi

            } else { // Jos ei ole aktiivista sivua (esim. ensimmäinen lataus)
                showAndActivateNewPage();
            }

            function showAndActivateNewPage() {
                // Piilota KAIKKI sivut ensin varmuuden vuoksi
                pages.forEach(p => p.style.display = 'none'); // Lisätty tämä rivi

                targetPage.style.display = 'block'; // Tee uusi sivu näkyväksi ensin
                
                // Pieni viive, jotta selain ehtii varmasti renderöidä display:blockin, ennen kuin luokka lisätään.
                setTimeout(() => {
                    targetPage.classList.add('active'); // Aktivoi uusi sivu (sisääntuloanimaatio)
                    link.classList.add('active'); // Aktivoi linkki navigaatiossa
                    
                    window.scrollTo({ top: 0, behavior: 'auto' }); // Skrollaa sivun ylälaitaan
                    resetAndInitializeScrollObserver(targetPage); // Alusta animaatiot uudelle sivulle
                }, 10); 
            }
        });
    });

    // --- SKROLLAUSANIMAATIOIDEN ALUSTUS & RESETOINTI ---
    let currentObserver = null; 

    function resetAndInitializeScrollObserver(container) {
        if (currentObserver) {
            currentObserver.disconnect();
        }

        // Poista 'visible' luokka kaikista animoitavista elementeistä ennen uuden sivun käsittelyä
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

        // Etsi uuden sivun animoitavat elementit
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
