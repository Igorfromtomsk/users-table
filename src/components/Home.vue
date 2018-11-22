<template>
  <div class="container">
    <header class="header">
      <div class="user-pic">
        <img v-bind:src="profile.pic" onerror="this.css.display = 'none'">
      </div>
      <h4 class="user-name">{{profile.login}}</h4>
      <button @click="logout" class="btn-alt user-logout"><font-awesome-icon icon="sign-out-alt"/></button>
    </header>
    <div>
      <ul class="row">
        <li class="col-4" v-for="(user, index) in users">
          <div class="user-card user-card__horizontal">
            <div class="d-flex flex-row">
              <div class="user-card_pic-wrapper">
                <img class="user-card_pic" :src="user.pic" alt="User pic">
              </div>
              <div class="user-card_body">
                <div class="form-group">
                  <input type="text" class="form-control" @keyup="checkSaveAbility(user.id)" v-model="user.login"/>
                </div>
                <div class="form-group position-relative">
                  <input v-bind:type="user.passwordIsVisible ? 'text' : 'password'" class="form-control" @keyup="checkSaveAbility(user.id)" v-model="user.password"/>
                  <button class="btn-alt user-card_toggle-visibility" @click="togglePasswordVisibility(user.id)"><font-awesome-icon icon="eye" /></button>
                </div>
              </div>
            </div>
            <div class="user-card_buttons">
              <select v-model="user.access" @change="checkSaveAbility(user.id)" class="form-control-sm">
                <option value="5">Админ</option>
                <option value="4">Сотрудник</option>
                <option value="3">Партнёр</option>
                <option value="2">Пользователь</option>
                <option value="1">Забанен</option>
              </select>
              <button class="btn btn-alt btn-sm btn-primary" v-bind:class="{disabled: !user.saveAbility}" title="Save"><font-awesome-icon icon="save" /></button>
              <button class="btn btn-alt btn-sm btn-danger" title="Delete"><font-awesome-icon icon="trash-alt" /></button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import {AUTH_LOGOUT} from "../store/actions/authorization";

  export default {
    name: 'home',
    data() {
      return {
        profile: this.$store.getters.getProfile,
        users: [],
        reservedDatas: []
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
            this.users = r.data.map(user => {
              user.passwordIsVisible = false;
              user.saveAbility = false;
              user.reservedData = Object.assign({}, user);;
              return user;
            });
          })
          .catch(error => {
            console.log(error);
          })
      },
      togglePasswordVisibility(id) {
        let passwordIsVisible = this.users.filter(user => user.id === id)[0].passwordIsVisible;
        this.users.filter(user => user.id === id)[0].passwordIsVisible = !passwordIsVisible;
      },
      logout() {
        this.$store.dispatch(AUTH_LOGOUT)
          .then(() => {
            this.$router.push('/login');
          });
      },
      checkSaveAbility(id) {
        let user = this.getUserById(id);
        
        switch (true) {
          case user.login !== user.reservedData.login:
          case user.password !== user.reservedData.password:
          case user.access !== user.reservedData.access.toString():
            user.saveAbility = true;
            break;
          default:
            user.saveAbility = false;
            break;
        }

        console.log(user);
      },
      getUserById(id) {
        return this.users.filter(user => user.id === id)[0];
      }
    }
  }
</script>

<style lang="scss">
  .btn-alt {
    cursor: pointer;
    -webkit-transition: ease .25s;
    -moz-transition: ease .25s;
    -ms-transition: ease .25s;
    -o-transition: ease .25s;
    transition: ease .25s;
    background: none;
    border: none;
    height: 2.25rem;
    width: 2.25rem;
    text-align: center;
    -webkit-border-radius: 2rem;
    -moz-border-radius: 2rem;
    border-radius: 2rem;
    color: rgba(0, 123, 255, 1);

    svg {
      display: block;
      margin: auto;
    }

    &.btn-danger {
      color: #dc3545;

      &:hover {
        color: white;
      }
    }

    &.disabled {
      pointer-events: none;
      color: #bbb;
      background: none;
    }
  }

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

    &_toggle-visibility {
      position: absolute;
      right: 0;
      bottom: 0;
      color: rgba(0, 123, 255, 0.5);

      &:hover {
        color: #007bff;
      }

      &:focus {
        box-shadow: none;
        outline: none;
      }
    }

    &__horizontal .user-card_body {
      padding-left: 30px;
    }

    &_buttons {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;

      select {
        flex-grow: 2;
        cursor: pointer;
        margin-right: 2rem;

        & + .btn {
          margin: 0px 1rem;
        }
      }
    }
  }

  .header {
    height: 5rem;
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: .67rem;
    margin-bottom: 2rem;

    .user-pic {
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0px 0px 20px 0px rgba(0,0,0,.15), 0px 0px 0px 1px rgba(0,0,0,.05);
      height: 100%;
      overflow: hidden;

      img {
        display: block;
        height: 100%;
      }
    }

    .user-name {
      font-weight: bold;
      font-size: 1rem;
      margin: 0 1rem;
    }
  }
</style>