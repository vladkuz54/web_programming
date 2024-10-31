const OPEN_CLASSNAME = "open";

const navLinks = document.getElementById("nav-links");

function toggleMenu() {
    if (navLinks.classList.contains(OPEN_CLASSNAME)) {
        navLinks.classList.remove(OPEN_CLASSNAME);
    } else {
        navLinks.classList.add(OPEN_CLASSNAME);
    }
}


const scrollElements = document.querySelectorAll('.animate-on-scroll');

const elementInView = (el, offset = 100) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset
  );
};

const displayScrollElement = (element) => {
  element.classList.add('visible');
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 150)) {
      displayScrollElement(el);
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  handleScrollAnimation(); 
});


window.addEventListener('scroll', () => {
  handleScrollAnimation();
});


