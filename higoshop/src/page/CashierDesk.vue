<!--收银台 -->
<template>
  <div style="flex:1;overflow: auto; position: relative;background:#FFF;height:100%;">
    <div class="clear item">
      <div class="float-left">
        时&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;间
      </div>
      <div v-text="order.createTime">
      </div>
    </div>
    <div class="clear item">
      <div class="float-left">
        订单编号
      </div>
      <div v-text="order.orderNum">
      </div>
    </div>
    <div class="clear item">
      <div class="float-left">
        订单金额
      </div>
      <div>
        {{order.goodsNum}}件商品总计金额{{order.totalPrice | currency('￥')}}
      </div>
    </div>
    <div style="margin-top:50px;text-align:center;">
      <button class="pay-btn" @click="pay">
        <img src="../assets/24332dfsf.png" alt="">微信支付</button>
    </div>
  </div>
</template>


<script>
export default {
  name: 'payPublish',
  components: {

  },
  data: function () {
    return {
      order: {}
    }
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
              that.$router.push('/user/waitforsend')
            } else if (res.err_msg === 'get_brand_wcpay_request:fail') {
              alert('支付失败：' + res.err_code + ' | ' + res.err_desc)
            }
          })
      }
    },
    pay: function () {
      var para = {
        currOpenId: this.$route.query['currOpenId'],
        orderGoodsId: this.$route.query['orderGoodsId'],
        money: this.order.totalPrice
      }
      this.$http.post('ordergoods/wxpay', null, {
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
    this.$http.post('ordergoods/goodsOrderDetail', null, {
      params: {
        memberId: this.$cookie.get('memberId'),
        token: this.$cookie.get('token'),
        orderGoodsId: this.$route.query.orderGoodsId
      }
    })
      .then(response => {
        return response.data
      }).then(response => {
        if (response.code === 0) {
          this.order = response.data
        } else {
          this.$vux.toast.show({ type: 'warn', text: response.msg })
        }
      })
  }
}
</script>

<style scoped>
.item {
  font-size: 16px;
  text-align: center;
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
