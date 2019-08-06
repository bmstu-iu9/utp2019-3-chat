const fs = require('fs');
const path = require('path');
const pathDbUsers = path.join(__dirname, 'users.txt');

const searchLogin = function (login, log = false) {
    let users = fs.readFileSync(pathDbUsers, 'utf-8').split('\n');
    for (let i = 0; i < users.length - 1; i++) {
        let separated = users[i].split(' ');
        if (login === separated[0]) {
            if (log) console.log(`login: ${separated[0]} logged in`);
            return true;
        }
    }
    if (log) console.log(`login: ${login} attempt to log in`);
    return false;
};

const searchLoginAndPassword = function (login, password, log = false) {
    let users = fs.readFileSync(pathDbUsers, 'utf-8').split('\n');
    for (let i = 0; i < users.length - 1; i++) {
        let separated = users[i].split(' ');
        if (login === separated[0] && password === separated[1]) {
            if (log) console.log(`login: ${separated[0]} logged in`);
            return true;
        }
    }
    if (log) console.log(`login: ${login} attempt to log in`);
    return false;
};

const setNewUser = function (login, password, log = false){
    if (!searchLogin(login)) {
        fs.appendFile(pathDbUsers, login + ' ' + password + '\n', err => {
            if (log) {
                console.log('add new user with login: ' + login);
            }
        });
        return true;
    }else {
        return false;
    }
};

module.exports = {
    searchLoginAndPassword : searchLoginAndPassword,
    setNewUser : setNewUser
};