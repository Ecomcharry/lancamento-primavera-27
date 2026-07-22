"use strict";

let currentSlide = 0;
let pointerStartX = 0;
let carouselWasDragged = false;

const track = document.querySelector(".carousel-track");
const carouselArea = document.querySelector(".carousel-area");
const carouselLink = document.querySelector(".carousel-product-link");

const images = Array.from(
    document.querySelectorAll(".carousel-track img")
);

const dots = Array.from(
    document.querySelectorAll(".dots span")
);

const previousButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

const totalSlides = images.length;


/* ==========================
CARREGAMENTO DAS IMAGENS
========================== */

function loadCarouselImage(index) {
    const image = images[index];

    if (!image || image.src || !image.dataset.src) {
        return;
    }

    image.src = image.dataset.src;
    image.removeAttribute("data-src");
}


function preloadNearbyImages() {
    if (totalSlides === 0) {
        return;
    }

    const previousIndex =
        (currentSlide - 1 + totalSlides) % totalSlides;

    const nextIndex =
        (currentSlide + 1) % totalSlides;

    loadCarouselImage(currentSlide);
    loadCarouselImage(previousIndex);
    loadCarouselImage(nextIndex);
}


/* ==========================
EXIBIR SLIDE
========================== */

function showSlide() {
    if (!track || totalSlides === 0) {
        return;
    }

    preloadNearbyImages();

    track.style.transform =
        `translate3d(-${currentSlide * 100}%, 0, 0)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle(
            "active",
            index === currentSlide
        );
    });
}


/* ==========================
NAVEGAÇÃO
========================== */

function nextSlide() {
    currentSlide =
        (currentSlide + 1) % totalSlides;

    showSlide();
}


function previousSlide() {
    currentSlide =
        (currentSlide - 1 + totalSlides) % totalSlides;

    showSlide();
}


previousButton?.addEventListener(
    "click",
    previousSlide
);

nextButton?.addEventListener(
    "click",
    nextSlide
);


/* ==========================
TECLADO
========================== */

carouselArea?.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "ArrowLeft") {
            previousSlide();
        }

        if (event.key === "ArrowRight") {
            nextSlide();
        }
    }
);


/* ==========================
GESTO DE ARRASTAR
========================== */

carouselArea?.addEventListener(
    "pointerdown",
    (event) => {
        pointerStartX = event.clientX;
        carouselWasDragged = false;
    }
);


carouselArea?.addEventListener(
    "pointermove",
    (event) => {
        const movement =
            Math.abs(event.clientX - pointerStartX);

        if (movement > 10) {
            carouselWasDragged = true;
        }
    }
);


carouselArea?.addEventListener(
    "pointerup",
    (event) => {
        const distance =
            event.clientX - pointerStartX;

        if (Math.abs(distance) < 40) {
            return;
        }

        if (distance < 0) {
            nextSlide();
        } else {
            previousSlide();
        }
    }
);


/* Evita abrir o link quando a pessoa apenas arrastar */

carouselLink?.addEventListener(
    "click",
    (event) => {
        if (carouselWasDragged) {
            event.preventDefault();
            carouselWasDragged = false;
        }
    }
);


/* ==========================
CARREGAMENTO DO VÍDEO
========================== */

const video = document.querySelector(
    ".video-box video"
);

const videoSource = video?.querySelector(
    "source[data-src]"
);


function loadVideo() {
    if (!video || !videoSource) {
        return;
    }

    if (!videoSource.src) {
        videoSource.src = videoSource.dataset.src;
        videoSource.removeAttribute("data-src");

        video.load();
    }
}


function playVideo() {
    if (!video) {
        return;
    }

    const playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {
            /* Alguns navegadores podem bloquear o autoplay */
        });
    }
}


if (
    video &&
    videoSource &&
    "IntersectionObserver" in window
) {
    const videoObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    loadVideo();
                    playVideo();
                } else {
                    video.pause();
                }
            });
        },
        {
            rootMargin: "300px 0px",
            threshold: 0.01
        }
    );

    videoObserver.observe(video);
} else {
    loadVideo();
    playVideo();
}


/* ==========================
INICIALIZAÇÃO
========================== */

showSlide();
