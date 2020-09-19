const cfg = require('./config')
const knex = require('knex')
const bcrypt = require('bcrypt')
require('dotenv').config()

const db = knex({
    client: 'pg',
    connection: cfg.DATABASE_URL
})
const [ _, __, name, plainPassword] = process.argv;

const password = bcrypt.hashSync(plainPassword, process.env.ADMIN_PASS_SALT);

db('admins').insert({ name, password })
.then(() => {
    console.log('admin inserted succesfully')
    process.exit()
})
.catch((e) => {
    console.log('error inserting admin', e)
    process.exit(1)
})