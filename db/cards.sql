DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS decks;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
	id serial PRIMARY KEY,
	email text NOT NULL,
	username text NOT NULL UNIQUE,
	password text NOT NULL
);

CREATE TABLE decks
(
	id serial,
	name text PRIMARY KEY,
	users_id INT NOT NULL REFERENCES users
);

CREATE TABLE cards
(
	mtg_cards text NOT NULL,
	deck_name text NOT NULL REFERENCES decks(name)
);

INSERT INTO users
VALUES(1, 'demo@demo.com', 'username', 'password123');
INSERT INTO decks
VALUES(1, 'deck name', 1);
INSERT INTO cards
VALUES('[lots of cards]', 'deck name');
