<template>
  <view-box>
    <img src="../assets/11.jpg" alt="" width="100%" height="100%" style="position:absolute;">
    <div class="main" v-show="!showSetPasswordPage">
      <div>
        <img src="../assets/13123.png" alt="" class="log">
        <p class="title">账户注册</p>
      </div>
      <div class="form">
        <div class="form-input">
          <input type="text" name="phone" v-model="params.loginname" class="phone" placeholder="请输入手机号码">
        </div>
        <div class="form-input">
          <input type="text" name="code" v-model="params.verifyCode" placeholder="请输入验证码">
          <button class="get-code" :disabled="countdown.start" @click="getVerifyCode">
            <span v-show="!countdown.start">获取验证码</span>
            <span v-show="countdown.start">
              <countdown slot="value" v-model="countdown.time" :start="countdown.start" @on-finish="countdownFinish"></countdown>
            </span>
          </button>
        </div>
      </div>
  
      <div>
        <button class="next" @click="toSetPasswordPage">下一步</button>
      </div>
      <div class="agreement">
        我已阅读并同意嗨购注册协议
      </div>
    </div>
    <div class="main password-page" v-show="showSetPasswordPage">
      <div>
        <img src="../assets/13123.png" alt="" class="log">
        <p class="title">设置密码</p>
      </div>
      <div class="form">
        <div class="form-input">
          <input type="password" class="phone" v-model="params.password" placeholder="设置您的6位以上密码">
        </div>
        <div class="form-input">
          <input type="password" v-model="params.repassword" placeholder="请再次输入6位以上密码">
        </div>
      </div>
      <div>
        <button class="next" @click="register">下一步</button>
      </div>
    </div>
  </view-box>
</template>


<script>
import { ViewBox, Group, Cell, Countdown } from 'vux'
export default {
  name: 'registry',
  components: {
    ViewBox, Group, Cell, Countdown
  },
  data: function () {
    return {
      countdown: {
        time: 60,
        start: false
      },
      showSetPasswordPage: false,
      params: {
        loginname: '',
        verifyCode: '',
        password: '',
        openId: '',
        parentId: ''
      }
    }
  },
  methods: {
    toSetPasswordPage: function () {
      if (!this.params.loginname) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请输入手机号'
        })
        return
      } else if (!/^1[34578][0-9]{9}$/.test(this.params.loginname)) {
        this.$vux.toast.show({
          type: 'warn',
          text: '手机号码不合法'
        })
        return
      } else if (!this.params.verifyCode) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请输入验证码'
        })
        return
      }
      this.showSetPasswordPage = true
    },
    countdownFinish: function () {
      this.countdown.time = 60
      this.countdown.start = false
    },
    getVerifyCode: function () {
      if (!this.params.loginname) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请输入手机号'
        })
        return
      } else if (!/^1[34578][0-9]{9}$/.test(this.params.loginname)) {
        this.$vux.toast.show({
          type: 'warn',
          text: '手机号码不合法'
        })
        return
      }
      this.$http.post('member/sendSms', { loginname: this.params.loginname, type: 'register' })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.countdown.start = true
            this.$vux.toast.show({
              text: '验证码已发送'
            })
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: response.msg
            })
          }
        })
    },
    register: function () {
      this.params.openId = this.$route.query.openid
      this.params.parentId = this.$route.query.parentId
      if (!this.params.password) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请输入密码'
        })
        return
      } else if (this.params.password.length < 6) {
        this.$vux.toast.show({
          type: 'warn',
          text: '密码长度至少6位'
        })
        return
      } else if (this.params.password !== this.params.repassword) {
        this.$vux.toast.show({
          type: 'warn',
          text: '两次输入的密码不一致'
        })
        return
      }
      this.$http.post('member/register', null, { params: this.params })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.$vux.toast.show({
              text: '注册成功'
            })
            this.$router.push({ path: '/activateid', query: { memberId: response.data.memberId } })
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: response.msg
            })
          }
        })
    }
  }
}
</script>

<style scoped>
.main {
  position: absolute;
  height: 80%;
  min-height: 80%;
  margin: auto;
  text-align: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
}

.log {
  width: 35%;
}

.title {
  font-size: 24px;
  color: #fff;
}

.form {
  margin-top: 10px;
}

.form-input {
  margin-top: 20px;
}

input {
  background: none;
  width: 80%;
  font-size: 16px;
  border-top: none;
  border-left: none;
  border-right: none;
  color: #cac9cb;
  border-bottom: 1px solid #cac9cb;
  padding: 10px 100px 5px 10px;
  box-sizing: border-box;
  outline: none;
}

.password-page input {
  background: none;
  width: 80%;
  font-size: 16px;
  border-top: none;
  border-left: none;
  border-right: none;
  color: #cac9cb;
  border-bottom: 1px solid #cac9cb;
  padding: 10px 5px 5px 10px;
  outline: none;
}

.get-code {
  width: 100px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  padding: 5px 10px;
  color: #fff;
  background: #ca5599;
  margin-left: -100px;
}

.next {
  font-size: 20px;
  border: none;
  border-radius: 10px;
  padding: 5px 100px;
  margin-top: 50px;
  color: #fff;
  background: #a72184;
}

.agreement {
  margin-top: 20px;
  font-size: 16px;
  color: #fff;
}
</style>

