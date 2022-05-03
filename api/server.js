const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const transactionsRouter = require('./transactions/transactionsRouter')
const server = express()


server.use(express.json())
server.use(helmet())
server.use(cors())
server.use('/api/transactions', transactionsRouter)

server.use('*', (req, res) => {
  res.json({ message: 'Here to fetch reward points? Please navigate to a valid endpoint.'});
});

server.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      stack: err.stack,
    });
  });
  
module.exports = server