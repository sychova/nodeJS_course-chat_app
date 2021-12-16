class EntityIsNotDefinedError extends Error {
    constructor(repo) {
        super(`Entity type is not defined for ${repo}`)
    }
}

class NotFound extends Error {
    constructor(type) {
        super(`Entity ${type} was not found`)
    }
}

class TableIsNotDefinedError extends Error {
    constructor(repo) {
        super(`Table is not defined for ${repo}`)
    }
}

module.exports = {
    EntityIsNotDefinedError,
    TableIsNotDefinedError,
    NotFound,
}
