class RoomUsersFetcher {
    constructor({ userRepo }) {
        this.userRepo = userRepo
    }

    async call(room) {
        const users = await this.userRepo.getUsersForRoom(room)
        return {
            roomId: room.id,
            roomTitle: room.title,
            users: users,
        }
    }
}

module.exports = RoomUsersFetcher
