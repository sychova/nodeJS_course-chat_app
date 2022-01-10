const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const {
    generateWelcome,
    generateJoined,
    generateLeft,
    makeMessageGenerator,
} = require('./utils/messages')

const {
    userToRoomJoiner,
    roomDataFetcher,
    userFromRoomDropper,
} = require('./services')
const { roomRepo } = require('./repos')
const { Location } = require('./entities')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, '../public')
const filter = new Filter()

app.use(express.static(publicDirPath))

app.get('/rooms', async (req, res) => {
    try {
        const rooms = await roomRepo.all()
        res.send({ rooms: rooms.map((r) => r.title) })
    } catch (error) {
        console.error(error)
        res.status(500).send({ error: error.message })
    }
})

io.on('connection', (socket) => {
    console.log('New WebSocket connection.')
    let context = {
        user: null,
        room: null,
    }

    let generateMessage
    let generateLocationMessage

    socket.on('join', async ({ username, room: roomTitle }, callback) => {
        const { error, user, room } = await userToRoomJoiner.call({
            username,
            roomTitle,
        })
        if (error) return callback(error)

        context = {
            user,
            room,
        }
        generateMessage = makeMessageGenerator(user)
        generateLocationMessage = makeMessageGenerator(
            user,
            (location) => `${location}`,
            'url'
        )

        socket.join(room)
        socket.emit('message', generateWelcome())
        socket.broadcast.to(room).emit('message', generateJoined(user))

        const roomWithUsers = await roomDataFetcher.call(room)
        io.to(room).emit('roomData', roomWithUsers)

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed.')
        }

        io.to(context.room).emit('message', generateMessage(message))
        callback()
    })

    socket.on('getLocation', (coords, callback) => {
        io.to(context.room).emit(
            'sendLocation',
            generateLocationMessage(new Location(coords))
        )
        callback()
    })

    socket.on('disconnect', async () => {
        userFromRoomDropper.call(context)
        io.to(context.room).emit('message', generateLeft(context.user))

        const roomWithUsers = await roomDataFetcher.call(context.room)
        io.to(context.room).emit('roomData', roomWithUsers)
    })
})

server.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`)
})
