const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3001


app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('', (req, res) => {
    res.render('index')
  })

app.get('/room', (req, res) => {
  res.render('room')
})


io.on('connection', socket => {
    socket.on('join-room', function(roomId, userId){
        console.log(roomId, userId)
        socket.join(roomId)   // joining the room
        socket.to(roomId).broadcast.emit('user-connected', userId)
  
        socket.on('disconnect', function(){
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })

    socket.on('username', function(data) {
        console.log(data.username)
        socket.to(data.room).broadcast.emit('message', data.username)
    })

})


server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
