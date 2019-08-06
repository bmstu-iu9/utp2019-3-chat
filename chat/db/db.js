const fs = require('fs');
const path = require('path');
const pathDbUsers = path.join(__dirname, 'users.txt'); //путь к файлу users.txt
const pathDbChat = path.join(__dirname, 'chat.txt'); //путь к файлу chat.txt
const clientsLoggedIn = []; //массив клиентов, в котором хранятся находящиеся в онлайне клиенты (объекты со значениями логин + ключ)

const searchLogin = function (login, log = false) { //поиск переданного логина в файле users.txt
    let users = fs.readFileSync(pathDbUsers, 'utf-8').split('\n');
    for (let i = 0; i < users.length - 1; i++) {
        let separated = users[i].split(' ');
        if (login === separated[0]) {
            if (log) console.log(`login: ${separated[0]} logged in`);//отладочная печать
            return true;
        }
    }
    if (log) console.log(`login: ${login} attempt to log in`);
    return false;
};

const searchLoginAndPassword = function (login, password, log = false) {//поиск переданного логина+пароля в users.txt
    let users = fs.readFileSync(pathDbUsers, 'utf-8').split('\n');
    for (let i = 0; i < users.length - 1; i++) {
        let separated = users[i].split(' ');
        if (login === separated[0] && password === separated[1]) {
            if (log) console.log(`login: ${separated[0]} logged in`);//отладочная печать
            return true;
        }
    }
    if (log) console.log(`login: ${login} attempt to log in`);//отладочная печать
    return false;
};

const setNewUser = function (login, password, log = false){//запись пользователя (логин + пароль) в users.txt (юзается при регистрации)
    if (searchLogin(login) === false) {
        fs.appendFile(pathDbUsers, login + ' ' + password + '\n', err => {
            if (log) console.log('add new user with login: ' + login); //отладочная печать
        });
        return true;
    }else {
        return false;
    }
};

const setMessage = function (obj) {
    fs.appendFile(pathDbChat, obj + '\n', err => '');
};

const getMessage = function (obj) {
    return fs.readFileSync(pathDbChat, 'utf-8').split('\n');
};

const setClientLoggedIn = function (login, key, log = false){ //занести клиента в массив clientsLoggedIn (массив пользователей, которые в онлайне)
    clientsLoggedIn.push(
        {
            login : login,
            key : key
        }
        );
        if (log) console.log(clientsLoggedIn); //отладочная печать
};

const checkClientLoggedIn = function (login, key){ //проверить, находится ли пользователь в онлайне (в массиве clientsLoggedIn)
        for (let client of clientsLoggedIn){
            if (client.login === login && client.key === key){
                return true;
            }
        }
        return false;
};

module.exports = {
    searchLoginAndPassword : searchLoginAndPassword,
    setNewUser : setNewUser,
    getMessage: getMessage,
    setMessage : setMessage,
    setClientLoggedIn : setClientLoggedIn,
    checkClientLoggedIn : checkClientLoggedIn

};