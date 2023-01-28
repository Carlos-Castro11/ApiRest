var knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "Cf14121976",
    database: "usersapi",
  },
});

module.exports = knex;
