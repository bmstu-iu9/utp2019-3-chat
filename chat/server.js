const http = require('http');
const fs = require('fs');
const path = require('path');

const DB = require('./db/db');
const db = new DB();

const { PORT, devLog } = require('./config');

function urlChecker(req, res) { //роутинг
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'login.html' : req.url);
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    switch (ext) {
        case '.css': contentType = 'text/css';
            break;
        case '.js': contentType = 'text/javascript';
            break;
        default: contentType = 'text/html';
    }

    if (!ext) {
        filePath += '.html';
    }

    fs.readFile(filePath, (err, content) =>{ //принимает запрос из браузера на страницу/файл, проверяет эту страницу\файл на сервере  и возвращает его (или ошибку)
        if (err) {
            fs.readFile(path.join(__dirname, 'public', 'error.html'), (err, data) =>{
                if (err){
                    res.writeHead(500);
                    res.end('Error');
                }else{
                    res.writeHead(200, {
                        'Content-Type': contentType
                    });
                    res.end(data);
                }
            })
        }else {
            res.writeHead(200, {
                'Conent-Type': contentType
            });
            res.end(content);
        }
    });
}

function body(res, payload){
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
        data: payload.data
    }));
}


const server = http.createServer((req, res) => {
    if (req.method === 'POST'){
        req.on('data', data => {
            let POST = JSON.parse(data);
            if (req.url === '/login'){
                if (db.searchLoginAndPassword(POST['login'], POST['password'], devLog)){
                    db.setClientLoggedIn(POST['login'], POST['key'], devLog);
                    body(res, {data: true});
                }else{
                    body(res, {data: false});
                }

            } else if (req.url === '/signup'){
                if (!db.searchLogin(POST['login'], devLog)){
                    db.setNewUser(POST['login'], POST['password'], devLog);
                    body(res, {data: true});
                } else {
                    body(res, {data: false});
                }
            } else if (req.url === '/chat'){
                if (db.checkClientLoggedIn(POST['login'], POST['key'])) {
                    body(res, {data: true});
                } else {
                    body(res, {data: false});
                }
            }
        });
    } else if (req.url === '/usersOnline') {
        body(res, {data : getUsersWSS()})
    } else {
        urlChecker(req, res);
    }
});

const Websocket = require('ws');
const wss = new Websocket.Server({server});

wss.on('connection', ws => {
    ws.on('message', message => {
        let data = JSON.parse(message);
        if (data['SYSTEM']) {
            wsSystem(ws, data);
        }


    });
});

server.listen(PORT, () => console.log(`Server has been started on ${PORT}`));
