import axios from 'axios';

const AuthorixationModyle = (function () {
  let users = [];

  function error(code, reject) {
    let error = {
      status: false,
      code: code
    };

    switch (code) {
      case 1:
        error.message = 'Такой пользователь не зарегистрирован';
        break;
      case 2:
        error.message = 'Пара логин-пароль не верна';
        break;
    }

    reject(error);
  }

  return {
    isAuthorized: false,
    signIn: function (props) {
      //there is a simple simulation of server side authorization

      return new Promise(function (resolve, reject) {
        if (users.length === 0) {
          axios
            .get('http://my-json-server.typicode.com/Igorfromtomsk/users-table/users')
            .then(r => {
              users = r.data;
              resolve(users);
            })
        } else {
          resolve(users);
        }
      }).then((users) => {
        const self = this;

        return new Promise(function (resolve, reject) {
          let founded_users = users.filter(user => user.login === props.login);

          if (founded_users.length === 0) {
            error(1, reject);
            return true;
          }

          founded_users = founded_users.filter(user => user.password === props.password);

          if (founded_users.length === 0) {
            error(2, reject);
            return true;
          }

          self.isAuthorized = true;
          resolve({status: true, token: new Date().getTime()}); //kind of token here
        });
      });
    }
  }
})();

export default AuthorixationModyle;