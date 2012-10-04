var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , Cursor = function (x, y) {
        this.x = x;
        this.y = y;
  }
  , cursors = {};

server.listen(1234);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/cursor.png', function (req, res) {
  res.sendfile(__dirname + '/cursor.png');
});

io.sockets.on('connection', function (socket) {
    socket.on('mousemove', function (ev) {
        console.log(ev);
        if (!cursors.hasOwnProperty(socket.id)) {
            cursors[socket.id] = new Cursor(ev.x, ev.y);
        } else {
            cursors[socket.id].x = ev.x;
            cursors[socket.id].y = ev.y;
        }
    });

    socket.on('disconnect', function() {
        if (cursors.hasOwnProperty(socket.id)) {
            delete cursors[socket.id];
        }
    });
});

setInterval(function () {
    io.sockets.emit('update', {
        cursors: cursors
    });
}, 10);
