const fs = require('fs');
const path = require('path');
const pathDbUsers = path.join(__dirname, 'users.txt'); //путь к файлу users.txt
const pathDbChat = path.join(__dirname, 'chat.txt'); //путь к файлу chat.txt

class DB {
    constructor(){
        this.clientLoggedIn = []; //массив клиентов, в котором хранятся находящиеся в онлайне клиенты (объекты со значениями логин + ключ)
    }

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

    setNewUser(login, password, log = false) {//запись пользователя (логин + пароль) в users.txt (юзается при регистрации)
        if (this.searchLogin(login) === false) {
            fs.appendFile(pathDbUsers, login + ' ' + password + '\n', err => {
                if (log) console.log('add new user with login: ' + login); //отладочная печать
            });
            return true;
        } else {
            return false;
        }
    };

    setMessage(obj) {
        fs.appendFile(pathDbChat, obj + '\n', err => '');
    };

    getMessage(obj) {
        return fs.readFileSync(pathDbChat, 'utf-8').split('\n');
    };

    setClientLoggedIn(login, key, log = false) { //занести клиента в массив clientsLoggedIn (массив пользователей, которые в онлайне)
        this.clientsLoggedIn.push(
            {
                login: login,
                key: key
            }
        );
        if (log) console.log(this.clientsLoggedIn); //отладочная печать
    };

    checkClientLoggedIn(login, key) { //проверить, находится ли пользователь в онлайне (в массиве clientsLoggedIn)
        for (let client of this.clientsLoggedIn) {
            if (client.login === login && client.key === key) {
                return true;
            }
        }
        return false;
    };

    deleteClientLoggedIn(login, key, log = false) {
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