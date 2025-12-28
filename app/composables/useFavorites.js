import { ref } from 'vue'

const favorites = ref([])

if (process.client) {
    const saved = localStorage.getItem('favorites')
    if (saved) favorites.value = JSON.parse(saved)
}

export function useFavorites() {
    const toggleFavorite = (rideId) => {
        if (favorites.value.includes(rideId)) {
            favorites.value = favorites.value.filter(id => id !== rideId)
        } else {
            favorites.value.push(rideId)
        }
        localStorage.setItem('favorites', JSON.stringify(favorites.value))
    }

    const isFavorite = (rideId) => {
        return favorites.value.includes(rideId)
    }

    return { favorites, toggleFavorite, isFavorite }
}
