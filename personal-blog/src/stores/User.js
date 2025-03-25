import { defineStore } from 'pinia'
import identicon from 'identicon.js'
import Chance from 'chance'
import Danmaku from 'danmaku-vue'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const userId = ref('')
    const token = ref('')
    const username = ref('')
    const useravatar = ref('')

    const setUserId = (data) => {
      userId.value = data
    }
  
    const settoken = (data) => {
      token.value = data
    }

    const setusername = (data) => {
      username.value = data
    }

    const setuseravatar = (data) => {
      useravatar.value = data
    }

    const removeUserInfo = () => {
      userId.value = ''
      token.value = ''
      username.value = ''
      useravatar.value = ''
    }

    return {
      userId,
      token,
      username,
      useravatar,
      setUserId,
      settoken,
      setusername,
      setuseravatar,
      removeUserInfo
    }
  },
  {
    persist: true,
  }
)
