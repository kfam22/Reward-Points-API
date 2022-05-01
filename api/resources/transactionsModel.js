const db = require('../data/db-config');

function getTransactions(){
    return db('transactions')
}

function getTotalPoints(){
    return db('transactions')
    .sum('points as total_points')
}

module.exports = {
    getTotalPoints,
    getTransactions,
}