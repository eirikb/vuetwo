<template>
  <div>
    <h1>Hello, {{test}}!</h1>
    <child></child>
  </div>
</template>

<style lang="less">
  div {
    h1 {
      color: blue;
    }
  }
</style>

<script type="text/babel">
  import Child from './child.vue';

  export default {
    components: {Child},
    data() {
      return {
        test: 'world!'
      };
    }
  };
</script>