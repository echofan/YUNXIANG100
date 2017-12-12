<template>
  <div style="flex:1;overflow: auto; position: relative;background:#fff;height:100%;">
    <div class="order-list">
      <div class="order-item" v-for="order in orderList">
        <div class="simple-info" @click="show(order)">
          <span>订单编号：{{order.orderNo}}</span>
          <span>{{order.orderDate}}</span>
        </div>
        <div class="detail" v-show="order.showDetail">
          <div class="address clear">
            <div class="float-left img">
              <img src="../assets/r3rw3re.png" alt="" width="30px">
            </div>
            <div class="float-left">
              <div>
                <span class="name">张生</span>
                <span class="phone">13825636963</span>
              </div>
              <div>
                <p>广东省东莞市三元里万凯商务中心</p>
              </div>
            </div>
          </div>
          <div class="bar"><img src="../assets/2135345.png" alt="" width="100%" height="5px"></div>
          <div class="commodity-list">
            <div class="commodity-item clear">
              <div class="float-left img">
                <img src="../assets/3rqwrrwr.png" alt="" width="30px">
              </div>
              <div class="float-left">
                <div>
                  <p>百雀羚化妆品套装女水嫩防晒霜官方旗舰店</p>
                </div>
                <div>
                  <span class="price">25</span>
                </div>
              </div>
            </div>
          </div>
          <div class="commodity-total">
            5件商品总计金额：185.00
          </div>
          <div class="express">
            <span>物流</span>
            <span>顺丰快递</span>
            <span>单号：40541545646855</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orderList',
  components: {

  },
  data: function () {
    return {
      orderList: [
        {
          orderNo: '4000AD006552PPW3',
          orderDate: '2017-4-29 10.59'
        }, {
          orderNo: '4000AD006552PPW3',
          orderDate: '2017-4-29 10.59'
        }
      ]
    }
  },
  methods: {
    show: function (order) {
      if (!order.hasOwnProperty('showDetail')) {
        this.$set(order, 'showDetail', false)
      }
      order.showDetail = !order.showDetail
    }
  }
}
</script>

<style scoped>
.order-list {
  font-size: 12px;
}

.order-item {
  background: #eee;
  border-top: 1px solid #ccc;
}

.commodity-item .img{
  padding: 0 20px;
}

.simple-info {
  padding: 10px 10px;
}

.address .img{
  padding: 0 10px;
}
.bar{
 font-size: 12px;
}
.detail {
  background: #fff;
}

.detail .address {
  padding: 5px 10px;
  border-top: 1px solid #ccc;
}

.detail .address .float-left>div{
  padding: 5px 5px;
}

.commodity-item .float-left>div{
  padding: 5px 5px;
}

.commodity-total {
  padding: 10px 20px;
  text-align: center;
  border-top: 1px solid #ccc;
}

.express {
  padding: 10px 20px;
  border-top: 1px solid #ccc;
  text-align: center;
}
</style>

