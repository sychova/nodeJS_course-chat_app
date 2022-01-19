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
        t.enu('type', ['text', 'location']).notNullable()
        t.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
        t.text('content')
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable('messages')
}
