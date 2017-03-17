/**
 * Created by liujie on 1/4/17.
 */
export default {

  getToken () {
    return window.localStorage.token
  },
  logout (cb) {
    delete window.localStorage.token
  },
  loggedIn () {
    return !!window.localStorage.token
  },
  getUserId () {
    return window.localStorage.userID
  },
  getCustomerId () {
    return window.localStorage.customerId
  },
  getLoginName () {
    return window.localStorage.account
  },
  isPerfect () {
    return window.localStorage.isPerfect
  },
  getUserType () {
    return window.localStorage.userType
  },
  getStartTime () {
    return window.localStorage.startTime
  },
  getEndTime () {
    return window.localStorage.endTime
  },
  isAuth () {
    return window.localStorage.isAuth && (parseInt(window.localStorage.isAuth) === 1)
  },
  getBizId () {
    return window.localStorage.bizId
  },
  addKeyword (k) {
    let keywords = []
    if (window.localStorage.keywords) {
      keywords = JSON.parse(window.localStorage.keywords)
    }
    if (keywords.indexOf(k) < 0) {
      // keywords.push(k)
      keywords.splice(0, 0, k)
    }
    if (keywords.length > 3) {
      // keywords = keywords.splice(keywords.length - 3, 3)
      keywords = keywords.splice(0, 3)
    }
    window.localStorage.setItem('keywords', JSON.stringify(keywords))
  },
  getKeywords () {
    if (window.localStorage.keywords) {
      return JSON.parse(window.localStorage.keywords)
    }
    return []
  },
  addAppid (id) {
    let appids = []
    if (window.localStorage.appids) {
      appids = JSON.parse(window.localStorage.appids)
    }
    if (appids.indexOf(id) < 0) {
      // appids.push(id)
      appids.splice(0, 0, id)
    }
    if (appids.length > 3) {
      // appids = appids.splice(appids.length - 3, 3)
      appids = appids.splice(0, 3)
    }
    window.localStorage.setItem('appids', JSON.stringify(appids))
  },
  getAppids () {
    if (window.localStorage.appids) {
      return JSON.parse(window.localStorage.appids)
    }
    return []
  },
  clearHistory () {
    delete window.localStorage.keywords
    delete window.localStorage.appids
  }
}



// WEBPACK FOOTER //
// ./src/services/auth.js