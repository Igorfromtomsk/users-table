import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user'
import Vue from 'vue'
import { AUTH_LOGOUT } from '../actions/authorization'

const state = {
  status: '',
  profile: {}
};

const getters = {
  getProfile: state => state.profile,
  isProfileLoaded: state => !!state.profile.name,
};

const actions = {
  [USER_REQUEST]: ({commit, dispatch}, user) => {
    commit(USER_SUCCESS, user);
  },
};

const mutations = {
  [USER_SUCCESS]: (state, user) => {
    state.status = 'success';
    Vue.set(state, 'profile', user);
    localStorage.profile = user;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
