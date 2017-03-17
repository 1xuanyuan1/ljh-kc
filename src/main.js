// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import routes from './routes'
import VueResource from 'vue-resource'
import { Checkbox, Loading, Tooltip, Popover } from 'element-ui'
import VueAlert from './components/alert'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(Checkbox)
Vue.use(Loading)
Vue.use(Tooltip)
Vue.use(VueAlert)
Vue.use(Popover)

Vue.http.interceptors.push((request, next) => {
  console.log('before...send.....')
  next((response) => {
    console.log(typeof response.data)
    let obj = {}
    if (typeof response.data === 'object') {
      obj = response.data
    } else {
      obj = JSON.parse(response.data)
      response.data = obj
    }
    if (!response.ok) {
      window.alert('服务器出错或网络有问题！')
    }
    console.log('after...send.....')
    return response
  })
})

const router = new VueRouter({
  // mode: 'history',
  routes // short for routes: routes
})

router.afterEach(route => {
  document.title = route.meta.title
})

/* eslint-disable no-new */

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
})

/*
new Vue({
  router
}).$mount('#app')
*/




// WEBPACK FOOTER //
// ./src/main.js
