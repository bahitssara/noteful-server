require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const logger = require('../logger')
const notefulRouter = require('./noteful-router')
const folderRouter = require('./folder-router')
const { NODE_ENV } = require('./config')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_KEY
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      logger.error(`Unauthorized request to path: ${req.path}`); 
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })

app.use(notefulRouter)
app.use(folderRouter)
app.get('/', (req,res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if(NODE_ENV === 'production') {
        response = { error: error.message, env:[process.env.DATABASE_URL, process.env.PORT] }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
    next()
})
module.exports = app