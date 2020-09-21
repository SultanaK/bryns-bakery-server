const xss = require('xss')

const OrderService = {
    //works
    getAllItemsInAnOrder(db, order_id){
        return db
        .from('order_item')
        .select('*')
        .where('order_id', order_id)
        .returning('*')
    },
    //works
    getOrdersWithUser(db){
        return db
        .from('users')
        .select('*')
        .innerJoin('orders', 'orders.user_id', 'users.id')
        .returning('*')
        .orderBy('users.id', 'desc')
    },
    //works
    getCompletedOrders(db){
        return db
        .from('users')
        .select('*')
        .innerJoin('orders', 'orders.user_id', 'users.id')
        .where('completed', true)
        .returning('*')
        .orderBy('readydate', 'asc')
    },
    //works
    getUnfinishedOrders(db){
        return db
        .from('users')
        .select('*')
        .innerJoin('orders', 'orders.user_id', 'users.id')
        .where('completed', false)
        .returning('*')
        .orderBy('readydate', 'asc')
    },
    //works
    insertUser(db, user){
        return db
        .insert(user)
        .into('users')
        .returning('*')
        .then(rows => {
            return rows[0] 
          })
    },
    //works
    insertOrder(db, order){
        return db
        .insert(order)
        .into('orders')
        .returning('*')
        .then(rows => rows[0])
    },
    //works
    insertItems(db, items){
        return db
        .insert(items)
        .into('order_item')
        .returning('*')
        .then(rows => rows[0])
    },
    completeOrder(db, id){ //need help with this function 
        return db('orders')
        .where('user_id', id)
        .update('completed', true)
    },
    serializeOrder(order){ //need help 
        return order.map(this.serializeOrder)
    },
    //works
    async addOrder(db, user, order, items){
        const dbUser = await OrderService.insertUser(db, user)
        const dbOrder = await OrderService.insertOrder(db, {...order, user_id: dbUser.id, completed: false})
        const dbItems = await OrderService.insertItems(db, items.map(x => ({...x, order_id: dbOrder.id})))
        return {dbUser, order: {...dbOrder, dbItems}}
    }

}

module.exports = OrderService