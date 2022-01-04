const BaseRepo = require('./baseRepo')
const { Room } = require('../entities')
const { NotFound } = require('./common')

let seq = 1

class RoomRepo extends BaseRepo {
    static get entity() {
        return Room
    }

    create(room) {
        const record = {
            id: room.title,
            title: room.title,
            users: new Set(),
        }
        this.gateway.keys.add(record.title)
        this.gateway.table.set(record.title, record)
        return this.map(record)
    }

    tryFindByTitle(title) {
        const record = this.gateway.table.get(title)
        return this.mapOrNull(record)
    }

    addUserToRoom(room, user) {
        const record = this.gateway.table.get(room.title)
        if (!record) this.throwNotFound()

        this.gateway.table.set(record.title, {
            id: record.id,
            title: record.title,
            users: record.users.add(user.id),
        })
    }

    removeUserFromRoom(room, user) {
        const record = this.gateway.table.get(room.title)
        if (!record) this.throwNotFound()

        record.users.delete(user.id)
        this.gateway.table.set(room.title, record)
    }

    get all() {
        const result = []

        this.gateway.keys.forEach((key) =>
            result.push(this.gateway.table.get(key))
        )
        return result.filter(Boolean)
    }

    getUsersForRoom(room) {
        return this.userRepo.getByIds([...room.users])
    }

    get userRepo() {
        return this.deps.userRepo
    }
}

module.exports = RoomRepo
