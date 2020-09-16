const express = require('express')
const jsonBodyParser = express.json()
const OrdersRouter = express.Router()
const OrderService = require('./orders-service')


OrdersRouter
    .route('/')
    .get((req, res, next) => {
        OrderService.getOrdersWithUser(req.app.get('db'))
        .then(orders => {
            return res.status(200).json(orders.rows)
        })
        .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {

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
        
        return OrderService.addOrder(req.app.get('db'), user, order, items).catch(next)
    })

OrdersRouter
    .route('/completed')
    .get((req, res, next) => {
        OrderService.getCompletedOrders(req.app.get('db'))
        .then(orders => {
            return res.status(200).json(orders)
        })
        .catch(next)
    })
    .post(jsonBodyParser, (req, res , next) => {
        const { user_id } = req.body
        return OrderService.getCompletedOrders(req.app.get('db'), user_id)
            .then(completed => {
                console.log(completed)
                return res.status(200).json(completed)
            })
            .catch(next)
    })

OrdersRouter
    .route('/unfinished')
    .get((req, res, next) => {
        OrderService.getUnfinishedOrders(req.app.get('db'))
        .then(orders => {
            return res.status(200).json(orders)
        })
        .catch(next)
    })
    
OrdersRouter
    .route('/items/:order_id')
    .get((req, res, next) => {
        OrderService.getAllItemsInAnOrder(req.app.get('db'), req.params.order_id)
        .then(items => {
            res.status(200).json(items)
        })
    })



module.exports = OrdersRouter