import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const userToken = ref('')
    const userName = ref('')
  const userAvatar = ref('')
  
  const setUserToken = (token) => {
    userToken.value = token
  }

  const setUserName = (name) => {
    userName.value = name
  }

  const setUserAvatar = (avatar) => {
    userAvatar.value = avatar
  }

  const clearUser = () => {
    userToken.value = ''
    userName.value = ''
    userAvatar.value = ''
  }
  

  return {
    userToken,
    userName,
    userAvatar,
    setUserToken,
    setUserName,
    setUserAvatar,
    clearUser
  }
}, {
    persist: true
})