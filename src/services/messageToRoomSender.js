const { type } = require('express/lib/response')
const { Message } = require('../entities')
const { makeMessageGenerator } = require('../utils/messages')
const Filter = require('bad-words')

const filter = new Filter()

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

    send({ user, room, message, type }) {
        if (filter.isProfane(message)) {
            return { error: 'Profanity is not allowed.' }
        }
        const generatedMessage = makeMessageGenerator(user)(message)
        const newMessage = new Message({
            roomId: room.id,
            senderId: user.id,
            type: type,
            content: generatedMessage.content,
        })
        return this.createMessage(newMessage)
    }

    createMessage(message) {
        return this.messageRepo.create(message)
    }
}

module.exports = MessageToRoomSender
