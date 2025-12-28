<template>
  <div class="ride-card" @click="handleClick">
    <div class="ride-card-left">
        <img :src="imgSrc" @load="onImageLoaded">
    </div>
    <div class="ride-card-right">
        <div class="ride-card-title">
            <p class="smaller">{{ props.ride.entityType.toLowerCase() }}</p>
            <h6>{{ props.ride.name }}</h6>
        </div>
        <div class="ride-card-wait" v-if="props.ride.entityType == 'ATTRACTION' && props.ride.status == 'OPERATING'">
            <div class="ride-card-info">
                <i class="ri-timer-line"></i>
                <p>{{ props.ride.queue.STANDBY.waitTime }} min</p>
            </div>
            <div class="ride-card-info" v-if="props.ride.walkingTime <= 30">
                <i class="ri-walk-line"></i>
                <p>{{ props.ride.walkingTime }} min</p>
            </div>
            <div class="ride-card-info stars" v-if="props.ride.score <= 80">
                <i class="ri-bard-fill"></i>
            </div>
        </div>
        <div class="ride-card-wait" v-if="props.ride.entityType == 'SHOW' && props.ride.status == 'OPERATING' && nextShowTime">
            <div class="ride-card-info">
                <i class="ri-calendar-line"></i>
                <p>{{ nextShowTime }}</p>
            </div>
            <div class="ride-card-info" v-if="props.ride.walkingTime <= 30">
                <i class="ri-walk-line"></i>
                <p>{{ props.ride.walkingTime }} min</p>
            </div>
        </div>
        <div class="ride-card-wait" v-if="props.ride.status == 'CLOSED' || (props.ride.entityType == 'SHOW' && !nextShowTime)">
            <div class="ride-card-info closed">
                <i class="ri-close-line"></i>
                <p><strong>CLOSED</strong></p>
            </div>
        </div>
        <div class="ride-card-wait" v-if="props.ride.status == 'DOWN'">
            <div class="ride-card-info down">
                <i class="ri-close-line"></i>
                <p><strong>DOWN</strong></p>
            </div>
        </div>
        <div class="ride-card-wait">
            <div class="ride-card-info outline">
                <i class="ri-map-pin-2-line"></i>
                <p>{{ props.ride.park }}</p>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { liveData } from '/composables/useLiveData'

const props = defineProps({
  ride: Object
})

const emit = defineEmits(['click', 'image-loaded'])

const imgSrc = ref('')

const setImgSrc = (name) => {
    const url = `/img/disney/${name}.jpg`
    const img = new Image()
    img.onload = () => { imgSrc.value = url }
    img.onerror = () => {
        imgSrc.value = props.ride.entityType === "ATTRACTION" ? "/img/default/default_ride.png" : "/img/default/default_show.png"
    }
    img.src = url
}

watch(() => props.ride, (ride) => {
  if (!ride) return
  const imgName = ride.name.replace(/ /g, "_")
  setImgSrc(imgName)
}, { immediate: true })


function handleClick() {
    emit('click')
}

const onImgError = (event) => {
    if (props.ride.entityType == "ATTRACTION") {
        imgSrc.value = "/img/default/default_ride.png"
    } else {
        imgSrc.value = "/img/default/default_show.png"
    }
}

const nextShowTime = computed(() => {
    if (liveData.value) {
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
            timeZone: "Europe/Paris"
        }).format(next)
    } else {

        const firstShow = props.ride.showtimes[0]?.startTime
        const firstShowDate = firstShow ? new Date(firstShow) : null

        if (!firstShowDate || isNaN(firstShowDate.getTime())) {
        return null  // ou une valeur par défaut
        }

        return new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Paris"
        }).format(firstShowDate)

    }
})

const onImageLoaded = () => {
    emit('image-loaded')
}
</script>

<style scoped>
.ride-card {
    background: var(--color-white);
    border-radius: 10px;
    height: 120px;
    width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 10px;
    filter: drop-shadow(0px 0px 2px #3a3a3a);
    cursor: pointer;
}

.ride-card-left {
    height: 100%;
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
}

.ride-card-left img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

.ride-card-right {
    flex: 1;
    cursor: pointer;
}

.ride-card-right {
    height: 95%;
    margin-right: 5px;
}

.ride-card-title p {
    text-align: right;
    font-style: italic;
    padding-right: 5px;
}

.ride-card-title h6 {
    display: -webkit-box;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
    margin-bottom: 5px;
    padding-bottom: 0;
}

.ride-card-wait {
    display: flex;
    gap: 10px;
    margin: 10px 0;
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

.ride-card-info i {
    font-size: 1.1rem;
}

.ride-card-info.outline {
    background: var(--color-white);
    color: var(--color-black);
    /* border: 1px solid var(--color-black); */
}

.ride-card-info.closed {
    background: var(--color-red);
}

.ride-card-info.down {
    background: var(--color-yellow);
}

.ride-card-info.stars {
    background: var(--color-yellow);
}
</style>