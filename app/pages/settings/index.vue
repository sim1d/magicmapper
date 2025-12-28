<template>
    <div class="settings-container">
        <h3>Settings</h3>
        <div class="input-container">
            <input type="checkbox" v-model="invertedLiveData">
            <p>Use random data</p>
        </div>
        <p class="small details">When enabled, the data will be randomized every 2 minutes instead of using live data. Note that this also activates random locations within the Disneyland Paris Resort, so your current location will not be used.</p>
        <p class="small details">This feature allows you to see how the app would behave in real-time while exploring the Disneyland Paris Resort.</p>
        <p class="small details">(When you toggle this checkbox, the change will take effect on the next data reload.)</p>
    </div>
</template>

<script setup>
import { liveData } from '/composables/useLiveData'

const invertedLiveData = computed({
    get: () => !liveData.value,  // inverse pour l'affichage
    set: (val) => { liveData.value = !val } // inverse quand on change la checkbox
})

</script>

<style scoped>
.settings-container {
    margin-top: 15px;
}

.input-container {
    margin-top: 30px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 5px;
    height: 25px;
}

p.details {
    text-align: justify;
    line-height: 13px;
    font-style: italic;
    margin-bottom: 3px;
}

input[type="checkbox"] {
  -webkit-appearance: none; /* Chrome / Safari */
  appearance: none;          /* Standard */
  height: 15px;
  aspect-ratio: 1 / 1;
  border: 1px solid var(--color-black);
  border-radius: 2px;        /* coin arrondi si tu veux */
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

input[type="checkbox"]:checked {
  background-color: var(--color-blue);
}
input[type="checkbox"]:checked::after {
  content: "✓";
  display: block;
  font-weight: 800;
  text-align: center;
  color: white;
  font-size: 12px;
}
</style>