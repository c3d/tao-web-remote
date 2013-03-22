// Caller must define DOCUMENT_DIR.
// HTTP_PORT may be set to the desired port for the HTTP server.
var express = require('express'),
    app = express(),
    http = require('http'),
    util = require('util'),
    server = http.createServer(app);
var io = null;


//
// Start HTTP server and Socket.IO
//

var port = (typeof(HTTP_PORT) == 'undefined') ? 8000 : HTTP_PORT;
var retryPort = port;
server.on('error', function(err) {
    if (retryPort === port + 10) {
        // No luck, ask for a dynamic port
        retryPort = 0;
    } else if (retryPort === 0) {
        // listen(0) failed
        console.error('web_remote.js Could not start server');
        return;
    } else {
        retryPort++;
    }
    server.listen(retryPort);
});
server.on('listening', function() {
    port = server.address().port;
    HTTP_PORT = port;
    console.log('WebRemote: Server started: http://localhost:' + HTTP_PORT);

    // If io is created before server is listening, it lorgs a warning in case
    // the port is not available.
    io = require('socket.io').listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function(socket) {
        socket.emit('pagenames', pageNames);
        socket.emit('currentpage', currentPage);
        socket.on('next', function() {
            process.stdout.write('tao.next_page\n');
        });
        socket.on('prev', function() {
            process.stdout.write('tao.previous_page\n');
        });
        socket.on('gotopage', function(n) {
            process.stdout.write('tao.goto_page page_name ' + n +' ; refresh 0\n');
        });
    });

    console.log('tao.WEB_REMOTE_LOCAL_PORT := ' + HTTP_PORT);
    console.log('tao.WEB_REMOTE_LOCAL_URL := "http://localhost:' + HTTP_PORT +'"');
});
server.listen(port);


//
// Define routing for HTTP requests
//

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


//
// Functions called by Tao
//

var currentPage = 1;
function setCurrentPage(pagenum) {
    currentPage = pagenum;
    if (io)
        io.sockets.emit('currentpage', currentPage);
}

// Page 0 is not used
var pageNames = [ '' ];
function setPageName(pagenum, pagename) {
    pageNames[pagenum] = pagename;
}

function sendPageNames() {
    if (io)
        io.sockets.emit('pagenames', pageNames);
}

process.stdin.resume();
process.stdin.on('data', function(chunk) {
    var buffer = '';
    buffer += chunk;
    buffer = buffer.replace(/[\n\r]/g, '').trim();
    eval(buffer);
});
