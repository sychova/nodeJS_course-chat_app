class RoomMessagesFetcher {
    constructor({ messageRepo }) {
        this.messageRepo = messageRepo
    }

    call(roomId) {
        return this.messageRepo.getMessagesForRoom(roomId)
    }
}

module.exports = RoomMessagesFetcher
