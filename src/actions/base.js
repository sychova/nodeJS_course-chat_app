const wrapAction = (action) => async (req, res, next) => {
    try {
        const response = await action(req, res, next)
        res.json(response)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    wrapAction,
}
