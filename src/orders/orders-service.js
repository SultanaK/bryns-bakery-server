const xss = require('xss')

const OrderService = {
    getAllOrders(db){
        return db
            .from('orders')
            .select(
                'orders.id',
                'orders.readyDate',
                'orders.total',
                'orders.completed'
                )
            .first()
    },
    getAllItems(){},
    getAllItemsInAnOrder(){},
    getOrdersFromUser(db, user_id){},
    insertOrder(db, order){},
    serializeOrder(order){
        return order.map(this.serializeOrder)
    }

}

module.exports = OrderService