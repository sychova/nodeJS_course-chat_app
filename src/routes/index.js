const applyRoutes = (router, actions) => {
    router.get('/rooms', actions.getRooms)
    router.get('/room/:roomId/messages', actions.getRoomMessages)
}

module.exports = {
    applyRoutes,
}
