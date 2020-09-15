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
    getAllItemsInAnOrder(db, order_id){
        return db
        .from('order_items')
        .select('*')
        .where('order_id', order_id)
    },
    getOrdersWithUser(db){
        return db
        .raw('SELECT users.id, first_name, last_name, email, phone_number, orders.id, readydate, completed, total FROM users INNER JOIN orders ON orders.user_id = users.id')
    },
    insertUser(db, user){
        return db
        .insert(user)
        .into('users')
        .returning('*')
        .then(rows => {
            return rows[0] 
          })
    },
    insertOrder(db, order){
        return db
        .insert(order)
        .into('orders')
        .returning('*')
        .then(rows => rows[0])
    },
    insertItems(db, items){
        return db
        .insert(items)
        .into('order_item')
        .returning('*')
        .then(rows => rows[0])
    },
    serializeOrder(order){
        return order.map(this.serializeOrder)
    },
    async addOrder(db, user, order, items){
        const dbUser = await OrderService.insertUser(db, user)
        const dbOrder = await OrderService.insertOrder(db, {...order, user_id: dbUser.id, completed: false})
        const dbItems = await OrderService.insertItems(db, items.map(x => ({...x, order_id: dbOrder.id})))
        return {user, order: {...order, dbItems}}
    }

}

module.exports = OrderService