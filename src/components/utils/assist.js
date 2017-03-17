
// 判断参数是否是其中之一
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}

export function checkMail (mail) {
  var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  if (re.test(mail)) {
    return true
  } else {
    return false
  }
}

export function camelcaseToHyphen (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

// For Modal scrollBar hidden
let cached
export function getScrollBarSize (fresh) {
  if (fresh || cached === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)

    const widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    cached = widthContained - widthScroll
  }
  return cached
}

export function isNumber (str) {
  return !isNaN(parseFloat(str)) && isFinite(str)
}

export function checkTel (tel) {
  if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,8}$/.test(tel)) {
    return false
  } else {
    return true
  }
}

export function checkPhone (val) {
  var filter = /^1\d{10}$/
  if (filter.test(val)) {
    return true
  } else {
    return false
  }
}

export function parseInput (input) {
  let obj = {}
  var appidFilter = /^\d{9,10}$/
  var urlFilter = /https?:\/\/[a-z0-9_.:]+\/[-a-z0-9_:@&?=+,.!/~*%$]*(\.(html|htm|shtml))?/
  var urlAppidFilter = /^(https|http):\/\/itunes.apple.com\/.*id(\d{9,10})/
  if (isNumber(input) && appidFilter.test(input)) {
    obj.type = 'APPID'
    obj.value = input
  } else if (urlFilter.test(input)) {
    let array = input.match(urlAppidFilter)
    obj.type = 'URL'
    if (array && array.length > 0) {
      obj.value = array[array.length - 1]
    }
  } else {
    obj.type = 'KEYWORD'
    obj.value = input
  }
  return obj
}

export function checkPass (s) {
  if (s.length < 6) {
    return 0
  }
  var ls = 0
  if (s.match(/([a-z])+/)) {
    ls++
  }
  if (s.match(/([0-9])+/)) {
    ls++
  }
  if (s.match(/([A-Z])+/)) {
    ls++
  }
  if (s.match(/[^a-zA-Z0-9]+/)) {
    ls++
  }
  return ls
}

export function dateDiff (sDate1, sDate2) {
  var aDate, oDate1, oDate2, iDays
  aDate = sDate1.split('-')
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  aDate = sDate2.split('-')
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
  return iDays + 1
}

export function dateFilter (sDate) {
  var strs = []
  strs = sDate.split(' ')
  var spliceYears = []
  spliceYears = strs[0].split('-')
  let formatDateStr = strs[1] + ' ' + spliceYears[1] + '.' + spliceYears[2]
  return formatDateStr
}
export function getNowFormatDate (date, seperator) {
  var seperator1 = seperator || '-'
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var strDate = date.getDate()
  if (month >= 1 && month <= 9) {
    month = '0' + month
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate
  // var currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds()
  return currentdate
}
export function getTotalSeries (key, datas) {
  var sum = 0
  datas.forEach(function (item) {
    sum = sum + parseFloat(item)
  })
  let total = ''
  if ((key === 'conversions') || ((key === 'ttr'))) {
    total = convertFloatToPercent(sum)
  } else {
    total = '$' + ' ' + sum
  }
  return total
}
export function convertFloatToPercent (value) {
  let tmp = parseFloat(value)
  let percent = tmp * 100 + '%'
  if (value === '0.00') {
    percent = value + '%'
  }
  return percent
}
export function converFloatToStr (value) {
  return '$' + ' ' + value
}
export function getIntervalXaxis (granularity, dayInterval) {
  if (dayInterval <= 7) {
    if (granularity === '时') {
      return 13
    }
    if (granularity === '日') {
      return 0
    }
  } else if (dayInterval > 7 && dayInterval < 14) {
    if (granularity === '时') {
      return 13
    }
    if (granularity === '日') {
      return 0
    }
  } else if (dayInterval >= 14) {
    if (granularity === '日') {
      return 2
    }
    if (granularity === '周') {
      return 0
    }
  } else if (dayInterval > 60 && dayInterval < 90) {
    if (granularity === '日') {
      return 6
    }
    if (granularity === '周') {
      return 0
    }
    if (granularity === '月') {
      return 0
    }
  } else if (dayInterval >= 90) {
    if (granularity === '周') {
      return 0
    }
    if (granularity === '月') {
      return 0
    }
  }
}

export function converStrToCurrency (str, currency, decimals) {
  const digitsRE = /(\d{3})(?=\d)/g
  let value = str.toString().replace(/,/g, '')

  value = parseFloat(value)
  if (!isFinite(value) || (!value && value !== 0)) return ''
  currency = currency != null ? currency : '$'
  var stringified = Math.abs(value).toFixed(decimals)
  var _int = stringified.slice(0, -1 - decimals)
  var i = _int.length % 3
  var head = i > 0
   ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
   : ''
  var _float = stringified.slice(-1 - decimals)
  var sign = value < 0 ? '-' : ''
  return sign + currency + head +
   _int.slice(i).replace(digitsRE, '$1,') +
   _float
}

// scrollTop animation
export function scrollTop (el, from = 0, to, duration = 500) {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
     window.webkitRequestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     window.msRequestAnimationFrame ||
     function (callback) {
       return window.setTimeout(callback, 1000 / 60)
     }
    )
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil(difference / duration * 50)

  function scroll (start, end, step) {
    if (start === end) return

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

export function resetDefaultDate () {
  var curDate = new Date()
  var preTwoDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000 * 2)
  var preSixDate = new Date(preTwoDate.getTime() - 24 * 60 * 60 * 1000 * 6)
  let startTime = getNowFormatDate(preSixDate)
  let endTime = getNowFormatDate(preTwoDate)
  window.localStorage.setItem('startTime', startTime)
  window.localStorage.setItem('endTime', endTime)
}



// WEBPACK FOOTER //
// ./src/components/utils/assist.js