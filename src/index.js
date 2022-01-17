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
        const roomMessages = await roomMessagesFetcher.call(context.room.id)
        roomMessages.forEach((message) => {
            if (message.attr.type_id == 1) {
                io.to(context.room).emit('message', message.attr)
            } else {
                io.to(context.room).emit('sendLocation', message.attr)
            }
        })
        socket.emit('message', generateWelcome())
        socket.broadcast.to(room).emit('message', generateJoined(user))

        const roomWithUsers = await roomUsersFetcher.call(room)
        io.to(room).emit('roomData', roomWithUsers)

        callback()
    })

    socket.on('sendMessage', async (message, callback) => {
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed.')
        }
        const newMessage = await messageToRoomSender.call({
            user: context.user,
            room: context.room,
            message,
            type: 1,
        })
        io.to(context.room).emit('message', newMessage)
        callback()
    })

    socket.on('getLocation', async (coords, callback) => {
        const newLocation = await locationToRoomSender.call({
            user: context.user,
            room: context.room,
            coords,
            type: 2,
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
