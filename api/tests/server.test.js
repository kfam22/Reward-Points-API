const request = require('supertest')
const server = require('../server')
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

describe('Transaction end-points', () => {
    describe('[GET] invalid url', () => {
        it('returns page not found message', async () => {
            const res = await request(server).get('/foo/bar')
            expect(res.body.message).toBe('page not found')
        })
  })

    describe('[GET] /api/transactions', () => {
        it('returns 200 OK status', async () => {
            const res = await request(server).get('/api/transactions')
            expect(res.status).toBe(200)
        })
        it('returns JSON', async () => {
            const res = await request(server).get('/api/transactions')
            expect(res.type).toBe('application/json')
        })
        it('should return a list of transactions', async () => {
            const res = await request(server).get('/api/transactions')
            expect(res.body).toHaveLength(6)
        })
  })

  describe('[GET] /api/transactions/points', () => {
    it('returns 200 OK status', async () => {
        const res = await request(server).get('/api/transactions/points')
        expect(res.status).toBe(200)
    })
    it('returns JSON', async () => {
        const res = await request(server).get('/api/transactions/points')
        expect(res.type).toBe('application/json')
    })
    it('should return an object with a total_points key value pair', async () => {
        const res = await request(server).get('/api/transactions/points')
        expect(res.body).toHaveProperty('total_points')
    })
})

describe('[GET] /api/transactions/payer-points', () => {
    it('returns 200 OK status', async () => {
        const res = await request(server).get('/api/transactions/payer-points')
        expect(200)
    })
    it('returns JSON', async () => {
        const res = await request(server).get('/api/transactions/payer-points')
        expect(res.type).toBe('application/json')
    })
    it('should resolve a list of points per payer', async () => {
        const res = await request(server).get('/api/transactions/payer-points')
        expect(res.body[0]).toMatchObject({ payer: 'TARGET', points: 200})
    })
})

describe('[POST] /api/transactions/add', () => {
    it('responds with a 422 if payload is missing points or payer', async () => {
        const res = await request(server)
        .post('/api/transactions/add')
        .send({})
        expect(res.status).toBe(422)
    })
    it('responds with a validation message if payer is missing from request', async () => {
        const res = await request(server)
        .post('/api/transactions/add')
        .send({points: 100})
        expect(res.body.message).toBe("payer is required")
    })
    it('responds with a validation message if payer is not a string', async () => {
        const res = await request(server)
        .post('/api/transactions/add')
        .send({payer: 25, points: 100})
        expect(res.body.message).toBe("payer is required")
    })
    it('responds with a validation message if points is missing from request', async () => {
        const res = await request(server)
        .post('/api/transactions/add')
        .send({payer: 'walmart'})
        expect(res.body.message).toBe("points is required and must be a positive number")
    })
    it('responds with a validation message if points is not a positive integer', async () => {
        const res = await request(server)
        .post('/api/transactions/add')
        .send({payer: 'walmart', points: -25})
        expect(res.body.message).toBe("points is required and must be a positive number")
    })
    it('should return a 201 OK status with valid request body', async () => {
        const res = await request(server)
        .post('/api/transactions/add')
        .send({payer: 'walmart', points: 200})
        expect(res.status).toBe(201)
    })
    
    it('responds with a list of all transactions including the newly created transaction sorted by timestamp', async () => {
        const res = await request(server)
        .post('/api/transactions/add')
        .send({payer: 'walmart', points: 200})
        expect(res.body[res.body.length - 1]).toHaveProperty('transaction_id', 7)
        expect(res.body[res.body.length - 1]).toHaveProperty('payer', 'WALMART')
        expect(res.body[res.body.length - 1]).toHaveProperty('points', 200)
        expect(res.body[res.body.length - 1]).toHaveProperty('timestamp')
    })
})

describe('[POST] /api/transactions/spend', () => {
    it('responds with a validation message if points is missing from request', async () => {
        const res = await request(server)
        .post('/api/transactions/spend')
        .send({payer: 'walmart'})
        expect(res.body.message).toBe("points is required and must be a positive number")
    })
    it('responds with a validation message if points is not a positive integer', async () => {
        const res = await request(server)
        .post('/api/transactions/spend')
        .send({payer: 'walmart', points: -25})
        expect(res.body.message).toBe("points is required and must be a positive number")
    })
    it('should spend the oldest points first', async () => {
        const res = await request(server)
        .post('/api/transactions/spend')
        .send({points: 200})
        expect(res.body[0].payer).toBe('TARGET')
    })
    it('responds with a validation message if spend points are greater than total points', async () => {
        const res = await request(server)
        .post('/api/transactions/spend')
        .send({points: 1000000})
        expect(res.body.message).toBe("Not enough points")
    })
    it('should return a 201 OK status upon successful spend transaction', async () => {
        const res = await request(server)
        .post('/api/transactions/spend')
        .send({points: 100})
        expect(res.status).toBe(201)
    })
})


})

