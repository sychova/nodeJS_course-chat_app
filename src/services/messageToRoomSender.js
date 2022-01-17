const { type } = require('express/lib/response')
const { Message } = require('../entities')
const { makeMessageGenerator } = require('../utils/messages')

class MessageToRoomSender {
    constructor({ messageRepo }) {
        this.messageRepo = messageRepo
    }

    call({ user, room, message, type }) {
        try {
            return this.send({ user, room, message, type })
        } catch (error) {
            return { error: error.message || error }
        }
    }

    async send({ user, room, message, type }) {
        const generatedMessage = makeMessageGenerator(user)(message)
        const newMessage = new Message({
            roomId: room.id,
            senderId: user.id,
            type: type,
            createdAt: generatedMessage.createdAt,
            text: generatedMessage.text,
        })
        this.createMessage(newMessage)
        return generatedMessage
    }

    createMessage(message) {
        return this.messageRepo.create(message)
    }
}

module.exports = MessageToRoomSender
