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
    <div class="store-info">
      <div class="next-differ">您距离下一级还差{{level.needPoints}}数据流</div>
      <div class="next-grade">
        <span>下一等级</span>
        <span v-text="level.nextLevel">5</span>
        <img :src="level.logo" alt="" width="70px">
      </div>
      <div class="data">
        <img src="../assets/1325532.png" alt="" width="20px" style="margin-top:-4px;">
        <span>数据</span>
        <span v-text="level.point">60</span>
      </div>
      <div class="earnings">
        <img src="../assets/34ser43sf.png" alt="" width="20px" style="margin-top:-4px;">
        <span>收益</span>
        <span v-text="level.award">500</span>
      </div>
    </div>
  
  </div>
</template>


<script>
import WUserHeader from '@/components/UserHeader'
import { Flexbox, FlexboxItem } from 'vux'

export default {
  name: 'userCenter',
  components: {
    WUserHeader,
    Flexbox,
    FlexboxItem
  },
  data: function () {
    return {
      user: {},
      income: {
        total: 12000,
        withdrawCash: 2000,
        notWithdrawCash: 10000
      },
      level: {
        award: 0,
        logo: '',
        needPoints: 0,
        point: 0
      }
    }
  },
  methods: {
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
    },
    getNextLevel: function () {
      this.$http.get('member/getNextLevel', {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.level = response.data
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  },
  created: function () {
    this.getMyInfo()
    this.getWithDrawInfo()
    this.getNextLevel()
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

.store-info img {
  vertical-align: middle;
}

.store-info div {
  padding: 10px 10px;
  color: #fff;
  font-size: 14px;
  text-align: center;
}

.store-info>.next-differ {
  font-size: 16px;
  color: #000;
}

.next-grade {
  background: #ed7020
}

.data {
  background: #f7ae45;
}


.earnings {
  background: #56a9b7;
}
</style>
