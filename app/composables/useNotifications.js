import { ref } from 'vue'

const notif = ref(false)
const notifTitle = ref('')
const notifMessage = ref('')

export const useNotifications = () => {

    const showNotif = (title = '', message = '') => {
        if (title != '' && message != '' && notif.value == false) {
            notifTitle.value = title
            notifMessage.value = message

            notif.value = true

            setTimeout(() => {
                notif.value = "disable"

                setTimeout(() => {
                    notif.value = false
                }, 1000)
                
            }, 8000)

        }
    }

    return { notif, notifTitle, notifMessage, showNotif }
}