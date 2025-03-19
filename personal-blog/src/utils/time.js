import { ref, onMounted } from 'vue'

export default function useCurrentDateTime() {
  const date = ref('')
  const weekday = ref('')
  const time = ref('')

  // 获取当前日期
  const getCurrentDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    date.value = `${year}-${month}-${day}`
  }

  // 获取当前星期
  const getWeekday = () => {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const now = new Date()
    weekday.value = weekdays[now.getDay()]
  }

  // 获取当前时间
  const getTime = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    time.value = `${hours}:${minutes}:${seconds}`
  }

  // 每秒更新一次时间
  setInterval(getTime, 1000)

  // 初始化日期和星期
  onMounted(() => {
    getCurrentDate()
    getWeekday()
  })

  return { date, weekday, time }
}
