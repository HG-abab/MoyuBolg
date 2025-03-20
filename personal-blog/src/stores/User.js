import { defineStore } from 'pinia'
import identicon from 'identicon.js'
import Chance from 'chance'
import Danmaku from 'danmaku-vue'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const username = ref('')
    const useravatar = ref('')
  
    const settoken = (data) => {
      token.value = data
    }

    const setusername = (data) => {
      username.value = data
    }

    const setuseravatar = (data) => {
      useravatar.value = data
    }

    return {
      token,
      username,
      useravatar,
      settoken,
      setusername,
      setuseravatar,
    }
  },
  {
    persist: true,
  }
)
