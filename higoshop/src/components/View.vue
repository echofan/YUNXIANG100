<template>
    <div class="view">
      <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'view',
  data () {
    return {
      msg: 'View'
    }
  }
}
</script>

<style scoped>
    .view{
        display: flex;
        flex-direction: column;
        width: 100%; 
        height: 100%;
    }
</style>

