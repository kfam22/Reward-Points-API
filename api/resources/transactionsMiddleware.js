const Transaction = require('./transactionsModel');

function validatePayer(req, res, next) {
    if(typeof req.body.payer === 'string' && req.body.payer && req.body.payer.trim()){
      req.body.payer = req.body.payer.trim().toUpperCase();
      next();
    } else {
      next({
        status: 422,
        message: "payer is required"
      })
    }
  }

function validatePoints(req, res, next) {
    if(req.body.points && typeof req.body.points === 'number' && req.body.points > 0){
      next();
    } else {
      next({
        status: 422,
        message: "points is required and must be a positive number"
      })
    }
  }


const checkTotalPoints = async (req, res, next) => {
    try{
        const totalPoints = await Transaction.getTotalPoints()
        if (Number(totalPoints.total_points) < req.body.points) {
          next({ status: 400, message: 'Not enough points'})
        } else {
          next()
        }
     } catch (err) {
       next(err)
     }
}

module.exports = {
    validatePayer,
    validatePoints,
    checkTotalPoints,
}