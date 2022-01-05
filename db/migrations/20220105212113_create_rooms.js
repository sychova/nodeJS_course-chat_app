exports.up = async (knex) => {
    await knex.schema.createTable('rooms', (t) => {
        t.increments('id').primary()
        t.string('name').notNullable()
        t.unique('name')
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('rooms')
}
