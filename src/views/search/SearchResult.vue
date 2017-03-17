<template>
  <div class="asm-search-result">
    <div class="index-header">
      <asm-header :active="true"></asm-header>
    </div>
    <div class="info">
      <div class="l" v-if="obj2.type===0">
        <span class="b blue">【{{obj2.keyword}}】</span><span class="b">的搜索结果</span>
        <!--<span class="s blue">（</span><span class="s">共{{obj.wordListCount}}个</span><span class="s blue">）</span>-->
      </div>
      <div class="l ll" v-if="obj2.type===1">
        <img :src="obj.appInfo.appUrl60" onerror="this.src='http://www.zxinhe.com/asm/asm-search-default.png'" v-if="obj.appInfo&&obj.appInfo.appUrl60">
        <img src="http://www.zxinhe.com/asm/asm-search-default.png" v-if="obj.appInfo&&!obj.appInfo.appUrl60">
        <div class="rt">
          <span class="b blue" v-if="obj.appInfo&&obj.appInfo.appName">{{obj.appInfo.appName}}</span>
          <span class="b blue" v-if="obj.appInfo&&!obj.appInfo.appName">-</span>
          <br>
          <span>APP ID: {{obj2.keyword}}</span>
        </div>
      </div>
      <div class="asm-result-search-box">
        <asm-search-box :isLightTheme="true" :defaultKeyword="obj2.keyword" @search="search"></asm-search-box>
      </div>
      <div class="clear"></div>
    </div>
    <div class="cloud-help-wrap" v-if="obj2.cloudLength > 0">
      <el-popover
              ref="popover"
              placement="bottom"
              width="250"
              trigger="hover">
        <div class="cloud-tip">
          <span>大小表示关键词竞价成功次数</span>
          <br>
          <span>颜色表示关键词最近竞价成功的时间，颜色越热，时间越近</span>
          <ul>
            <li><span class="bg">近</span></li>
            <li><span class="bg"></span></li>
            <li><span class="bg"></span></li>
            <li><span class="bg"></span></li>
            <li><span class="bg"></span></li>
            <li><span class="bg">远</span></li>
          </ul>
        </div>
      </el-popover>
      <span class="cloud-help" v-popover:popover>?</span>
      <div class="clear"></div>
    </div>
    <div id="my_favorite_latin_words" style="width: 800px" v-if="obj2.cloudLength > 0"></div>
    <div class="results">
      <asm-table :columns="columns"
                 :datas="obj.wordList"
                 :isShowPage="false"
                 :page-size="15"
                 :empty-message="emptyMessage"
                 @buttonAction="buttonAction"></asm-table>
    </div>
    <asm-login-tip v-if="obj.wordListCount>15"></asm-login-tip>
    <asm-loading v-if="isLoading"></asm-loading>
  </div>
</template>
<script>
  import AsmHeader from '../../components/search/AsmHeader.vue'
  import AsmSearchBox from '../../components/search/AsmSearchBox.vue'
  import AsmTable from '../../components/table'
  import $ from 'jquery'
  import '../../libs/jqcloud-1.0.4'
  import '../../assets/styles/jqcloud.css'
  import Api from '../../api'
  import AsmLoading from '../../components/AsmLoading.vue'
  import AsmLoginTip from '../../components/search/AsmLoginTip.vue'
  export default {
    data () {
      return {
        columns: [],
        datas: [],
        isLoading: false,
        obj: {},
        obj2: {
          keyword: '',
          length: 0,
          cloudLength: 0,
          type: 0,
          q: ''
        },
        emptyMessage: ''
      }
    },
    watch: {
      '$route': function (newRoute, oldRoute) {
        console.log(newRoute, oldRoute)
        this.obj2.type = parseInt(this.$route.query.type) || 0
        this.obj2.keyword = this.$route.query.q
        this.initTableHeader()
        this.getAllWord()
      }
    },
    mounted () {
      this.obj2.type = parseInt(this.$route.query.type) || 0
      this.obj2.keyword = this.$route.query.q
      this.initTableHeader()
      this.getAllWord()
    },
    components: {
      AsmHeader,
      AsmTable,
      AsmLoading,
      AsmSearchBox,
      AsmLoginTip
    },
    methods: {
      initTableHeader () {
        this.columns = [
          {
            title: '关键词',
            field: 'keyword',
            align: 'center'
          },
          {
            title: '流行度',
            field: 'popularity',
            align: 'center',
            help: 'App Store中搜索频率较高的关键词'
          },
          {
            title: '热度',
            field: 'priority',
            align: 'center',
            help_rows: '关键词在App Store的搜索热度，一般来说，<br/>热度越高，表明该词每天被搜索的次数越多'
          },
          {
            title: '竞价成功次数',
            field: 'adSuccessCounts',
            align: 'center'
          },
          {
            title: '竞价广告主数量',
            field: 'advertiserCount',
            align: 'center',
            help: '同时参与该关键词竞价并获得展示的App'
          },
          {
            title: '竞价广告主',
            field: 'advertisers',
            align: 'center',
            help: '同时参与该关键词竞价并获得展示的App',
            action: 'array'
          }
        ]
        if (!this.obj2.type) {
          this.columns.splice(3, 1)
        }
      },
      getAllWord () {
        this.isLoading = true
        this.emptyMessage = '数据为空'
        let params = {
          keyword: this.obj2.keyword
        }
        Api.getAllWord(params).then(response => {
          if (!response.data.meta.success) {
            this.$alert(response.data.meta.message)
            this.isLoading = false
          } else {
            this.obj = response.data.data
            this.obj2.length = this.obj.wordList.length
            $('#my_favorite_latin_words').html('')
            this.obj2.cloudLength = 0
            if (this.obj.wordChart) {
              this.obj2.cloudLength = this.obj.wordChart.length
              let wordList = []
              this.obj.wordChart.forEach((item, i) => {
                if (i % 2) {
                  wordList.push({
                    text: item.kw,
                    weight: item.search_times,
                    hot: item.heat,
                    html: {'class': 'vertical'}
                  })
                } else {
                  wordList.push({
                    text: item.kw,
                    weight: item.search_times,
                    hot: item.heat
                  })
                }
              })
              setTimeout(function () {
                $('#my_favorite_latin_words').jQCloud(wordList)
              }, 200)
            }
            if (this.obj.wordList.length < 1) {
              if (parseInt(this.obj2.type)) {
                this.emptyMessage = '抱歉，APP ID“' + this.obj2.keyword + '”未找到，请您更换关键词或APP ID重新搜索'
              } else {
                this.emptyMessage = '抱歉，关键词“' + this.obj2.keyword + '”未找到，请您更换关键词或APP ID重新搜索'
              }
            }
            this.isLoading = false
          }
        }, response => {
          this.$alert('服务器出错')
          this.isLoading = false
        })
      },
      search (obj) {
        if (obj && obj.type === 'KEYWORD') {
          this.obj2.type = 0
          this.obj2.keyword = obj.v
          this.$router.push('/results?type=0&q=' + obj.v)
        } else if (obj && obj.type === 'APPID') {
          this.obj2.type = 1
          this.obj2.keyword = obj.v
          this.$router.push('/results?type=1&q=' + obj.v)
        }
      },
      buttonAction (index, item) {
        console.log(item)
        this.$router.push('/more?type=' + this.obj2.type + '&q=' + this.obj2.keyword + '&keyword=' + item.keyword)
      }
    }
  }
</script>
<style scoped>
  .asm-search-result .index-header {
    background-color: #0080cc;
  }
  .info {
    width: 1024px;
    margin: 30px auto;
    padding: 50px 0;
    border-bottom: 1px solid #0080cc;
  }
  .info .l {
    float: left;
  }
  .info .l span.b {
    font-size: 25px;
    color: #1e1e1e;
  }
  .info .l span.s {
    font-size: 18px;
  }
  .info .l span.blue {
    color: #0080cc;
  }
  .info .l.ll img {
    width: 60px;
    float: left;
    background-color: lightgray;
    padding: 1px;
    border-radius: 8px;
  }
  .info .l.ll .rt {
    padding-left: 70px;
  }
  .info .l.ll .rt span:last-child {
    margin-left: 1px;
  }
  .results {
    margin: 82px auto;
    width: 1024px;
  }
  #my_favorite_latin_words {
    width: 90%;
    height: 350px;
    margin: 0 auto;
  }
  .cloud-help-wrap {
    width: 1024px;
    margin: 0 auto;
  }
  span.cloud-help {
    float: right;
    margin-right: 30px;
    background-color: #0080cc;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 15px;
    text-align: center;
    display: inline-block;
  }
  .cloud-tip {
    font-size: 16px;
    color: #1e1e1e;
    padding-bottom: 60px;
  }
  .cloud-tip ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .cloud-tip ul li {
    position: relative;
    margin-top: 12px;
    width: 16.66%;
    height: 20px;
    float: left;
  }
  .cloud-tip ul li span:nth-child(2) {
    position: absolute;
    top: 0;
    left: 90px;
    line-height: 20px;
    font-size: 20px;
    display: none;
  }
  .cloud-tip ul li:nth-child(1) span.bg {
    position: absolute;
    top: 25px;
    left: 0;
  }
  .cloud-tip ul li:nth-child(6) span.bg {
    position: absolute;
    top: 25px;
    right: 0;
  }
  .cloud-tip ul li:nth-child(1) {
    background-color: #cf2b41;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }
  .cloud-tip ul li:nth-child(2) {
    background-color: #ff9700;
  }
  .cloud-tip ul li:nth-child(3) {
    background-color: #229d05;
  }
  .cloud-tip ul li:nth-child(4) {
    background-color: #04908a;
  }
  .cloud-tip ul li:nth-child(5) {
    background-color: #3327fa;
  }
  .cloud-tip ul li:nth-child(6) {
    background-color: #494949;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
</style>
