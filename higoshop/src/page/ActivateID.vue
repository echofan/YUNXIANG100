<template>
  <div class="page">
    <div class="logo">
      <img src="../assets/20170730004638.png" alt="" width="80%">
    </div>
    <div class="id-input">
      <input type="text" v-model="params.id" placeholder="输入激活ID">
    </div>
    <div>
      <button class="btn btn-normal" @click="activeMember">我要激活</button>
    </div>
    <div class="specification">
      <span>购物流程</span>
      &nbsp;
      <span>|</span>
      &nbsp;
      <span>激活说明</span>
    </div>
    <div class="iddating">
      <div>
        <router-link to="/iddating">
          <img src="../assets/1325325325.png" alt="">
          <p>ID大厅</p>
        </router-link>
        <p style="font-size:12px;margin-top:20px;">请到ID大厅免费领取</p>
      </div>
    </div>
  </div>
</template>


<script>

export default {
  name: 'activateId',
  components: {

  },
  data: function () {
    return {
      params: {
        id: ''
      }
    }
  },
  methods: {
    activeMember: function () {
      if (!this.params.id) {
        this.$vux.toast.show({ type: 'warn', text: '请输入ID' })
        return
      }
      this.$http.post('activationCode/activeMember', null, {
        params: {
          memberId: this.$route.query.memberId,
          code: this.params.id
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.$vux.toast.show({ text: '激活成功' })
            this.$router.replace('/login')
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  },
  created: function () {

  }
}
</script>

<style scoped>
.page {
  flex: 1;
  overflow: auto;
  position: relative;
  height: 100%;
  text-align: center;
  background: url(../assets/20170730004642.png) repeat center center;
  background-size: 100% 100%;
}

.logo {
  padding: 40px 0;
}

.id-input {
  padding-bottom: 30px;
}

.id-input input {
  width: 60%;
  padding: 7px 10px;
  font-size: 16px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  outline: none;
}

.btn {
  display: block;
  text-align: center;
  background: none;
  margin: 0 auto;
  border: none;
  border-radius: 10px;
  color: #FFF;
}

.btn.btn-normal {
  font-size: 18px;
  background: #a72184;
  width: 60%;
  padding: 6px 20px;
}

.specification {
  padding: 10px 0;
  color: #a72184;
  font-size: 16px;
}

.iddating {
  color: #fff;
}

.iddating img {
  width: 50px;
}
</style>
