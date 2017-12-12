<template>
  <div style="flex:1;overflow: auto; position: relative;height:100%;" v-on:scroll="scrollHandler">
    <div class="search">
      <p>
        <span @click="selectOrder('')" :class="{active:params.orderBy === ''}">默认排列</span>
        <span @click="selectOrder('point')" :class="{active:params.orderBy === 'point'}">数据排列</span>
        <input type="text" placeholder="输入组名" v-model="params.keyword" @input="search" class="name" name="name">
      </p>
    </div>
    <hr>
    <div v-if="idList.length > 0" class="id-list">
      <flexbox @click.native="showDetail(id)" class="id-item" v-for="id in idList" :key="id.id">
        <flexbox-item>
          <div class="top">
            <span>编组：{{id.activegroup}}</span>
            <span v-text="dateFormat(new Date(id.createtime*1000),'YYYY-MM-DD HH.mm')"></span>
          </div>
          <flexbox :gutter="0">
            <flexbox-item class="nickname">
              昵称：{{id.nickname}}
            </flexbox-item>
            <div class="under-right">
              <img :src="id.logo" alt="" width="50px">&nbsp;
              <img src="../assets/324346rsf.png" alt="" width="23px">&nbsp;
              <span v-text="id.point">10000</span>
            </div>
          </flexbox>
        </flexbox-item>
        <div class="id-img">
          <img src="../assets/1325325325.png" alt="" width="30px">
        </div>
      </flexbox>
      <load-more v-if="loadMore.loading || (!loadMore.loading && idList.length > 0)" :show-loading="loadMore.loading" background-color="transparent" :tip="loadMore.tip"></load-more>
    </div>
    <div v-if="idList.length === 0" style="padding:100px 0;">
      <p style="text-align:center;">没有已发布的ID</p>
    </div>
    <div v-transfer-dom>
      <x-dialog v-model="showDetailDialog" class="auto-dialog" :hide-on-blur="true">
        <div class="header">
          <div class="content clear">
            <div class="avatar">
              <img v-if="currId.headImg" :src="currId.headImg" alt="">
              <img v-if="!currId.headImg" src="../assets/12353.png" alt="">
            </div>
            <div class="info">
              <div class="clear">
                <span class="float-left" style="margin-top:5px;" v-text="currId.nickname">昵称：我爱购物狂</span>
                <span class="float-right" style="margin-top:5px;">编组：{{currId.activegroup}}</span>
              </div>
              <div class="clear" style="text-align:center;">
                <div class="float-left logo">
                  <img :src="currId.logo" alt="" width="100%">
                </div>
                <span class="trend">
                  <img src="../assets/324346rsf.png" alt="">
                  <span v-text="currId.point">12000000</span>
                </span>
              </div>
            </div>
          </div>
          <div class="code">
            <flexbox>
              <div>
                <label for="">激活ID</label>
              </div>
              <flexbox-item>
                <div id="code-value" class="code-value" v-text="currId.code"></div>
              </flexbox-item>
              <div>
                <button class="btn btn-normal" data-clipboard-target="#code-value">复制</button>
              </div>
            </flexbox>
          </div>
          <div class="bottom">
            <p>说明：</p>
            <p>使用ID激活后，24小时内没有升级成为嗨购，会员ID失效重新返还推荐人。</p>
          </div>
        </div>
      </x-dialog>
    </div>
  </div>
</template>


<script>
import { Flexbox, FlexboxItem, LoadMore, XDialog, TransferDomDirective as TransferDom, dateFormat } from 'vux'
import Clipboard from 'clipboard'

export default {
  name: 'userCenter',
  directives: {
    TransferDom
  },
  components: {
    Flexbox, FlexboxItem, LoadMore, XDialog
  },
  data: function () {
    return {
      showDetailDialog: false,
      page: {
        pageSize: 12,
        pageNum: 1
      },
      loadMore: {
        hasMore: true,
        loading: true,
        tip: '正在加载'
      },
      user: {

      },
      currId: {},
      idList: [],
      params: {
        keyword: '',
        orderBy: ''
      }
    }
  },
  methods: {
    dateFormat,
    selectOrder: function (order) {
      this.params.orderBy = order
      this.search()
    },
    scrollHandler: function () {
      var scrollBottom = event.target.scrollHeight - event.target.clientHeight - event.target.scrollTop
      if (this.loadMore.hasMore && scrollBottom < 10) {
        this.page.pageNum++
        this.loadMore.hasMore = false
        this.getIdList()
      }
    },
    showDetail: function (id) {
      this.currId = id
      this.showDetailDialog = true
    },
    getIdList: function () {
      this.$http.post('activationCode/activeCodeHall', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          ...this.params,
          ...this.page
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            /* response.data = [
              {
                activegroup: 'wwwf'
              },
              {
                activegroup: 'wwwf'
              }, {
                activegroup: 'wwwf'
              }, {
                activegroup: 'wwwf'
              }, {
                activegroup: 'wwwf'
              }, {
                activegroup: 'wwwf'
              }, {
                activegroup: 'wwwf'
              }, {
                activegroup: 'wwwf'
              }
            ] */
            if (response.data && response.data.length > 0) {
              if (this.page.pageSize > response.data.length) {
                this.loadMore.hasMore = false
                this.loadMore.loading = false
                this.loadMore.tip = '我是有底线的'
              } else {
                this.loadMore.hasMore = true
              }
              for (var i = 0; i < response.data.length; i++) {
                this.idList.push(response.data[i])
              }
            } else {
              this.loadMore.hasMore = false
              this.loadMore.loading = false
              this.loadMore.tip = '我是有底线的'
            }
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    },
    search: function () {
      this.idList = []
      this.loadMore = { loading: true, hasMore: true, tip: '正在加载' }
      this.page.pageNum = 1
      this.getIdList()
    }
  },
  mounted: function () {
    const clipboard = new Clipboard('.btn')
    clipboard.on('success', function () {
      alert('复制成功')
    })
  },
  created: function () {
    this.getIdList()
  }
}
</script>

<style scoped>
.search {
  padding: 20px 5px 5px 5px;
  font-size: 16px;
}

.search input {
  padding: 5px 20px 5px 5px;
  width: 80px;
  outline: none;
}

.search .active {
  color: #a72185;
}

.id-list {
  font-size: 12px;
  padding: 5px;
}

.id-item {
  position: relative;
  padding: 5px 10px;
  vertical-align: middle;
}

.id-list .id-item:nth-child(odd) {
  background: #fff;
}

.id-list .id-item:nth-child(even) {
  background: #eee;
}

.id-item .float-right {
  margin-top: 3px;
}

.id-item .top {
  padding-bottom: 10px;
  color: #585858;
}

.nickname {}

.id-img {
  padding-left: 10px;
}

.under-right {
  text-align: right;
}

.header {
  position: relative;
  background: #eee;
  background-size: cover;
  width: 100%;
  color: #000;
  font-size: 14px;
  border: 1px solid #ccc;
}

.header .content {
  position: relative;
  padding: 20px 15px;
  font-size: 12px;
  vertical-align: middle;
  z-index: 1;
}

.header .content .avatar {
  position: absolute;
  width: 50px;
  height: 50px;
  padding: 3px;
  margin: auto 0;
  background: #fff;
  border-radius: 5px;
  top: 0;
  bottom: 0;
  z-index: 1;
}

.header .content .avatar img {
  width: 100%;
  height: 100%;
}

.header .content .info {
  padding-left: 65px;
}

.header .content .info .trend {
  float: left;
  margin-left: 10px;
}

.header .content .info .trend img {
  margin-top: 6px;
  height: 16px;
}

.header .content .info .arrow img {
  margin-top: 8px;
  height: 20px;
}

.btn {
  display: block;
  text-align: center;
  background: none;
  margin: 0 auto;
  border: none;
  border-radius: 5px;
  color: #FFF;
}

.btn.btn-normal {
  background: #a72184;
  padding: 5px 5px;
  margin-left: 3px;
}

.header .logo {
  margin-top: 10px;
  width: 25%;
}

.header .code {
  padding: 0 10px;
}

.header .code .code-value {
  padding: 4px 10px;
  background: #fff;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.header .bottom {
  text-align: left;
  padding: 10px;
  font-size: 12px;
}
</style>
