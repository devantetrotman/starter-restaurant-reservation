/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

// "postgresql://postgres@localhost/postgres"

const {
  DATABASE_URL = "postgres://exidggww:LqTUd_0M9G8eVFB8KGNfYOghSPc7ry4P@isilo.db.elephantsql.com/exidggww",
  DATABASE_URL_DEVELOPMENT = "postgres://orluicmi:fVuvl96-2sp_xyiH2tHb-TNwQKBQZ_tT@jelani.db.elephantsql.com/orluicmi",
  DATABASE_URL_TEST = "postgres://mtwzpodw:QDlbANrCgOBwH07uoy03elEqPoILUrB4@castor.db.elephantsql.com/mtwzpodw",
  DATABASE_URL_PREVIEW = "postgres://balulkrk:wAe3cgy5v4nLq9jMtEeqtoNA5uj16nWI@isilo.db.elephantsql.com/balulkrk",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
