const knex = require('../utils/knex')
const UserRepo = require('./userRepo')
const RoomRepo = require('./roomRepo')

const userRepo = new UserRepo(knex)
const roomRepo = new RoomRepo(knex, { userRepo })

module.exports = {
    roomRepo,
    userRepo,
    UserRepo,
    RoomRepo,
}
