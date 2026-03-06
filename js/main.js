/*=============== STICKY HEADER ===============*/
(function () {
    const header = document.querySelector('.header') || document.querySelector('.post-header');
    if (!header) return;
    window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    }, { passive: true });
})();

/*===== MENU SHOW =====*/
/* Validate if constant exists */
const navToggle = document.getElementById('nav-toggle')
const navClose = document.getElementById('nav-close')
const navMenu = document.getElementById('nav-menu')

if(navToggle){
    navToggle.addEventListener('click', () =>{
        if (navMenu) navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        if (navMenu) navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    if (navMenu) navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== SCROLL REVEAL ANIMATION ===============*/
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
        distance: '90px',
        duration: 3000,
    })

    sr.reveal(`.home__data`, {origin: 'top', delay: 400})
    sr.reveal(`.home__img`, {origin: 'bottom', delay: 600})
    sr.reveal(`.home__footer`, {origin: 'bottom', delay: 800})
}
