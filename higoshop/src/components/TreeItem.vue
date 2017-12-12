<template>
  <div class="tree-item needsclick">
    <div @click="loadChildren(data)" class="needsclick">
      <img v-if="data.hasChild && !data.children" src="../assets/triangle_right_18.331658291457px_1189854_easyicon.net.png" alt="" height="12px">
      <img v-if="data.hasChild && data.children" src="../assets/triangle_down_55.095652173913px_1189852_easyicon.net.png" alt="" width="12px">
      <span v-text="data.loginname" class="needsclick"></span>
      <span>
        ID
        <span v-text="data.code"></span>
      </span>
      <span>
        数据流
        <span v-text="data.point"></span>
      </span>
      <span v-if="data.status === 2" style="color:#e4222a">冻结</span>
      <span v-if="data.status === 3" style="color:#00a1e9">失效</span>
    </div>
    <tree-item :data="child" v-for="child in data.children" :key="child.id"></tree-item>
  </div>
</template>
<script>
export default {
  name: 'treeItem',
  props: ['data', 'options'],
  methods: {
    loadChildren: function (parent) {
      if (parent.hasChild && !parent.children) {
        this.$http.post('member/getSubByParentId', null, {
          params: {
            memberId: this.$cookie.get('memberId'),
            token: this.$cookie.get('token'),
            parentId: parent.id
          }
        })
          .then(response => {
            return response.data
          }).then(response => {
            if (response.code === 0) {
              this.$set(parent, 'children', response.data)
            } else {
              this.$vux.toast.show({ type: 'warn', text: response.msg })
            }
          })
      }
    }
  }
}
</script>

<style>

</style>
