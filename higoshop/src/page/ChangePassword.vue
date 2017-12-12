<template>
  <view-box>
    <img src="../assets/11.jpg" alt="" width="100%" height="100%" style="position:absolute;">
    <div class="main">
      <div>
        <img src="../assets/13123.png" alt="" class="log">
        <p class="title">设置密码</p>
      </div>
      <div class="form">
        <div class="form-input">
          <input type="text" name="phone" class="phone" placeholder="设置您的6位以上密码">
        </div>
        <div class="form-input">
          <input type="text" name="pas" placeholder="请再次输入6位以上密码">
        </div>
      </div>
      <div>
        <button class="next">下一步</button>
      </div>
    </div>
  </view-box>
</template>

<script>
import { ViewBox, Group, Cell } from 'vux'
export default {
  name: 'changePassword',
  components: {
    ViewBox, Group, Cell
  },
  data: function () {
    return {
      msg: 'ww'
    }
  }
}
</script>

<style scoped>
.main {
  z-index: 2;
  height: 80%;
  min-height: 80%;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.log {
  width: 50%;
}

.title {
  font-size: 24px;
  color: #fff;
}

.form {
  margin-top: 10px;
}

.form-input {
  margin-top: 20px;
}


.password-page .input{

}

input {
  background: none;
  width: 80%;
  font-size: 16px;
  border-top: none;
  border-left: none;
  border-right: none;
  color: #cac9cb;
  border-bottom: 1px solid #cac9cb;
  padding: 10px 5px 5px 10px;
  outline: none;
}

.next {
  font-size: 20px;
  border: none;
  border-radius: 10px;
  padding: 5px 100px;
  margin-top: 50px;
  color: #fff;
  background: #a72184;
}
</style>

