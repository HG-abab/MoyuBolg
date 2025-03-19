const DISTANCE = 120
const DURATION = 2000
const animationMap = new WeakMap() //不使用map避免内存泄漏
const ob = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      // entry.target.getAnimations()[0].play() // 这个方法可以获取所有的动画
      const animation = animationMap.get(entry.target)
      animation.play()
      ob.unobserve(entry.target)
    }
  }
})

function isBelowViewport(el) {
  //判断是否在视口下方
  const rect = el.getBoundingClientRect()
  return rect.top > window.innerHeight
}

export default {
  mounted(el, binding) {
    if (!isBelowViewport(el)) {
      return
    }
    const animation = el.animate(
      [
        {
          transform: `translateY(${DISTANCE}px)`,
          opacity: 0.2,
        },
        {
          transform: 'translateY(0)',
          opacity: 1,
        },
      ],
      {
        duration: binding.arg || DURATION,
        easing: 'ease',
      }
    )
    // animation.pause();
    animationMap.set(el, animation)
    ob.observe(el)
  },
  unmounted(el) {
    //卸载时候取消监听
    ob.unobserve(el)
  },
}
