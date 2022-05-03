const Transaction = require('../resources/transactionsModel');
const db = require('../data/db-config')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

describe ('Transaction db access functions', () => {

    describe('Transaction.getTransactions', () => {
        it('resolves to all transactions in the transactions table', async () => {
            const transactions = await Transaction.getTransactions()
            expect(transactions).toHaveLength(6)
        })
        it('has the correct shape: id, payer, points, timestamp', async () => {
            const transactions = await Transaction.getTransactions()
            expect(transactions[0]).toHaveProperty('transaction_id', 1)
            expect(transactions[0]).toHaveProperty('payer', 'TARGET')
            expect(transactions[0]).toHaveProperty('points', 100)
            expect(transactions[0]).toHaveProperty('timestamp')
        })
    })

    describe('Transaction.getTotalPoints', () => {
        it('has the correct shape: total_points', async () => {
            const points = await Transaction.getTotalPoints()
            expect(points).toMatchObject({'total_points': '1900'})
        })
    })

    describe('Transaction.addTransactions', () => {
        it('adds a new transaction to the transactions table', async () => {
            await Transaction.addTransaction({ payer: 'WALMART', points: 200})
            const rows = await db('transactions')
            expect(rows).toHaveLength(7)
        })
        it('resolves to a newly inserted transaction', async () => {
            const testTransaction = {payer: 'TARGET', points: 400}
            const newTransaction = await Transaction.addTransaction(testTransaction)
            expect(newTransaction).toMatchObject({ transaction_id: 7, payer: 'TARGET', points: 400})
        })
    })

})