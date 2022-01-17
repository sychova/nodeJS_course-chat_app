exports.up = async (knex) => {
    await knex.schema.createTable('message_types', (t) => {
        t.increments('id').primary()
        t.string('description')
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('message_types')
}
