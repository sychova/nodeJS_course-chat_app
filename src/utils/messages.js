const User = require('../entities/user')

const admin = new User({ username: 'admin' })

const makeMessageGenerator =
    (sender, process = (p) => p, payloadKey = 'content') =>
    (payload) => ({
        username: sender.username,
        [payloadKey]: process(payload),
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
