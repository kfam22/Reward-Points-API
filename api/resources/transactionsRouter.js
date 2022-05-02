const router = require('express').Router()
const Transaction = require('./transactionsModel')
const { validatePayer, validatePoints, checkTotalPoints } = require('./transactionsMiddleware')

// [GET] api/transactions  gets a list of all transactions (includes payer, points, timestamp, and id. ordered by timestamp)
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
    Transaction.getTransactions()
    .then(transactions => {
        let payers = {};
        transactions.forEach(transaction => {
            if(payers[transaction.payer]){
                payers[transaction.payer].points += transaction.points; 
            } else {
                payers[transaction.payer] = {payer: transaction.payer, points: transaction.points};
            }
        });

        const pointsByPayer = Object.values(payers);
        res.status(200).json(pointsByPayer)
        }

    ).catch(next)
});

// [POST] api/transactions/add

// create middleware to validate that points is an integer and that payer is a valid string
router.post('/add', validatePayer, validatePoints, (req, res, next) =>{
    const { payer, points } = req.body;
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


//   [POST] API/transactions/spend
let remainingPoints = {};

router.get('/remainingPoints', (req, res) => {
    res.status(200).json(remainingPoints)
})
// remainingPoints format: transaction_id: 200 (remaining points)
router.post('/spend', validatePoints, checkTotalPoints, (req, res, next) =>{
    let { points } = req.body;

    Transaction.getTransactions()
    .then(transaction => {
        let transactionBatch = [];
        let idx = 0;
        while(points > 0){
            if(remainingPoints[transaction[idx].transaction_id] === undefined) {
            remainingPoints[transaction[idx].transaction_id] = transaction[idx].points;
            } 
            if(remainingPoints[transaction[idx].transaction_id] <= 0){
                idx++
                continue
            }
            if(points >= remainingPoints[transaction[idx].transaction_id]){
                transactionBatch.push({'payer': transaction[idx].payer, 'points': (remainingPoints[transaction[idx].transaction_id] * -1)});
                points = points - remainingPoints[transaction[idx].transaction_id]
                remainingPoints[transaction[idx].transaction_id] = 0;
                
            }else {
                transactionBatch.push({'payer': transaction[idx].payer, 'points': (points * -1)});
                remainingPoints[transaction[idx].transaction_id] -= points;
                points -= points
            }

            if(idx < transaction.length - 1){
                idx++
            }else{
                break;
            } 
        }
        Transaction.addTransaction(transactionBatch)
        .then(() => {

            res.status(201).json(transactionBatch)
        })
    })
    .catch(next)
})
module.exports = router;