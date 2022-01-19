const BaseEntity = require('./base')

class Message extends BaseEntity {
    set content(content) {
        if (!content) throw new Error('Message is required!')
        this.attr.content = content.trim()
    }

    get content() {
        return this.attr.content
    }

    get roomId() {
        return this.attr.roomId
    }

    get senderId() {
        return this.attr.senderId
    }

    get type() {
        return this.attr.type
    }

    get createdAt() {
        return this.attr.created_at
    }
}

module.exports = Message
