<template>
    <div class="search-content">
        <div class="search-zone">
            <div class="search-bar">
                <div class="search-bar-icon">
                    <i class="ri-search-line"></i>
                </div>
                <input type="text" placeholder="search" v-model="searchQuery">
            </div>
            <div class="search-filter" @click="toggleFilterMenu">
                <i :class="{ 'ri-filter-line': !filterMenuActive, 'ri-filter-fill': filterMenuActive }"></i>
            </div>
        </div>
        <div class="filters" v-if="filterMenuActive">
            <div class="filters-select">
                <div class="filter-container">
                    <select id="park-select" v-model="filterPark">
                        <option value="Disneyland Park">Disneyland</option>
                        <option value="Walt Disney Studios Park">Walt Disney Studios</option>
                    </select>
                </div>
                <div class="filter-container">
                    <select id="park-select" v-model="filterType">
                        <option value="ATTRACTION">Attraction</option>
                        <option value="SHOW">Show</option>
                    </select>
                </div>
            </div>
            <div class="filters-checkbox">
                <div class="filter-container">
                    <input type="checkbox" v-model="filterOnlyOpen">
                    <p>only open</p>
                </div>
                <div class="filter-container">
                    <input type="checkbox" v-model="filterWaitTime">
                    <p>wait time under 30 min</p>
                </div>
            </div>
            <div class="filters-reset">
                <p @click="resetFilters">reset filters</p>
            </div>
        </div>
        <div class="search-result ride-card-container" v-if="filteredRides.length > 0">
            <RideCard v-for="ride in filteredRides" :ride="ride" :key="ride.id" @click="goToRide(ride)" @image-loaded="onImageLoaded"/>
        </div>
        <div class="no-result-query" v-else>
            <p>Aucun résultat.</p>
        </div>
    </div>
</template>

<script setup>
import { loader, displayLoader } from '@/composables/useLoader'
import { data, startAutoRefresh, isLoading, error } from '/composables/useData'

const router = useRouter()
const route = useRoute()

const filterMenuActive = ref(false)
const searchQuery = ref('')

const filterPark = ref('')
const filterType = ref('')

const filterOnlyOpen = ref(false)
const filterWaitTime = ref(false)

displayLoader(true)

onMounted(() => {
    if (route.query.type) {
        filterType.value = String(route.query.type).toUpperCase()
    }

    if (route.query.park) {
        filterPark.value = String(route.query.park)
    }

    if (route.query.open === 'true') {
        filterOnlyOpen.value = true
    }

    if (route.query.wait === 'true') {
        filterWaitTime.value = true
    }

    if (route.query.q) {
        searchQuery.value = String(route.query.q)
    }
})


const toggleFilterMenu = () => {
    filterMenuActive.value = !filterMenuActive.value
}



const filteredRides = computed(() => {
  if (!data.value) return []

  const now = new Date()

  return data.value.filter(ride => {
    // recherche
    if (searchQuery.value && !ride.name.toLowerCase().includes(searchQuery.value.toLowerCase())) return false

    // park
    if (filterPark.value && ride.park !== filterPark.value) return false

    // type
    if (filterType.value && ride.entityType !== filterType.value.toUpperCase()) return false

    // only open
    if (filterOnlyOpen.value) {
      if (ride.entityType === 'SHOW') {
        const nextShow = ride.showtimes
          ?.map(s => new Date(s.startTime))
          .filter(d => d.getTime() > now.getTime())
          .sort((a, b) => a - b)[0]

        if (!nextShow) return false
      } else if (ride.status !== 'OPERATING') {
        return false
      }
    }

    // wait time
    if (filterWaitTime.value) {
      const waitTime = ride.queue?.STANDBY?.waitTime
      if (waitTime != null && waitTime > 30) return false
    }

    return true
  })
})


const nextShowTime = computed(() => {
  const now = new Date()

  const next = props.ride.showtimes
    .map(s => new Date(s.startTime))
    .filter(d => d.getTime() > now.getTime())  // comparaison fiable
    .sort((a, b) => a - b)[0]

  if (!next) return null

  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Paris" // force heure française
  }).format(next)
})

const resetFilters = () => {

    filterPark.value = ''
    filterType.value = ''

    filterOnlyOpen.value = false
    filterWaitTime.value = false

}

const goToRide = (ride) => {
    router.push(`/ride/${ride.id}`)
}

const imagesLoaded = ref(0)

watch(filteredRides, () => {
  imagesLoaded.value = 0
})

const onImageLoaded = () => {
    imagesLoaded.value++

    if (imagesLoaded.value == filteredRides.value.length) {
        displayLoader(false)
    }
}
</script>

<style scoped>
.search-content {
    min-height: 100%;
}

.search-zone i {
    font-size: 1.6rem;
}

.search-zone {
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: center;
    gap: 8px;
    height: 40px;
}

.search-bar{
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    height: 40px;
}

.search-bar-icon {
    position: absolute;
    left: 1.5%;
    z-index: 3;
}

.search-bar input {
    width: 100%;
    font-size: 1.15rem;
    box-sizing: border-box;
    padding: 7px;
    padding-left: 35px;
    background: transparent;
    border: none;
    outline: none;
    background: rgb(227, 227, 227);
    border-radius: 50px;
    color: var(--color-black);
    position: relative;
    z-index: 2;
    cursor: text;
    height: 40px;
}

.search-filter {
    height: 40px;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 100px;
    z-index: 2;
    transition: background .4s ease;
}

.search-filter:hover {
    background: rgb(227, 227, 227);
}

.filters {
    position: relative;
    z-index: 3;
    pointer-events: auto;
    margin-top: 8px;
    display: flex;
    gap: 8px;
}

.filter-container {
    flex: 1;
}

.search-result {
    padding-top: 15px;
}

.no-result-query {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
}

.filters {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
}

.filters-select {
    display: flex;
    align-items: center;
    gap: 20px;
}

.filters-select .filter-container select {
    background: var(--color-white);
    width: 100%;
    padding: 2px;
    border-radius: 5px;
    border: 1px solid var(--color-black);
    outline: none;
}

.filters-checkbox {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.filters-checkbox .filter-container {
    display: flex;
    align-items: center;
    gap: 5px;
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

.filters-reset p {
    text-align: center;
    background: var(--color-red);
    color: var(--color-white);
    font-weight: 500;
    border-radius: 20px;
    padding: 4px;
    cursor: pointer;
}
</style>