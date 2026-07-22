"use strict";


/* ==========================
CONFIGURAÇÕES
========================== */

const mobileMedia = window.matchMedia("(max-width: 900px)");

let currentSlide = 0;
let pointerStartX = 0;
let carouselWasDragged = false;
let carouselInitialized = false;
let finalBannerLoaded = false;


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


/* Carrega a imagem atual e a próxima */

function preloadCarouselImages() {
    if (totalSlides === 0) {
        return;
    }

    const nextIndex =
        (currentSlide + 1) % totalSlides;

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
    nextEvent => {
        nextEvent.preventDefault();
        previousSlide();
    }
);


nextButton?.addEventListener(
    "click",
    nextEvent => {
        nextEvent.preventDefault();
        nextSlide();
    }
);


/* ==========================
TECLADO
========================== */

carouselArea?.addEventListener(
    "keydown",
    event => {
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
    event => {
        pointerStartX = event.clientX;
        carouselWasDragged = false;
    }
);


carouselArea?.addEventListener(
    "pointermove",
    event => {
        const movement =
            Math.abs(event.clientX - pointerStartX);

        if (movement > 10) {
            carouselWasDragged = true;
        }
    }
);


carouselArea?.addEventListener(
    "pointerup",
    event => {
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


/* Evita abrir o produto quando a pessoa arrasta */

carouselLink?.addEventListener(
    "click",
    event => {
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

    if (!videoSource.dataset.src) {
        return;
    }

    videoSource.src = videoSource.dataset.src;
    videoSource.removeAttribute("data-src");

    video.load();
}


function playVideo() {
    if (!video) {
        return;
    }

    const playPromise = video.play();

    if (playPromise !== undefined) {
        playPromise.catch(() => {
            /*
            Alguns navegadores podem bloquear
            a reprodução automática.
            */
        });
    }
}


if (
    video &&
    videoSource &&
    "IntersectionObserver" in window
) {
    const videoObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
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


if (
    desktopBannerSection &&
    desktopBannerImage &&
    !mobileMedia.matches
) {
    if ("IntersectionObserver" in window) {
        const desktopBannerObserver =
            new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
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
    } else {
        loadDesktopBanner();
    }
}


/* ==========================
BANNER FINAL RESPONSIVO

DESKTOP: banner-7 com WhatsApp
MOBILE: mob-6 sem link
========================== */

const finalBanner = document.querySelector(
    ".final-banner"
);

const finalBannerLink = document.querySelector(
    ".final-banner-link"
);

const finalBannerImage = document.querySelector(
    ".final-banner-image"
);


function configureFinalBanner() {
    if (!finalBannerLink || !finalBannerImage) {
        return;
    }

    if (mobileMedia.matches) {
        finalBannerLink.removeAttribute("href");
        finalBannerLink.removeAttribute("target");
        finalBannerLink.removeAttribute("rel");

        finalBannerLink.setAttribute(
            "aria-label",
            "Banner coleção Charry"
        );

        finalBannerLink.setAttribute(
            "aria-disabled",
            "true"
        );

        finalBannerLink.setAttribute(
            "tabindex",
            "-1"
        );

        finalBannerLink.classList.add(
            "is-disabled"
        );

        if (finalBannerLoaded) {
            finalBannerImage.src =
                finalBannerImage.dataset.mobileSrc;
        }
    } else {
        finalBannerLink.href =
            finalBannerLink.dataset.desktopHref;

        finalBannerLink.target = "_blank";
        finalBannerLink.rel = "noopener noreferrer";

        finalBannerLink.setAttribute(
            "aria-label",
            "Entrar no grupo da Charry no WhatsApp"
        );

        finalBannerLink.removeAttribute(
            "aria-disabled"
        );

        finalBannerLink.removeAttribute(
            "tabindex"
        );

        finalBannerLink.classList.remove(
            "is-disabled"
        );

        if (finalBannerLoaded) {
            finalBannerImage.src =
                finalBannerImage.dataset.desktopSrc;
        }
    }
}


function loadFinalBanner() {
    if (!finalBannerImage) {
        return;
    }

    finalBannerLoaded = true;

    if (mobileMedia.matches) {
        finalBannerImage.src =
            finalBannerImage.dataset.mobileSrc;
    } else {
        finalBannerImage.src =
            finalBannerImage.dataset.desktopSrc;
    }
}


configureFinalBanner();


if (
    finalBanner &&
    finalBannerImage &&
    "IntersectionObserver" in window
) {
    const finalBannerObserver =
        new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadFinalBanner();
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: "400px 0px",
                threshold: 0.01
            }
        );

    finalBannerObserver.observe(finalBanner);
} else {
    loadFinalBanner();
}


/* Atualiza se a tela mudar de desktop para mobile */

mobileMedia.addEventListener?.(
    "change",
    configureFinalBanner
);
