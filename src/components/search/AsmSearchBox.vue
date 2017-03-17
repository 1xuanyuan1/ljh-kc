<template>
  <div class="search-box" :class="{'search-box-light-theme': isLightTheme, 'open': showHistory}" v-clickoutside="handleClose">
    <input v-model="keyword"
           type="text"
           placeholder="请输入关键词、APP ID或者商店链接"
           @focus="focusEvent"
           @input="inputEvent"
           @keyup.enter="search">
    <div class="search-button" @click="search" v-if="!isLightTheme"><img src="../../assets/search/asm-search-button.png"></div>
    <!-- <div class="search-button" @click="search" v-if="isLightTheme"><img src="../../assets/search/asm-search-button-2.png"></div> -->
    <div class="search-history" v-if="showHistory">
      <div class="item title">关键词</div>
      <div class="item">
        <span v-for="k in historyKeywords" @click="searchWithKeyword(k)" class="span-item">{{k}}</span>
        <span v-if="historyKeywords.length<1">暂无关键词搜索纪录</span>
      </div>
      <div class="item title">APP ID</div>
      <div class="item">
        <span v-for="k in historyAppids" @click="searchWithKeyword(k)" class="span-item">{{k}}</span>
        <span v-if="historyAppids.length<1">暂无APP ID搜索纪录</span>
      </div>
      <div class="clear" @click="clearHistory"><span>清除搜索历史</span></div>
    </div>
  </div>
</template>

<script>
  import Clickoutside from '../../libs/clickoutside'
  import Auth from '../../services/auth'
  import { parseInput } from '../utils/assist'
  export default {
    name: 'AsmSearchBox',
    props: {
      isLightTheme: {
        type: Boolean,
        default: false
      },
      defaultKeyword: {
        type: String,
        default: ''
      }
    },
    directives: { Clickoutside },
    data () {
      return {
        keyword: '',
        showHistory: false,
        historyKeywords: [],
        historyAppids: [],
        obj: {}
      }
    },
    mounted () {
      this.keyword = this.defaultKeyword
      this.initHistory()
    },
    watch: {
      defaultKeyword: function () {
        this.keyword = this.defaultKeyword
      }
    },
    methods: {
      focusEvent () {
        console.log('focusEvent...')
        if (this.keyword || this.historyCount() < 1) {
          this.showHistory = false
        } else {
          this.showHistory = true
        }
      },
      inputEvent () {
        console.log('inputEvent...')
        if (this.keyword || this.historyCount() < 1) {
          this.showHistory = false
        } else {
          this.showHistory = true
        }
      },
      handleClose () {
        this.showHistory = false
      },
      initHistory () {
        this.historyKeywords = Auth.getKeywords()
        this.historyAppids = Auth.getAppids()
      },
      historyCount () {
        return this.historyKeywords.length + this.historyAppids.length
      },
      clearHistory () {
        console.log('清除历史')
        Auth.clearHistory()
        this.initHistory()
      },
      search () {
        if (!this.keyword.trim()) {
          return
        }
        const obj = parseInput(this.keyword.trim())
        console.log(obj)
        if (obj && obj.type === 'KEYWORD') {
          if (this.keyword.length > 50) {
            window.alert('关键词长度不超过50个字符')
          } else {
            Auth.addKeyword(this.keyword)
            this.$emit('search', {type: 'KEYWORD', v: this.keyword})
          }
        } else if (obj && obj.type === 'APPID') {
          Auth.addAppid(this.keyword)
          this.$emit('search', {type: 'APPID', v: this.keyword})
        } else if (obj && obj.type === 'URL') {
          if (obj.value) {
            Auth.addAppid(obj.value)
            this.$emit('search', {type: 'APPID', v: obj.value})
          } else {
            window.alert('请输入有效的url')
          }
        }
        this.initHistory()
      },
      searchWithKeyword (k) {
        this.keyword = k
        this.search()
        this.handleClose()
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .search-box {
    width: 100%;
    height: 60px;
    border: 1px solid #0080cc;
    position: relative;
    background: white;
  }
  .search-box input {
    position: absolute;
    top: 0;
    width: 85%;
    height: 60px;
    border: none;
    background: none;
    outline: none;
    padding-left: 20px;
    font-size: 20px;
  }
  .search-box .search-button {
    position: absolute;
    top: 0;
    right: 0;
    width: 15%;
    height: 60px;
    text-align: center;
    background-color: #0080cc;
    cursor: pointer;
  }
  .search-box .search-button img {
    margin-top: 15px;
  }
  .search-box .search-history {
    position: absolute;
    top: 61px;
    left: -1px;
    width: 100%;
    background-color: white;
    z-index: 999;
    border: 1px solid #0080cc;
  }
  .search-box .search-history .item {
    margin-right: 90px;
    margin-left: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 16px;
    color: #1e1e1e;
  }
  .search-box .search-history .item.title {
    border-bottom: 1px solid #0080cc;
    color: #0080cc;
  }
  .search-box .search-history .item span {
    margin-right: 10px;
  }
  .search-box .search-history .clear {
    background-color: #0080cc;
    padding-left: 20px;
    line-height: 40px;
    color: white;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
  }
  .search-box .search-history .item span.span-item:hover {
    cursor: pointer;
    color: #0080cc;
  }
  .search-box.search-box-light-theme {
    float: right;
    width: 500px;
    height: 40px;
    border: 1px solid #0080cc;
    position: relative;
    background: white;
    border-radius: 5px;
  }
  .search-box.search-box-light-theme input {
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
  .search-box.search-box-light-theme .search-button {
    position: absolute;
    top: 0;
    right: 0;
    width: 15%;
    height: 40px;
    text-align: center;
    cursor: pointer;
  }
  .search-box.search-box-light-theme .search-button img {
    margin-top: 5px;
  }
  .search-box.search-box-light-theme .search-history {
    border: 1px solid #0080cc;
  }
  .search-box.search-box-light-theme .search-history {
    top: 40px;
  }
  .search-box.search-box-light-theme.open {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .search-box.search-box-light-theme .search-button {
    background-color: white;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
  }
</style>



// WEBPACK FOOTER //
// AsmSearchBox.vue?4f115d74
