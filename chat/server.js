const http = require('http');
const fs = require('fs');
const path = require('path');

function urlChecker(req, res, url = null) {
    //console.log(req.url);
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
    if (!ext)
        filePath += '.html';
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
        }else{
            res.writeHead(200, {
                'Conent-Type': contentType
            });
            res.end(content);
        }
    });
}

const server = http.createServer((req, res) => {

});

const PORT = process.env.PORT || 3000;//process.env.PORT - порт, который используется при запуске. Если никакого порта не дали, по дефолту юзается 3000
server.listen(3000, () => console.log(`Server has been started on ${PORT}`));