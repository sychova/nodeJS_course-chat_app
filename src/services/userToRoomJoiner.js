const { User, Room } = require('../entities')

class UserToRoomJoiner {
    constructor({ userRepo, roomRepo }) {
        this.userRepo = userRepo
        this.roomRepo = roomRepo
    }

    call({ username, roomTitle }) {
        try {
            return this.join({ username, roomTitle })
        } catch (error) {
            return { error: error.message || error }
        }
    }

    async join({ username, roomTitle }) {
        const user = await this.getUser({ username })
        const room = await this.getRoom({ title: roomTitle })
        await this.addUserToRoom({ room, user })
        return { user, room }
    }

    async getUser({ username }) {
        const user = new User({ username })
        const foundUser = await this.tryFindUserByUsername(user.username)
        if (foundUser && foundUser.id) return foundUser

        return this.createUser(user)
    }

    tryFindUserByUsername(username) {
        return this.userRepo.tryFindByUsername(username)
    }

    createUser(user) {
        return this.userRepo.create(user)
    }

    async getRoom({ title }) {
        const room = new Room({ title })
        const foundRoom = await this.tryFindRoomByTitle(room.title)
        if (foundRoom && foundRoom.id) return foundRoom

        return this.createRoom(room)
    }

    tryFindRoomByTitle(title) {
        return this.roomRepo.tryFindByTitle(title)
    }

    createRoom(room) {
        return this.roomRepo.create(room)
    }

    async addUserToRoom({ room, user }) {
        const isUserInRoom = await this.roomRepo.isUserInRoom({ user, room })
        if (isUserInRoom) return

        await this.roomRepo.addUserToRoom(room, user)
    }
}

module.exports = UserToRoomJoiner
