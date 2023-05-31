# node-websocket

node.jsとwebsocketの思い出し

## node.js インストール（Windowsの場合）

https://nodejs.org/ja/ から .msi をダウンロードして実行。

## node.js インストール（CentOSの場合）

```
$ sudo yum install nodejs
```

ポート開放（一時的）

```
$ ss -antu
$ sudo firewall-cmd --list-services
$ sudo firewall-cmd --list-ports
$ sudo firewall-cmd --add-port=8080/tcp
$ sudo firewall-cmd --list-ports
```

## インストール

```
git clone https://github.com/morimoto-hiroshi/node-websocket.git
cd node-websocket
npm install    //package.json に基づいて node_modules/ 以下へ websocket がダウンロードされる
npm list       //確認
```

なおこのプロジェクトの作成時は次のように操作

```
cd node-websocket
npm init
npm install websocket   //websocket が node_modules/ 以下にダウンロードされ package.json に追記される
npm list
```

## 参考

- Node.js https://www.tohoho-web.com/ex/nodejs.html
- WebSocket https://github.com/theturtle32/WebSocket-Node
- Socket.IO https://socket.io/get-started/basic-crud-application/
