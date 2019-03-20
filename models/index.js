const knex = require ("./connect-db");
const user = {};

user.signin = (user, pass) => {
    return new Promise((resolve,reject) => {
        knex('users').where({username:user,password:pass}).select('id')
        .then(result => {
            result.length == 0 ? reject("Incorrect")
            : resolve();
        }).catch(err => reject(err));
    });
}
user.signup = (name, pass) => {
    return new Promise((resolve,reject) => {
        knex('users').insert({username:name,password:pass})
        .then(()=> resolve())
        .catch(err => reject(err));
    });
}
module.exports = user;