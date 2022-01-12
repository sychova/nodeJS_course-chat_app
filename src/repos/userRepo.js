const BaseRepo = require('./baseRepo')
const { User } = require('../entities')

class UserRepo extends BaseRepo {
    static get entity() {
        return User
    }

    static get table() {
        return 'users'
    }

    async create(user) {
        const [record] = await this.query
            .insert({ username: user.username })
            .returning('*')
        return this.map(record)
    }

    async tryFindByUsername(username) {
        const [record] = await this.query
            .select('*')
            .where({ username })
            .limit(1)
        return this.mapOrNull(record)
    }

    async getUsersForRoom(room) {
        const usersInRoom = await this.gateway('rooms_users')
            .join('users', 'users.id', 'rooms_users.user_id')
            .where({ room_id: room.id })
        return this.map(usersInRoom)
    }
}

module.exports = UserRepo
