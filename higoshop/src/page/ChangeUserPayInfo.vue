<template>
  <div style="flex:1;overflow: auto; position: relative;background:#eee;height:100%;">
    <w-user-header :user="user"></w-user-header>
    <div class="list">
      <!-- <div class="list-item">
                                        <label for="name">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;城市</label>
                                        <input type="text" placeholder="请输入收件人城市">
                                      </div> -->
      <div class="list-item">
        <label for="name">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;实名</label>
        <input type="text" :disabled="user.fillFlag" v-model="params.realname" placeholder="请输入您的真实姓名">
      </div>
      <!-- <div class="list-item">
                                          <label for="name">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;银行</label>
                                          <input type="text" placeholder="请输入您的转账银行">
                                        </div>
                                        <div class="list-item">
                                          <label for="name">&nbsp;&nbsp;&nbsp;银卡号</label>
                                          <input type="text" placeholder="请输入您的银行卡卡号">
                                        </div> -->
      <div class="list-item">
        <label for="name">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;手机</label>
        <input type="text" :disabled="user.fillFlag" v-model="params.phone" placeholder="请输入您的手机号码">
      </div>
      <div class="list-item">
        <label for="name">&nbsp;&nbsp;&nbsp;身份证</label>
        <input type="text" :disabled="user.fillFlag" v-model="params.idCard" placeholder="请输入您的身份证号码">
      </div>
      <div class="list-item">
        <label for="name">&nbsp;&nbsp;&nbsp;支付宝</label>
        <input type="text" :disabled="user.fillFlag" v-model="params.alipayAccount" placeholder="请输入您的支付宝账户">
      </div>
    </div>
    <div class="list">
      <div class="list-item">
        <label for="name">提现密码</label>
        <input type="password" :disabled="user.fillFlag" v-model="params.payPassword" placeholder="请输入您的提现密码">
      </div>
      <div class="list-item">
        <label for="name">再次输入</label>
        <input type="password" :disabled="user.fillFlag" v-model="params.confirmPayPassword" placeholder="请再次输入您的提现密码">
      </div>
    </div>
    <div class="operate">
      <div>
        <button v-if="!user.fillFlag" class="btn save" @click="updateUserInfo">确认</button>
        <p>注：以上信息请认真填写，确认后将只能通过客服渠道修改</p>
      </div>
    </div>
  
  </div>
</template>


<script>
import WUserHeader from '@/components/UserHeader'

export default {
  name: 'myPublishID',
  components: {
    WUserHeader
  },
  data: function () {
    return {
      user: {

      },
      params: {
        realname: '',
        phone: '',
        idCard: '',
        alipayAccount: '',
        confirmPayPassword: '',
        payPassword: ''
      }
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
            this.params = {
              realname: this.user.realname,
              phone: this.user.phone,
              alipayAccount: this.user.alipayAccount,
              idCard: this.user.idCard,
              confirmPayPassword: '',
              payPassword: ''
            }
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    },
    updateUserInfo: function () {
      if (!this.params.realname) {
        this.$vux.toast.show({ type: 'warn', text: '姓名不能为空' })
        return
      } else if (!this.params.phone) {
        this.$vux.toast.show({ type: 'warn', text: '手机不能为空' })
        return
      } else if (!this.params.idCard) {
        this.$vux.toast.show({ type: 'warn', text: '身份证不能为空' })
        return
      } else if (!this.params.alipayAccount) {
        this.$vux.toast.show({ type: 'warn', text: '支付宝账号不能为空' })
        return
      } else if (!this.params.payPassword) {
        this.$vux.toast.show({ type: 'warn', text: '密码不能为空' })
        return
      } else if (this.params.payPassword !== this.params.confirmPayPassword) {
        this.$vux.toast.show({ type: 'warn', text: '两次输入的密码不一致' })
        return
      }

      this.$http.post('member/fullMyInfo', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          ...this.params
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.$vux.toast.show({ text: '保存成功' })
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
.list {
  background: #FFF;
  margin-top: 20px;
}

.list-item {
  padding: 0px 10px;
  font-size: 14px;
  border-top: 1px solid #eee;
}

.list-item input {
  font-size: 14px;
  width: 160px;
  padding: 10px;
  border: none;
  outline: none;
  background: #FFF;
}

.operate {
  text-align: center;
  padding: 30px 0;
}

.operate p {
  font-size: 12px;
}

.btn {
  vertical-align: middle;
  background: none;
  border: none;
  border-radius: 10px;
  color: #FFF;
}

.btn.save {
  background: #a72184;
  width: 200px;
  padding: 10px 20px;
}
</style>
