class UserFromRoomDropper {
    constructor({ roomRepo }) {
        this.roomRepo = roomRepo
    }

    async call({ user, room }) {
        try {
            await this.drop({ user, room })
        } catch (error) {
            return { error: error.message || error }
        }
    }

    drop({ user, room }) {
        this.roomRepo.removeUserFromRoom(room, user)
    }
}

module.exports = UserFromRoomDropper
