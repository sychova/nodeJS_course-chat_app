const knex = require('../utils/knex')
const UserRepo = require('./userRepo')
const RoomRepo = require('./roomRepo')
const MessageRepo = require('./messageRepo')

const userRepo = new UserRepo(knex)
const roomRepo = new RoomRepo(knex)
const messageRepo = new MessageRepo(knex)

module.exports = {
    roomRepo,
    userRepo,
    messageRepo,
    UserRepo,
    RoomRepo,
    MessageRepo,
}
