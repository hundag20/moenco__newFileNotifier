// Update with your config settings.
const dotenv = require("dotenv");
dotenv.config({ path: "./env.env" });
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mssql",
    connection: {
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    seeds: {
      directory: "./seeds/",
    },
  },

  staging: {
    client: "mssql",
    connection: {
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./seeds/init_list",
    },
  },

  production: {
    client: "mssql",
    connection: {
      server: process.env.DB_SERVER,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: {
      tableName: "knex_migrations",
      path: "./",
    },
    seeds: {
      directory: "./seeds/init_list",
    },
  },
};
