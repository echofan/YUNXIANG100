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
    <div class="table-wrap">
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>账户</th>
            <th>方式</th>
            <th>金额</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody v-if="withDrawList.length>0">
          <tr v-for="l in withDrawList" :key="l.id">
            <td class="date" v-text="dateFormat(new Date(l.opAt*1000),'YYYY-MM-DD HH.mm')">2017-4-29 10.59</td>
            <td>
              <div v-text="l.accountNumber" class="account-number">
              </div>
            </td>
            <td v-text="l.accountName" class="account-name">微信</td>
            <td v-text="l.amount" class="amount">92</td>
            <td>
              <span v-if="l.status === 'Y'" style="color:#158f50;">到账</span>
              <span v-if="l.status !== 'Y'" style="color:#af415e;">等待</span>
            </td>
          </tr>
        </tbody>
        <tbody v-if="withDrawList.length === 0">
          <tr>
            <td colspan="5">无提现历史</td>
          </tr>
        </tbody>
      </table>
    </div>
  
  </div>
</template>


<script>
import WUserHeader from '@/components/UserHeader'
import { dateFormat } from 'vux'

export default {
  name: 'userCenter',
  components: {
    WUserHeader
  },
  data: function () {
    return {
      user: {

      },
      withDrawList: [],
      income: {
        total: 12000,
        withdrawCash: 2000,
        notWithdrawCash: 10000
      }
    }
  },
  methods: {
    dateFormat,
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
    getWithDrawList: function () {
      this.$http.post('member/withDrawList', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.withDrawList = response.data
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  },
  created: function () {
    this.getMyInfo()
    this.getWithDrawInfo()
    this.getWithDrawList()
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

.table-wrap {
  padding: 0 10px;
}

.table {
  width: 100%;
  text-align: center;
  font-size: 14px;
  border-collapse: collapse;
}

.table thead tr {
  height: 25px;
  background: #fff;
}

thead tr th {
  font-weight: normal;
}

.table tbody {
  font-size: 12px;
}

.table tbody tr {
  height: 50px;
  padding: 10px;
}

tbody tr .date {
  width: 80px;
}

tbody tr td {
  position: relative;
  text-align: center;
}

tbody tr .account-number {
  width: 100px;
  word-wrap: break-word;
}

.table tbody tr:nth-child(odd) {
  background: #eee;
}

.table tbody tr:nth-child(even) {
  background: #ccc;
}
</style>
