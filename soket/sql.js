const app = require('express')();
const http = require('http').createServer(app);
var mysql = require('mysql')
// Let’s make node/socketio listen on port 3000
const io = require('socket.io')(http);
var set = require('./setting.json')

console.log(set);
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/../index.html'); 
});


// Define our db creds
var db = mysql.createConnection({
    host: set.db_host,
    user: set.db_user,
    password: set.db_password,
    database: set.db_database
})

// Log any errors connected to the db
db.connect(function(err){
    if (err) console.log(err)
})

// Define/initialize our global vars
var notes = []
var isInitNotes = false
var socketCount = 0

io.sockets.on('connection', function(socket){
    // Socket has connected, increase socket count
    socketCount++
    // Let all sockets know how many are connected
    io.sockets.emit('users connected', socketCount)

    socket.on('disconnect', function() {
        // Decrease the socket count on a disconnect, emit
        socketCount--
        io.sockets.emit('users connected', socketCount)
    })

    socket.on('weight', function(data){
        // New note added, push to all sockets and insert into db
        io.sockets.emit('weight', data)
        // Use node's db injection format to filter incoming data
        db.query('INSERT INTO weight (weight) VALUES (?)', data)
    })


})

http.listen(3000, () => {
    console.log('Connected at 3000');
});