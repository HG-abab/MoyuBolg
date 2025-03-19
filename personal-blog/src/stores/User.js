import { defineStore } from 'pinia'
import identicon from 'identicon.js'
import Chance from 'chance'
import Danmaku from 'danmaku-vue'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    const userName = ref('')
    const userAvatar = ref('')

    // 生成用户名和头像的方法
    const generateUserInfo = () => {
      userName.value = generateFixedLengthRandomString(10) // 生成一个随机的用户名
      userAvatar.value = generateAvatar(100) // 生成头像，100px大小
    }

    // 生成头像图片
    const generateAvatar = (size = 24) => {
      const hash = generateFixedLengthRandomString(15)
      const randomColor1 = () => Math.floor(Math.random() * 256)
      const randomColor2 = () => Math.floor(Math.random() * 256)
      const foreground = [randomColor1(), randomColor1(), randomColor1()]
      const background = [randomColor2(), randomColor2(), randomColor2()]

      const data = new identicon(hash, {
        size: size, // Identicon的大小
        foreground: foreground,
        background: background,
        format: 'png', // 图片格式
      }).toString()

      return `data:image/png;base64,${data}`
    }

    // 生成固定长度的随机字符串
    function generateFixedLengthRandomString(length) {
      let result = ''
      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const charactersLength = characters.length

      while (result.length < length) {
        const randomBytes = new Uint8Array(1)
        window.crypto.getRandomValues(randomBytes)
        const randomChar = characters[randomBytes[0] % charactersLength]
        result += randomChar
      }

      return result
    }

    return {
      userName,
      userAvatar,
      generateUserInfo, // 导出生成用户信息的方法
    }
  },
  {
    persist: true,
  }
)
