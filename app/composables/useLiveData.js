import { ref } from 'vue'

export const liveData = ref(false)

export function changeLiveData(state) {
    liveData.value = state
}