<template>
  <view-box>
    <img src="../assets/11.jpg" alt="" width="100%" height="100%" style="position:absolute;">
    <div class="main">
      <div>
        <img src="../assets/13123.png" alt="" class="log">
      </div>
      <div class="form">
        <div class="form-input">
          <label for="phone">账户</label>
          <input type="text" name="phone" class="phone" v-model="params.loginname" placeholder="请输入手机号码">
        </div>
        <div class="form-input">
          <label for="password">密码</label>
          <input type="password" name="password" v-model="params.password" placeholder="请输入密码">
        </div>
        <div class="">
          <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <p class="rememberPassword">
            <input type="checkbox" name="rememberPassword" v-model="rememberPassword">记住密码
          </p>
        </div>
      </div>
      <div>
        <button class="login-btn" @click="login">登录</button>
      </div>
      <div style="margin-top:30px;padding:10px;">
        <a href="/registry" class="link">没有账户我要注册》</a>
      </div>
      <hr>
      <div style="margin-top:20px;display:flex;">
        <a href="javascript:void(0);" @click="wxLogin()" class="link" style="flex:1;">
          <img src="../assets/3rfsefwe.png" height="20" alt="">&nbsp;微信登陆
        </a>
        <a href="/forgetpassword" class="link" style="flex:1;">忘记密码？</a>
      </div>
    </div>
  </view-box>
</template>

<script>
import { ViewBox, Group, Cell } from 'vux'
export default {
  name: 'login',
  components: {
    ViewBox,
    Group,
    Cell
  },
  data: function () {
    return {
      params: {
        loginname: '',
        password: ''
      },
      rememberPassword: false
    }
  },
  methods: {
    login: function () {
      if (!this.params.loginname) {
        this.$vux.toast.show({ type: 'warn', text: '请输入手机号码' })
        return
      } else if (!this.params.password) {
        this.$vux.toast.show({ type: 'warn', text: '请输入密码' })
        return
      }
      this.$http.post('member/login', null, { params: this.params })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.$cookie.set('memberId', response.data.memberId, { expires: '1D' })
            this.$cookie.set('token', response.data.token, { expires: '1D' })
            if (this.rememberPassword) {
              this.$cookie.set('loginname', this.params.loginname, { expires: '1M' })
              this.$cookie.set('password', this.params.password, { expires: '1M' })
            }
            if (this.$root.$data.pageCount === 1) {
              this.$router.push('/')
            } else {
              this.$router.go(-1)
            }
          } else if (response.code === 3) {
            /* 用户已失效 */
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          } else if (response.code === 4) {
            /* 用户还未激活 */
            this.$vux.toast.show({ type: 'warn', text: response.msg })
            this.$router.push({ path: '/activateid', query: { memberId: response.data.memberId } })
          } else if (response.code === 5) {
            /* 用户已被冻结 */
            this.$vux.toast.show({ type: 'warn', text: response.msg })
            this.$router.push({ path: '/frozenaccount', query: { memberId: response.data.memberId } })
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    },
    wxLogin: function () {
      this.$http.get('member/getWxLoginUrl')
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            location.href = response.data.url
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  },
  created: function () {
    this.params.loginname = this.$cookie.get('loginname')
    this.params.password = this.$cookie.get('password')
  }
}
</script>

<style scoped>
.main {
  z-index: 2;
  height: 80%;
  min-height: 80%;
  position: absolute;
  margin: auto;
  text-align: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
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

.form-input>label {
  color: #f5e9ed;
}

.form-input input {
  background: none;
  width: 200px;
  font-size: 16px;
  border-top: none;
  border-left: none;
  border-right: none;
  color: #cac9cb;
  border-bottom: 1px solid #cac9cb;
  padding: 10px 10px 5px 10px;
  box-sizing: border-box;
  outline: none;
}

.rememberPassword {
  position: relative;
  width: 200px;
  display: inline-block;
  text-align: right;
  color: #fff;
  font-size: 14px;
}

.rememberPassword input {
  vertical-align: middle;
  margin-top: -2px;
}

.login-btn {
  font-size: 20px;
  border: none;
  border-radius: 10px;
  padding: 5px 100px;
  margin-top: 30px;
  color: #fff;
  background: #a72184;
}

.link {
  color: #fff;
  text-decoration: none;
}
</style>

