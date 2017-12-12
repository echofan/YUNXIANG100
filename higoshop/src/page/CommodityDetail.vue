<template>
  <div style="flex:1;overflow: auto; position: relative;background:#FFF;height:100%;">
    <div class="commodity-imglist">
      <div>
        <swiper :options="swiperOption" class="swiper-box">
          <swiper-slide class="swiper-item" v-for="slide in commodity.imagesList" :key="slide.id">
            <img v-bind:src="slide.imgurl" width="100%" :alt="slide.name">
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </div>
    <flexbox :gutter="0" class="commodity-info">
      <flexbox-item>
        <p class="name" v-text="commodity.name"></p>
        <p class="spec" v-html="commodity.productsList[0].spec || '&nbsp'"></p>
        <flexbox>
          <flexbox-item>
            <p>
              库存
              <span v-text="commodity.productsList[0]['stock']"></span>
              销量
              <span v-text="commodity.numSale"></span>
            </p>
          </flexbox-item>
          <flexbox-item>
            <flexbox>
              <flexbox-item>
                <p class="price">{{commodity.productsList[0].price/100 | currency('￥')}}</p>
              </flexbox-item>
              <div class="operate">
                <button class="add" @click="add">
                  <img src="../assets/12312321.png" alt="">
                </button>
              </div>
            </flexbox>
          </flexbox-item>
        </flexbox>
      </flexbox-item>
    </flexbox>
    <flexbox class="service" :gutter="0">
      <flexbox-item :span="1/5">
        <img src="../assets/455646.png" alt="">
        <p>闪电发货</p>
      </flexbox-item>
      <flexbox-item :span="1/5">
        <img src="../assets/6878745.png" alt="">
        <p>全场包邮</p>
      </flexbox-item>
      <flexbox-item :span="1/5">
        <img src="../assets/785678.png" alt="">
        <p>一线品牌</p>
      </flexbox-item>
      <flexbox-item :span="1/5">
        <img src="../assets/45356436.png" alt="">
        <p>快捷售后</p>
      </flexbox-item>
      <flexbox-item :span="1/5">
        <img src="../assets/2346436.png" alt="">
        <p>24小时服务</p>
      </flexbox-item>
    </flexbox>
    <div class="clear service">
  
    </div>
    <div class="note" v-html="commodity.note">
  
    </div>
  </div>
</template>


<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Flexbox, FlexboxItem } from 'vux'

export default {
  name: 'commodityDetail',
  components: {
    swiper,
    swiperSlide,
    Flexbox,
    FlexboxItem
  },
  data: function () {
    return {
      commodity: {},
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
  methods: {
    add: function () {
      this.$http.post('caritem/addCaritem', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          goodsId: this.$route.query.goodsId,
          productId: this.$route.query.productId,
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
    }
  },
  created: function () {
    this.$http.get('goods/one', {
      params: {
        goodsId: this.$route.query.goodsId,
        productId: this.$route.query.productId
      }
    })
      .then(response => {
        return response.data
      }).then(response => {
        if (response.code === 0) {
          this.commodity = response.data
        } else {
          this.$vux.toast.show({ type: 'warn', text: response.msg })
        }
      })
  }
}
</script>

<style scoped>
div {
  box-sizing: border-box;
}

.commodity-imglist {
  padding: 3px;
}

.commodity-imglist>div {
  border: 1px solid #ccc;
}

.commodity-imglist img {
  vertical-align: top;
}

.commodity-info {
  padding: 20px 10px 30px 10px;
  font-size: 12px;
}

.commodity-info .name {
  display: block;
  font-size: 14px;
  font-weight: bold;
}

.commodity-info .add {
  background: none;
  border: none;
}

.price {
  font-size: 16px;
  color: #a0247f;
  text-align: center;
}

.operate {
  text-align: center;
}

.number {
  font-size: 16px;
  vertical-align: middle;
}

.add {
  padding-right: 5px;
}

.add img {
  width: 30px;
  vertical-align: middle;
}

.service {
  font-size: 12px;
  text-align: center;
}

.service img {
  width: 30px;
}

.note {
  width: 100%;
  padding: 3px;
  margin-top: 20px;
  box-sizing: border-box;
}
</style>

<style>
.note img {
  width: 100%
}
</style>

