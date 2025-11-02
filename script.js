document.addEventListener('DOMContentLoaded', () => {

    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    const toTopButton = document.getElementById('to-top-btn');

    // --- SIVUN VAIHTOLOGIIKKA ---
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Estä aina oletustoiminto

            const targetPageId = link.dataset.page; // Haetaan data-page attribuutti (esim. "lahtoruutu")
            const targetPage = document.getElementById(targetPageId);

            if (!targetPage || targetPage.classList.contains('active')) {
                return; // Älä tee mitään, jos sivu on jo aktiivinen
            }

            // 1. Etsi nykyinen aktiivinen sivu ja linkki
            const currentPage = document.querySelector('.page-content.active');
            const currentLink = document.querySelector('.nav-link.active');

            // 2. Aseta vanha sivu "poistuvaksi"
            if (currentPage) {
                currentPage.classList.remove('active');
                currentPage.classList.add('exiting');
            }
            if (currentLink) {
                currentLink.classList.remove('active');
            }

            // 3. Aseta uusi sivu ja linkki aktiiviseksi
            targetPage.classList.add('active');
            link.classList.add('active');
            
            // Nollaa skrollaus sivun yläreunaan
            window.scrollTo({ top: 0, behavior: 'auto' });

            // Käynnistä skrollausanimaatiot uudella sivulla
            initializeScrollObserver(targetPage);

            // 4. Siivoa "exiting"-luokka animaation jälkeen, jotta sivu piilottuu oikein
            setTimeout(() => {
                if (currentPage) {
                    currentPage.classList.remove('exiting');
                }
            }, 400); // Tämän pitää vastata CSS-transitionin kestoa
        });
    });

    // --- SKROLLAUSANIMAATIOIDEN ALUSTUS ---
    function initializeScrollObserver(container) {
        // Etsi animoitavat elementit VAIN aktiivisen sivun sisältä
        const elementsToAnimate = container.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    // Valinnainen: nollaa animaatio, kun skrollataan pois näkyvistä
                    // entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        elementsToAnimate.forEach(el => observer.observe(el));
    }

    // Käynnistä animaatiot oletuksena näkyvälle "alku"-sivulle heti alussa
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
