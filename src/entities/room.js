const BaseEntity = require('./base')

class Room extends BaseEntity {
    set title(title) {
        if (!title) throw new Error('Room is required!')
        this.attr.title = title.trim().toLowerCase()
    }

    get title() {
        return this.attr.title.trim().toLowerCase()
    }

    get id() {
        return this.attr.id
    }

    get users() {
        return this.attr.users
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
        }
    }
}

module.exports = Room
