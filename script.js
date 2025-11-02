// Odotetaan, että koko DOM on valmis
document.addEventListener('DOMContentLoaded', () => {

    const contentContainer = document.getElementById('content-container');
    const navLinks = document.querySelectorAll('.nav-link');
    const toTopButton = document.getElementById('to-top-btn');

    // --- SISÄLLÖN LATAUSFUNKTIO ---
    // Tämä on uusi pääfunktio, joka hakee ja näyttää sisällön
    async function loadContent(url, activateLink) {
        try {
            // Lisää "poistumis"-animaatio vanhalle sisällölle
            contentContainer.classList.add('page-is-exiting');

            // Odota animaation päättymistä
            await new Promise(resolve => setTimeout(resolve, 300)); 

            // Hae uusi sisältö
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Sivun lataus epäonnistui.');
            }
            const html = await response.text();

            // Vaihda sisältö ja poista "poistumis"-tila
            contentContainer.innerHTML = html;
            contentContainer.classList.remove('page-is-exiting');

            // Lisää "saapumis"-animaatio
            contentContainer.classList.add('page-is-entering');
            
            // Skrollaa sivun ylälaitaan
            window.scrollTo({ top: 0, behavior: 'auto' });

            // Alusta skrollausanimaatiot uudelle sisällölle
            initializeScrollObserver();
            
            // Päivitä aktiivinen linkki navigaatiossa
            if (activateLink) {
                updateActiveLink(activateLink);
            }

            // Poista "saapumis"-animaatioluokka hetken päästä
            setTimeout(() => {
                contentContainer.classList.remove('page-is-entering');
            }, 500);

        } catch (error) {
            console.error('Virhe sisällön lataamisessa:', error);
            contentContainer.innerHTML = '<p>Sisällön lataaminen epäonnistui. Yritä päivittää sivu.</p>';
            contentContainer.classList.remove('page-is-exiting');
        }
    }

    // --- NAVIGAATION KÄSITTELY ---
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Estä normaali sivunvaihto
            const url = link.href;
            loadContent(url, link); // Lataa sisältö ja aktivoi tämä linkki
        });
    });

    // Päivitä mikä linkki näkyy aktiivisena
    function updateActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    // --- SCROLL-ANIMAATIOIDEN ALUSTUS ---
    // Tämä pitää nyt ajaa joka kerta kun uusi sisältö ladataan
    function initializeScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
        elementsToAnimate.forEach(el => observer.observe(el));
    }


    // --- "TAKAISIN YLÖS" -NAPPI ---
    // Tämä pysyy samana, mutta toimii nyt koko sivustolla
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

    // --- ALOITUSSIVUN LATAUS ---
    // Ladataan etusivun sisältö heti kun sivu avataan
    loadContent('index-content.html', document.querySelector('.nav-link[data-page="index-content"]'));

});
