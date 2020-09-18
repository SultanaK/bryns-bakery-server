const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')
const supertest = require('supertest')

describe.only('Order Endpoints', function(){
    let db

    const {
        testUsers,
        testOrders,
        testItems
    } = helpers.makeOrderFixtures()

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.cleanTables(db))
  
    afterEach('cleanup', () => helpers.cleanTables(db))
  
    describe('GET /api/orders', () => {

        context('given no orders', () => {
            it('responds with a 200 and empty array', () => {
                return supertest(app)
                .get('/api/orders')
                .expect(200, [])
            })
        })

        context('given there are things in db', () => {
            beforeEach('insert orders', () =>
            helpers.seedOrderTables(
              db,
              testUsers,
              testOrders,
              testItems
            )
          )

          it('responds with 200 and all of the things', () => {
            return supertest(app)
              .get('/api/orders')
              .expect(200)
          })
        })
  
    })

    describe('GET /api/orders/items/:order_id', () => {

        context('given no orders', () => {
            beforeEach(() =>
            helpers.seedUsers(db, testUsers)
            )
    
          it(`responds with 404`, () => {
            const orderId = 123456
            return supertest(app)
              .get(`/api/orders/${orderId}`)
              .expect(404)
          })

        })

        context('given there are orders in the db', () => {
            beforeEach('insert orders', () => {
                return helpers.seedOrderTables(db, testUsers, testOrders, testItems)
            })
            const order_id = 1

            it('responds with 200 and order items', () => {
                return supertest(app)
                .get(`/api/orders/items/${order_id}`)
                .expect(200)
            })


        })

    })

    describe('GET /api/orders/completed', () => {
        context('Given no orders are completed', () => {
            beforeEach('insert users and orders',() => {
                return helpers.seedOrderTables(db, testUsers, testOrders, testItems)
            })

            it('returns an empty array', () => {
                return supertest(app)
                .get('/api/orders/completed')
                .expect(200)
            })
        })

        context('Given completed orders', () => {
            beforeEach('insert orders', () => {
                const completedOrders = helpers.makeCompletedOrderArray()
                return helpers.seedOrderTables(db, testUsers, completedOrders, testItems)
            })

            it('returns a 200', () => {
                return supertest(app)
                .get('/api/orders/completed')
                .expect(200)
            })
        })
    })

    describe('GET /api/orders/unfinished', () => {
        context('when there are no unfinished orders', () => {
            beforeEach('insert orders', () => {
                const completedOrders = helpers.makeCompletedOrderArray()
                return helpers.seedOrderTables(db, testUsers, completedOrders, testItems)
            })

            it('returns 200 and empty array', () => {
                return supertest(app)
                .get('/api/orders/unfinished')
                .expect(200, [])
            })
        })
        context('when there are unfinished orders', () => {
            beforeEach('insert orders', () => {
                return helpers.seedOrderTables(db, testUsers, testOrders, testItems)
            })

            it('responds 200', () => {
                return supertest(app)
                .get('/api/orders/unfinished')
                .expect(200)
            })
        })
    })

    describe('POST /api/orders', () => {
        context('it creates order', () => {

            const newOrder = helpers.createNewOrder()

            it('responds 201 and with created order', () => {
                return supertest(app)
                .post('/api/orders')
                .send(newOrder)
                .expect(201)
            })
        })
    })
})