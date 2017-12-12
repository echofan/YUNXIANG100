<!--商品分类 -->
<template>
  <flexbox class="page-wrap" align="normal">
    <flexbox-item class="page-left">
      <flexbox align="normal">
        <flexbox-item>
          <div @click="changeCateGory(c.id)" class="category-item" :class="{active:c.id===selectId}" v-for="(c, index) in categoryList" :key="c.id">
            {{c.name}}
          </div>
        </flexbox-item>
      </flexbox>
    </flexbox-item>
    <flexbox-item class="page-right">
      <div class="search">
        <input type="text" v-model="params.keyword">
        <button @click="toSearch">
          <img src="../assets/132515ad.png" alt="">
        </button>
      </div>
      <div class="commodity-list-wrap" v-on:scroll="scrollHandler">
        <flexbox class="commodity-list" :gutter="0" wrap="wrap">
          <flexbox-item class="commodity-item" v-for="c in commodityList" :key="c.id" :span="1/2">
            <div>
              <router-link :to="{path:'/commodity/detail',query: { productId: c.productid, goodsId:c.goodsid}}">
                <div class="img-wrap">
                  <img :src="c.imgurl" alt="">
                </div>
                <div class="commodity-name">
                  <p v-text="c.name"></p>
                </div>
              </router-link>
              <p class="price">{{c.price | currency("￥")}}
                <img class="add" src="../assets/12312321.png" @click="addCaritem(c)" alt="">
              </p>
            </div>
          </flexbox-item>
          <load-more :show-loading="loadMore.loading" background-color="#fff" :tip="loadMore.tip"></load-more>
        </flexbox>
      </div>
    </flexbox-item>
  </flexbox>
</template>

<script>
import { Flexbox, FlexboxItem, LoadMore } from 'vux'

export default {
  name: 'commodityCategory',
  components: {
    Flexbox,
    FlexboxItem,
    LoadMore
  },
  data: function () {
    return {
      page: {
        pageSize: 12,
        pageNum: 1
      },
      loadMore: {
        hasMore: true,
        loading: true,
        tip: '正在加载'
      },
      categoryList: [],
      commodityList: [],
      params: {
        classId: '',
        keyword: ''
      }
    }
  },
  methods: {
    toSearch: function () {
      this.$router.push({ path: '/commodity/search', query: this.params })
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
            this.params.classId = this.categoryList[0]['id']
            this.goodList(this.categoryList[0]['id'])
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    },
    scrollHandler: function () {
      var scrollBottom = event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop
      if (this.loadMore.hasMore && scrollBottom < 10) {
        this.page.pageNum++
        this.loadMore.hasMore = false
        this.goodList(this.selectId)
      }
    },
    goodList: function (categoryId) {
      this.params.classId = categoryId
      this.selectId = categoryId
      this.$http.get('goods/list', {
        params: {
          ...this.page,
          classId: categoryId
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
    changeCateGory: function (categoryId) {
      this.loadMore = { loading: true, hasMore: true, tip: '正在加载' }
      this.page.pageNum = 1
      this.commodityList = []
      this.goodList(categoryId)
    }
  },
  created: function () {
    this.getGoodsClass()
  }
}
</script>

<style scoped>
.page-wrap {
  height: 100%;
  background: #fff;
}

.page {
  flex: 1;
  display: flex;
  flex-direction: row;
}

.page-left {
  height: 100%;
  box-shadow: 5px 1px 2px #ccc;
}

.page-right {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: none !important;
  width: 70% !important;
  font-size: 12px;
}

.category-item {
  padding: 10px 5px;
  font-size: 16px;
  text-align: center;
}

.search {
  padding: 10px;
  text-align: right;
}

.search input {
  width: 70%;
  padding: 2px 5px;
  font-size: 14px;
}

.search button {
  background: #a0247f;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
}

.search button img {
  width: 16px;
}

.category-item.active {
  color: #a0247f;
}

.commodity-list-wrap {
  flex: 1;
  overflow: auto;
}

.commodity-list {
  display: flex;
  flex-flow: row wrap;
}

.commodity-item {
  flex: none;
  width: 50%;
  padding: 5px;
  box-sizing: border-box;
}

@media (device-height:568px) and (-webkit-min-device-pixel-ratio:2) {
  .commodity-item .img-wrap {
    height: 120px;
    line-height: 120px;
    text-align: center;
    overflow: hidden;
  }
}

@media(min-device-width:360px) and (max-device-width:667px) and (-webkit-min-device-pixel-ratio:2) {
  .commodity-item .img-wrap {
    height: 160px;
    line-height: 160px;
    text-align: center;
    overflow: hidden;
  }
}


@media(min-device-width:414px) and (max-device-width:736px) and (-webkit-min-device-pixel-ratio:3) {
  .commodity-item .img-wrap {
    height: 180px;
    line-height: 180px;
    text-align: center;
    overflow: hidden;
  }
}

.commodity-item img {
  width: 100%;
  max-width: 100%;
  vertical-align: middle;
}

.commodity-name {
  height: 38px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}

.commodity-name>p {
  display: inline;
  word-break: break-all;
}



.commodity-item .price {
  font-size: 14px;
  color: #a0247f;
}

.commodity-item .add {
  float: right;
  width: 20px;
}
</style>
