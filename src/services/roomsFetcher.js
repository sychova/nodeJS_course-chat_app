class RoomsFetcher {
    constructor({ roomRepo }) {
        this.roomRepo = roomRepo
    }

    call() {
        return this.roomRepo.all()
    }
}

module.exports = RoomsFetcher
