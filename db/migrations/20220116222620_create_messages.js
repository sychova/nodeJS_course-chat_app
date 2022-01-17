exports.up = async (knex) => {
    await knex.schema.createTable('messages', (t) => {
        t.increments('id').primary()
        t.integer('room_id')
            .notNullable()
            .references('id')
            .inTable('rooms')
            .onDelete('CASCADE')
        t.integer('sender_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
        t.integer('type_id')
            .notNullable()
            .references('id')
            .inTable('message_types')
            .onDelete('CASCADE')
        t.timestamp('created_at').notNullable()
        t.string('text')
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('messages')
}
