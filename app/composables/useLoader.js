import { ref } from 'vue'

export const loader = ref(false)

export function displayLoader(state) {
    loader.value = state
}