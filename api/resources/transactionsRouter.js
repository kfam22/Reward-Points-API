const router = require('express').Router()
const Transaction = require('./transactionsModel')

// [GET] api/transactions  gets a list of all transactions (includes payer, points, timestamp, and id)
router.get('/', (req, res, next) => {
    Transaction.getTransactions()
    .then(resource => {
        res.status(200).json(resource)
    })
    .catch(next)
});

// [GET] api/transactions/points  gets users total points
router.get('/points', (req, res, next) => {
    Transaction.getTotalPoints()
    .then(resource => {
        res.status(200).json(resource)
    })
    .catch(next)
});

// [GET] api/transactions/points-by-payer  gets a list of payers and their points balance (includes payer, points)
router.get('/points-by-payer', (req, res, next) => {
    Transaction.getTransactions().then(transactions => {
        let payers = {};
        transactions.forEach(transaction => {
            if(payers[transaction.payer]){
                payers[transaction.payer].points += transaction.points; 
            } else {
                payers[transaction.payer] = {payer: transaction.payer, points: transaction.points};
            }
        });

        pointsByPayer = Object.values(payers);
        res.status(200).json(pointsByPayer)
        }

    ).catch(next)
});

// [POST] api/transactions/add

// add middleware to validate that points is an integer and that payer is a valid string
router.post('/add', (req, res, next) =>{
    const { payer, points } = req.body
    Transaction.addTransaction({ payer, points})
    .then(newTransaction => {
        Transaction.getTransactions().then(
            transactions => {
                res.status(201).json(transactions)
            }
        )
    })
    .catch(next)
  });

module.exports = router;