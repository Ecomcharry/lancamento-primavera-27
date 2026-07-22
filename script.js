"use strict";


/* ==========================
CONFIGURAÇÕES
========================== */

const mobileMedia = window.matchMedia("(max-width: 900px)");

let currentSlide = 0;
let pointerStartX = 0;
let carouselWasDragged = false;
let carouselInitialized = false;


/* ==========================
CARROSSEL
========================== */

const track = document.querySelector(".carousel-track");
const carouselArea = document.querySelector(".carousel-area");
const carouselLink = document.querySelector(".carousel-product-link");

const carouselImages = Array.from(
    document.querySelectorAll(".carousel-track img")
);

const dots = Array.from(
    document.querySelectorAll(".dots span")
);

const previousButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");

const totalSlides = carouselImages.length;


/* ==========================
CARREGAR IMAGEM DO CARROSSEL
========================== */

function loadCarouselImage(index) {
    const image = carouselImages[index];

    if (!image || !image.dataset.src) {
        return;
    }

    image.src = image.dataset.src;
    image.removeAttribute("data-src");
}


/* Carrega a imagem atual, a anterior e a próxima */

function preloadCarouselImages() {
    if (totalSlides === 0) {
        return;
    }

    const previousIndex =
        (currentSlide - 1 + totalSlides) % totalSlides;

    const nextIndex =
        (currentSlide + 1) % totalSlides;

    loadCarouselImage(previousIndex);
    loadCarouselImage(currentSlide);
    loadCarouselImage(nextIndex);
}


/* ==========================
EXIBIR SLIDE
========================== */

function showSlide() {
    if (!track || totalSlides === 0) {
        return;
    }

    preloadCarouselImages();

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
INICIAR CARROSSEL
========================== */

function initializeCarousel() {
    if (carouselInitialized) {
        return;
    }

    carouselInitialized = true;

    showSlide();
}


if (
    carouselArea &&
    "IntersectionObserver" in window
) {
    const carouselObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    initializeCarousel();
                    observer.disconnect();
                }
            });
        },
        {
            rootMargin: "400px 0px",
            threshold: 0.01
        }
    );

    carouselObserver.observe(carouselArea);
} else {
    initializeCarousel();
}


/* ==========================
PRÓXIMA E ANTERIOR
========================== */

function nextSlide() {
    initializeCarousel();

    currentSlide =
        (currentSlide + 1) % totalSlides;

    showSlide();
}


function previousSlide() {
    initializeCarousel();

    currentSlide =
        (currentSlide - 1 + totalSlides) % totalSlides;

    showSlide();
}


previousButton?.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        previousSlide();
    }
);


nextButton?.addEventListener(
    "click",
    (event) => {
        event.preventDefault();
        nextSlide();
    }
);


/* ==========================
TECLADO
========================== */

carouselArea?.addEventListener(
    "keydown",
    (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            previousSlide();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            nextSlide();
        }
    }
);


/* ==========================
ARRASTAR NO MOBILE
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


carouselArea?.addEventListener(
    "pointercancel",
    () => {
        carouselWasDragged = false;
    }
);


/* Impede que o produto abra durante o gesto de arrastar */

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
REPRODUÇÃO RÁPIDA DO VÍDEO
========================== */

const productVideo = document.querySelector(
    ".product-video"
);


function startProductVideo() {
    if (!productVideo) {
        return;
    }

    productVideo.muted = true;
    productVideo.defaultMuted = true;

    const playPromise = productVideo.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {
            /*
            Alguns navegadores podem bloquear
            temporariamente o autoplay.
            */
        });
    }
}


/* Tenta iniciar assim que o HTML estiver pronto */

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        startProductVideo,
        { once: true }
    );
} else {
    startProductVideo();
}


/* Tenta novamente quando houver dados suficientes */

productVideo?.addEventListener(
    "loadeddata",
    startProductVideo
);

productVideo?.addEventListener(
    "canplay",
    startProductVideo
);


/* Reinicia ao retornar para a página */

window.addEventListener(
    "pageshow",
    startProductVideo
);


/* Reinicia quando a aba volta a ficar visível */

document.addEventListener(
    "visibilitychange",
    () => {
        if (!document.hidden) {
            startProductVideo();
        }
    }
);


/* ==========================
BANNER 6 SOMENTE NO DESKTOP
========================== */

const desktopBannerSection = document.querySelector(
    ".banner-6-desktop"
);

const desktopBannerImage = document.querySelector(
    ".desktop-banner-image"
);


function loadDesktopBanner() {
    if (
        !desktopBannerImage ||
        !desktopBannerImage.dataset.src
    ) {
        return;
    }

    desktopBannerImage.src =
        desktopBannerImage.dataset.src;

    desktopBannerImage.removeAttribute("data-src");
}


function configureDesktopBanner() {
    if (mobileMedia.matches) {
        return;
    }

    loadDesktopBanner();
}


if (
    desktopBannerSection &&
    desktopBannerImage &&
    !mobileMedia.matches &&
    "IntersectionObserver" in window
) {
    const desktopBannerObserver =
        new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        loadDesktopBanner();
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: "300px 0px",
                threshold: 0.01
            }
        );

    desktopBannerObserver.observe(
        desktopBannerSection
    );
} else if (!mobileMedia.matches) {
    loadDesktopBanner();
}


/* ==========================
ALTERAÇÃO ENTRE MOBILE E DESKTOP
========================== */

function handleScreenChange() {
    configureDesktopBanner();
    startProductVideo();
}


if (typeof mobileMedia.addEventListener === "function") {
    mobileMedia.addEventListener(
        "change",
        handleScreenChange
    );
} else if (typeof mobileMedia.addListener === "function") {
    mobileMedia.addListener(
        handleScreenChange
    );
}
