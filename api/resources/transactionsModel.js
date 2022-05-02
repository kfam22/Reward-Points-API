const db = require('../data/db-config');

function getTransactions(){
    return db('transactions')
    .orderBy('timestamp')
}

function getOldestTransaction(){
    return db('transactions')
    .orderBy('timestamp')
    .first()
}

function getTotalPoints(){
    return db('transactions')
    .sum('points as total_points')
}

async function addTransaction(transaction) {
    const [newTransaction] = await db('transactions')
    .insert(transaction, 
        ['transaction_id', 
        'payer', 
        'points', 
        'timestamp'])
        return newTransaction;
  }

module.exports = {
    getTotalPoints,
    getTransactions,
    getOldestTransaction,
    addTransaction,
}