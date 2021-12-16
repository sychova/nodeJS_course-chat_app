class RoomDataFetcher {
    constructor({ roomRepo }) {
        this.roomRepo = roomRepo
    }

    async call(room) {
        const users = await this.roomRepo.getUsersForRoom(room)
        return {
            room: room.title,
            users: users,
        }
    }
}

module.exports = RoomDataFetcher
