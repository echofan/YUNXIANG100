<template>
  <div>
    <tabbar style="background: #900874;" icon-class="footer-icon">
      <tabbar-item selected link="/">
        <img slot="icon" src="../assets/home_active.png">
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item link="/commodity/category">
        <img slot="icon" src="../assets/classify_active.png">
        <span slot="label">分类</span>
      </tabbar-item>
      <tabbar-item :badge="$root.$data.cartCount?$root.$data.cartCount+'':''" link="/shoppingbag">
        <img slot="icon" src="../assets/shopping_bag_active.png">
        <span slot="label">购物袋</span>
      </tabbar-item>
      <tabbar-item link="/user/center">
        <img slot="icon" src="../assets/personal_center_active.png">
        <span slot="label">个人中心</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from 'vux'

export default {
  components: {
    Tabbar,
    TabbarItem
  },
  data: function () {
    return {
    }
  },
  methods: {
    getCaritemCount: function () {
      this.$http.post('caritem/getCaritemCount', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          this.$root.$data.cartCount = response.data.cartCount
        })
    }
  },
  created: function () {
    this.getCaritemCount()
  }
}
</script>

<style>
.footer-icon {
  padding: 3px;
}

.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
  color: #fff;
}
</style>
