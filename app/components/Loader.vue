<template>
    <Transition name="simpleFade">
        <div class="loader-container">
            <div class="spinner">
                <div class="bar1"></div>
                <div class="bar2"></div>
                <div class="bar3"></div>
                <div class="bar4"></div>
                <div class="bar5"></div>
                <div class="bar6"></div>
                <div class="bar7"></div>
                <div class="bar8"></div>
                <div class="bar9"></div>
                <div class="bar10"></div>
                <div class="bar11"></div>
                <div class="bar12"></div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.loader-container {
    position: absolute;
    z-index: 50;
    inset: 0;
    background: var(--color-white);
    height: 95%;
    top: 5%;
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.spinner {
    position: relative;
    width: 54px;
    height: 54px;
    display: inline-block;
}

.spinner div {
    width: 6%;
    height: 16%;
    background: var(--color-black);
    position: absolute;
    left: 49%;
    top: 43%;
    opacity: 1; /* L'animation des barres est indépendante de l'opacité du conteneur */
    border-radius: 50px;
    box-shadow: 0 0 3px rgba(212, 212, 212, 0.126);
    animation: fade 1s linear infinite;
}

@keyframes fade {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.25;
    }
}

.spinner .bar1 {
    transform: rotate(0deg) translate(0, -130%);
    animation-delay: 0s;
}

.spinner .bar2 {
    transform: rotate(30deg) translate(0, -130%);
    animation-delay: -0.9167s;
}

.spinner .bar3 {
    transform: rotate(60deg) translate(0, -130%);
    animation-delay: -0.833s;
}

.spinner .bar4 {
    transform: rotate(90deg) translate(0, -130%);
    animation-delay: -0.7497s;
}

.spinner .bar5 {
    transform: rotate(120deg) translate(0, -130%);
    animation-delay: -0.667s;
}

.spinner .bar6 {
    transform: rotate(150deg) translate(0, -130%);
    animation-delay: -0.5837s;
}

.spinner .bar7 {
    transform: rotate(180deg) translate(0, -130%);
    animation-delay: -0.5s;
}

.spinner .bar8 {
    transform: rotate(210deg) translate(0, -130%);
    animation-delay: -0.4167s;
}

.spinner .bar9 {
    transform: rotate(240deg) translate(0, -130%);
    animation-delay: -0.333s;
}

.spinner .bar10 {
    transform: rotate(270deg) translate(0, -130%);
    animation-delay: -0.2497s;
}

.spinner .bar11 {
    transform: rotate(300deg) translate(0, -130%);
    animation-delay: -0.167s;
}

.spinner .bar12 {
    transform: rotate(330deg) translate(0, -130%);
    animation-delay: -0.0833s;
}

.simpleFade-enter-active,
.simpleFade-leave-active {
    transition: opacity 0.25s ease-in-out;
}

.simpleFade-enter-from,
.simpleFade-leave-to {
    opacity: 0;
}
</style>