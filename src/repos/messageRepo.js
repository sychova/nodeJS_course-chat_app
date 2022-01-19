const BaseRepo = require('./baseRepo')
const { Message } = require('../entities')

class MessageRepo extends BaseRepo {
    static get entity() {
        return Message
    }

    static get table() {
        return 'messages'
    }

    async create(message) {
        const [record] = await this.query
            .insert({
                room_id: message.roomId,
                sender_id: message.senderId,
                type: message.type,
                content: message.content,
            })
            .returning('*')
        return this.map(record)
    }

    async getMessagesForRoom(roomId) {
        const messagesInRoom = await this.gateway('messages')
            .join('users', 'users.id', 'messages.sender_id')
            .where({ room_id: roomId })
            .orderBy('messages.created_at')
        return this.map(messagesInRoom)
    }
}

module.exports = MessageRepo
