const OPEN_CLASSNAME = "open";

const navLinks = document.getElementById("nav-links");

function toggleMenu() {
    if (navLinks.classList.contains(OPEN_CLASSNAME)) {
        navLinks.classList.remove(OPEN_CLASSNAME);
    } else {
        navLinks.classList.add(OPEN_CLASSNAME);
    }
}


        function onEntry(entry) {
  entry.forEach(change => {
    if (change.isIntersecting) {
     change.target.classList.add('element-show');
    }
  });
}
            
let options = {
  threshold: [0.5] };
let observer = new IntersectionObserver(onEntry, options);
let elements = document.querySelectorAll('.element');

for (let elm of elements) {
  observer.observe(elm);
} 
