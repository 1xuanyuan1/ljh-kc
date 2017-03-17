<template>
  <div class="asm-loading">
    <!-- <img src="../assets/images/asm-loading.gif"> -->
  </div>
</template>

<script>
export default {
  name: 'asmLoading',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .asm-loading {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    font-size: 16px;
    color: white;
    text-align: center;
    border-radius: 4px;
    background: rgba(255,255,255,0.4);
  }
  .asm-loading img {
    position: absolute;
    top: 40%;
    left: 50%;
  }
</style>



// WEBPACK FOOTER //
// AsmLoading.vue?37c22cb1
