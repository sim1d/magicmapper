<template>
    <div class="container" v-if="!appfocus">
        <div class="left">
            <h1>MagicMapper</h1>
            <p>live demo</p>
            <br>
            <br>
            <p>Please keep in mind that this is an unofficial prototype. It also uses unofficial APIs to retrieve live data from these parks.</p>
            <br>
            <br>
            <p>This prototype was developed in 48 hours for the “Maximally Vibe-a-thon” by Maximally.</p>
            <br>
            <br>
            <p>Presented & developed by sim1d.</p>
        </div>
        <div class="content">
            <div class="frame-container">
                <img src="/img/frame/top.png" class="frame-top">
                <img src="/img/frame/border.png" class="frame-border">
                <img src="/img/frame/bottom.png" class="frame-bottom">
                <div class="app-container">
                    <slot></slot>
                </div>
                <div class="notif-mask">
                    <div :class="{hidden: !notif, notif: true}">
                        <div class="notif-spacer">
                            <div class="notif-logo">
                                <img src="/img/logo.png" alt="">
                            </div>
                            <div class="notif-content">
                                <h6>{{ notifTitle }}</h6>
                                <p class="small">{{ notifMessage }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <br>
            <p>Next data reload in {{ nextDataReload }} seconds.</p>
            <div class="focus-toggle-container" @click="toggleFocus()">
                <i class="ri-focus-mode"></i>
            </div>
        </div>
    </div>
    <div class="container" v-else>
        <div class="content">
            <div class="frame-container">
                <div class="focus-app-container">
                    <slot></slot>
                </div>
                <div class="focus-notif-mask">
                    <div :class="{hidden: !notif, notif: true}">
                        <div class="notif-spacer">
                            <div class="notif-logo">
                                <img src="/img/logo.png" alt="">
                            </div>
                            <div class="notif-content">
                                <h6>{{ notifTitle }}</h6>
                                <p class="small">{{ notifMessage }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="focus-toggle-container" @click="toggleFocus()">
                <i class="ri-focus-mode"></i>
            </div>
        </div>
    </div>
    <div class="warning">
        <div class="text-container">
            <h6>This prototype is not optimized for small screens. Please use a device with a larger display.</h6>
        </div>
    </div>
</template>

<script setup>
import { useNotifications } from '~/composables/useNotifications';
import { nextDataReload } from '/composables/useNextDataReload'

const { notif, notifTitle, notifMessage } = useNotifications()

const appfocus = ref(false)

const toggleFocus = () => {
    appfocus.value = !appfocus.value
}

</script>

<style scoped>
@import url('../../style/main.css');

/* FOCUS */
.focus-app-container {
    position: absolute;
    top: 0;
    left: -0.1%;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 20px;
    padding-left: 0.4px;
    padding-right: 1px;
    background: var(--color-white);
    color: var(--color-black);
    overflow-y: auto;
}

.focus-notif-mask {
    position: absolute;
    top: 0;
    overflow: hidden;
    left: 8.5%;
    width: 83%;
    height: 12%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

/* NORMAL */
.container {
    background: var(--color-black);
    color: var(--color-white);
    height: 100svh;
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    overflow: hidden;
}

.left, .right {
    flex: 1;
    padding: 25px;
    position: relative;
}

.content {
    position: relative;
    flex: 2;
    display: flex;
    justify-content: center;
    align-items: center;
}

.focus-toggle-container {
    position: absolute;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    bottom: 3.5%;
    right: 15%;
}

.focus-toggle-container i {
    font-size: 50px;
}

.frame-container {
    position: relative;
    height: 100%;
    aspect-ratio: 9/19;
    max-width: 100%;
    overflow: hidden;
}
/* images du téléphone */
.frame-container > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
    z-index: 1;
}

.frame-border {
    z-index: 100 !important;
}

.app-container {
    position: absolute;
    top: 4.3%;
    left: 5.9%;
    width: 88%;
    height: 86%;
    overflow: hidden;
    border-radius: 45px;
    padding-top: 46px;
    padding-left: 0.4px;
    padding-right: 1px;
    background: var(--color-white);
    color: var(--color-black);
    overflow-y: auto;
}

.notif {
    background: rgba(163, 163, 163, 0.95);
    height: 75px;
    border-radius: 20px;
    overflow: hidden;
    z-index: 90 !important;
    transition: transform .75s ease;
}

.notif.hidden {
    transform: translateY(-130px);
    z-index: 1;
}

.notif-spacer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    height: 75%;
    padding: 10px;
    overflow: hidden;
}

.notif-logo {
    background: var(--color-white);
    border-radius: 100px;
    height: 50px;
    width: auto;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notif-logo img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.notif-content {
    flex: 1;
    color: var(--color-black);
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.notif-content p {
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}

.notif-mask {
    position: absolute;
    top: 5%;
    overflow: hidden;
    left: 8.5%;
    width: 83%;
    height: 12%;
    z-index: 30;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    pointer-events: none;
}

.warning {
    display: none;
    background: var(--color-black);
    color: var(--color-white);
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
}

.text-container {
    padding: 75px;
}

.text-container h6 {
    text-align: justify;
}

@media (max-width: 999px), (max-height: 699px) {
  .warning {
    display: flex;
  }

  .container {
    display: none;
  }
}

</style>
