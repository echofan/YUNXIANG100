<template>
  <div style="flex:1;overflow: auto; position: relative;background:#eee;height:100%;">
    <div v-if="addressList && addressList.length>0">
      <div class="address-item" v-for="(d, index) in addressList" :key="d.id">
        <div class="info tf">
          <div class="user">
            <span class="name" v-text="d.receiver"></span>
            <span class="phone" v-text="d.phone"></span>
          </div>
          <div class="address">
            <span v-text="d.area"></span>
            <span v-text="d.street"></span>
            <span v-text="d.address"></span>
          </div>
        </div>
        <div class="flex-row operate">
          <div class="flex-avg tf">
            <img src="../assets/987887.png" alt="" @click="setDefaultAddress(index)"> 设为默认地址
          </div>
          <div class="flex-avg tr">
            <img src="../assets/987887.png" alt="">
            <router-link :to="{name:'ChangeDeliveryAddress',params: { id: d.id}}">修改</router-link>
            <img src="../assets/132542323.png" alt="">
            <a href="javascript:void(0);" @click="deleteAddress(index)">删除</a>
          </div>
        </div>
      </div>
    </div>
    <div class="address-item" v-if="deafultAddress && deafultAddress.id">
      <div class="info tf">
        <div class="user">
          <span class="name" v-text="deafultAddress.receiver"></span>
          <span class="phone" v-text="deafultAddress.phone"></span>
        </div>
        <div class="address">
          <span v-text="deafultAddress.area"></span>
          <span v-text="deafultAddress.street"></span>
          <span v-text="deafultAddress.address"></span>
        </div>
      </div>
      <div class="flex-row operate">
        <div class="flex-avg tf">
          <img src="../assets/243634463.png" alt="" @click="setDefaultAddress(index)"> 设为默认地址
        </div>
        <div class="flex-avg tr">
          <img src="../assets/987887.png" alt="">
          <router-link :to="{name:'ChangeDeliveryAddress',params: { id: deafultAddress.id}}">修改</router-link>
          <img src="../assets/132542323.png" alt="">
          <a href="javascript:void(0);" @click="deleteDefaultAddress()">删除</a>
        </div>
      </div>
    </div>
    <div style="text-align:center;margin-top:30px;">
      <router-link to="/user/address/add">
        <button class="btn save">新增收货地址</button>
      </router-link>
    </div>
  </div>
</template>


<script>

export default {
  name: 'deliveryAddress',
  components: {

  },
  data: function () {
    return {
      addressList: [],
      deafultAddress: {}
    }
  },
  methods: {
    getAddressList: function () {
      this.$http.post('member/getMyAddress', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token')
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          this.addressList = response.data.addressList
          this.deafultAddress = response.data.deafultAddress
        })
    },
    deleteAddress: function (index) {
      this.$http.post('member/deleteAddress', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          addressId: this.addressList[index]['id']
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.addressList.splice(index, 1)
            this.$vux.toast.show({ text: '删除成功' })
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    },
    setDefaultAddress: function (index) {
      this.$http.post('member/setDefaultAddress', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          addressId: this.addressList[index]['id']
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            if (this.deafultAddress) {
              this.addressList.push(this.deafultAddress)
            }
            this.deafultAddress = this.addressList.splice(index, 1)[0]
            this.$vux.toast.show({ text: '设置成功' })
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    },
    deleteDefaultAddress: function () {
      this.$http.post('member/deleteAddress', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          addressId: this.deafultAddress.id
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.deafultAddress = null
            this.$vux.toast.show({ text: '删除成功' })
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  },
  created: function () {
    this.getAddressList()
  }
}
</script>

<style scoped>
.info {
  color: #5f5d5e;
  padding: 10px 20px;
}

.tf {
  text-align: left;
}

.tr {
  text-align: right
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-avg {
  position: relative;
  flex: 1;
  font-size: 14px;
}

.address-item {
  background: #fff;
  margin-top: 15px;
  font-size: 16px;
  padding: 5px 0px;
}

.info .address {
  padding: 3px 0;
  color: #a0a0a0;
  font-size: 14px;
}

.operate {
  padding: 0 20px;
  border-top: 1px solid #eee;
}

.operate>div {
  position: relative;
  vertical-align: middle;
  height: 30px;
  line-height: 30px;
}

.operate img {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.operate .tr span {
  margin-right: 10px;
}

.operate .tr img {
  width: 12px;
  height: 12px;
}

.btn {
  vertical-align: middle;
  background: none;
  border: none;
  border-radius: 10px;
  color: #FFF;
}

.btn.save {
  background: #a72184;
  width: 200px;
  padding: 10px 20px;
}
</style>
