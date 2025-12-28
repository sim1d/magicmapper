import { ref } from 'vue'

export const nextDataReload = ref(0)

export function resetNextDataReload(v) {
    nextDataReload.value = v
}

export function startNextDataReload () {
    setInterval(() => {
        if (nextDataReload.value > 0) {
            nextDataReload.value -= 1
        }
    }, 1000)
}