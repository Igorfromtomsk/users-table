import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import users from './modules/users';
import auth from './modules/authorization';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    auth,
    users
  }
})
