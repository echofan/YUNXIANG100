<template>
  <div>
    <tree-item :data="child" v-for="child in data.children" :key="child.id"></tree-item>
  </div>
</template>

<script>
import TreeItem from './TreeItem'

export default {
  name: 'tree',
  props: ['data'],
  components: {
    TreeItem
  },
  data: function () {
    return {
      options: {

      }
    }
  },
  methods: {}
}
</script>

<style>
.tree-item {
  font-size: 12px;
  padding-left: 20px;
  white-space: nowrap;
}
</style>
