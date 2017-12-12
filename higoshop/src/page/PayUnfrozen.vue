<template>
  <div style="flex:1;overflow: auto; position: relative;background:#FFF;height:100%;text-align:center;">
    <div class="clear item">
      <div class="float-left">
        解冻手续费
      </div>
      <div>
        {{5 | currency('￥')}}
      </div>
    </div>
    <div style="margin-top:50px;">
      <button class="pay-btn" @click="pay">
        <img src="../assets/24332dfsf.png" alt="">微信支付</button>
    </div>
  </div>
</template>


<script>

export default {
  name: 'payUnfrozen',
  components: {

  },
  data: function () {
    return {}
  },
  methods: {
    jsApiCall: function (jObj) {
      let that = this
      let WeixinJSBridge = window.WeixinJSBridge
      if (WeixinJSBridge) {
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
          'appId': jObj.appId,
          'timeStamp': jObj.timeStamp,
          'nonceStr': jObj.nonceStr,
          'package': 'prepay_id=' + jObj.prepayId,
          'signType': jObj.signType,
          'paySign': jObj.paySign
        },
          function (res) {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              that.$router.push('/login')
            } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
              alert('支付失败：' + res.err_code + ' | ' + res.err_desc)
            }
          })
      }
    },
    pay: function () {
      var para = {
        currOpenId: this.$route.query['currOpenId'],
        money: 0.01
      }
      this.$http.post('activationCode/unfreezeWxpay', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          ...para
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            var jObj = response.data
            if (typeof WeixinJSBridge === undefined) {
              if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false)
              } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', this.jsApiCall)
                document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall)
              }
            } else {
              this.jsApiCall(jObj)
            }
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: response.msg
            })
          }
        })
    }
  },
  created: function () {

  }
}
</script>

<style scoped>
.item {
  margin-top: 20px;
  padding: 10px 20px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.pay-btn {
  padding: 10px 40px;
  font-size: 20px;
  background: #009b4d;
  color: #fff;
  border: none;
  border-radius: 10px;
}

.pay-btn img {
  width: 25px;
  margin-right: 10px;
}
</style>
