const fs = require('fs');
const path = require('path');

module.exports = {
    setNewUser: function (login, password, log = false){
        fs.appendFile(path.join(__dirname, 'users.txt'), login + ' ' + password + '\n', err => {
            if (log)
                console.log('add new user with login: ' + login);
        })
    }
};