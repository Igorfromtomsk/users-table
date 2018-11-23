import { UPDATE_USERS, ADD_NEW_USER, DELETE_USER, UPDATE_USER } from '../actions/users';
import axios from 'axios';

const state = {
  users: []
};

const getters = {
  getUsers: state => state.users
};

const actions = {
  [UPDATE_USERS]: async (context) => {
    let {data} = await axios.get('http://my-json-server.typicode.com/Igorfromtomsk/users-table/users');
    let users = data.map(user => {
      user.passwordIsVisible = false;
      user.saveAbility = false;
      user.inProcess = false;
      user.reservedData = Object.assign({}, user);
      return user;
    });
    context.commit(UPDATE_USERS, users);
  },
  [ADD_NEW_USER]: async (context, user) => {
    let id = 0;
    state.users.forEach(item => {
      if (item.id > id) id = item.id;
    });
    user.id = ++id;
    user.inProcess = false;
    user.reservedData = Object.assign({}, user);
    context.commit(ADD_NEW_USER, user); //server response simulation
  },
  [DELETE_USER]: async (context, id) => {
    function serverResponseSimulation() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      });
    }

    let result = await serverResponseSimulation();
    if (result) {
      context.commit(DELETE_USER, id);
    }
  },
  [UPDATE_USER]: (context, user) => {
    context.commit(UPDATE_USER, user);
  }
};

const mutations = {
  [UPDATE_USERS]: (state, users) => {
    state.users = users;
  },
  [ADD_NEW_USER]: (state, user) => {
    state.users.unshift(user);
  },
  [DELETE_USER]: (state, id) => {
    let userToDelete = state.users.filter(user => user.id === id)[0];
    let index = state.users.indexOf(userToDelete);
    state.users.splice(index, 1);
  },
  [UPDATE_USER]: (state, newUserData) => {
    let oldUserData = state.users.filter(user => user.id === newUserData.id)[0];
    let oldUserDataIndex = state.users.indexOf(oldUserData);
    newUserData.saveAbility = false;
    state.users[oldUserDataIndex] = newUserData;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
