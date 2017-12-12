<template>
  <div style="flex:1;overflow: auto; position: relative;height:100%;">
    <w-user-header :user="user"></w-user-header>
    <div style="padding:20px 20px;" class="flex-row">
      <div class="flex-avg">
        <p>下级人数</p>
        <p class="number">{{activeCodeCount.subCount}}</p>
      </div>
      <div class="flex-avg">
        <p>冻结ID</p>
        <p class="number">{{activeCodeCount.freeCount }}</p>
      </div>
      <div class="flex-avg">
        <router-link to="/user/unactiveidlist">
          <p>未激活ID</p>
          <p class="number">{{activeCodeCount.noActiveCount}}</p>
        </router-link>
      </div>
    </div>
    <div style="color:#fff;background:#999;text-align:center;padding:5px 0;">
      冻结ID
    </div>
    <div class="table-wrap">
      <table class="table">
        <tbody v-if="frozenSubList.length>0">
          <tr v-for="l in frozenSubList" :key="l.id">
            <td>
              <div v-text="l.loginname"></div>
            </td>
            <td>
              <span>ID</span>
              <span v-text="l.code"></span>
            </td>
            <td>
              <span>数据流</span>
              <span v-text="l.point"></span>
            </td>
          </tr>
        </tbody>
        <tbody v-if="frozenSubList.length === 0">
          <tr>
            <td colspan="5">无冻结ID</td>
          </tr>
        </tbody>
      </table>
    </div>
  
  </div>
</template>


<script>
import WUserHeader from '@/components/UserHeader'

export default {
  name: 'frozenIdList',
  components: {
    WUserHeader
  },
  data: function () {
    return {
      user: {

      },
      frozenSubList: [],
      activeCodeCount: {}
    }
  },
  methods: {
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
    },
    getFreezeSub: function () {
      this.$http.post('member/getFreezeSub', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.frozenSubList = response.data
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  },
  created: function () {
    this.getMyInfo()
    this.getFreezeSub()
    this.getAllActiveCodeCount()
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

.flex-avg .number{
  color: #b52d7e;
}

.flex-avg img {
  height: 30px;
}

.table {
  width: 100%;
  text-align: center;
  font-size: 14px;
  border-collapse: collapse;
}

.table tbody {
  font-size: 12px;
}

.table tbody tr {
  height: 40px;
  padding: 5px 10px;
}

tbody tr td {
  position: relative;
  text-align: center;
}

.table tbody tr {
  background: #eee;
}
</style>
