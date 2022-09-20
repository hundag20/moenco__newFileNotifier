const { Model } = require("objection");
const Knex = require("knex");
const dotenv = require("dotenv");
dotenv.config({ path: "./env.env" });

const conn_string = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
// Initialize knex.
const knex = Knex({
  client: "mysql2",
  connection: conn_string,
});

// Give the knex instance to objection.
const a = Model.knex(knex);
module.exports = Model;
