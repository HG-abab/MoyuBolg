// 页面气泡效果
const bubble = {
  width: 0, // 画布宽度
  height: 0, // 画布高度
  canvas: null, // Canvas元素引用
  ctx: null, // Canvas的2D渲染上下文
  circles: [], // 存储所有气泡实例的数组
  animate: true, // 控制动画是否运行的标志
  requestId: null, // 请求动画帧的ID
}

// 初始化气泡
export const init = function (canvasInstance) {
  if (!bubble || !canvasInstance) throw new Error('no canvasInstance')
  bubble.width = window.innerWidth
  bubble.height = window.innerHeight
  bubble.canvas = canvasInstance //获取canvas实例
  bubble.canvas.width = bubble.width
  bubble.canvas.height = bubble.height
  bubble.ctx = bubble.canvas.getContext('2d')
  // 创建气泡粒子
  bubble.circles = []
  for (let x = 0; x < bubble.width * 0.5; x++) {
    const c = new Circle()
    bubble.circles.push(c)
  }
  animate() // 开始动画循环
  addListeners() // 添加事件监听器
}

// 检查滚动位置并决定是否停止动画
function scrollCheck() {
  bubble.animate = !(document.body.scrollTop > bubble.height)
}

// 调整画布大小以适应窗口尺寸变化
function resize() {
  bubble.width = window.innerWidth
  bubble.height = window.innerHeight
  bubble.canvas.width = bubble.width
  bubble.canvas.height = bubble.height
}

// 动画循环函数
function animate() {
  if (bubble.animate) {
    bubble.ctx.clearRect(0, 0, bubble.width, bubble.height)
    for (const i in bubble.circles) bubble.circles[i].draw()
  }
  bubble.requestId = requestAnimationFrame(animate)
}

// Circle类，代表单个气泡
class Circle {
  pos = {
    // 气泡的位置
    x: Math.random() * bubble.width, // 随机x坐标
    y: bubble.height + Math.random() * 100, // 随机y坐标，初始在画布下方
  }

  alpha = 0.1 + Math.random() * 0.3 // 气泡的透明度
  scale = 0.1 + Math.random() * 0.3 // 气泡的大小比例
  velocity = Math.random() // 气泡的上升速度

  constructor() {
    const r = Math.random() * 255 // 随机红色分量
    const g = Math.random() * 255 // 随机绿色分量
    const b = Math.random() * 255 // 随机蓝色分量
    // 绘制气泡的方法
    this.draw = () => {
      this.pos.y -= this.velocity // 更新y坐标，使气泡上升
      this.alpha -= 0.0005 // 逐渐减少透明度，使气泡消失
      bubble.ctx.beginPath() // 开始绘制路径
      bubble.ctx.arc(this.pos.x, this.pos.y, this.scale * 10, 0, 2 * Math.PI, false) // 绘制圆形
      bubble.ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha})` // 设置填充样式
      bubble.ctx.fill() // 填充圆形
    }
  }
}

// 添加事件监听器
function addListeners() {
  window.addEventListener('scroll', scrollCheck)
  window.addEventListener('resize', resize)
}

// 移除事件监听器并取消动画帧请求
export function removeListeners() {
  window.removeEventListener('scroll', scrollCheck)
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(bubble.requestId)
}

export default {
  init,
  removeListeners,
}
