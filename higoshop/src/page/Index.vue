<template>
  <div style="height:100%;overflow:auto;" v-on:scroll="scrollHandler">
    <swiper :options="swiperOption" class="swiper-box">
      <swiper-slide class="swiper-item" v-for="(item, index) in swiperSlides" :key="item.id">
        <img v-bind:src="item.picurl" width="100%">
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
    <flexbox v-if="!!user" class="info" :gutter="0" justify="center">
      <flexbox-item class="left">
        <flexbox :gutter="0">
          <div class="avatar">
            <div>
              <img v-if="user.headImg" :src="user.headImg" alt="" width="20px">
              <img v-if="!user.headImg" src="../assets/12353.png" alt="" width="20px">
            </div>
          </div>
          <div>
            <div>
              <span class="nick">昵称：
                <span v-text="user.nickname">百万富翁</span>
              </span>
            </div>
          </div>
          <div class="level-log" :style="{width:levelInfo.showTask?'27%':'20%'}">
            <img :src="user.memberLevel && user.memberLevel.logo" alt="" width="100%">
          </div>
        </flexbox>
      </flexbox-item>
      <div v-if="levelInfo.showTask" class="right">
        <span>
          <span style="font-size:12px;">任务</span>{{'￥'+levelInfo.taskMoney}}
        </span>
      </div>
    </flexbox>
    <div>
      <flexbox :gutter="0" style="font-size:12px;text-align:left;padding:5px;position:relative;">
        <flexbox-item v-show="levelInfo.countDwonFalg" @click.native="showTip = true" style="color:#ca5599;padding-left:10px;">
          <div>
            <span style="margin-right:5px;">购物倒计时</span>
          </div>
          <div>
            <span style="font-size:20px;" v-text="countTime && countTime.hours"></span>
            <span>小时</span>
            <span style="font-size:20px;" v-text="countTime && countTime.minutes"></span>
            <span>分</span>
            <span style="font-size:20px;" v-text="countTime && countTime.second"></span>
            <span>秒</span>
          </div>
        </flexbox-item>
        <flexbox-item v-show="!levelInfo.countDwonFalg">
          <img src="../assets/20170728002957.png" alt="" height="50px" style="max-width: 100%;">
        </flexbox-item>
        <flexbox-item>
          <flexbox>
            <flexbox-item style="padding-left:5px;">
              <img src="../assets/423424.png" alt="" width="25px;">
              <span v-text="user.memberAccout?user.memberAccout.point:0">120000</span>
            </flexbox-item>
            <div style="padding-right:15px;">
              <span v-text="user.activeGroup"></span>
            </div>
          </flexbox>
        </flexbox-item>
        <div class="showTip" v-show="levelInfo.countDwonFalg && showTip">
          <img src="../assets/20170802231725.png" alt="" width="80%">
          <div style="text-align:center;margin-top:20px;" class="needsclick" @click="closeTip">
            <img src="../assets/20170725230652.png" alt="" width="40px" class="needsclick">
          </div>
        </div>
      </flexbox>
    </div>
    <flexbox class="function" :gutter="0">
      <flexbox-item>
        <a href="javascript:void(0)">
          <img src="../assets/787899.png" alt="">
          <p>特惠套餐</p>
        </a>
      </flexbox-item>
      <flexbox-item>
        <a href="javascript:void(0)">
          <img src="../assets/342643346.png" alt="">
          <p>嗨GO新闻</p>
        </a>
      </flexbox-item>
      <flexbox-item>
        <router-link to="/user/storedata">
          <img src="../assets/312543543.png" alt="">
          <p>店铺详情</p>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link to="/iddating">
          <img src="../assets/123535435.png" alt="">
          <p>ID大厅</p>
        </router-link>
      </flexbox-item>
      <flexbox-item>
        <router-link to="/user/myid">
          <img src="../assets/13212535.png" alt="">
          <p>我的ID</p>
        </router-link>
      </flexbox-item>
    </flexbox>
    <div>
      <flexbox class="commodity-list" :gutter="0" wrap="wrap">
        <flexbox-item :span="1/2" class="commodity-item" v-for="c in commodityList" :key="c.id">
          <div>
            <router-link :to="{path:'/commodity/detail',query: { productId: c.productid, goodsId:c.goodsid}}">
              <div class="img-wrap">
                <img :src="c.imgurl" alt="">
              </div>
            </router-link>
            <div class="title">
              <p :title="c.title" v-text="c.name"></p>
            </div>
            <p class="spec"></p>
            <p class="price">{{c.price | currency("￥")}}
              <img class="add" src="../assets/12312321.png" @click="addCaritem(c)" alt="">
            </p>
          </div>
        </flexbox-item>
        <load-more :show-loading="loadMore.loading" background-color="transparent" :tip="loadMore.tip"></load-more>
      </flexbox>
    </div>
  
    <div v-transfer-dom>
      <popup v-model="showUpgradePopup" height="100%" class="upgrade-popup" @on-hide="closeUpgradePopup">
        <div class="upgrade-wrap">
          <div class="upgrade-img">
  
          </div>
          <div style="text-align:center;margin-top:20px;" @click="upgrade">
            <img src="../assets/20170725230652.png" alt="" width="40px">
          </div>
        </div>
      </popup>
    </div>
  
    <div v-transfer-dom>
      <popup v-model="showIDPopup" height="100%" class="upgrade-popup" @on-hide="closeIDPopup">
        <div class="upgrade-wrap">
          <div class="general-id-img">
  
          </div>
          <div style="text-align:center;margin-top:20px;" @click="updateActiveIdTip">
            <img src="../assets/20170725230652.png" alt="" width="40px">
          </div>
        </div>
      </popup>
    </div>
  
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { TransferDom, Flexbox, FlexboxItem, Grid, Tabbar, TabbarItem, GridItem, GroupTitle, Group, Cell, Card, LoadMore, Popup } from 'vux'
import WFooter from '@/components/Footer'
require('swiper/dist/css/swiper.css')

export default {
  directives: {
    TransferDom
  },
  components: {
    WFooter,
    Card,
    Flexbox,
    FlexboxItem,
    Tabbar,
    TabbarItem,
    Grid,
    GridItem,
    Group,
    Cell,
    swiper,
    swiperSlide,
    GroupTitle,
    LoadMore,
    Popup
  },
  data: function () {
    return {
      showTip: false,
      page: {
        pageSize: 12,
        pageNum: 1
      },
      loadMore: {
        hasMore: true,
        loading: true,
        tip: '正在加载'
      },
      user: {},
      swiperSlides: [],
      commodityList: [],
      levelInfo: {},
      swiperOption: {
        pagination: '.swiper-pagination',
        direction: 'horizontal',
        autoplay: 3000,
        slidesPerView: 1,
        paginationClickable: true,
        autoHeight: true,
        mousewheelControl: true
      }
    }
  },
  computed: {
    countTime: function () {
      if (this.levelInfo.countDwonFalg) {
        let hours = parseInt(this.levelInfo.time / 1000 / 3600)
        let minutes = Math.floor(this.levelInfo.time / 60000) % 60
        let second = Math.floor(this.levelInfo.time / 1000) % 60
        return {
          hours,
          minutes,
          second
        }
      }
    },
    showIDPopup: function () {
      return this.levelInfo.getActiveIdTip
    },
    showUpgradePopup: function () {
      return this.levelInfo.upgradeFlg
    }
  },
  methods: {
    getSwiperSlides: function () {
      this.$http.post('cms/imgList')
        .then(response => {
          return response.data
        }).then(response => {
          this.swiperSlides = response.data.list
        })
    },
    scrollHandler: function () {
      var scrollBottom = event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop
      if (this.loadMore.hasMore && scrollBottom < 10) {
        this.page.pageNum++
        this.loadMore.hasMore = false
        this.getCommodityList()
      }
    },
    getCommodityList: function (event) {
      this.$http.get('goods/list', {
        params: {
          ...this.page
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
            this.$vux.toast.show({
              text: '添加成功'
            })
          } else if (response.code === -2) {
            this.$router.push('/login')
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
          }
        })
    },
    upgrade: function () {
      this.$http.post('memberLevel/upgrade', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.getLevelInfo()
          }
        })
    },
    updateActiveIdTip: function () {
      this.$http.post('member/updateActiveIdTip', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.levelInfo.getActiveIdTip = false
          }
        })
    },
    getLevelInfo: function () {
      this.$http.post('memberLevel/getLevelInfo', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.levelInfo = response.data
            /* this.levelInfo.countDwonFalg = true
            this.levelInfo.time = 1000 * 60 * 60 * 48 */
            if (this.levelInfo.countDwonFalg) {
              this.levelInfo.lastTime = new Date().getTime() + this.levelInfo.time
              let that = this
              var int = setInterval(function () {
                let time = that.levelInfo.lastTime - new Date().getTime()
                if (time <= 0) {
                  that.levelInfo = Object.assign({}, that.levelInfo, { time: 0 })
                  clearInterval(int)
                  that.logout()
                } else {
                  that.levelInfo = Object.assign({}, that.levelInfo, { time: time })
                }
              }, 1000)
            }
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
    },
    closeUpgradePopup: function () {
    },
    closeIDPopup: function () {

    },
    closeTip: function () {
      this.showTip = false
    }
  },
  created: function () {
    this.getLevelInfo()
    this.getSwiperSlides()
    this.getCommodityList()
    this.getMyInfo()
  }
}
</script>

<style scoped>
.swiper-item img {
  vertical-align: top;
}

.info {
  background: #900874;
  font-size: 12px;
  color: #fff;
}

.info .right {
  padding-left: 5px;
  padding-right: 10px;
  text-align: right;
  font-size: 14px;
}

.info .right img {
  vertical-align: middle;
}

.avatar {
  position: relative;
  display: inline-block;
  height: 35px;
  padding: 3px 3px 3px 15px;
  font-size: 14px;
  border-radius: 5px;
  z-index: 1;
}

.avatar>div {
  background: #fff;
  margin-top: -15px;
  border: 1px solid #fff;
  border-radius: 5px;
}

.avatar img {
  width: 35px;
  height: 35px;
  vertical-align: top;
}

.level-log {
  padding-left: 5px;
}

.level-log img {
  vertical-align: middle;
}

.function {
  padding: 10px 0;
  font-size: 12px;
  text-align: center;
}

.function img {
  width: 60%;
}

.showTip {
  position: absolute;
  left: 0;
  top: 90%;
  width: 100%;
  text-align: center;
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

.upgrade-popup {
  background: rgba(0, 0, 0, 0.51);
}

.upgrade-wrap {
  width: 80%;
  height: 65%;
  margin: 20px auto;
  margin-top: 20%;
  border-radius: 5px;
}

.upgrade-img {
  height: 100%;
  background: url(../assets/24344211135.png) repeat center center;
  background-size: 100% 100%;
  ;
}

.general-id-img {
  height: 100%;
  background: url(../assets/24344211134.png) repeat center center;
  background-size: 100% 100%;
  ;
}
</style>

