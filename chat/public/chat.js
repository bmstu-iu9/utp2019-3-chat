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

function printMessage(value) {
    let div = document.createElement("div");
    // div.className = 'list-chat-item';
    div.innerHTML = `<div class="list-chat-mes ${value['login'] === login ? 'list-chat-mes_right': 'list-chat-mes_left'}">
                        <div class="user-name">${value['login']}</div>
                        <div class="">${value['mes']}</div>
                     </div>
                    `;
    listForm.appendChild(div);
    listChat.scrollTo(0, listChat.scrollHeight);
}


function WS() {
    const ws = new WebSocket(urlWS);
    // сокеты нотивно поддерживаются в браузерах
    // используют протокол ws
    // Протокол WebSocket — это независимый протокол, основанный на протоколе TCP.
    // Он делает возможным более тесное взаимодействие между браузером и веб-сайтом,
    // способствуя распространению интерактивного содержимого и созданию приложений реального времени.
    let nameChat = 'all';

    typeMess = function (chatName) {
        nameChat = chatName;
        clearListChat();
        showMenu();
        getMess(nameChat);
    };

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