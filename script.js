let slide = 0;

const track = document.querySelector(".carousel-track");
const carouselImages = document.querySelectorAll(".carousel-track img");
const dots = document.querySelectorAll(".dots span");

const total = carouselImages.length;

function showSlide() {
    if (!track || total === 0) {
        return;
    }

    track.style.transform = `translateX(-${slide * 100}%)`;

    dots.forEach((dot) => {
        dot.classList.remove("active");
    });

    if (dots[slide]) {
        dots[slide].classList.add("active");
    }
}

function nextSlide() {
    slide++;

    if (slide >= total) {
        slide = 0;
    }

    showSlide();
}

function prevSlide() {
    slide--;

    if (slide < 0) {
        slide = total - 1;
    }

    showSlide();
}
