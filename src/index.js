const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRooms
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT

const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

app.get('/rooms', async (req, res) => {
    try {
        const rooms = getRooms()
        res.send(rooms)
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

io.on('connection', (socket) => {
    console.log('New WebSocket connection.')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed.')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('getLocation', (location, callback) => {
        const user = getUser(socket.id)
        getRooms()
        io.to(user.room).emit('sendLocation', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})
server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
