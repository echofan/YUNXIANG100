<template>
  <div class="page">
    <flexbox :gutter="0" class="order-status">
      <flexbox-item>
        <router-link to="/user/waitforpayment">
          <img src="../assets/5.png" alt="">
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
    <div class="order-list-wrap" v-on:scroll="scrollHandler">
      <flexbox :gutter="0" class="order-list-empty" v-if="orderList.length === 0">
        <flexbox-item>
        </flexbox-item>
        <div style="text-align:center;">
          <div>
            <img src="../assets/23465346346.png" alt="">
          </div>
          无待付款订单...
        </div>
        <flexbox-item>
        </flexbox-item>
      </flexbox>
      <flexbox :gutter="0" class="order-list" v-if="orderList.length > 0">
        <flexbox-item class="order-item" v-for="(order, index) in orderList" :key="order.id">
          <flexbox :gutter="0" class="simple-info" @click.native="show(order)">
            <div class="checkbox-wrap">
              <input type="checkbox" :checked="order.id === toPayOrder.id" @click.stop="selectOrder(order)">
            </div>
            <div class="order-num">
              <span>订单编号：{{order.orderNum}}</span>
            </div>
            <flexbox-item class="order-date">
              <span v-text="dateFormat(new Date(order.createTime*1000),'YYYY-MM-DD HH.mm')"></span>
            </flexbox-item>
          </flexbox>
          <div class="detail" v-show="!order.showDetail">
            <div class="address">
              <flexbox :gutter="0">
                <flexbox-item class="img" :span="1/4">
                  <img src="../assets/r3rw3re.png" alt="" width="30px">
                </flexbox-item>
                <flexbox-item :span="3/4">
                  <div v-if="order.address" style="padding-right:30px;">
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
              <img @click="showAddress(order)" class="select-address" src="../assets/ewqeszd.png" alt="" width="30px;">
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
          </div>
        </flexbox-item>
        <load-more v-if="loadMore.loading || (!loadMore.loading && orderList.length > 0)" :show-loading="loadMore.loading" :tip="loadMore.tip"></load-more>
      </flexbox>
    </div>
    <div class="total" v-if="orderList.length > 0">
      <flexbox :gutter="0">
        <flexbox-item :span="3">
          <button class="btn-cancel" @click="cancelGoodsOrder">取消</button>
        </flexbox-item>
        <flexbox-item :span="6" class="info">
          <div class="number">
            共
            <span v-text="totalNumber"></span>件商品
          </div>
          <div class="totalPrice">总计：{{toPayOrder.totalPrice/100||0 | currency('￥')}}</div>
        </flexbox-item>
        <flexbox-item :span="3">
          <button class="btn-submit" @click="toPay">支付</button>
        </flexbox-item>
      </flexbox>
    </div>
    <div>
      <popup v-model="showAddressList" position="bottom" max-height="100%">
        <group>
          <cell-box v-if="deafultAddress" @click.native="selectAddress(deafultAddress)">
            <div class="address-item">
              <div>
                <span v-text="deafultAddress.receiver"></span>
                <span v-text="deafultAddress.phone"></span>
              </div>
              <div style="font-size:14px;color:#999;">
                <span v-text="deafultAddress.area"></span>
                <span v-text="deafultAddress.street"></span>
                <span v-text="deafultAddress.address"></span>
              </div>
            </div>
          </cell-box>
          <cell-box v-for="a in addressList" :key="a.id" @click.native="selectAddress(a)">
            <div class="address-item">
              <div>
                <span v-text="a.receiver"></span>
                <span v-text="a.phone"></span>
              </div>
              <div style="font-size:14px;color:#999;">
                <span v-text="a.area"></span>
                <span v-text="a.street"></span>
                <span v-text="a.address"></span>
              </div>
            </div>
          </cell-box>
        </group>
      </popup>
    </div>
  </div>
</template>

<script>
import { TransferDom, Popup, LoadMore, Flexbox, FlexboxItem, XButton, Group, Cell, CellBox, dateFormat, Badge } from 'vux'

export default {
  name: 'waitForPayment',
  components: {
    TransferDom, Popup, Flexbox, LoadMore, FlexboxItem, XButton, Group, Cell, CellBox, Badge
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
      showAddressList: false,
      orderList: [],
      numbers: {},
      toPayOrder: {},
      selectAddressOrder: {},
      addressList: [],
      deafultAddress: {}
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
    selectAddress: function (address) {
      this.$http.post('ordergoods/associateAddress', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          orderGoodsId: this.selectAddressOrder.id,
          addressId: address.id
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (this.toPayOrder.id) {
            this.toPayOrder.address = JSON.stringify(address)
          }
          this.selectAddressOrder.address = JSON.stringify(address)
          this.showAddressList = false
        })
    },
    showAddress: function (order) {
      this.$http.post('member/getMyAddress', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.data.addressList.length > 0 || response.data.deafultAddress) {
            this.showAddressList = true
            this.addressList = response.data.addressList
            this.deafultAddress = response.data.deafultAddress
            this.selectAddressOrder = order
          } else {
            this.$vux.toast.show({ type: 'warn', text: '请先添加收货地址' })
            this.$router.push('/user/address/add')
          }
        })
    },
    show: function (order) {
      if (!order.hasOwnProperty('showDetail')) {
        this.$set(order, 'showDetail', false)
      }
      order.showDetail = !order.showDetail
    },
    selectOrder: function (order) {
      if (this.toPayOrder.id === order.id) {
        this.toPayOrder = {}
      } else {
        this.toPayOrder = order
      }
    },
    getOrderList: function () {
      this.$vux.loading.show({
        text: 'Loading'
      })
      this.$http.post('ordergoods/queryOrdergoods', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          status: 1,
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
    },
    toPay: function () {
      if (this.toPayOrder.id) {
        if (!this.toPayOrder.address) {
          this.$vux.toast.show({
            type: 'warn',
            text: '请选择收货地址'
          })
          return
        }
        location.href = '/higo/open/api/ordergoods/toPayPage?memberId=' + this.$cookie.get('memberId') + '&token=' + this.$cookie.get('token') + '&orderGoodsId=' + this.toPayOrder.id
      } else {
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择订单'
        })
      }
    },
    cancelGoodsOrder: function () {
      if (!this.toPayOrder.id) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请选择订单'
        })
        return
      }
      this.$http.post('ordergoods/cancelGoodsOrder', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          orderGoodsId: this.toPayOrder.id
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.$vux.toast.show({ text: '订单已取消' })
            this.getCartAndOrderNum()
            for (var i = 0; i < this.orderList.length; i++) {
              if (this.orderList[i].id === this.toPayOrder.id) {
                this.orderList.splice(i, 1)
                this.toPayOrder = {}
                break
              }
            }
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  },
  computed: {
    totalNumber: function () {
      let total = 0
      if (this.toPayOrder.orderGoodsItemList) {
        this.toPayOrder.orderGoodsItemList.map((value) => {
          total += value.num
        })
      }
      return total
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
  position: relative;
  padding: 10px 10px;
}

.order-num {
  padding-left: 5px;
}

.order-date {
  text-align: right;
}

.checkbox-wrap {
  position: relative;
}

.checkbox-wrap input {
  margin-top: 4px;
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
  text-align: right;
  border-top: 1px solid #ccc;
}

.commodity-total input {
  height: 14px;
}

.total {
  flex: none;
  background: #eee;
  font-size: 14px;
}

.total>.vux-flexbox {
  align-items: stretch;
}

.total>.vux-flexbox>.vux-flexbox-item {
  position: relative;
}

.total .info {
  padding: 0 3px;
}

.total .number {
  font-size: 12px;
}

.totalPrice {
  color: #a0247f;
}

.btn-cancel {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  font-size: 16px;
  background: #ccc;
  color: #fff;
}

.btn-submit {
  position: absolute;
  display: block;
  width: 100%;
  height: 100%;
  border: none;
  font-size: 16px;
  background: #ca5599;
  color: #fff;
}
</style>

