const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'us-cdbr-east.cleardb.com',
      user : 'adffdadf2341',
      password : 'adf4234',
      database : 'heroku_db'
    }
  });

module.exports = knex;