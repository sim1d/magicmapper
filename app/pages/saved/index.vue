<template>
    <div class="saved-container">
        <h3>Ride saved</h3>
        <h6>Optimal order</h6>
        <p class="small" style="font-style: italic;">Please check this page regularly or pay attention to notifications in case of any changes.</p>
        <div class="search-result ride-card-container" v-if="favoriteRidesSorted.length > 0">
            <RideCard v-for="ride in favoriteRidesSorted" :ride="ride" :key="ride.name" @click="goToRide(ride)"/>
        </div>
        <div v-else>
            <p>You have no saved rides for the moment.</p>
        </div>
    </div>
</template>

<script setup>
import { data, startAutoRefresh, isLoading, error } from '/composables/useData'
import { useFavorites } from '/composables/useFavorites'
import { useRideWatcher } from '/composables/useRideWatcher'

const { favorites, toggleFavorite, isFavorite } = useFavorites()

const router = useRouter()
const { favoriteRidesSorted } = useRideWatcher()

const favoriteRides = computed(() =>
  data.value.filter(r => favorites.value.includes(r.id))
)

const goToRide = (ride) => {
    router.push(`/ride/${ride.id}`)
}


</script>

<style scoped>
.saved-container {
    margin-top: 15px;
}

.saved-container h3 {
    margin-bottom: 20px;
}

.saved-container h6 {
    margin-bottom: 5px;
}

.saved-container > p.small {
    margin-bottom: 20px;
}
</style>