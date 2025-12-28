<template>
    <div class="ride-container" v-if="ride">
        <div class="img-top">
            <div class="ride-saved" @click="saveRide()">
                <i :class="{ 'ri-bookmark-line': !favorites.includes(ride.id), 'ri-bookmark-fill': favorites.includes(ride.id)}"></i>
            </div>
            <img :src="imgSrc" @error="onImgError">
        </div>
        <div class="ride-infos">
            <p class="small">{{ ride.entityType.toLowerCase() }}</p>
            <h4>{{ ride.name }}</h4>
        </div>
        <div class="ride-card-wait">
            <div class="ride-card-info outline">
                <i class="ri-map-pin-2-line"></i>
                <p>{{ ride.park }}</p>
            </div>
        </div>
        <div class="ride-card-wait" v-if="ride.entityType == 'ATTRACTION' && ride.status == 'OPERATING'">
            <div class="ride-card-info">
                <i class="ri-timer-line"></i>
                <p>{{ ride.queue.STANDBY.waitTime }} min</p>
            </div>
            <div class="ride-card-info" v-if="ride.queue.SINGLE_RIDER">
                <i class="ri-user-received-line"></i>
                <p>{{ ride.queue.SINGLE_RIDER.waitTime }} min</p>
            </div>
            <div class="ride-card-info" v-if="ride.walkingTime <= 30">
                <i class="ri-walk-line"></i>
                <p>{{ ride.walkingTime }} min</p>
            </div>
        </div>
        <div class="ride-card-wait" v-if="ride.status == 'DOWN'">
            <div class="ride-card-info down">
                <i class="ri-close-line"></i>
                <p><strong>This ride is currently DOWN</strong></p>
            </div>
        </div>
        <div class="ride-card-wait" v-if="ride.status == 'CLOSED'">
            <div class="ride-card-info closed">
                <i class="ri-close-line"></i>
                <p><strong>This ride is currently closed.</strong></p>
            </div>
        </div>

        <div class="ride-card-wait" v-if="ride.entityType == 'SHOW' && upcomingStartTimes.length != 0">
            <div class="ride-card-info" v-if="ride.walkingTime <= 30">
                <i class="ri-walk-line"></i>
                <p>{{ ride.walkingTime }} min</p>
            </div>
            <div class="ride-card-info" v-for="showTime in upcomingStartTimes">
                <i class="ri-calendar-line"></i>
                <p>{{ new Date(showTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }) }}</p>
            </div>
        </div>
        <div v-if="ride.entityType == 'SHOW' && upcomingStartTimes.length == 0">
            <p>There are no more performances of this show today</p>
        </div>

        <div class="ride-fastpass" v-if="ride.queue?.PAID_RETURN_TIME">
            <div class="fastpass-title">
                <h5>Fast Pass</h5>
                <p class="small" style="font-style: italic;">
                    Please note that you can't buy fast pass here. Please use the official app to do so.
                </p>
            </div>
            <div class="fastpass-container" v-if="ride.queue.PAID_RETURN_TIME?.state == 'AVAILABLE'">
                <p><strong>Price :</strong> {{ ride.queue.PAID_RETURN_TIME?.price?.formatted }}</p>
                <p><strong>Time :</strong> between 
                    {{ ride.queue.PAID_RETURN_TIME?.returnStart ? new Date(ride.queue.PAID_RETURN_TIME.returnStart).toTimeString().slice(0,5) : '' }} 
                    and 
                    {{ ride.queue.PAID_RETURN_TIME?.returnEnd ? new Date(ride.queue.PAID_RETURN_TIME.returnEnd).toTimeString().slice(0,5) : '' }}
                </p>
            </div>
            <div v-else>
                <p>There are no more FastPasses for this attraction today.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { data, startAutoRefresh, isLoading, error } from '/composables/useData'
import { useFavorites } from '/composables/useFavorites'
import { liveData } from '/composables/useLiveData'

const { favorites, toggleFavorite, isFavorite } = useFavorites()

const route = useRoute()
const rideId = route.params.id

const ride = computed(() => {
    if (!data.value) return null
    return data.value.find(r => r.id.toString() === rideId.toString())
})

const imgSrc = ref('')

const setImgSrc = (name, rideObj) => {
    const url = `/img/disney/${name.replace(/[\s]+/g, "_").replace(/['":!*?&]/g, "")}.jpg`
    const img = new Image()
    img.onload = () => { imgSrc.value = url }
    img.onerror = () => {
        imgSrc.value = rideObj.entityType === "ATTRACTION" 
            ? "/img/default/default_ride.png" 
            : "/img/default/default_show.png"
    }
    img.src = url
}

const onImgError = (event) => {
    if (!ride.value) return
    imgSrc.value = ride.value.entityType === "ATTRACTION" 
        ? "/img/default/default_ride.png" 
        : "/img/default/default_show.png"
}

watch(() => ride.value, (nride) => {
  if (!nride) return
  const imgName = nride.name.replace(/[^a-zA-Z0-9_]/g, "_")
  setImgSrc(imgName, nride)
}, { immediate: true })

const upcomingStartTimes = computed(() => {
    if (liveData.value) {
        if (!ride.value?.showtimes) return []

        const now = new Date() // maintenant en UTC+local du navigateur

        return ride.value.showtimes
            .filter(show => new Date(show.startTime) > now) // simple comparaison ISO
            .map(show => show.startTime)
    } else {
        // TODO
        return ride.value.showtimes.map(show => show.startTime)
    }
})

const saveRide = () => {
    toggleFavorite(ride.value.id)
}


</script>

<style scoped>
.img-top {
    position: relative;
    height: 200px;
    margin-bottom: 10px;
}

.img-top img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 15px;
}

.ride-saved {
    background: var(--color-white);
    position: absolute;
    top: 5px;
    right: 5px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    border-radius: 10px;
}

.ride-saved i {
    font-size: 30px;
    cursor: pointer;
}

.ride-infos p {
    text-align: right;
    padding: 5px 0;
}

.ride-card-wait {
    display: flex;
    gap: 10px;
    margin: 10px 0;
    flex-wrap: wrap;
}

.ride-card-info {
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--color-white);
    background: var(--color-blue);
    padding: 5px;
    border-radius: 5px;
}

.ride-card-info.outline {
    background: var(--color-white);
    color: var(--color-black);
    /* border: 1px solid var(--color-black); */
}

.ride-fastpass{
    margin-top: 30px;
}

.fastpass-title {
    margin-bottom: 10px;
}
.fastpass-title p {
    margin-top: 5px;
}

.ride-card-info.down {
    background: var(--color-yellow);
}

.ride-card-info.closed {
    background: var(--color-red);
}
</style>