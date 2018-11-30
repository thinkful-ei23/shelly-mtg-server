const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/:uniqueUrl', function(req, res, next) {
	console.log('backend');
	const unique_url = req.params.uniqueUrl;
	knex
		.first('mtg_cards')
		.from('cards')
		.where('unique_url', unique_url)
		.then(result => res.json(result))
		.catch(err => next(err));
});

router.get('/', function(req, res, next) {
	// console.log('req.body', req);
	// const userId = req.body.username;
	const userId = 'test-user-4';
	// let user;
	knex('users')
		.where('username', userId)
		// .select('users_id')
		.then(result => {
			console.log(result[0]);
			return knex
				.select('name')
				.select('name')
				.from('decks')
				.where('users_id', result[0].id);
		})
		.then(results => {
			console.log(results);
			res.json(results);
		})
		.catch(err => next(err));
});

router.post('/', function(req, res, next) {
	console.log(req.body);
	const { mtg_cards, unique_url } = req.body;
	// console.info(req.body);
	const newCard = {
		mtg_cards,
		unique_url,
		decks_id: 2
	};
	// console.info(newCard);
	if (newCard.mtg_cards === '[]') {
		const err = new Error('Please add a card');
		err.status = 400;
		return next(err);
	}
	knex('cards')
		.insert(newCard)
		.into('cards')
		.returning(['unique_url'])
		.then(card => {
			res.json(card[0]);
		})
		.catch(err => {
			next(err);
		});
});

module.exports = router;
