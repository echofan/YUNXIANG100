<template>
  <div style="height:100%;overflow:auto;">
    <w-user-header :user="user"></w-user-header>
    <div style="padding:10px 20px;background:#eee;font-size:16px;" class="clear">
      <div class="float-left">
        <a href="http://z1-pcok6.kuaishangkf.com/bs/im.htm?cas=112424___903428&fi=114424">
          <img src="../assets/34234.png" alt="" height="21px" style="vertical-align: middle; margin-top: -2px;"> 在线咨询
        </a>
      </div>
      <div class="float-right">
        <router-link to="/user/deliveryaddress">添加收货地址></router-link>
      </div>
    </div>
    <flexbox :gutter="0" class="order-status">
      <flexbox-item>
        <router-link to="/user/waitforpayment">
          <img src="../assets/1.png" alt="">
          <p>待付款</p>
          <badge v-if="numbers.orderNoPaycount" :text="numbers.orderNoPaycount" class="badge">1</badge>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link to="/user/waitforsend">
          <img src="../assets/4.png" alt="">
          <p>待发货</p>
          <badge v-if="numbers.orderNoConsigncount" :text="numbers.orderNoConsigncount" class="badge">1</badge>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link to="/user/waitforreceiving">
          <img src="../assets/3.png" alt="">
          <p>待收货</p>
          <badge v-if="numbers.orderConsigncount" :text="numbers.orderConsigncount" class="badge">1</badge>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link to="/user/finishorderlist">
          <img src="../assets/2.png" alt="">
          <p>已完成</p>
        </router-link>
      </flexbox-item>
    </flexbox>
    <group class="group-wrap">
      <cell title="ID交易大厅" is-link link="/iddating">
        <img slot="icon" width="22" style="display:block;" src="../assets/5454.png" alt="">
      </cell>
      <cell title="店铺详情" is-link link="/user/storedata">
        <img slot="icon" width="22" style="display:block;" src="../assets/12353.png" alt="">
      </cell>
      <cell title="团队详情" is-link link="/user/teaminfo">
        <img slot="icon" width="22" style="display:block;" src="../assets/324sf32.png" alt="">
      </cell>
      <cell title="收益提现" is-link :link="withcashUrl">
        <img slot="icon" width="22" style="display:block;" src="../assets/1233535.png" alt="">
      </cell>
      <cell title="升级条件" is-link link="/user/upgradecondition">
        <img slot="icon" width="22" style="display:block;" src="../assets/2315325.png" alt="">
      </cell>
      <cell title="我的ID" is-link link="/user/myid">
        <img slot="icon" width="22" style="display:block;" src="../assets/21535.png" alt="">
      </cell>
      <cell title="推广链接" is-link link="/user/qrcode">
        <div slot="icon" style="padding:3px;">
          <img width="16" style="display:block;" src="../assets/qrcode_24px_1102693_easyicon.net.png" alt="">
        </div>
      </cell>
      <cell title="嗨GO新闻" is-link>
        <img slot="icon" width="22" style="display:block;" src="../assets/31253532.png" alt="">
      </cell>
    </group>
    <div class="reset">
      <x-button type="warn" @click.native="logout" action-type="reset">退出</x-button>
    </div>
  </div>
</template>


<script>
import WUserHeader from '@/components/UserHeader'
import { Flexbox, FlexboxItem, Group, Cell, XButton, Badge } from 'vux'

export default {
  name: 'userCenter',
  components: {
    WUserHeader,
    Flexbox,
    FlexboxItem,
    Group,
    Cell,
    XButton,
    Badge
  },
  data: function () {
    return {
      user: {},
      numbers: {},
      withcashUrl: location.origin + '/higo/open/api/member/toWithDrawPage?memberId=' + this.$cookie.get('memberId') + '&token=' + this.$cookie.get('token')
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
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    },
    getCartAndOrderNum: function () {
      this.$http.post('caritem/getCartAndOrderNum', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.numbers = response.data
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    },
    logout: function () {
      this.$http.post('member/layout', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.$cookie.delete('memberId')
            this.$cookie.delete('token')
            this.$router.push('/login')
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  },
  created: function () {
    this.getMyInfo()
    this.getCartAndOrderNum()
  }
}
</script>

<style scoped>
.order-status {
  padding: 10px 25px 0 25px;
  margin-bottom: -10px;
}

.order-status>div {
  position: relative;
  font-size: 12px;
  text-align: center;
}

.order-status img {
  width: 45%;
}

.badge {
  position: absolute;
  top: 0;
  right: 0;
  display: block;
}

.function-list>a {
  text-decoration: none;
  color: inherit;
}

.function-item {
  padding: 5px 10px;
  border-top: 1px solid #ccc;
}



.function-item::after {
  display: table;
  content: '';
  clear: both;
}

.function-item .left {
  float: left;
}

.function-item .right {
  float: right;
}

.function-item .left img {
  height: 25px;
  vertical-align: middle;
}

.function-item .left span {
  font-size: 16px;
}

.weui-cell {
  padding: 5px 15px;
}

.reset {
  padding: 10px;
}

.reset .weui-btn {
  font-size: 14px;
}
</style>
