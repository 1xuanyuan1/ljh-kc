<template>
  <div class="asm-search-result">
    <div class="index-header">
      <asm-header :active="true"></asm-header>
    </div>
    <div class="info">
      <div class="l">
        <span class="b blue">【{{obj2.keyword}}】</span><span class="b">的竞价广告主</span>
        <!--<span class="s blue">（</span><span class="s">共{{obj2.length}}个</span><span class="s blue">）</span>-->
      </div>
      <div class="asm-result-search-box">
        <asm-search-box :isLightTheme="true" @search="search"></asm-search-box>
      </div>
      <div class="clear"></div>
    </div>
    <div class="results more-results">
      <div class="back-button">
        <span @click="backToResult">返回搜索结果</span>
      </div>
      <asm-table :columns="columns"
                 :datas="obj.data"
                 :isShowPage="false"
                 :page-size="15"
                 @buttonAction="buttonAction"></asm-table>
      <asm-loading v-if="isLoading"></asm-loading>
    </div>
  </div>
</template>
<script>
  import AsmHeader from '../../components/search/AsmHeader.vue'
  import AsmTable from '../../components/table'
  import Api from '../../api'
  import AsmLoading from '../../components/AsmLoading.vue'
  import AsmSearchBox from '../../components/search/AsmSearchBox.vue'
  export default {
    data () {
      return {
        columns: [],
        obj: {},
        obj2: {
          keyword: '',
          length: 0,
          type: 0,
          q: ''
        },
        isLoading: false
      }
    },
    mounted () {
      this.obj2.keyword = this.$route.query.keyword
      this.obj2.type = this.$route.query.type || 0
      this.obj2.q = this.$route.query.q
      this.initTableHeader()
      this.getAllAdvertiser()
    },
    components: {
      AsmHeader,
      AsmTable,
      AsmLoading,
      AsmSearchBox
    },
    methods: {
      initTableHeader () {
        this.columns = [
          {
            title: '序号',
            field: '',
            align: 'center',
            order: true
          },
          {
            title: '图标',
            field: 'artworkUrl60',
            align: 'center',
            action: 'url'
          },
          {
            title: '竞价广告主',
            field: 'trackName',
            align: 'center'
          }
        ]
        this.datas = [
          {
            name: '美颜1',
            url: 'http://is1.mzstatic.com/image/thumb/Purple122/v4/93/5f/89/935f8983-5ef2-7190-bd14-f262beef4357/source/175x175bb.jpg'
          }
        ]
      },
      getAllAdvertiser () {
        this.isLoading = true
        let params = {
          word: this.obj2.keyword
        }
        Api.getAllAdvertiser(params).then(response => {
          if (!response.data.meta.success) {
            this.$alert(response.data.meta.message)
            this.isLoading = false
          } else {
            this.obj.data = response.data.data
            this.obj2.length = response.data.data.length
            this.isLoading = false
          }
        }, response => {
          this.$alert('服务器出错')
          this.isLoading = false
        })
      },
      search (obj) {
        if (obj && obj.type === 'KEYWORD') {
          this.$router.push('/results?type=0&q=' + obj.v)
        } else if (obj && obj.type === 'APPID') {
          this.$router.push('/results?type=1&q=' + obj.v)
        }
      },
      buttonAction (index, item) {
        console.log(item)
      },
      backToResult () {
        this.$router.push('/results?type=' + this.obj2.type + '&q=' + this.obj2.q)
       // window.history.back(-1)
//        this.$router.go(-1)
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
  .search-box {
    float: right;
    width: 500px;
    height: 40px;
    border: 1px solid #0080cc;
    position: relative;
    background: white;
    border-radius: 5px;
  }
  .search-box input {
    position: absolute;
    top: 0;
    width: 85%;
    height: 40px;
    border: none;
    background: none;
    outline: none;
    padding-left: 20px;
    font-size: 16px;
  }
  .search-box .search-button {
    position: absolute;
    top: 0;
    right: 0;
    width: 15%;
    height: 40px;
    text-align: center;
    cursor: pointer;
  }
  .search-box .search-button img {
    margin-top: 5px;
  }
  .results {
    margin: 82px auto;
    width: 1024px;
  }
  .back-button {
    text-align: right;
  }
  .back-button span {
    display: inline-block;
    width: 130px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: pointer;
    background-color: #0080cc;
    color: white;
    margin-bottom: 30px;
    border-radius: 8px;
  }
  .back-button span:hover {
    background-color: #0060cc;
  }
</style>



// WEBPACK FOOTER //
// More.vue?324a05eb