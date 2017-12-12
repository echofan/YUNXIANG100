<template>
  <div style="flex:1;overflow: auto; position: relative;background:#FFF;height:100%;">
    <div style="padding:20px;">
      <span>编组：{{user.activeGroup}}</span>
    </div>
    <div v-if="idList && idList.length>0">
      <div class="id-item" v-for="id in idList" :key="id.id">
        <div class="id">
          <span v-text="id.code">AD006552PPW3</span>
          <img src="../assets/2363464.png" alt="">
        </div>
        <div class="clear enable" v-if="id.status">
          <div class="float-left">
            <div>
              <img :src="id.activeMember && id.activeMember.memberLevel.logo" alt="" height="20px">
            </div>
            <div class="avatar">
              <img v-if="id.activeMember.headImg" :src="id.activeMember.headImg" alt="">
              <img v-if="!id.activeMember.headImg" src="../assets/12353.png" alt="">
            </div>
          </div>
          <div class="float-left">
            <p>账户：
              <span v-text="id.activeMember && id.activeMember.loginname"></span>
            </p>
            <p>昵称：
              <span v-text="id.activeMember && id.activeMember.nickname"></span>
            </p>
            <p>
              <img src="../assets/324346rsf.png" alt="" width="20px">
              <span v-text="id.activeMember && id.activeMember.memberAccout.point">120000</span>
              <span class="status">已激活
                <img src="../assets/243634463.png" alt="" width="18px">
              </span>
            </p>
          </div>
        </div>
        <div class="clear unenable" v-if="!id.status">
          <div class="float-left" @click="toPublishPage(id)">
            <img src="../assets/1325325325.png" alt="" width="20px"> ID发布
          </div>
          <div class="float-right">待激活
            <img src="../assets/24364364.png" alt="" width="18px">
          </div>
        </div>
      </div>
    </div>
    <div v-if="!idList || idList.length === 0">
      <p style="text-align:center;color:#999;">当前还没有ID</p>
    </div>
    <div style="text-align:center;margin-top:30px;padding:5px 20px;">
      <router-link class="btn" to="/iddating">
        <img style="vertical-align: middle;" src="../assets/20170723232248.png" alt="" width="30px"> ID发布大厅
      </router-link>
      <router-link class="btn" to="/user/mypublishid">
        <p>已发布任务</p>
      </router-link>
    </div>
    <div style="text-align:left;font-size:12px;padding:0 20px;">
      <p>说明：</p>
      <p>1、二个ID全部激活并为正式会员可升级成为专营店长，系统正式开设分配大数据流量到你的店铺消费。</p>
      <p>2、如果生成激活ID超过72小时未激活，或未能按时购物导致系统账户失效返回上级将返回待重新分配。</p>
    </div>
  
  </div>
</template>


<script>

export default {
  name: 'payPublish',
  components: {

  },
  data: function () {
    return {
      user: {},
      idList: [],
      id: 'AD006552PPW3',
      charge: 50
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
          }
        })
    },
    getMyActiveCode: function () {
      this.$http.get('activationCode/getMyActiveCode', {
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
    },
    toPublishPage: function (id) {
      this.$http.post('activationCode/existIdHall', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          activeCodeId: id.id
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            location.href = '/higo/open/api/activationCode/toPublishPage?memberId=' + this.$cookie.get('memberId') + '&token=' + this.$cookie.get('token') + '&activeCodeId=' + id.id
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
    this.getMyActiveCode()
  }
}
</script>

<style scoped>
.id-item {
  padding: 0 30px;
}

.id {
  position: relative;
  padding: 5px 10px;
  background: #eee;
  font-size: 18px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.id img {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  right: 5px;
  width: 22px;
  vertical-align: middle;
}

.avatar {
  width: 55px;
  height: 55px;
  padding: 3px;
  margin: auto 0;
  background: #fff;
  border-radius: 5px;
  top: 0;
  bottom: 0;
  z-index: 1;
}

.avatar img {
  width: 100%;
  height: 100%;
}

.enable {
  position: relative;
  text-align: left;
  font-size: 12px;
}

.enable>div {
  padding: 5px;
}

.enable p {
  padding: 3px 0;
}

.enable .status img {
  margin-bottom: -3px;
}

.id-item .status {
  position: absolute;
  right: 0;
  font-size: 16px;
  color: #a0247f;
}

.unenable {
  padding: 10px 0;
  font-size: 16px;
}

.unenable img {
  margin-bottom: -4px;
}

.unenable>.float-right {
  color: #009b4d;
}

.btn {
  display: inline-block;
  width: 48%;
  height: 40px;
  border-radius: 10px;
  padding: 5px 10px;
  font-size: 15px;
  vertical-align: middle;
  background: #a72184;
  color: #fff;
  box-sizing: border-box;
}
</style>
