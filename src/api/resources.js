/**
 * Created by Duke on 12/19/16.
 */
import Vue from 'vue'
import VueResource from 'vue-resource'

Vue.use(VueResource)
Vue.http.options.emulateJSON = true

let API_ROOT = 'http://app.asm.liangjianghu.com/asm/'
const env = process.env.NODE_ENV
// if (env === 'development') {
//   API_ROOT = 'http://localhost:8080/asm/'
// } else if (env === 'production') {
//   API_ROOT = 'http://app.asm.liangjianghu.com/asm/'
// }
// API_ROOT = 'http://54.222.239.164:8011/asm/'

export const FindIndexCountResource = Vue.resource(API_ROOT + 'v1/asoFindWord/findIndexCount')
export const FindAllWordResource = Vue.resource(API_ROOT + 'v1/asoFindWord/findAllWords')
export const FindAllAdvertiser = Vue.resource(API_ROOT + 'v1/asoFindWord/findAllAdvertiser')

// API_ROOT = '/static/test/'

// export const FindIndexCountResource = Vue.resource(API_ROOT + 'findIndexCountResource.json')
// export const FindAllWordResource = Vue.resource(API_ROOT + 'findAllWords.json')
// export const FindAllAdvertiser = Vue.resource(API_ROOT + 'findAllAdvertiser.json')




// WEBPACK FOOTER //
// ./src/api/resources.js
