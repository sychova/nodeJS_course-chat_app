const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const {
    generateWelcome,
    generateJoined,
    generateLeft,
} = require('./utils/messages')

const {
    userToRoomJoiner,
    roomUsersFetcher,
    userFromRoomDropper,
    messageToRoomSender,
    locationToRoomSender,
    roomMessagesFetcher,
} = require('./services')
const { roomRepo } = require('./repos')
const { Location } = require('./entities')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const publicDirPath = path.join(__dirname, '../public')

app.use(express.static(publicDirPath))

app.get('/rooms', async (req, res) => {
    try {
        const rooms = await roomRepo.all()
        res.json({ rooms: rooms.map((r) => r) })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})

app.get('/room/:roomId/messages', async (req, res) => {
    try {
        const roomId = req.params.roomId
        const roomMessages = await roomMessagesFetcher.call(roomId)
        res.json(roomMessages)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
})

io.on('connection', (socket) => {
    console.log('New WebSocket connection.')
    let context = {
        user: null,
        room: null,
    }

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

        socket.join(room)
        socket.emit('message', generateWelcome())
        socket.broadcast.to(room).emit('message', generateJoined(user))

        const roomWithUsers = await roomUsersFetcher.call(room)
        io.to(room).emit('roomData', roomWithUsers)

        callback()
    })

    socket.on('sendMessage', async (message, callback) => {
        const newMessage = await messageToRoomSender.call({
            user: context.user,
            room: context.room,
            message,
            type: 'text',
        })
        io.to(context.room).emit('message', {
            content: newMessage.content,
            createdAt: newMessage.createdAt,
            username: context.user.username,
        })
        callback()
    })

    socket.on('getLocation', async (coords, callback) => {
        const newLocation = await locationToRoomSender.call({
            user: context.user,
            room: context.room,
            coords,
            type: 'location',
        })
        io.to(context.room).emit('sendLocation', newLocation)
        callback()
    })

    socket.on('disconnect', async () => {
        userFromRoomDropper.call(context)
        io.to(context.room).emit('message', generateLeft(context.user))
        const roomWithUsers = await roomUsersFetcher.call(context.room)
        io.to(context.room).emit('roomData', roomWithUsers)
    })
})

server.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`)
})
