
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('outcomes').del()
    .then(function () {
      // Inserts seed entries
      return knex('outcome_types').del()
      .then(function () {
        return knex('outcome_types').insert([
          {id: 1, type: 'win'},
          {id: 2, type: 'loss'}
        ]);
      })
    })
};
