const URL = 'http://localhost:3000/';
const urlWS = 'ws://localhost:3000/';
const login = localStorage.getItem('login');
const key = localStorage.getItem('key');

const listForm = document.getElementById('list-chat-container');
const listChat = document.querySelector('.list-chat');
const userList = document.getElementById('user-list');
const input = document.getElementById('textarea');
const menu = document.getElementById('menu');
const chatList = document.getElementById('chat-list');
const nameDiv = document.querySelector('.chat-header-name');

let showMenuTmp = false;
let logout;
let typeMess;
let name = 'all';

nameDiv.innerHTML = `${name}`;
// console.log(nameDiv);

function showMenu() {
    if (!showMenuTmp) {
        showMenuTmp = true;
        menu.classList.remove('hidden');
        chatList.classList.add('hidden');

        fetch(URL + 'usersOnline', {method: 'GET'})
            .then(res => res.json())
            .then(data => {
                printUsers(data['data']);
            })
    } else {
        showMenuTmp = false;
        menu.classList.add('hidden');
        chatList.classList.remove('hidden');
    }
}

function printUsers(value) {
    let users = `<div class="users-list-item" onclick="typeMess('all')">all</div>`;
    value.forEach(item => {
        users += `<div class="users-list-item" onclick="typeMess('${item}')">${item}</div>`
    });
    userList.innerHTML = users;
}

function printMessage(value) {
    let div = document.createElement("div");
    div.className = 'list-chat-item';
    div.innerHTML = `<div class="list-chat-mes ${value['login'] === login ? 'list-chat-mes_right': 'list-chat-mes_left'}">
                        <div class="user-name">${value['login']}</div>
                        <div class="">${value['mes']}</div>
                     </div>
                    `;
    listForm.appendChild(div);
    listChat.scrollTo(0, listChat.scrollHeight);
}

function clearListChat() {
    const removeElements = (elms) => elms.forEach(el => el.remove());
    removeElements( document.querySelectorAll(".list-chat-item") );
}

function WS() {

    input.addEventListener('keydown', event => {
        if (event.keyCode === 9) {
            event.preventDefault();
        }
    });

    let pressed = new Set();

    document.addEventListener('keydown', (event) => {
        pressed.add(event.keyCode);
        for (let code of [16, 13]) {
            if (!pressed.has(code)) return;
        }
        sendMes();
        pressed.clear();
    });

    document.addEventListener('keyup', () => {
        pressed.clear();
    });

    window.addEventListener("beforeunload", () => {
        ws.send(JSON.stringify({
            'CLOSE': {
                'login': login,
                'key': key
            }
        }));
    });

    const ws = new WebSocket(urlWS);

    // сокеты нотивно поддерживаются в браузерах
    // используют протокол ws
    // Протокол WebSocket — это независимый протокол, основанный на протоколе TCP.
    // Он делает возможным более тесное взаимодействие между браузером и веб-сайтом,
    // способствуя распространению интерактивного содержимого и созданию приложений реального времени.

    let nameChat = 'all';

    function getMess (chatName) {
        ws.send(JSON.stringify({
            'OLDMESS': {
                'login': login,
                'key': key,
                'room': chatName
            }
        }))
    }

    typeMess = function (chatName) {
        nameChat = chatName;
        clearListChat();
        showMenu();
        getMess(nameChat);
    };

    logout = function () {
        localStorage.clear();
        ws.send(JSON.stringify({
            'LOGOUT': {
                'login': login,
                'key': key
            }
        }));
        window.location.href = URL + 'login'
    };

    function sendMes() {
        if (input.value !== '') {
            let data = JSON.stringify({
                'SENDMESS': {
                    'room': nameChat,
                    'login': login,
                    'key': key,
                    'mes': input.value,
                }
            });
            ws.send(data);
        }
        input.value = '';
    }

    ws.onmessage = response => {
        let data = JSON.parse(response.data);
        if (data !== 'notUser') {
            if (data['oldMess']) {
                for (let i = 0; i < data.oldMess.length; i++) {
                    let dataMes = JSON.parse(data.oldMess[i]);
                    if (dataMes) printMessage(dataMes);
                }
            }
            if (data['mes']) printMessage(data);
        } else {
            window.location.href = URL;
        }
    };

    ws.onopen = () => {
        ws.send(JSON.stringify({
            'SYSTEM': {
                'login': login,
                'key': key,
                'room': nameChat
            }
        }));
        console.log('ONLINE');
        // setStatus('ONLINE')
    };

    ws.onclose = () => console.log('OFFLINE'); //setStatus('OFFLINE');
}

function sendAuthData() {
    fetch(URL + 'chat', {
        method: 'POST',
        body: JSON.stringify({
            login: localStorage.getItem('login'),
            key: localStorage.getItem('key')
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data['data']) {
                WS();
            } else {
                window.location.href = URL + 'login'
            }
        })
}

sendAuthData();
