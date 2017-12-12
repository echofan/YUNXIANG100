<template>
  <div style="flex:1;overflow: auto; position: relative;height:100%;">
    <w-user-header :user="user"></w-user-header>
    <div style="padding:20px 20px;" class="flex-row">
      <div class="flex-avg">
        <p>收益总额</p>
        <p>{{income.allAward | currency('￥')}}</p>
      </div>
      <div class="flex-avg">
        <p>未提现收益</p>
        <p>{{income.amount | currency('￥')}}</p>
      </div>
      <div class="flex-avg">
        <p>已提现收益</p>
        <p>{{income.withdrawAmount | currency('￥')}}</p>
      </div>
    </div>
    <div class="withdraw">
      <button class="btn btn-normal" @click="showAutoPasswordInput = true">自动提现</button>
      <p>10-400收益自动提现将直接提现到关联微信钱包</p>
    </div>
    <div class="withdraw">
      <div class="money">提现金额
        <input type="number" min="200" max="100000" v-model="params.amount">
      </div>
      <button class="btn btn-normal" @click="toInputPassword">手动提现</button>
      <p>400以上收益提现将审核后支付到支付宝或银行卡</p>
    </div>
    <div class="withdraw">
      <button class="btn btn-history" @click="toWithdrawCashList">提现历史</button>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showPasswordInput" class="dialog" :on-hide="clear" :hide-on-blur="true">
        <div class="dialog-item" style="padding-top:20px;">
          <p>请输入提现密码</p>
        </div>
        <div class="dialog-item">
          <input type="password" v-model="params.password" class="password">
        </div>
        <div class="dialog-item" style="padding-bottom:20px;">
          <button class="pay-btn" @click="withdrawCash">确定</button>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showAutoPasswordInput" class="auto-dialog" :on-hide="clear" :hide-on-blur="true">
        <div class="dialog-item" style="padding-top:20px;">
          <p>请输入提现密码</p>
        </div>
        <div class="dialog-item">
          <input type="password" v-model="params.password" class="password">
        </div>
        <div class="dialog-item" style="padding-bottom:20px;">
          <button class="pay-btn" @click="pay">确定</button>
        </div>
      </x-dialog>
    </div>
  </div>
</template>


<script>
import WUserHeader from '@/components/UserHeader'
import { XDialog, Loading, TransferDomDirective as TransferDom } from 'vux'

export default {
  name: 'withdrawCash',
  directives: {
    TransferDom
  },
  components: {
    WUserHeader,
    XDialog,
    Loading
  },
  data: function () {
    return {
      user: {},
      showPasswordInput: false,
      showAutoPasswordInput: false,
      income: {},
      params: {}
    }
  },
  methods: {
    toInputPassword: function () {
      if (this.params.amount > 0) {
        this.showPasswordInput = true
      } else {
        this.$vux.toast.show({ type: 'warn', text: '请输入提现金额' })
      }
    },
    toWithdrawCashList: function () {
      this.$router.push('/user/withdrawcashlist')
    },
    withdrawCash: function () {
      if (this.params.password) {
        this.$http.post('member/handWithDraw', null, {
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
              this.getWithDrawInfo()
              this.showPasswordInput = false
              this.params = {}
              this.$vux.toast.show({ text: '提现申请已提交' })
            } else if (response.code === 3) {
              this.$router.push('/user/payinfo')
              this.$vux.toast.show({ type: 'warn', text: response.msg })
            } else {
              this.$vux.toast.show({ type: 'warn', text: response.msg })
            }
          })
      } else {
        this.$vux.toast.show({ type: 'warn', text: '请输入密码' })
      }
    },
    pay: function () {
      var para = {
        currOpenId: this.$route.query['currOpenId'],
        password: this.params.password,
        amount: 1
      }
      this.$vux.loading.show({
        text: 'Loading'
      })
      this.$http.post('member/autoWithDraw', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          ...para
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          this.$vux.loading.hide()
          if (response.code === 0) {
            this.getWithDrawInfo()
            this.showAutoPasswordInput = false
            this.params = {}
            this.$vux.toast.show({ text: '提现成功' })
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: response.msg
            })
          }
        })
    },
    getWithDrawInfo: function () {
      this.$http.get('member/getWithDrawInfo', {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.income = response.data
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: response.msg
            })
          }
        })
    },
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
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  },
  created: function () {
    this.getMyInfo()
    this.getWithDrawInfo()
  }
}
</script>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  text-align: center;
}

.flex-avg {
  position: relative;
  flex: 1;
  font-size: 16px;
}

.flex-avg img {
  height: 30px;
}

.withdraw {
  text-align: center;
}

.withdraw p {
  margin-top: 3px;
  font-size: 12px;
}

.withdraw .money {
  margin-top: 20px;
  padding: 10px 0;
}

.withdraw .money input {
  width: 100px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  outline: none;
}

.btn {
  display: block;
  text-align: center;
  background: none;
  margin: 0 auto;
  border: none;
  border-radius: 10px;
  color: #FFF;
}

.btn.btn-normal {
  font-size: 16px;
  background: #a72184;
  width: 60%;
  padding: 6px 20px;
}

.btn.btn-history {
  font-size: 16px;
  margin-top: 30px;
  width: 60%;
  padding: 6px 20px;
  background: #999;
}

.dialog-item {
  padding: 5px 0;
}

.pay-btn {
  width: 60%;
  padding: 5px 40px;
  font-size: 16px;
  background: #009b4d;
  color: #fff;
  border: none;
  border-radius: 5px;
}

.password {
  outline: none;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
