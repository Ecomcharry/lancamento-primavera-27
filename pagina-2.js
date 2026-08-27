"use strict";


/* ==========================
VÍDEO AUTOMÁTICO
========================== */

const productVideo =
    document.querySelector(".product-video");


function startProductVideo() {

    if (!productVideo) {
        return;
    }


    /* Configurações necessárias
    para autoplay em desktop e mobile */

    productVideo.autoplay = true;
    productVideo.loop = true;
    productVideo.muted = true;
    productVideo.defaultMuted = true;
    productVideo.playsInline = true;
    productVideo.controls = false;


    productVideo.setAttribute(
        "autoplay",
        ""
    );

    productVideo.setAttribute(
        "loop",
        ""
    );

    productVideo.setAttribute(
        "muted",
        ""
    );

    productVideo.setAttribute(
        "playsinline",
        ""
    );

    productVideo.setAttribute(
        "webkit-playsinline",
        ""
    );


    productVideo.removeAttribute(
        "controls"
    );


    const playPromise =
        productVideo.play();


    if (
        playPromise !== undefined
    ) {

        playPromise.catch(() => {

            /*
            Alguns navegadores podem
            aguardar a primeira interação
            da pessoa antes de liberar
            o autoplay.
            */

        });

    }

}


/* ==========================
INICIA QUANDO O HTML CARREGA
========================== */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startProductVideo,
        {
            once: true
        }
    );

} else {

    startProductVideo();

}


/* ==========================
NOVAS TENTATIVAS DURANTE
O CARREGAMENTO DO VÍDEO
========================== */

productVideo?.addEventListener(
    "loadedmetadata",
    startProductVideo
);


productVideo?.addEventListener(
    "loadeddata",
    startProductVideo
);


productVideo?.addEventListener(
    "canplay",
    startProductVideo
);


productVideo?.addEventListener(
    "canplaythrough",
    startProductVideo
);


/* ==========================
SE O VÍDEO PAUSAR
========================== */

productVideo?.addEventListener(
    "pause",
    () => {

        if (!document.hidden) {
            startProductVideo();
        }

    }
);


/* ==========================
QUANDO VOLTAR PARA A PÁGINA
========================== */

window.addEventListener(
    "pageshow",
    startProductVideo
);


/* ==========================
QUANDO VOLTAR PARA A ABA
========================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (!document.hidden) {
            startProductVideo();
        }

    }
);


/* ==========================
PRIMEIRA INTERAÇÃO
========================== */

const interactionEvents = [
    "touchstart",
    "pointerdown",
    "scroll"
];


interactionEvents.forEach(
    (eventName) => {

        window.addEventListener(
            eventName,
            startProductVideo,
            {
                once: true,
                passive: true
            }
        );

    }
);
