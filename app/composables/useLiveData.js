import { ref } from 'vue'

export const liveData = ref(true)

export function changeLiveData(state) {
    liveData.value = state
}
