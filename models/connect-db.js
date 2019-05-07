const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : 'us-cdbr-iron-east-02.cleardb.net',
      user : 'bd1783c6bc0640',
      password : 'e4bab301',
      database : 'heroku_cedf5e89bad5f66'
    }
  });

module.exports = knex;