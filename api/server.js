const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const transactionsRouter = require('./resources/transactionsRouter')
const server = express()


server.use(express.json())
server.use(helmet())
server.use(cors())
server.use('/api/transactions', transactionsRouter)

server.use('*', (req, res, next) => { //catch all for non /api/transactions urls
    res.json({ api: 'page not found'})
   })

module.exports = server