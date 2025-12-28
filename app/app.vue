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

startAutoRefresh()
useRideWatcher()
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