exports.up = async (knex) => {
    await knex.schema.createTable('rooms_users', (t) => {
        t.increments('id').primary()
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
        t.unique(['room_id', 'user_id'])
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('rooms_users')
}
