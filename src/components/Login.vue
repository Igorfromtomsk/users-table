<template>
  <div class="d-flex flex-column align-items-center">
    <form class="login-form" @submit.prevent="signIn">
      <h3 class="login-form_title">Authorization</h3>
      <small class="error text-danger" v-if="!!error">{{error}}</small>
      <div class="form-group">
        <input type="text" placeholder="Login" v-model="login" @change="clearError" @keyup="validation" class="form-control">
      </div>
      <div class="form-group">
        <input type="password" placeholder="Password" v-model="password" @change="clearError" @keyup="validation" class="form-control">
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-primary btn-block" :disabled="!isValid || inProcess">Sign in</button>
      </div>
    </form>
  </div>
</template>

<script>
  import {AUTH_REQUEST} from "../store/actions/authorization";

  export default {
    name: 'login',
    data() {
      return {
        login: '',
        password: '',
        error: '',
        inProcess: this.$store.getters.authStatus === 'loading',
        isValid: false
      }
    },
    methods: {
      signIn() {
        let {login, password} = this;

        this.$store.dispatch(AUTH_REQUEST, {login, password})
          .then(() => {
            this.$router.push('/home');
          })
          .catch(error => {
            this.error = this.$store.getters.authErrorMessage;
            console.log('error:', error);
          })
      },
      clearError() {
        this.error = '';
      },
      validation() {
        switch (true) {
          default:
            this.isValid = true;
            break;
          case !this.login:
            this.isValid = false;
            break;
          case !this.password:
            this.isValid = false;
            break;
        }
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