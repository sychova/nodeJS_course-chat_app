const { wrapAction } = require('./base')

const { roomMessagesFetcher } = require('../services')
const { roomRepo } = require('../repos')

const getRooms = wrapAction(async () => {
    const rooms = await roomRepo.all()
    return { rooms: rooms.map((r) => r) }
})

const getRoomMessages = wrapAction(async (req) => {
    const roomId = parseInt(req.params.roomId)
    const messages = await roomMessagesFetcher.call(roomId)
    return messages
})

module.exports = {
    getRooms,
    getRoomMessages,
}
