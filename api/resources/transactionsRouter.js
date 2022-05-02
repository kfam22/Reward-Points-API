const router = require('express').Router()
const Transaction = require('./transactionsModel')

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
router.post('/add', (req, res, next) =>{
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
let spent = {};

router.get('/spent', (req, res) => {
    res.status(200).json(spent)
})
// spent format: transaction_id: 200 (remaining points)
router.post('/spend', (req, res, next) =>{
    // create middleware to validate that points is a positive integer
    // create middleware to check if there are enough total points to spend the requested amount of points

    let { points } = req.body;

    Transaction.getTransactions()
    .then(resource => {
        let transactionBatch = [];
        let idx = 0;
        while(points > 0){

            if(spent[resource[idx].transaction_id] === undefined) {
            spent[resource[idx].transaction_id] = resource[idx].points;
            } 
            if(spent[resource[idx].transaction_id] === 0){
                idx++
                continue
            }
            if(points > spent[resource[idx].transaction_id]){
                transactionBatch.push({'payer': resource[idx].payer, 'points': (spent[resource[idx].transaction_id] * -1)});
                points = points - spent[resource[idx].transaction_id]
                spent[resource[idx].transaction_id] = 0;
                
            }else {
                transactionBatch.push({'payer': resource[idx].payer, 'points': (points * -1)});
                spent[resource[idx].transaction_id] -= points;
                points -= points
            }

            if(idx < resource.length - 1){
                idx++
            }else{
                break;
            } 
        }
        Transaction.addTransaction(transactionBatch)
        .then(newBatch => {
            res.status(201).json(transactionBatch)
        })
    })
    .catch(next)
})
module.exports = router;