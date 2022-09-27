/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("list", function (table) {
      table.increments("id");
      table.integer("filesAmount");
      table.timestamps(false, true);
    })
    .createTable("filesjsons", function (table) {
      table.increments("id");
      table.json("fileJson");
      table.timestamps(false, true);
    })
    .createTable("files", function (table) {
      table.increments("id");
      table.string("name");
      table.json("content");
      table.timestamps(false, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("list")
    .dropTable("filesjsons")
    .dropTable("files");
};
