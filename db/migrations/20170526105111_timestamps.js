
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('outcomes', (table) => {
      table.timestamps(true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('outcomes', (table) => {
      table.dropColumn('timestamps');
    })
  ])
};