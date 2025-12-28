import { ref, watch, computed } from 'vue'
import { data } from './useData'
import { useFavorites } from './useFavorites'
import { useNotifications } from './useNotifications'

export function useRideWatcher() {
    const { favorites } = useFavorites()
    const { showNotif } = useNotifications()

    const favoriteRidesSorted = computed(() => {
        if (!data.value) return [] // <-- protège contre null ou undefined
        const favoriteRides = data.value.filter(r => favorites.value.includes(r.id))
        return favoriteRides
            .map(ride => ({
            ...ride,
            score: (ride.queue?.STANDBY?.waitTime ?? Infinity) + ((ride.walkingTime ?? 0) * 5)
            }))
            .sort((a, b) => a.score - b.score)
    })

    let initialized = false

    watch(data, (newData, oldData) => {
        // Ignore le premier appel au montage
        if (!initialized) {
            initialized = true
            return
        }

        if (!oldData || !oldData.length || !newData || !newData.length) return

        const oldSorted = getFavoriteRidesSorted(oldData)
        const newSorted = getFavoriteRidesSorted(newData)

        if (!oldSorted.length || !newSorted.length) return

        const firstOldRide = oldSorted[0]
        const firstNewRide = newSorted.find(r => r.id === firstOldRide.id)
        if (!firstNewRide) return

        const status = firstNewRide.status || 'OPERATING'

        let notifTitle = ''
        let notifContent = ''

        if (firstNewRide.id != newSorted[0].id && newSorted.length > 0) {
            if (status === 'DOWN' || status === 'CLOSED') {
                notifTitle = `Ride closed or down !`
                notifContent = `The ride ${firstNewRide.name} is closed or down... Please move to ${newSorted[0].name}.`
            } else {
                notifTitle = `Change of planning !`
                notifContent = `Please move now to ${newSorted[0].name}, its wait time is low: ${newSorted[0].queue?.STANDBY?.waitTime ?? 'XX'} minutes.`
            }

            showNotif(notifTitle, notifContent)
        }    

    }, { deep: true, immediate: true })

    return { favoriteRidesSorted }
}

const { favorites } = useFavorites()

function getFavoriteRidesSorted(rides = data.value ?? []) {
    if (!rides) return []
    return rides
        .filter(r => favorites.value.includes(r.id))
        .map(ride => ({
        ...ride,
        score: Math.round((ride.queue?.STANDBY?.waitTime ?? Infinity) + ((ride.walkingTime / 1.75 ?? 0) * 3))
        }))
        .sort((a, b) => a.score - b.score)
}
