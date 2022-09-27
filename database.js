const { Model } = require("objection");
const Knex = require("knex");
const dotenv = require("dotenv");
dotenv.config({ path: "./env.env" });

const conn_string = {
  server: process.env.DB_SERVER,
  // port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
// Initialize knex.
const knex = Knex({
  client: "mssql",
  connection: conn_string,
});

// Give the knex instance to objection.
const a = Model.knex(knex);
module.exports = Model;
