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
        if (window.scrollY > 300) { // Näytä nappi, kun on selattu 300px
            toTopButton.classList.add('visible');
        } else {
            toTopButton.classList.remove('visible');
        }
    });

    // Lisätään klikkaustoiminto nappiin
    toTopButton.addEventListener('click', () => {
        // Skrollaa pehmeästi sivun ylälaitaan
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});
