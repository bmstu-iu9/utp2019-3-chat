const fs = require('fs');
const path = require('path');
const pathDbUsers = path.join(__dirname, 'users.txt'); //путь к файлу users.txt
const pathDbChat = path.join(__dirname, 'chat.txt'); //путь к файлу chat.txt

class DB {
    constructor(){
        this.clientsLoggedIn = []; //массив клиентов, в котором хранятся находящиеся в онлайне клиенты (объекты со значениями логин + ключ)
    }

    searchUser(login, password=null, log=false) {
        let users = fs.readFileSync(pathDbUsers, 'utf-8').split('\n');
        for (let i = 0; i < users.length - 1; i++) {
            let separated = users[i].split(' ');
            if (password) {
                if (login === separated[0] && password === separated[1]) {
                    if (log) console.log(`name: ${separated[0]} logged in`);
                    return true;
                }
            } else {
                if (login === separated[0]) {
                    if (log) console.log(`name: ${separated[0]} logged in`);
                    return true;
                }
            }
        }
        if (log) console.log(`name: ${login} attempt to log in`);
        return false;
    };
    //старая версия реализации searchUser
    searchLogin(login, log = false) { //поиск переданного логина в файле users.txt
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
    //старая версия реализации searchUser
    searchLoginAndPassword(login, password, log = false) {//поиск переданного логина+пароля в users.txt
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
    //запись пользователя (логин + пароль) в users.txt (юзается при регистрации)
    setNewUser(login, password, log=false) {
        if (!this.searchUser(login)) {
            fs.appendFile(pathDbUsers, login + ' ' + password + '\n', err => {
                if (log) console.log('add new user: ' + login);
            });
            return true;
        } else {
            if (log) console.log(`name: ${login} attempt to sign up`);
            return false;
        }
    };

    setMessage(obj) {
        fs.appendFile(pathDbChat, obj + '\n', err => '');
    };

    getMessage(room) {
        const chat = fs.readFileSync(pathDbChat, 'utf-8').split('\n');
        const chatMess = [];
        for (let i = 0; i < chat.length - 1; i++) {
            if (JSON.parse(chat[i]).room === room) chatMess.push(chat[i]);
        }
        console.log(chatMess);
        return chatMess;
    };
    //занести клиента в массив clientsLoggedIn (массив пользователей, которые в онлайне)
    setClientLoggedIn(login, key, log = false) {
        for (let item of this.clientsLoggedIn) {
            if (item.login === login && item.key === key) {
                if (log)
                    console.log(this.clientsLoggedIn);
                return;
            }
        }
        this.clientsLoggedIn.push({
            login: login,
            key: key
        });
        if (log) console.log(this.clientsLoggedIn); //отладочная печать
    };
    //проверить, находится ли пользователь в онлайне (в массиве clientsLoggedIn)
    checkClientLoggedIn(login, key) {
        for (let client of this.clientsLoggedIn) {
            if (client.login === login && client.key === key) {
                return true;
            }
        }
        return false;
    };
    //новая реализация метода. Старая - ниже
    deleteClientLoggedIn(login, key, log=false) {
        this.clientsLoggedIn.splice(this.clientsLoggedIn.findIndex(client => client.login === login && client.key === key), 1);
        if (log) console.log('deleted: ' + login + ' key: ' + key);
    };
    //старая версия реализации метода
    deleteClientLoggedIn2(login, key, log = false) {
        let index;
        for (let i = 0; i < this.clientsLoggedIn.length; i++) {
            if ((login === this.clientsLoggedIn[i].login) && (key === this.clientsLoggedIn[i].key)) {
                index = i;
                break;
            }
        }
        this.clientsLoggedIn.splice(index, 1);
        if (log) console.log('deleted object: ' + login + ' key: ' + key + ' deleted index: ' + index); //отладочная печать
    };
}

module.exports = DB;