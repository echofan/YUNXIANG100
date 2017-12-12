<template>
  <div style="height:100%;overflow:auto;">
    <w-user-header :user="user"></w-user-header>
    <div>
      <table class="table">
        <thead>
          <tr>
            <th></th>
            <th>职位</th>
            <th>完成条件</th>
            <th>时间</th>
            <th>趋势</th>
            <th>收益</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, index) in conditionList" :key="c.id">
            <td>{{index+1}}</td>
            <td>
              <img :src="c.logo" alt="" width="70px;">
            </td>
            <td v-text="c.remark"></td>
            <td v-text="c.timeLimit">24/h</td>
            <td v-text="c.point">10</td>
            <td v-text="c.award">10</td>
          </tr>
        </tbody>
      </table>
    </div>
  
  </div>
</template>


<script>
import WUserHeader from '@/components/UserHeader'

export default {
  name: 'upgradeCondition',
  components: {
    WUserHeader
  },
  data: function () {
    return {
      user: {},
      conditionList: []
    }
  },
  methods: {
    getConditionList: function () {
      this.$http.post('memberLevel/list')
        .then(response => {
          return response.data
        }).then(response => {
          this.conditionList = response.data
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
    }
  },
  created: function () {
    this.getMyInfo()
    this.getConditionList()
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

.flex-avg img {
  height: 30px;
}

.table-wrap {
  padding: 0 10px;
}

.table {
  width: 100%;
  text-align: center;
  font-size: 14px;
  border-collapse: collapse;
}

.table thead tr {
  height: 25px;
  background: #fff;
}

thead tr th {
  font-weight: normal;
}

.table tbody {
  font-size: 12px;
}

.table tbody tr {
  height: 50px;
  padding: 10px;
}

tbody tr td {
  min-width: 30px;
  padding: 5px 3px;
}
</style>
