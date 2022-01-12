exports.up = async (knex) => {
    await knex.schema.createTable('rooms', (t) => {
        t.increments('id').primary()
        t.string('title').notNullable()
        t.unique('title')
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('rooms')
}
