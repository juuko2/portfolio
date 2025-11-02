// Odotetaan, että koko sivu on latautunut
document.addEventListener('DOMContentLoaded', () => {

    // --- PARANNUS 1: Fade-in on Scroll -animaatio ---

    // Luodaan "tarkkailija", joka katsoo, milloin elementit tulevat näytölle
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Kun elementti tulee näkyviin, lisätään sille 'visible'-luokka
                entry.target.classList.add('visible');
            } else {
                // Valinnainen: poista luokka, jos haluat animaation toistuvan
                // entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1 // Animaatio käynnistyy, kun 10% elementistä näkyy
    });

    // Kerrotaan tarkkailijalle, mitä elementtejä sen pitää seurata
    // Haetaan kaikki elementit, joilla on luokka 'animate-on-scroll'
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    elementsToAnimate.forEach(el => observer.observe(el));


    // --- PARANNUS 2: "Takaisin ylös" -nappi ---

    const toTopButton = document.getElementById('to-top-btn');

    // Näytä tai piilota nappi selatessa
    window.addEventListener('scroll', () => {
        if (toTopButton) { // Varmistetaan, että nappi on olemassa
            if (window.scrollY > 300) { // Näytä nappi, kun on selattu 300px
                toTopButton.classList.add('visible');
            } else {
                toTopButton.classList.remove('visible');
            }
        }
    });

    // Lisätään klikkaustoiminto nappiin
    if (toTopButton) {
        toTopButton.addEventListener('click', () => {
            // Skrollaa pehmeästi sivun ylälaitaan
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    
    // --- PARANNUS 3 (UUSI): Sivun vaihdon "Fade-Out" -animaatio ---

    // Hae kaikki navigaatiolinkit (myös brändi-linkki)
    const navLinks = document.querySelectorAll('.navbar-nav a, .navbar-brand');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            
            // Hae kohde-URL
            const targetUrl = this.href;

            // Jos linkki on ankkuri (#) tai se osoittaa jo nykyiselle sivulle, 
            // älä tee mitään, anna selaimen hoitaa.
            if (!targetUrl || targetUrl.includes('#') || targetUrl === window.location.href) {
                return;
            }

            // 1. Estä oletustoiminto (välitön sivun vaihto)
            event.preventDefault();

            // 2. Lisää "poistumisluokka" bodyyn
            document.body.classList.add('page-is-exiting');

            // 3. Odota animaation loppuun (CSS:ssä 300ms)
            setTimeout(() => {
                // 4. Siirry uudelle sivulle
                window.location.href = targetUrl;
            }, 300); // Tämän ajan pitää vastata CSS-transitionia
        });
    });

    // Korjaus selaimen "Takaisin"-napille:
    // Jos sivu ladataan selaimen välimuistista (bfcache),
    // se saattaa olla yhä "page-is-exiting" -tilassa. Poistetaan se.
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.classList.remove('page-is-exiting');
        }
    });

});
