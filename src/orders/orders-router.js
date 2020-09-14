const express = require('express')
const jsonBodyParser = express.json()
const OrdersRouter = express.Router()
const OrderService = require('./orders-service')

OrdersRouter
    .route('/')
    .get((req, res, next) => {
        OrderService.getAllOrders(req.app.get('db'))
        .then(orders => {
            return res.json(orders)
        })
        .catch(next)
    })

OrdersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        console.log(req.body)
        // const {object_specs, theme, notes, readyBy, cost, completed} = req.body
        // const newOrder = {object_specs, theme, notes, readyBy, cost, completed}

        // for (const [key, value] of Object.entries(newOrder))
        // if (value == null)
        //   return res.status(400).json({
        //     error: `Missing '${key}' in request body`
        //   })

        //   newOrder.user_id = req.user.id

  
    })
module.exports = OrdersRouter