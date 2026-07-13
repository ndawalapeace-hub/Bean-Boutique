let current = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(n) {
    slides.forEach((slide) => slide.classList.remove('active'));
    slides[n].classList.add('active');
}

function nextSlide(){
    current = (current + 1) % slides.length;
    showSlide(current);
}

function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
}

setInterval(nextSlide, 5000);

slides[0].classList.add('active');