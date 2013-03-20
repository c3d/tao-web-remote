// Caller must define DOCUMENT_DIR

var PORT = 8000;
var express = require('express'),
    app = express(),
    http = require('http'),
    fs = require('fs'),
    util = require('util'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

server.listen(PORT);
console.log('HTTP server ready: http://localhost:' + PORT + '/');

app.get('/',
        function(req, rsp) {
            rsp.sendfile(__dirname + '/web_remote.html');
        });
app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use('/thumbnails', express.static(DOCUMENT_DIR + '/thumbnails'));
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
    app.use(app.router);
});

io.set('log level', 1);
io.sockets.on('connection', function(socket) {
    socket.emit('currentpage', { num:pagenum, name:pagename });
    socket.emit('pagecount', pagecount);
    socket.on('next', function(m) { console.log('tao.next_page'); });
    socket.on('prev', function(m) { console.log('tao.previous_page'); });
    socket.on('gotopage', function(n) { console.log('tao.goto_page page_name ' + n +' ; refresh 0'); });
});

var pagename = '';
var pagenum = 1;
function setPageName(name, num) {
   pagename = name;
   pagenum = num;
   io.sockets.emit('currentpage', { num:num, name:name }); 
}

var pagecount = 0;
function setPageCount(t) {
    pagecount = t;
    sendPageCount();
}

function sendPageCount() {
    io.sockets.emit('pagecount', pagecount);
}

process.stdin.resume();
process.stdin.on('data', function(chunk) {
    var buffer = '';
    buffer += chunk;
    buffer = buffer.replace(/[\n\r]/g, '').trim();
    eval(buffer);
});


