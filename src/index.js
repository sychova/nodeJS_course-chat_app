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
const { applyRoutes } = require('./routes')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(middlewares)
applyRoutes(app, actions)

io.on('connection', async (socket) => {
    const { username, roomTitle } = socket.handshake.query
    console.log(`User ${username} has been connected`)

    const { error, user, room } = await userToRoomJoiner.call({
        username,
        roomTitle,
    })
    if (error) throw error

    const context = { user, room }
    socket.join(room)
    socket.emit('message', generateWelcome())
    socket.to(room).emit('message', generateJoined(user))

    const syncRoomData = async () => {
        const roomWithUsers = await roomUsersFetcher.call(room)
        io.to(room).emit('roomData', roomWithUsers)
    }

    console.log(`User ${username} has been joined to ${roomTitle}`)
    syncRoomData()

    socket.on('message', async (text, callback) => {
        const message = await messageToRoomSender.call({
            ...context,
            message: text,
            type: 'text',
        })
        io.to(context.room).emit('message', {
            content: message.content,
            createdAt: message.createdAt,
            username: context.user.username,
        })
        callback()
    })

    socket.on('location', async (coords, callback) => {
        const message = await locationToRoomSender.call({
            ...context,
            coords,
            type: 'location',
        })
        io.to(room).emit('location', message)
        callback()
    })

    socket.on('disconnect', async () => {
        await userFromRoomDropper.call(context)
        io.to(room).emit('message', generateLeft(context.user))
        syncRoomData()
    })
})

server.listen(process.env.PORT, () => {
    console.log(`Server is up on port ${process.env.PORT}`)
})
