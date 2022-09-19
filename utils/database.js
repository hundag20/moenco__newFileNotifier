const { Model } = require("objection");
const Knex = require("knex");
const dotenv = require("dotenv");
dotenv.config();

// Initialize knex.
const knex = Knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_password,
    database: process.env.DB_NAME,
  },
});

// Give the knex instance to objection.
const a = Model.knex(knex);
module.exports = Model;

