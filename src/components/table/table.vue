<template>
  <div :class="wrapClasses" :style="styles">
    <div :class="classes">
      <table cellspacing="0" cellpadding="0" border="0">
        <thead>
          <tr>
            <template v-for="column in columns">
              <th v-if="column.checkbox" :style="{'text-align':column.halign}">
                <!--<input :name="options.selectItemName" type="checkbox"-->
                <div class="cell" v-if="isShowColunmCheckbox">
                  <!--<input type="checkbox"-->
                         <!--@change="onCheckAllChange" v-model="selected.all">-->
                  <el-checkbox v-model="selected.all" @change="onCheckAllChange"></el-checkbox>
                </div>
              </th>
              <th v-else :style="{'text-align':column.halign}"
                  :title="column.titleTooltip">
                <div class="cell">
                  <span>{{ column.title }}</span>
                  <el-tooltip class="item" effect="dark" :content="column.help" placement="top" v-if="column.help">
                    <span class="help">?</span>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" placement="top" v-if="column.help_rows">
                    <div slot="content"><span v-html="column.help_rows"></span></div>
                    <span class="help">?</span>
                  </el-tooltip>
                </div>
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
        <tr v-for="(item,i) in renderData" :data-index="i">
          <template v-for="(column,j) in columns">
            <td v-if="column.checkbox"
                :class="[column.classes, {'td-disabled': item.isDisabled}]"
                :style="{'text-align':column.align,'vertical-align':column.valign}">
              <div class="cell">
                <input v-if="column.checkbox" :value="item" type="checkbox"
                       v-model="selected.items" @change="onCheckItemChange(item, i)" :disabled="item.isDisabled">
              </div>
            </td>
            <td v-else :style="{'text-align':column.align,'vertical-align':column.valign}"
                :class="column.classes">
              <div v-if="column.action=='button'" class="cell action-cell">
                <template v-for="(btn, index) in column.labels">
                  <a class="action" @click="actionButtonClicked(index, item)">{{btn}}</a>
                </template>
              </div>
              <div v-if="column.action=='linkButton'" class="cell action-cell">
                  <a class="action" @click="actionLinkButtonClicked(item)">
                    <div class="len-limit" v-html="fieldValue(item,column,i,j)"></div>
                  </a>
              </div>
              <div v-if="column.action=='link'" class="cell action-cell">
                <router-link class="action" :to="column.href.prefix + item[column.href.field] + column.href.postfix">
                  <div class="len-limit" v-html="fieldValue(item,column,i,j)"></div>
                </router-link>
              </div>
              <div v-if="column.action=='array'" class="cell action-cell">
                <div class="action array-action">
                  <div class="span-wrap" :class="{'span-more': item.advertiserCount > 3}">
                    <span class="app" v-for="app in item.advertisers">
                      <a :href="'https://itunes.apple.com/us/app/id' + app.appid + '?mt=8'" target="_blank">
                        <img :title="app.trackName" :src="app.artworkUrl60" onerror="this.src='http://www.zxinhe.com/asm/asm-search-default.png'">
                      </a>
                    </span>
                  </div>
                  <span class="app app-more" @click="actionButtonClicked(0, item)" v-if="item.advertiserCount > 3">更多</span>
                  <div class="clear"></div>
                </div>
              </div>
              <div v-if="column.order" class="cell action-cell">
                <span>{{i + 1}}</span>
              </div>
              <div v-if="column.action=='url'" class="cell action-cell url-cell">
                <a :href="'https://itunes.apple.com/us/app/id' + item.appid + '?mt=8'" target="_blank">
                  <img width="52" :src="item.artworkUrl60" onerror="this.src='http://www.zxinhe.com/asm/asm-search-default.png'">
                </a>
              </div>
              <div v-if="column.action=='select'" class="cell action-cell" style="width: 108px; padding-left: 30px">
                <el-select v-model="item[column.field]" placeholder="" size="small" @change="selectChange(item)">
                  <el-option v-for="item in column.options" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div v-if="column.action=='input'" class="cell action-cell" style="width: 108px; padding-left: 30px">
                <input class="input" :value="item[column.field]"
                       v-model="item[column.field]"
                       :disabled="isDisableInput"
                       @input="inputChange(item)">
              </div>
              <div v-if="column.action!='button'&&column.action!='link'&&column.action!='linkButton'&&column.action!='select'&&column.action!='input'&&column.action!='array'&&column.action!='url'" class="cell" v-html="fieldValue(item,column,i,j)"></div>
            </td>
          </template>
        </tr>
        </tbody>
      </table>
      <!--<div class="asm-data-msg" :class="{'asm-data-empty': !hasDatas}">数据为空</div>-->
      <!--isLoading-->
      <!--<div v-if="isLoading" class="asm-data-msg" :class="{'asm-data-empty': !hasDatas}"><img src="../../assets/images/asm-loading.gif"></div>-->
      <div v-if="!isLoading" class="asm-data-msg" :class="{'asm-data-empty': !hasDatas}">{{emptyMessage}}</div>
    </div>
    <div class="asm-table-footer" :class="{'asm-hide-page-footer': showPageFooter || !isShowPage}">
      <asm-page :total="totalRows" :page-size="pageSize" @on-change="onChan"></asm-page>
    </div>
  </div>
</template>
<script>
  import AsmPage from '../page'
//  import AsmCheckbox from '../checkbox'
  const prefixCls = 'asm-table'
  var sprintf = function (str) {
    var args = arguments
    var flag = true
    var i = 1

    str = str.replace(/%s/g, function () {
      var arg = args[i++]
      return arg
    })
    return flag ? str : ''
  }
  var calculateObjectValue = function (self, name, args, defaultValue) {
    var func = name

    if (typeof name === 'string') {
      // support obj.func1.func2
      var names = name.split('.')

      if (names.length > 1) {
        func = window
        names.forEach(function (f, i) {
          func = func[f]
        })
      } else {
        func = window[name]
      }
    }
    if (typeof func === 'object') {
      return func
    }
    if (typeof func === 'function') {
      return func.apply(self, args)
    }
    if (!func && typeof name === 'string' && sprintf.apply(this, [name].concat(args))) {
      return sprintf.apply(this, [name].concat(args))
    }
    return defaultValue
  }

  var escapeHTML = function (text) {
    if (typeof text === 'string') {
      return text
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;')
              .replace(/`/g, '&#x60;')
    }
    return text
  }

  var getItemField = function (item, field, escape, undefinedText) {
    var value = item

    if (typeof field !== 'string' || item.hasOwnProperty(field)) {
      return escape ? escapeHTML(item[field]) : item[field]
    }
    var props = field.split('.')
    for (var p in props) {
      value = value && value[props[p]]
    }
    return (escape ? escapeHTML(value) : value) || undefinedText
  }
  export default {
    name: 'AsmTable',
    props: {
      datas: {
        type: Array,
        default () {
          return []
        }
      },
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      width: {
        type: [Number, String]
      },
      height: {
        type: [Number, String]
      },
      border: {
        type: Boolean,
        default: true
      },
      stripe: {
        type: Boolean,
        default: true
      },
      pageSize: {
        type: Number,
        default: 10
      },
      isLoading: {
        type: Boolean,
        default: false
      },
      isShowPage: {
        type: Boolean,
        default: true
      },
      isShowColunmCheckbox: {
        type: Boolean,
        default: true
      },
      isDisableInput: {
        type: Boolean,
        default: true
      },
      selectedIndexs: {
        type: Array,
        default () {
          return []
        }
      },
      maxSelected: {
        type: Number,
        default: 0
      },
      emptyMessage: {
        type: String,
        default: ''
      }
    },
    components: {
      AsmPage
    },
    data () {
      return {
        ready: false,
        tableWidth: 0,
        columnsWidth: {},
        prefixCls: prefixCls,
        bodyHeight: 0,
        pageNumber: 1,
        selected: {
          type: undefined,
          all: false,
          items: []
        },
        totalRows: 0,
        isInited: false
      }
    },
    mounted () {
    },
    methods: {
      show (item) {
        console.log(item)
      },
      onCheckAllChange () {
        let items = []
        if (this.selected.all) {
          for (var i = this.currentPageFrom - 1; i < this.currentPageTo; i++) {
            if (!this.datas[i].isDisabled) {
              items.push(this.datas[i])
            }
          }
          this.$emit('trigger', {event: 'check-all', items: items})
        } else {
          this.$emit('trigger', {event: 'uncheck-all', items: items})
        }
        this.selected.items = items
      },
      onCheckItemChange (item, index) {
        if (this.maxSelected && this.selected.items.length > this.maxSelected) {
          let index = this.selected.items.indexOf(item)
          this.selected.items.splice(index, 1)
          return
        }
        if (this.selected.type === 'radio') {
          this.$emit('trigger', {event: 'check', item: item})
        } else {
          let count = this.currentPageTo - this.currentPageFrom + 1
          this.selected.all = (this.selected.items.length === count)
          let selected = this.selected.items.indexOf(item) > -1
          this.$emit('trigger', {event: selected ? 'check' : 'uncheck', item: item, items: this.selected.items, index: index})
        }
      },
      fieldValue (item, column, i, j) {
        var value = getItemField(item, column.field, 1)
        return calculateObjectValue(column,
                column.render, [value, item, i], value)
      },
      onChan (p) {
        console.log('p=' + p)
        this.pageNumber = p
        this.selected.items = []
        this.selected.all = false
        if (this.isShowColunmCheckbox) {
          this.$emit('trigger', {event: 'uncheck-all', items: []})
        }
      },
      actionButtonClicked (index, item) {
        this.$emit('buttonAction', index, item)
      },
      actionLinkButtonClicked (item) {
        this.$emit('buttonLinkAction', item)
      },
      selectChange (item) {
        this.$emit('selectAction', item)
      },
      inputChange (item) {
        this.$emit('inputAction', item)
      }
    },
    watch: {
      datas: function () {
        this.isInited = false
      }
    },
    computed: {
      wrapClasses () {
        return [
          `${prefixCls}-wrapper`
        ]
      },
      styles () {
        return []
      },
      classes () {
        return [
          `${prefixCls}`,
          {
            [`${prefixCls}-border`]: this.border,
            [`${prefixCls}-stripe`]: this.stripe
          }
        ]
      },
      renderData () {
        let data = []
        data = this.datas.slice(this.currentPageFrom - 1, this.currentPageTo)
        console.log(data.length)

        if (this.currentPageFrom > 1) {
          this.isInited = false
        }
        if (!this.isInited && data.length > 0 && this.currentPageFrom === 1) {
          let items = []
          for (var i = this.currentPageFrom - 1; i < this.currentPageTo; i++) {
            if (this.selectedIndexs.indexOf(i) !== -1) {
              items.push(this.datas[i])
            }
          }
          this.selected.items = items
          this.isInited = true
          console.log('blabla...')
        }
        return data
      },
      totalPages () {
        this.totalRows = this.datas.length
        return parseInt((this.totalRows + this.pageSize - 1) / this.pageSize)
      },
      currentPageFrom () {
        return (this.pageNumber - 1) * this.pageSize + 1
      },
      currentPageTo () {
        this.totalRows = this.datas.length
        let rowCount = this.pageNumber * this.pageSize
        return rowCount < this.totalRows ? rowCount : this.totalRows
      },
      showPageFooter () {
        return this.datas.length < 1
      },
      hasDatas () {
        return this.datas.length > 0
      }
    }
  }
</script>
<style scoped>
  .asm-table-wrapper {
    position: relative;
  }
  .asm-table {
    width: inherit;
    height: 100%;
    max-width: 100%;
    overflow: hidden;
    color: #657180;
    font-size: 12px;
    background-color: #fff;
    box-sizing: border-box;
  }
  .asm-table table {
    width: 100%;
  }
  .asm-table td {
    background-color: #fff;
    transition: background-color .2s ease-in-out;
  }
  .asm-table td, .asm-table th {
    min-width: 0;
    height: 48px;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
    border-bottom: 1px solid #aeaeae;
    font-size: 13px;
  }
  .asm-table th {
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #ececec;
    color: #0080cc;
    text-align: center;
    border-top: 1px solid #aeaeae;
    font-size: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .asm-table-stripe tbody tr:nth-child(2n) td {
    background-color: #F1FAFF;
  }
  .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    box-sizing: border-box;
    text-align: center;
  }
  .asm-table-border td,
  .asm-table-border th {
    border-right: 1px solid #aeaeae;
  }
  .asm-table-border td:nth-child(1),
  .asm-table-border th:nth-child(1) {
    border-left: 1px solid #aeaeae;
  }
  .asm-table th .cell {
    word-wrap: normal;
    display: inline-block;
    vertical-align: middle;
  }
  .asm-hide-page-footer {
    display: none;
  }
  .asm-data-msg {
    display: none;
  }
  .asm-data-msg.asm-data-empty {
    display: block;
    text-align: center;
    padding: 20px 30px;
    color: #BEBFBE;
    font-size: 16px;
  }
  .asm-table-footer {
    width: 380px;
    margin: 30px auto;
  }
  .cell a.action {
    text-decoration: none;
    color: #657180;
  }
  .cell a.action:hover {
    color: #318CE9;
    cursor: pointer;
    text-decoration: underline;
  }
  .cell a.action {
    margin-right: 10px;
  }
  .cell a.action:last-child {
    margin-right: 0;
  }
  .cell.action-cell {
    text-align: center;
  }
  .cell input.input {
    width: 50px;
    height: 25px;
    border: 1px solid #CECECE;
    text-indent: 5px;
  }
  .asm-table td{
    text-overflow:ellipsis;
    text-align: center;
    max-width: 150px;
    white-space:nowrap;
    overflow:hidden;
  }
  .len-limit {
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  td.td-disabled,
  .asm-table-stripe tbody tr:nth-child(2n) td.td-disabled {
    background-color: lightgray;
  }
  span.help {
    background-color: #0080cc;
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    line-height: 18px;
    font-size: 16px;
    display: inline-block;
  }
  .action.array-action {
    padding: 10px 10px 6px;
  }
  .action.array-action .span-wrap {
    float: left;
  }
  .action.array-action span.app {
    margin-right: 6px;
    display: inline-block;
  }
  .action.array-action span.app a {
    display: inline-block;
    outline: none;
    text-decoration: none;
    color: #1e1e1e;
  }
  .action.array-action span.app a:hover span.app-name {
    text-decoration: underline;
  }
  .action.array-action span.app span.app-name {
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    display: block;
    width: 52px;
  }
  .action.array-action img {
    width: 44px;
    background-color: lightgray;
    padding: 1px;
    border-radius: 8px;
  }
  .action.array-action span.app.app-more {
    width: 50px;
    height: 36px;
    line-height: 36px;
    background-color: #0080cc;
    color: white;
    margin-top: 4px;
    margin-right: 0;
    border-radius: 8px;
    cursor: pointer;
    display: inline-block;
  }
  .action.array-action span.app.app-more:hover {
    background-color: #0070cc;
  }
  .cell.url-cell {
    padding: 10px ;
  }
  .cell.url-cell a {
    outline: none;
  }
  .cell.url-cell a img {
    background-color: lightgray;
    padding: 1px;
    border-radius: 8px;
  }
  .asm-table th:last-child {
    width: 270px;
  }
  .results.more-results td:nth-child(1),
  .results.more-results td:nth-child(2) {
    width: 60px;
  }
</style>
