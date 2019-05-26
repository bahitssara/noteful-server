const knex = require('knex')
const app = require('./app')
require('dotenv').config()
const { PORT } = require('./config')

const db = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})

app.set('db', db)

app.listen(process.env.PORT, () => {
    console.log(`Sever is listening at http://localhost:${PORT}`)
})