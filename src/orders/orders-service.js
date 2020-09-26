const xss = require('xss')
const cfg = require('../config')
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

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
    getUserFromOrder(db, user_id){
        return db
        .from('users')
        .select('*')
        .where('id', user_id)
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
    //works
    completeOrder(db, id){ //need help with this function 
       return db('orders')
        .where('user_id', id)
        .update('completed', true)
        .returning('*')
    },
    //works
    sendEmail(message){
        let transporter = nodemailer.createTransport({
            service: "yahoo",
            secure: true,
            auth: {
              user: cfg.EMAIL,
              pass: cfg.EMAIL_PASS,
            },
          });

          transporter
          .sendMail(message)
          .then((res) => res)
          .catch((error) => console.error(error));      

    },
    //works
    sendConfimationEmail(order){
        const response = {
            body: {
                name: order.dbUser.first_name,
                intro: [`Thank you for your order!`, `We are looking it over and if we have any question we will reach out to you!
                You will recieve an email once your order is ready!`],
                signature: 'Cheers'
            }
        }

        let MailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Bryns Sweet Creations',
            link: cfg.MAIN_URL,
            }
        });


        let mail = MailGenerator.generate(response);

        let message = {
            from: cfg.EMAIL,
            to: order.dbUser.email,
            subject: "Order Confirmation",
            html: mail,
        };

        return OrderService.sendEmail(message)
    },
    //works
    sendCompletedEmail(db, order){
        let MailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Bryns Sweet Creations',
                link: cfg.MAIN_URL,
                }
            });
    
        OrderService.getUserFromOrder(db, order[0].user_id)
        .then(user => {
            const response = {
                body: {
                    name: user[0].first_name,
                    intro: [`Your order is completed!`, 'Come pick it up at your earliest convience!'],
                    address: '123 Park Avenue, Cuero, Texas',
                    signature: 'Cheers!'
                }
            }
            let mail = MailGenerator.generate(response);
            let message = {
            from: cfg.EMAIL,
                to: user[0].email,
                subject: "Order Completion",
                html: mail,
            };

            return OrderService.sendEmail(message)
        })
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