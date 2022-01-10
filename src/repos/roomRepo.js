const BaseRepo = require('./baseRepo')
const { Room } = require('../entities')
const { NotFound } = require('./common')
const knex = require('../utils/knex')

let seq = 1

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

    async addUserToRoom(room, user) {
        const record = await this.tryFindByTitle(room.title)
        if (!record) this.throwNotFound()

        await knex('rooms_users').insert({
            room_id: record.attr.id,
            user_id: user.id,
        })
    }

    async removeUserFromRoom(room, user) {
        const record = await this.tryFindByTitle(room.title)
        if (!record) this.throwNotFound()

        await knex('rooms_users').where('user_id', user.id).del()
    }

    async all() {
        return await this.query.select()
    }

    async getUsersForRoom(room) {
        const record = await this.tryFindByTitle(room.title)
        const usersInRoom = await knex('rooms_users')
            .where({ room_id: record.attr.id })
            .select('user_id')
            .then((users) => users.map((r) => r.user_id))
        return this.userRepo.getByIds([...usersInRoom])
    }

    get userRepo() {
        return this.deps.userRepo
    }
}

module.exports = RoomRepo
