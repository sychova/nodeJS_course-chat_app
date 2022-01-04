const knex = require('../utils/knex')
const UserRepo = require('./userRepo')
const RoomRepo = require('./roomRepo')

const userRepo = new UserRepo(knex)
const roomRepo = new RoomRepo(
    { keys: new Set(), table: new Map() },
    { userRepo }
)

module.exports = {
    roomRepo,
    userRepo,
    UserRepo,
    RoomRepo,
}
