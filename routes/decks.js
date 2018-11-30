const express = require('express');
const knex = require('../knex');

const router = express.Router();

// router.get('/:uniqueUrl', function(req, res, next) {
// 	console.log('backend');
// 	const unique_url = req.params.uniqueUrl;
// 	knex
// 		.first('mtg_cards')
// 		.from('cards')
// 		.where('unique_url', unique_url)
// 		.then(result => res.json(result))
// 		.catch(err => next(err));
// });

router.get('/', function(req, res, next) {
	console.log('deck request');
	// const userId = req.body.username;
	const userId = 'test-user-4';
	// console.log(userId);
	// let user;
	knex('users')
		.where('username', userId)
		.then(result => {
			console.info(result);
			return knex
				.select('name', 'id')
				.from('decks')
				.where('users_id', result[0].id);
		})
		.then(results => {
			console.log(results);
			res.json(results);
		})
		.catch(err => next(err));
});

router.get('/cards', function(req, res, next) {
	// console.log('req.body', req.body);
	const deckId = Math.floor(Math.random() * 4) + 1;
	// const { deckname } = req.body;
	// const name = deckname;
	// let user;
	knex('cards')
		.where('decks_id', deckId)
		// .select('users_id')
		.then(result => {
			console.log(result);
			res.json(result);
		})
		.catch(err => next(err));
});

router.post('/cards', function(req, res, next) {
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
