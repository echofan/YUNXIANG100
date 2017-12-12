<template>
  <div class="page">
    <div class="qrcode-wrap">
      <qrcode v-if="user" :value="shareUrl" type="img" size="60"></qrcode>
    </div>
    <div class="bottom">
  
      <p>扫描二维码立即进入嗨GO注册页面，完成注册后可使用（绿色ID号码）激活并成为普通会员</p>
    </div>
  </div>
</template>


<script>
import { Qrcode } from 'vux'

export default {
  name: 'myQrcode',
  components: {
    Qrcode
  },
  data: function () {
    return {
      user: {},
      shareUrl: ''
    }
  },
  methods: {
    getMyInfo: function () {
      this.$http.post('member/getMyInfo', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.user = response.data
            this.shareUrl = location.origin + '/registry'
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  },
  created: function () {
    this.getMyInfo()
  }
}
</script>

<style scoped>
.page {
  flex: 1;
  overflow: auto;
  position: relative;
  background: url(../assets/20170724005225.jpg) repeat center 0;
  background-size: cover;
  height: 100%;
  text-align: center;
}

.qrcode-wrap {
  padding: 20px;
  padding-top: 200px;
}

.bottom {
  padding: 10px 20px;
  color: #fff;
  font-size: 12px;
}
</style>
