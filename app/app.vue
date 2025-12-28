<template>
  <div id="__nuxt">
      <PhoneFrame>
        <!-- <Loader v-show="loader"/> -->
        <div class="nuxtpage-container">
          <NuxtPage />
        </div>
        <NavBar/>
      </PhoneFrame>
  </div>
</template>

<script setup>
import { loader, displayLoader } from '@/composables/useLoader'
import { data, startAutoRefresh, isLoading, error } from '/composables/useData'
import { useRideWatcher } from '/composables/useRideWatcher'
import { useRoute } from 'vue-router'
import { onMounted, watch, nextTick } from 'vue'

startAutoRefresh()
useRideWatcher()

const route = useRoute()

const scrollToTop = () => {
  const el = document.querySelector('.nuxtpage-container')
  if (el) el.scrollTop = 0
}

// Ensure container is at top on first mount
onMounted(() => {
  scrollToTop()
})

// Scroll to top on each route change
watch(() => route.fullPath, async () => {
  // Wait for DOM updates so the entering page element is available
  await nextTick()
  const pageEl = document.querySelector('.nuxtpage-container > *')
  const perform = () => scrollToTop()
  if (!pageEl) {
    // fallback: no specific page element to wait for
    setTimeout(perform, 0)
    return
  }

  let handled = false
  const onEnd = () => {
    if (handled) return
    handled = true
    pageEl.removeEventListener('transitionend', onEnd)
    pageEl.removeEventListener('animationend', onEnd)
    perform()
  }

  pageEl.addEventListener('transitionend', onEnd)
  pageEl.addEventListener('animationend', onEnd)

  // Fallback in case there's no transition/animation
  setTimeout(() => {
    if (handled) return
    handled = true
    pageEl.removeEventListener('transitionend', onEnd)
    pageEl.removeEventListener('animationend', onEnd)
    perform()
  }, 600)
})
</script>

<style>
@import url('../style/main.css');

.nuxtpage-container {
  height: calc(100% - 70px);
  padding: 0 15px;
  padding-top: 3px;
  overflow-y: auto;
  scroll-behavior: smooth;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.nuxtpage-container::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}

.scrollbar-track,
.scrollbar-track > .scrollbar-thumb {
  display: none !important;
}
</style>