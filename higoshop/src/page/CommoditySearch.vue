<template>
  <div class="page">
    <div class="search">
      <flexbox>
        <flexbox-item class="search-param">
          <input v-model="params.keyword" type="text" placeholder="请输入搜索商品名称">
          <img src="../assets/213123.png" alt="" @click="search">
        </flexbox-item>
        <div @click="showCategory = true" v-text="currCategory.name" class="search-category"></div>
      </flexbox>
      <div class="order-type">
        <button @click="selectOrder('')" :class="{active:params.orderBy === ''}">综合</button>
        <button @click="selectOrder('numSale')" :class="{active:params.orderBy === 'numSale'}">销量</button>
        <button @click="selectOrder('price')" :class="{active:params.orderBy === 'price'}">价格</button>
      </div>
    </div>
    <div class="commodity-list-wrap" v-on:scroll="scrollHandler">
      <flexbox class="commodity-list" :gutter="0" wrap="wrap" v-if="commodityList.length > 0">
        <flexbox-item :span="1/2" class="commodity-item" v-for="c in commodityList" :key="c.id">
          <div>
            <router-link :to="{path:'/commodity/detail',query: { productId: c.productid, goodsId:c.goodsid}}">
              <div class="img-wrap">
                <img :src="c.imgurl" alt="">
              </div>
            </router-link>
            <p class="title" :title="c.title" v-text="c.name"></p>
            <p class="spec"></p>
            <p class="price">{{c.price | currency("￥")}}
              <img class="add" src="../assets/12312321.png" @click="addCaritem(c)" alt="">
            </p>
          </div>
        </flexbox-item>
      </flexbox>
      <load-more v-if="loadMore.loading || (!loadMore.loading && commodityList.length > 0)" :show-loading="loadMore.loading" background-color="transparent" :tip="loadMore.tip"></load-more>
      <flexbox class="search-empty" v-if="!loadMore.loading && commodityList.length === 0">
        <flexbox-item></flexbox-item>
        <div style="text-align:center;">
          <div>
            <img src="../assets/23465346346.png" alt="">
          </div>
          没有发现匹配的商品...
        </div>
        <flexbox-item></flexbox-item>
      </flexbox>
    </div>
    <div v-transfer-dom>
      <popup v-model="showCategory" position="right">
        <div class="category-list">
          <div @click="changeCategory(c)" class="category-item" :class="{active:c.id===params.classId}" v-for="(c, index) in categoryList" :key="c.id">
            {{c.name}}
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>


<script>
import { Flexbox, FlexboxItem, Group, Cell, LoadMore, Popup, TransferDom } from 'vux'

export default {
  name: 'wwww',
  directives: {
    TransferDom
  },
  components: {
    Flexbox, FlexboxItem, Group, Cell, LoadMore, Popup
  },
  data: function () {
    return {
      showCategory: false,
      page: {
        pageSize: 12,
        pageNum: 1
      },
      loadMore: {
        hasMore: true,
        loading: true,
        tip: '正在加载'
      },
      commodityList: [],
      categoryList: [],
      currCategory: {},
      params: {
        classId: '',
        keyword: '',
        orderBy: ''
      }
    }
  },
  methods: {
    selectOrder: function (order) {
      this.params.orderBy = order
      this.search()
    },
    scrollHandler: function () {
      var scrollBottom = event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop
      if (this.loadMore.hasMore && scrollBottom < 10) {
        this.page.pageNum++
        this.loadMore.hasMore = false
        this.getCommodityList()
      }
    },
    getCommodityList: function () {
      this.$http.get('goods/list', {
        params: {
          ...this.page,
          ...this.params
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.data && response.data.length > 0) {
            if (this.page.pageSize > response.data.length) {
              this.loadMore.hasMore = false
              this.loadMore.loading = false
              this.loadMore.tip = '我是有底线的'
            } else {
              this.loadMore.hasMore = true
            }
            for (var i = 0; i < response.data.length; i++) {
              this.commodityList.push(response.data[i])
            }
          } else {
            this.loadMore.hasMore = false
            this.loadMore.loading = false
            this.loadMore.tip = '我是有底线的'
          }
        })
    },
    addCaritem: function (commodity) {
      this.$http.post('caritem/addCaritem', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          goodsId: commodity.goodsid,
          productId: commodity.productid,
          type: 'add'
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.$root.$data.cartCount = response.data.cartCount
            this.$vux.toast.show({ text: '添加成功' })
          }
        })
    },
    getGoodsClass: function () {
      this.$http.get('goods/getGoodsClass', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.categoryList = response.data
            for (var i = 0; i < this.categoryList.length; i++) {
              if (this.categoryList[i]['id'] === this.$route.query['classId']) {
                this.currCategory = this.categoryList[i]
                break
              }
            }
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    },
    changeCategory: function (currCategory) {
      this.params.classId = currCategory.id
      this.currCategory = currCategory
      this.showCategory = false
      this.search()
    },
    search: function () {
      this.commodityList = []
      this.loadMore = { loading: true, hasMore: true, tip: '正在加载' }
      this.page.pageNum = 1
      this.getCommodityList()
    }
  },
  created: function () {
    this.params = Object.assign(this.params, this.$route.query)
    this.getCommodityList()
    this.getGoodsClass()
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

.search input {
  width: 100%;
  outline: none;
  padding: 5px 30px 5px 10px;
  font-size: 16px;
  background: #efefef;
  border-radius: 5px;
  box-sizing: border-box;
}

.search-param {
  position: relative;
  padding: 5px 10px;
  vertical-align: middle;
}

.search-param img {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 20px;
  margin-top: auto;
  margin-bottom: auto;
  margin-right: 18px;
}

.search-category {
  width: 100px;
  color: #a0247f;
  text-align: center;
}

.search .order-type {
  padding: 5px 10px;
  text-align: left;
}

.search .order-type button {
  background: #ccc;
  color: #fff;
  padding: 2px 10px;
  border-radius: 5px;
}

.search .order-type .active {
  color: #a72185;
}

.category-list {
  width: 150px;
  padding: 20px 10px;
  text-align: center;
}

.category-list .category-item {
  padding: 5px 0;
}

.category-item.active {
  color: #a0247f;
}

.commodity-list-wrap {
  flex: 1;
  background: #eee;
  overflow: auto;
}

.commodity-list {
  background: #eee;
  padding: 2px;
}

.commodity-item {
  padding: 2px;
  box-sizing: border-box;
}

.commodity-item>div {
  padding: 5px;
  background: #fff;
}

@media (device-height:568px) and (-webkit-min-device-pixel-ratio:2) {
  .commodity-item .img-wrap {
    height: 150px;
    line-height: 150px;
    text-align: center;
    overflow: hidden;
  }
}

@media(min-device-width:360px) and (max-device-width:667px) and (-webkit-min-device-pixel-ratio:2) {
  .commodity-item .img-wrap {
    height: 200px;
    line-height: 200px;
    text-align: center;
    overflow: hidden;
  }
}


@media(min-device-width:414px) and (max-device-width:736px) and (-webkit-min-device-pixel-ratio:3) {
  .commodity-item .img-wrap {
    height: 230px;
    line-height: 230px;
    text-align: center;
    overflow: hidden;
  }
}

.commodity-item img {
  vertical-align: middle;
  width: 100%;
}

.commodity-item .title {
  height: 50px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}

.commodity-item .title>p {
  word-break: break-all
}

.commodity-item .spec {
  font-size: 12px;
  color: #a9a9a9;
}

.commodity-item .price {
  color: #a0247f;
}

.commodity-item .add {
  float: right;
  width: 25px;
}

.search-empty {
  height: 100%;
  font-size: 12px;
}
</style>
