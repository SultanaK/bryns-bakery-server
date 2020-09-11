BEGIN;

TRUNCATE
    users
    user_orders
    RESTART IDENTITY CASCADE;

INSERT INTO users (first_name, last_name, email, phone)
VALUES
('Jane', 'Doe', 'janeDoe@gmail.com', '123-456-7893'),
('John', 'Doe', 'johnDoe@gmail.com', '987-654-3213'),
('Taylor', 'Swift', 'taylorSwift@gmail.com', '564-839-2939');

INSERT INTO orders (order_specs, theme, notes, readyDate, cost, user_id)
VALUES
    ('cake, vanilla-cake, vanilla-frosting, 12-serving', 'wedding', 'three layer cake with strawberry filling', '10/30/2020', 10, 1),
    ('cupcakes, red-velvet-cake, cream-cheese-frosting, 1-dozen', 'adult-birthday', 'add sprinkles', '10/30/2020', 15, 1),
    ('cookies, sugar, 1-dozen', 'christmas', '12/12/2020', 20, 2),
    ('cake, lemon-cake, lemon-frosting, 24-serving', 'kid-birthday', 'dinosaur theme', 20, 3);

COMMIT;

