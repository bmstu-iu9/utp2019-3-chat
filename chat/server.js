const http = require('http');
const fs = require('fs');
const path = require('path');

const db = require('./db/db');
const { PORT, devLog } = require('./config');

function urlChecker(req, res, url = null) { //роутинг
    let filePath;
    console.log("_______TEST::: req.url == " + req.url);
    if (url !== null) {
        filePath = path.join(__dirname, 'public', url);
    } else {
        filePath = path.join(__dirname, 'public', req.url === '/' ? 'login.html' : req.url);
    }

    const ext = path.extname(filePath);
    let contentType = 'text/html';
    switch (ext) {
        case '.css': contentType = 'text/css';
            break;
        case '.js': contentType = 'text/javascript';
            break;
        default: contentType = 'text/html';
    }

    if (!ext || (!url && (ext === '.html'))) {      // защита от обхода страницы регистрации\входа пользователя
        filePath = path.join(__dirname, 'public', 'login.html');
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

const server = http.createServer((req, res) => {
    if (req.method === 'POST'){
        req.on('data', data => {
            let POST = {};
            console.log(data);
            data = data.toString().split('&');
            for (let i = 0; i < data.length; i++){
                let dataTMP = data[i].split("=");
                POST[dataTMP[0]] = dataTMP[1];
            }

            if (req.url === '/login'){
                if(db.searchLoginAndPassword(POST['login'], POST['password'], devLog)){
                    db.setClientLoggedIn(POST['login'], POST['key'], devLog);
                    urlChecker(req, res, 'chat.html');
                }else{
                    urlChecker(req, res, 'not_user.html'); //ПЕРЕДЕЛАТЬ
                }

            } else if (req.url === '/signup'){
                if (!db.searchLogin(POST['login'], devLog)){
                    db.setNewUser(POST['login'], POST['password'], devLog);
                    urlChecker(req, res, 'login.html');
                } else {
                    urlChecker(req, res, 'not_user.html');
                }
            }
        });
    } else {
        urlChecker(req, res);
    }
});

server.listen(PORT, () => console.log(`Server has been started on ${PORT}`));
