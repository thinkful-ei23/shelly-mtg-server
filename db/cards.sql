DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS decks;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
	id serial PRIMARY KEY,
	username text NOT NULL UNIQUE,
	password text NOT NULL
);

CREATE TABLE decks
(
	id serial PRIMARY KEY,
	name text NOT NULL,
	users_id INT NOT NULL REFERENCES users
);

CREATE TABLE cards
(
	mtg_cards text NOT NULL,
	unique_url text NOT NULL,
	decks_id INT NOT NULL REFERENCES decks
);