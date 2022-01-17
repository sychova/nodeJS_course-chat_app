const BaseEntity = require('./base')

class Message extends BaseEntity {
    set text(text) {
        if (!text) throw new Error('Message is required!')
        this.attr.text = text.trim()
    }

    get text() {
        return this.attr.text
    }

    get messageRoom() {
        return this.attr.roomId
    }

    get messageCreatedDate() {
        return this.attr.createdAt
    }

    toJSON() {
        return {
            id: this.id,
            roomId: this.roomId,
            senderId: this.senderId,
            type: this.type,
            createdAt: this.createdAt,
            text: this.text,
        }
    }
}

module.exports = Message
