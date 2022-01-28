const BaseRepo = require('./baseRepo')
const { Room } = require('../entities')
const { NotFound } = require('./common')

class RoomRepo extends BaseRepo {
    static get entity() {
        return Room
    }

    static get table() {
        return 'rooms'
    }

    async create(room) {
        const [record] = await this.query
            .insert({ title: room.title })
            .returning('*')
        return this.map(record)
    }

    async tryFindByTitle(title) {
        const [record] = await this.query.select('*').where({ title }).limit(1)
        return this.mapOrNull(record)
    }

    async findById(id) {
        const [record] = await this.query.select('*').where({ id }).limit(1)
        return this.mapOrNotFound(record)
    }

    async isUserInRoom({ user, room }) {
        const {
            rows: [{ exists }],
        } = await this.gateway.raw(
            `SELECT EXISTS(select from rooms_users where room_id = ? AND user_id = ?)`,
            [room.id, user.id]
        )

        return exists
    }

    async addUserToRoom(room, user) {
        const record = await this.findById(room.id)
        if (!record) this.throwNotFound()

        await this.gateway('rooms_users').insert({
            room_id: record.id,
            user_id: user.id,
        })
    }

    async removeUserFromRoom(room, user) {
        const record = await this.findById(room.id)
        if (!record) this.throwNotFound()

        await this.gateway('rooms_users').where('user_id', user.id).del()
    }

    all() {
        return this.query.select()
    }
}

module.exports = RoomRepo
