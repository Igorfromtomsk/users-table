<template>
  <div class="d-flex flex-column align-items-center">
    <form class="login-form" @submit.prevent="signIn">
      <h3 class="login-form_title">Authorization</h3>
      <small class="error text-danger" v-if="!!error">{{error}}</small>
      <div class="form-group">
        <input type="text" placeholder="Login" v-model="login" class="form-control">
      </div>
      <div class="form-group">
        <input type="password" placeholder="Password" v-model="password" class="form-control">
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary btn-block">Sign in</button>
      </div>
    </form>
  </div>
</template>

<script>
  import AuthorizationModule from '../modules/AuthorizationModule';

  export default {
    name: 'login',
    data() {
      return {
        login: '',
        password: '',
        error: ''
      }
    },
    methods: {
      signIn() {
        let data = {
          login: this.login,
          password: this.password
        };
        AuthorizationModule
          .signIn(data)
          .then(r => {
            localStorage.setItem('user-token', r.token.toString());
            this.$router.push({name: 'home'});
          })
          .catch(r => {
            localStorage.removeItem('user-token');
            this.error = r.message;
          })
      }
    }
  }
</script>

<style lang="scss">
  .login-form {
    width: 20rem;
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, .15);
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    padding: 2rem;
    display: flex;
    flex-direction: column;

    &_title {
      margin: 0 0 2rem 0;
      font-weight: bold;
    }

    & .form-group:last-child {
      flex-grow: 2;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      margin: 1rem 0 0;
    }
  }
</style>