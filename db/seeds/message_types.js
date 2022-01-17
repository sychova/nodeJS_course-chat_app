exports.seed = function (knex) {
    return knex('message_types')
        .del()
        .then(function () {
            return knex('message_types').insert([
                { description: 'text' },
                { description: 'location' },
            ])
        })
}
