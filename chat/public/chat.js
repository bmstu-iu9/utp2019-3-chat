const URL = 'http://localhost:3000/';
const urlWS = 'ws://localhost:3000/';
const login = localStorage.getItem('login');
const key = localStorage.getItem('key');


function WS() {
    const ws = new WebSocket(urlWS);
    // сокеты нотивно поддерживаются в браузерах
    // используют протокол ws
    // Протокол WebSocket — это независимый протокол, основанный на протоколе TCP.
    // Он делает возможным более тесное взаимодействие между браузером и веб-сайтом,
    // способствуя распространению интерактивного содержимого и созданию приложений реального времени.
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