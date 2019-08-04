import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import _ from 'lodash'
import VueResource from 'vue-resource'
import vuetify from './plugins/vuetify';

//making lodash available for all vue components
Object.defineProperty(Vue.prototype, '_', { value: _ });

Vue.use(VueResource);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
