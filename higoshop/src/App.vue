<template>
  <div id="app" style="height:100%;">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

div {
  box-sizing: border-box;
}

body {
  background-color: #fbf9fe;
}

a {
  text-decoration: none;
  color: inherit;
}

.weui-toast {
  z-index: 5001 !important;
}
</style>
