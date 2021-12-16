const { parse } = require('pg-connection-string')

module.exports = {
    development: {
        client: 'pg',
        connection: {
            ...parse(process.env.PG_CONNECTION),
            ssl: { rejectUnauthorized: false },
        },
        migrations: {
            directory: __dirname + '/db/migrations',
        },
        seeds: {
            directory: __dirname + '/db/seeds',
        },
    },
}[process.env.NODE_ENV || 'development']
