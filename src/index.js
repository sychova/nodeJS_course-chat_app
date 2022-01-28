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
} = require('./services')
const actions = require('./actions')
const middlewares = require('./middlewares')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(middlewares)

app.get('/rooms', actions.getRooms)
app.get('/room/:roomId/messages', actions.getRoomMessages)

io.on('connection', async (socket) => {
    const { username, roomTitle } = socket.handshake.query
    console.log(`User ${username} has been connected`)

    const { error, user, room } = await userToRoomJoiner.call({
        username,
        roomTitle,
    })
    if (error) throw error

    const context = {
        user,
        room,
    }

    socket.join(context.room)
    socket.emit('message', generateWelcome())
    socket.to(context.room).emit('message', generateJoined(user))

    const roomWithUsers = await roomUsersFetcher.call(room)
    io.to(room).emit('roomData', roomWithUsers)

    console.log(`User ${username} has been joined to ${roomTitle}`)

    socket.on('message', async (message, callback) => {
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

    socket.on('location', async (coords, callback) => {
        const newLocation = await locationToRoomSender.call({
            user: context.user,
            room: context.room,
            coords,
            type: 'location',
        })
        io.to(context.room).emit('location', newLocation)
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
