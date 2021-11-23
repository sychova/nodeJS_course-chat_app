const users = []

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Vaidate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
            return user.room === room && user.username === username
        })
        // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const resultUser = users.find((user) => user.id === id)
    return resultUser
}

const getUsersInRoom = (room) => {
    const usersInRoom = users.filter((user) => {
        return user.room === room
    })
    return usersInRoom
}

const getRooms = () => {
    const justRooms = users.map((user) => user.room)
    const uniqueRooms = justRooms.filter((room, index, arr) => arr.indexOf(room) === index)
    console.log(uniqueRooms)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getRooms
}