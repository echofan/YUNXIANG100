<template>
  <div style="flex:1;overflow: auto; position: relative;height:100%;">
    <w-user-header :user="user"></w-user-header>
    <div style="padding:20px 20px;" class="flex-row">
      <div class="flex-avg">
        <p>下级人数</p>
        <p class="number">{{activeCodeCount.subCount}}</p>
      </div>
      <div class="flex-avg">
        <router-link to="/user/frozenidlist">
          <p>冻结ID</p>
          <p class="number">{{activeCodeCount.freeCount }}</p>
        </router-link>
      </div>
      <div class="flex-avg">
        <router-link to="/user/unactiveidlist">
          <p>未激活ID</p>
          <p class="number">{{activeCodeCount.noActiveCount}}</p>
        </router-link>
      </div>
    </div>
    <div>&nbsp;&nbsp;&nbsp;数据流统计</div>
    <hr>
    <div class="table-wrap">
      <tree :data="level"></tree>
    </div>
  
  </div>
</template>


<script>
import WUserHeader from '@/components/UserHeader'
import Tree from '@/components/Tree'

export default {
  name: 'userCenter',
  components: {
    WUserHeader, Tree
  },
  data: function () {
    return {
      level: {
        children: []
      },
      user: {

      },
      activeCodeCount: {}
    }
  },
  methods: {
    getSubByParentId: function () {
      this.$http.post('member/getSubByParentId', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          parentId: this.$cookie.get('memberId')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.level.children = response.data
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
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
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    },
    getAllActiveCodeCount: function () {
      this.$http.post('member/getAllActiveCodeCount', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.activeCodeCount = response.data
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
    this.getMyInfo()
    this.getAllActiveCodeCount()
    this.getSubByParentId()
  }
}
</script>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  text-align: center;
}

.flex-avg {
  position: relative;
  flex: 1;
  font-size: 16px;
}

.flex-avg .number {
  color: #b52d7e;
}


.flex-avg img {
  height: 30px;
}

.table-wrap {
  padding: 0 10px;
  overflow: auto;
}
</style>
