/**
 * Vue Plugin Install.
 */

function install (Vue) {
  var AlertConstructor = Vue.extend(require('./alert.vue'))
  var alertInstance = null

  Object.defineProperty(Vue.prototype, '$alert', {

    get: function () {
      return (message, position) => {
        if (alertInstance) return
        alertInstance = new AlertConstructor({
          el: document.createElement('div'),
          data () {
            return {
              message: message,
              position: position
            }
          }
        })
        document.body.appendChild(alertInstance.$el)
        setTimeout(() => {
          document.body.removeChild(alertInstance.$el)
          alertInstance = null
        }, 1000)
      }
    }

  })
}
module.exports = install



// WEBPACK FOOTER //
// ./src/components/alert/index.js