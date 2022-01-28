const { Message, Location } = require('../entities')
const { makeMessageGenerator } = require('../utils/messages')

class LocationToRoomSender {
    constructor({ messageRepo }) {
        this.messageRepo = messageRepo
    }

    call({ user, room, coords, type }) {
        try {
            return this.send({ user, room, coords, type })
        } catch (error) {
            return { error: error.message || error }
        }
    }

    async send({ user, room, coords, type }) {
        const generatedMessage = makeMessageGenerator(
            user,
            (location) => `${location}`,
            'url'
        )(new Location(coords))
        const newMessage = new Message({
            roomId: room.id,
            senderId: user.id,
            type: type,
            createdAt: generatedMessage.createdAt,
            content: generatedMessage.url,
        })
        this.createMessage(newMessage)
        return generatedMessage
    }

    createMessage(message) {
        return this.messageRepo.create(message)
    }
}

module.exports = LocationToRoomSender
