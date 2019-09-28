const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password : 'pass',
  database: 'sunday'
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
  connection.end();
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    // console.log(msg)
    // io.emit('chat message', msg);
    connection.connect();
    connection.query('INSERT INTO weight(weight) VALUES ('+msg+ ') ', function (error, results, fields) {
      if (error) {
        console.log(error);
      }
      console.log(results);
    });
    connection.end();
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
http.listen(3000, () => {
  console.log('Connected at 3000');
});
