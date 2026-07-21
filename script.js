let slide = 0;

const track = document.querySelector(".carousel-track");
const carouselImages = document.querySelectorAll(".carousel-track img");
const dots = document.querySelectorAll(".dots span");

const total = carouselImages.length;


/* ==========================
EXIBIR IMAGEM ATUAL
========================== */

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


/* ==========================
PRÓXIMA IMAGEM
========================== */

function nextSlide() {
    slide++;

    if (slide >= total) {
        slide = 0;
    }

    showSlide();
}


/* ==========================
IMAGEM ANTERIOR
========================== */

function prevSlide() {
    slide--;

    if (slide < 0) {
        slide = total - 1;
    }

    showSlide();
}


/* ==========================
NAVEGAÇÃO PELO TECLADO
========================== */

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        prevSlide();
    }

    if (event.key === "ArrowRight") {
        nextSlide();
    }
});


/* ==========================
ESTADO INICIAL
========================== */

showSlide();
