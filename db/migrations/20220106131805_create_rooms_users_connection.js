exports.up = async (knex) => {
    await knex.schema.createTable('rooms_users', (t) => {
        t.integer('room_id')
            .notNullable()
            .references('id')
            .inTable('rooms')
            .onDelete('CASCADE')
        t.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('rooms_users')
}
