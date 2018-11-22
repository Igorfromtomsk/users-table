import Vue from 'vue'
import App from './App.vue'

import Router from 'vue-router';
import User from './components/User.vue';
import store from './store';
import Home from './components/Home.vue';
import Login from './components/Login.vue';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEye, faSignOutAlt, faTrashAlt, faSave } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEye, faSignOutAlt, faTrashAlt, faSave);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/user/:id',
      name: 'user',
      component: User,
      props: true,
    },
  ]
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
