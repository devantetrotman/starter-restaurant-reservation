const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const knex = require("../src/db/connection");
console.log(knex);

knex.migrate
  .forceFreeMigrationsLock()
  .then(() => knex.migrate.rollback(null, true))
  .then(() => knex.migrate.latest())
  .then(() => knex.seed.run())
  .then(() => console.log("Dropped and seeded database"))
  .then(() => knex.destroy())
  .catch((error) => console.error("Failed to drop and seed database", error));
