<template>
  <div class="asm-search-login-tip">
    <span>登录后即可查看覆盖关键词。</span><span><a href="http://app.asm.liangjianghu.com/" target="_blank">立即登录</a></span>
  </div>
</template>

<script>
  export default {
    name: 'AsmLoginTip',
    props: {
      active: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
      }
    },
    mounted () {
    },
    methods: {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .asm-search-login-tip {
    padding-bottom: 70px;
    text-align: center;
    font-size: 16px;
  }
  .asm-search-login-tip a {
    background-color: #21B994;
    color: white;
    padding: 10px 8px;
    border-radius: 5px;
    text-decoration: none;
  }
  .asm-search-login-tip a:hover {
    background-color: #10A994;
  }
</style>
