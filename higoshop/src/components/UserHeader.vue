<template>
  <div class="header">
    <div class="content clear">
      <div class="avatar" @click="toChangeInfo">
        <img v-if="user.headImg" :src="user.headImg" alt="">
        <img v-if="!user.headImg" src="../assets/12353.png" alt="">
      </div>
      <div class="info">
        <div class="clear">
          <span class="float-left" style="margin-top:5px;" v-text="user.nickname">昵称：我爱购物狂</span>
          <span class="float-right" style="margin-top:5px;">编组：{{user.activeGroup}}</span>
        </div>
        <div class="clear" style="text-align:center;">
          <div class="float-left logo">
            <img :src="user.memberLevel && user.memberLevel.logo" alt="" width="100%">
          </div>
          <span class="trend">
            <img src="../assets/1325532.png" alt="">
            <span v-text="user.memberAccout?user.memberAccout.point:0">12000000</span>
          </span>
          <div class="float-right arrow" v-if="$route.path !== '/user/payinfo'">
            <router-link to="/user/payinfo">
              <img src="../assets/ewrfsdfs.png" alt="">
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'userHeader',
  props: ['user'],
  data: function () {
    return {
      msg: ''
    }
  },
  methods: {
    toChangeInfo: function () {
      this.$router.push('/user/info')
    }
  }
}
</script>

<style scoped>
.header {
  position: relative;
  background: url(../assets/wersfdsd.png) repeat center center;
  background-size: cover;
  width: 100%;
  color: #fff;
  font-size: 16px;
}

.header .background-img {
  position: absolute;
  width: 100%;
  height: 89px;
  z-index: 0;
}

.header .content {
  position: relative;
  padding: 20px 15px;
  font-size: 14px;
  vertical-align: middle;
  z-index: 1;
}

.header .content .avatar {
  position: absolute;
  width: 55px;
  height: 55px;
  padding: 3px;
  margin: auto 0;
  background: #fff;
  border-radius: 5px;
  top: 0;
  bottom: 0;
  z-index: 1;
}

.header .content .avatar img {
  width: 100%;
  height: 100%;
}

.header .content .info {
  padding-left: 65px;
}

.header .content .info .trend {
  float: left;
  margin-left: 10px;
  font-size: 14px;
}

.header .content .info .trend img {
  margin-top: 8px;
  height: 20px;
}

.header .content .info .arrow img {
  margin-top: 8px;
  height: 20px;
}


.header .logo {
  margin-top: 10px;
  width: 25%;
}
</style>

