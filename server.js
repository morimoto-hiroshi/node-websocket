//利用モジュール
const os = require('os');
const fs = require('fs');
const http = require('http');
const websocketServer = require('websocket').server;

//定数
const [EN0] = Object.values(os.networkInterfaces());
const {address: ADDRESS} = EN0.find(({family}) => family === 'IPv4'); //サーバーのIPアドレス
const PORT = 3000; //httpサーバーのポート
const PROTOCOL = 'my-chat'; //WebSocketのプロトコル識別子

//httpサーバーのrequestハンドラ
const g_httpServer = http.createServer((request, response) => {
    const url = request.url;
    switch (url) {
        case '/':
            fs.readFile('./public/index.html', 'utf-8', (error, data) => {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(data);
                response.end();
            })
            break;
        default:
            response.writeHead(404);
            response.end();
    }
});

//httpサーバーを起動
g_httpServer.listen(PORT, () => {
    console.log(`${new Date()} listen http://${ADDRESS}:${PORT}`);
});

//WebSocketサーバーをhttpサーバーに寄生させる
const g_websocketServer = new websocketServer({
    httpServer: g_httpServer,
    autoAcceptConnections: false //cross-origin protectionを無効化しない
});

//WebSocketサーバーのrequestハンドラ
g_websocketServer.on('request', (request) => {
    //originの検査
    console.log(`${new Date()} check origin: ${request.origin}`);
    if (request.origin !== `http://localhost:${PORT}` && request.origin !== `http://${ADDRESS}:${PORT}`) {
        request.reject();
        console.log(`${new Date()} REJECTED: ${request.origin}`);
        return;
    }

    //コネクション確立とイベントハンドラ
    const connection = request.accept(PROTOCOL, request.origin);
    console.log(`${new Date()} acceepted: ${connection.remoteAddress}`);
    connection.on('message', message => {
        switch (message.type) {
            case 'utf8':
                console.log(`${new Date()} text message: ${message.utf8Data}`);
                //connection.sendUTF(message.utf8Data) //送信元だけに送る場合
                g_websocketServer.broadcast(message.utf8Data); //全端末に送る場合
                break;
            case 'binary':
                console.log(`${new Date()} binary message: ${message.binaryData.length}byte`);
                connection.sendBytes(message.binaryData);
                break;
        }
    })
    connection.on('close', (reasonCode, description) => {
        console.log(`${new Date()} closed: ${connection.remoteAddress}`);
    })
});
