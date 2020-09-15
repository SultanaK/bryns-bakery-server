BEGIN;

TRUNCATE
    order_item,
    orders,
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users (first_name, last_name, email, phone_number)
VALUES
('Jane', 'Doe', 'janeDoe@gmail.com', '123-456-7893'),
('John', 'Doe', 'johnDoe@gmail.com', '987-654-3213'),
('Taylor', 'Swift', 'taylorSwift@gmail.com', '564-839-2939');

INSERT INTO orders (user_id, readydate, total, completed)
VALUES
    (1, '10/12/2020', 30, false),
    (2, '10/15/2020', 20, false),
    (3, '10/30/2020', 50, false);

INSERT INTO order_item (order_id, type, order_specs, cost, notes, theme)
VALUES
    (1, 'cake', 'vanilla-cake, vanilla-frosting, 12-serving', 15, 'three layer cake with strawberry filling', 'wedding'),
    (1, 'cupcakes', 'red-velvet-cake, cream-cheese-frosting, 1-dozen', 15, 'add sprinkles', 'wedding'),
    (2, 'cookies', 'sugar, 1-dozen', 10, '', 'kid-birthday'),
    (2, 'cake', 'lemon-cake, lemon-frosting, 24-serving', 10, 'dinosaur theme', 'kid-birthday'),
    (3, 'cupcakes', 'red-velvet-cake, cream-cheese-frosing, 2-dozen', 20, '', 'christmas'),
    (3, 'cake', 'german-chocoalte-cake, german-chocolate-frosting, 12-serving', 20, '2 layer cake', 'christmas'),
    (3, 'cookies', 'sugar, 1-dozen', 10, '', 'christmas');

COMMIT;

