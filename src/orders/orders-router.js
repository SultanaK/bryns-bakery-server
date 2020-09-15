const express = require('express')
const jsonBodyParser = express.json()
const OrdersRouter = express.Router()
const OrderService = require('./orders-service')


OrdersRouter
    .route('/')
    .get((req, res, next) => {
        OrderService.getOrdersWithUser(req.app.get('db'))
        .then(orders => {
            return res.json(orders)
        })
        .catch(next)
    })

OrdersRouter
    .post('/', jsonBodyParser, (req, res, next) => {

        const {user, items, order} = req.body
        
        for (const [key, value] of Object.entries(user))
        if (value == null)
          return res.status(400).json({
            error: `Missing '${key}' in request body`
          })
        
        for (const [key, value] of Object.entries(order))
        if (value == null)
        return res.status(400).json({
            error: `Missing '${key}' in request body`
        })
  
        items.map(x => {
            for (const [key, value] of Object.entries(x))
            if (value == null)
              return res.status(400).json({
                error: `Missing '${key}' in request body`
              })
        })
        
        return OrderService.addOrder(req.app.get('db'), user, order, items)
    })
module.exports = OrdersRouter