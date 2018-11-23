<template>
  <div class="container" v-bind:class="{'show-add-user-modal': addUserModalIsVisible}">
    <header class="header">
      <div class="header_buttons-row">
        <button class="btn btn-sm btn-success" @click="toggleAddUserModalVisibility">Add user</button>
        <button class="btn btn-sm btn-primary" @click="refreshUsersList">Refresh</button>
      </div>
      <div class="user-pic">
        <img v-bind:src="profile.pic" onerror="this.style.display = 'none'">
      </div>
      <h4 class="user-name">{{profile.login}}</h4>
      <button @click="logout" class="btn-alt user-logout">
        <font-awesome-icon icon="sign-out-alt"/>
      </button>
    </header>
    <div>
      <ul class="row">
        <li class="col-4" v-for="(user, index) in users">
          <div class="user-card user-card__horizontal" v-bind:class="{'in-process': user.inProcess}">
            <div class="d-flex flex-row">
              <div class="user-card_pic-wrapper">
                <img class="user-card_pic"
                     onerror="this.style.display = 'none'"
                     :src="user.pic" alt="User pic">
              </div>
              <div class="user-card_body">
                <div class="form-group">
                  <input type="text" class="form-control" @keyup="checkSaveAbility(user.id)" v-model="user.login"/>
                </div>
                <div class="form-group position-relative">
                  <input v-bind:type="user.passwordIsVisible ? 'text' : 'password'" class="form-control"
                         @keyup="checkSaveAbility(user.id)" v-model="user.password"/>
                  <button class="btn-alt user-card_toggle-visibility" @click="togglePasswordVisibility(user.id)">
                    <font-awesome-icon icon="eye"/>
                  </button>
                </div>
              </div>
            </div>
            <div class="user-card_buttons">
              <select v-model.number="user.access" @change="checkSaveAbility(user.id)" class="form-control-sm">
                <option value="5">Админ</option>
                <option value="4">Сотрудник</option>
                <option value="3">Партнёр</option>
                <option value="2">Пользователь</option>
                <option value="1">Забанен</option>
              </select>
              <button class="btn btn-alt btn-sm btn-primary"
                      v-bind:class="{'disabled': !user.saveAbility || user.inProcess}"
                      @click="updateUser(user.id)"
                      title="Save">
                <font-awesome-icon icon="save"/>
              </button>
              <button class="btn btn-alt btn-sm btn-danger"
                      v-bind:class="{'disabled': user.inProcess}"
                      title="Delete"
                      @click="deleteUser(user.id)">
                <font-awesome-icon icon="trash-alt"/>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="add-new-user">
      <div class="add-new-user_inner">
        <div class="add-new-user_header">
          <h3>Add new user</h3>
        </div>
        <div class="add-new-user_body">
          <div class="user-card user-card__horizontal">
            <div class="d-flex flex-row">
              <div class="user-card_pic-wrapper">
                <input type="file" class="file-input" @change="uploadPhoto">
                <img class="user-card_pic"
                     :src="newUser.pic"
                     onerror="this.style.display = 'none'"
                     onload="this.style.display = 'block'"
                     alt="User pic">
              </div>
              <div class="user-card_body">
                <div class="form-group">
                  <input type="text"
                         class="form-control"
                         v-model="newUser.login"
                         @keyup="checkAddNewUserValidation"
                         placeholder="Login"/>
                </div>
                <div class="form-group position-relative">
                  <input v-bind:type="newUser.passwordIsVisible ? 'text' : 'password'"
                         class="form-control"
                         v-model="newUser.password"
                         @keyup="checkAddNewUserValidation"
                         placeholder="Password"/>
                  <button class="btn-alt user-card_toggle-visibility"
                          @click="togglePasswordVisibility">
                    <font-awesome-icon icon="eye"/>
                  </button>
                </div>
              </div>
            </div>
            <div class="user-card_buttons">
              <select v-model="newUser.access"
                      @change="checkAddNewUserValidation"
                      class="form-control-sm">
                <option selected disabled value="0">- Выберите вариант -</option>
                <option value="5">Админ</option>
                <option value="4">Сотрудник</option>
                <option value="3">Партнёр</option>
                <option value="2">Пользователь</option>
                <option value="1">Забанен</option>
              </select>
            </div>
          </div>
        </div>
        <div class="add-new-user_footer">
          <button class="btn btn-sm btn-danger"
                  title="Cancel"
                  @click="toggleAddUserModalVisibility">Cancel
          </button>
          <button class="btn btn-sm btn-success btn-save"
                  title="Save"
                  @click="addNewUser"
                  v-bind:disabled="addingNewUserInProgress">Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {AUTH_LOGOUT} from "../store/actions/authorization";

  export default {
    name: 'home',
    data() {
      return {
        profile: {},
        users: [],
        reservedData: [],
        addUserModalIsVisible: false,
        addingNewUserInProgress: true,
        newUser: {
          login: '',
          password: '',
          pic: '',
          access: 0,
          saveAbility: false,
          passwordIsVisible: false,
          reservedData: {}
        }
      }
    },
    created() {
      this.getAllUsers();
    },
    methods: {
      getAllUsers() {
        this.users = this.$store.getters.getUsers;

        if (true) {
          this.$store
            .dispatch('UPDATE_USERS')
            .then(() => {
              this.users = this.$store.getters.getUsers;

              this.profile = this.users.filter(user => user.id === +localStorage.profileId)[0];
            })
        }
      },
      getUserById(id) {
        return this.users.filter(user => user.id === id)[0];
      },
      refreshUsersList() {
        this.users = [];
        this.$store
          .dispatch('UPDATE_USERS')
          .then(() => {
            this.users = this.$store.getters.getUsers;
          })
      },

      togglePasswordVisibility(e, id) {
        if (id) {
          let passwordIsVisible = this.users.filter(user => user.id === id)[0].passwordIsVisible;
          this.users.filter(user => user.id === id)[0].passwordIsVisible = !passwordIsVisible;
        } else {
          this.newUser.passwordIsVisible = !this.newUser.passwordIsVisible;
        }
      },
      toggleAddUserModalVisibility() {
        this.addUserModalIsVisible = !this.addUserModalIsVisible
      },

      checkSaveAbility(id) {
        let user = this.getUserById(id);
        switch (true) {
          case user.login !== user.reservedData.login:
          case user.password !== user.reservedData.password:
          case +user.access !== +user.reservedData.access:
            user.saveAbility = true;
            break;
          default:
            user.saveAbility = false;
            break;
        }
      },
      checkAddNewUserValidation() {
        switch (true) {
          case this.newUser.login === '':
          case this.newUser.password === '':
          case this.newUser.access === 0:
          case this.newUser.pic === '':
            this.addingNewUserInProgress = true;
            break;
          default:
            this.addingNewUserInProgress = false;
            break;
        }
      },

      addNewUser() {
        this.addingNewUserInProgress = true;
        this.$store
          .dispatch('ADD_NEW_USER', this.newUser)
          .then(() => {
            this.addingNewUserInProgress = false;
            this.toggleAddUserModalVisibility();
          })
      },
      deleteUser(id) {
        let userToDelete = this.users.filter(user => user.id === id)[0];
        userToDelete.inProcess = true;

        this.$store
          .dispatch('DELETE_USER', id)
          .then(() => {
            userToDelete.inProcess = false;
          })
      },
      updateUser(id) {
        let userToUpdate = this.users.filter(user => user.id === id)[0];
        this.$store
          .dispatch('UPDATE_USER', userToUpdate)
          .then(() => {})
      },
      uploadPhoto(event) {
        let self = this;

        if (event.target.files && event.target.files[0]) {
          var reader = new FileReader();

          reader.onload = function (e) {
            self.newUser.pic = e.target.result;
            console.log(self.newUser);
          };

          reader.readAsDataURL(event.target.files[0]);
        }
      },
      logout() {
        this.$store.dispatch(AUTH_LOGOUT)
          .then(() => {
            this.$router.push('/login');
          });
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
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, .15);
    padding: 5%;
    position: relative;

    &_pic {
      height: 93px;
      min-width: 100%;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translateX(-50%);

      &-wrapper {
        width: 100%;
        max-width: 93px;
        margin-bottom: 1rem;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, .05);
        position: relative;
        overflow: hidden;

        .file-input {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          z-index: 3;
          opacity: 0.001;
          cursor: pointer;
        }
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

    &_body {
      flex-grow: 2;
    }

    &_buttons {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;

      select {
        flex-grow: 2;
        cursor: pointer;

        & + .btn {
          margin: 0rem 1rem 0rem 3rem;
        }
      }
    }

    &:before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      z-index: -1;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, .7);
      -webkit-transition: ease .25s;
      -moz-transition: ease .25s;
      -ms-transition: ease .25s;
      -o-transition: ease .25s;
      transition: ease .25s;
      opacity: 0;
      pointer-events: none;
    }
    &:after {
      content: '';
      width: 2rem;
      height: 2rem;
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: -1;
      opacity: 0;
      -webkit-transition: ease .25s;
      -moz-transition: ease .25s;
      -ms-transition: ease .25s;
      -o-transition: ease .25s;
      transition: ease .25s;
      pointer-events: none;
      animation: spin 2s infinite ease-in-out;
      transform-origin: 0% 1px;
      background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ1OC4xODYgNDU4LjE4NiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDU4LjE4NiA0NTguMTg2OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTQ0NS42NTEsMjAxLjk1Yy0xLjQ4NS05LjMwOC0xMC4yMzUtMTUuNjQ5LTE5LjU0My0xNC4xNjRjLTkuMzA4LDEuNDg1LTE1LjY0OSwxMC4yMzUtMTQuMTY0LDE5LjU0MyAgICBjMC4wMTYsMC4xMDIsMC4wMzMsMC4yMDMsMC4wNTEsMC4zMDRjMTcuMzgsMTAyLjMxMS01MS40NywxOTkuMzM5LTE1My43ODEsMjE2LjcxOWMtMTAyLjMxMSwxNy4zOC0xOTkuMzM5LTUxLjQ3LTIxNi43MTktMTUzLjc4MSAgICBTOTIuOTY2LDcxLjIzMiwxOTUuMjc2LDUzLjg1MmM2Mi45MTktMTAuNjg4LDEyNi45NjIsMTEuMjksMTcwLjA1OSw1OC4zNjFsLTc1LjYwNSwyNS4xOSAgICBjLTguOTQ0LDIuOTc2LTEzLjc4MSwxMi42MzgtMTAuODA2LDIxLjU4MmMwLjAwMSwwLjAwMiwwLjAwMiwwLjAwNSwwLjAwMywwLjAwN2MyLjk3Niw4Ljk0NCwxMi42MzgsMTMuNzgxLDIxLjU4MiwxMC44MDYgICAgYzAuMDAzLTAuMDAxLDAuMDA1LTAuMDAyLDAuMDA3LTAuMDAybDEwMi40LTM0LjEzM2M2Ljk3Mi0yLjMyMiwxMS42NzUtOC44NDcsMTEuNjc0LTE2LjE5NnYtMTAyLjQgICAgQzQxNC41OSw3LjY0MSw0MDYuOTQ5LDAsMzk3LjUyMywwcy0xNy4wNjcsNy42NDEtMTcuMDY3LDE3LjA2N3Y2Mi4zNDRDMjkyLjU2NC00LjE4NSwxNTMuNTQ1LTAuNzAyLDY5Ljk0OSw4Ny4xOSAgICBzLTgwLjExNCwyMjYuOTExLDcuNzc5LDMxMC41MDhzMjI2LjkxMSw4MC4xMTQsMzEwLjUwOC03Ljc3OUM0MzUuOTA1LDMzOS43OTksNDU3LjE3OSwyNzAuMTUyLDQ0NS42NTEsMjAxLjk1eiIgZmlsbD0iIzI4YTc0NSIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)
    }

    &.in-process {
      &:before,
      &:after{
        opacity: 1;
        z-index: 1;
        pointer-events: all;
      }
    }

    &__horizontal .user-card_body {
      padding-left: 30px;
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
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, .15), 0px 0px 0px 1px rgba(0, 0, 0, .05);
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

    &_buttons-row {
      flex-grow: 2;
      margin-left: -.67rem;

      .btn + .btn {
        margin-left: 2rem;
      }
    }
  }

  .add-new-user {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    -webkit-transition: ease .25s;
    -moz-transition: ease .25s;
    -ms-transition: ease .25s;
    -o-transition: ease .25s;
    transition: ease .25s;
    z-index: -1;
    opacity: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, .45);

    &_inner {
      min-width: 30rem;
      padding: 2rem;
      background-color: white;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      border-radius: 4px;
      box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, .15);
      -webkit-transition: ease .25s;
      -moz-transition: ease .25s;
      -ms-transition: ease .25s;
      -o-transition: ease .25s;
      transition: ease .25s;
      -webkit-transform: translateY(-30px);
      -moz-transform: translateY(-30px);
      -ms-transform: translateY(-30px);
      -o-transform: translateY(-30px);
      transform: translateY(-30px);
    }

    &_header h3 {
      margin: 0 0 2rem 0;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, .1);
      color: rgba(0, 0, 0, .5);
      font-weight: bold;
    }

    &_body {

    }

    &_footer {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(0, 0, 0, .1);
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: space-between;
    }

    .user-card_pic-wrapper {
      cursor: pointer;
    }
  }

  .show-add-user-modal {
    overflow: hidden;
    height: calc(100vh - 3rem);

    .add-new-user {
      z-index: 100;
      opacity: 1;

      .add-new-user_inner {
        transform: translateY(0);
      }
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg) translate(-50%, -50%);
    }
    to {
      transform: rotate(360deg) translate(-50%, -50%);
    }
  }
</style>