<template>
  <div class="container">
    <div>
      <ul class="row">
        <li class="col-4" v-for="user in users">
          <div class="user-card user-card__horizontal">
            <div class="d-flex flex-row">
              <div class="user-card_pic-wrapper">
                <img class="user-card_pic" :src="user.pic" alt="User pic">
              </div>
              <div class="user-card_body">
                <div class="form-group">
                  <input type="text" class="form-control" :value="user.login"/>
                </div>
                <div class="form-group">
                  <input type="password" class="form-control" :value="user.password"/>
                </div>
              </div>
            </div>
            <div class="user-card_buttons">
              <a href="#" class="btn btn-sm btn-primary">some btn</a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'home',
    data() {
      return {
        users: []
      }
    },
    created() {
      this.getAllUsers();
    },
    methods: {
      getAllUsers() {
        axios
          .get('http://my-json-server.typicode.com/Igorfromtomsk/users-table/users')
          .then(r => {
            this.users = r.data;
          })
          .catch(error => {
            console.log(error);
          })
      }
    }
  }
</script>

<style lang="scss">
  .user-card {
    margin-bottom: 30px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    box-shadow: 0px 0px 30px 0px rgba(0,0,0,.15);
    padding: 5%;

    &_pic {
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      border: 1px solid #eee;
      width: 100%;

      &-wrapper {
        width: 100%;
        max-width: 93px;
      }
    }

    &__horizontal .user-card_body {
      padding-left: 30px;
    }
  }
</style>