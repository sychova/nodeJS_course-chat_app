exports.up = async (knex) => {
    await knex.schema.createTable('users', (t) => {
        t.increments('id').primary()
        t.string('username').notNullable()
        t.unique('username')
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('users')
}
