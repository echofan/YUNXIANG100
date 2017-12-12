<template>
  <div class="page">
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
          <img src="../assets/6.png" alt="">
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
    <div class="order-list-wrap" v-on:scroll="scrollHandler">
      <flexbox :gutter="0" class="order-list-empty" v-if="orderList.length === 0">
        <flexbox-item>
        </flexbox-item>
        <div style="text-align:center;">
          <div>
            <img src="../assets/23465346346.png" alt="">
          </div>
          无待发货订单...
        </div>
        <flexbox-item>
        </flexbox-item>
      </flexbox>
      <flexbox :gutter="0" class="order-list" v-if="orderList.length > 0">
        <flexbox-item class="order-item" v-for="order in orderList" :key="order.id">
          <div class="simple-info" @click="show(order)">
            <span>订单编号：{{order.orderNum}}</span>
            <span>{{order.orderDate}}</span>
            &nbsp; &nbsp;
            <span v-text="dateFormat(new Date(order.paymentTime*1000),'YYYY-MM-DD HH.mm')"></span>
          </div>
          <div class="detail" v-show="!order.showDetail">
            <div class="address">
              <flexbox :gutter="0">
                <flexbox-item class="img" :span="1/4">
                  <img src="../assets/r3rw3re.png" alt="" width="30px">
                </flexbox-item>
                <flexbox-item :span="3/4">
                  <div style="padding-right:30px;">
                    <div>
                      <span class="name" v-text="JSON.parse(order.address).receiver">张生</span>
                      <span class="phone" v-text="JSON.parse(order.address).phone">13825636963</span>
                    </div>
                    <div>
                      <span v-text="JSON.parse(order.address).area"></span>
                      <span v-text="JSON.parse(order.address).street"></span>
                      <span v-text="JSON.parse(order.address).address"></span>
                    </div>
                  </div>
                </flexbox-item>
              </flexbox>
            </div>
            <div class="bar">
              <img src="../assets/2135345.png" alt="" width="100%" height="5px">
            </div>
            <div class="commodity-list">
              <flexbox :gutter="0" v-for="item in order.orderGoodsItemList" :key="item.id">
                <flexbox-item class="img" :span="1/4">
                  <img :src="item.imgUrl" alt="" width="50px">
                </flexbox-item>
                <flexbox-item :span="3/4">
                  <div>
                    <div class="title" v-text="item.title"></div>
                  </div>
                  <flexbox>
                    <flexbox-item class="price">
                      <span>{{item.price/100 | currency('￥')}}</span>
                    </flexbox-item>
                    <flexbox-item class="num">
                      <span v-text="item.num">25</span>
                    </flexbox-item>
                  </flexbox>
                </flexbox-item>
              </flexbox>
            </div>
            <div class="commodity-total">
              <span>{{order.totalNum}}件商品总计金额：{{order.totalPrice/100 | currency('￥')}}</span>
            </div>
            <div class="order-status clear">
              <div class="float-left">
                <img src="../assets/7875874.png" alt="">
                <p>已提交</p>
              </div>
              <div class="float-left">
                <img src="../assets/123535.png" alt="">
                <p>已付款</p>
              </div>
              <div class="float-left">
                <img src="../assets/20170727221202.png" alt="">
                <p>配送中</p>
              </div>
              <div class="float-left">
                <img src="../assets/20170715233805.png" alt="">
                <p>已签收</p>
              </div>
            </div>
          </div>
        </flexbox-item>
        <load-more v-if="loadMore.loading || (!loadMore.loading && orderList.length > 0)" :show-loading="loadMore.loading" :tip="loadMore.tip"></load-more>
      </flexbox>
    </div>
  </div>
</template>

<script>
import { Flexbox, FlexboxItem, dateFormat, Badge, LoadMore } from 'vux'

export default {
  name: 'waitForSend',
  components: {
    Flexbox, FlexboxItem, Badge, LoadMore
  },
  data: function () {
    return {
      page: {
        pageSize: 15,
        pageNum: 1
      },
      loadMore: {
        hasMore: true,
        loading: true,
        tip: '正在加载'
      },
      orderList: [],
      numbers: {}
    }
  },
  methods: {
    dateFormat,
    scrollHandler: function () {
      var scrollBottom = event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop
      if (this.loadMore.hasMore && scrollBottom < 10) {
        this.page.pageNum++
        this.loadMore.hasMore = false
        this.getOrderList()
      }
    },
    show: function (order) {
      if (!order.hasOwnProperty('showDetail')) {
        this.$set(order, 'showDetail', false)
      }
      order.showDetail = !order.showDetail
    },
    getOrderList: function () {
      this.$vux.loading.show({
        text: 'Loading'
      })
      this.$http.post('ordergoods/queryOrdergoods', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          status: 3,
          ...this.page
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          this.$vux.loading.hide()
          if (response.data && response.data.length > 0) {
            if (this.page.pageSize > response.data.length) {
              this.loadMore.hasMore = false
              this.loadMore.loading = false
              this.loadMore.tip = '我是有底线的'
            } else {
              this.loadMore.hasMore = true
            }
            for (var i = 0; i < response.data.length; i++) {
              this.orderList.push(response.data[i])
            }
          } else {
            this.loadMore.hasMore = false
            this.loadMore.loading = false
            this.loadMore.tip = '我是有底线的'
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
    }
  },
  created: function () {
    this.getOrderList()
    this.getCartAndOrderNum()
  }
}
</script>

<style scoped>
.page {
  flex: 1;
  overflow: auto;
  position: relative;
  background: #fff;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.badge {
  position: absolute;
  top: 10px;
  right: 10px;
  display: block;
}

.order-status {
  padding: 0 25px;
  font-size: 14px;
}

.order-status>div {
  position: relative;
  width: 25%;
  padding: 20px 0 5px 0;
  text-align: center;
}

.order-status>div>a {
  text-decoration: none;
  color: inherit;
}

.order-status>div img {
  width: 30px;
}

.order-list-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  font-size: 12px;
  overflow: auto;
}

.order-list {
  flex-direction: column;
  font-size: 12px;
}

.order-list-empty {
  flex: 1;
  flex-direction: column;
  font-size: 12px;
  overflow: auto;
}

.order-item {
  flex: none;
  width: 100% !important;
  background: #f9f9f9;
  border-top: 1px solid #ccc;
}

.simple-info {
  padding: 10px 10px;
}

.address {
  position: relative;
}

.address .img {
  text-align: center;
}

.address .select-address {
  position: absolute;
  right: 10px;
  bottom: 5px;
}

.bar {
  font-size: 12px;
  height: 5px;
}

.bar img {
  vertical-align: top;
}

.detail {
  background: #fff;
}

.detail .address {
  padding: 5px 10px;
  border-top: 1px solid #ccc;
}

.commodity-list {
  padding: 5px;
}

.commodity-list>div {
  padding: 3px 0;
}

.commodity-list .img {
  text-align: center;
}

.commodity-list .title {
  overflow: hidden;
}

.commodity-list .price {
  font-size: 14px;
  color: #a0247f;
}

.commodity-list .num {
  padding-right: 10px;
  text-align: right;
}

.commodity-total {
  padding: 10px 20px;
  font-size: 14px;
  text-align: center;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.commodity-total input {
  height: 14px;
}
</style>

