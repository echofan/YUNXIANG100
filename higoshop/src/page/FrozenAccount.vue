<template>
  <div class="page">
    <div>
      <img src="../assets/20170725230419.png" alt="" width="70%">
    </div>
    <div class="time">
      <div>失效时间</div>
      <div>
        <span style="font-size:30px;" v-text="countTime && countTime.hours"></span>
        <span>小时</span>
        <span style="font-size:30px;" v-text="countTime && countTime.minutes"></span>
        <span>分</span>
        <span style="font-size:30px;" v-text="countTime && countTime.second"></span>
        <span>秒</span>
      </div>
      <div>
        <button class="btn" @click="toUnfreezePage">重新激活</button>
      </div>
    </div>
    <div class="bottom">
      <p>说明：</p>
      <p>1.本状态是在贵账户购物有效期内，未能购物导致本账户暂时性冻结</p>
      <p>2.如果在冻结有限时间内未能重新激活账户，本账户将永久失效不可恢复</p>
      <p>3.重新激活需支付50元激活费，请珍惜创业机会</p>
    </div>
  </div>
</template>


<script>
export default {
  name: 'frozenAccount',
  components: {

  },
  data: function () {
    return {
      user: {},
      shareUrl: '',
      frozen: { time: 0 }
    }
  },
  computed: {
    countTime: function () {
      let hours = parseInt(this.frozen.time / 1000 / 3600)
      let minutes = Math.floor(this.frozen.time / 60000) % 60
      let second = Math.floor(this.frozen.time / 1000) % 60
      return {
        hours,
        minutes,
        second
      }
    }
  },
  methods: {
    toUnfreezePage: function () {
      location.href = '/higo/open/api/activationCode/toUnfreezePage?memberId=' + this.$route.query.memberId
    },
    freezeCountDown: function () {
      this.$http.post('activationCode/freezeCountDown', null, {
        params: {
          memberId: this.$route.query.memberId
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            if (response.data.time > 0) {
              this.frozen = response.data
              this.frozen.lastTime = new Date().getTime() + this.frozen.time
              let that = this
              var int = setInterval(function () {
                let time = that.frozen.lastTime - new Date().getTime()
                if (time <= 0) {
                  that.frozen = Object.assign({}, that.frozen, { time: 0 })
                  clearInterval(int)
                } else {
                  that.frozen = Object.assign({}, that.frozen, { time: time })
                }
              }, 1000)
            }
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  },
  created: function () {
    this.freezeCountDown()
  }
}
</script>

<style scoped>
.page {
  flex: 1;
  overflow: auto;
  position: relative;
  height: 100%;
  text-align: center;
}

.time {
  color: #a72184;
  font-size: 12px;
}

.bottom {
  padding: 10px 20px;
  text-align: left;
  font-size: 12px;
}

.btn {
  font-size: 20px;
  border: none;
  border-radius: 10px;
  padding: 5px 100px;
  margin-top: 20px;
  color: #fff;
  background: #a72184;
}
</style>
