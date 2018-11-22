import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import auth from './modules/authorization';
Vue.use(Vuex);

Vue.directive('test', {
  clicked: function (el) {
    console.log('haha')
  }
});

export default new Vuex.Store({
  modules: {
    user,
    auth,
  }
})
