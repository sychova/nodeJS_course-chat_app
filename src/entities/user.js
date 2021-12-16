const BaseEntity = require('./base')

class User extends BaseEntity {
    set username(username) {
        if (!username) throw new Error('Username is required!')
        this.attr.username = username.trim().toLowerCase()
    }

    get username() {
        return this.attr.username.trim().toLowerCase()
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
        }
    }
}

module.exports = User
