<template>
  <div class="asm-search-index">
    <div class="index-header">
      <asm-header></asm-header>
    </div>
    <div class="asm-index-search-box">
      <asm-search-box @search="search"></asm-search-box>
    </div>
    <div class="index-bottom-bg">
      <div class="item">
        <div class="t"><span id="myTargetElement1"></span></div>
        <div class="b"><span>应用收录</span></div>
      </div>
      <div class="item">
        <div class="t"><span id="myTargetElement2"></span></div>
        <div class="b"><span>关键词追踪</span></div>
      </div>
      <div class="clear"></div>
    </div>
  </div>
</template>
<script>
  import AsmHeader from '../../components/search/AsmHeader.vue'
  import AsmSearchBox from '../../components/search/AsmSearchBox.vue'
  import Api from '../../api/index'
  import CountUp from '../../libs/countUp.js'
  export default {
    data () {
      return {
        obj: {
          appCount: 0,
          wordCount: 1,
        }
      }
    },
    mounted () {
      this.getFindIndexCount()
    },
    components: {
      AsmHeader,
      AsmSearchBox
    },
    methods: {
      getFindIndexCount () {
        let params = {}
        Api.getFindIndexCount(params).then(response => {
          console.log(response.data)
          if (!response.data.meta.success) {
            this.$alert(response.data.meta.message)
          } else {
            this.obj = response.data.data
            this.myCountUp()
          }
        }, response => {
          this.$alert('服务器出错')
        })
      },
      myCountUp () {
        const options = {
          useEasing: true,
          useGrouping: true,
          separator: ',',
          decimal: '.',
          prefix: '',
          suffix: ''
        }
        let demo1 = new CountUp('myTargetElement1', 0, this.obj.appCount, 0, 1.5, options)
        let demo2 = new CountUp('myTargetElement2', 0, this.obj.wordCount, 0, 1.5, options)
        demo1.start()
        demo2.start()
      },
      search (obj) {
        if (obj && obj.type === 'KEYWORD') {
          this.$router.push('/results?type=0&q=' + obj.v)
        }
        if (obj && obj.type === 'APPID') {
          this.$router.push('/results?type=1&q=' + obj.v)
        }
      }
    }
  }
</script>
<style scoped>
  .asm-search-index {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #181831 url('../../assets/search/asm-search-bg.png') no-repeat center top fixed;
    background-size: cover;
  }
  .asm-index-search-box {
    width: 600px;
    position: absolute;
    top: 30%;
    left: 50%;
    margin-left: -300px;
  }
  .index-bottom-bg {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 180px;
    background-color: rgba(255, 255, 255, 1.0);
  }
  .index-bottom-bg .item {
    width: 50%;
    float: left;
    text-align: center;
    color: #363636;
    padding-top: 40px;
    font-weight: bold;
  }
  .index-bottom-bg .item .t {
    font-size: 40px;
    margin-bottom: 10px;
  }
  .index-bottom-bg .item .b {
    font-size: 30px;
  }
</style>
