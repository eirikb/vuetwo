<template>
  <div>
    <p>
      <b>I am child, {{test}}</b>
    </p>
  </div>
</template>

<style scoped="true" lang="sass">
  p {
    b {
      color: red;
    }
  }
</style>

<script>
  export default {
    data() {
      return {
        test: 'world!'
      };
    }
  }
</script>
