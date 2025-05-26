<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style>
@font-face {
  font-family: 'AlimamaFangYuanTiVF';
  src: url('//at.alicdn.com/t/webfont_2q0q3q3q3q3q.eot');
  src: url('//at.alicdn.com/t/webfont_2q0q3q3q3q3q.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/webfont_2q0q3q3q3q3q.woff2') format('woff2'),
    url('//at.alicdn.com/t/webfont_2q0q3q3q3q3q.woff') format('woff'),
    url('//at.alicdn.com/t/webfont_2q0q3q3q3q3q.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

:root {
  font-family: 'AlimamaFangYuanTiVF', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}

* {
  font-family: inherit;
}

/* 全局样式 */
html,
body {
  font-family: 'AlimamaFangYuanTiVF', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>