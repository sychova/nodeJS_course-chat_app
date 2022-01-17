class RoomMessagesFetcher {
    constructor({ messageRepo }) {
        this.messageRepo = messageRepo
    }

    async call(room) {
        const messages = await this.messageRepo.getMessagesForRoom(room)
        return messages
    }
}

module.exports = RoomMessagesFetcher
