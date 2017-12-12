<template>
  <div style="flex:1;overflow: auto; position: relative;background:#eeeeee;height:100%;">
    <group>
      <x-input v-model="params.receiver" title="收件人 " placeholder="请输入收件人姓名"></x-input>
      <x-input v-model="params.phone" title="联系电话" type="tel" placeholder="手机号码"></x-input>
      <x-address title="" v-model="params.areaValue" raw-value :list="addressData" placeholder="请选择地址">
        <template slot="title" scope="props">
          所在区域
        </template>
      </x-address>
    </group>
    <group>
      <x-input v-model="params.street" title="所在街道" placeholder="所在街道"></x-input>
      <x-input v-model="params.address" title="详细地址" placeholder="详细地址说明"></x-input>
    </group>
    <div class="operate">
      <div>
        <button class="btn save" @click="add">保存地址</button>
      </div>
      <!-- <div>
                                                                        <button class="btn obtain">自动获取地址</button>
                                                                      </div> -->
    </div>
  </div>
</template>

<script>
import { XInput, Group, XButton, Cell, XAddress, ChinaAddressV3Data, Value2nameFilter as value2name } from 'vux'

export default {
  name: 'myPublishID',
  components: {
    XInput, Group, XButton, Cell, XAddress, ChinaAddressV3Data
  },
  data: function () {
    return {
      addressData: ChinaAddressV3Data,
      params: {
        receiver: '',
        phone: '',
        area: [],
        areaValue: [],
        street: '',
        address: ''
      }
    }
  },
  methods: {
    getAddressName: function (value) {
      return value2name(value, ChinaAddressV3Data)
    },
    add: function () {
      this.params.area = this.getAddressName(this.params.areaValue)
      if (!this.params.receiver) {
        this.$vux.toast.show({ type: 'warn', text: '收件人不能为空' })
        return
      } else if (!this.params.phone) {
        this.$vux.toast.show({ type: 'warn', text: '联系电话不能为空' })
        return
      } else if (!this.params.areaValue || this.params.areaValue.length === 0) {
        this.$vux.toast.show({ type: 'warn', text: '所在区域不能为空' })
        return
      } else if (!this.params.street) {
        this.$vux.toast.show({ type: 'warn', text: '街道地址不能为空' })
        return
      } else if (!this.params.address) {
        this.$vux.toast.show({ type: 'warn', text: '详细地址不能为空' })
        return
      }
      this.$http.post('member/addAddress', null, {
        params: {
          memberId: this.$cookie.get('memberId'),
          token: this.$cookie.get('token'),
          ...this.params
        }
      })
        .then(response => {
          return response.data
        }).then(response => {
          if (response.code === 0) {
            this.$router.push('/user/deliveryaddress')
          } else {
            this.$vux.toast.show({ type: 'warn', text: response.msg })
          }
        })
    }
  }
}
</script>

<style scoped>
.list {
  background: #FFF;
  margin-top: 20px;
}

.list-item {
  padding: 5px 15px;
  font-size: 18px;
  border-top: 1px solid #eee;
}

.list-item input {
  font-size: 16px;
  width: 150px;
  padding: 10px;
  border: none;
  outline: none;
}

.operate {
  text-align: center;
  padding: 30px 0;
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

.btn.obtain {
  margin-top: 20px;
  background: #8b8b8b;
  width: 200px;
  padding: 10px 20px;
}
</style>
