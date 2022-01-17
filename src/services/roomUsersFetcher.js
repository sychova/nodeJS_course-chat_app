class RoomUsersFetcher {
    constructor({ userRepo }) {
        this.userRepo = userRepo
    }

    async call(room) {
        const users = await this.userRepo.getUsersForRoom(room)
        return {
            room: room.title,
            users: users,
        }
    }
}

module.exports = RoomUsersFetcher
