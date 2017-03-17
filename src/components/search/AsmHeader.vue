<template>
  <div class="asm-search-nav" :class="{'active': active}">
    <div class="inner">
      <div class="logo">
        <router-link to="/">
          <img src="../../assets/search/asm-search-logo.png">
        </router-link>
      </div>
      <ul>
        <li>
          <a href="http://asm.liangjianghu.com/" target="_blank">
            <span>首页</span>
          </a>
        </li>
        <li>
          <a href="http://app.asm.liangjianghu.com/" target="_blank">
            <span>ASM智能投放平台</span>
          </a>
        </li>
        <li class="active">
          <a href="http://app.asm.liangjianghu.com/asm-search/">
            <span>ASM快查</span>
          </a>
        </li>
        <li>
          <a href="http://asm.liangjianghu.com/data" target="_blank">
            <span>ASM实战营</span>
          </a>
        </li>
        <li>
          <a href="http://asm.liangjianghu.com/search-ads-help/" target="_blank">
            <span>官方帮助文档</span>
          </a>
        </li>
        <li>
          <a href="http://asm.liangjianghu.com/#lb-section-5" target="_blank">
            <span>联系我们</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AsmHeader',
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
  .asm-search-nav {
    height: 100px;
    margin: 0 auto;
    position: relative;
    background-color: white;
    border-bottom: 1px solid #E0E0E1;
  }
  .asm-search-nav .inner {
    width: 970px;
    height: 100%;
    margin: 0 auto;
    position: relative;
  }
  .asm-search-nav .logo {
    padding-top: 18px;
  }
  .asm-search-nav .logo img {
    width: 145px;
    height: 64px;
  }
  .asm-search-nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    right: 0;
    bottom: 20px;
  }
  .asm-search-nav ul li {
    display: inline-block;
    margin-left: 5px;
  }
  .asm-search-nav ul li a {
    text-decoration: none;
    outline: none;
    text-decoration: none;
    font-size: 16px;
    color: #363636;
    padding: 5px 15px;
    border-radius: 5px;
  }
  .asm-search-nav ul li.active a,
  .asm-search-nav ul li:hover a {
    background-color: #1683FB;
    color: white;
  }
</style>
