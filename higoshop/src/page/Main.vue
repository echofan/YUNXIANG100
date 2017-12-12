<template>
  <div style="height:100%;">
    <view-box ref="viewBox" body-padding-bottom="50px">
      <router-view></router-view>
      <w-footer></w-footer>
    </view-box>
  </div>
</template>

<script>
import { ViewBox, Tabbar, TabbarItem, Group, Cell } from 'vux'
import WFooter from '@/components/Footer'

export default {
  components: {
    WFooter,
    ViewBox,
    Tabbar,
    TabbarItem,
    Group,
    Cell
  }
}
</script>

<style>
.clear::after {
  display: table;
  content: '';
  clear: both;
}

.float-left {
  float: left;
}

.float-right {
  float: right;
}
</style>
