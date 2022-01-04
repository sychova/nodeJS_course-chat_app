class Base {
    constructor(attr) {
        this.attr = attr
    }

    get id() {
        return this.attr.id
    }

    toString() {
        return `${this.constructor.name}#${this.id}`
    }

    toJSON() {
        return this.attr
    }
}

module.exports = Base
