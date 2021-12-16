const { userRepo, roomRepo } = require('../repos')
const UserToRoomJoiner = require('./userToRoomJoiner')
const RoomDataFetcher = require('./roomDataFetcher')
const UserFromRoomDropper = require('./userFromRoomDropper')

module.exports = {
    userToRoomJoiner: new UserToRoomJoiner({ userRepo, roomRepo }),
    roomDataFetcher: new RoomDataFetcher({ roomRepo }),
    userFromRoomDropper: new UserFromRoomDropper({ roomRepo }),
}
