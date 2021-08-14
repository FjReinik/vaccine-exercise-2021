import Knex from "Knex";
// Update with your config settings.


export const Connect = () => {
  return Knex({
    client: "pg",
    connection: {
      database: "vaccinedb",
      user: "postgres",
      password: "admin",
      host: "localhost",
      port: Number(`${process.env.PG_PORT}` || 5432),
    },
    pool: { min: 0, max: 100 },
    acquireConnectionTimeout: 10000,
  });
};
