const helpers = {
    makeUserArray(){
        return [
            {
                id: 1,
                first_name: 'Jane',
                last_name: 'Doe',
                email: 'janeDoe@gmail.com',
                phone_number: '1234567899'
            },
            {
                id: 2,
                first_name: 'John',
                last_name: 'Doe',
                email: 'johnDoe@gmail.com',
                phone_number: '12346546788'
            },
            {
                id: 3,
                first_name: 'Taylow',
                last_name: 'Swift',
                email: 'taylorSwift@gmail.com',
                phone_number: '9871232736'
            },
        ]
    },
    makeOrderArray(){
        return [
            {
                id: 1,
                user_id: 1,
                readydate: '10/12/2020',
                total: 30,
                completed: false
            },
            {
                id: 2,
                user_id: 2,
                readydate: '10/14/2020',
                total: 20,
                completed: false
            },
            {
                id: 3,
                user_id: 3,
                readydate: '10/17/2020',
                total: 50,
                completed: false
            },
        ]
    },
    makeCompletedOrderArray(){
        return [
            {
                id: 1,
                user_id: 1,
                readydate: '10/12/2020',
                total: 30,
                completed: true
            },
            {
                id: 2,
                user_id: 2,
                readydate: '10/14/2020',
                total: 20,
                completed: true
            },
            {
                id: 3,
                user_id: 3,
                readydate: '10/17/2020',
                total: 50,
                completed: true
            },
        ]

    },
    makeItemArray(){
        return [
            {
                id: 1,
                order_id: 1,
                type: 'cake',
                order_specs: 'vanilla-cake, vanilla-frosting, 12-serving', 
                cost: 15,
                notes: 'three layer cake with strawberry filling',
                theme: 'wedding'
            },
            {
                id: 2,
                order_id: 1, 
                type: 'cupcakes', 
                order_specs: 'red-velvet-cake, cream-cheese-frosting, 1-dozen', 
                cost: 15, 
                notes: 'add sprinkles', 
                theme: 'wedding'
            },
            {
                id: 3,
                order_id: 2,
                type: 'cookies', 
                order_specs: 'sugar, 1-dozen', 
                cost: 10,
                notes: '',
                theme: 'kid-birthday'
            },
            {
                id: 4,
                order_id: 2,
                type: 'cake', 
                order_specs: 'lemon-cake, lemon-frosting, 24-serving',
                cost: 10,
                notes: 'dinosaur theme',
                theme: 'kid-birthday'
            },
            {
                id: 5,
                order_id: 3,
                type: 'cupcakes',
                order_specs: 'red-velvet-cake, cream-cheese-frosing, 2-dozen', 
                cost: 20, 
                notes: '',
                theme: 'christmas'
            },
            {
                id: 6,
                order_id: 3,
                type: 'cake', 
                order_specs: 'german-chocoalte-cake, german-chocolate-frosting, 12-serving', 
                cost: 20, 
                notes: '2 layer cake', 
                theme: 'christmas'

            },
            {
                id: 7,
                order_id: 3,
                type: 'cookies', 
                order_specs: 'sugar, 1-dozen', 
                cost: 10,
                notes: '',
                theme: 'christmas'
            }
        ]
    },
    makeOrderFixtures(){
        const testUsers = helpers.makeUserArray()
        const testOrders = helpers.makeOrderArray()
        const testItems = helpers.makeItemArray()
    
        return {testUsers, testOrders, testItems}
    },
    cleanTables(db){
        return db.raw(
            `TRUNCATE
                order_item,
                orders,
                users
              RESTART IDENTITY CASCADE`
          )
        
    },
    seedUsers(db, users){
        return db.into('users').insert(users)
    },
    seedOrderTables(db, users, orders, items){
        return db.transaction(async trx => {
            await helpers.seedUsers(trx, users)
            await trx.into('orders').insert(orders)
            await trx.into('order_item').insert(items)
             // update the auto sequence to match the forced id values
    })
    },
    createNewOrder(){
        const user={
            "first_name": 'testName',
            "last_name": 'testLastName',
            "email": 'testEmail',
            "phone_number": 'testNumber'
        }

        const order={
            "readydate": '2020-10-12',
            "total": 30
        }

        const items= [
            {
                "type": 'cake',
                "order_specs": {
                    "serving-size": 12
                },
                "theme": 'wedding',
                "notes": '',
                "cost": 15,    
            },
            {
                "type": 'cookies',
                "order_specs": {
                    "quantity": 2
                },
                "theme": 'wedding',
                "notes": '',
                "cost": 15,    
            }

        ]

        return {user, order, items}
    }      

    
}

module.exports = helpers