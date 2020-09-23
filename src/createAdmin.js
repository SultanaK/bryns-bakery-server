const cfg = require('./config');
const knex = require('knex');
const bcrypt = require('bcrypt');
require('dotenv').config();


function createAdmin(db, name, plainPassword) {
    const salt = bcrypt.genSaltSync(8);
    const password = bcrypt.hashSync(plainPassword, salt);
    return db('admins').insert({ name, password });
}


if (require.main === module) {
  const db = knex({
    client: 'pg',
    connection: cfg.DATABASE_URL
  });

  const [ _, __, name, plainPassword] = process.argv;


  createAdmin(db, name, plainPassword)
    .then(() => {
      console.log('admin inserted succesfully');
      process.exit();
    })
    .catch((e) => {
      console.log('error inserting admin', e);
      process.exit(1);
    });
}

module.exports = createAdmin;
