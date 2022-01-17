const { userRepo, roomRepo, messageRepo } = require('../repos')
const UserToRoomJoiner = require('./userToRoomJoiner')
const RoomUsersFetcher = require('./roomUsersFetcher')
const UserFromRoomDropper = require('./userFromRoomDropper')
const MessageToRoomSender = require('./messageToRoomSender')
const LocationToRoomSender = require('./locationToRoomSender')
const RoomMessagesFetcher = require('./roomMessagesFetcher')

module.exports = {
    userToRoomJoiner: new UserToRoomJoiner({ userRepo, roomRepo }),
    roomUsersFetcher: new RoomUsersFetcher({ userRepo }),
    userFromRoomDropper: new UserFromRoomDropper({ roomRepo }),
    messageToRoomSender: new MessageToRoomSender({ messageRepo }),
    locationToRoomSender: new LocationToRoomSender({ messageRepo }),
    roomMessagesFetcher: new RoomMessagesFetcher({ messageRepo }),
}
