<!--购物袋 -->
<template>
  <flexbox class="page" direction="column" align="stretch">
    <flexbox-item v-if="caritemList.length === 0">
    </flexbox-item>
    <div style="text-align:center;font-size:12px;" v-if="caritemList.length === 0">
      <div>
        <img src="../assets/23465346346.png" alt="">
      </div>
      购物袋无商品...
    </div>
    <flexbox-item v-if="caritemList.length === 0">
    </flexbox-item>
    <flexbox-item class="commodity-list" v-if="caritemList.length > 0">
      <flexbox :gutter="0" class="commodity-item" v-for="(c,index) in caritemList" :key="c.id">
        <flexbox-item :span="1/10" class="select">
          <input type="checkbox" :value="c.id" v-model="params.cartIds">
        </flexbox-item>
        <flexbox-item :span="2/10" class="img">
          <img :src="c.imgurl" alt="">
        </flexbox-item>
        <flexbox-item :span="7/10" class="info">
          <flexbox :gutter="0">
            <flexbox-item :span="4/5" class="commodity-name">{{c.title}}</flexbox-item>
            <flexbox-item :span="1/5" class="remove">
              <img @click="remove(index)" src="../assets/132542323.png" alt="" width="100%">
            </flexbox-item>
          </flexbox>
          <flexbox :gutter="0">
            <flexbox-item class="price">
              <span>{{c.price/100 | currency('￥')}}</span>
            </flexbox-item>
            <flexbox-item class="operate">
              <button :disabled="c.num === 1" @click="reduce(c,index)">
                <img src="../assets/20170722131220.png" alt="" width="100%">
              </button>
              <span class="number" v-text="c.num"></span>
              <button @click="add(c,index)">
                <img src="../assets/20170722131211.png" alt="" width="100%">
              </button>
            </flexbox-item>
          </flexbox>
        </flexbox-item>
      </flexbox>
    </flexbox-item>
    <div class="total" v-if="caritemList.length > 0">
      <flexbox :gutter="0" align="stretch">
        <flexbox-item class="seleteAll" :span="3">
          <flexbox-item>
            <div>
              <input type="checkbox" @click="selectAll">
              <label for="">全选</label>
            </div>
          </flexbox-item>
        </flexbox-item>
        <flexbox-item :span="6">
          <div class="number">
            共
            <span v-text="totalNumber"></span>件商品
          </div>
          <div class="totalPrice">总计：{{totalPrice/100 | currency('￥')}}</div>
        </flexbox-item>
        <flexbox-item :span="3">
          <button class="btn-submit" @click="submitOrder">提交</button>
        </flexbox-item>
      </flexbox>
    </div>
  </flexbox>
</template>


<script>
import { Flexbox, FlexboxItem } from 'vux'

export default {
  name: 'shoppingBag',
  components: {
    Flexbox, FlexboxItem
  },
  data: function () {
    return {
      caritemList: [],
      params: {
        prePayType: 1,
        cartIds: []
      }
    }
  },
  computed: {
    totalPrice: function () {
      var total = 0
      for (var i = 0; i < this.caritemList.length; i++) {
        if (this.params.cartIds.indexOf(this.caritemList[i].id) !== -1) {
          total += this.caritemList[i].price * this.caritemList[i].num
        }
      }
      return total
    },
    totalNumber: function () {
      var total = 0
      for (var i = 0; i < this.caritemList.length; i++) {
        if (this.params.cartIds.indexOf(this.caritemList[i].id) !== -1) {
          total += this.caritemList[i].num
        }
      }
      return total
    }
  },
  methods: {
    getCaritemList: function () {
      this.$vux.loading.show({
        text: 'Loading'
      })
      this.$http.post('caritem/queryCaritemList', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          this.$vux.loading.hide()
          if (response.code === 0) {
            this.caritemList = response.data
          }
        })
    },
    add: function (item) {
      this.$http.post('caritem/addCaritem', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          goodsId: item.goodsId,
          productId: item.productId,
          type: 'add'
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            item.num++
            this.$vux.toast.show({
              text: '添加成功'
            })
          }
        })
    },
    reduce: function (item, index) {
      this.$http.post('caritem/addCaritem', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          goodsId: item.goodsId,
          productId: item.productId,
          num: item.num - 1,
          type: 'update'
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            item.num--
            this.$vux.toast.show({
              text: '更新成功'
            })
          }
        })
    },
    remove: function (index) {
      this.$http.post('caritem/deleteCaritem', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          'cartitemIds[]': this.caritemList[index]['id']
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.$root.$data.cartCount--
            this.caritemList.splice(index, 1)
            this.$vux.toast.show({
              text: '删除成功'
            })
          }
        })
    },
    selectAll: function (e) {
      if (e.target.checked) {
        for (var i = 0; i < this.caritemList.length; i++) {
          if (this.params.cartIds.indexOf(this.caritemList[i].id) === -1) {
            this.params.cartIds.push(this.caritemList[i].id)
          }
        }
      } else {
        this.params.cartIds = []
      }
    },
    submitOrder: function () {
      this.$http.post('ordergoods/addOrdergoods', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          totalPrice: this.totalPrice,
          'cartIds[]': this.params.cartIds.join(','),
          prePayType: this.params.prePayType
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.$root.$data.cartCount -= this.params.cartIds.length
            this.$router.push('/user/waitforpayment')
            this.$vux.toast.show({
              text: response.msg
            })
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: response.msg
            })
          }
        })
    }
  },
  created: function () {
    this.getCaritemList()
  }
}
</script>

<style scoped>
.page {
  height: 100%;
}

.commodity-list {
  width: 100% !important;
  overflow: auto;
}

.commodity-item {
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
}

.commodity-item>div {
  text-align: center;
}

.commodity-item .select {
  text-align: center;
  box-sizing: border-box;
}

.commodity-item .img {
  padding: 5px;
  box-sizing: border-box;
}

.commodity-item .img img {
  width: 100%;
  vertical-align: middle;
}

.commodity-item .info {
  padding: 3px;
  text-align: left;
  box-sizing: border-box;
}

.commodity-item .info .price {
  font-size: 14px;
  color: #a0247f;
}

.commodity-item .info .number {
  display: inline-block;
  min-width: 20px;
  font-size: 14px;
  text-align: center;
  vertical-align: middle;
}

.commodity-item .info .remove {
  text-align: center;
}

.commodity-item .info .remove img {
  width: 18px;
}

.commodity-item .operate {
  padding-right: 10px;
  text-align: right;
}

.commodity-item .operate button {
  border: none;
  background: none;
  vertical-align: middle;
}

.commodity-item .operate img {
  vertical-align: middle;
  width: 18px;
}

.commodity-name {
  display: block;
  text-align: left;
  font-size: 12px;
  height: 35px;
  margin-bottom: 5px;
  overflow: hidden;
  word-wrap: break-word;
}

.total {
  position: relative;
  width: 100%;
  background: #eee;
  font-size: 14px;
}

.total>.vux-flexbox {
  align-items: stretch;
}

.total>.vux-flexbox>.vux-flexbox-item {
  position: relative;
}

.total .seleteAll {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 5px;
  box-sizing: border-box;
}

.total .number {
  font-size: 12px;
}

.totalPrice {
  color: #a0247f;
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
