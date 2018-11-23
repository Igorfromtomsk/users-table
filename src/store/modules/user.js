import { USER_REQUEST, USER_SUCCESS } from '../actions/user';
import Vue from 'vue';

const state = {
  profile: {}
};

const getters = {
  getProfile: state => state.profile
};

const actions = {
  [USER_REQUEST]: ({commit, dispatch}, user) => {
    console.log(user);
    commit(USER_SUCCESS, user);
  },
};

const mutations = {
  [USER_SUCCESS]: (state, user) => {
    state.user = user;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};
