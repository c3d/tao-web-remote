// Caller must define DOCUMENT_DIR.
// HTTP_PORT may be set to the desired port for the HTTP server.

// TODO make this optional / configurable from Tao
// Public gateway: hostname and port nomber of Socket.IO server
// The emodule uses the gateway to register and obtain a public URL
var GATEWAY  = 'http://localhost:8800';
// TODO make this configurable from Tao
var SEED = 'WebRemote module';

var express = require('express'),
    app = express(),
    http = require('http'),
    util = require('util'),
    server = http.createServer(app),
    prezat = require(PREZ_AT_JS_PATH);
var io = null;
var gwsocket = null;

//
// Start HTTP server and Socket.IO (server)
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
    var addr = getLocalIp();
    port = server.address().port;
    HTTP_PORT = port;
    WEB_REMOTE_LOCAL_URL = 'http://' + addr + '/' + HTTP_PORT;
    console.log('WebRemote: Server started: ' + WEB_REMOTE_LOCAL_URL);

    // If io is created before server is listening, it logs a warning in case
    // the port is not available.
    io = require('socket.io').listen(server);
    io.set('log level', 1);
    io.sockets.on('connection', function(socket) {
        addHandlers(socket);
    });

    console.log('tao.WEB_REMOTE_LOCAL_PORT := ' + HTTP_PORT);
    console.log('tao.WEB_REMOTE_LOCAL_URL := "' + WEB_REMOTE_LOCAL_URL +'"');
});
server.listen(port);


//
// Define routing for HTTP requests
//

app.get('/',
        function(req, rsp) {
            rsp.sendfile(__dirname + '/static/web_remote.html');
        });
app.configure(function(){
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use('/thumbnails', express.static(DOCUMENT_DIR + '/thumbnails'));
    app.use('/static', express.static(__dirname + '/static'));
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
        io.sockets.emit(':currentpage', currentPage);
    if (gwsocket)
        gwsocket.emit(':currentpage', currentPage);
}

// Page 0 is not used
var pageNames = [ '' ];
function setPageName(pagenum, pagename) {
    pageNames[pagenum] = pagename;
}

function sendPageNames() {
    if (io)
        io.sockets.emit(':pagenames', pageNames);
    if (gwsocket)
        gwsocket.emit(':pagenames', pageNames);
}

process.stdin.resume();
process.stdin.on('data', function(chunk) {
    var buffer = '';
    buffer += chunk;
    buffer = buffer.replace(/[\n\r]/g, '').trim();
    eval(buffer);
});

//
// Connect to the public gateway
//

if (typeof(GATEWAY) !== 'undefined') {

    prezat.connectToPrezGateway(GATEWAY, SEED, port, function(err, socket, publicUrl) {
        console.log('Public url is ' + publicUrl);
        gwsocket = socket;
        // For user messages forwarded from gateway
        addHandlers(socket);

        socket.on('newclientconnection', function(param, callback) {
            // A new client has connected to the gateway, it needs
            // page information
            var notifications = [ {name: ':pagenames', value: pageNames},
                                  {name: ':currentpage', value: currentPage } ];
            callback(notifications);
        });
    });
}

//
// Helper functions
//

function getLocalIp() {
    function startsWith(str1, str2) {
        return (str1.slice(0, str2.length) == str2);
    }
    var os = require('os');
    var ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        for (var i in ifaces[dev]) {
            details = ifaces[dev][i];
            if (details.family === 'IPv4') {
                if (startsWith(details.address, '127.') === false) {
                    return details.address;
                }
            }
        }
    }
    return 'localhost';
}

// Handle client messages
function addHandlers(socket) {
    socket.emit(':pagenames', pageNames);
    socket.emit(':currentpage', currentPage);
    socket.on(':next', function() {
        process.stdout.write('tao.next_page\n');
    });
    socket.on(':prev', function() {
        process.stdout.write('tao.previous_page\n');
    });
    socket.on(':gotopage', function(n) {
        process.stdout.write('tao.goto_page page_name ' + n +' ; refresh 0\n');
    });
}
