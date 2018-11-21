<template>
  <div id="app">
    <div class="container">
      <div class="clearfix">
        <div class="card" style="width: 18rem;">
          <img class="card-img-top" src="https://via.placeholders.com/100x180" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">Card title</h5>
            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'app',
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
          .get('http://my-json-server.typicode.com/Igorfromtomsk/users-table/posts')
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
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
