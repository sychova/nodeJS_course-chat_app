const BaseEntity = require('./base')

class Location extends BaseEntity {
    get latitude() {
        return this.attr.latitude
    }

    get longitude() {
        return this.attr.longitude
    }

    toString() {
        return `https://google.com/maps?q=${this.latitude},${this.longitude}`
    }
}

module.exports = Location
