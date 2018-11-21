import Vue from 'vue'
import App from './App.vue'

import Router from 'vue-router';
import User from './components/User.vue';
import Home from './components/Home.vue';
import Login from './components/Login.vue';

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
  render: h => h(App),
  router
});
