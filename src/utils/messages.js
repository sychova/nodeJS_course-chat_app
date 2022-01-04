const User = require('../entities/user')

const admin = new User({ username: 'admin' })

const makeMessageGenerator =
    (author, process = (p) => p, payloadKey = 'text') =>
    (payload) => ({
        username: author.username,
        [payloadKey]: process(payload),
        createdAt: Date.now(),
    })

const generateWelcome = makeMessageGenerator(admin, () => 'Welcome!')
const generateJoined = makeMessageGenerator(
    admin,
    (user) => `${user.username} has joined!`
)
const generateLeft = makeMessageGenerator(
    admin,
    (user) => `${user.username} has left!`
)

module.exports = {
    generateWelcome,
    generateJoined,
    generateLeft,
    makeMessageGenerator,
}
