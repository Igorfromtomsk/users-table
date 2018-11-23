import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_LOGOUT } from '../actions/authorization';
import axios from 'axios';
import { USER_REQUEST } from '../actions/user';

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  errorMessage: ''
};

const getters = {
  authStatus: state => state.status,
  authErrorMessage: state => state.errorMessage
};

const actions = {
  [AUTH_REQUEST]: ({commit, dispatch}, auth_user) => {
    return new Promise((resolve, reject) => {
      axios
        .get('http://my-json-server.typicode.com/Igorfromtomsk/users-table/users')
        .then(resp => {
          let filteredByLogin = resp.data.filter(user => user.login === auth_user.login);

          if (filteredByLogin.length === 0) {
            commit(AUTH_ERROR, 'Такого пользователя нет');
            reject();
            return true;
          }

          let filteredByPassword = filteredByLogin.filter(user => user.password === auth_user.password);

          if (filteredByPassword.length === 0) {
            commit(AUTH_ERROR, 'Неверный пароль');
            reject();
            return true;
          }

          dispatch(USER_REQUEST, filteredByPassword[0]);
          localStorage.setItem('profileId', filteredByPassword[0].id);
          commit(AUTH_SUCCESS, {token: new Date().getTime()});
          resolve();
        })
    })
  },
  [AUTH_LOGOUT]: ({commit, dispatch}) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_LOGOUT);
      localStorage.removeItem('user-token');
      resolve();
    })
  }
};

const mutations = {
  [AUTH_REQUEST]: (state) => {
    state.status = 'loading';
  },
  [AUTH_SUCCESS]: (state, resp) => {
    state.status = 'success';
    localStorage.setItem('user-token', resp.token);
    state.token = resp.token;
  },
  [AUTH_ERROR]: (state, message) => {
    state.status = 'error';
    state.errorMessage = message;
  },
  [AUTH_LOGOUT]: (state) => {
    state.token = '';

  }
};

export default {
  state,
  getters,
  actions,
  mutations,
}
