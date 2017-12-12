<template>
  <div style="flex:1;overflow: auto; position: relative;background:#FFF;height:100%;">
    <div v-if="idList.length>0">
      <div class="myid" v-for="id in idList" :key="id.id">
        <p class="publish-time" v-text="id.publishTime"></p>
        <div class="info clear">
          <div class="float-left" v-text="id.memberActivationCode.code"></div>
          <div class="status float-right" style="color:#a62084;" v-if="id.memberActivationCode.status">
            <span>已激活</span>
            <img src="../assets/243634463.png" alt="" width="18px">
          </div>
          <div class="status float-right" style="color:#009b4d;" v-if="!id.memberActivationCode.status">
            <span>待激活</span>
            <img src="../assets/24364364.png" alt="" width="18px">
          </div>
        </div>
      </div>
    </div>
    <div v-if="idList.length === 0" style="padding:100px 0;">
      <p style="text-align:center;">没有已发布的ID</p>
    </div>
  
  </div>
</template>


<script>

export default {
  name: 'myPublishID',
  components: {

  },
  data: function () {
    return {
      idList: []
    }
  },
  methods: {
    getMyPublishActiveCode: function () {
      this.$http.get('activationCode/getMyPublishActiveCode', {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.idList = response.data
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
    this.getMyPublishActiveCode()
  }
}
</script>

<style scoped>
.myid {
  padding: 20px 15px;
}

.publish-time {
  font-size: 14px;
  padding: 2px 10px;
}

.myid .info {
  font-size: 20px;
  background: #eee;
  padding: 15px 20px;
  vertical-align: middle;
}

.info .status img {
  vertical-align: middle;
}
</style>
