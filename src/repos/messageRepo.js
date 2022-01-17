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
                room_id: message.attr.roomId,
                sender_id: message.attr.senderId,
                type_id: message.attr.type,
                created_at: new Date(message.attr.createdAt).toISOString(),
                text: message.attr.text,
            })
            .returning('*')
        return this.map(record)
    }

    async getMessagesForRoom(room) {
        const messagesInRoom = await this.gateway('messages')
            .join('users', 'users.id', 'messages.sender_id')
            .where({ room_id: room })
            .orderBy('messages.id')
        return this.map(messagesInRoom)
    }
}

module.exports = MessageRepo
